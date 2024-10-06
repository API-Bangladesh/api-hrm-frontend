import React from "react";
import { Modal, Button, Group } from "@mantine/core";
import { toast } from "react-toastify";
import { deleteItem } from "@/lib/submit";

const Index = ({ opened, close, item, mutate }) => {
  const handleDelete = async () => {
    try {
      const response = await deleteItem(
        `/api/attendance/delete-manual-attendance/${item.id}`
      );

      const res = await response.json();

      if (res?.status === "success") {
        toast.success("Item deleted successfully");
        mutate();
        close();
      } else {
        toast.error(res.message[0]);
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
        header: "modalHeader",
      }}
      opened={opened}
      title="Delete"
      onClose={close}
      centered
      size="md"
      padding="30px"
    >
      <form>
        <p>Are you sure want to delete?</p>

        <Group justify="flex-end" mt="md">
          <Button onClick={close} variant="filled">
            No
          </Button>
          <Button variant="filled" color="red" onClick={handleDelete}>
            Yes
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default Index;
