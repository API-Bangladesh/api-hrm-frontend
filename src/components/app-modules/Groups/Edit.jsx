import React, { useState, useEffect } from "react";
import { useForm } from "@mantine/form";
import { Modal, TextInput, Button, Group, Grid } from "@mantine/core";
import { toast } from "react-toastify";
import { update } from "@/lib/submit";

const Index = ({ opened, close, item, setItem, mutate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      description: "",
    },
    validate: {
      title: (value) => (!value ? "Title is required" : null),
    },
  });

  useEffect(() => {
    if (item) {
      form.setValues({
        title: item.title || "",
        description: item.description || "",
      });
    }
  }, [item]);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      const response = await update(
        `/api/device/update-group/${item.id}`,
        values
      );

      if (response?.status === "success") {
        setIsSubmitting(false);
        close();
        mutate();
        toast.success("Group updated successfully");
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
      title="Edit Group"
      onClose={() => {
        setItem(null);
        close();
      }}
      centered
      size="md"
      padding="40px"
    >
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Grid>
          <Grid.Col span={12}>
            <TextInput
              mb="sm"
              label="Group Title"
              placeholder="Group Title"
              required={true}
              disabled={isSubmitting}
              {...form.getInputProps("title")}
            />
            <TextInput
              mb="sm"
              label="Description"
              placeholder="Description"
              disabled={isSubmitting}
              {...form.getInputProps("description")}
            />
          </Grid.Col>
        </Grid>

        <Group justify="flex-end" mt="md">
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
  );
};

export default Index;
