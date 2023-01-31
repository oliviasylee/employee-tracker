const mysql = require('mysql2')
// Prints the results to the console in a tabular format
const cTable = require('console.table');
const inquirer = require('inquirer');
const { default: Choices } = require('inquirer/lib/objects/choices');
const figlet = require('figlet');

require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306
});

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

const menu = () => {
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
    if(data.startQuestions === 'View All Employee') {
            viewAllEmployee();
        } else if (data.startQuestions === 'Add Employee'){
            addEmployee();
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

// Add Department
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

// Add Employee
// MySQL2 exposes a .promise() function on Connections, to "upgrade" an existing non-promise connection to use promise
// needs promis here. I think I have to do it with viewrole because I need viewrole's sql query.
// Not only viewRole table but also need viewAllEmployee table so I think I have get viewallemployee table.
// Should I use this query with joining table(viewallemployee) and then I can update the employee. 그래야 직원을 업데이트 할 수 있는데 아래 쿼리에서 가져옴? view all employee의 테이블을 불러오는 것임
// 그래서 그걸 불러와서 밑에 rolechoices에 넣고 map으로 찾아서 first_name, last_name, role, manager로 나눠서 seprate 다음에 insert함
const addEmployee = () => {
    db.promise().query("SELECT employee.id, employee.first_name, employee.last_name, title, department_name AS department, salary, CONCAT(mng.first_name, ' ', mng.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee mng ON employee.manager_id = mng.id")
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
                        pageSize: 6,
                        message: "What is the employee’s role?",
                        choices: roleChoices
                    },
                    {
                        type: 'list',
                        name: 'managerId',
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

// Update Employee Role

const viewAllEmployee = () => {
    const query = "SELECT employee.id, employee.first_name, employee.last_name, title, department_name AS department, salary, CONCAT(mng.first_name, ' ', mng.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee mng ON employee.manager_id = mng.id";
    db.query(query, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        menu();
    });
}

const viewAllRoles = () => {
    const query = 'SELECT department.id, title, department_name AS department, salary FROM role LEFT JOIN department on role.department_id = department.id';
    db.query(query, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        menu();
    });
}

const viewAllDepts = () => {
    const query = 'SELECT id, department_name AS name FROM department ORDER BY name ASC';
    db.query(query, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        menu();
    });
}