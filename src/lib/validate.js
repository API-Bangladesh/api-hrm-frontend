export const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

export const validatePhoneNumber = (phoneNumber) => {
  const phonePattern = /^(01[3-9]\d{8})$/;
  return phonePattern.test(phoneNumber);
};

export const validateEmployeeID = (id) => {
  const pattern = /^[A-Z]{3}[0-9]{7}$/;
  return pattern.test(id);
};

export const validateDeviceIP = (ip) => {
  const pattern =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return pattern.test(ip);
};

export const validateMACAddress = (mac) => {
  const pattern = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return pattern.test(mac);
};

export const validateWebsite = (url) => {
  const pattern =
    /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+)\.([a-zA-Z]{2,})([\/\w\.-]*)*\/?$/;
  return pattern.test(url);
};
