import React, { useState } from "react";
import { useForm } from "@mantine/form";
import { DateInput, DateTimePicker } from "@mantine/dates";
import {
  Modal,
  Textarea,
  TextInput,
  Button,
  Select,
  Group,
} from "@mantine/core";
import { toast } from "react-toastify";
import { submit } from "@/lib/submit";
import { formatDateToYYYYMMDD, formatTimeFromDateTime } from "@/lib/helper";

const Index = ({ opened, close, mutate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      // requested_by: "",
      date: null,
      in_time: null,
      out_time: null,
      reason: "",
    },
    validate: {
      // requested_by: (value) => (!value ? "Employee is required" : null),
      date: (value) => (!value ? "Date is required" : null),
      in_time: (value, values) =>
        !value && !values.out_time ? "In time is required" : null,
      out_time: (value, values) =>
        !value && !values.in_time ? "Out time is required" : null,
    },
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      const formattedDate = formatDateToYYYYMMDD(values.date);
      const formattedInTime = formatTimeFromDateTime(values.in_time);
      const formattedOutTime = formatTimeFromDateTime(values.out_time);

      const formattedValues = {
        ...values,
        date: formattedDate,
        in_time: formattedInTime,
        out_time: formattedOutTime,
      };

      const response = await submit(
        `/api/attendance/add-manual-attendance/`,
        formattedValues
      );

      if (response?.status === "success") {
        setIsSubmitting(false);
        form.reset();
        close();
        mutate();
        toast.success("Attendance created successfully");
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

  const handleError = (errors) => {
    console.log(errors);
  };

  return (
    <>
      <Modal
        classNames={{
          title: "modalTitle",
          header: "modalHeader",
        }}
        opened={opened}
        title="Add Attendance Request"
        onClose={close}
        centered
        size="md"
        padding="40px"
      >
        <form
          onSubmit={form.onSubmit(
            (values) => handleSubmit(values),
            handleError
          )}
        >
          <DateInput
            mb="sm"
            valueFormat="DD MMM YYYY"
            label="Date"
            placeholder="DD MMM YYYY"
            required
            disabled={isSubmitting}
            {...form.getInputProps("date")}
            key={form.key("date")}
          />
          <DateTimePicker
            mb="sm"
            label="In Time"
            placeholder="Pick in time"
            valueFormat="DD MMM YYYY hh:mm A"
            clearable
            // ref={refInTime}
            // rightSection={inTime}
            // withSeconds
            required
            disabled={isSubmitting}
            {...form.getInputProps("in_time")}
            key={form.key("in_time")}
          />
          <DateTimePicker
            mb="sm"
            label="Out Time"
            placeholder="Pick out time"
            valueFormat="DD MMM YYYY hh:mm A"
            clearable
            // ref={refOutTime}
            // rightSection={outTime}
            // withSeconds
            required
            disabled={isSubmitting}
            {...form.getInputProps("out_time")}
            key={form.key("out_time")}
          />
          <TextInput
            mb="sm"
            label="Reason"
            placeholder="Reason"
            disabled={isSubmitting}
            {...form.getInputProps("reason")}
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
