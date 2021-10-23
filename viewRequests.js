const db = require("./config/connection");

const viewEmployees = async () => {
  return new Promise((res, req) => {
    db.query("SELECT * FROM employee", (err, results) => {
      if (err) {
        console.log("Request failed: an error occured with the database.");
        return err;
      }
      return res(results);
    });
  });
};

const viewRoles = async () => {
  return new Promise((res, req) => {
    db.query("SELECT * FROM role", (err, results) => {
      if (err) {
        req("Request failed: an error occured with the database.");
      }
      return res(results);
    });
  });
};

const viewEmployeesByDepartment = async (input) => {
  const id = await new Promise((res, req) => {
    db.query(
      "SELECT id FROM department WHERE ?",
      { name: input },
      (err, results) => {
        if (err) {
          return res(`${input} department not found`);
        } else {
          return res(results[0].id);
        }
      }
    );
  });

  return await new Promise((res, req) => {
    db.query(
      `SELECT employee.first_name, employee.last_name, employee.role_id, employee.manager_id FROM employee 
        JOIN role on employee.role_id = role.id WHERE role.department_id=${id};`,
      (err, results) => {
        if (err) {
          res(`No employees were found for the ${input} department`);
        } else {
          if (results == Array(0)) {
            return res(`\nNo employees in the ${input} department\n`);
          }
          return res(results);
        }
      }
    );
  });
};

module.exports = {
  viewEmployees,
  viewRoles,
  viewEmployeesByDepartment,
};
