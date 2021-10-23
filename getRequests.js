const db = require("./config/connection");

const getDepartments = async () => {
  const departments = await new Promise((res, req) => {
    db.query("SELECT name FROM department", (err, results) => {
      if (err) {
        console.log(err);
        return;
      } else {
        return res(results);
      }
    });
  });
  let newDepartmentArray = [];
  departments.forEach((e) => {
    newDepartmentArray.push(e.name);
  });
  return newDepartmentArray;
};

const getRoles = async () => {
  const roles = await new Promise((res, req) => {
    db.query("SELECT title FROM role", (err, results) => {
      if (err) {
        console.log(err);
        return;
      } else {
        return res(results);
      }
    });
  });
  let newRoleArray = [];
  roles.forEach((e) => {
    newRoleArray.push(e.title);
  });
  return newRoleArray;
};

const getEmployees = async () => {
  const employee = await new Promise((res, req) => {
    db.query("SELECT first_name, last_name FROM employee", (err, results) => {
      if (err) {
        console.log(err);
        return;
      } else {
        return res(results);
      }
    });
  });
  let newEmployeeArray = [];
  employee.forEach((e) => {
    newEmployeeArray.push(`${e.first_name} ${e.last_name}`);
  });
  return newEmployeeArray;
};

module.exports = {
  getDepartments,
  getRoles,
  getEmployees,
};
