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
    },
    validate: {
      title: (value) => (!value ? "Title is required" : null),
    },
  });

  useEffect(() => {
    if (item) {
      form.setValues({
        title: item.title || "",
      });
    }
  }, [item]);

  const handleSubmit = async (values) => {
    // e.preventDefault();
    // console.log(values);

    setIsSubmitting(true);

    try {
      const response = await update(
        `/api/device/update-group/${item.id}`,
        values
      );

      if (response?.status === "success") {
        // console.log(response);
        setIsSubmitting(false);
        close();
        mutate();
        toast.success("Group updated successfully");
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
        title="Edit Employee Group"
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
                label="Employee Group"
                placeholder="Employee Group"
                required={true}
                disabled={isSubmitting}
                {...form.getInputProps("title")}
              />
            </Grid.Col>
          </Grid>

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
