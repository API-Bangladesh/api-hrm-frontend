import React, { useState, useEffect, useRef } from "react";
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
import { update } from "@/lib/submit";
import { formatTime } from "@/lib/helper";

const Index = ({ opened, close, item, setItem, mutate }) => {
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

  useEffect(() => {
    if (item) {
      form.setValues({
        name: item.name || "",
        in_time: item.in_time || "",
        out_time: item.out_time || "",
        late_in_tolerance_time: item.late_in_tolerance_time || 0,
        early_leave_tolerance_time: item.early_leave_tolerance_time || 0,
      });
    }
  }, [item]);

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
      const response = await update(
        `/api/user/update-shift/${item.id}`,
        formattedValues
      );

      if (response?.status === "success") {
        // console.log(response);
        setIsSubmitting(false);
        close();
        mutate();
        toast.success("Shift updated successfully");
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
    <Modal
      classNames={{
        title: "modalTitle",
        header: "modalHeader",
      }}
      opened={opened}
      title="Edit Shift"
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
              label="Title"
              placeholder="Title"
              mb="sm"
              required={true}
              disabled={isSubmitting}
              {...form.getInputProps("name")}
            />

            <TimeInput
              mb="sm"
              label="Start Time"
              required={true}
              disabled={isSubmitting}
              ref={refTimeIn}
              rightSection={timeIn}
              {...form.getInputProps("in_time")}
            />

            <TimeInput
              mb="sm"
              label="End Time"
              required={true}
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
            Update
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default Index;
