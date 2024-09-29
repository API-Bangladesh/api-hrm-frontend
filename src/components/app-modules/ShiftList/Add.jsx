import React, { useState, useRef } from "react";
import { useForm } from "@mantine/form";
import {
  Modal,
  TextInput,
  Button,
  Group,
  NumberInput,
  ActionIcon,
  Grid,
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { IoTimeOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { submit } from "@/lib/submit";
import { formatTime } from "@/lib/helper";

const Index = ({ opened, close, mutate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      in_time: "",
      out_time: "",
      late_in_tolerance_time: 0,
      early_leave_tolerance_time: 0,
    },
    validate: {
      name: (value) => (!value ? "Title is required" : null),
      in_time: (value) => {
        if (!value) return "Start time is required";
        if (isNaN(new Date(`1970-01-01T${value}`))) return "Invalid start time";
        return null;
      },
      out_time: (value, values) => {
        if (!value) return "End time is required";
        if (isNaN(new Date(`1970-01-01T${value}`))) return "Invalid end time";
        if (
          new Date(`1970-01-01T${value}`) <=
          new Date(`1970-01-01T${values.in_time}`)
        ) {
          return "End time must be later than start time";
        }
        return null;
      },
      late_in_tolerance_time: (value) => {
        if (value < 0) return "Late in tolerance time cannot be negative";
        return null;
      },
      early_leave_tolerance_time: (value) => {
        if (value < 0) return "Early leave tolerance time cannot be negative";
        return null;
      },
    },
  });

  const refTimeIn = useRef(null);
  const refTimeOut = useRef(null);

  const timeIn = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => refTimeIn.current?.showPicker()}
    >
      <IoTimeOutline />
    </ActionIcon>
  );

  const timeOut = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => refTimeOut.current?.showPicker()}
    >
      <IoTimeOutline />
    </ActionIcon>
  );

  const handleSubmit = async (values) => {
    const formattedValues = {
      ...values,
      in_time: formatTime(values.in_time),
      out_time: formatTime(values.out_time),
    };

    setIsSubmitting(true);

    try {
      const response = await submit(`/api/user/add-shift/`, formattedValues);

      if (response?.status === "success") {
        setIsSubmitting(false);
        form.reset();
        close();
        mutate();
        toast.success("Shift created successfully");
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
      title="Add Shift"
      onClose={close}
      centered
      size="md"
      padding="40px"
    >
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Grid>
          <Grid.Col span={12}>
            <TextInput
              label="Title"
              placeholder="Title"
              mb="sm"
              required
              disabled={isSubmitting}
              {...form.getInputProps("name")}
            />

            <TimeInput
              mb="sm"
              label="Start Time"
              required
              disabled={isSubmitting}
              ref={refTimeIn}
              rightSection={timeIn}
              {...form.getInputProps("in_time")}
            />

            <TimeInput
              mb="sm"
              label="End Time"
              required
              disabled={isSubmitting}
              ref={refTimeOut}
              rightSection={timeOut}
              {...form.getInputProps("out_time")}
            />

            <NumberInput
              mb="sm"
              label="Late In Tolerance"
              placeholder="Late In Tolerance"
              hideControls
              disabled={isSubmitting}
              {...form.getInputProps("late_in_tolerance_time")}
            />

            <NumberInput
              label="Early Leave Tolerance"
              placeholder="Early Leave Tolerance"
              hideControls
              disabled={isSubmitting}
              {...form.getInputProps("early_leave_tolerance_time")}
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
