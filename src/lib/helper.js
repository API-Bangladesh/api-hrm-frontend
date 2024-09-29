import { apiBaseUrl } from "./config";

export const getGreeting = () => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  let greeting;

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
  } else if (currentHour >= 18 && currentHour < 22) {
    greeting = "Good evening";
  } else {
    greeting = "Good night";
  }

  return greeting;
};

export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" && value.trim().length === 0) return true;
  if (typeof value === "object" && Object.keys(value).length === 0) return true;
  return false;
};

export const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const date = new Date(dateString);
  return date.toLocaleString("en-US", options);
};

export const formatDateTime = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    // timeZoneName: "short",
  };

  const date = new Date(dateString);
  return date.toLocaleString("en-US", options);
};

export const getTime = (dateString) => {
  const options = {
    hour: "numeric",
    minute: "numeric",
  };

  const date = new Date(dateString);
  return date.toLocaleString("en-US", options);
};

export const getDate = (dateString) => {
  if (!dateString) return null;

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const date = new Date(dateString);
  return date.toLocaleString("en-US", options);
};

export const getStoragePath = (path) => {
  return path ? apiBaseUrl + path : "";
};

export const getFullName = (first_name, last_name) => {
  if (!first_name && !last_name) {
    return ""; // If both are missing, return an empty string
  }

  return [first_name, last_name].filter(Boolean).join(" ");
};

export const generateAddressString = (addressObj = {}) => {
  const { address, city, state_division, post_zip_code, country } = addressObj;
  let addressParts;
  if (state_division && post_zip_code) {
    addressParts = [
      address,
      city,
      `${state_division} - ${post_zip_code}`,
      country,
    ];
  } else {
    addressParts = [address, city, state_division, post_zip_code, country];
  }

  // Filter out null, undefined, and empty strings
  let filteredAddressParts = addressParts.filter((part) => part);

  return filteredAddressParts.join(", ");
};

export const generateGroupString = (groups = []) => {
  const filteredGroups = groups.map(({ name }) => name).filter(Boolean);

  return filteredGroups.length ? filteredGroups.join(", ") : "N/A";
};

export const generateStringFromArray = (arr = []) => {
  const filtered = arr.map((item) => String(item)).filter(Boolean);
  return filtered.length ? filtered.join(", ") : "";
};

export const formatCurrency = (value) => {
  if (isNaN(value)) {
    return "";
  }

  const formattedValue = new Intl.NumberFormat("en-IN").format(value);
  return `${formattedValue}/-`;
};

export const convertMinutesToHoursAndMinutes = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const formattedHours = String(hours).padStart(2, "0"); // Add leading zero if needed
  const formattedMinutes = String(remainingMinutes).padStart(2, "0"); // Add leading zero if needed
  return `${formattedHours}:${formattedMinutes}`;
};

export const convertTimeTo12HourFormat = (timeString) => {
  // Parse the time string to a Date object
  const time = new Date("2000-01-01T" + timeString);

  // Get hours, minutes, and seconds
  let hours = time.getHours();
  let minutes = time.getMinutes();

  // Determine AM or PM
  const amPM = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // "0" hour should be "12"

  // Add leading zero to hours if less than 10
  hours = hours < 10 ? "0" + hours : hours;

  // Add leading zero to minutes if needed
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // Construct the 12-hour format string
  const time12Hour = hours + ":" + minutes + " " + amPM;

  return time12Hour;
};

export const formatTime = (time) => {
  const [hours, minutes, seconds = "00"] = time.split(":");
  return `${hours}:${minutes}:${seconds}`;
};

export const formatTimeFromDateTime = (dateTime) => {
  if (dateTime) {
    const time = dateTime.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const [hours, minutes, seconds = "00"] = time.split(":");
    return `${hours}:${minutes}:${seconds}`;
  }
};

export const formatDateToYYYYMMDD = (date) => {
  if (!date) return null;

  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);

  return `${year}-${month}-${day}`;
};

export const getStatusProps = (status) => {
  return {
    disabled: true,
    style: {
      backgroundColor:
        status === "Pending"
          ? "#FCE9F0"
          : status === "Approved"
          ? "#E2F3E6"
          : status === "Rejected"
          ? "#FFE6E0"
          : null,
      color:
        status === "Pending"
          ? "#E64980"
          : status === "Approved"
          ? "#12B886"
          : status === "Rejected"
          ? "#FA5252"
          : null,
      // cursor: "default",
    },
  };
};
