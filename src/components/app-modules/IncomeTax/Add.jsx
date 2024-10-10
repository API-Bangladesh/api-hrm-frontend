import React, { useState } from "react";
import useSWR from "swr";
import { useForm } from "@mantine/form";
import {
  Modal,
  TextInput,
  Button,
  Select,
  Group,
  NumberInput,
} from "@mantine/core";
import { toast } from "react-toastify";
import { submit } from "@/lib/submit";
import { fetcher } from "@/lib/fetch";

const Index = ({ opened, close, mutate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      description: "",
      min_income: null,
      max_income: null,
      ethnicgroup: null,
      percentage: null,
    },
    validate: {
      title: (value) => (!value ? "Title is required" : null),
      min_income: (value) => (!value ? "Min Income is required" : null),
      max_income: (value) => (!value ? "Max Income is required" : null),
      ethnicgroup: (value) => (!value ? "Group is required" : null),
      percentage: (value) => (!value ? "Percentage is required" : null),
      // date: (value) => (!value ? "Date is required" : null),
    },
  });

  const {
    data,
    error,
    isLoading: isFetchLoading,
  } = useSWR(`/api/user/get-ethnicgroup/`, fetcher, {
    errorRetryCount: 2,
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const groups = data?.data?.result?.map((item) => ({
    label: item?.name?.toString() || "",
    value: item?.id?.toString() || "",
  }));

  const handleSubmit = async (values) => {
    // const formattedDate = values.date
    //   ? values.date.toISOString().split("T")[0]
    //   : null;

    // const formattedDate = formatDateToYYYYMMDD(values?.date);

    // const formattedValues = { ...values, date: formattedDate };
    const formattedValues = { ...values };

    setIsSubmitting(true);

    try {
      const response = await submit(
        "/api/payroll/add-payrolltax/",
        formattedValues
      );

      if (response?.status === "success") {
        // console.log(response);
        setIsSubmitting(false);
        form.reset();
        close();
        mutate();
        toast.success("Tax created successfully");
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
      title="Create Income Tax"
      onClose={close}
      centered
      size="md"
      padding="40px"
    >
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <TextInput
          mb="sm"
          label="Title"
          placeholder="Title"
          disabled={isSubmitting}
          withAsterisk
          {...form.getInputProps("title")}
        />
        <NumberInput
          mb="sm"
          label="Min. Income"
          rightSection={<></>}
          rightSectionWidth={0}
          withAsterisk
          placeholder="Min. Income"
          disabled={isSubmitting}
          {...form.getInputProps("min_income")}
        />
        <NumberInput
          mb="sm"
          label="Max. Income"
          rightSection={<></>}
          rightSectionWidth={0}
          withAsterisk
          placeholder="Max. Income"
          disabled={isSubmitting}
          {...form.getInputProps("max_income")}
        />
        <NumberInput
          mb="sm"
          label="Percentage"
          rightSection={<></>}
          rightSectionWidth={0}
          withAsterisk
          placeholder="45%"
          disabled={isSubmitting}
          {...form.getInputProps("percentage")}
        />
        <Select
          mb="sm"
          label="Employee Group"
          placeholder="Employee Group"
          withAsterisk
          data={groups}
          disabled={isSubmitting}
          {...form.getInputProps("ethnicgroup")}
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
  );
};

export default Index;
