import React from "react";
import { DateInput } from "@mantine/dates";
import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Select,
  Group,
  MultiSelect,
  FileInput,
} from "@mantine/core";
import { FiFile } from "react-icons/fi";
const Index = ({ opened, close, setItem }) => {
  return (
    <>
      <Modal
        classNames={{
          title: "modalTitle",
        }}
        opened={opened}
        title="Edit Leave Request"
        onClose={() => {
          setItem(null);
          close();
        }}
        centered
      >
        <form>
          <Select
            mb="sm"
            label="Leave Type"
            placeholder="Leave Type"
            required={true}
            // disabled={isSubmitting}
            data={["Sick", "Casual"]}
            searchable
            limit={10}
            nothingFoundMessage="Nothing found..."
            // {...form.getInputProps("leavepolicy")}
          />
          <DateInput
            mb="sm"
            valueFormat="DD MMM YYYY"
            label="From Date"
            placeholder="DD MMM YYYY"
            // {...form.getInputProps("from_date")}
          />
          <DateInput
            mb="sm"
            valueFormat="DD MMM YYYY"
            label="To Date"
            placeholder="DD MMM YYYY"
            // {...form.getInputProps("to_date")}
          />
          <TextInput
            disabled
            mb="sm"
            label="Total Days"
            placeholder="0"
            // {...form.getInputProps("total_leave")}
          />
          <FileInput
            mb="sm"
            leftSection={<FiFile />}
            label="Attachment"
            placeholder="Attachment"
            leftSectionPointerEvents="none"
            // {...form.getInputProps("attachment")}
          />
          <Textarea
            mb="sm"
            label="Details"
            placeholder="Details"
            // {...form.getInputProps("rejection_reason")}
          />
          <Group justify="flex-end">
            <Button type="submit">Update</Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default Index;
