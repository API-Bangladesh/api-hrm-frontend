import React, { useState } from "react";
import { useForm } from "@mantine/form";
import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Select,
  Group,
  Checkbox,
} from "@mantine/core";
import { toast } from "react-toastify";
import { submit } from "@/lib/submit";

const Index = ({ opened, close, mutate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      description: "",
      allocation_days: 1,
      max_consecutive_days: 1,
      leave_type: null,
      is_optional: false,
      is_calendar_day: false,
      require_attachment: false,
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
    },
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      const response = await submit("/api/leave/add-leavepolicy/", values);

      if (response?.status === "success") {
        setIsSubmitting(false);
        form.reset();
        close();
        mutate();
        toast.success("Leave Policy created successfully");
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
    <>
      <Modal
        classNames={{
          title: "modalTitle",
          header: "modalHeader",
        }}
        opened={opened}
        title="Add Leave Policy"
        onClose={close}
        centered
        size="md"
        padding="40px"
      >
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            label="Name"
            placeholder="Name"
            required={true}
            disabled={isSubmitting}
            {...form.getInputProps("name")}
          />
          <TextInput
            mt="md"
            label="Description"
            placeholder="Description"
            // required={true}
            disabled={isSubmitting}
            {...form.getInputProps("description")}
          />
          <TextInput
            mt="md"
            label="Allocation Days"
            placeholder="Allocation Days"
            required={true}
            disabled={isSubmitting}
            {...form.getInputProps("allocation_days")}
          />
          <TextInput
            mt="md"
            label="Max Consecutive Days"
            placeholder="max_consecutive_days"
            required={true}
            disabled={isSubmitting}
            {...form.getInputProps("max_consecutive_days")}
          />
          <Select
            mt="md"
            label="Leave Type"
            placeholder="Leave Type"
            data={["Paid", "Non Paid"]}
            required={true}
            disabled={isSubmitting}
            {...form.getInputProps("leave_type")}
          />

          <Checkbox
            mt="md"
            label="Is Optional?"
            variant="outline"
            disabled={isSubmitting}
            {...form.getInputProps("is_optional", { type: "checkbox" })}
          />
          <Checkbox
            mt="md"
            label="Is Calendar Day?"
            variant="outline"
            disabled={isSubmitting}
            {...form.getInputProps("is_calendar_day", { type: "checkbox" })}
          />
          <Checkbox
            mt="md"
            label="Require Attachment?"
            variant="outline"
            disabled={isSubmitting}
            {...form.getInputProps("require_attachment", { type: "checkbox" })}
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
    </>
  );
};

export default Index;
