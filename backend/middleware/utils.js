const moment = require("moment");
const { Status } = require("./constants");

const getLocalTime = () => {
  return moment(); 
};

const calculateStatus = (now) => {
  const lateCutoffTime = now.clone().set({ hour: 9, minute: 0 }); 
  const absentCutoffTime = now.clone().set({ hour: 12, minute: 0 }); 

  if (now.isBefore(lateCutoffTime)) {
    return Status.Present;
  } else if (now.isBefore(absentCutoffTime)) {
    return Status.Late;
  } else {
    return Status.Absent;
  }
};

module.exports = { getLocalTime, calculateStatus };