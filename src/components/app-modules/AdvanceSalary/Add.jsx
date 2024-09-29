import React from "react";
import { DateInput } from "@mantine/dates";
import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Select,
  Group,
  Grid,
  NumberInput,
  Checkbox,
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
        title="Create Advance Salary"
        onClose={close}
        centered
        size="md"
        padding="40px"
      >
        <form>
          <TextInput mb="sm" label="Title" placeholder="Title" />
          <Select
            mb="sm"
            label="Type"
            placeholder="Pick value"
            data={["Advance Salary", "Loan"]}
          />
          <TextInput mb="sm" label="Reason" placeholder="Reason" />
          <NumberInput
            mb="md"
            label="Amount"
            rightSection={<></>}
            rightSectionWidth={0}
            placeholder="Amount"
          />
          <Select
            mb="sm"
            label="Adjustment Type"
            placeholder="Pick value"
            data={["Salary", "Cash"]}
          />
          <NumberInput
            mb="md"
            label="Total Installment"
            rightSection={<></>}
            rightSectionWidth={0}
            placeholder="Total Installment"
          />
          <Group justify="flex-end" mt="xl">
            <Button type="submit">Save</Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default Index;
