const mysql = require('mysql2')
// Prints the results to the console in a tabular format
const cTable = require('console.table');
const inquirer = require('inquirer');
const { default: Choices } = require('inquirer/lib/objects/choices');

require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306
});

db.connect(function (err) {
    if(err) throw err;
    console.log("MySQL Connected!")
    menu()
})

const menu = () => {
    console.log('Welcome to the Employee Tracker!');
        return inquirer
                .prompt([
                    {
                         type: 'list',
                         name: 'startQuestions',
                         pageSize: 6,
                         message: "What would you like to do?",
                         choices: ['View All Employee', 'Add Employee', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
                     }
]).then((data) => {
    if(data.startQuestions === 'Add Department'){
        addDept();
    }
})
};

// Add Department
const addDept = () => {
     inquirer.
        prompt([
            {
                type: 'input',
                name: 'department',
                message: "What is the name of the department?"
            }
      
         // deptData {
        //         department: "service"
        //      }
        ]).then((deptData) => {
            const query = "INSERT INTO department(department_name) VALUES(?)"
            //to execute the SQL query and insert the department name into the database.
            // first parameter -> sql query
            // seconde parameter -> object that contains the department name
            // third parameter -> callback function
            db.query(query, deptData.department, (err, result) => {
                if(err) {
                    throw(err);
                        } 
                console.log(`Added ${deptData.department} to the database`)
                menu();
            }); 
            })
        };


// Add Role 
// Add Employee
// Update Employee Role

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
//     const query = "SELECT employee.id, employee.first_name, employee.last_name, title, department_name AS department, salary, CONCAT(mng.first_name, ' ', mng.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee mng ON employee.manager_id = mng.id";
//     db.query(query, (err, rows) => {
//         if (err) throw err;
//         cTable(rows);
//     });
// }

// const viewAllRoles = () => {
//     const query = 'SELECT department.id, title, department_name AS department, salary FROM role LEFT JOIN department on role.department_id = department.id';
//     db.query(query, (err, rows) => {
//         if (err) throw err;
//         cTable(rows);
//     });
// }

// const viewAllDepts = () => {
    // const query = 'SELECT id, department_name AS name FROM department ORDER BY name ASC';
    // db.query(query, (err, rows) => {
    //     if (err) throw err;
    //     cTable(rows);
    // });
// }