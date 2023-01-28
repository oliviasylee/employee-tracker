const mysql = require('mysql2')
// Prints the results to the console in a tabular format
const cTable = require('console.table');
const inquirer = require('inquirer');
const { default: Choices } = require('inquirer/lib/objects/choices');
 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'oslee',
    password: '',
    database: 'employee_db'
})

db.connect(function (err) {
    if(err) throw err;
    console.log("MySQL Connected!")
    // menu()
})

// const menu = () => {
//     console.log('Welcome to the Employee Tracker!');
//         return inquirer
//                 .prompt([
//                     {
//                      type: 'list',
//                      name: 'startQuestions',
//                      pageSize: 6,
//                      message: "What would you like to do?",
//                      choices: ['View All Employee', 'Add Employee', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
//                      }
// ])
// };

// const addAllEmployees = () => {
//     inquirer.prompt([
//         {
//             type: 'input',
//             name: 'firstName',
//             message: "What is this employees first name?"
//         }
//     ]).then(res => {
//         const query = `INSERT INTO employee SET ?`
//         db.query(query, {
//             first_name: res.firstName
//         })
//     })
// }

// const viewAllEmployee = () => {
    // const query = 'SELECT employee.id, first_name, last_name, title, department_name AS department, salary, manager_id AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON department.id = role.department_id';
    //     db.query(query, (err, rows) => {
    //         if (err) throw err;
    //         console.table(rows);
    //     });
// }

// const viewAllRoles = () => {
//     const query = 'SELECT department.id, title, department_name AS department, salary FROM role LEFT JOIN department on role.department_id = department.id';
//     db.query(query, (err, rows) => {
//         if (err) throw err;
//         console.table(rows);
//     });
// }

// const viewAllDepts = () => {
    // const query = 'SELECT id, department_name AS name FROM department ORDER BY name ASC';
    // db.query(query, (err, rows) => {
    //     if (err) throw err;
    //     console.table(rows);
    // });
// }

// Add Employee
// Add Role 
// Add Department
// Update Employee Role