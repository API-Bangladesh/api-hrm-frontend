import React from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  Popover,
  TextInput,
  Textarea,
  Button,
  Select,
  Group,
  Input,
  Menu,
  Breadcrumbs,
  Anchor,
  Badge,
  NavLink,
  Text,
  rem,
} from "@mantine/core";

import { AiOutlineDelete } from "react-icons/ai";
import { BiMessageSquareEdit } from "react-icons/bi";
import { HiDotsVertical } from "react-icons/hi";

const index = () => {
   const [opened, { open, close }] = useDisclosure(false);

   return (
      <>
         <Modal
            classNames={{
               title: "modalTitle",
            }}
            opened={opened}
            title="Edit Branch"
            onClose={close}
            centered
         >
            <form>
               <TextInput
                  label="Branch Name"
                  placeholder="Branch Name"
               />
               <TextInput
                  mt="md"
                  label="Description"
                  placeholder="Description"
               />
               <TextInput
                  mt="md"
                  label="Location"
                  placeholder="Location"
               />
               <TextInput
                  mt="md"
                  label="Address"
                  placeholder="Address"
               />
               <Group justify="flex-end" mt="md">
                  <Button type="submit">Save</Button>
               </Group>
            </form>
         </Modal>
         

      <Menu shadow="md" width={150} position="bottom-end">
      <Menu.Target>
        <button className="border-0 bg-transparent"><HiDotsVertical/></button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={open} leftSection={<BiMessageSquareEdit className="fs-6"/>}>
          Edit
        </Menu.Item>
        <Menu.Item leftSection={<AiOutlineDelete className="fs-6"/>}>
          Delete
        </Menu.Item>
        
      </Menu.Dropdown>
    </Menu>
      </>
   );
};

export default index;
