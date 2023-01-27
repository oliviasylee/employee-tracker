const inquirer = require('inquirer');
const mysql = require('mysql2')
 
const db = mysql.createConnection({
    host: 'localhost',
    user: '',
    password: '',
    database: 'employee_db'
})

db.connect(function (err) {
    if(err) throw err;
    console.log("MySQL Connected!")
    //menu()
})


const addAllEmployees = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is this employees first name?"
        }
    ]).then(res => {
        const query = `INSERT INTO employee SET ?`
        db.query(query, {
            first_name: res.firstName
        })
    })
}