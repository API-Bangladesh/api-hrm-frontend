"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import useSWR from "swr";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Box,
  Select,
  Button,
  Group,
  PasswordInput,
  MultiSelect,
  Grid,
} from "@mantine/core";
import { toast } from "react-toastify";
import { fetcher, getData } from "@/lib/fetch";
import { formatDateToYYYYMMDD, getFullName } from "@/lib/helper";
import { employeeTypes } from "@/data";
import {
  validateEmployeeID,
  validateEmail,
  validatePhoneNumber,
} from "@/lib/validate";
import UserSelectItem from "@/components/utils/UserSelectItem";

const OfficeDetails = forwardRef(
  (
    {
      data,
      onNext,
      onBack,
      branches,
      setBranches,
      departments,
      setDepartments,
    },
    ref
  ) => {
    // const [branches, setBranches] = useState([]);
    // const [departments, setDepartments] = useState([]);

    const form = useForm({
      mode: "uncontrolled",
      initialValues: {
        ...data,
        joining_date: data?.joining_date ? new Date(data.joining_date) : null,
      },
      validate: {
        official_id: (value) =>
          !value
            ? "Official ID is required"
            : validateEmployeeID(value)
            ? null
            : "Invalid Official ID",
        official_email: (value) =>
          value && !validateEmail(value) ? "Invalid email" : null,
        official_phone: (value) =>
          value && !validatePhoneNumber(value) ? "Invalid phone number" : null,
        password: (value) => (!value ? "Password is required" : null),
        employee_type: (value) => (!value ? "Employee Type is required" : null),
        // company: (value) => (!value ? "Company is required" : null),
        // branch: (value) => (!value ? "Branch is required" : null),
        // department: (value) => (!value ? "Department is required" : null),
        designation: (value) => (!value ? "Designation is required" : null),
        shift: (value) => (!value ? "Shift is required" : null),
        ethnic_group: (value) =>
          !value || !value.length ? "Group is required" : null,
        joining_date: (value) => (!value ? "Joining date is required" : null),
        // supervisor: (value) => (!value ? "Supervisor is required" : null),
        // expense_approver: (value) =>
        //   !value ? "Expense approver is required" : null,
        // leave_approver: (value) =>
        //   !value ? "Leave approver is required" : null,
        // shift_request_approver: (value) =>
        //   !value ? "Shift request approver is required" : null,
      },
    });

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
      data: rolesData,
      error: rolesError,
      isLoading: isRolesLoading,
    } = useSWR(`/api/user/get-rolepermission/`, fetcher, {
      errorRetryCount: 2,
      keepPreviousData: true,
    });

    const roles = rolesData?.data?.result?.map((item) => ({
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
      // label: getFullName(item?.first_name, item?.last_name),
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

    // useEffect(() => {
    //   if (form.values.company) {
    //     fetchBranches(form.values.company);
    //   } else {
    //     form.setFieldValue("branch", null);
    //     setBranches([]);
    //   }
    // }, [form.values.company]);

    const fetchDepartments = async (companyId, branchId) => {
      try {
        const response = await getData(
          `/api/department/get-department/?company=${companyId}&branch=${branchId}`
        );
        console.log(response);
        const departmentData = response?.data?.data?.result.map(
          (department) => ({
            label: department?.name?.toString() || "",
            value: department?.id.toString() || "",
          })
        );
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

    // useEffect(() => {
    //   if (form.values.branch) {
    //     fetchDepartments(form.values.company, form.values.branch);
    //     form.setFieldValue("department", null);
    //   } else {
    //     form.setFieldValue("department", null);
    //     setDepartments([]);
    //   }
    // }, [form.values.company, form.values.branch]);

    useImperativeHandle(ref, () => ({
      validateStep: (updateFormData) => {
        const values = form.getValues();
        updateFormData(values);
        return form.isValid();
      },
      showValidationErrors: () => {
        form.validate();
      },
    }));

    const handleSubmit = (values) => {
      const formattedDate = formatDateToYYYYMMDD(values.joining_date);
      onNext({ ...values, joining_date: formattedDate });
    };

    return (
      <>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Grid gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }}>
            <Grid.Col span={6}>
              <Box className="stepBox">
                <div className="d-flex align-items-start w-100 cust_mt">
                  <div className="cust_iputLabel">
                    <span className="requiredInput">Employee ID</span>
                  </div>
                  <TextInput
                    classNames={{
                      root: "w-100",
                      wrapper: "cust_iputWrapper",
                    }}
                    // label="Employee ID"
                    placeholder="Ex: API2307047"
                    {...form.getInputProps("official_id")}
                  />
                </div>

                <div className="d-flex align-items-start w-100 cust_mt">
                  <div className="cust_iputLabel">Official Email</div>
                  <TextInput
                    classNames={{
                      root: "w-100",
                      wrapper: "cust_iputWrapper",
                    }}
                    // mt="sm"
                    // label="Official Email"
                    placeholder="Official Email"
                    {...form.getInputProps("official_email")}
                  />
                </div>

                <div className="d-flex align-items-start w-100 cust_mt">
                  <div className="cust_iputLabel">Official Phone</div>
                  <TextInput
                    classNames={{
                      root: "w-100",
                      wrapper: "cust_iputWrapper",
                    }}
                    placeholder="Official Phone"
                    {...form.getInputProps("official_phone")}
                  />
                </div>
                <div className="d-flex align-items-start w-100 cust_mt">
                  <div className="cust_iputLabel">
                    <span className="requiredInput">Password</span>
                  </div>
                  <PasswordInput
                    classNames={{
                      root: "w-100",
                      wrapper: "cust_iputWrapper",
                    }}
                    // mt="sm"
                    // label="Password"
                    placeholder="Password"
                    {...form.getInputProps("password")}
                  />
                </div>
                <div className="d-flex align-items-start w-100 cust_mt">
                  <div className="cust_iputLabel">
                    <span className="requiredInput">Employee Type</span>
                  </div>
                  <Select
                    classNames={{
                      root: "w-100",
                      wrapper: "cust_iputWrapper",
                    }}
                    // mt="sm"
                    // label="Employee Type"
                    searchable
                    placeholder="Employee Type"
                    data={employeeTypes}
                    {...form.getInputProps("employee_type")}
                  />
                </div>
                <div className="d-flex align-items-start w-100 cust_mt">
                  <div className="cust_iputLabel">Company</div>
                  <Select
                    classNames={{
                      root: "w-100",
                      wrapper: "cust_iputWrapper",
                    }}
                    // mt="sm"
                    // label="Company"
                    searchable
                    placeholder="Company"
                    data={companies}
                    {...form.getInputProps("company")}
                    key={form.key("company")}
                  />
                </div>
                <div className="d-flex align-items-start w-100 cust_mt">
                  <div className="cust_iputLabel">Branch</div>
                  <Select
                    classNames={{
                      root: "w-100",
                      wrapper: "cust_iputWrapper",
                    }}
                    // mt="sm"
                    // label="Branch"
                    searchable
                    placeholder="Branch"
                    data={branches}
                    {...form.getInputProps("branch")}
                    key={form.key("branch")}
                  />
                </div>
                <div className="d-flex align-items-start w-100 cust_mt">
                  <div className="cust_iputLabel">Department</div>
                  <Select
                    classNames={{
                      root: "w-100",
                      wrapper: "cust_iputWrapper",
                    }}
                    // mt="sm"
                    // label="Department"
                    searchable
                    placeholder="Department"
                    data={departments}
                    {...form.getInputProps("department")}
                    key={form.key("department")}
                  />
                </div>
                <div className="d-flex align-items-start w-100 cust_mt">
                  <div className="cust_iputLabel">
                    <span className="requiredInput">Designation</span>
                  </div>
                  <Select
                    classNames={{
                      root: "w-100",
                      wrapper: "cust_iputWrapper",
                    }}
                    // mt="sm"
                    // label="Designation"
                    searchable
                    placeholder="Designation"
                    data={designations}
                    {...form.getInputProps("designation")}
                    key={form.key("designation")}
                  />
                </div>
              </Box>
            </Grid.Col>
            <Grid.Col span={6}>
              <Box className="stepBox">
                <div className="d-flex align-items-start w-100 cust_mt">
                  <div className="cust_iputLabel">
                    <span className="requiredInput">Default Shift</span>
                  </div>
                  <Select
                    classNames={{
                      root: "w-100",
                      wrapper: "cust_iputWrapper",
                    }}
                    // mt="sm"
                    // label="Default Shift"
                    searchable
                    placeholder="Default Shift"
                    data={shifts}
                    {...form.getInputProps("shift")}
                    key={form.key("shift")}
                  />
                </div>

                <div className="d-flex align-items-start w-100 cust_mt">
                  <div className="cust_iputLabel">Grade</div>
                  <Select
                    classNames={{
                      root: "w-100",
                      wrapper: "cust_iputWrapper",
                    }}
                    searchable
                    placeholder="Grade"
                    data={grades}
                    {...form.getInputProps("grade")}
                    key={form.key("grade")}
                  />
                </div>

                <div className="d-flex align-items-start w-100 cust_mt">
                  <div className="cust_iputLabel">
                    <span className="requiredInput">User Role</span>
                  </div>
                  <MultiSelect
                    classNames={{
                      root: "w-100",
                      wrapper: "cust_iputWrapper",
                    }}
                    placeholder="User Role"
                    data={roles}
                    {...form.getInputProps("role_permission")}
                  />
                </div>

                <div className="d-flex align-items-start w-100 cust_mt">
                  <div className="cust_iputLabel">Official Note</div>
                  <TextInput
                    classNames={{
                      root: "w-100",
                      wrapper: "cust_iputWrapper",
                    }}
                    placeholder="Official Note"
                    {...form.getInputProps("official_note")}
                  />
                </div>

                <div className="d-flex align-items-start w-100 cust_mt">
                  <div className="cust_iputLabel">
                    <span className="requiredInput">Group</span>
                  </div>
                  <MultiSelect
                    classNames={{
                      root: "w-100",
                      wrapper: "cust_iputWrapper",
                    }}
                    placeholder="Group"
                    hidePickedOptions
                    data={groups}
                    {...form.getInputProps("ethnic_group")}
                  />
                </div>

                <div className="d-flex align-items-start w-100 cust_mt">
                  <div className="cust_iputLabel">
                    <span className="requiredInput">Joining Date</span>
                  </div>
                  <DateInput
                    classNames={{
                      root: "w-100",
                      wrapper: "cust_iputWrapper",
                    }}
                    // mt="sm"
                    // value={value}
                    // onChange={setValue}
                    // label="Joining Date"
                    placeholder="Joining Date"
                    {...form.getInputProps("joining_date")}
                    key={form.key("joining_date")}
                  />
                </div>
                <div className="d-flex align-items-start w-100 cust_mt">
                  <div className="cust_iputLabel">Supervisor</div>
                  <Select
                    classNames={{
                      root: "w-100",
                      wrapper: "cust_iputWrapper",
                    }}
                    // mt="sm"
                    // label="Supervisor"
                    placeholder="Supervisor"
                    searchable
                    nothingFoundMessage="Nothing found..."
                    data={employees}
                    {...form.getInputProps("supervisor")}
                    key={form.key("supervisor")}
                    renderOption={UserSelectItem}
                  />
                </div>
                <div className="d-flex align-items-start w-100 cust_mt">
                  <div className="cust_iputLabel">Expense Approver</div>
                  <Select
                    classNames={{
                      root: "w-100",
                      wrapper: "cust_iputWrapper",
                    }}
                    // mt="sm"
                    // label="Expense Approver"
                    placeholder="Expense Approver"
                    searchable
                    nothingFoundMessage="Nothing found..."
                    data={employees}
                    {...form.getInputProps("expense_approver")}
                    key={form.key("expense_approver")}
                    renderOption={UserSelectItem}
                  />
                </div>
                <div className="d-flex align-items-start w-100 cust_mt">
                  <div className="cust_iputLabel">Leave Approver</div>
                  <Select
                    classNames={{
                      root: "w-100",
                      wrapper: "cust_iputWrapper",
                    }}
                    // mt="sm"
                    // label="Leave Approver"
                    placeholder="Leave Approver"
                    searchable
                    nothingFoundMessage="Nothing found..."
                    data={employees}
                    {...form.getInputProps("leave_approver")}
                    key={form.key("leave_approver")}
                    renderOption={UserSelectItem}
                  />
                </div>
                <div className="d-flex align-items-start w-100 cust_mt">
                  <div className="cust_iputLabel">Shift Approver</div>
                  <Select
                    classNames={{
                      root: "w-100",
                      wrapper: "cust_iputWrapper",
                    }}
                    // mt="sm"
                    // label="Shift Approver"
                    placeholder="Shift Approver"
                    searchable
                    nothingFoundMessage="Nothing found..."
                    data={employees}
                    {...form.getInputProps("shift_request_approver")}
                    key={form.key("shift_request_approver")}
                    renderOption={UserSelectItem}
                  />
                </div>
              </Box>
            </Grid.Col>
          </Grid>

          <Group justify="left" mt="xl">
            <Button variant="default" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">Next step</Button>
          </Group>
        </form>
      </>
    );
  }
);

export default OfficeDetails;
