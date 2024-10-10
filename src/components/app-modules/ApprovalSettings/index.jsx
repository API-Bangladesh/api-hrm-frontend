"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { useDisclosure } from "@mantine/hooks";
import { Grid, Button, Select } from "@mantine/core";
import { toast } from "react-toastify";
import { DataTable } from "mantine-datatable";
import { constants } from "@/lib/config";
import { submit } from "@/lib/submit";
import { fetcher } from "@/lib/fetch";
import { getStoragePath, getFullName } from "@/lib/helper";
import Breadcrumb from "@/components/utils/Breadcrumb";
import FilterModal from "@/components/utils/EmployeeFilterModal";
import UserSelectItem from "@/components/utils/UserSelectItem";

const PAGE_SIZES = constants.PAGE_SIZES;

const Index = () => {
  const [filterOpened, { open: filterOpen, close: filterClose }] =
    useDisclosure(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "username",
    direction: "asc", // desc
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedApprover, setSelectedApprover] = useState(null);
  const [approverType, setApproverType] = useState(null);

  const [filterData, setFilterData] = useState(null);

  let apiUrl = `/api/user/get-employee/?page=${currentPage}&page_size=${pageSize}&column_accessor=${
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

  const {
    data: approversData,
    error: approversError,
    isLoading: isApproversLoading,
  } = useSWR(`/api/user/get-employee/`, fetcher, {
    errorRetryCount: 2,
    keepPreviousData: true,
  });

  const approvers = approversData?.data?.result.map((item) => ({
    label: [getFullName(item?.first_name, item?.last_name), item?.official_id]
      .filter(Boolean)
      .join(" - "),
    firstName: item?.first_name || "",
    lastName: item?.last_name || "",
    officialID: item?.official_id,
    image: item?.photo,
    value: item?.id.toString() || "",
    gross_salary: Number(item?.gross_salary) || 0,
    basic_salary: Number(item?.basic_salary) || 0,
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

  useEffect(() => {
    setSelectedRecords([]);
  }, [filterData]);

  const handleBulkAssign = async () => {
    const employees = selectedRecords.map((e) => Number(e?.id)).filter(Boolean);
    console.log(employees, selectedApprover);

    const values = {
      user: employees,
      approver: selectedApprover,
      approver_type: approverType,
    };

    if (!values?.approver || !values?.approver_type) {
      toast.error("Select approver and approver type");
      return;
    }

    setIsSubmitting(true);

    // return;

    try {
      const response = await submit("/api/user/assign-approver/", values);

      if (response?.status === "success") {
        // console.log(response);
        setIsSubmitting(false);
        // form.reset();
        // close();
        setSelectedApprover(null);
        setApproverType(null);
        setSelectedRecords([]);
        mutate();
        toast.success("Approver assigned successfully");
      } else {
        setIsSubmitting(false);
        if (response?.status === "error" && Array.isArray(response.message)) {
          response.message.forEach((msg) => {
            toast.error(msg);
          });
        } else {
          toast.error("Error updating");
        }
      }
    } catch (error) {
      console.error("Error updating:", error);
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
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

      <div className="pageTop mb-4">
        <Breadcrumb
          title="Approval Settings"
          items={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Approval Settings" },
          ]}
        />
      </div>

      <div id="leavePolicy" className="itemCard">
        <Grid>
          <Grid.Col span={{ base: 12, md: 7, lg: 7, xl: 4 }}>
            <Select
              mb="sm"
              classNames={{
                root: "cust_iputRoot notFlex",
                label: "cust_iputLabel other_label",
                wrapper: "cust_iputWrapper",
              }}
              label="Approver Type"
              placeholder="Approver Type"
              data={[
                "Supervisor",
                "Expense Approver",
                "Leave Approver",
                "Shift Approver",
              ]}
              searchable
              value={approverType}
              onChange={setApproverType}
            />
            <Select
              classNames={{
                root: "cust_iputRoot notFlex",
                label: "cust_iputLabel other_label",
                wrapper: "cust_iputWrapper",
              }}
              label="Approver"
              placeholder="Approver"
              data={approvers}
              searchable
              value={selectedApprover}
              onChange={setSelectedApprover}
              renderOption={UserSelectItem}
            />
            <div className="d-flex align-items-center my-4">
              <p className="mb-0 employeeLabel">Employee</p>
              <Button onClick={filterOpen}>Filter</Button>
            </div>
          </Grid.Col>
          <Grid.Col span={12}>
            <Button
              className="mb-3"
              loading={isSubmitting}
              loaderProps={{ type: "dots" }}
              disabled={selectedRecords?.length === 0}
              onClick={() => handleBulkAssign()}
            >
              Assign
            </Button>
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
                  // {
                  //   title: "#",
                  //   accessor: "na",
                  //   width: 40,
                  //   noWrap: true,
                  //   sortable: false,
                  //   render: (_, index) =>
                  //     (currentPage - 1) * pageSize + index + 1,
                  // },
                  {
                    // for table display
                    accessor: "photo",
                    title: "Employee",
                    sortable: false,
                    width: 170,
                    render: ({
                      id,
                      photo,
                      first_name,
                      last_name,
                      official_id,
                    }) => (
                      <Link
                        href={`/profile/${id}`}
                        className="d-flex justify-content-start align-items-center text-decoration-none color-inherit"
                      >
                        <span className="table_user_img">
                          <img
                            src={
                              photo
                                ? getStoragePath(photo)
                                : "/default-profile.png"
                            }
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
                  },
                  {
                    accessor: "designation",
                    title: "Designation",
                    width: 250,
                    // visibleMediaQuery: aboveXs,
                    render: ({ designation }) => designation?.name || "N/A",
                  },
                  {
                    accessor: "department_name",
                    title: "Department",
                    width: 250,
                    // visibleMediaQuery: aboveXs,
                    render: ({ departmenttwo }) =>
                      departmenttwo?.[0]?.name || "N/A",
                  },
                  {
                    accessor: "employee_type",
                    title: "Employee Type",
                    width: 170,
                    noWrap: true,
                    sortable: true,
                    render: ({ employee_type }) => employee_type || "N/A",
                  },
                  {
                    accessor: "supervisor",
                    title: "Supervisor",
                    width: 170,
                    noWrap: true,
                    sortable: true,
                    render: ({ supervisor }) => supervisor || "",
                  },
                  {
                    accessor: "expense_approver",
                    title: "Expense Approver",
                    width: 170,
                    noWrap: true,
                    sortable: true,
                    render: ({ expense_approver }) => expense_approver || "",
                  },
                  {
                    accessor: "leave_approver",
                    title: "Leave Approver",
                    width: 170,
                    noWrap: true,
                    sortable: true,
                    render: ({ leave_approver }) => leave_approver || "",
                  },
                  {
                    accessor: "shift_request_approver",
                    title: "Shift Request Approver",
                    width: 170,
                    noWrap: true,
                    sortable: true,
                    render: ({ shift_request_approver }) =>
                      shift_request_approver || "",
                  },
                ]}
                fetching={isLoading}
                records={apiData?.data?.result || []}
                page={currentPage}
                onPageChange={setCurrentPage}
                totalRecords={apiData?.data?.count || 0}
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
          </Grid.Col>
        </Grid>
      </div>
    </>
  );
};

export default Index;
