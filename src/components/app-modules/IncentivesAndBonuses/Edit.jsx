import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  Modal,
  TextInput,
  Button,
  Select,
  Group,
  Grid,
  NumberInput,
  MultiSelect,
  Fieldset,
} from "@mantine/core";
import { toast } from "react-toastify";
import { update } from "@/lib/submit";
import { fetcher } from "@/lib/fetch";
import { getFullName, formatDateToYYYYMMDD } from "@/lib/helper";
import UserSelectItem from "@/components/utils/UserSelectItem";

const Index = ({ opened, close, item, setItem, mutate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: item?.title || "",
      description: item?.description || "",
      amount_type: item?.amount_type || null,
      amount: item?.amount || null,
      issuing_date: item?.issuing_date ? new Date(item?.issuing_date) : null,
      // disbursment_date: item?.title || null,
      company: item?.incentivebonuscompany?.map((i) => i?.id?.toString()) || [],
      branch: item?.incentivebonusbranch?.map((i) => i?.id?.toString()) || [],
      department:
        item?.incentivebonusdepartment?.map((i) => i?.id?.toString()) || [],
      grade: item?.incentivebonusgrade?.map((i) => i?.id?.toString()) || [],
      designation:
        item?.incentivebonusdesignation?.map((i) => i?.id?.toString()) || [],
      user: item?.incentivebonususer?.map((i) => i?.user?.id.toString()) || [],
    },
    validate: {
      // title: (value) => (!value ? "Title is required" : null),
    },
  });

  useEffect(() => {
    if (item) {
      form.setValues({
        title: item?.title || "",
        description: item?.description || "",
        amount_type: item?.amount_type || null,
        amount: item?.amount || null,
        issuing_date: item?.issuing_date ? new Date(item?.issuing_date) : null,
        // disbursment_date: item?.title || null,
        company:
          item?.incentivebonuscompany?.map((i) => i?.id?.toString()) || [],
        branch: item?.incentivebonusbranch?.map((i) => i?.id?.toString()) || [],
        department:
          item?.incentivebonusdepartment?.map((i) => i?.id?.toString()) || [],
        grade: item?.incentivebonusgrade?.map((i) => i?.id?.toString()) || [],
        designation:
          item?.incentivebonusdesignation?.map((i) => i?.id?.toString()) || [],
        user:
          item?.incentivebonususer?.map((i) => i?.user?.id.toString()) || [],
      });
    }
  }, [item]);

  const {
    data: companyData,
    error: companyError,
    isLoading: isCompanyLoading,
  } = useSWR(`/api/company/get-company/`, fetcher, {
    errorRetryCount: 2,
    keepPreviousData: true,
  });

  const companies = companyData?.data?.result?.map((item) => ({
    label: item?.basic_information?.name?.toString() || "",
    value: item?.id.toString() || "",
  }));

  const {
    data: branchesData,
    error: branchesError,
    isLoading: isBranchesLoading,
  } = useSWR(`/api/branch/get-branch/`, fetcher, {
    errorRetryCount: 2,
    keepPreviousData: true,
  });

  const branches = branchesData?.data?.result?.map((item) => ({
    label: item?.name?.toString() || "",
    value: item?.id.toString() || "",
  }));

  const {
    data: departmentsData,
    error: departmentsError,
    isLoading: isDepartmentsLoading,
  } = useSWR(`/api/department/get-department/`, fetcher, {
    errorRetryCount: 2,
    keepPreviousData: true,
  });

  const departments = departmentsData?.data?.result?.map((item) => ({
    label: item?.name?.toString() || "",
    value: item?.id.toString() || "",
  }));

  const {
    data: employeeData,
    error: employeeError,
    isLoading: employeeIsFetchLoading,
  } = useSWR(`/api/user/get-employee/`, fetcher, {
    errorRetryCount: 2,
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const employees = employeeData?.data.result.map((item) => ({
    label: [getFullName(item?.first_name, item?.last_name), item?.official_id]
      .filter(Boolean)
      .join(" - "),
    firstName: item?.first_name || "",
    lastName: item?.last_name || "",
    officialID: item?.official_id,
    image: item?.photo,
    value: item?.id.toString() || "",
  }));

  const {
    data,
    error,
    isLoading: isFetchLoading,
  } = useSWR(`/api/user/get-grade/`, fetcher, {
    errorRetryCount: 2,
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const grades = data?.data?.result?.map((item) => ({
    label: item?.name?.toString() || "",
    value: item?.id?.toString() || "",
  }));

  const {
    data: designationsData,
    error: designationsError,
    isLoading: isDesignationsLoading,
  } = useSWR(`/api/user/get-dsignation/`, fetcher, {
    errorRetryCount: 2,
    keepPreviousData: true,
  });

  const designations = designationsData?.data?.result?.map((item) => ({
    label: item?.name?.toString() || "",
    value: item?.id.toString() || "",
  }));

  const handleSubmit = async (values) => {
    const formattedDate = formatDateToYYYYMMDD(values?.issuing_date);

    const formattedValues = {
      ...values,
      issuing_date: formattedDate,
    };

    setIsSubmitting(true);

    try {
      const response = await update(
        `/api/payroll/update-incentivebonus/${item?.id}`,
        formattedValues
      );

      if (response?.status === "success") {
        // console.log(response);
        setIsSubmitting(false);
        close();
        mutate();
        toast.success("Incentives And Bonuses updated successfully");
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
      title="Edit Bonuses"
      onClose={() => {
        setItem(null);
        close();
      }}
      centered
      size="xl"
      padding="40px"
    >
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Grid classNames={{ root: "gutterX", col: "gutterCol" }}>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <TextInput
              label="Title"
              placeholder="Title"
              required
              disabled={isSubmitting}
              {...form.getInputProps("title")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <TextInput
              label="Description"
              placeholder="Description"
              disabled={isSubmitting}
              {...form.getInputProps("description")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Select
              label="Amount Type"
              placeholder="Amount Type"
              data={["Fixed Amount", "Percentage"]}
              required
              disabled={isSubmitting}
              {...form.getInputProps("amount_type")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <NumberInput
              label="Amount"
              rightSection={<></>}
              rightSectionWidth={0}
              placeholder="Amount"
              required
              disabled={isSubmitting}
              {...form.getInputProps("amount")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <DateInput
              valueFormat="DD MMM YYYY"
              label="Issuing Date"
              placeholder="DD MMM YYYY"
              required
              disabled={isSubmitting}
              {...form.getInputProps("issuing_date")}
            />
          </Grid.Col>
        </Grid>

        <Fieldset mt={"xl"} className="fieldsetCus">
          <Grid classNames={{ root: "gutterX", col: "gutterCol" }}>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <MultiSelect
                label="Employees"
                placeholder="Employees"
                searchable
                nothingFoundMessage="Nothing found..."
                hidePickedOptions
                data={employees}
                disabled={isSubmitting}
                {...form.getInputProps("user")}
                renderOption={UserSelectItem}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 6 }}>
              <MultiSelect
                label="Company"
                placeholder="Company"
                searchable
                nothingFoundMessage="Nothing found..."
                hidePickedOptions
                data={companies}
                disabled={isSubmitting}
                {...form.getInputProps("company")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <MultiSelect
                label="Branch"
                placeholder="Branch"
                searchable
                nothingFoundMessage="Nothing found..."
                hidePickedOptions
                data={branches}
                disabled={isSubmitting}
                {...form.getInputProps("branch")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <MultiSelect
                label="Department"
                placeholder="Department"
                searchable
                nothingFoundMessage="Nothing found..."
                hidePickedOptions
                data={departments}
                disabled={isSubmitting}
                {...form.getInputProps("department")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <MultiSelect
                label="Employee Grade"
                placeholder="Employee Grade"
                searchable
                nothingFoundMessage="Nothing found..."
                hidePickedOptions
                data={grades}
                disabled={isSubmitting}
                {...form.getInputProps("grade")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <MultiSelect
                label="Designation"
                placeholder="Designation"
                searchable
                nothingFoundMessage="Nothing found..."
                hidePickedOptions
                data={designations}
                disabled={isSubmitting}
                {...form.getInputProps("designation")}
              />
            </Grid.Col>
          </Grid>
        </Fieldset>

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
