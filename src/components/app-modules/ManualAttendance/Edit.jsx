import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { useForm } from "@mantine/form";
import { DateInput, DateTimePicker } from "@mantine/dates";
import {
  Modal,
  Textarea,
  Button,
  Select,
  Group,
  // ActionIcon,
} from "@mantine/core";
// import { IoTimeOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { update } from "@/lib/submit";
import { fetcher } from "@/lib/fetch";
import UserSelectItem from "@/components/utils/UserSelectItem";
import {
  getFullName,
  formatDateToYYYYMMDD,
  formatTimeFromDateTime,
} from "@/lib/helper";

const Index = ({ opened, close, item, setItem, mutate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      // employee_id: "",
      requested_by: "",
      date: null,
      in_time: null,
      out_time: null,
      reason: "",
    },
    validate: {
      // employee_id: (value) => (!value ? "Employee is required" : null),
      requested_by: (value) => (!value ? "Employee is required" : null),
      date: (value) => (!value ? "Date is required" : null),
      in_time: (value, values) =>
        !value && !values.out_time ? "In time is required" : null,
      out_time: (value, values) =>
        !value && !values.in_time ? "Out time is required" : null,
      // admin_note: (value) => (!value ? "Reason is required" : null),
    },
  });

  useEffect(() => {
    if (item) {
      form.setValues({
        requested_by: item?.requested_by?.id?.toString() || "",
        date: item?.date ? new Date(item.date) : null,
        // in_time: item?.in_time || null,
        // out_time: item?.out_time || null,
        reason: item?.reason || "",
      });
    }
  }, [item]);

  const {
    data,
    error,
    isLoading: isFetchLoading,
  } = useSWR(`/api/user/get-employee/`, fetcher, {
    errorRetryCount: 2,
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const employees = data?.data.result.map((item) => ({
    label: [getFullName(item?.first_name, item?.last_name), item?.official_id]
      .filter(Boolean)
      .join(" - "),
    firstName: item?.first_name || "",
    lastName: item?.last_name || "",
    officialID: item?.official_id,
    image: item?.photo,
    value: item?.id.toString() || "",
  }));

  // const refInTime = useRef(null);

  // const inTime = (
  //   <ActionIcon
  //     variant="subtle"
  //     color="gray"
  //     onClick={() => refInTime.current?.showPicker()}
  //   >
  //     <IoTimeOutline />
  //   </ActionIcon>
  // );

  // const refOutTime = useRef(null);

  // const outTime = (
  //   <ActionIcon
  //     variant="subtle"
  //     color="gray"
  //     onClick={() => refOutTime.current?.showPicker()}
  //   >
  //     <IoTimeOutline />
  //   </ActionIcon>
  // );

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      const formattedDate = formatDateToYYYYMMDD(values.date);
      const formattedInTime = formatTimeFromDateTime(values.in_time);
      const formattedOutTime = formatTimeFromDateTime(values.out_time);

      const formattedValues = {
        ...values,
        date: formattedDate,
        in_time: formattedInTime,
        out_time: formattedOutTime,
      };

      const response = await update(
        `/api/attendance/update-manual-attendance/${item?.id}`,
        formattedValues
      );

      if (response?.status === "success") {
        setIsSubmitting(false);
        // form.reset();
        close();
        mutate();
        toast.success("Attendance updated successfully");
      } else {
        setIsSubmitting(false);
        if (response?.status === "error" && Array.isArray(response.message)) {
          response.message.forEach((msg) => {
            toast.error(msg);
          });
        } else {
          toast.error("Error submitting form");
        }
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
        }}
        opened={opened}
        title="Edit Attendance"
        onClose={() => {
          setItem(null);
          close();
        }}
        centered
      >
        <form
          onSubmit={form.onSubmit(
            (values) => handleSubmit(values),
            handleError
          )}
        >
          <Select
            mb="sm"
            label="Employee"
            placeholder="Employee"
            required
            disabled={isSubmitting}
            data={employees}
            searchable
            nothingFoundMessage="Nothing found..."
            {...form.getInputProps("requested_by")}
            key={form.key("requested_by")}
            renderOption={UserSelectItem}
          />
          <DateInput
            mb="sm"
            valueFormat="DD MMM YYYY"
            label="Date"
            placeholder="DD MMM YYYY"
            required
            disabled={isSubmitting}
            {...form.getInputProps("date")}
            key={form.key("date")}
          />
          <DateTimePicker
            mb="sm"
            label="In Time"
            placeholder="Pick in time"
            valueFormat="DD MMM YYYY hh:mm A"
            clearable
            // ref={refInTime}
            // rightSection={inTime}
            // withSeconds
            required
            disabled={isSubmitting}
            {...form.getInputProps("in_time")}
            key={form.key("in_time")}
          />
          <DateTimePicker
            mb="sm"
            label="Out Time"
            placeholder="Pick out time"
            valueFormat="DD MMM YYYY hh:mm A"
            clearable
            // ref={refOutTime}
            // rightSection={outTime}
            // withSeconds
            required
            disabled={isSubmitting}
            {...form.getInputProps("out_time")}
            key={form.key("out_time")}
          />
          <Textarea
            mb="sm"
            label="Reason"
            placeholder="Reason"
            disabled={isSubmitting}
            {...form.getInputProps("reason")}
          />

          <Group justify="flex-end" mt="sm">
            <Button
              type="submit"
              loading={isSubmitting}
              loaderProps={{ type: "dots" }}
            >
              Update
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default Index;
