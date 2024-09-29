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
  Input,
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
        size="xl"
        padding="40px"
      >
        <form>
          <Grid>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <TextInput label="Title" placeholder="Title" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Select
                label="Employee"
                placeholder="Pick value"
                data={["Jiaur Rahman", "Nazmul Hussain"]}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <TextInput label="Reason" placeholder="Reason" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Select
                label="Type"
                placeholder="Pick value"
                data={["Advance Salary", "Loan", "Fine"]}
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
              <Select
                label="Adjustment Type"
                placeholder="Pick value"
                data={["Salary", "Cash"]}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <NumberInput
                label="Total Installment"
                rightSection={<></>}
                rightSectionWidth={0}
                placeholder="Total Installment"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <NumberInput
                disabled
                label="Instalment Amount"
                rightSection={<></>}
                rightSectionWidth={0}
                placeholder="0"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <DateInput
                valueFormat="DD MMM YYYY"
                label="Disbursement Date"
                placeholder="DD MMM YYYY"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <DateInput
                valueFormat="DD MMM YYYY"
                label="Installment Starts From"
                placeholder="DD MMM YYYY"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Checkbox label="Repayment Completed" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <DateInput
                disabled
                valueFormat="DD MMM YYYY"
                label="Repayment Completion Date"
                placeholder="DD MMM YYYY"
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt={"xl"}>
            <Button type="submit">Save</Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default Index;
