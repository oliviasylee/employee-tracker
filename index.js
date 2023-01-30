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



figlet("Welcome !\n Employee Tracker", function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});

db.connect(function (err) {
    if(err) throw err;
    console.log('Welcome to the Employee Tracker!')
    menu()
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
        // or db.end();
        process.exit();
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


// Add Role 
// const addRole = () => {
//     inquirer.
//        prompt([
//            {
//                type: 'input',
//                name: 'title',
//                message: "What is the name of the role?"
//            },
//            {
//                 type: 'input',
//                 name: 'salary',
//                 message: "What is the salary of the role?"
//             },
//             {
//                 type: 'list',
//                 name: 'departmentName',
//                 message: 'Which department does the role belong to?',
                // 새로 입력된 디파트먼트 테이블에서 모두 불러와야함. choices에 sql query가 들어갈 수 있나?
                // function이 들어올 수도 있음? 허? 그럼 viewdept 펑션이 들어와서 
                // Choices array or a function returning a choices array. If defined as a function, the first parameter will be the current inquirer session answers. Array values can be simple numbers, strings, or objects containing a name (to display in list), a value (to save in the answers hash), and a short (to display after selection) properties. The choices array can also contain a Separator.
                // 아 여기서 프로미스가 나와야하는구나 viewrole과 함께 해야하는 것 같은데 왜냐면 viewrole의 sql query가 필요하거든
                // 이 프로미스의 목적이 뭐니? 사용자의 입력을 받아서 새로운 역할을 추가하는 것. 하지만 이것을 하는 동안 view role보는 것임? 
//                 choices: [ ]
//             }
     
        // roleData { title: "customer service", salary: "80000", department: :"Service" }
//        ]).then((roleData) => {
//            const query = "INSERT INTO role(title, salary, department_id) VALUES(?, ?, ?)"
           
//            db.query(query, [roleData.role, roleData.salary, roleData.departmentName], (err, result) => {
//                if(err) {
//                    throw(err);
//                        } 
//                console.log(`Added ${roleData.role} to the database`)
//                menu();
//            }); 
//            })
//        };


// Add Employee
// const addEmployee = () => {
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