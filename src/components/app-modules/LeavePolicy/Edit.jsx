import React, { useState, useEffect } from "react";
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
import { update } from "@/lib/submit";

const Index = ({ opened, close, item, setItem, mutate }) => {
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

  useEffect(() => {
    if (item) {
      form.setValues({
        name: item.name || "",
        description: item.description || "",
        allocation_days: item.allocation_days || "",
        max_consecutive_days: item.max_consecutive_days || "",
        leave_type: item.leave_type || "",
        is_optional: item.is_optional || false,
        is_calendar_day: item.is_calendar_day || false,
        require_attachment: item.require_attachment || false,
      });
    }
  }, [item]);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      const response = await update(
        `/api/leave/update-leavepolicy/${item.id}`,
        values
      );

      if (response?.status === "success") {
        setIsSubmitting(false);
        close();
        mutate();
        toast.success("Leave policy updated successfully");
      } else {
        toast.error(
          response?.status === "error"
            ? response?.message[0]
            : "Error submitting form"
        );
      }
      setTimeout(() => {
        setIsSubmitting(false);
        mutate();
      }, 500);
    } catch (error) {
      console.error("Error submitting form:", error);
      setTimeout(() => {
        setIsSubmitting(false);
        mutate();
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
        title="Edit Leave Policy"
        onClose={() => {
          setItem(null);
          close();
        }}
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
          <Textarea
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
              Update
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default Index;
