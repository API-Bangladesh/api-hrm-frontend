import React, { useState, useEffect } from "react";
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
import { update } from "@/lib/submit";
import { fetcher } from "@/lib/fetch";

const Index = ({ opened, close, item, setItem, mutate }) => {
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

  useEffect(() => {
    if (item) {
      form.setValues({
        title: item?.title || "",
        description: item?.description || "",
        min_income: item?.min_income || null,
        max_income: item?.max_income || null,
        ethnicgroup: item?.ethnicgroup?.id?.toString() || null,
        percentage: item?.percentage || null,
      });
    }
  }, [item]);

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
    const formattedValues = { ...values };

    setIsSubmitting(true);

    try {
      const response = await update(
        `/api/payroll/update-payrolltax/${item?.id}`,
        formattedValues
      );

      if (response?.status === "success") {
        // console.log(response);
        setIsSubmitting(false);
        close();
        mutate();
        toast.success("Tax updated successfully");
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
        title="Edit Income Tax"
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
            key={form.key("ethnicgroup")}
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
