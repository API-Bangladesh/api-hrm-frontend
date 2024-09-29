import React from "react";
import { DateInput } from "@mantine/dates";
import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Select,
  Group,
  Checkbox,
  MultiSelect,
  FileInput,
  Grid,
} from "@mantine/core";
import { FiFile } from "react-icons/fi";

const Index = ({ opened, close }) => {
  return (
    <>
      <Modal
        classNames={{
          title: "modalTitle",
          header: "modalHeader",
        }}
        opened={opened}
        title="Create Salary Slip"
        onClose={close}
        centered
        size="xl"
        padding="40px"
      >
        <form>
          <Grid classNames={{ root: "gutterX", col: "gutterCol" }}>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <DateInput
                valueFormat="DD MMM YYYY"
                label="Posting Date"
                placeholder="DD MMM YYYY"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Select
                label="Select Payroll"
                placeholder="Pick value"
                data={["payroll_id-A", "payroll_id-B"]}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Select
                label="Employee"
                placeholder="Pick value"
                data={["Jiaur Rahman", "Nazmul Hussain"]}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <DateInput
                valueFormat="DD MMM YYYY"
                label="From Date"
                placeholder="DD MMM YYYY"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Select
                label="Effective Bank"
                placeholder="Pick value"
                data={["Bank-A", "Bank-B"]}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <DateInput
                valueFormat="DD MMM YYYY"
                label="To Date"
                placeholder="DD MMM YYYY"
              />
            </Grid.Col>
          </Grid>
          <Group mt="xl" justify="flex-end">
            <Button type="submit">Save</Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default Index;
