"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { data } from "./data";
import { data2 } from "./data2";
import "@mantine/charts/styles.css";
import { Tabs, Table, Grid, Modal, Button } from "@mantine/core";
import { BarChart } from "@mantine/charts";
import PieChart from "../PieChart/index";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import { useDisclosure } from "@mantine/hooks";
import { HiArrowLongRight } from "react-icons/hi2";
import { CgFileDocument } from "react-icons/cg";
import { FcDocument } from "react-icons/fc";
import MonthlyAttendance from "./MonthlyAttendance";

const arrowIcon = <HiArrowLongRight />;

const leaveData = [
  {
    name: "G. M. Nazmul Hussain",
    requestType: "Regular Leave",
    leaveType: "Casual",
    fromDate: "Aug-08-2024",
    toDate: "Aug-08-2024",
    status: "Pending",
  },
  {
    name: "G. M. Nazmul Hussain",
    requestType: "Regular Leave",
    leaveType: "Casual",
    fromDate: "Aug-08-2024",
    toDate: "Aug-08-2024",
    status: "Pending",
  },
  {
    name: "G. M. Nazmul Hussain",
    requestType: "Regular Leave",
    leaveType: "Casual",
    fromDate: "Aug-08-2024",
    toDate: "Aug-08-2024",
    status: "Pending",
  },
  {
    name: "G. M. Nazmul Hussain",
    requestType: "Regular Leave",
    leaveType: "Casual",
    fromDate: "Aug-08-2024",
    toDate: "Aug-08-2024",
    status: "Pending",
  },
  {
    name: "G. M. Nazmul Hussain",
    requestType: "Regular Leave",
    leaveType: "Casual",
    fromDate: "Aug-08-2024",
    toDate: "Aug-08-2024",
    status: "Pending",
  },
];

const attendanceData = [
  {
    name: "Jiaur Rahman",
    date: "Aug-08-2024",
    inTime: "8:55",
    outTime: "6:15",
    shift: "Day",
    status: "Pending",
  },
  {
    name: "Jiaur Rahman",
    date: "Aug-08-2024",
    inTime: "8:55",
    outTime: "6:15",
    shift: "Day",
    status: "Pending",
  },
  {
    name: "Jiaur Rahman",
    date: "Aug-08-2024",
    inTime: "8:55",
    outTime: "6:15",
    shift: "Day",
    status: "Pending",
  },
  {
    name: "Jiaur Rahman",
    date: "Aug-08-2024",
    inTime: "8:55",
    outTime: "6:15",
    shift: "Day",
    status: "Pending",
  },
  {
    name: "Jiaur Rahman",
    date: "Aug-08-2024",
    inTime: "8:55",
    outTime: "6:15",
    shift: "Day",
    status: "Pending",
  },
];

const index = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const autoplay = useRef(Autoplay({ delay: 2000 }));

  // Table of Pending Leave Requests
  const pendingLeaveRequests = leaveData.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.requestType}</Table.Td>
      <Table.Td>{element.leaveType}</Table.Td>
      <Table.Td>{element.fromDate}</Table.Td>
      <Table.Td>{element.toDate}</Table.Td>
      <Table.Td>{element.status}</Table.Td>
    </Table.Tr>
  ));

  // Table of Pending Attendance Requests
  const pendingAttendanceRequests = attendanceData.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.date}</Table.Td>
      <Table.Td>{element.inTime}</Table.Td>
      <Table.Td>{element.outTime}</Table.Td>
      <Table.Td>{element.shift}</Table.Td>
      <Table.Td>{element.status}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Modal opened={opened} onClose={close} title="Notice" centered>
        <h4 className="mb-3 fs-5">Employee Summary</h4>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo
          laudantium ex veritatis amet consequatur magnam minus eos quas
          obcaecati maxime vel non impedit, labore odio atque quidem itaque
          quos? Molestias ullam cum, non maxime quis eveniet illum modi impedit
          distinctio consequuntur atque commodi natus id quod blanditiis,
          officia libero dolores cumque! Ipsam a aliquid enim reprehenderit
          nulla, veritatis totam asperiores. Consectetur porro numquam minus
          tempora consequuntur quibusdam accusantium dolorem facere aliquam vero
          natus tempore nobis distinctio officiis, vitae veniam ab amet. Ex
          nobis distinctio voluptate unde quo suscipit. Perspiciatis praesentium
          minus qui possimus eius fugit ex dolor temporibus deserunt corrupti?
        </p>
      </Modal>
      <Grid>
        <Grid.Col span={3}>
          <div className="itemCard h-100">
            <h5 className="mb-3 ">Notice Title Here</h5>
            <div className="noticeCardBox">
              <h5 className="leaveTitle text-center">Total Employee</h5>
              <h1 className="mb-0 text-center d-block leaveLeft">35</h1>
            </div>
            <div className="noticeCardBox">
              <h5 className="leaveTitle text-center">New Joined</h5>
              <h1 className="mb-0 text-center d-block leaveLeft">3</h1>
            </div>
            <div className="noticeCardBox">
              <h5 className="leaveTitle text-center">Resigned/Terminated</h5>
              <h1 className="mb-0 text-center d-block leaveLeft">2</h1>
            </div>
          </div>
        </Grid.Col>
        <Grid.Col span={6}>
          <div className="itemCard h-100">
            <h5 className="mb-3 text-center">Employee Attendance Summary</h5>
            <PieChart />
          </div>
        </Grid.Col>
        <Grid.Col span={3}>
          <div className="itemCard h-100 p-0 pb-5">
            <div className="viewBtnBox d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Notice Board</h5>
              <Button
                component={Link}
                href="/notices"
                size="sm"
                variant="light"
                rightSection={arrowIcon}
              >
                View All
              </Button>
            </div>
            <Carousel
              // withIndicators
              height={400}
              slideSize="20%"
              slideGap={0}
              loop
              align="start"
              slidesToScroll={1}
              // plugins={[autoplay.current]}
              // onMouseEnter={autoplay.current.stop}
              // onMouseLeave={autoplay.current.play}
              orientation="vertical"
            >
              <Carousel.Slide>
                <Button
                  onClick={open}
                  classNames={{
                    root: "rootBtn",
                    label: "labelBtn",
                    inner: "innerBtn",
                  }}
                >
                  <div className="buttonItem">
                    <CgFileDocument className="noticeIcon" />
                    <p className="noticTitle mb-0 text-start">
                      1. Lorem ipsum dolor sit amet, adipisicing elirdwe sit
                      amet, adipisicing elirdwe
                    </p>
                    <p className="noticDate mb-0 d-block text-start py-2">
                      02:10 PM | 21 Apr 2024
                    </p>
                  </div>
                </Button>
              </Carousel.Slide>
              <Carousel.Slide>
                <Button
                  onClick={open}
                  classNames={{
                    root: "rootBtn",
                    label: "labelBtn",
                    inner: "innerBtn",
                  }}
                >
                  <div className="buttonItem">
                    <CgFileDocument className="noticeIcon" />
                    <p className="noticTitle mb-0 text-start">
                      2. Lorem ipsum dolor sit amet, adipisicing elirdwe sit
                      amet, adipisicing elirdwe
                    </p>
                    <p className="noticDate mb-0 d-block text-start py-2">
                      02:10 PM | 21 Apr 2024
                    </p>
                  </div>
                </Button>
              </Carousel.Slide>
              <Carousel.Slide>
                <Button
                  onClick={open}
                  classNames={{
                    root: "rootBtn",
                    label: "labelBtn",
                    inner: "innerBtn",
                  }}
                >
                  <div className="buttonItem">
                    <CgFileDocument className="noticeIcon" />
                    <p className="noticTitle mb-0 text-start">
                      3. Lorem ipsum dolor sit amet, adipisicing elirdwe sit
                      amet, adipisicing elirdwe
                    </p>
                    <p className="noticDate mb-0 d-block text-start py-2">
                      02:10 PM | 21 Apr 2024
                    </p>
                  </div>
                </Button>
              </Carousel.Slide>
              <Carousel.Slide>
                <Button
                  onClick={open}
                  classNames={{
                    root: "rootBtn",
                    label: "labelBtn",
                    inner: "innerBtn",
                  }}
                >
                  <div className="buttonItem">
                    <CgFileDocument className="noticeIcon" />
                    <p className="noticTitle mb-0 text-start">
                      4. Lorem ipsum dolor sit amet, adipisicing elirdwe sit
                      amet, adipisicing elirdwe
                    </p>
                    <p className="noticDate mb-0 d-block text-start py-2">
                      02:10 PM | 21 Apr 2024
                    </p>
                  </div>
                </Button>
              </Carousel.Slide>
              <Carousel.Slide>
                <Button
                  onClick={open}
                  classNames={{
                    root: "rootBtn",
                    label: "labelBtn",
                    inner: "innerBtn",
                  }}
                >
                  <div className="buttonItem">
                    <CgFileDocument className="noticeIcon" />
                    <p className="noticTitle mb-0 text-start">
                      5. Lorem ipsum dolor sit amet, adipisicing elirdwe sit
                      amet, adipisicing elirdwe
                    </p>
                    <p className="noticDate mb-0 d-block text-start py-2">
                      02:10 PM | 21 Apr 2024
                    </p>
                  </div>
                </Button>
              </Carousel.Slide>
              <Carousel.Slide>
                <Button
                  onClick={open}
                  classNames={{
                    root: "rootBtn",
                    label: "labelBtn",
                    inner: "innerBtn",
                  }}
                >
                  <div className="buttonItem">
                    <CgFileDocument className="noticeIcon" />
                    <p className="noticTitle mb-0 text-start">
                      6. Lorem ipsum dolor sit amet, adipisicing elirdwe sit
                      amet, adipisicing elirdwe
                    </p>
                    <p className="noticDate mb-0 d-block text-start py-2">
                      02:10 PM | 21 Apr 2024
                    </p>
                  </div>
                </Button>
              </Carousel.Slide>
            </Carousel>
          </div>
        </Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col span={6}>
          <div className="itemCard mt-3">
            <h5 className="mb-3">Employee statistics</h5>
            <Tabs defaultValue="1">
              <Tabs.List>
                <Tabs.Tab value="1">By Job Status</Tabs.Tab>
                <Tabs.Tab value="2">By Designation</Tabs.Tab>
                <Tabs.Tab value="3">By Department</Tabs.Tab>
                <Tabs.Tab value="4">By Gender</Tabs.Tab>
                <Tabs.Tab value="5">By Religion</Tabs.Tab>
                <Tabs.Tab value="6">By Maritial Status</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="1">
                <div className="pt-5">
                  <BarChart
                    h={550}
                    data={data}
                    dataKey="post"
                    series={[{ name: "Employees" }]}
                    orientation="vertical"
                  />
                </div>
              </Tabs.Panel>
              <Tabs.Panel value="2">
                <div className="pt-5">
                  <BarChart
                    h={550}
                    data={data2}
                    dataKey="post"
                    series={[{ name: "Employees" }]}
                    orientation="vertical"
                  />
                </div>
              </Tabs.Panel>
              <Tabs.Panel value="3">
                <div className="pt-5">
                  <BarChart
                    h={550}
                    data={data}
                    dataKey="post"
                    series={[{ name: "Employees" }]}
                    orientation="vertical"
                  />
                </div>
              </Tabs.Panel>
              <Tabs.Panel value="4">
                <div className="pt-5">
                  <BarChart
                    h={550}
                    data={data2}
                    dataKey="post"
                    series={[{ name: "Employees" }]}
                    orientation="vertical"
                  />
                </div>
              </Tabs.Panel>
              <Tabs.Panel value="5">
                <div className="pt-5">
                  <BarChart
                    h={550}
                    data={data}
                    dataKey="post"
                    series={[{ name: "Employees" }]}
                    orientation="vertical"
                  />
                </div>
              </Tabs.Panel>
              <Tabs.Panel value="6">
                <div className="pt-5">
                  <BarChart
                    h={550}
                    data={data2}
                    dataKey="post"
                    series={[{ name: "Employees" }]}
                    orientation="vertical"
                  />
                </div>
              </Tabs.Panel>
            </Tabs>
          </div>
        </Grid.Col>
        <Grid.Col span={6}>
          <div className="itemCard viewTable mt-3">
            <div className="viewBtnBox px-0 pt-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Pending Leave Requests</h5>
              <Button
                component={Link}
                href="/leave-request"
                size="sm"
                variant="light"
                rightSection={arrowIcon}
              >
                View All
              </Button>
            </div>
            <div className="leavePolicyBox mb-3">
              <Table striped withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Employee Name</Table.Th>
                    <Table.Th>Request Type</Table.Th>
                    <Table.Th>Leave Type</Table.Th>
                    <Table.Th>From Date</Table.Th>
                    <Table.Th>To Date</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{pendingLeaveRequests}</Table.Tbody>
              </Table>
            </div>
          </div>
          <div className="itemCard viewTable mt-3">
            <div className="viewBtnBox px-0 pt-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Pending Attendance Requests</h5>
              <Button
                component={Link}
                href="/manual-attendance"
                size="sm"
                variant="light"
                rightSection={arrowIcon}
              >
                View All
              </Button>
            </div>
            <div className="leavePolicyBox mb-3">
              <Table striped withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Employee</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>In Time</Table.Th>
                    <Table.Th>Out Time</Table.Th>
                    <Table.Th>Shift</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{pendingAttendanceRequests}</Table.Tbody>
              </Table>
            </div>
          </div>
        </Grid.Col>

        <Grid.Col span={12}>
          <div className="itemCard">
            <MonthlyAttendance />
          </div>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default index;
