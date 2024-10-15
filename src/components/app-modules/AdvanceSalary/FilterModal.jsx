import React from "react";
import { Button, Select, Modal } from "@mantine/core";

export default function FilterModal({ opened, close }) {
  return (
    <Modal opened={opened} onClose={close} title="Filter" centered>
      <form>
        <Select
          mb="sm"
          label="Type"
          placeholder="Pick value"
          data={["Advance Salary", "Loan"]}
        />
        <Select
          mb="sm"
          label="Adjustment Type"
          placeholder="Pick value"
          data={["Salary", "Cash"]}
        />
        <Select
          mb="sm"
          label="Status"
          placeholder="Pick value"
          data={["Pending", "Rejected", "On Going", "Repayment Completed"]}
        />
      </form>
      <div className="d-flex justify-content-end">
        <Button variant="filled" size="sm" mt="sm">
          Search
        </Button>
      </div>
    </Modal>
  );
}
