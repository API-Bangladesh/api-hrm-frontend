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
        }}
        opened={opened}
        title="Create Salary Slip"
        onClose={close}
        centered
      >
        <form>
          <Grid>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <DateInput
                mb="sm"
                valueFormat="DD MMM YYYY"
                label="Posting Date"
                placeholder="DD MMM YYYY"
              />
              <Select
                mb="sm"
                label="Select Payroll"
                placeholder="Pick value"
                data={["payroll_id-A", "payroll_id-B"]}
              />
              <Select
                label="Employee"
                placeholder="Pick value"
                data={["Jiaur Rahman", "Nazmul Hussain"]}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <DateInput
                mb="sm"
                valueFormat="DD MMM YYYY"
                label="From Date"
                placeholder="DD MMM YYYY"
              />
              <DateInput
                mb="sm"
                valueFormat="DD MMM YYYY"
                label="To Date"
                placeholder="DD MMM YYYY"
              />
              <Select
                label="Effective Bank"
                placeholder="Pick value"
                data={["Bank-A", "Bank-B"]}
              />
            </Grid.Col>
          </Grid>
          <Group mt="sm" justify="flex-end">
            <Button type="submit">Save</Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default Index;
