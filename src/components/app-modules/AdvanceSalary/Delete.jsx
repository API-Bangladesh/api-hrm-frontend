import React from "react";
import { Modal, Button, Group } from "@mantine/core";

const Index = ({ opened, close }) => {
  return (
    <>
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
          <p>Are you sure want to delete ?</p>

          <Group mt="xl" justify="flex-end">
            <Button onClick={close} variant="filled">
              No
            </Button>
            <Button variant="filled" color="red">
              Yes
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default Index;
