"use client";

import React, { useEffect, useState } from "react";

import useSWR from "swr";
import Image from "next/image";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
// import Button from "react-bootstrap/Button";
import EditBranch from "./EditBranch";
import AddButton from "@/components/utils/AddButton";
import Spinner from "react-bootstrap/Spinner";
import { Row, Col } from "react-bootstrap";
import classEase from "classease";
import { toast } from "react-toastify";
import { DataTable } from "mantine-datatable";
import { submit } from "../../../lib/submit";
import { fetcher } from "../../../lib/fetch";
import { AiOutlineFilePdf } from "react-icons/ai";
import { FaRegFileAlt } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import Logo from "../../../../public/api_logo.png";
import {
  TextInput,
  Textarea,
  Modal,
  Popover,
  Button,
  Grid,
  Table,
  rows,
  Select,
  Group,
  Input,
  Menu,
  Breadcrumbs,
  Anchor,
  Badge,
  NavLink,
} from "@mantine/core";

import { exportToPDF, exportToExcel, exportToCSV } from "../../../lib/export";

const PAGE_SIZES = [10, 20, 30, 40];

const elements = [
  { position: "Basic Salary", name: 1000 },
  { position: "House Rent Allowance (H.R.A.)", name: 2000 },
  { position: "Conveyance", name: 3000 },
  { position: "Other Allowance", name: 900 },
  { position: "Total Earnings", name: 59698 },
];

const index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "username",
    direction: "asc", // desc
  });

  const {
    data: apiData,
    error,
    isValidating,
    isLoading,
    mutate,
  } = useSWR(
    `/employee/?page=${currentPage}&page_size=${pageSize}&column_accessor=${sortStatus.columnAccessor}&direction=${sortStatus.direction}`,
    fetcher,
    {
      errorRetryCount: 2,
      keepPreviousData: true,
    }
  );

  const [selectedRecords, setSelectedRecords] = useState([]);

  const handleSortStatusChange = (status) => {
    console.log(status);
    setCurrentPage(1);
    setSortStatus(status);
    console.log(sortStatus);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    mutate();
  };

  const [displayedData, setDisplayedData] = useState([]);

  useEffect(() => {
    if (!isLoading && !error) {
      setDisplayedData(apiData?.results || []);
      console.log(apiData?.results);
    }
  }, [isLoading, isValidating]);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingSuccess, setUploadingSuccess] = useState("");
  const [validationError, setValidationError] = useState(null);

  const handleFileChange = (event) => {
    setValidationError(null);
    const files = event.target.files;
    // Convert files to an array
    const filesArray = Array.from(files);
    setUploadedFiles(filesArray);
  };

  const validateFiles = () => {
    let valid = true;
    const newErrors = {};

    // Basic validation: Check if exactly two files are selected
    if (uploadedFiles.length !== 2) {
      setValidationError(
        "Please select exactly two files: 'zip_file.zip' and 'csv_file.csv'."
      );
      valid = false;
      return valid;
    }

    // Validate file names
    const fileNames = uploadedFiles.map((file) => file.name);
    const requiredFileNames = ["zip_file.zip", "csv_file.csv"];

    for (const requiredFileName of requiredFileNames) {
      if (!fileNames.includes(requiredFileName)) {
        setValidationError(`Missing required file: ${requiredFileName}`);
        valid = false;
        break;

        // return valid;
      }
    }

    return valid;
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    setUploadingSuccess("");

    const valid = validateFiles();

    if (!valid) {
      toast.error(validationError);
      return;
    }

    if (valid) {
      setIsUploading(true);

      const formData = new FormData();

      uploadedFiles.forEach((file) => {
        const key = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
        formData.append(key, file);
      });

      // console.log("Form data", formData);

      // return;

      const response = await submit("/employee_csv/", formData, true);

      console.log(response);
      setIsUploading(false);
      // return;

      if (response?.uploaded) {
        toast.success("CSV and ZIP uploaded successfully");
        // setSuccess("Employee created successfully");
        // setIsLoading(false);
        // setErrors({});
        // setFormValues(initialValues);
      } else {
        toast.error(response?.message || "Something went wrong!");
        // setSuccess("Something went wrong!");
        // setIsLoading(false);
        // setErrors({});
        // setFormValues(initialValues);
      }
    }
  };

  // file download
  const handleExportToPDF = async () => {
    // console.log(displayedData);
    // return;
    const headers = [
      "Employee ID",
      "Employee Name",
      "Designation",
      "Group",
      "Department",
      "Shift",
      "Status",
    ];

    const data = displayedData.map((item) => ({
      ID: item.employee_id,
      username: item.username,
      Designation: item?.designation_name || "N/A",
      Group: item?.group_name || "N/A",
      Department: item?.department_name || "N/A",
      Shift: item?.shift_name || "N/A",
      Status: item?.is_active ? "Active" : "Inactive",
    }));

    exportToPDF(headers, data, "employee");
  };

  const handleExportToCSV = () => {
    const data = displayedData.map((item) => ({
      "Employee ID": item.employee_id,
      "Employee Name": item.username,
      Designation: item?.designation_name || "N/A",
      Group: item?.group_name || "N/A",
      Department: item?.department_name || "N/A",
      Shift: item?.shift_name || "N/A",
      Status: item?.is_active ? "Active" : "Inactive",
    }));

    exportToCSV(data, "employee");
  };

  const handleExportToExcel = () => {
    const data = displayedData.map((item) => ({
      "Employee ID": item.employee_id,
      "Employee Name": item.username,
      Designation: item?.designation_name || "N/A",
      Group: item?.group_name || "N/A",
      Department: item?.department_name || "N/A",
      Shift: item?.shift_name || "N/A",
      Status: item?.is_active ? "Active" : "Inactive",
    }));

    exportToExcel(data, "employee");
  };

  const items = [{ title: "Dashboard", href: "/" }, { title: "Payslip" }].map(
    (item, index) => (
      <Anchor href={item.href} key={index}>
        {item.title}
      </Anchor>
    )
  );

  const rows = elements.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.position}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      {/* <Table.Td>{element.symbol}</Table.Td>
        <Table.Td>{element.mass}</Table.Td> */}
    </Table.Tr>
  ));

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        classNames={{
          title: "modalTitle",
          header: "modalHeader",
        }}
        opened={opened}
        onClose={close}
        title="Earnings"
        centered
        size="md"
        padding="40px"
      >
        <form action="">
          <TextInput
            mb="sm"
            label="Title"
            placeholder="Title"
            required={false}
            // disabled={isSubmitting}
            // {...form.getInputProps("name")}
          />
          <TextInput
            mb="sm"
            label="Amount"
            placeholder="Amount"
            required={false}
            // disabled={isSubmitting}
            // {...form.getInputProps("name")}
          />
          <Group justify="flex-end" mt="xl">
            <Button
              type="submit"
              // loading={isSubmitting}
              // loaderProps={{ type: "dots" }}
            >
              Save
            </Button>
          </Group>
        </form>
      </Modal>

      <div className="mb-4 d-md-flex justify-content-between align-items-end">
        <div className="pageTop">
          <h3>Payslip</h3>
          <Breadcrumbs>{items}</Breadcrumbs>
        </div>

        <div className="downItem d-flex mt-3 mt-md-0">
          <div className="me-2">
            <Button
              type="submit"
              className="rounded-1 px-3 btn btn-success border-0"
              onClick={() => handleExportToPDF()}
            >
              <AiOutlineFilePdf className="me-1" />
              PDF
            </Button>
          </div>
          <div className="me-2">
            <Button
              type="submit"
              className="rounded-1 px-3 btn btn-success border-0"
              onClick={() => handleExportToCSV()}
            >
              <FaRegFileAlt className="me-1" />
              CSV
            </Button>
          </div>
          <div>
            <Button
              variant="filled"
              size="sm"
              className="px-3"
              onClick={() => handleExportToExcel()}
            >
              <RiFileExcel2Line className="me-1" />
              Excel
            </Button>
          </div>
        </div>
      </div>

      <div className="itemCard">
        <h4 className="text-center mb-4 d-block">
          PAYSLIP FOR THE MONTH OF FEB 2024
        </h4>
        <div className="slipHeader">
          <Image src={Logo} width={100} className="mb-3" alt="Logo" />
          <p className="mb-0">
            Address: House -4, Road 23/A, Block B, Banani Dhaka 1213, Bangladesh
          </p>
          <p className="mb-0">Nmae: John Doe</p>
          <p className="mb-0">Designation: Web Developer</p>
          <p className="mb-0">Employee ID: API2021209212</p>
          <p className="mb-4">Joining Date: 1-Jan-2023</p>
        </div>

        <Grid gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }}>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Table stickyHeader stickyHeaderOffset={60} withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Earnings</Table.Th>
                  <Table.Th>
                    <div className="d-flex justify-content-end">
                      <Button size="compact-xs" onClick={open}>
                        <FaPlus className="me-1" />
                        Add
                      </Button>
                    </div>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
              <Table.Caption>
                Net Salary: BDT: 59698 (Fifty nine thousand six hundred and
                ninety eight only.)
              </Table.Caption>
            </Table>
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Table stickyHeader stickyHeaderOffset={60} withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Deductions</Table.Th>
                  <Table.Th>
                    <div className="d-flex justify-content-end">
                      <Button size="compact-xs" onClick={open}>
                        <FaPlus className="me-1" />
                        Add
                      </Button>
                    </div>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
              <Table.Caption>
                Net Salary: BDT: 59698 (Fifty nine thousand six hundred and
                ninety eight only.)
              </Table.Caption>
            </Table>
          </Grid.Col>
        </Grid>
      </div>
    </>
  );
};

export default index;
