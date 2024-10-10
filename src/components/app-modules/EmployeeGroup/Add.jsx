import React, { useState } from "react";
import { useForm } from "@mantine/form";
import { Modal, TextInput, Button, Group, Grid } from "@mantine/core";
import { toast } from "react-toastify";
import { submit } from "@/lib/submit";

const Index = ({ opened, close, mutate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
    },
    validate: {
      name: (value) => (!value ? "Name is required" : null),
    },
  });

  const handleSubmit = async (values) => {
    // e.preventDefault();
    // console.log(values);
    // return;

    setIsSubmitting(true);

    try {
      const response = await submit("/api/user/add-ethnicgroup/", values);

      if (response?.status === "success") {
        // console.log(response);
        setIsSubmitting(false);
        form.reset();
        close();
        mutate();
        toast.success("Group created successfully");
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
        title="Add Employee Group"
        onClose={close}
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
                {...form.getInputProps("name")}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="sm">
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
