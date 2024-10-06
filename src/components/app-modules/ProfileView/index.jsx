"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  Button,
  Group,
  Select,
  Grid,
  NumberInput,
  ActionIcon,
  Checkbox,
  Modal,
  Tabs,
  Table,
  Text,
  Popover,
} from "@mantine/core";
import Breadcrumb from "@/components/utils/Breadcrumb";
import { TbEyeClosed } from "react-icons/tb";
import { CiCreditCard2 } from "react-icons/ci";
import { FaInfoCircle } from "react-icons/fa";
import { TimeInput } from "@mantine/dates";
import { IoTimeOutline } from "react-icons/io5";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import { TbSquareRoundedFilled } from "react-icons/tb";
import { TbSquareRounded } from "react-icons/tb";
import { RxPencil2 } from "react-icons/rx";
import { PiIdentificationCardLight } from "react-icons/pi";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { CiFileOn } from "react-icons/ci";
import { CiImageOn } from "react-icons/ci";
import { TbEdit } from "react-icons/tb";
import {
  getStoragePath,
  getFullName,
  getDate,
  generateAddressString,
  formatCurrency,
  generateGroupString,
  generateStringFromArray,
} from "@/lib/helper";
import ProfileEdit from "./ProfileEdit";
import ProfileImage from "./ProfileImage";
import NID from "./NID";
import Resume from "./Resume";
import Appointment from "./Appointment";
import ResetPassword from "./ResetPassword";
import PersonalDetails from "./PersonalDetails";
import OfficialDetails from "./OfficialDetails";
import SalaryLeaves from "./SalaryLeaves";
import EmergencyContact from "./EmergencyContact";
import Education from "./Education";
import Experience from "./Experience";
import Documents from "./Documents";
import SingleDocument from "./SingleDocument";

const ProfileView = ({ data }) => {
  console.log(data);
  const [profilePhoto, setProfilePhoto] = useState({
    user: data?.id,
    photo: data?.photo,
  });

  const [profile, setProfile] = useState(data);

  const [singleDocument, setSingleDocument] = useState(null);

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

  // for Modal
  const [profileOpened, { open: profileOpen, close: profileClose }] =
    useDisclosure(false);
  const [passwordOpened, { open: passwordOpen, close: passwordClose }] =
    useDisclosure(false);
  const [nidOpened, { open: nidOpen, close: nidClose }] = useDisclosure(false);
  const [resumeOpened, { open: resumeOpen, close: resumeClose }] =
    useDisclosure(false);
  const [
    appointmentOpened,
    { open: appointmentOpen, close: appointmentClose },
  ] = useDisclosure(false);

  const [
    singleDocumentOpened,
    { open: singleDocumentOpen, close: singleDocumentClose },
  ] = useDisclosure(false);

  const [
    personalDetailsOpened,
    { open: personalDetailsOpen, close: personalDetailsClose },
  ] = useDisclosure(false);
  const [
    officialDetailsOpened,
    { open: officialDetailsOpen, close: officialDetailsClose },
  ] = useDisclosure(false);
  const [
    salaryLeavesOpened,
    { open: salaryLeavesOpen, close: salaryLeavesClose },
  ] = useDisclosure(false);
  const [
    emergencyContactOpened,
    { open: emergencyContactOpen, close: emergencyContactClose },
  ] = useDisclosure(false);
  const [educationOpened, { open: educationOpen, close: educationClose }] =
    useDisclosure(false);
  const [experienceOpened, { open: experienceOpen, close: experienceClose }] =
    useDisclosure(false);
  const [
    profileImageOpened,
    { open: profileImageOpen, close: profileImageClose },
  ] = useDisclosure(false);
  const [documentsOpened, { open: documentsOpen, close: documentsClose }] =
    useDisclosure(false);

  // Table of Leave Policy

  // Data of Earning Policy
  const elements3 = [
    {
      earningComponent: "Basic",
      amount: "25000",
    },
    {
      earningComponent: "House Rent",
      amount: "12000",
    },
    {
      earningComponent: "Medical",
      amount: "5000",
    },
  ];

  // Table of Earning Policy
  const earningPolicyRows = elements3.map((element3, index) => (
    <Table.Tr key={index}>
      <Table.Td>{element3.earningComponent}</Table.Td>
      <Table.Td>{element3.amount}</Table.Td>
    </Table.Tr>
  ));

  // Data of Deduction Policy
  const elements4 = [
    {
      earningComponent: "Food",
      amount: "25000",
      consumedDays: "2",
      left: "10",
    },
    {
      earningComponent: "Absent",
      amount: "25000",
      consumedDays: "2",
      left: "10",
    },
  ];

  // Table of Deduction Policy
  const deductionPolicyRows = elements4.map((element4, index) => (
    <Table.Tr key={index}>
      <Table.Td>{element4.earningComponent}</Table.Td>
      <Table.Td>{element4.amount}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <ProfileEdit
        opened={profileOpened}
        close={profileClose}
        item={profile}
        setItem={setProfile}
        // mutate={mutate}
      />
      <ProfileImage
        opened={profileImageOpened}
        close={profileImageClose}
        item={profilePhoto}
        setItem={setProfilePhoto}
        // item={selectedDeleteItem}
        // mutate={mutate}
      />
      <ResetPassword
        opened={passwordOpened}
        close={passwordClose}
        item={profile?.id}
      />
      <NID
        opened={nidOpened}
        close={nidClose}
        // item={selectedDeleteItem}
        // mutate={mutate}
      />
      <SingleDocument
        opened={singleDocumentOpened}
        close={singleDocumentClose}
        document={singleDocument}
        // item={selectedDeleteItem}
        // mutate={mutate}
      />
      <Resume
        opened={resumeOpened}
        close={resumeClose}
        // item={selectedDeleteItem}
        // mutate={mutate}
      />
      <Appointment
        opened={appointmentOpened}
        close={appointmentClose}
        // item={selectedDeleteItem}
        // mutate={mutate}
      />
      <PersonalDetails
        opened={personalDetailsOpened}
        close={personalDetailsClose}
        item={profile}
        setItem={setProfile}
        // item={selectedDeleteItem}
        // mutate={mutate}
      />
      <OfficialDetails
        opened={officialDetailsOpened}
        close={officialDetailsClose}
        item={profile}
        setItem={setProfile}
      />
      <SalaryLeaves
        opened={salaryLeavesOpened}
        close={salaryLeavesClose}
        item={profile}
        setItem={setProfile}
      />
      <EmergencyContact
        opened={emergencyContactOpened}
        close={emergencyContactClose}
        item={profile}
        setItem={setProfile}
      />
      <Education
        opened={educationOpened}
        close={educationClose}
        item={profile}
        setItem={setProfile}
      />
      <Experience
        opened={experienceOpened}
        close={experienceClose}
        item={profile}
        setItem={setProfile}
      />
      <Documents
        opened={documentsOpened}
        close={documentsClose}
        item={profile}
        setItem={setProfile}
      />

      <Breadcrumb
        classNames={{
          root: "mb-4",
        }}
        title="Profile"
        items={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Profile" },
        ]}
      />

      <div className="itemCard position-relative">
        <button
          className="profileEditBtn"
          onClick={() => {
            // setSelectedDeleteItem(item);
            profileOpen();
          }}
          // handleClick={addOpen}
        >
          <RxPencil2 className="iconBtn" />
        </button>

        <Grid>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <div className="profileBox borderRight h-100 d-flex">
              <div className="profile position-relative">
                <Image
                  src={
                    profilePhoto?.photo
                      ? getStoragePath(profilePhoto?.photo)
                      : "/default-profile.png"
                  }
                  width={200}
                  height={200}
                  alt="profile_img"
                />
                <button
                  className="border-0 proOverly"
                  onClick={() => {
                    // setSelectedDeleteItem(item);
                    profileImageOpen();
                  }}
                  // handleClick={addOpen}
                >
                  <TbEdit className="iconBtn me-2 text-dark" />
                  Edit
                </button>
              </div>
              <div className="proInfo ms-4">
                <h3 className="employeeName mb-1">
                  {getFullName(profile?.first_name, profile?.last_name)}
                </h3>
                <h6 className="employeeDesig mb-1">
                  {profile?.designation?.name || ""}
                </h6>

                <p className="mb-1 mt-3">
                  <b>Employee ID : {profile?.official_id || ""}</b>
                </p>
                <p className="employeeText mb-1">
                  Department: {profile?.departmenttwo?.[0]?.name || "N/A"}
                </p>
                <p className="employeeText mb-1">
                  Date of Join : {getDate(profile?.joining_date)}
                </p>
                <p className="employeeText">
                  <span>Reset Password:</span>
                  <button
                    className="border-0 ms-2 px-2 py-1 sColor rounded-1"
                    onClick={() => {
                      // setSelectedDeleteItem(item);
                      passwordOpen();
                    }}
                    // handleClick={addOpen}
                  >
                    <TbEyeClosed className="iconBtn me-2 sColor" />
                    Reset
                  </button>
                </p>
              </div>
            </div>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
            <div className="employeeInfo h-100">
              <div className="d-flex">
                <p className="pTitle">Phone:</p>
                <p className="pText">
                  {profile?.personal_phone ? (
                    <Link
                      className="pText sColor"
                      href={`tel:${profile?.personal_phone}`}
                    >
                      {profile?.personal_phone}
                    </Link>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
              <div className="d-flex">
                <p className="pTitle">Email:</p>
                <p className="pText">
                  {profile?.personal_email ? (
                    <Link
                      className="pText sColor"
                      href={`mailto:${profile?.personal_email}`}
                    >
                      {profile?.personal_email}
                    </Link>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
              <div className="d-flex">
                <p className="pTitle">Date of Birth:</p>
                <p className="pText">{getDate(profile?.dob) || "N/A"}</p>
              </div>
              <div className="d-flex">
                <p className="pTitle">Gender:</p>
                <p className="pText">{profile?.gender || "N/A"}</p>
              </div>
              <div className="d-flex">
                <p className="pTitle">Blood Group:</p>
                <p className="pText">{profile?.blood_group || "N/A"}</p>
              </div>
              <div className="d-flex">
                <p className="pTitle">Marital Status:</p>
                <p className="pText">{profile?.marital_status || "N/A"}</p>
              </div>
              <div className="d-flex">
                <p className="pTitle">Supervisor:</p>
                <p className="pText">
                  {profile?.supervisor ? (
                    <div className="d-flex align-items-center">
                      <Image
                        className="reportsImg"
                        src={
                          profile?.supervisor?.photo
                            ? getStoragePath(profile?.supervisor?.photo)
                            : "/default-profile.png"
                        }
                        width={200}
                        height={200}
                        alt="profile_img"
                      />
                      <p className="pText sColor mb-0">
                        {getFullName(
                          profile?.supervisor?.first_name,
                          profile?.supervisor?.last_name
                        )}
                      </p>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
            </div>
          </Grid.Col>
        </Grid>
      </div>

      <div className="itemCard">
        <Tabs color="teal" defaultValue="1">
          <Tabs.List mb="md">
            <Tabs.Tab value="1" color="orange">
              Personal Details
            </Tabs.Tab>
            <Tabs.Tab value="2" color="orange">
              Official Details
            </Tabs.Tab>
            <Tabs.Tab value="3" color="orange">
              Salary and Leaves
            </Tabs.Tab>
            <Tabs.Tab value="4" color="orange">
              Emergency Contact
            </Tabs.Tab>
            <Tabs.Tab value="5" color="orange">
              Education & Experience
            </Tabs.Tab>
            <Tabs.Tab value="6" color="orange">
              Documents
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="1" pt="xs">
            <div className="position-relative">
              <button
                className="profileEditBtn top-0 end-0"
                onClick={() => {
                  // setSelectedDeleteItem(item);
                  personalDetailsOpen();
                }}
                // handleClick={addOpen}
              >
                <RxPencil2 className="iconBtn" />
              </button>
              <h4 className="mb-3">
                <TbSquareRoundedFilled className="roundIcon" />
                Personal Details
              </h4>
              <div className="employeeInfo">
                <p>
                  <span>Fathers Name:</span>
                  {profile?.fathers_name || ""}
                </p>
                <p>
                  <span>Mothers Name:</span>
                  {profile?.mothers_name || ""}
                </p>
                <p>
                  <span>Spouse Name:</span>
                  {profile?.spouse_name || "N/A"}
                </p>
                <p>
                  <span>Nationality:</span>
                  {profile?.nationality || "N/A"}
                </p>
                <p>
                  <span>Religion:</span>
                  {profile?.religion?.name || "N/A"}
                </p>
                <p>
                  <span>NID / Passport:</span>
                  {profile?.nid_passport_no || "N/A"}
                </p>
                <p>
                  <span>TIN No:</span>
                  {profile?.tin_no || "N/A"}
                </p>
                <p>
                  <span>Present Address:</span>
                  {generateAddressString(profile?.present_address || {})}
                </p>
                <p>
                  <span>Permanent Address:</span>
                  {generateAddressString(profile?.permanent_address || {})}
                </p>
              </div>
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="2" pt="xs">
            <Grid>
              <Grid.Col span={5}>
                <div className="position-relative">
                  <button
                    className="profileEditBtn top-0 end-3"
                    onClick={() => {
                      // setSelectedDeleteItem(item);
                      officialDetailsOpen();
                    }}
                    // handleClick={addOpen}
                  >
                    <RxPencil2 className="iconBtn" />
                  </button>
                  <h4 className="mb-3">
                    <TbSquareRoundedFilled className="roundIcon" />
                    Official Details
                  </h4>
                  <div className="employeeInfo">
                    <p>
                      <span>Official Email:</span>
                      {profile?.official_email || "N/A"}
                    </p>
                    <p>
                      <span>Official Phone:</span>
                      {profile?.official_phone || "N/A"}
                    </p>
                    <p>
                      <span>Employee Type:</span>
                      {profile?.employee_type || "N/A"}
                    </p>
                    <p>
                      <span>Company:</span>
                      {profile?.departmenttwo?.[0]?.branch?.company
                        ?.basic_information?.name || "N/A"}
                    </p>
                    <p>
                      <span>Branch:</span>
                      {profile?.departmenttwo?.[0]?.branch?.name || "N/A"}
                    </p>
                    <p>
                      <span>Default Shift:</span>
                      {profile?.shift?.name || "N/A"}
                    </p>
                    <p>
                      <span>Grade:</span>
                      {profile?.grade?.name || "N/A"}
                    </p>
                    <p>
                      <span>User Role:</span>
                      {profile?.role?.name || "N/A"}
                    </p>
                    <p>
                      <span>Official Note:</span>
                      {profile?.official_note || "N/A"}
                    </p>
                    <p>
                      <span>Group:</span>
                      {generateGroupString(profile?.ethnicgroup_user || [])}
                    </p>
                    <p>
                      <span>Expense Approver:</span>
                      {getFullName(
                        profile?.expense_approver?.first_name,
                        profile?.expense_approver?.last_name
                      )}
                    </p>
                    <p>
                      <span>Leave Approver:</span>
                      {getFullName(
                        profile?.leave_approver?.first_name,
                        profile?.leave_approver?.last_name
                      )}
                    </p>
                    <p>
                      <span>Shift Approver:</span>
                      {getFullName(
                        profile?.shift_request_approver?.first_name,
                        profile?.shift_request_approver?.last_name
                      )}
                    </p>
                  </div>
                </div>
              </Grid.Col>
              <Grid.Col span={7}>
                <div className="position-relative">
                  <h4 className="mb-3">
                    <TbSquareRoundedFilled className="roundIcon" />
                    Job History
                  </h4>
                  <div className="overflow-auto">
                    <Table striped withTableBorder withColumnBorders>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Transition Type</Table.Th>
                          <Table.Th>Designation</Table.Th>
                          <Table.Th>Department</Table.Th>
                          <Table.Th>Incremented Amount</Table.Th>
                          <Table.Th>Salary</Table.Th>
                          <Table.Th>Effective From</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      {profile?.employeejobhistory_user?.length ? (
                        <Table.Tbody>
                          {profile.employeejobhistory_user.map(
                            (item, index) => (
                              <Table.Tr key={index}>
                                <Table.Td>
                                  {generateStringFromArray(
                                    item?.status_adjustment || []
                                  )}
                                </Table.Td>
                                <Table.Td>
                                  {item?.designation?.name || ""}
                                </Table.Td>
                                <Table.Td>
                                  {item?.department?.name || ""}
                                </Table.Td>
                                <Table.Td>
                                  {formatCurrency(item?.increment_amount)}
                                </Table.Td>
                                <Table.Td>
                                  {formatCurrency(item?.salary)}
                                </Table.Td>
                                <Table.Td>
                                  {getDate(item?.effective_from)}
                                </Table.Td>
                              </Table.Tr>
                            )
                          )}
                        </Table.Tbody>
                      ) : (
                        ""
                      )}
                    </Table>
                  </div>
                </div>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>
          <Tabs.Panel value="3" pt="xs">
            <div className="position-relative">
              <button
                className="profileEditBtn top-0 end-0"
                onClick={() => {
                  // setSelectedDeleteItem(item);
                  salaryLeavesOpen();
                }}
                // handleClick={addOpen}
              >
                <RxPencil2 className="iconBtn" />
              </button>

              <Grid>
                <Grid.Col span={6}>
                  <h4 className="mb-3">
                    <TbSquareRoundedFilled className="roundIcon" />
                    Salary and Leaves
                  </h4>
                  <div className="employeeInfo">
                    <p>
                      <span>Payment In:</span>
                      {profile?.payment_in || "N/A"}
                    </p>
                    <p>
                      <span>Monthly Gross Salary:</span>
                      {formatCurrency(profile?.gross_salary)}
                    </p>
                    <p>
                      <span>Bank Name:</span>
                      {profile?.bank_account?.bank_name || "N/A"}
                    </p>
                    <p>
                      <span>Branch:</span>
                      {profile?.bank_account?.branch_name || "N/A"}
                    </p>
                    <p>
                      <span>Bank Account Type:</span>
                      {profile?.bank_account?.account_type?.name || "N/A"}
                    </p>
                    <p>
                      <span>Account No:</span>
                      {profile?.bank_account?.account_no || "N/A"}
                    </p>
                    <p>
                      <span>Routing No:</span>
                      {profile?.bank_account?.routing_no || "N/A"}
                    </p>
                    <p>
                      <span>SWIFT:</span>
                      {profile?.bank_account?.swift_bic || "N/A"}
                    </p>
                    <p>
                      <span>Bank Address:</span>
                      {generateAddressString(
                        profile?.bank_account?.address || {}
                      )}
                    </p>
                  </div>
                </Grid.Col>
                <Grid.Col span={6}>
                  {/* <h4 className="mb-3">
                    <TbSquareRoundedFilled className="roundIcon" />
                    Leave Policy
                  </h4> */}
                  <div className="leavePolicyBox mb-3">
                    <b className="mb-2 d-block text-dark">Leave Policy</b>
                    <Table striped withTableBorder withColumnBorders>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Leave Type</Table.Th>
                          <Table.Th>Allocation Days</Table.Th>
                          <Table.Th>Consumed Days</Table.Th>
                          <Table.Th>Left</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {profile?.leavesummary_user?.map((item, index) => (
                          <Table.Tr key={index}>
                            <Table.Td>{item?.leavepolicy?.name || 0}</Table.Td>
                            <Table.Td>{item?.total_allocation || 0}</Table.Td>
                            <Table.Td>{item?.total_consumed || 0}</Table.Td>
                            <Table.Td>{item?.total_left || 0}</Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </div>
                  <div className="leavePolicyBox mb-3">
                    <b className="mb-2 d-block text-dark">Earning Policy</b>
                    <Table striped withTableBorder withColumnBorders>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Earning Component</Table.Th>
                          <Table.Th>Amount</Table.Th>
                          {/* <Table.Th>Consumed Days</Table.Th>
                          <Table.Th>Left</Table.Th> */}
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>{earningPolicyRows}</Table.Tbody>
                    </Table>
                  </div>
                  <div className="leavePolicyBox mb-3">
                    <b className="mb-2 d-block text-dark">Deduction Policy</b>
                    <Table striped withTableBorder withColumnBorders>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Deduction Component</Table.Th>
                          <Table.Th>Amount</Table.Th>
                          {/* <Table.Th>Consumed Days</Table.Th>
                          <Table.Th>Left</Table.Th> */}
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>{deductionPolicyRows}</Table.Tbody>
                    </Table>
                  </div>
                </Grid.Col>
              </Grid>
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="4" pt="xs">
            <div className="position-relative">
              <button
                className="profileEditBtn top-0 end-0"
                onClick={() => {
                  // setSelectedDeleteItem(item);
                  emergencyContactOpen();
                }}
                // handleClick={addOpen}
              >
                <RxPencil2 className="iconBtn" />
              </button>
              <h4 className="mb-3">
                <TbSquareRoundedFilled className="roundIcon" />
                Emergency Contact
              </h4>
              {profile?.employee_contact?.length ? (
                <Grid>
                  {profile.employee_contact.map((contact, index) => (
                    <Grid.Col span={6} key={index}>
                      <div className="employeeInfo border p-3">
                        <p>
                          <span>Name:</span>
                          {contact?.name || ""}
                        </p>
                        <p>
                          <span>Age:</span>
                          {contact?.age || ""}
                        </p>
                        <p>
                          <span>Phone No:</span>
                          {contact?.phone_no || ""}
                        </p>
                        <p>
                          <span>Email:</span>
                          {contact?.email || ""}
                        </p>
                        <p>
                          <span>Relation:</span>
                          {contact?.relation || ""}
                        </p>
                        <p>
                          <span>Address:</span>
                          {generateAddressString(contact?.address || {})}
                        </p>
                      </div>
                    </Grid.Col>
                  ))}
                </Grid>
              ) : (
                ""
              )}
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="5" pt="xs">
            <Grid>
              <Grid.Col span={6}>
                <div className="position-relative">
                  <button
                    className="profileEditBtn top-0 end-3"
                    onClick={() => {
                      // setSelectedDeleteItem(item);
                      educationOpen();
                    }}
                    // handleClick={addOpen}
                  >
                    <RxPencil2 className="iconBtn" />
                  </button>
                  <h4 className="mb-3">
                    <TbSquareRoundedFilled className="roundIcon" />
                    Education
                  </h4>

                  {profile?.employee_academichistory?.length
                    ? profile.employee_academichistory.map((item, index) => (
                        <div className="employeeInfo borderLeft" key={index}>
                          <p>
                            <span>Certification:</span>
                            {item?.certification || ""}
                          </p>
                          <p>
                            <span>Institute:</span>
                            {item?.board_institute_name || ""}
                          </p>
                          <p>
                            <span>Level:</span>
                            {item?.level || ""}
                          </p>
                          <p>
                            <span>Grade:</span>
                            {item?.score_grade || ""}
                          </p>
                          <p>
                            <span>Passing Year:</span>
                            {item?.year_of_passing || ""}
                          </p>
                        </div>
                      ))
                    : ""}
                </div>
              </Grid.Col>
              <Grid.Col span={6}>
                <div className="position-relative">
                  <button
                    className="profileEditBtn top-0 end-0"
                    onClick={() => {
                      // setSelectedDeleteItem(item);
                      experienceOpen();
                    }}
                    // handleClick={addOpen}
                  >
                    <RxPencil2 className="iconBtn" />
                  </button>
                  <h4 className="mb-3">
                    <TbSquareRoundedFilled className="roundIcon" />
                    Experience
                  </h4>

                  {profile?.employee_experiencehistory?.length
                    ? profile.employee_experiencehistory.map((item, index) => (
                        <div key={index} className="employeeInfo borderLeft">
                          <p>
                            <span>Company Name:</span>
                            {item?.company_name || ""}
                          </p>
                          <p>
                            <span>Designation:</span>
                            {item?.designation || ""}
                          </p>
                          <p>
                            <span>Address:</span>
                            {item?.address || ""}
                          </p>
                          <p>
                            <span>From:</span>
                            {item?.from_date ? getDate(item?.from_date) : ""}
                          </p>
                          <p>
                            <span>To:</span>
                            {item?.to_date ? getDate(item?.to_date) : ""}
                          </p>
                        </div>
                      ))
                    : ""}
                </div>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>
          <Tabs.Panel value="6" pt="xs">
            <div className="position-relative">
              <button
                className="profileEditBtn top-0 end-0"
                onClick={() => {
                  // setSelectedDeleteItem(item);
                  documentsOpen();
                }}
                // handleClick={addOpen}
              >
                <RxPencil2 className="iconBtn" />
              </button>
              <h4 className="mb-3">
                <TbSquareRoundedFilled className="roundIcon" />
                Documents
              </h4>
              <div className="d-flex flex-wrap">
                {profile?.employee_docs?.length
                  ? profile?.employee_docs.map((doc, index) => (
                      <a
                        key={index}
                        className="docItem me-4 mb-4"
                        href={getStoragePath(doc?.attachment)}
                        target="_blank"
                      >
                        {doc?.title === "NID/Passport" ? (
                          <CiCreditCard2 className="docBtn" />
                        ) : doc?.title === "Resume" ? (
                          <PiIdentificationCardLight className="docBtn" />
                        ) : doc?.title === "Appointment Letter" ? (
                          <CiFileOn className="docBtn fs-2" />
                        ) : (
                          <CiFileOn className="docBtn fs-2" />
                        )}
                        <h6>{doc?.title || "N/A"}</h6>
                      </a>
                    ))
                  : ""}

                {/* <button
                  key={index}
                  className="docItem me-4 mb-4"
                  onClick={() => {
                    setSingleDocument({
                      title: doc?.title,
                      attachment: doc?.attachment,
                    });
                    singleDocumentOpen();
                  }}
                >
                  {doc?.title === "NID/Passport" ? (
                    <CiCreditCard2 className="docBtn" />
                  ) : doc?.title === "Resume" ? (
                    <PiIdentificationCardLight className="docBtn" />
                  ) : doc?.title === "Appointment Letter" ? (
                    <CiFileOn className="docBtn fs-2" />
                  ) : (
                    <CiFileOn className="docBtn fs-2" />
                  )}
                  <h6>{doc?.title || "N/A"}</h6>
                </button> */}

                {/* <button
                  className="docItem me-4"
                  onClick={() => {
                    nidOpen();
                  }}
                >
                  <CiCreditCard2 className="docBtn" />
                  <h6>NID/Passport</h6>
                </button> */}
                {/* <button
                  className="docItem me-4"
                  onClick={() => {
                    resumeOpen();
                  }}
                >
                  <PiIdentificationCardLight className="docBtn" />
                  <h6>Resume</h6>
                </button> */}
                {/* <button
                  className="docItem me-4"
                  onClick={() => {
                    appointmentOpen();
                  }}
                >
                  <CiFileOn className="docBtn fs-2" />
                  <h6>Appointment Letter</h6>
                </button> */}
              </div>
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  );
};

export default ProfileView;
