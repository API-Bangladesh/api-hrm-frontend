"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { useDisclosure } from "@mantine/hooks";
import { toast } from "react-toastify";
import { Button, Select, Menu, MultiSelect, Popover } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { AiOutlineFilePdf, AiOutlineDelete } from "react-icons/ai";
import { FaRegFileAlt } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import { LuPlus } from "react-icons/lu";
import { HiDotsVertical } from "react-icons/hi";
import { BiMessageSquareEdit } from "react-icons/bi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { fetcher, getData } from "@/lib/fetch";
import { exportToPDF, exportToExcel, exportToCSV } from "@/lib/export";
import Breadcrumb from "@/components/utils/Breadcrumb";
import { constants } from "@/lib/config";
import AddButton from "@/components/utils/AddButton";
import Add from "./Add";
import Edit from "./Edit";
import Delete from "./Delete";
import { getDate } from "@/lib/helper";
import { IoIosArrowDown } from "react-icons/io";
import { generateAddressString } from "@/lib/helper";

const PAGE_SIZES = constants.PAGE_SIZES;

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "name",
    direction: "asc", // desc
  });
  const [company, setCompany] = useState("");

  let apiUrl = `/api/department/get-department/?page=${currentPage}&page_size=${pageSize}&column_accessor=${
    sortStatus?.direction === "desc" ? "-" : ""
  }${sortStatus.columnAccessor}${company ? `&company=${company}` : ""}`;

  const {
    data: apiData,
    error,
    isValidating,
    isLoading,
    mutate,
  } = useSWR(apiUrl, fetcher, {
    errorRetryCount: 2,
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const {
    data: companyData,
    error: companyError,
    isLoading: isCompanyLoading,
  } = useSWR(`/api/company/get-company/`, fetcher, {
    errorRetryCount: 2,
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const companies = companyData?.data?.result?.map((item) => ({
    label: item?.basic_information?.name?.toString() || "",
    value: item?.id.toString() || "",
  }));

  const [selectedRecords, setSelectedRecords] = useState([]);

  const handleSortStatusChange = (status) => {
    console.log(status);
    setSortStatus(status);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    // mutate();
  };

  // for Modal
  const [addOpened, { open: addOpen, close: addClose }] = useDisclosure(false);
  const [editOpened, { open: editOpen, close: editClose }] =
    useDisclosure(false);
  const [deleteOpened, { open: deleteOpen, close: deleteClose }] =
    useDisclosure(false);

  const [selectedEditItem, setSelectedEditItem] = useState(null);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);

  useEffect(() => {
    if (selectedEditItem) {
      editOpen();
    }
  }, [selectedEditItem]);

  const columns = [
    {
      // for table display
      accessor: "na",
      title: "#",
      noWrap: true,
      sortable: false,
      width: 40,
      render: (_, index) => (currentPage - 1) * pageSize + index + 1,
      // for export
      key: "na",
      modifier: (_, index) => index + 1,
      // pdfModifier: ({ na }) =>
      //   na > 0 ? "is_text_danger_" + getTime(InTime) : getTime(InTime),
    },
    {
      // for table display
      accessor: "name",
      title: "Name",
      noWrap: true,
      sortable: true,
      width: 170,
      // visibleMediaQuery: aboveXs,
      render: ({ name }) => name || "N/A",
      // for export
      key: "name",
    },
    {
      // for table display
      accessor: "description",
      title: "Description",
      noWrap: true,
      width: 300,
      // visibleMediaQuery: aboveXs,
      render: ({ description }) => description || "N/A",
      // for export
      key: "description",
    },
    {
      // for table display
      accessor: "company",
      title: "Company",
      // visibleMediaQuery: aboveXs,
      width: 170,
      sortable: true,
      render: ({ branch }) => branch?.company?.basic_information?.name || "N/A",
      // for export
      key: "company",
    },
    {
      // for table display
      accessor: "branch",
      title: "Branch",
      // visibleMediaQuery: aboveXs,
      width: 170,
      render: ({ branch }) => branch?.name || "N/A",
      // for export
      key: "branch",
    },
    {
      // for table display
      accessor: "phone",
      title: "Phone",
      // visibleMediaQuery: aboveXs,
      width: 170,
      render: ({ phone }) => phone || "N/A",
      // for export
      key: "phone",
    },
    {
      // for table display
      accessor: "email",
      title: "Email",
      // visibleMediaQuery: aboveXs,
      width: 170,
      render: ({ email }) => email || "N/A",
      // for export
      key: "email",
    },

    {
      // for table display
      accessor: "address",
      title: "Address",
      // visibleMediaQuery: aboveXs,
      width: 300,
      render: ({ address }) => generateAddressString(address || {}),
      // for export
      key: "address",
    },
    {
      // for table display
      accessor: "actions",
      title: "Actions",
      width: 80,
      textAlign: "center",
      // width: "0%",
      render: (item) => (
        <Menu shadow="md" width={150} position="bottom-end">
          <Menu.Target>
            <button className="border-0 bg-transparent">
              <HiDotsVertical />
            </button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<BiMessageSquareEdit className="fs-6" />}
              onClick={() => {
                setSelectedEditItem(item);
              }}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              leftSection={<AiOutlineDelete className="fs-6" />}
              onClick={() => {
                setSelectedDeleteItem(item);
                deleteOpen();
              }}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
      // for export
      key: "actions",
    },
  ];

  const visibleColumns = [
    {
      label: "Serial",
      value: "na",
    },
    {
      label: "Name",
      value: "name",
    },
    {
      label: "Description",
      value: "description",
    },
    {
      label: "Email",
      value: "email",
    },
    {
      label: "Branch",
      value: "branch",
    },
    {
      label: "Phone",
      value: "phone",
    },
    {
      label: "Company",
      value: "company",
    },
    {
      label: "Address",
      value: "address",
    },
    {
      label: "Actions",
      value: "actions",
    },
  ];

  const [selectedOptions, setSelectedOptions] = useState([
    "na",
    "name",
    "description",
    "email",
    "branch",
    "phone",
    "company",
    "address",
    "actions",
  ]);

  const handleChange = (keys) => {
    const updatedKeys = [
      ...new Set(["na", "name", "description", "actions", ...keys]),
    ];

    const reorderedOptions = visibleColumns.filter((column) =>
      updatedKeys.includes(column.value)
    );

    setSelectedOptions(reorderedOptions.map((column) => column.value));
  };

  // file export
  const [isExportDataFetching, setIsExportDataFetching] = useState({
    pdf: false,
    csv: false,
    excel: false,
  });

  // const [dataToExport, setDataToExport] = useState(null);

  const getExportDataUrl = () => {
    let url = `/api/department/get-department/?column_accessor=${
      sortStatus?.direction === "desc" ? "-" : ""
    }${sortStatus.columnAccessor}`;

    return url;
  };

  const handleExportToPDF = async (e) => {
    e.preventDefault();
    setIsExportDataFetching((prev) => ({
      ...prev,
      pdf: true,
    }));

    try {
      // let exportedData = dataToExport; // Use cached data if available
      let exportedData = null;

      if (!exportedData) {
        const url = getExportDataUrl();
        const response = await getData(url);
        exportedData = response?.data?.data?.result;
        // Cache the data
        // setDataToExport(exportedData);
      }

      // const headers = [
      //   "Employee ID",
      //   "Employee Name",
      //   "In Time",
      //   "Out Time",
      //   "Date",
      // ];

      // const data = exportedData.map((item) => ({
      //   ID: item.employee_id,
      //   username: item.username,
      //   InTime: getTime(item.InTime),
      //   OutTime: getTime(item.OutTime),
      //   Date: getDate(item.InTime),
      // }));

      const headers = selectedOptions
        .filter((key) => key !== "actions")
        .map((columnKey) => {
          const selectedColumn = columns.find(
            (column) => column.key === columnKey
          );
          return selectedColumn ? selectedColumn.title : "";
        });

      const data = exportedData.map((item, index) => {
        const rowData = {};
        selectedOptions
          .filter((key) => key !== "actions")
          .forEach((columnKey) => {
            const selectedColumn = columns.find(
              (column) => column.key === columnKey
            );
            const pdfModifier = selectedColumn?.pdfModifier;
            const columnModifier = selectedColumn?.modifier;
            rowData[columnKey] = pdfModifier
              ? pdfModifier(item, index)
              : columnModifier
              ? columnModifier(item, index)
              : item[columnKey] ?? "";
          });
        return rowData;
      });

      setTimeout(() => {
        exportToPDF(headers, data, "Departments", "departments");
        setIsExportDataFetching((prev) => ({
          ...prev,
          pdf: false,
        }));
      }, 1000);
    } catch (error) {
      console.error("Error exporting data to PDF:", error);
      // Handle error
      setTimeout(() => {
        setIsExportDataFetching((prev) => ({
          ...prev,
          pdf: false,
        }));
        toast.error("Failed to export!");
      }, 1000);
    }
  };

  const handleExportToCSV = async (e) => {
    e.preventDefault();
    setIsExportDataFetching((prev) => ({
      ...prev,
      csv: true,
    }));

    try {
      // let exportedData = dataToExport; // Use cached data if available
      let exportedData = null;

      if (!exportedData) {
        const url = getExportDataUrl();
        const response = await getData(url);
        exportedData = response?.data?.data?.result;
        // Cache the data
        // setDataToExport(exportedData);
      }

      // const data = exportedData.map((item) => ({
      //   "Employee ID": item.employee_id,
      //   "Employee Name": item.username,
      //   "In Time": getTime(item.InTime),
      //   "Out Time": getTime(item.OutTime),
      //   Date: getDate(item.date),
      // }));

      const data = exportedData.map((item, index) => {
        const rowData = {};
        selectedOptions
          .filter((key) => key !== "actions")
          .forEach((columnKey) => {
            const selectedColumn = columns.find(
              (column) => column.key === columnKey
            );
            const columnModifier = selectedColumn?.modifier;
            rowData[selectedColumn.title] = columnModifier
              ? columnModifier(item, index)
              : item[columnKey] ?? "";
          });
        return rowData;
      });

      setTimeout(() => {
        exportToCSV(data, "departments");
        setIsExportDataFetching((prev) => ({
          ...prev,
          csv: false,
        }));
      }, 1000);
    } catch (error) {
      console.error("Error exporting data to CSV:", error);
      setTimeout(() => {
        setIsExportDataFetching((prev) => ({
          ...prev,
          csv: false,
        }));
        toast.error("Failed to export!");
      }, 1000);
    }
  };

  const handleExportToExcel = async (e) => {
    e.preventDefault();
    setIsExportDataFetching((prev) => ({
      ...prev,
      excel: true,
    }));

    try {
      // let exportedData = dataToExport; // Use cached data if available
      let exportedData = null;

      if (!exportedData) {
        const url = getExportDataUrl();
        const response = await getData(url);
        exportedData = response?.data?.data?.result;
        // Cache the data
        // setDataToExport(exportedData);
      }

      // const data = exportedData.map((item) => ({
      //   "Employee ID": item.employee_id,
      //   "Employee Name": item.username,
      //   "In Time": getTime(item.InTime),
      //   "Out Time": getTime(item.OutTime),
      //   Date: getDate(item.InTime),
      // }));

      const data = exportedData.map((item, index) => {
        const rowData = {};
        selectedOptions
          .filter((key) => key !== "actions")
          .forEach((columnKey) => {
            const selectedColumn = columns.find(
              (column) => column.key === columnKey
            );
            const columnModifier = selectedColumn?.modifier;
            rowData[selectedColumn.title] = columnModifier
              ? columnModifier(item, index)
              : item[columnKey] ?? "";
          });
        return rowData;
      });

      setTimeout(() => {
        exportToExcel(data, "departments");
        setIsExportDataFetching((prev) => ({
          ...prev,
          excel: false,
        }));
      }, 1000);
    } catch (error) {
      console.error("Error exporting data to Excel:", error);
      setTimeout(() => {
        setIsExportDataFetching((prev) => ({
          ...prev,
          excel: false,
        }));
        toast.error("Failed to export!");
      }, 1000);
    }
  };

  return (
    <>
      <Add
        opened={addOpened} //
        close={addClose}
        mutate={mutate}
      />

      <Edit
        opened={editOpened}
        close={editClose}
        item={selectedEditItem}
        setItem={setSelectedEditItem}
        mutate={mutate}
      />

      <Delete
        opened={deleteOpened}
        close={deleteClose}
        item={selectedDeleteItem}
        mutate={mutate}
      />

      <div className="mb-4 d-flex justify-content-between align-items-end">
        <Breadcrumb
          title="Departments"
          items={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Departments" },
          ]}
        />

        <AddButton
          label="Add Department"
          fontSize="16px"
          icon={<LuPlus className="fs-5 me-0 mr-0" />}
          handleClick={addOpen}
        />
      </div>
      <div className="filterBox mb-4 d-flex align-items-center">
        <Select
          placeholder="Select Company" //
          data={companies}
          onChange={(_value, option) => setCompany(_value)}
        />
      </div>

      <div className="d-flex justify-content-between mb-3 flex-wrap">
        <div className="showItem d-flex align-items-center">
          <p className="mb-0 me-2">Show</p>
          <Select
            classNames={{
              input: "showInput",
            }}
            withCheckIcon={false}
            // placeholder=""
            data={PAGE_SIZES.map((size) => size.toString())}
            // defaultValue={PAGE_SIZES[0].toString()}
            value={String(pageSize)}
            onChange={(_value, option) => handlePageSizeChange(_value)}
          />
          <p className="mb-0 ms-2 me-2">Entries</p>

          {/* <Popover
                  classNames={{
                     dropdown: "column_visibility_dropdown",
                  }}
                  width={0}
                  shadow="md"
                  position="bottom-start"
                  offset={0}
               >
                  <Popover.Target>
                     <Button
                        variant="default"
                        rightSection={<MdKeyboardArrowDown size={20} />}
                        classNames={{
                           root: "column_visibility_btn",
                           section: "column_visibility_btn_section",
                        }}
                     >
                        Visible Columns
                     </Button>
                  </Popover.Target>
                  <Popover.Dropdown>
                     <MultiSelect
                        classNames={{
                           root: "column_visibility_root",
                           label: "column_visibility_label",
                           input: "column_visibility_input",
                        }}
                        label=""
                        placeholder="Pick values"
                        rightSection={<></>}
                        data={visibleColumns}
                        value={selectedOptions}
                        onChange={handleChange}
                        dropdownOpened={true}
                        comboboxProps={{ withinPortal: false }}
                     />
                  </Popover.Dropdown>
               </Popover> */}
        </div>
        <div className="downItem d-flex">
          <div className="me-2">
            <Button
              variant="filled"
              size="sm"
              className="px-3"
              onClick={(e) => handleExportToPDF(e)}
              loading={isExportDataFetching?.pdf}
              loaderProps={{ type: "dots" }}
            >
              <AiOutlineFilePdf className="me-1" />
              PDF
            </Button>
          </div>
          <div className="me-2">
            <Button
              variant="filled"
              size="sm"
              className="px-3"
              onClick={(e) => handleExportToCSV(e)}
              loading={isExportDataFetching?.csv}
              loaderProps={{ type: "dots" }}
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
              onClick={(e) => handleExportToExcel(e)}
              loading={isExportDataFetching?.excel}
              loaderProps={{ type: "dots" }}
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
            height:
              !apiData?.data.result || apiData.data.result.length === 0
                ? "300px"
                : "auto",
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
          idAccessor="id"
          columns={columns.filter((column) =>
            selectedOptions.includes(column.key)
          )}
          fetching={isLoading}
          records={apiData?.data.result || []}
          page={currentPage}
          onPageChange={setCurrentPage}
          totalRecords={apiData?.data.count}
          recordsPerPage={pageSize}
          sortStatus={sortStatus}
          onSortStatusChange={handleSortStatusChange}
          //  selectedRecords={selectedRecords}
          //  onSelectedRecordsChange={setSelectedRecords}
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

export default Index;
