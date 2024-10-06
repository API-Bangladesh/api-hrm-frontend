"use client";

import React, { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { useDisclosure } from "@mantine/hooks";
import { toast } from "react-toastify";
import { Button, Select, MultiSelect, Popover } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import classEase from "classease";
import { AiOutlineFilePdf } from "react-icons/ai";
import { FaRegFileAlt } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { fetcher, getData } from "@/lib/fetch";
import { exportToPDF, exportToExcel, exportToCSV } from "@/lib/export";
import { constants } from "@/lib/config";
import {
  getStoragePath,
  getFullName,
  getDate,
  convertTimeTo12HourFormat,
  generateStringFromArray,
} from "@/lib/helper";
import Breadcrumb from "@/components/utils/Breadcrumb";
import FilterModal from "./Filter";

const PAGE_SIZES = constants.PAGE_SIZES;

const Index = () => {
  const [filterOpened, { open: filterOpen, close: filterClose }] =
    useDisclosure(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "in_time",
    direction: "asc", // desc
  });

  const [filterData, setFilterData] = useState(null);

  let apiUrl = `/api/attendance/get-attendance/?employee=all&page=${currentPage}&page_size=${pageSize}&column_accessor=${
    sortStatus?.direction === "desc" ? "-" : ""
  }${sortStatus.columnAccessor}`;

  if (filterData) {
    Object.keys(filterData).forEach((key) => {
      const value = filterData[key];

      if (Array.isArray(value)) {
        if (value[0] !== null && value[1] !== null) {
          apiUrl += `&${key}_from=${encodeURIComponent(
            value[0]
          )}&${key}_to=${encodeURIComponent(value[1])}`;
        }
      } else if (value) {
        apiUrl += `&${key}=${encodeURIComponent(value)}`;
      }
    });
  }

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

  // const [selectedRecords, setSelectedRecords] = useState([]);

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

  const columns = [
    // {
    //   key: "na",
    //   accessor: "na",
    //   title: "#",
    //   noWrap: true,
    //   sortable: false,
    //   width: 40,
    //   render: (_, index) => (currentPage - 1) * pageSize + index + 1,
    //   modifier: (_, index) => index + 1,
    //   // pdfModifier: ({ na }) =>
    //   //   na > 0 ? "is_text_danger_" + getTime(InTime) : getTime(InTime),
    // },
    {
      key: "employee",
      accessor: "employee",
      title: "Employee",
      sortable: false,
      width: 170,
      render: ({
        employee: { id, photo, first_name, last_name, official_id },
      }) => (
        <Link
          href={`/profile/${id}`}
          className="d-flex justify-content-start align-items-center text-decoration-none color-inherit"
        >
          <span className="table_user_img">
            <img
              src={photo ? getStoragePath(photo) : "/default-profile.png"}
              alt=""
              onError={(e) => {
                e.target.src = "/default-profile.png";
              }}
            />
          </span>
          <div className="d-flex flex-column justify-content-center ms-2 table_user">
            <h6 className="table_user_name">
              {getFullName(first_name, last_name)}
            </h6>
            {official_id && (
              <span className="table_user_id">{official_id}</span>
            )}
          </div>
        </Link>
      ),
      // modifier: ({
      //   employee: { id, photo, first_name, last_name, official_id },
      // }) => getFullName(first_name, last_name),
    },
    {
      key: "department",
      accessor: "department",
      title: "Department",
      width: 120,
      render: ({ department }) => department?.name || "",
    },
    {
      key: "designation",
      accessor: "designation",
      title: "Designation",
      width: 120,
      render: ({ designation }) => designation?.name || "",
    },
    {
      key: "date",
      accessor: "date",
      title: "Date",
      width: 120,
      render: ({ date }) => (date ? getDate(date) : ""),
    },
    {
      key: "in_time",
      accessor: "in_time",
      title: "In Time",
      width: 120,
      render: ({ in_time }) =>
        in_time ? convertTimeTo12HourFormat(in_time) : "",
    },
    {
      key: "out_time",
      accessor: "out_time",
      title: "Out Time",
      width: 120,
      render: ({ out_time }) =>
        out_time ? convertTimeTo12HourFormat(out_time) : "",
    },
    {
      key: "shift",
      accessor: "shift",
      title: "Shift",
      width: 120,
      render: ({ shift: { name } }) => (name ? name : ""),
    },
    {
      key: "status",
      accessor: "status",
      title: "Status",
      width: 120,
      render: ({ attendance_status }) =>
        attendance_status?.length
          ? generateStringFromArray(
              attendance_status.map((item) => item?.status).filter(Boolean)
            )
          : "",
    },
    {
      key: "attendance_mode",
      accessor: "attendance_mode",
      title: "Attendance Mode",
      width: 140,
      render: ({ attendance_mode }) => attendance_mode || "",
    },
    {
      key: "late_time",
      accessor: "late_time",
      title: "Late Time (Mins)",
      width: 140,
      render: ({ late_time }) =>
        late_time ? Number(late_time).toFixed(0) : "",
      // footer: (
      //   <div>{apiData?.data?.sum_info?.total_late_time?.toFixed(0) || ""}</div>
      // ),
    },
    {
      key: "early_leave",
      accessor: "early_leave",
      title: "Early Leave (Mins)",
      width: 140,
      render: ({ early_leave }) =>
        early_leave ? Number(early_leave).toFixed(0) : "",
      // footer: (
      //   <div>
      //     {apiData?.data?.sum_info?.total_early_leave?.toFixed(0) || ""}
      //   </div>
      // ),
    },
    {
      key: "overtime",
      accessor: "overtime",
      title: "Overtime (Mins)",
      width: 140,
      render: ({ over_time }) =>
        over_time ? Number(over_time).toFixed(0) : "",
      // footer: (
      //   <div>{apiData?.data?.sum_info?.total_over_time?.toFixed(0) || ""}</div>
      // ),
    },
    {
      key: "working_hours",
      accessor: "working_hours",
      title: "Working Hours",
      width: 140,
      render: ({ working_minutes }) =>
        working_minutes ? Number(working_minutes).toFixed(0) : "",
      // footer: (
      //   <div>
      //     {apiData?.data?.sum_info?.total_working_minutes?.toFixed(0) || ""}
      //   </div>
      // ),
    },
  ];

  const visibleColumns = [
    // {
    //   label: "Serial",
    //   value: "na",
    // },
    {
      label: "Employee",
      value: "employee",
    },
    {
      label: "Department",
      value: "department",
    },
    {
      label: "Designation",
      value: "designation",
    },
    {
      label: "Date",
      value: "date",
    },
    {
      label: "In Time",
      value: "in_time",
    },
    {
      label: "Out Time",
      value: "out_time",
    },
    {
      label: "Shift",
      value: "shift",
    },
    {
      label: "Status",
      value: "status",
    },
    {
      label: "Attendance Mode",
      value: "attendance_mode",
    },
    {
      label: "Late Time (Mins)",
      value: "late_time",
    },
    {
      label: "Early Leave (Mins)",
      value: "early_leave",
    },
    {
      label: "Overtime (Mins)",
      value: "overtime",
    },
    {
      label: "Working Hours (Mins)",
      value: "working_hours",
    },
  ];

  const [selectedOptions, setSelectedOptions] = useState([
    // "na",
    "employee",
    "department",
    "designation",
    "date",
    "in_time",
    "out_time",
    "status",
    "attendance_mode",
  ]);

  const handleChange = (keys) => {
    const updatedKeys = [
      ...new Set([
        // "na", //
        "employee",
        "date",
        "in_time",
        "out_time",
        ...keys,
      ]),
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
    let url = `/api/attendance/get-attendance/?column_accessor=${
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
        exportToPDF(headers, data, "Attendance Report", "attendance-report");
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
        exportToCSV(data, "attendance-report");
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
        exportToExcel(data, "attendance-report");
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
      <FilterModal
        opened={filterOpened}
        close={filterClose}
        data={filterData}
        setData={setFilterData}
      />

      <div className="mb-4">
        <Breadcrumb
          title="Attendance Report"
          items={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Attendance Report" },
          ]}
        />
      </div>

      <div className="d-flex justify-content-between mb-3">
        <div className="showItem d-flex align-items-center justify-content-center">
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

          <Popover
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
          </Popover>

          <Button onClick={filterOpen} ms="sm">
            Filter
          </Button>
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
          // selectedRecords={selectedRecords}
          // onSelectedRecordsChange={setSelectedRecords}
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
