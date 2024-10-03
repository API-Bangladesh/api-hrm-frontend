import React, { useState } from "react";
import { useForm } from "@mantine/form";
import {
  Modal,
  TextInput,
  Button,
  Group,
  Grid,
  PasswordInput,
  Checkbox,
} from "@mantine/core";
import { toast } from "react-toastify";
import { submit } from "@/lib/submit";
import { validateDeviceIP, validateMACAddress } from "@/lib/validate";

const Index = ({ opened, close, mutate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      username: "",
      password: "",
      location: "",
      macaddress: "",
      deviceip: "",
      is_active: true,
    },
    validate: {
      title: (value) => (!value ? "Title is required" : null),
      username: (value) => (!value ? "Username is required" : null),
      password: (value) => (!value ? "Password is required" : null),
      deviceip: (value) =>
        !value
          ? "Device IP is required"
          : !validateDeviceIP(value)
          ? "Invalid IP address"
          : null,
      macaddress: (value) =>
        value && !validateMACAddress(value)
          ? "Invalid MAC address format"
          : null,
    },
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      const response = await submit("/api/device/add-device/", values);

      if (response?.status === "success") {
        setIsSubmitting(false);
        form.reset();
        close();
        mutate();
        toast.success("Device created successfully");
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
      title="Add Device"
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
              label="Device Title"
              placeholder="Device Title"
              required={true}
              disabled={isSubmitting}
              {...form.getInputProps("title")}
            />
            <TextInput
              mb="sm"
              label="Username"
              placeholder="Username"
              required={true}
              disabled={isSubmitting}
              {...form.getInputProps("username")}
            />
            <PasswordInput
              mb="sm"
              label="Password"
              placeholder="Enter password"
              withAsterisk
              required={true}
              disabled={isSubmitting}
              {...form.getInputProps("password")}
            />
            <TextInput
              mb="sm"
              label="device ip"
              placeholder="device ip"
              required={true}
              disabled={isSubmitting}
              {...form.getInputProps("deviceip")}
            />
            <TextInput
              mb="sm"
              label="MAC Address"
              placeholder="MAC Address"
              // required={true}
              disabled={isSubmitting}
              {...form.getInputProps("macaddress")}
            />
            <TextInput
              mb="sm"
              label="Location"
              placeholder="Location"
              disabled={isSubmitting}
              {...form.getInputProps("location")}
            />
            <Checkbox
              mt="lg"
              label="Active"
              disabled={isSubmitting}
              {...form.getInputProps("is_active", { type: "checkbox" })}
              key={form.key("is_active")}
            />
          </Grid.Col>
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
  );
};

export default Index;
