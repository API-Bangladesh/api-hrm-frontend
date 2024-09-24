import React, { useState } from "react";
import { Grid } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { MdOutlineCalendarMonth } from "react-icons/md";

const MonthlyAttendance = () => {
  const dateIcon = <MdOutlineCalendarMonth />;
  const [value, setValue] = useState(null);

  return (
    <>
      <Grid>
        <Grid.Col span={6}>
          <h4 className="mb-0">Monthly Attendance</h4>
        </Grid.Col>
        <Grid.Col span={6}>
          <div className="d-flex align-items-center justify-content-end">
            <p className="mb-0 me-3">Select Month</p>
            <MonthPickerInput
              rightSection={dateIcon}
              rightSectionPointerEvents="none"
              styles={{
                root: { width: "200px" },
              }}
              // label="Pick date"
              placeholder="Pick date"
              value={value}
              onChange={setValue}
            />
          </div>
        </Grid.Col>
      </Grid>
      <div className="calenderBox">
        <div className="colorBox mb-4 mt-5">
          <div className="d-flex align-items-center">
            <span className="bg_Present"></span>
            <p>Present</p>
          </div>
          <div className="d-flex align-items-center ms-3">
            <span className="bg_Absent"></span>
            <p>Absent</p>
          </div>
          <div className="d-flex align-items-center ms-3">
            <span className="bg_Leave"></span>
            <p>Leave</p>
          </div>
          <div className="d-flex align-items-center ms-3">
            <span className="bg_HalfPresent"></span>
            <p>Half Present</p>
          </div>
          <div className="d-flex align-items-center ms-3">
            <span className="bg_LateAttendance"></span>
            <p>Late Attendance</p>
          </div>
          <div className="d-flex align-items-center ms-3">
            <span className="bg_EarlyLeave"></span>
            <p>Early Leave</p>
          </div>
          <div className="d-flex align-items-center ms-3">
            <span className="bg_Overtime"></span>
            <p>Overtime</p>
          </div>
          <div className="d-flex align-items-center ms-3">
            <span className="bg_HollyDay"></span>
            <p>Holiday</p>
          </div>
          <div className="d-flex align-items-center ms-3">
            <span className="bg_Running"></span>
            <p>Incomplete</p>
          </div>
        </div>
        <div className="dayName">
          <div className="name">Sunday</div>
          <div className="name">Monday</div>
          <div className="name">Tuesday</div>
          <div className="name">Wednesday</div>
          <div className="name">Thursday</div>
          <div className="name">Friday</div>
          <div className="name">Saturday</div>
        </div>
        <div className="dateBox">
          <div className="day bg_Present">
            <p className="date">1</p>
            <b>P</b>
          </div>
          <div className="day bg_Absent">
            <p className="date">2</p>
            <b>A</b>
          </div>
          <div className="day">
            <p className="date">3</p>
            <b>P</b>
          </div>
          <div className="day bg_Leave">
            <p className="date">4</p>
            <b>L</b>
          </div>
          <div className="day">
            <p className="date">5</p>
            <b>P</b>
          </div>
          <div className="day bg_HollyDay">
            <p className="date">6</p>
            <b>H</b>
          </div>
          <div className="day">
            <p className="date">7</p>
            <b>P</b>
          </div>
          <div className="day">
            <p className="date">8</p>
            <b>P</b>
          </div>
          <div className="day">
            <p className="date">9</p>
            <b>P</b>
          </div>
          <div className="day bg_HalfPresent">
            <p className="date">10</p>
            <b>HP</b>
          </div>
          <div className="day">
            <p className="date">11</p>
            <b>P</b>
          </div>
          <div className="day">
            <p className="date">12</p>
            <b>P</b>
          </div>
          <div className="day bg_HollyDay">
            <p className="date">13</p>
            <b>H</b>
          </div>
          <div className="day bg_EarlyLeave">
            <p className="date">14</p>
            <b>EL</b>
          </div>
          <div className="day">
            <p className="date">15</p>
            <b>P</b>
          </div>
          <div className="day">
            <p className="date">16</p>
            <b>P</b>
          </div>
          <div className="day bg_Running">
            <p className="date">17</p>
            <b>!</b>
          </div>
          <div className="day">
            <p className="date">18</p>
            <b>P</b>
          </div>
          <div className="day">
            <p className="date">19</p>
            <b>P</b>
          </div>
          <div className="day bg_HollyDay">
            <p className="date">20</p>
            <b>H</b>
          </div>
          <div className="day">
            <p className="date">21</p>
            <b>P</b>
          </div>
          <div className="day">
            <p className="date">22</p>
            <b>P</b>
          </div>
          <div className="day bg_running">
            <p className="date">23</p>
            <b>P</b>
          </div>
          <div className="day">
            <p className="date">24</p>
            <b>P</b>
          </div>
          <div className="day bg_LateAttendance">
            <p className="date">25</p>
            <b>LA</b>
          </div>
          <div className="day bg_EarlyLeave">
            <p className="date">26</p>
            <b>EL</b>
          </div>
          <div className="day bg_HollyDay">
            <p className="date">27</p>
            <b>H</b>
          </div>
          <div className="day">
            <p className="date">28</p>
            <b>P</b>
          </div>
          <div className="day bg_HollyDay">
            <p className="date">29</p>
            <b>P</b>
          </div>
          <div className="day bg_Overtime">
            <p className="date">30</p>
            <b>OT</b>
          </div>
          <div className="day">
            <p className="date">31</p>
            <b>P</b>
          </div>
        </div>
      </div>
    </>
  );
};

export default MonthlyAttendance;
