const { getDepartments, getRoles, getEmployees } = require("./getRequests");

const mainMenu = [
  "View all Employees",
  "View all Employees by Department",
  "Add Employee",
  "Add Department",
  "Add Role",
  "Update Employee Role",
  "View all Roles",
  "Exit",
];

const prompts = [
  {
    name: "menu",
    message: "Please select from menu below:?",
    type: "list",
    choices: mainMenu,
  },
];

const addEmployee = [
  {
    name: "first_name",
    message: "What is the employee's first name?",
    type: "input",
  },
  {
    name: "last_name",
    message: "What is the employee's last name?",
    type: "input",
  },
  {
    name: "role",
    message: "What is the employee's role",
    type: "list",
    choices: getRoles,
  },
  {
    name: "manager",
    message: "Select this employee's manager",
    type: "list",
    choices: getEmployees,
  },
];

const addRole = [
  {
    name: "title",
    message: "What is title of the role you wish to add?",
    type: "input",
  },
  {
    name: "salary",
    message: "What is this role's annual salary? (Ex: 100000)",
    type: "input",
  },
  {
    name: "department",
    message: "What department is this role part of?",
    type: "list",
    choices: getDepartments,
  },
];

const addDepartment = [
  {
    name: "department",
    message: "What is name of the department you wish to add?",
    type: "input",
  },
];

module.exports = { prompts, addEmployee, addRole, addDepartment };
