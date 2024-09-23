import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { useForm } from "@mantine/form";
import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Select,
  Group,
  Grid,
  Fieldset,
} from "@mantine/core";
import { toast } from "react-toastify";
import { update } from "@/lib/submit";
import { fetcher } from "@/lib/fetch";
import { countries } from "@/data/countries";

const Index = ({ opened, close, item, setItem, mutate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      description: "",
      company: "",
      phone: "",
      email: "",
      fax: "",
      address_id: "",
      address: {
        city: "",
        state_division: "",
        post_zip_code: "",
        country: "",
        address: "",
      },
    },
    validate: {
      name: (value) =>
        value.length < 5 ? "Name must have at least 5 letters" : null,
      // description: (value) =>
      //   value.length < 10
      //     ? "Description must have at least 10 characters"
      //     : null,
      company: (value) => (!value ? "Select a company" : null),
      phone: (value) => {
        const phonePattern = /^01[0-9]{9}$/;
        return !phonePattern.test(value) ? "Phone number is invalid" : null;
      },
      email: (value) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailPattern.test(value) ? "Email is invalid" : null;
      },
      // fax: (value) => {
      //   const faxPattern = /^[0-9]+$/;
      //   return !faxPattern.test(value) ? "Fax number is invalid" : null;
      // },
      address: {
        // city: (value) =>
        //   value.length < 2 ? "City must have at least 2 letters" : null,
        // state_division: (value) =>
        //   value.length < 2
        //     ? "Division / State must have at least 2 letters"
        //     : null,
        // post_zip_code: (value) => {
        //   const zipCodePattern = /^[0-9]{5}(-[0-9]{4})?$/;
        //   return !zipCodePattern.test(value)
        //     ? "Postal / ZIP Code is invalid"
        //     : null;
        // },
        country: (value) => (!value ? "Select a country" : null),
        address: (value) =>
          value.length < 5 ? "Address must have at least 5 characters" : null,
      },
    },
  });

  useEffect(() => {
    console.log(item);
    if (item) {
      form.setValues({
        name: item.name || "",
        description: item.description || "",
        company: item.company.id.toString() || "",
        phone: item.phone || "",
        email: item.email || "",
        fax: item.fax || "",
        address_id: item.address.id || "",
        address: {
          city: item.address.city || "",
          state_division: item.address.state_division || "",
          post_zip_code: item.address.post_zip_code || "",
          country: item.address.country || "",
          address: item.address.address || "",
        },
      });
    }
  }, [item]);

  const {
    data,
    error,
    isLoading: isFetchLoading,
  } = useSWR(`/api/company/get-company/`, fetcher, {
    errorRetryCount: 2,
    keepPreviousData: true,
  });

  const companies = data?.data?.result?.map((item) => ({
    label: item?.basic_information?.name?.toString() || "",
    value: item?.id.toString() || "",
  }));

  const handleSubmit = async (values) => {
    // e.preventDefault();
    // console.log(values);

    setIsSubmitting(true);

    try {
      const response = await update(
        `/api/branch/update-branch/${item.id}`,
        values
      );
      // const response = res.json();
      console.log(response);

      if (response?.status === "success") {
        // console.log(response);
        setIsSubmitting(false);
        close();
        mutate();
        toast.success("Branch updated successfully");
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
        title="Edit Branch"
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
                label="Branch Name"
                placeholder="Branch Name"
                required={true}
                disabled={isSubmitting}
                {...form.getInputProps("name")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Select
                label="Company"
                placeholder="Company"
                required={true}
                disabled={isSubmitting}
                data={companies}
                {...form.getInputProps("company")}
                key={form.key("company")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <TextInput
                label="Phone"
                placeholder="Phone"
                required={true}
                disabled={isSubmitting}
                {...form.getInputProps("phone")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <TextInput
                label="Email"
                placeholder="Email"
                required={true}
                disabled={isSubmitting}
                {...form.getInputProps("email")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <TextInput
                label="Fax"
                placeholder="Fax"
                // required={true}
                disabled={isSubmitting}
                {...form.getInputProps("fax")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <TextInput
                label="Description"
                placeholder="Description"
                // required={true}
                disabled={isSubmitting}
                {...form.getInputProps("description")}
              />
            </Grid.Col>
          </Grid>

          <Fieldset mt={"xl"} className="fieldsetCus">
            <Grid classNames={{ root: "gutterX", col: "gutterCol" }}>
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <TextInput
                  label="Address"
                  placeholder="Address"
                  required={true}
                  disabled={isSubmitting}
                  {...form.getInputProps("address.address")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <TextInput
                  label="City"
                  placeholder="City"
                  required={true}
                  disabled={isSubmitting}
                  {...form.getInputProps("address.city")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <TextInput
                  label="Division / State"
                  placeholder="Division / State"
                  required={true}
                  disabled={isSubmitting}
                  {...form.getInputProps("address.state_division")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <TextInput
                  label="Postal / ZIP Code"
                  placeholder="Postal / ZIP Code"
                  required={true}
                  disabled={isSubmitting}
                  {...form.getInputProps("address.post_zip_code")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Select
                  label="Country"
                  placeholder="Country"
                  required={true}
                  disabled={isSubmitting}
                  searchable
                  data={countries}
                  {...form.getInputProps("address.country")}
                />
              </Grid.Col>
            </Grid>
          </Fieldset>

          <Group mt="xl" justify="flex-end">
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
