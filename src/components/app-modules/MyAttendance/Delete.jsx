import React from "react";
import { Modal, Button, Group } from "@mantine/core";

const Index = ({ opened, close }) => {
  return (
    <Modal
      classNames={{
        title: "modalTitle",
      }}
      opened={opened}
      title="Delete"
      onClose={close}
      centered
    >
      <form>
        <p>Are you sure want to delete ?</p>

        <Group justify="flex-end" mt="md">
          <Button onClick={close} variant="filled">
            No
          </Button>
          <Button variant="filled" color="red">
            Yes
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default Index;
