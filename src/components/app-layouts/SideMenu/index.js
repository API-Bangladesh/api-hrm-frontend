"use client";

import React from "react";
import Link from "next/link";
import { LuNewspaper } from "react-icons/lu";
import { BiDevices } from "react-icons/bi";
import { LuListChecks } from "react-icons/lu";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { LuUser2 } from "react-icons/lu";
import { PiBuildings } from "react-icons/pi";
import { AiOutlinePartition } from "react-icons/ai";
import Accordion from "react-bootstrap/Accordion";
import classEase from "classease";
import { useSidebar } from "@/components/contexts/SidebarContext";
import { useUser } from "@/components/contexts/UserContext";
import { TbSettings } from "react-icons/tb";

const Page = () => {
  const { isSidebarOpen } = useSidebar();
  const { user } = useUser();
  const userId = user?.id;
  const role = user?.role;

  return (
    <>
      <div
        id="navigation_part"
        className={classEase(isSidebarOpen && "sidebarOpen", "side_nav")}
      >
        <div className="p-3">
          <div className="accordion_part">
            <div className="pb-2">
              <p className="menuTitle mb-0">Menu</p>
              <Accordion>
                {/* manu item 0 */}
                {role === "admin" && (
                  <Accordion.Item eventKey="0" className="pt-0">
                    <Accordion.Header className="p-0 m-0 text-capitalize">
                      <PiBuildings className="sideMenu menu_icon" />
                      <span className="text-capitalize sideMenu">
                        Company Setup
                      </span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <ul className="text-decoration-none mb-0 sidenav_submenu">
                        <li className="text-capitalize text-decoration-none sidenav_sub_item">
                          <Link
                            href="/basic-info"
                            className="text-decoration-none subMenu"
                          >
                            Basic info
                          </Link>
                        </li>
                        <li className="text-capitalize text-decoration-none sidenav_sub_item">
                          <Link
                            href="/branch"
                            className="text-decoration-none subMenu"
                          >
                            Branches
                          </Link>
                        </li>
                        <li className="text-capitalize text-decoration-none sidenav_sub_item">
                          <Link
                            href="/departments"
                            className="text-decoration-none subMenu"
                          >
                            Departments
                          </Link>
                        </li>
                        <li className="text-capitalize text-decoration-none sidenav_sub_item">
                          <Link
                            href="/employee-group"
                            className="text-decoration-none subMenu"
                          >
                            Employee Groups
                          </Link>
                        </li>
                        <li className="text-capitalize text-decoration-none sidenav_sub_item">
                          <Link
                            href="/employee-grade"
                            className="text-decoration-none subMenu"
                          >
                            Employee Grades
                          </Link>
                        </li>
                        {/* <li className="text-capitalize text-decoration-none sidenav_sub_item">
                        <Link
                          href="/employee-group-and-grade"
                          className="text-decoration-none subMenu"
                        >
                          Employee Grades & Group
                        </Link>
                      </li> */}
                        <li className="text-capitalize text-decoration-none sidenav_sub_item">
                          <Link
                            href="/designation"
                            className="text-decoration-none subMenu"
                          >
                            Designations
                          </Link>
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                )}

                {/* manu item 1 */}
                {role === "admin" && (
                  <Accordion.Item eventKey="1" className="pt-0">
                    <Accordion.Header className="p-0 m-0 text-capitalize">
                      <AiOutlinePartition className="sideMenu menu_icon" />
                      <span className="text-capitalize sideMenu">Shifts</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <ul className="text-decoration-none mb-0 sidenav_submenu">
                        <li className="text-capitalize text-decoration-none sidenav_sub_item">
                          <Link
                            href="/shift-list"
                            className="text-decoration-none subMenu"
                          >
                            Shift List
                          </Link>
                        </li>
                        <li className="text-capitalize text-decoration-none sidenav_sub_item">
                          <Link
                            href="/assign-shift"
                            className="text-decoration-none subMenu"
                          >
                            Assign Shift
                          </Link>
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                )}

                {/* manu item 1 */}
                {role === "admin" && (
                  <Accordion.Item eventKey="2" className="pt-0">
                    <Accordion.Header className="p-0 m-0 text-capitalize">
                      <LuUser2 className="sideMenu menu_icon" />
                      <span className="text-capitalize sideMenu">Employee</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <ul className="text-decoration-none mb-0 sidenav_submenu">
                        <li className="text-capitalize text-decoration-none sidenav_sub_item">
                          <Link
                            href={`/profile/${userId}`}
                            className="text-decoration-none subMenu"
                          >
                            Profile
                          </Link>
                        </li>
                        <li className="text-capitalize text-decoration-none sidenav_sub_item">
                          <Link
                            href="/employees"
                            className="text-decoration-none subMenu"
                          >
                            All employees
                          </Link>
                        </li>
                        <li className="text-capitalize text-decoration-none sidenav_sub_item">
                          <Link
                            href="/employee-transition"
                            className="text-decoration-none subMenu"
                          >
                            Employee Transition
                          </Link>
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                )}

                {/* manu item 2 */}
                <Accordion.Item eventKey="3" className="pt-0">
                  <Accordion.Header className="p-0 m-0 text-capitalize">
                    <LuNewspaper className="sideMenu menu_icon" />
                    <span className="text-capitalize sideMenu">Leave</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <ul className="text-decoration-none mb-0 sidenav_submenu">
                      {(role === "admin" || role === "employee") && (
                        <li className="text-capitalize text-decoration-none sidenav_sub_item">
                          <Link
                            href="/holiday-list"
                            className="text-decoration-none subMenu"
                          >
                            Holiday list
                          </Link>
                        </li>
                      )}
                      {role === "admin" && (
                        <li className="text-capitalize text-decoration-none sidenav_sub_item">
                          <Link
                            href="/leave-policy"
                            className="text-decoration-none subMenu"
                          >
                            Leave policy List
                          </Link>
                        </li>
                      )}
                      {role === "admin" && (
                        <li className="text-capitalize text-decoration-none sidenav_sub_item">
                          <Link
                            href="/leave-policy-assign"
                            className="text-decoration-none subMenu"
                          >
                            Leave Policy Assign
                          </Link>
                        </li>
                      )}
                      {/* <li className="text-capitalize text-decoration-none sidenav_sub_item">
                        <Link
                          href="/leave-allocation-request"
                          className="text-decoration-none subMenu"
                        >
                          Leave Allocation Request
                        </Link>
                      </li> */}
                      <li className="text-capitalize text-decoration-none sidenav_sub_item">
                        <Link
                          href="/my-leave-request"
                          className="text-decoration-none subMenu"
                        >
                          My Leave Request
                        </Link>
                      </li>
                      {role === "admin" && (
                        <li className="text-capitalize text-decoration-none sidenav_sub_item">
                          <Link
                            href="/leave-request"
                            className="text-decoration-none subMenu"
                          >
                            Leave Request
                          </Link>
                        </li>
                      )}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>

                {/* manu item 3 */}
                {role === "admin" && (
                  <Accordion.Item eventKey="4" className="pt-0">
                    <Accordion.Header className="p-0 m-0 text-capitalize">
                      <FaRegMoneyBillAlt className="sideMenu menu_icon" />
                      <span className="text-capitalize sideMenu">Payroll</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <ul className="text-decoration-none mb-0 sidenav_submenu">
                        <li className="text-capitalize text-decoration-none sidenav_sub_item">
                          <Link
                            href="/create-payroll"
                            className="text-decoration-none subMenu"
                          >
                            Create Payroll
                          </Link>
                        </li>
                        <li className="text-capitalize text-decoration-none sidenav_sub_item">
                          <Link
                            href="/salary-slip-create"
                            className="text-decoration-none subMenu"
                          >
                            Create Salary Slip
                          </Link>
                        </li>

                        <li className="text-capitalize text-decoration-none sidenav_sub_item">
                          <Link
                            href="/payslip"
                            className="text-decoration-none subMenu"
                          >
                            payslip
                          </Link>
                        </li>
                        <Accordion>
                          <Accordion.Item eventKey="0" className="pt-0">
                            <Accordion.Header className=" p-0 m-0 text-capitalize subTab">
                              {/* <LuUser2 className="sideMenu menu_icon" /> */}
                              <span className="text-capitalize sideMenu">
                                Earnings
                              </span>
                            </Accordion.Header>
                            <Accordion.Body>
                              <ul className="text-decoration-none mb-0 sidenav_submenu">
                                <li className="text-capitalize text-decoration-none sidenav_sub_item">
                                  <Link
                                    href="/create-allowance"
                                    className="text-decoration-none subMenu"
                                  >
                                    Create Allowance
                                  </Link>
                                </li>
                                <li className="text-capitalize text-decoration-none sidenav_sub_item">
                                  <Link
                                    href="/assign-allowance"
                                    className="text-decoration-none subMenu"
                                  >
                                    Assign Allowance
                                  </Link>
                                </li>
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                          <Accordion.Item eventKey="1" className="pt-0">
                            <Accordion.Header className="p-0 m-0 text-capitalize subTab">
                              {/* <LuUser2 className="sideMenu menu_icon" /> */}
                              <span className="text-capitalize sideMenu">
                                Deductions
                              </span>
                            </Accordion.Header>
                            <Accordion.Body>
                              <ul className="text-decoration-none mb-0 sidenav_submenu">
                                <li className="text-capitalize text-decoration-none sidenav_sub_item">
                                  <Link
                                    href="/create-deductions"
                                    className="text-decoration-none subMenu"
                                  >
                                    Create Deductions
                                  </Link>
                                </li>
                                <li className="text-capitalize text-decoration-none sidenav_sub_item">
                                  <Link
                                    href="/assign-deductions"
                                    className="text-decoration-none subMenu"
                                  >
                                    Assign Deductions
                                  </Link>
                                </li>
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </ul>
                      <ul className="text-decoration-none mb-0 sidenav_submenu">
                        <li className="text-capitalize text-decoration-none sidenav_sub_item">
                          <Link
                            href="/income-tax"
                            className="text-decoration-none subMenu"
                          >
                            Income Tax
                          </Link>
                        </li>
                        <li className="text-capitalize text-decoration-none sidenav_sub_item">
                          <Link
                            href="/incentives-and-bonuses"
                            className="text-decoration-none subMenu"
                          >
                            Incentives And Bonuses
                          </Link>
                        </li>
                      </ul>
                      <ul className="text-decoration-none mb-0 sidenav_submenu">
                        <Accordion>
                          <Accordion.Item eventKey="0" className="pt-0">
                            <Accordion.Header className=" p-0 m-0 text-capitalize subTab">
                              {/* <LuUser2 className="sideMenu menu_icon" /> */}
                              <span className="text-capitalize sideMenu">
                                Loan / Fine
                              </span>
                            </Accordion.Header>
                            <Accordion.Body>
                              <ul className="text-decoration-none mb-0 sidenav_submenu">
                                <li className="text-capitalize text-decoration-none sidenav_sub_item">
                                  <Link
                                    href="/advance-salary"
                                    className="text-decoration-none subMenu"
                                  >
                                    Adv. Salary/Loan Request
                                  </Link>
                                </li>
                                <li className="text-capitalize text-decoration-none sidenav_sub_item">
                                  <Link
                                    href="/loan-management"
                                    className="text-decoration-none subMenu"
                                  >
                                    Adv. Salary/Loan Management
                                  </Link>
                                </li>
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                )}

                {/* manu item 4 */}
                <Accordion.Item eventKey="5" className="pt-0">
                  <Accordion.Header className="p-0 m-0 text-capitalize">
                    <LuListChecks className="sideMenu menu_icon" />
                    <span className="text-capitalize sideMenu">Attendance</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <ul className="text-decoration-none mb-0 sidenav_submenu">
                      <li className="text-capitalize text-decoration-none sidenav_sub_item">
                        <Link
                          href="/my-attendance"
                          className="text-decoration-none subMenu"
                        >
                          My Attendance
                        </Link>
                      </li>
                      <li className="text-capitalize text-decoration-none sidenav_sub_item">
                        <Link
                          href="/manual-attendance"
                          className="text-decoration-none subMenu"
                        >
                          Manual Attendance
                        </Link>
                      </li>
                      {/* <li className="text-capitalize text-decoration-none sidenav_sub_item">
                        <Link
                          href="/remote-attendance"
                          className="text-decoration-none subMenu"
                        >
                          Remote Attendance
                        </Link>
                      </li> */}
                      {/* <li className="text-capitalize text-decoration-none sidenav_sub_item">
                        <Link
                          href="/work-record"
                          className="text-decoration-none subMenu"
                        >
                          Work Record
                        </Link>
                      </li> */}
                      <li className="text-capitalize text-decoration-none sidenav_sub_item">
                        <Link
                          href="/raw-data"
                          className="text-decoration-none subMenu"
                        >
                          Log Data
                        </Link>
                      </li>
                      <li className="text-capitalize text-decoration-none sidenav_sub_item">
                        <Link
                          href="/attendance-report"
                          className="text-decoration-none subMenu"
                        >
                          Attendance Report
                        </Link>
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>

                {/* manu item 5 */}
                <Accordion.Item eventKey="6" className="pt-0">
                  <Accordion.Header className="p-0 m-0 text-capitalize">
                    <BiDevices className="sideMenu menu_icon" />
                    <span className="text-capitalize sideMenu">Device</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <ul className="text-decoration-none mb-0 sidenav_submenu">
                      <li className="text-capitalize text-decoration-none sidenav_sub_item">
                        <Link
                          href="/devices"
                          className="text-decoration-none subMenu"
                        >
                          Devices
                        </Link>
                      </li>
                      <li className="text-capitalize text-decoration-none sidenav_sub_item">
                        <Link
                          href="/groups"
                          className="text-decoration-none subMenu"
                        >
                          Device Groups
                        </Link>
                      </li>
                      <li className="text-capitalize text-decoration-none sidenav_sub_item">
                        <Link
                          href="/assign-device-to-group"
                          className="text-decoration-none subMenu"
                        >
                          Assign Device to Group
                        </Link>
                      </li>
                      <li className="text-capitalize text-decoration-none sidenav_sub_item">
                        <Link
                          href="/assign-employee-to-group"
                          className="text-decoration-none subMenu"
                        >
                          Assign Employee to Group
                        </Link>
                      </li>
                      <li className="text-capitalize text-decoration-none sidenav_sub_item">
                        <Link
                          href="/sync-log-data"
                          className="text-decoration-none subMenu"
                        >
                          Sync Log Data
                        </Link>
                      </li>
                      {/* <li className="text-capitalize text-decoration-none sidenav_sub_item">
                        <Link
                          href="/clear-raw-data"
                          className="text-decoration-none subMenu"
                        >
                          Clear Raw Data
                        </Link>
                      </li> */}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>

                {/* manu item 6 */}
                {role === "admin" && (
                  <Accordion.Item eventKey="7" className="pt-0">
                    <Accordion.Header className="p-0 m-0 text-capitalize">
                      <TbSettings className="sideMenu menu_icon" />
                      <span className="text-capitalize sideMenu">Settings</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <ul className="text-decoration-none mb-0 sidenav_submenu">
                        <li className="text-capitalize text-decoration-none sidenav_sub_item">
                          <Link
                            href="/general-settings"
                            className="text-decoration-none subMenu"
                          >
                            General Settings
                          </Link>
                        </li>
                        <li className="text-capitalize text-decoration-none sidenav_sub_item">
                          <Link
                            href="/user-role"
                            className="text-decoration-none subMenu"
                          >
                            User role
                          </Link>
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                )}
              </Accordion>

              {/* single menu */}
              {/* <Link href="/dashboard" className="p-0 m-0 text-capitalize">
                     <PiBuildings className="sideMenu menu_icon" />
                     <span className="text-capitalize sideMenu ms-2">
                        single menu
                     </span>
                  </Link> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
