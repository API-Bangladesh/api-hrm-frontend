import React, { useState } from "react";
import useSWR from "swr";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import {
  Modal,
  TextInput,
  Grid,
  Button,
  Select,
  Group,
  FileInput,
} from "@mantine/core";
import { FiFile } from "react-icons/fi";
import { toast } from "react-toastify";
import { submit } from "@/lib/submit";
import { fetcher, getData } from "@/lib/fetch";
import { getFullName, formatDateToYYYYMMDD } from "@/lib/helper";
import UserSelectItem from "@/components/utils/UserSelectItem";

const Index = ({ opened, close, mutate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leavePolicies, setLeavePolicies] = useState([]);
  const [isExtendExisting, setIsExtendExisting] = useState(false);
  const [totalLeave, setTotalLeave] = useState(0);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      user: "",
      request_type: "",
      leavepolicy: "",
      exchange_with: "",
      from_date: null,
      to_date: null,
      attachment: "",
      reason: "",
    },
    validate: {
      user: (value) => (!value ? "Employee is required" : null),
      request_type: (value) => (!value ? "Request type is required" : null),
      leavepolicy: (value) => (!value ? "Leave type is required" : null),
      // exchange_with: (value, values) =>
      //   values.request_type === "Extend Existing" && !value
      //     ? "Exchange with is required"
      //     : values.request_type === "Extend Existing" &&
      //       value &&
      //       values.leavepolicy === value
      //     ? "Exchange with should not be equal with leave type"
      //     : null,
      exchange_with: (value, values) =>
        values.request_type === "Extend Existing" &&
        value &&
        values.leavepolicy === value
          ? "Exchange with should not be equal with leave type"
          : null,
      from_date: (value) => (!value ? "From date is required" : null),
      to_date: (value) => (!value ? "To date is required" : null),
      attachment: (value) => (!value ? "Attachment is required" : null),
    },
  });

  const {
    data,
    error,
    isLoading: isFetchLoading,
  } = useSWR(`/api/user/get-employee/`, fetcher, {
    errorRetryCount: 2,
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const users = data?.data.result.map((item) => ({
    label: [getFullName(item?.first_name, item?.last_name), item?.official_id]
      .filter(Boolean)
      .join(" - "),
    firstName: item?.first_name || "",
    lastName: item?.last_name || "",
    officialID: item?.official_id,
    image: item?.photo,
    value: item?.id.toString() || "",
  }));

  const fetchLeavePolicies = async (userId, type) => {
    try {
      const response = await getData(
        `/api/leave/get-leavepolicy/?${type}=${userId}`
      );
      console.log(response);

      const leavepolicies = response?.data?.data?.result.map((item) => ({
        label: item?.name.toString() || "",
        value: item?.id.toString() || "",
      }));

      setLeavePolicies(leavepolicies);
    } catch (error) {
      console.error("Error fetching Leave types:", error);
      toast.error("Error fetching Leave types");
    }
  };

  form.watch("user", ({ value, touched, dirty }) => {
    if (value) {
      const request_type = form.getValues().request_type;
      const type = request_type === "New Allocation" ? "exclude_user" : "user";
      fetchLeavePolicies(value, type);
    } else {
      fetchLeavePolicies([]);
    }
    form.setFieldValue("leavepolicy", "");
    form.setFieldValue("exchange_with", "");
  });

  form.watch("request_type", ({ value, touched, dirty }) => {
    const userId = form.getValues().user;
    if (value && userId) {
      const type = value === "New Allocation" ? "exclude_user" : "user";
      fetchLeavePolicies(userId, type);
    } else {
      setLeavePolicies([]);
    }
    form.setFieldValue("leavepolicy", "");
    form.setFieldValue("exchange_with", "");
    setIsExtendExisting(value === "Extend Existing");
  });

  const calculateTotalLeave = (fromDate, toDate) => {
    return (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24) + 1;
  };

  form.watch("from_date", ({ value }) => {
    const fromDate = value;
    const toDate = form.getValues().to_date;
    if (fromDate && toDate) {
      const totalDays = calculateTotalLeave(fromDate, toDate);
      setTotalLeave(totalDays);
    }
  });

  form.watch("to_date", ({ value }) => {
    const toDate = value;
    const fromDate = form.getValues().from_date;
    if (fromDate && toDate) {
      const totalDays = calculateTotalLeave(fromDate, toDate);
      setTotalLeave(totalDays);
    }
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      const formattedFromDate = formatDateToYYYYMMDD(values.from_date);
      const formattedToDate = formatDateToYYYYMMDD(values.to_date);

      const formattedValues = {
        ...values,
        from_date: formattedFromDate,
        to_date: formattedToDate,
      };

      const formValues = new FormData();

      const flattenObject = (obj, prefix = "") => {
        Object.keys(obj).forEach((key) => {
          const value = obj[key];
          const formKey = prefix ? `${prefix}[${key}]` : key;

          if (value && typeof value === "object" && !(value instanceof File)) {
            flattenObject(value, formKey);
          } else {
            formValues.append(formKey, value);
          }
        });
      };

      flattenObject(formattedValues);

      const response = await submit(
        `/api/leave/add-leaverequest/`,
        formValues,
        true
      );

      if (response?.status === "success") {
        // console.log(response);
        setIsSubmitting(false);
        form.reset();
        close();
        mutate();
        toast.success("leave request created successfully");
      } else {
        setIsSubmitting(false);
        toast.error(
          response?.status == "error"
            ? response?.message[0]
            : "Error submitting form"
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    }
  };

  const handleError = (errors) => {
    console.log(errors);
  };

  return (
    <>
      <Modal
        classNames={{
          title: "modalTitle",
          header: "modalHeader",
        }}
        opened={opened}
        title="Leave Request"
        onClose={close}
        centered
        size="xl"
        padding="40px"
      >
        <form
          onSubmit={form.onSubmit(
            (values) => handleSubmit(values),
            handleError
          )}
        >
          <Grid classNames={{ root: "gutterX", col: "gutterCol" }}>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Select
                label="Employee"
                placeholder="Employee"
                required={true}
                disabled={isSubmitting}
                data={users}
                searchable
                // limit={10}
                nothingFoundMessage="Nothing found..."
                {...form.getInputProps("user")}
                key={form.key("user")}
                renderOption={UserSelectItem}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Select
                label="Request Type"
                placeholder="Pick value"
                required={true}
                disabled={isSubmitting}
                data={["Regular Leave", "Extend Existing", "New Allocation"]}
                {...form.getInputProps("request_type")}
                key={form.key("request_type")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Select
                label="Leave Type"
                placeholder="Leave Type"
                required={true}
                disabled={isSubmitting}
                data={leavePolicies}
                searchable
                // limit={10}
                nothingFoundMessage="Nothing found..."
                {...form.getInputProps("leavepolicy")}
                key={form.key("leavepolicy")}
              />
            </Grid.Col>

            {isExtendExisting && (
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Select
                  label="Exchange With (Optional)"
                  placeholder="Pick value"
                  // required
                  disabled={isSubmitting}
                  data={leavePolicies}
                  {...form.getInputProps("exchange_with")}
                  key={form.key("exchange_with")}
                />
              </Grid.Col>
            )}
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <TextInput
                label="Details"
                placeholder="Details"
                disabled={isSubmitting}
                {...form.getInputProps("reason")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <DateInput
                valueFormat="DD MMM YYYY"
                label="From Date"
                placeholder="DD MMM YYYY"
                required
                disabled={isSubmitting}
                {...form.getInputProps("from_date")}
                key={form.key("from_date")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <DateInput
                valueFormat="DD MMM YYYY"
                label="To Date"
                placeholder="DD MMM YYYY"
                required
                disabled={isSubmitting}
                {...form.getInputProps("to_date")}
                key={form.key("to_date")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <TextInput
                disabled
                label="Total Days"
                placeholder="0"
                value={totalLeave}
                // {...form.getInputProps("total_leave")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <FileInput
                leftSection={<FiFile />}
                label="Attachment"
                placeholder="Attachment"
                required
                disabled={isSubmitting}
                leftSectionPointerEvents="none"
                {...form.getInputProps("attachment")}
                key={form.key("attachment")}
              />
            </Grid.Col>
            {/* <Grid.Col span={{ base: 12, lg: 6 }}>
              <TextInput
                label="Details"
                placeholder="Details"
                disabled={isSubmitting}
                {...form.getInputProps("reason")}
              />
            </Grid.Col> */}
          </Grid>

          <Group justify="flex-end" mt="xl">
            <Button
              type="submit"
              loading={isSubmitting}
              loaderProps={{ type: "dots" }}
            >
              Save
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default Index;
