import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { Modal, Button, Group, Grid, NumberInput, Table } from "@mantine/core";
import { BsPrinter } from "react-icons/bs";
import { toast } from "react-toastify";
import { submit } from "@/lib/submit";
import { fetcher } from "@/lib/fetch";
import {
  formatCurrency,
  formatDateToYYYYMMDD,
  getDate,
  getFullName,
} from "@/lib/helper";

const Index = ({ opened, close, item, mutate }) => {
  console.log(item);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      // loanmaster: null,
      receiving_date: null,
      installment_amount: null,
      // payment_mode: "",
    },
    validate: {
      // title: (value) => (!value ? "Title is required" : null),
    },
  });

  useEffect(() => {
    if (item) {
      form.setValues({
        // loanmaster: item?.id?.toString() || "",
        receiving_date: null,
        installment_amount: null,
        // payment_mode: "Cash",
      });
    }
  }, [item]);

  const handleSubmit = async (values) => {
    const updatedValues = {
      ...values,
      loanmaster: item?.id || "",
      payment_mode: "Cash",
      receiving_date: formatDateToYYYYMMDD(values.receiving_date),
      // next_installment_date: formatDateToYYYYMMDD(values.next_installment_date),
    };
    setIsSubmitting(true);

    try {
      const response = await submit(
        "/api/payroll/add-loaninstallments/",
        updatedValues
      );

      // console.log(response);

      if (response?.status === "success") {
        // console.log(response);
        setIsSubmitting(false);
        form.reset();
        // close();
        mutate();
        toast.success("Installment accepted successfully");
      } else {
        setIsSubmitting(false);
        if (response?.status === "error" && Array.isArray(response.message)) {
          response.message.forEach((msg) => {
            toast.error(msg);
          });
        } else {
          toast.error("Error submitting form");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setTimeout(() => {
        setIsSubmitting(false);
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
      title={item?.title || ""}
      onClose={close}
      centered
      size="xl"
      padding="40px"
    >
      <Table
        withTableBorder
        mb="sm"
        // horizontalSpacing={0}
        // withRowBorders={false}
      >
        <Table.Tbody>
          <Table.Tr>
            <Table.Td colSpan={2}>
              <strong>Employee: </strong>
              {item?.user
                ? getFullName(item?.user?.first_name, item?.user?.last_name)
                : ""}
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td style={{ width: "50%" }}>
              <strong>Loan Amount: </strong>
              {item?.amount ? formatCurrency(item?.amount) : ""}
            </Table.Td>
            <Table.Td style={{ width: "50%" }}>
              <div>
                <strong>Requested on: </strong>
                {item?.installment_start_from
                  ? getDate(item?.installment_start_from)
                  : ""}
              </div>
              <div>
                <strong>Disbursed on: </strong>
                {item?.disbursement_date
                  ? getDate(item?.disbursement_date)
                  : ""}
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>

      <Table withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: "50%" }}>Total Installment</Table.Th>
            <Table.Th style={{ width: "50%" }}>Installment Amount</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {item?.loaninstallments_loanmaster?.length ? (
            item?.loaninstallments_loanmaster?.map((i, index) => (
              <Table.Tr>
                <Table.Td>
                  {index + 1}. {getDate(i?.receiving_date)}
                </Table.Td>
                <Table.Td>{formatCurrency(i?.installment_amount)}</Table.Td>
              </Table.Tr>
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={2}>
                <strong className="d-block">No Data Found</strong>
              </Table.Td>
            </Table.Tr>
          )}

          <Table.Tr>
            <Table.Td colSpan={2}>
              <strong className="d-block mb-1">Receive Installment</strong>

              <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <Grid>
                  <Grid.Col span={{ base: 12, lg: 3 }}>
                    <DateInput
                      valueFormat="DD MMM YYYY"
                      placeholder="Date"
                      required
                      disabled={isSubmitting}
                      {...form.getInputProps("receiving_date")}
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, lg: 3 }}>
                    <NumberInput
                      placeholder="Amount"
                      rightSection={<></>}
                      rightSectionWidth={0}
                      min={0}
                      required
                      disabled={isSubmitting}
                      {...form.getInputProps("installment_amount")}
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, lg: 3 }}>
                    <DateInput
                      valueFormat="DD MMM YYYY"
                      placeholder="Next Installment Date"
                      // required
                      disabled={isSubmitting}
                      // {...form.getInputProps("next_installment_date")}
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, lg: 3 }}>
                    <Button
                      variant="filled"
                      fullWidth
                      type="submit"
                      loading={isSubmitting}
                      loaderProps={{ type: "dots" }}
                    >
                      Receive
                    </Button>
                  </Grid.Col>
                </Grid>
              </form>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>

      <Group justify="flex-end" mt="xl">
        <Button leftSection={<BsPrinter size={14} />} variant="default">
          Print
        </Button>
      </Group>
    </Modal>
  );
};

export default Index;
