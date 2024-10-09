import React, { useState } from "react";
import useSWR from "swr";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
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
import { submit } from "@/lib/submit";
import { fetcher } from "@/lib/fetch";

const Index = ({ opened, close, mutate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      description: "",
      amount_type: null,
      amount: null,
      issuing_date: null,
      disbursment_date: null,
      company: [],
      branch: [],
      department: [],
      user: [],
    },
    validate: {
      // title: (value) => (!value ? "Title is required" : null),
      // min_income: (value) => (!value ? "Min Income is required" : null),
      // max_income: (value) => (!value ? "Max Income is required" : null),
      // ethnicgroup: (value) => (!value ? "Group is required" : null),
      // percentage: (value) => (!value ? "Percentage is required" : null),
    },
  });

  return (
    <Modal
      classNames={{
        title: "modalTitle",
        header: "modalHeader",
      }}
      opened={opened}
      title="Create Bonuses"
      onClose={close}
      centered
      size="xl"
      padding="40px"
    >
      <form>
        <Grid classNames={{ root: "gutterX", col: "gutterCol" }}>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <TextInput label="Title" placeholder="Title" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <TextInput label="Description" placeholder="Description" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Select
              label="Amount Type"
              placeholder="Pick value"
              data={["Fixed", "Percentage"]}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <NumberInput
              label="Amount"
              rightSection={<></>}
              rightSectionWidth={0}
              placeholder="Amount"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <DateInput
              valueFormat="DD MMM YYYY"
              label="Issuing Date"
              placeholder="DD MMM YYYY"
            />
          </Grid.Col>
        </Grid>

        <Fieldset mt={"xl"} className="fieldsetCus">
          <Grid classNames={{ root: "gutterX", col: "gutterCol" }}>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <MultiSelect
                label="Employees"
                placeholder="Employees"
                data={["Jiaur Rahman", "Nazmul Hussain", "Roki Islam"]}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Select
                label="Company"
                placeholder="Company"
                data={["Api solutions ltd.", "Api solutions ltd. 2"]}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Select
                label="Branch"
                placeholder="Branch"
                data={["Banani", "Mirpur"]}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Select
                label="Department"
                placeholder="Department"
                data={["Devlopment", "Marketing"]}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Select
                label="Employee Grade"
                placeholder="Employee Grade"
                data={["A", "B"]}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Select
                label="Designation"
                placeholder="Designation"
                data={["Frontend Developer", "Backend Developer"]}
              />
            </Grid.Col>
          </Grid>
        </Fieldset>
        <Group mt="xl" justify="flex-end">
          <Button
            type="submit"
            //   loading={isSubmitting}
            //   loaderProps={{ type: "dots" }}
          >
            Save
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default Index;
