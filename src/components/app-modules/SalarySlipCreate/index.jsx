"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { useDisclosure } from "@mantine/hooks";
import Edit from "./Edit";
import Delete from "./Delete";
import Add from "./Add";
import AddButton from "@/components/utils/AddButton";
import { countries } from "@/data/countries";
import { toast } from "react-toastify";
import { DataTable } from "mantine-datatable";
import { submit } from "../../../lib/submit";
import { fetcher } from "../../../lib/fetch";
import { AiOutlineFilePdf } from "react-icons/ai";
import { FaRegFileAlt } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import { LuPlus } from "react-icons/lu";
import { HiDotsVertical } from "react-icons/hi";
import { AiOutlineDelete } from "react-icons/ai";
import { BiMessageSquareEdit } from "react-icons/bi";
import { DateInput } from "@mantine/dates";
import {
   Button,
   Select,
   Menu,
   Breadcrumbs,
   Anchor,
   Modal,
   Grid,
   TextInput,
   NumberInput,
   Accordion,
   Input,
   Group,
} from "@mantine/core";

import { CiSearch } from "react-icons/ci";

import { exportToPDF, exportToExcel, exportToCSV } from "../../../lib/export";

const PAGE_SIZES = [10, 20, 30, 40];

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
         "Employee",
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

   const items = [
      { title: "Dashboard", href: "/" },
      { title: "Create Salary Slip" },
   ].map((item, index) => (
      <Anchor href={item.href} key={index}>
         {item.title}
      </Anchor>
   ));

   const [open1, setOpen1] = useState(false);
   const [item1, setItem1] = useState("Designation");

   const [item2, setItem2] = useState("Group");
   const [item3, setItem3] = useState("Department");
   const [item4, setItem4] = useState("Shift");
   const icon = <CiSearch />;

   // for Modal
   const [edit, { open, close }] = useDisclosure(false);
   const [addOpened, { open: addOpen, close: addClose }] = useDisclosure(false);
   const [deleteOpened, { open: deleteOpen, close: deleteClose }] =
      useDisclosure(false);

   const [payrollOpened, { open: payrollOpen, close: payrollClose }] =
      useDisclosure(false);

   return (
      <>
         <Edit opened={edit} close={close} />
         <Delete opened={deleteOpened} close={deleteClose} />
         <Add opened={addOpened} close={addClose} />

         <div className="mb-4 d-flex justify-content-between align-items-end">
            <div className="pageTop">
               <h3>Create Salary Slip</h3>
               <Breadcrumbs>{items}</Breadcrumbs>
            </div>

            <AddButton
               label="Create Salary Slip"
               fontSize="16px"
               icon={<LuPlus className="me-1 fs-5" />}
               handleClick={addOpen}
            />
         </div>

         <Modal
            opened={payrollOpened}
            onClose={payrollClose}
            title="Filter"
            centered
         >
            <form>
               <DateInput
                  mb="sm"
                  valueFormat="DD MMM YYYY"
                  label="Posting Date"
                  placeholder="DD MMM YYYY"
               />
               <Select
                  mb="sm"
                  label="Select Payroll"
                  placeholder="Pick value"
                  data={["Optional", "X", "Y", "Z"]}
               />
               <Select
                  mb="sm"
                  label="Employee"
                  placeholder="Pick value"
                  data={["Jiaur Rahman", "Nazmul Hussain"]}
               />

               <DateInput
                  mb="sm"
                  valueFormat="DD MMM YYYY"
                  label="From Date"
                  placeholder="DD MMM YYYY"
               />

               <DateInput
                  mb="sm"
                  valueFormat="DD MMM YYYY"
                  label="To Date"
                  placeholder="DD MMM YYYY"
               />
               <Select
                  mb="sm"
                  label="Effective Bank"
                  placeholder="Pick value"
                  data={["company bank accounts", "company bank accounts-2"]}
               />
            </form>

            <div className="d-flex justify-content-end">
               <Button variant="filled" size="sm" mt="sm">
                  Search
               </Button>
            </div>
         </Modal>

         <div className="filterBox mb-4 d-flex align-items-center">
            <Input
               classNames={{
                  input: "searchBtn",
               }}
               size="sm"
               placeholder="Employee name or ID"
            />
            <Button className="ms-3" onClick={payrollOpen}>
               Filter
            </Button>
         </div>

         <div className="d-flex justify-content-between mb-3 flex-wrap">
            <div className="showItem d-flex align-items-center">
               <p className="mb-0 me-2">Show</p>
               <Select
                  withCheckIcon={false}
                  classNames={{
                     input: "showInput",
                  }}
                  placeholder="Pick value"
                  data={["10", "20", "30", "50"]}
                  defaultValue="10"
               />
               <p className="mb-0 ms-2">Entries</p>
            </div>
            <div className="downItem d-flex">
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

         <div className="itemCard p-0 datatable-wrapper">
            <DataTable
               style={{
                  height: apiData?.results?.length === 0 ? "300px" : "auto",
               }}
               classNames={{
                  root: "datatable",
                  table: "datatable_table",
                  header: "datatable_header",
                  pagination: "datatable_pagination",
               }}
               // borderColor="#e0e6ed66"
               // rowBorderColor="#e0e6ed66"
               // c={{ dark: "#ffffff", light: "#0E1726" }}
               // highlightOnHover
               horizontalSpacing="sm"
               verticalSpacing="sm"
               fz="sm"
               verticalAlign="center"
               striped
               columns={[
                  {
                     title: "#",
                     accessor: "na",
                     noWrap: true,
                     sortable: false,
                     width: 40,
                     render: (_, index) =>
                        (currentPage - 1) * pageSize + index + 1,
                  },

                  {
                     accessor: "employee",
                     title: "Employee",
                     noWrap: true,
                     width: 170,
                     // visibleMediaQuery: aboveXs,
                     render: ({ designation_name }) =>
                        designation_name || "N/A",
                  },
                  {
                     accessor: "department_name",
                     title: "From Date",
                     width: 170,
                     // visibleMediaQuery: aboveXs,
                     render: ({ department_name }) => department_name || "N/A",
                  },
                  {
                     accessor: "department_name",
                     title: "To Date",
                     width: 170,
                     // visibleMediaQuery: aboveXs,
                     render: ({ department_name }) => department_name || "N/A",
                  },
                  {
                     accessor: "department_name",
                     title: "Gross Payable",
                     width: 170,
                     // visibleMediaQuery: aboveXs,
                     render: ({ department_name }) => department_name || "N/A",
                  },
                  {
                     accessor: "department_name",
                     title: "Total Deductible",
                     width: 170,
                     // visibleMediaQuery: aboveXs,
                     render: ({ department_name }) => department_name || "N/A",
                  },
                  {
                     accessor: "department_name",
                     title: "Net Payable",
                     width: 170,
                     // visibleMediaQuery: aboveXs,
                     render: ({ department_name }) => department_name || "N/A",
                  },

                  {
                     accessor: "actions",
                     title: "Actions",
                     width: 100,
                     textAlign: "center",
                     // width: "0%",
                     render: (item) => (
                        <>
                           <Menu shadow="md" width={150} position="bottom-end">
                              <Menu.Target>
                                 <button className="border-0 bg-transparent">
                                    <HiDotsVertical />
                                 </button>
                              </Menu.Target>

                              <Menu.Dropdown>
                                 <Menu.Item
                                    onClick={open}
                                    leftSection={
                                       <BiMessageSquareEdit className="fs-6" />
                                    }
                                 >
                                    Edit
                                 </Menu.Item>
                                 <Menu.Item
                                    onClick={deleteOpen}
                                    leftSection={
                                       <AiOutlineDelete className="fs-6" />
                                    }
                                 >
                                    Delete
                                 </Menu.Item>
                              </Menu.Dropdown>
                           </Menu>
                        </>
                     ),
                  },
               ]}
               fetching={isLoading}
               records={apiData?.results || []}
               page={currentPage}
               onPageChange={setCurrentPage}
               totalRecords={apiData?.count}
               recordsPerPage={pageSize}
               sortStatus={sortStatus}
               onSortStatusChange={handleSortStatusChange}
               selectedRecords={selectedRecords}
               onSelectedRecordsChange={setSelectedRecords}
               // recordsPerPageOptions={PAGE_SIZES}
               // onRecordsPerPageChange={setPageSize}
               // rowExpansion={rowExpansion}
               // onRowContextMenu={handleContextMenu}
               // onScroll={hideContextMenu}
            />
         </div>
      </>
   );
};

export default index;
