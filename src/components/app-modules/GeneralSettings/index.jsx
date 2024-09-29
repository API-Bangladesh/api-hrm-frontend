"use client";

import React, { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { useForm } from "@mantine/form";
import { TimeInput } from "@mantine/dates";
import {
  Button,
  Group,
  Select,
  Grid,
  NumberInput,
  ActionIcon,
  Checkbox,
  Loader,
  Alert,
} from "@mantine/core";
import { IoTimeOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import Breadcrumb from "@/components/utils/Breadcrumb";
import { update } from "@/lib/submit";
import { fetcher } from "@/lib/fetch";
import { formatTime } from "@/lib/helper";

const fiscalYearMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weeklyHolidays = [
  { id: 7, name: "Friday" },
  { id: 1, name: "Saturday" },
  { id: 2, name: "Sunday" },
  { id: 3, name: "Monday" },
  { id: 4, name: "Tuesday" },
  { id: 5, name: "Wednesday" },
  { id: 6, name: "Thursday" },
];

const attendanceOptions = ["Disabled", "Overtime"];

const GeneralSettings = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      weekly_holiday: {
        Saturday: false,
        Sunday: false,
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
      },
      fiscalyear_month: "",
      workingday_starts_at: "",
      basic_salary_percentage: "",
      holiday_as_workingday: false,
      consecutive_days_late_attendance_to_fine: "",
      consecutive_late_attendance_to_fine: "",
      fraction_of_daily_salary_for_halfday: "",
      max_working_hours_against_timesheet: "",
      consider_attendance_on_holidays: "",
      allow_overtime: false,
    },
  });

  const { data, error, isLoading, mutate } = useSWR(
    `/api/hrm_settings/get-generalsettings/`,
    fetcher,
    {
      errorRetryCount: 2,
      keepPreviousData: true,
    }
  );

  // console.log(data);

  useEffect(() => {
    if (data) {
      form.setValues({
        weekly_holiday: {
          Saturday:
            data?.weekly_holiday?.day?.some(
              (item) => item.day === "Saturday"
            ) || false,
          Sunday:
            data?.weekly_holiday?.day?.some((item) => item.day === "Sunday") ||
            false,
          Monday:
            data?.weekly_holiday?.day?.some((item) => item.day === "Monday") ||
            false,
          Tuesday:
            data?.weekly_holiday?.day?.some((item) => item.day === "Tuesday") ||
            false,
          Wednesday:
            data?.weekly_holiday?.day?.some(
              (item) => item.day === "Wednesday"
            ) || false,
          Thursday:
            data?.weekly_holiday?.day?.some(
              (item) => item.day === "Thursday"
            ) || false,
          Friday:
            data?.weekly_holiday?.day?.some((item) => item.day === "Friday") ||
            false,
        },
        fiscalyear_month: data.fiscalyear_month || "",
        workingday_starts_at: data.workingday_starts_at || "",
        basic_salary_percentage: data.basic_salary_percentage || "",
        holiday_as_workingday: data.holiday_as_workingday || false,
        consecutive_days_late_attendance_to_fine:
          data.consecutive_days_late_attendance_to_fine || "",
        consecutive_late_attendance_to_fine:
          data.consecutive_late_attendance_to_fine || "",
        fraction_of_daily_salary_for_halfday:
          data.fraction_of_daily_salary_for_halfday || "",
        max_working_hours_against_timesheet:
          data.max_working_hours_against_timesheet || "",
        consider_attendance_on_holidays:
          data.consider_attendance_on_holidays || "",
        allow_overtime: data.allow_overtime || false,
      });
    }
  }, [data]);

  // console.log(form.values);

  const handleSubmit = async (values) => {
    const weeklyHolidayArray = Object.keys(values.weekly_holiday)
      .filter((day) => values.weekly_holiday[day])
      .map((day) => weeklyHolidays.find((holiday) => holiday.name === day)?.id);

    const formattedValues = {
      ...values,
      workingday_starts_at: formatTime(values.workingday_starts_at),
      weekly_holiday: weeklyHolidayArray,
    };

    setIsSubmitting(true);

    try {
      const response = await update(
        `/api/hrm_settings/update-generalsettings/${data?.id}`,
        formattedValues
      );

      if (response?.status === "success") {
        // console.log(response);
        setIsSubmitting(false);
        // close();
        mutate();
        toast.success("Settings updated successfully!");
      } else {
        toast.error(
          response?.status === "error"
            ? response?.message[0]
            : "Error submitting form"
        );
      }
      setTimeout(() => {
        setIsSubmitting(false);
        mutate();
      }, 500);
    } catch (error) {
      console.error("Error submitting form:", error);
      setTimeout(() => {
        setIsSubmitting(false);
        mutate();
      }, 500);
      toast.error("Failed to update settings.");
    }
  };

  const refTimeIn = useRef(null);
  const timeIn = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => refTimeIn.current?.showPicker()}
    >
      <IoTimeOutline />
    </ActionIcon>
  );

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Alert color="red">Failed to load settings</Alert>;
  }

  return (
    <>
      <Breadcrumb
        classNames={{
          root: "mb-4",
        }}
        title="General Settings"
        items={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "General Settings" },
        ]}
      />

      <div className="itemCard">
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Grid gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }}>
            <Grid.Col span={4}>
              <div className="border px-4 py-3 h-100">
                <Select
                  mb="sm"
                  label="Fiscal Year Start from Month"
                  placeholder="Pick value"
                  required={true}
                  disabled={isSubmitting}
                  data={fiscalYearMonths}
                  {...form.getInputProps("fiscalyear_month")}
                  key={form.key("fiscalyear_month")}
                />
                <TimeInput
                  mb="sm"
                  label="Working Day Starts At"
                  ref={refTimeIn}
                  rightSection={timeIn}
                  required={true}
                  disabled={isSubmitting}
                  {...form.getInputProps("workingday_starts_at")}
                  key={form.key("workingday_starts_at")}
                />
                <NumberInput
                  mb="sm"
                  label="Set the percentage(%) of the basic salary against the gross salary"
                  placeholder="default 60"
                  hideControls
                  required={true}
                  disabled={isSubmitting}
                  {...form.getInputProps("basic_salary_percentage")}
                  key={form.key("basic_salary_percentage")}
                />
                <NumberInput
                  mb="sm"
                  label="Number of consecutive late attendance to fine"
                  placeholder="default 3"
                  hideControls
                  required={true}
                  disabled={isSubmitting}
                  {...form.getInputProps(
                    "consecutive_days_late_attendance_to_fine"
                  )}
                  key={form.key("consecutive_days_late_attendance_to_fine")}
                />
                <NumberInput
                  mb="sm"
                  label="Consecutive late attendance fine amount against the fraction of daily salary (%)"
                  placeholder="default 100%"
                  hideControls
                  required={true}
                  disabled={isSubmitting}
                  {...form.getInputProps("consecutive_late_attendance_to_fine")}
                  key={form.key("consecutive_late_attendance_to_fine")}
                />
                <div className="holidayBox mb-3">
                  <p className="mb-1">Weekly Holidays</p>
                  <Grid gutter="xs">
                    {weeklyHolidays.map((day) => (
                      <Grid.Col span={4}>
                        <Checkbox
                          // key={day.id}
                          key={form.key(`weekly_holiday.${day.name}`)}
                          me="lg"
                          mb="sm"
                          label={day.name}
                          disabled={isSubmitting}
                          {...form.getInputProps(`weekly_holiday.${day.name}`, {
                            type: "checkbox",
                          })}
                        />
                      </Grid.Col>
                    ))}
                  </Grid>
                </div>
              </div>
            </Grid.Col>
            <Grid.Col span={4}>
              <div className="border px-4 py-3 h-100">
                <NumberInput
                  mb="sm"
                  label="Fraction of Daily Salary for Half Day"
                  placeholder="default 50%"
                  hideControls
                  required={true}
                  disabled={isSubmitting}
                  {...form.getInputProps(
                    "fraction_of_daily_salary_for_halfday"
                  )}
                  key={form.key("fraction_of_daily_salary_for_halfday")}
                />
                <NumberInput
                  mb="sm"
                  label="Max working hours against Timesheet"
                  placeholder="default 8 hours"
                  hideControls
                  required={true}
                  disabled={isSubmitting}
                  {...form.getInputProps("max_working_hours_against_timesheet")}
                  key={form.key("max_working_hours_against_timesheet")}
                />
                <Select
                  mb="sm"
                  label="Consider Attendance on Holidays"
                  placeholder="Pick value"
                  required={true}
                  disabled={isSubmitting}
                  data={attendanceOptions}
                  {...form.getInputProps("consider_attendance_on_holidays")}
                  key={form.key("consider_attendance_on_holidays")}
                />
                <Checkbox
                  mb="sm"
                  label="Include Holidays as Working Days"
                  disabled={isSubmitting}
                  {...form.getInputProps("holiday_as_workingday", {
                    type: "checkbox",
                  })}
                  key={form.key("holiday_as_workingday")}
                />
                <Checkbox
                  mb="sm"
                  label="Allow Overtime"
                  disabled={isSubmitting}
                  {...form.getInputProps("allow_overtime", {
                    type: "checkbox",
                  })}
                  key={form.key("allow_overtime")}
                />
              </div>
            </Grid.Col>
          </Grid>

          <Group>
            <Button
              mt="lg"
              type="submit"
              loading={isSubmitting}
              loaderProps={{ type: "dots" }}
            >
              Save
            </Button>
          </Group>
        </form>
      </div>
    </>
  );
};

export default GeneralSettings;
