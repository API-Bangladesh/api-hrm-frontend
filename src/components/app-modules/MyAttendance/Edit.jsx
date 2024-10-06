import React, { useState, useEffect, useRef } from "react";
import { useForm } from "@mantine/form";
import { DateInput, TimeInput } from "@mantine/dates";
import {
  Modal,
  // Textarea,
  Button,
  Select,
  Group,
  TextInput,
  ActionIcon,
} from "@mantine/core";
import { IoTimeOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { update } from "@/lib/submit";
import { formatDateToYYYYMMDD, formatTime } from "@/lib/helper";

const Index = ({ opened, close, item, setItem, mutate }) => {
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

  useEffect(() => {
    if (item) {
      form.setValues({
        date: item?.date ? new Date(item.date) : null,
        in_time: item?.in_time || null,
        out_time: item?.out_time || null,
        reason: item?.reason || "",
      });
    }
  }, [item]);

  const refInTime = useRef(null);

  const inTime = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => refInTime.current?.showPicker()}
    >
      <IoTimeOutline />
    </ActionIcon>
  );

  const refOutTime = useRef(null);

  const outTime = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => refOutTime.current?.showPicker()}
    >
      <IoTimeOutline />
    </ActionIcon>
  );

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      const formattedDate = formatDateToYYYYMMDD(values.date);
      const formattedInTime = values.in_time
        ? formatTime(values.in_time)
        : null;
      const formattedOutTime = values.out_time
        ? formatTime(values.out_time)
        : null;

      const formattedValues = {
        ...values,
        date: formattedDate,
        in_time: formattedInTime,
        out_time: formattedOutTime,
      };

      const response = await update(
        `/api/attendance/update-manual-attendance/${item?.id}`,
        formattedValues
      );

      if (response?.status === "success") {
        setIsSubmitting(false);
        // form.reset();
        close();
        mutate();
        toast.success("Attendance updated successfully");
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
    <Modal
      classNames={{
        title: "modalTitle",
        header: "modalHeader",
      }}
      opened={opened}
      title="Edit Attendance Request"
      onClose={() => {
        setItem(null);
        close();
      }}
      centered
      size="md"
      padding="40px"
    >
      <form
        onSubmit={form.onSubmit((values) => handleSubmit(values), handleError)}
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
        <TimeInput
          mb="sm"
          label="In Time"
          placeholder="Pick in time"
          valueFormat="hh:mm A"
          clearable
          ref={refInTime}
          rightSection={inTime}
          // withSeconds
          // required
          withAsterisk
          disabled={isSubmitting}
          {...form.getInputProps("in_time")}
          key={form.key("in_time")}
        />
        <TimeInput
          mb="sm"
          label="Out Time"
          placeholder="Pick out time"
          valueFormat="hh:mm A"
          clearable
          ref={refOutTime}
          rightSection={outTime}
          // withSeconds
          // required
          withAsterisk
          disabled={isSubmitting}
          {...form.getInputProps("out_time")}
          key={form.key("out_time")}
        />
        <TextInput
          mb="sm"
          label="Reason"
          placeholder="Reason"
          disabled={isSubmitting}
          required
          {...form.getInputProps("reason")}
          key={form.key("reason")}
        />

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
  );
};

export default Index;
