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
  MultiSelect,
  Fieldset,
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
    </>
  );
};

export default Index;
