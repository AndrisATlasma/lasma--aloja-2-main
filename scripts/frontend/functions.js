const dbSetting = { outfmt: 'json', dbgroup: '_postgres' };
const isDebugLogging = true;

// helper functions
function isStatusCodeValid(res) {
  return res.statusCode === 200;
}
function handleSqlDebug(statementName, res, passedArguments) {
  if (!isDebugLogging) return;
  console.warn(
    `Trouble executing '${statementName}' sql statement. Arguments and response object below ↓`,
  );
  // console.log(passedArguments);
  console.log(
    Object.entries(passedArguments).map(([param, value]) => ({
      [param]: value,
      type: typeof value,
    })),
  );
  console.warn(res);
  console.log('-----------------------');
}

// SQL functions
function runSqlSelect(sStatement, oParams = {}) {
  return new Promise((resolve) => {
    runSql(sStatement, oParams, dbSetting, function (res) {
      if (isStatusCodeValid(res)) return resolve(res.responseJson);
      handleSqlDebug(sStatement, res, oParams);
      return resolve(false);
    });
  });
}
function runSqlUpdate(sStatement, oParams = {}) {
  return new Promise((resolve) => {
    runSql(sStatement, oParams, dbSetting, function (res) {
      // if (isStatusCodeValid(res)) return resolve(res.responseJson);
      if (isStatusCodeValid(res)) return resolve(true);
      handleSqlDebug(sStatement, res, oParams);
      return resolve(false);
    });
  });
}
function runSqlInsert(sStatement, oParams = {}) {
  return new Promise((resolve) => {
    runSql(sStatement, oParams, dbSetting, function (res) {
      if (isStatusCodeValid(res)) return resolve(res.responseJson);
      // handleSqlDebug(sStatement, res, oParams);
      return resolve(false);
    });
  });
}

// ============================ not database
const returnTwoDigitNumber = (number) =>
  Number(`${number.toString().length === 1 ? '' : ''}${number}`);
function getCurrentTime_HH_MM() {
  const today = new Date();
  const HH = today.getHours();
  const MM = today.getMinutes();
  return `${returnTwoDigitNumber(HH)}:${returnTwoDigitNumber(MM)}`;
}
function getTodaysDate_YYYY_MM_DD() {
  const today = new Date();
  const YYYY = today.getFullYear();
  const MM = returnTwoDigitNumber(today.getMonth() + 1);
  const DD = returnTwoDigitNumber(today.getDate());
  return `${YYYY}-${MM}-${DD}`;
}
function returnNullIfEmptyStringInId(id) {
  const val = document.getElementById(id).value;
  if (val === ``) return null;
  return Number(val);
}

function checkIfDateSeemsLegit(sDate) {
  try {
    const [year, month, day] = sDate.split('-');
    if (year === '' || isNaN(Number(year))) return false;
    if (month === '' || isNaN(Number(month))) return false;
    if (day === '' || isNaN(Number(day))) return false;
    return true;
  } catch (error) {
    return false;
  }
}
function checkIfDateSeemsLegit_slash(sDate) {
  try {
    const [day, month, year] = sDate.split('/');
    if (year === '' || isNaN(Number(year))) return false;
    if (month === '' || isNaN(Number(month))) return false;
    if (day === '' || isNaN(Number(day))) return false;
    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;
    if (year < 2000) return false;

    return true;
  } catch (error) {
    return false;
  }
}
function checkIfDateIsInvalid_slash(sDate) {
  return !checkIfDateSeemsLegit_slash(sDate);
}

function convertDatepickerToPostgresDateDefis(rawDatepickerValue) {
  // "dd/mm/yyyy" ->"mm/dd/yyyy"
  const [inputDay, inputMonth, inputYear] = rawDatepickerValue.split('/');
  return `${inputYear}-${inputMonth}-${inputDay}`;
}
function checkIfTimeSeemsLegit(sTime) {
  try {
    const [sHours, sMinutes] = sTime.split(':');
    const nHours = Number(sHours),
      nMinutes = Number(sMinutes);
    if (sHours === '' || isNaN(nHours) || nHours > 23 || nHours < 0)
      return false;
    if (sMinutes === '' || isNaN(nMinutes) || nMinutes > 59 || nMinutes < 0)
      return false;
    return true;
  } catch (error) {
    return false;
  }
}
function getStringInDateInputFormat() {
  const today = new Date();
  const YYYY = today.getFullYear();
  const MM = returnTwoDigitNumber(today.getMonth() + 1);
  const DD = returnTwoDigitNumber(today.getDate());
  return `${MM}/${DD}/${YYYY}`;
}
function getTimestampInPostgresFormat(date) {
  const YYYY = date.getFullYear();
  const MM = returnTwoDigitNumber(date.getMonth() + 1);
  const DD = returnTwoDigitNumber(date.getDate());
  const hh = returnTwoDigitNumber(date.getHours());
  const mm = returnTwoDigitNumber(date.getMinutes());
  return `${YYYY}/${MM}/${DD} ${hh}:${mm}`;
}
function getTimeInTimeInputFormat() {
  const today = new Date();
  const HH = returnTwoDigitNumber(today.getHours());
  const MM = returnTwoDigitNumber(today.getMinutes());
  return `${HH}:${MM}`;
}

function doesDateSeemLegit(sDate) {
  /* if date is older than 28/12/2020, then we assume it is wrong */
  try {
    const date = new Date(sDate);
    if (date.getTime() < 978007324) return false;
    return true;
  } catch (error) {
    return false;
  }
}
function isDateInvalid(sDate) {
  return !doesDateSeemLegit(sDate);
}

function returnDate_AsInPickersByDefault(date) {
  const MM = returnTwoDigitNumber(date.getMonth() + 1);
  const DD = returnTwoDigitNumber(date.getDate());
  const YYYY = date.getFullYear();
  return `${MM}/${DD}/${YYYY}`;
}
function returnEmptyStringIfNull(val) {
  if (val === null) return ' ';
  return val;
}

function getDatesForTodayReport() {
  const todayDate = new Date();
  return {
    todayDate: returnDate_AsInPickersByDefault(todayDate),
  };
}
function getDatesForWeekReport() {
  const todayDate = new Date(),
    getDay = todayDate.getDay();
  // получаем дату ближайшего понедельника (60мин, 60сек, 1000мс, 24ч)
  const mondayDate = new Date(todayDate - 3600 * 1000 * 24 * (getDay - 1));
  return {
    mondayDate: returnDate_AsInPickersByDefault(mondayDate),
    todayDate: returnDate_AsInPickersByDefault(todayDate),
  };
}
function getDatesForMonthReport() {
  const todayDate = new Date(),
    getDate = todayDate.getDate();
  // получаем первое число этого месяца (60мин, 60сек, 1000мс, 24ч)
  const firstDateOfTheMonth = new Date(
    todayDate - 3600 * 1000 * 24 * (getDate - 1),
  );
  return {
    firstDateOfTheMonth: returnDate_AsInPickersByDefault(firstDateOfTheMonth),
    todayDate: returnDate_AsInPickersByDefault(todayDate),
  };
}
function getDatesForYearReport() {
  const todayDate = new Date(),
    year = todayDate.getFullYear(),
    firstDateOfTheYear = new Date(`01/01/${year}`);
  return {
    firstDateOfTheYear: returnDate_AsInPickersByDefault(firstDateOfTheYear),
    todayDate: returnDate_AsInPickersByDefault(todayDate),
  };
}
function getDatesForQuarterReport() {
  const todayDate = new Date(),
    month = todayDate.getMonth() + 1,
    year = todayDate.getFullYear();
  let firstDateOfTheQuarter;
  if (month >= 1 && month < 4) {
    // первая четверть
    firstDateOfTheQuarter = new Date(`01/01/${year}`);
  } else if (month >= 4 && month < 7) {
    // вторая четверть
    firstDateOfTheQuarter = new Date(`04/01/${year}`);
  } else if (month >= 7 && month < 10) {
    // третья четверть
    firstDateOfTheQuarter = new Date(`07/01/${year}`);
  } else if (month >= 10 && month <= 12) {
    // четвёртая четверть
    firstDateOfTheQuarter = new Date(`10/01/${year}`);
  } else {
    alert('conditional error!');
  }

  return {
    firstDateOfTheQuarter: returnDate_AsInPickersByDefault(
      firstDateOfTheQuarter,
    ),
    todayDate: returnDate_AsInPickersByDefault(todayDate),
  };
}

function doesTimeInputHaveInvalidValue(newTimeInputValue) {
  try {
    const [hours, minutes] = newTimeInputValue.split(':');
    const hoursLength = hours.toString().length,
      minutesLength = minutes.toString().length;
    return (
      !hoursLength || hoursLength > 2 || !minutesLength || minutesLength > 2
    );
  } catch (err) {}
  return true; // returning true if there are errors inside the input
}

function checkIfPhSeemsLegit({ row }) {
  const sPh = document
    .getElementById(`thisTable`)
    .querySelector(`[data-row="${row}"][data-content="ph"]`).value;
  return sPh !== '' && !isNaN(Number(sPh));
}
function isPhValueOutOfBounds(sPh) {
  const ph = Number(sPh);
  if (ph < 2.5) return true;
  if (ph > 2.65) return true;
  return false;
}

function checkIfNumberInputValueIsLegit(numValue) {
  return numValue !== '' && !isNaN(Number(numValue));
}

// ============================ BACKEND
function generateSqlSET(obj) {
  var arr = [];
  Object.keys(obj).forEach(function (key) {
    var quotIfAny = '';
    if (typeof val === 'string' && val.toLowerCase() !== 'now()')
      quotIfAny = "'";
    arr.push(key + ' = ' + quotIfAny + obj[key] + quotIfAny);
  });
  return arr.join(', ');
}
function generateSqlInsert(argArr) {
  var arr = [];
  argArr.forEach(function (val) {
    var quotIfAny = '';
    if (typeof val === 'string' && val !== 'Now()' && val !== 'now()')
      quotIfAny = "'";
    arr.push(quotIfAny + val + quotIfAny);
  });
  return arr.join(', ');
}
