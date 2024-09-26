import React from "react";
import { Modal, Button, Group } from "@mantine/core";
import { toast } from "react-toastify";
import { update } from "@/lib/submit";

const Index = ({ opened, close, item, mutate }) => {
  const handleUpdate = async () => {
    try {
      const response = await update(
        `/api/attendance/reject-manual-attendance/${item.id}`
      );

      if (response?.status === "success") {
        toast.success("Request rejected");
        mutate();
        close();
      } else {
        toast.error(response?.message?.[0] || "Something went wrong");
        close();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Modal
      classNames={{
        title: "modalTitle",
      }}
      opened={opened}
      title="Reject"
      onClose={close}
      centered
    >
      <form>
        <p>Are you sure want to reject?</p>

        <Group justify="flex-end" mt="md">
          <Button onClick={close} variant="filled">
            No
          </Button>
          <Button variant="filled" color="red" onClick={handleUpdate}>
            Yes
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default Index;
