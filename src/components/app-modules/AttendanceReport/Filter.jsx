"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { DatePickerInput } from "@mantine/dates";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { Grid } from "@mantine/core";
import {
  Button,
  Select,
  Accordion,
  TextInput,
  Modal,
  MultiSelect,
} from "@mantine/core";
import { toast } from "react-toastify";
import { fetcher, getData } from "@/lib/fetch";
import { getFullName, formatDateToYYYYMMDD } from "@/lib/helper";
import {
  genders,
  maritalStatus,
  bloodGroups,
  employeeTypes,
  jobStatus,
  attendanceStatus,
  attendanceModes,
} from "@/data";
import UserSelectItem from "@/components/utils/UserSelectItem";

const FilterModal = ({ opened, close, data, setData }) => {
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      first_name: "",
      last_name: "",
      personal_email: "",
      personal_phone: "",
      gender: "",
      religion: "",
      marital_status: "",
      blood_group: "",
      //
      official_id: "",
      company: "",
      branch: "",
      department: "",
      designation: "",
      supervisor: "",
      shift: "",
      employee_type: "",
      job_status: "",
      grade: "",
      ethnicgroup_user: "",
      joining_date: [null, null],
      from_date: null,
      to_date: null,
      // gross_salary: [10000, 80000],
      attendance_status: [],
      attendance_mode: [],
    },
    validate: {
      // first_name: (value) => (!value ? "Name is required" : null),
      // last_name: (value) => (!value ? "Name is required" : null),
      // personal_email: (value) => (!value ? "Name is required" : null),
      // company: (value) => (!value ? "Select a company" : null),
      // branch: (value) => (!value ? "Select a branch" : null),
      // email: (value) =>
      //   value && !validateEmail(value) ? "Invalid email" : null,
      // phone: (value) =>
      //   value && !validatePhoneNumber(value) ? "Invalid phone number" : null,
    },
  });

  // useEffect(() => {
  //   if (data) {
  //     form.setValues({
  //       first_name: data?.first_name || "",
  //       last_name: data?.last_name || "",
  //       personal_email: data?.personal_email || "",
  //       personal_phone: data?.personal_phone || "",
  //       gender: data?.gender || "",
  //       religion: data?.religion || "",
  //       marital_status: data?.marital_status || "",
  //       blood_group: data?.blood_group || "",
  //       //
  //       official_id: data?.official_id || "",
  //       company: data?.company || "",
  //       branch: data?.branch || "",
  //       department: data?.department || "",
  //       designation: data?.designation || "",
  //       supervisor: data?.supervisor || "",
  //       shift: data?.shift || "",
  //       employee_type: data?.employee_type || "",
  //       job_status: data?.job_status || "",
  //       grade: data?.grade || "",
  //       ethnicgroup_user: data?.ethnicgroup_user || "",
  //       joining_date: [null, null],
  //       gross_salary: [10000, 30000],
  //     });
  //   }
  // }, [data]);

  const {
    data: religionsData,
    error: religionsError,
    isLoading: religionsIsFetchLoading,
  } = useSWR(`/api/user/get-religion/`, fetcher, {
    errorRetryCount: 2,
    keepPreviousData: true,
  });

  // console.log(religionsData);

  const religions = religionsData?.data?.result?.map((item) => ({
    value: item?.id.toString() || "",
    label: item?.name?.toString() || "",
  }));

  const {
    data: companyData,
    error: companyError,
    isLoading: isCompanyLoading,
  } = useSWR(`/api/company/get-company/`, fetcher, {
    errorRetryCount: 2,
    keepPreviousData: true,
  });

  const companies = companyData?.data?.result?.map((item) => ({
    label: item?.basic_information?.name?.toString() || "",
    value: item?.id.toString() || "",
  }));

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

  const {
    data: gradesData,
    error: gradesError,
    isLoading: isGradesLoading,
  } = useSWR(`/api/user/get-grade/`, fetcher, {
    errorRetryCount: 2,
    keepPreviousData: true,
  });

  const grades = gradesData?.data?.result?.map((item) => ({
    label: item?.name?.toString() || "",
    value: item?.id.toString() || "",
  }));

  const {
    data: groupsData,
    error: groupsError,
    isLoading: isGroupsLoading,
  } = useSWR(`/api/user/get-ethnicgroup/`, fetcher, {
    errorRetryCount: 2,
    keepPreviousData: true,
  });

  const groups = groupsData?.data?.result?.map((item) => ({
    label: item?.name?.toString() || "",
    value: item?.id.toString() || "",
  }));

  const {
    data: employeesData,
    error: employeesError,
    isLoading: isEmployeesLoading,
  } = useSWR(`/api/user/get-employee/`, fetcher, {
    errorRetryCount: 2,
    keepPreviousData: true,
  });

  const employees = employeesData?.data?.result?.map((item) => ({
    label: [getFullName(item?.first_name, item?.last_name), item?.official_id]
      .filter(Boolean)
      .join(" - "),
    firstName: item?.first_name || "",
    lastName: item?.last_name || "",
    officialID: item?.official_id,
    image: item?.photo,
    value: item?.id.toString() || "",
  }));

  const {
    data: designationsData,
    error: designationsError,
    isLoading: isDesignationsLoading,
  } = useSWR(`/api/user/get-dsignation/`, fetcher, {
    errorRetryCount: 2,
    keepPreviousData: true,
  });

  const designations = designationsData?.data?.result?.map((item) => ({
    label: item?.name?.toString() || "",
    value: item?.id.toString() || "",
  }));

  const fetchBranches = async (companyId) => {
    try {
      const response = await getData(
        `/api/branch/get-branch/?company=${companyId}`
      );
      console.log(response);
      const branchData = response?.data?.data?.result.map((branch) => ({
        label: branch?.name?.toString() || "",
        value: branch?.id.toString() || "",
      }));
      setBranches(branchData);
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast.error("Error fetching branches");
    }
  };

  form.watch("company", ({ previousValue, value, touched, dirty }) => {
    if (value) {
      fetchBranches(value);
    } else {
      form.setFieldValue("branch", null);
      setBranches([]);
    }
  });

  const fetchDepartments = async (companyId, branchId) => {
    try {
      const response = await getData(
        `/api/department/get-department/?company=${companyId}&branch=${branchId}`
      );
      console.log(response);
      const departmentData = response?.data?.data?.result.map((department) => ({
        label: department?.name?.toString() || "",
        value: department?.id.toString() || "",
      }));
      setDepartments(departmentData);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Error fetching departments");
    }
  };

  form.watch("branch", ({ previousValue, value, touched, dirty }) => {
    if (value) {
      fetchDepartments(form.getValues().company, value);
      form.setFieldValue("department", null);
    } else {
      console.log(value);
      form.setFieldValue("department", "");
      setDepartments([]);
    }
  });

  // const [grossSalary, setGrossSalary] = useState(form.getValues().gross_salary);

  // const handleGrossSalaryChange = (value) => {
  //   // setGrossSalary(value);
  //   form.setFieldValue("gross_salary", value);
  // };

  const handleSubmit = async (values) => {
    const formData = {
      ...values,
      joining_date: [
        formatDateToYYYYMMDD(values.joining_date[0]),
        formatDateToYYYYMMDD(values.joining_date[1]),
      ],
      date: [
        formatDateToYYYYMMDD(values.from_date),
        formatDateToYYYYMMDD(values.to_date),
      ],
      from_date: formatDateToYYYYMMDD(values.from_date),
      to_date: formatDateToYYYYMMDD(values.to_date),
      attendance_mode: values.attendance_mode?.length
        ? values.attendance_mode.filter(Boolean).join(",")
        : values.attendance_mode,
      attendance_status: values.attendance_status?.length
        ? values.attendance_status.filter(Boolean).join(",")
        : values.attendance_status,
    };

    // delete formData.from_date;
    // delete formData.to_date;

    // console.log(formData);
    setData(formData);
    close();
    form.reset();
    return;
  };

  const handleError = (errors) => {
    console.log(errors);
  };

  return (
    <Modal opened={opened} onClose={close} title="Filter" centered>
      <form
        onSubmit={form.onSubmit((values) => handleSubmit(values), handleError)}
      >
        <Accordion defaultValue="">
          <Accordion.Item key="Personal Info" value="Personal Info">
            <Accordion.Control>Personal Info</Accordion.Control>
            <Accordion.Panel>
              <Grid gutter={{ base: 8, xl: "md" }}>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                  <TextInput
                    label="First Name"
                    placeholder="First Name"
                    mb="xs"
                    {...form.getInputProps("first_name")}
                    key={form.key("first_name")}
                  />
                  <TextInput
                    label="Email"
                    placeholder="example@gmail.com"
                    mb="xs"
                    {...form.getInputProps("personal_email")}
                    key={form.key("personal_email")}
                  />
                  <Select
                    mb="xs"
                    label="Gender"
                    placeholder="Gender"
                    searchable
                    data={genders}
                    {...form.getInputProps("gender")}
                    key={form.key("gender")}
                  />
                  <Select
                    label="Marital Status"
                    placeholder="Marital Status"
                    data={maritalStatus}
                    {...form.getInputProps("marital_status")}
                    key={form.key("marital_status")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                  <TextInput
                    label="Last Name"
                    placeholder="Last Name"
                    mb="xs"
                    {...form.getInputProps("last_name")}
                    key={form.key("last_name")}
                  />
                  <TextInput
                    label="Contact No."
                    placeholder="Contact No"
                    mb="xs"
                    {...form.getInputProps("personal_phone")}
                    key={form.key("personal_phone")}
                  />
                  <Select
                    mb="xs"
                    label="Religion"
                    placeholder="Religion"
                    data={religions}
                    {...form.getInputProps("religion")}
                    key={form.key("religion")}
                  />
                  <Select
                    label="Blood Group"
                    placeholder="Blood Group"
                    data={bloodGroups}
                    {...form.getInputProps("blood_group")}
                    key={form.key("blood_group")}
                  />
                </Grid.Col>
              </Grid>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item key="Work Info" value="Work Info">
            <Accordion.Control>Work Info</Accordion.Control>
            <Accordion.Panel>
              <Grid>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                  <TextInput //
                    label="Employee ID"
                    placeholder="Employee ID"
                    mb="xs"
                    {...form.getInputProps("official_id")}
                    key={form.key("official_id")}
                  />

                  <Select
                    label="Branch"
                    placeholder="Branch"
                    // searchable
                    data={branches}
                    mb="xs"
                    {...form.getInputProps("branch")}
                    key={form.key("branch")}
                  />

                  <Select
                    label="Designation"
                    placeholder="Designation"
                    // searchable
                    data={designations}
                    mb="xs"
                    {...form.getInputProps("designation")}
                    key={form.key("designation")}
                  />

                  <Select
                    label="Shift"
                    placeholder="Shift"
                    // searchable
                    data={shifts}
                    mb="xs"
                    {...form.getInputProps("shift")}
                    key={form.key("shift")}
                  />

                  <Select
                    label="Job Status"
                    placeholder="Job Status"
                    // searchable
                    data={jobStatus}
                    mb="xs"
                    {...form.getInputProps("job_status")}
                    key={form.key("job_status")}
                  />

                  <Select
                    label="Group"
                    placeholder="Group"
                    // searchable
                    data={groups}
                    {...form.getInputProps("ethnicgroup_user")}
                    key={form.key("ethnicgroup_user")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                  <Select
                    label="Company"
                    placeholder="Company"
                    // searchable
                    data={companies}
                    mb="xs"
                    {...form.getInputProps("company")}
                    key={form.key("company")}
                  />
                  <Select
                    label="Department"
                    placeholder="Department"
                    // searchable
                    data={departments}
                    mb="xs"
                    {...form.getInputProps("department")}
                    key={form.key("department")}
                  />
                  <Select
                    label="Supervisor"
                    placeholder="Supervisor"
                    searchable
                    data={employees}
                    mb="xs"
                    {...form.getInputProps("supervisor")}
                    key={form.key("supervisor")}
                    renderOption={UserSelectItem}
                  />

                  <Select
                    label="Employee type"
                    placeholder="Employee type"
                    // searchable
                    data={employeeTypes}
                    mb="xs"
                    {...form.getInputProps("employee_type")}
                    key={form.key("employee_type")}
                  />

                  <Select
                    label="Grade"
                    placeholder="Grade"
                    // searchable
                    data={grades}
                    mb="xs"
                    {...form.getInputProps("grade")}
                    key={form.key("grade")}
                  />
                  <DatePickerInput
                    type="range"
                    label="Joining Date"
                    placeholder="Joining Date (From, To)"
                    // value={value}
                    // onChange={setValue}
                    {...form.getInputProps("joining_date")}
                    key={form.key("joining_date")}
                  />
                </Grid.Col>
              </Grid>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item key="Attendance Info" value="Attendance Info">
            <Accordion.Control>Attendance Info</Accordion.Control>
            <Accordion.Panel>
              <Grid>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                  <DateInput
                    valueFormat="DD MMM YYYY"
                    label="From Date"
                    placeholder="DD MMM YYYY"
                    {...form.getInputProps("from_date")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                  <DateInput
                    valueFormat="DD MMM YYYY"
                    label="To Date"
                    placeholder="DD MMM YYYY"
                    {...form.getInputProps("to_date")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 12 }}>
                  <MultiSelect
                    label="Attendance Status"
                    placeholder="Attendance Status"
                    hidePickedOptions
                    data={attendanceStatus}
                    searchable
                    // withAsterisk
                    {...form.getInputProps("attendance_status")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 12 }}>
                  <MultiSelect
                    label="Attendance Mode"
                    placeholder="Attendance Mode"
                    hidePickedOptions
                    data={attendanceModes}
                    searchable
                    // withAsterisk
                    {...form.getInputProps("attendance_mode")}
                  />
                </Grid.Col>
              </Grid>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        <div className="d-flex justify-content-end">
          <Button variant="filled" size="sm" mt="sm" type="submit">
            Search
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FilterModal;
