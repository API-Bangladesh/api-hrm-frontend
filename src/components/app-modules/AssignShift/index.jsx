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
  const [selectedShift, setSelectedShift] = useState(null);

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
    data: shiftsData,
    error: shiftsError,
    isLoading: isShiftsLoading,
  } = useSWR(`/api/user/get-shift/`, fetcher, {
    errorRetryCount: 2,
    keepPreviousData: true,
  });

  const shifts = shiftsData?.data?.result?.map((item) => ({
    label: item?.name?.toString() || "",
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

  useEffect(() => {
    setSelectedRecords([]);
  }, [filterData]);

  const handleBulkAssign = async () => {
    const employees = selectedRecords.map((e) => Number(e?.id)).filter(Boolean);
    console.log(employees, selectedShift);

    const values = {
      user: employees,
      shift: selectedShift,
    };

    if (!values?.shift) {
      toast.error("Select shift");
      return;
    }

    setIsSubmitting(true);

    // return;

    try {
      const response = await submit("/api/user/assign-shift/", values);

      if (response?.status === "success") {
        // console.log(response);
        setIsSubmitting(false);
        // form.reset();
        // close();
        setSelectedShift(null);
        setSelectedRecords([]);
        mutate();
        toast.success("Shift assigned successfully");
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
          title="Assign Shift"
          items={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Assign Shift" },
          ]}
        />
      </div>

      <div id="leavePolicy" className="itemCard">
        <Grid>
          <Grid.Col span={{ base: 12, md: 7, lg: 7, xl: 4 }}>
            <Select
              classNames={{
                root: "cust_iputRoot notFlex",
                label: "cust_iputLabel other_label",
                wrapper: "cust_iputWrapper",
              }}
              label="Shifts"
              placeholder="Shifts"
              data={shifts}
              searchable
              value={selectedShift}
              onChange={setSelectedShift}
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
                    accessor: "shift",
                    title: "Shift",
                    width: 170,
                    noWrap: true,
                    sortable: true,
                    render: ({ shift }) => shift?.name || "N/A",
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
