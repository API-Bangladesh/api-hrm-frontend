import React, { useState } from "react";
import { useForm } from "@mantine/form";
import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Select,
  Group,
  NumberInput,
  Checkbox,
} from "@mantine/core";
import { toast } from "react-toastify";
import { submit } from "@/lib/submit";

const Index = ({ opened, close, mutate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      description: "",
      amount_type: null,
      amount: 0,
      is_taxable: false,
      depends_on_attendance: false,
      is_recurring: false,
    },
    validate: {
      title: (value) => (!value ? "Title is required" : null),
    },
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      const response = await submit("/api/payroll/add-payrollearning/", values);

      if (response?.status === "success") {
        setIsSubmitting(false);
        form.reset();
        close();
        mutate();
        toast.success("Allowance created successfully");
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
      title="Create Allowance"
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
          required={true}
          disabled={isSubmitting}
          {...form.getInputProps("title")}
        />
        <Textarea
          mb="sm"
          label="Description"
          placeholder="Description"
          // required={true}
          disabled={isSubmitting}
          {...form.getInputProps("description")}
        />
        <Select
          mb="sm"
          label="Amount Type"
          placeholder="Amount Type"
          data={["Fixed Amount", "Percentage"]}
          required={true}
          disabled={isSubmitting}
          {...form.getInputProps("amount_type")}
        />
        <NumberInput
          mb="md"
          label="Amount"
          rightSection={<></>}
          rightSectionWidth={0}
          placeholder="Amount"
          required={true}
          disabled={isSubmitting}
          {...form.getInputProps("amount")}
        />
        <Checkbox
          mb="sm"
          label="Is Taxable"
          disabled={isSubmitting}
          {...form.getInputProps("is_taxable", { type: "checkbox" })}
        />
        <Checkbox
          mb="sm"
          label="Depends on Attendance"
          disabled={isSubmitting}
          {...form.getInputProps("depends_on_attendance", { type: "checkbox" })}
        />
        <Checkbox
          label="Is Recurring?"
          disabled={isSubmitting}
          {...form.getInputProps("is_recurring", { type: "checkbox" })}
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
