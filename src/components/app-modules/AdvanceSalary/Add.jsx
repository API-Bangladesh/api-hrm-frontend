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
  NumberInput,
} from "@mantine/core";
import { toast } from "react-toastify";
import { submit } from "@/lib/submit";
import { fetcher } from "@/lib/fetch";
import { formatDateToYYYYMMDD } from "@/lib/helper";

const Index = ({ opened, close, mutate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      // user: 4,
      loan_type: "",
      reason: "",
      amount: null,
      disbursement_type: "",
      no_of_installment: null,
    },
    validate: {
      // title: (value) => (!value ? "Title is required" : null),
    },
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      const response = await submit("/api/payroll/add-loanmaster/", values);

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
      size="md"
      padding="40px"
    >
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <TextInput
          mb="sm"
          label="Title"
          placeholder="Title"
          required
          disabled={isSubmitting}
          {...form.getInputProps("title")}
        />
        <Select
          mb="sm"
          label="Type"
          placeholder="Loan Type"
          data={["Advance Salary", "Loan"]}
          required
          disabled={isSubmitting}
          {...form.getInputProps("loan_type")}
        />
        <TextInput
          mb="sm"
          label="Reason"
          placeholder="Reason"
          required
          disabled={isSubmitting}
          {...form.getInputProps("reason")}
        />
        <NumberInput
          mb="md"
          label="Amount"
          rightSection={<></>}
          rightSectionWidth={0}
          placeholder="Amount"
          required
          disabled={isSubmitting}
          {...form.getInputProps("amount")}
        />
        <Select
          mb="sm"
          label="Adjustment Type"
          placeholder="Pick value"
          data={["From Salary", "By Cash"]}
          required
          disabled={isSubmitting}
          {...form.getInputProps("disbursement_type")}
        />
        <NumberInput
          mb="md"
          label="Total Installment"
          rightSection={<></>}
          rightSectionWidth={0}
          placeholder="Total Installment"
          required
          disabled={isSubmitting}
          {...form.getInputProps("no_of_installment")}
        />
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
  );
};

export default Index;
