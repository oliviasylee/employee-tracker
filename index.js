const mysql = require('mysql2')
// Prints the results to the console in a tabular format
const cTable = require('console.table');
const inquirer = require('inquirer');
const figlet = require('figlet');

// DB configuration info
require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306
});

// Displays a welcome message in ASCII art
figlet("Welcome ! \n Employee Tracker", function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
    db.connect(function (err) {
        if(err) throw err;
        menu()
    });
});

// Provides the main menu options using inquirer
const menu = () => {
        return inquirer
                .prompt([
                    {
                         type: 'list',
                         name: 'startQuestions',
                         pageSize: 6,
                         message: "What would you like to do?",
                         choices: [ 'View All Employee', 
                                    'Add Employee', 
                                    'Update Employee Role', 
                                    'View All Roles', 
                                    'Add Role', 
                                    'View All Departments', 
                                    'Add Department', 
                                    'Quit']
                     }
]).then((data) => {
    if(data.startQuestions === 'View All Employee') {
            viewAllEmployee();
        } else if (data.startQuestions === 'Add Employee'){
            addEmployee();
        } else if (data.startQuestions === 'Update Employee Role') {
            updateEmployeeRole();    
        } else if (data.startQuestions === 'View All Roles') {
            viewAllRoles();
        } else if (data.startQuestions === 'Add Role') {
            addRole();
        } else if (data.startQuestions === 'View All Departments') {
            viewAllDepts();
        } else if (data.startQuestions === 'Add Department'){
            addDept();
        } else if (data.startQuestions === 'Quit'){
            console.log('The application is now closed. Goodbye!')
            db.end();
        }} 
)};


// Adds a new employee to the database by prompting the user for first name, last name, role, and manager information and then inserting the data into the database
const addEmployee = () => {
    db.promise().query("SELECT role.id, role.title, employee.first_name, employee.last_name FROM role LEFT JOIN employee ON role.id = employee.role_id")
    .then(([rows]) => {
        // Use the results to populate the choices in the inquirer prompt
        const roleChoices = rows.map(row => ({
            name: row.title,
            value: row.id
        }))
        const managerChoices = rows.map(row => ({
            name: `${row.first_name} ${row.last_name}`,
            value: row.id
        }));
            // Adds 'None' to the beginning of managerChoices array
            managerChoices.unshift({ name: "None", value: null });
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'What is this employees first name?'
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'What is this employees last name?'
                    },
                    {
                        type: 'list',
                        name: 'roleId',
                        message: "What is the employee’s role?",
                        choices: roleChoices
                    },
                    {
                        type: 'list',
                        name: 'managerId',
                        pageSize: 6,
                        message: "Who’s the employee’s manager?",
                        choices: managerChoices
                    }
        ]).then((employeeData) => {
            const query = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)`
            db.query(query, [employeeData.firstName, employeeData.lastName, employeeData.roleId, employeeData.managerId], (err, result) => {
                if (err) {
                    throw err;
                }
                console.log(`Added ${employeeData.firstName} ${employeeData.lastName} to the database`)
                menu();
            });
        });
    })
    .catch(console.error);
};

// retrieving information about employees and their roles from the database, then prompting the user to select an employee and a role to assign, updating the selected employee's information in the database
const updateEmployeeRole = () => {
    // retrieve information about employees and their current roles
    db.promise().query("SELECT employee.id, employee.first_name, employee.last_name, title FROM employee LEFT JOIN role ON employee.role_id = role.id")
        .then(([rows]) => {
            // The result of the query is then mapped to create two arrays, updateEmployee and assignRole, that will be used to display choices to the user
            const updateEmployee = rows.map(row => ({
                name: `${row.first_name} ${row.last_name}`,
                value: row.id
            }))
            const assignRole = rows.map(row => ({
                name: row.title,
                value: row.id
            }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'updateEmployee',
                        message: "Which employee’s role do you want to update?",
                        choices: updateEmployee
                    },
                    {
                        type: 'list',
                        name: 'assignRole',
                        pageSize: 6,
                        message: "Which role do you want to assign the selected employee?",
                        choices: assignRole
                    }
        // an object UpdateEmployeeData that contains the user's selections
        ]).then((UpdateEmployeeData) => {
            // UpdateEmployeeData { updateEmployee: Jane Lee, assignRole: Technical Lead }
            // { updateEmployee: 4, assignRole: 3 }
            // split - divides a String
            // can get it from the updateEmployee array that created earlier in the code by using the filter method
            const selectedEmployee = updateEmployee.filter(emp => emp.value === UpdateEmployeeData.updateEmployee);
            const first_name = selectedEmployee[0].name.split(" ")[0];
            const last_name = selectedEmployee[0].name.split(" ")[1];
            
            const query = `UPDATE employee SET first_name = (?), last_name = (?), role_id = (?) WHERE id = (?)`
            db.query(query, [first_name, last_name, UpdateEmployeeData.assignRole, UpdateEmployeeData.updateEmployee], (err, result) => {
                if (err) {
                    throw err;
                }
                console.log(`Updated employee's role`)
                menu();
            });
        });
    })
    .catch(console.error);
};

// Adds a new role to the database by prompting the user for role, salary, and department and then inserting the data into the database
const addRole = () => {
    // Use a promise to execute a query to retrieve the list of departments
    db.promise().query("SELECT id, department_name FROM department")
        .then(([rows]) => {
            // Use the results to populate the choices in the inquirer prompt
            const departmentChoices = rows.map(row => ({
                name: row.department_name,
                value: row.id
            }));

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: "What is the name of the role?"
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: "What is the salary of the role?"
                },
                {
                    type: 'list',
                    name: 'departmentId',
                    message: 'Which department does the role belong to?',
                    choices: departmentChoices
                }
            // roleData { title: "customer service", salary: "80000", department: :"Service" }
            ]).then((roleData) => {
                const query = "INSERT INTO role(title, salary, department_id) VALUES(?, ?, ?)"

                db.query(query, [roleData.title, roleData.salary, roleData.departmentId], (err, result) => {
                    if (err) {
                        throw err;
                    }
                    console.log(`Added ${roleData.title} to the database`)
                    menu();
                });
            });
        })
        .catch(console.error);
};

// Adds a new department to the database
const addDept = () => {
    inquirer.
       prompt([
           {
               type: 'input',
               name: 'department',
               message: "What is the name of the department?"
           }
     
        // deptData { department: "service"}
       ]).then((deptData) => {
           const query = "INSERT INTO department(department_name) VALUES(?)"
           // to execute the SQL query and insert the department name into the database.
           // first parameter -> SQL query
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

// Queries the database to retrieve information on all employees and displays it in a table using console.table
const viewAllEmployee = () => {
    const query = "SELECT employee.id, employee.first_name, employee.last_name, title, department_name AS department, salary, CONCAT(mng.first_name, ' ', mng.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee mng ON employee.manager_id = mng.id";
    db.query(query, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        menu();
    });
}

// Queries the database to retrieve information on all roles
const viewAllRoles = () => {
    const query = 'SELECT role.id, title, department_name AS department, salary FROM role LEFT JOIN department on role.department_id = department.id';
    db.query(query, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        menu();
    });
}

// Queries the database to retrieve information on all departments
const viewAllDepts = () => {
    const query = 'SELECT id, department_name AS name FROM department ORDER BY name ASC';
    db.query(query, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        menu();
    });
}