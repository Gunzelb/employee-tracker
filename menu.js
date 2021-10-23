const db = require("./config/connection");
const inquirer = require("inquirer");
const { prompts, addEmployee, addRole, addDepartment } = require("./prompts");
const { getDepartments, getRoles, getEmployees } = require("./get");
const {
  viewEmployees,
  viewRoles,
  viewEmployeesByDepartment,
} = require("./view");

const menu = async () => {
  const res = await inquirer.prompt(prompts);

  switch (res.menu) {
    case "Add Employee":
      {
        const employee = await inquirer.prompt(addEmployee);

        const roleId = await new Promise((res, req) => {
          db.query(
            "SELECT id FROM role WHERE ? ",
            { title: employee.role },
            (err, results) => {
              if (err) {
                console.log("Error: Role not found");
                return true;
              } else {
                res(results[0].id);
              }
            }
          );
        });

        let managerId;
        if (employee.manager != "None") {
          const [first, last] = employee.manager.split(" ");
          managerId = await new Promise((res, req) => {
            db.query(
              "SELECT id FROM employee WHERE ? AND ?",
              [{ first_name: first }, { last_name: last }],
              (err, results) => {
                if (err) {
                  console.log(`No valid managers found`);
                  return true;
                } else {
                  return res(results[0].id);
                }
              }
            );
          });
        }

        await new Promise((res, req) => {
          db.query(
            "INSERT INTO employee SET ?",
            {
              first_name: employee.first_name,
              last_name: employee.last_name,
              role_id: roleId,
              manager_id: managerId,
            },
            (err, results) => {
              if (err) {
                req(`INSERT employee failed`);
              } else {
                console.log(
                  `Added ${employee.first_name} ${employee.last_name} as a ${employee.role}.`
                );
                res(results);
              }
            }
          );
        });
      }
      return true;

    case "Add Role": {
      const role = await inquirer.prompt(addRole);
      department_id = await new Promise((res, req) => {
        db.query(
          "SELECT id FROM department WHERE ?",
          { name: role.department },
          (err, results) => {
            if (err) {
              console.log("Department does not exist");
              return true;
            } else {
              return res(results[0].id);
            }
          }
        );
      });
      await new Promise((res, req) => {
        db.query(
          "INSERT INTO role SET ?",
          {
            title: role.title,
            salary: role.salary,
            department_id: department_id,
          },
          (err, results) => {
            if (err) {
              console.log("Failed to add role");
              return;
            } else {
              console.log("Role sucessfully added!");
              return res(results);
            }
          }
        );
      });
      return true;
    }

    case "Add Department": {
      const department = await inquirer.prompt(addDepartment);
      await new Promise((res, req) => {
        db.query(
          "INSERT INTO department SET ?",
          {
            name: department.department,
          },
          (err, results) => {
            if (err) {
              console.log("Failed to add department");
              return;
            } else {
              console.log("Department sucessfully added!");
              return res(results);
            }
          }
        );
      });
      return true;
    }

    case "View all Employees":
      try {
        console.table(await viewEmployees());
        return true;
      } catch (error) {
        process.exit();
      }

    case "View all Employees by Department":
      try {
        const input = await inquirer.prompt([
          {
            name: "department",
            message: "Which department?",
            type: "list",
            choices: await getDepartments(),
          },
        ]);
        console.table(await viewEmployeesByDepartment(input.department));
      } catch (err) {
        console.log(err);
      }
      return true;

    case "Update Employee Role":
      {
        const input = await inquirer.prompt([
          {
            name: "employee",
            message: "Which employee?",
            type: "list",
            choices: await getEmployees(),
          },
          {
            name: "role",
            message: "What role will this employee have?",
            type: "list",
            choices: await getRoles(),
          },
        ]);
        const roleId = await new Promise((res, req) => {
          db.query(
            "SELECT id FROM role WHERE ? ",
            { title: input.role },
            (err, results) => {
              if (err) {
                console.log("Role not found");
                return;
              } else {
                res(results[0].id);
              }
            }
          );
        });

        const [first, last] = input.employee.split(" ");
        await new Promise((res, req) => {
          db.query(
            "UPDATE employee SET ? WHERE ? AND ?",
            [
              {
                role_id: roleId,
              },
              {
                first_name: first,
              },
              {
                last_name: last,
              },
            ],
            (err, results) => {
              if (err) {
                console.log("Failed to update Employee role");
                return;
              } else {
                console.log(
                  `Employee ${input.employee} changed roles to a ${input.role}`
                );
                res(results);
              }
            }
          );
        });
      }
      return true;

    case "View all Roles":
      console.table(await viewRoles());
      return true;

    case "Exit":
      return false;

    default:
      console.log("Default");
      return true;
  }
};

module.exports = { menu };
