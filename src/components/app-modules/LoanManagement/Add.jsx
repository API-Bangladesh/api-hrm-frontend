import React, { useState } from "react";
import useSWR from "swr";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  Modal,
  TextInput,
  Button,
  Select,
  Group,
  Grid,
  NumberInput,
  Checkbox,
} from "@mantine/core";
import { toast } from "react-toastify";
import { submit } from "@/lib/submit";
import { fetcher } from "@/lib/fetch";
import { formatDateToYYYYMMDD, getFullName } from "@/lib/helper";
import UserSelectItem from "@/components/utils/UserSelectItem";

const Index = ({ opened, close, mutate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      user: null,
      loan_type: "",
      reason: "",
      amount: null,
      disbursement_type: "",
      disbursement_date: null,
      no_of_installment: null,
      installment_start_from: null,
    },
    validate: {
      // title: (value) => (!value ? "Title is required" : null),
    },
  });

  const {
    data: employeesData,
    error: employeesError,
    isLoading: isEmployeesLoading,
  } = useSWR(`/api/user/get-employee/`, fetcher, {
    errorRetryCount: 2,
    keepPreviousData: true,
  });

  const employees = employeesData?.data?.result?.map((item) => ({
    // label: getFullName(item?.first_name, item?.last_name),
    label: [getFullName(item?.first_name, item?.last_name), item?.official_id]
      .filter(Boolean)
      .join(" - "),
    firstName: item?.first_name || "",
    lastName: item?.last_name || "",
    officialID: item?.official_id,
    image: item?.photo,
    value: item?.id.toString() || "",
  }));

  const handleSubmit = async (values) => {
    const updatedValues = {
      ...values,
      disbursement_date: formatDateToYYYYMMDD(values.disbursement_date),
      installment_start_from: formatDateToYYYYMMDD(
        values.installment_start_from
      ),
    };
    setIsSubmitting(true);

    try {
      const response = await submit(
        "/api/payroll/add-loanmaster/",
        updatedValues
      );

      if (response?.status === "success") {
        // console.log(response);
        setIsSubmitting(false);
        form.reset();
        close();
        mutate();
        toast.success("Loan request created successfully");
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

  return (
    <Modal
      classNames={{
        title: "modalTitle",
        header: "modalHeader",
      }}
      opened={opened}
      title="Create Advance Salary"
      onClose={close}
      centered
      size="xl"
      padding="40px"
    >
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Grid>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <TextInput
              label="Title"
              placeholder="Title"
              required
              disabled={isSubmitting}
              {...form.getInputProps("title")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Select
              label="Employee"
              placeholder="Pick value"
              searchable
              nothingFoundMessage="Nothing found..."
              data={employees}
              {...form.getInputProps("user")}
              renderOption={UserSelectItem}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <TextInput
              label="Reason"
              placeholder="Reason"
              required
              disabled={isSubmitting}
              {...form.getInputProps("reason")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Select
              label="Type"
              placeholder="Pick value"
              data={["Advance Salary", "Loan", "Fine"]}
              required
              disabled={isSubmitting}
              {...form.getInputProps("loan_type")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <NumberInput
              label="Amount"
              rightSection={<></>}
              rightSectionWidth={0}
              placeholder="Amount"
              required
              disabled={isSubmitting}
              {...form.getInputProps("amount")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Select
              label="Adjustment Type"
              placeholder="Pick value"
              data={["From Salary", "By Cash"]}
              required
              disabled={isSubmitting}
              {...form.getInputProps("disbursement_type")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <NumberInput
              label="Total Installment"
              rightSection={<></>}
              rightSectionWidth={0}
              placeholder="Total Installment"
              required
              disabled={isSubmitting}
              {...form.getInputProps("no_of_installment")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <NumberInput
              disabled
              label="Instalment Amount"
              rightSection={<></>}
              rightSectionWidth={0}
              placeholder="0"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <DateInput
              valueFormat="DD MMM YYYY"
              label="Disbursement Date"
              placeholder="DD MMM YYYY"
              required
              disabled={isSubmitting}
              {...form.getInputProps("disbursement_date")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <DateInput
              valueFormat="DD MMM YYYY"
              label="Installment Starts From"
              placeholder="DD MMM YYYY"
              required
              disabled={isSubmitting}
              {...form.getInputProps("installment_start_from")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Checkbox label="Repayment Completed" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <DateInput
              disabled
              valueFormat="DD MMM YYYY"
              label="Repayment Completion Date"
              placeholder="DD MMM YYYY"
            />
          </Grid.Col>
        </Grid>

        <Group justify="flex-end" mt={"xl"}>
          <Button type="submit">Save</Button>
        </Group>
      </form>
    </Modal>
  );
};

export default Index;
