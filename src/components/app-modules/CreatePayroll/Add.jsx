import React from "react";
import { DateInput } from "@mantine/dates";
import {
  Modal,
  TextInput,
  Fieldset,
  Button,
  Select,
  Group,
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
        title="Create Payroll"
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
              <DateInput
                valueFormat="DD MMM YYYY"
                label="Posting Date"
                placeholder="DD MMM YYYY"
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
              <DateInput
                valueFormat="DD MMM YYYY"
                label="To Date"
                placeholder="DD MMM YYYY"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Select
                label="Effective Bank"
                placeholder="Effective Bank"
                data={["Bank-A", "Bank-B"]}
              />
            </Grid.Col>
          </Grid>

          <Fieldset mt={"xl"} className="fieldsetCus">
            <Grid classNames={{ root: "gutterX", col: "gutterCol" }}>
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Select
                  label="Company"
                  placeholder="Company"
                  data={["company_id-A", "company_id-B"]}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Select
                  label="Branch"
                  placeholder="Branch"
                  data={["branch_id-A", "branch_id-B"]}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Select
                  label="Department"
                  placeholder="Department"
                  data={["department_id-A", "department_id-B"]}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Select
                  label="Employee Grade"
                  placeholder="Employee Grade"
                  data={["Grade-A", "Grade-B"]}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Select
                  label="Designation"
                  placeholder="Designation"
                  data={["Front-End Developer", "Back-End Developer"]}
                />
              </Grid.Col>
            </Grid>
          </Fieldset>

          <Group mt="xl" justify="flex-end">
            <Button type="submit">Save</Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default Index;
