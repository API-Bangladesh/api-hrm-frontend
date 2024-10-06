import React, { useState } from "react";
import { Modal, Button, Group } from "@mantine/core";
import { toast } from "react-toastify";
import { deleteItem } from "@/lib/submit";

const Index = ({ opened, close, mutate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    setIsSubmitting(true);

    try {
      const response = await deleteItem(`/api/attendance/clear-log-data/`);

      const res = await response.json();
      console.log(res);

      if (res?.status === "success") {
        setIsSubmitting(false);
        toast.success("Raw data cleared successfully");
        mutate(); // Re-fetch the data
        close();
      } else {
        toast.error(
          res?.status === "error" ? res?.message[0] : "Error clearing"
        );
      }
      setTimeout(() => {
        setIsSubmitting(false);
        mutate();
      }, 500);
    } catch (error) {
      toast.error(error.message);
      console.error("Error submitting form:", error);
      setTimeout(() => {
        setIsSubmitting(false);
        mutate();
      }, 500);
    }
  };

  return (
    <Modal
      classNames={{
        title: "modalTitle",
        header: "modalHeader",
      }}
      opened={opened}
      title="Clear Raw data"
      onClose={close}
      centered
      size="md"
      padding="40px"
    >
      <form>
        <p>Are you sure want to Clear Raw data?</p>

        <Group mt="xl" justify="flex-end">
          <Button
            onClick={close} //
            variant="filled"
            disabled={isSubmitting}
          >
            No
          </Button>
          <Button
            variant="filled"
            color="red"
            onClick={handleDelete}
            loading={isSubmitting}
            loaderProps={{ type: "dots" }}
          >
            Yes
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default Index;
