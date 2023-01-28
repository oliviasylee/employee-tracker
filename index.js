const mysql = require('mysql2')
const cTable = require('console.table');
const inquirer = require('inquirer');
const { default: Choices } = require('inquirer/lib/objects/choices');
 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'oslee',
    password: 'work4fun',
    database: 'employee_db'
})

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
                    name: 'questions',
                    message: "What would you like to do?",
                    choices: ['View All Employee', 'Add Employee', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
                    // (Move up and down to reveal more choices)
                    }
])
};

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


// View All Employee 
// Veiw All Roles 
// View All Departments

// const query = 'SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id';

// db.query(query, (err, rows) => {
//     if (err) throw err;
//     console.table(rows);
// });

// const viewAllDep = 'SELECT * FROM department';

// db.query(query, (err, rows) => {
//     if (err) throw err;
//     console.table(rows);
// });

// Add Employee
// Add Role 
// Add Department

// Update Employee Role