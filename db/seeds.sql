INSERT INTO department(department_name)
VALUES ("Sales"),
       ("Technology"),
       ("Account"),
       ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES  ("Sales Lead", 150000, 1),
        ("Salesperson", 10000, 1),
        ("Technology Director", 190000, 2),
        ("Software Engineer", 120000, 2),
        ("Account Manager", 130000, 3),
        ("Accountant", 100000, 3),
        ("Legal Team Lead", 150000, 4),
        ("Lawyer", 100000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES  ("Michael", "Smith", 1, 1),
        ("David", "Patel", 2, 1),
        ("John", "Kim", 3, 3),
        ("Jane", "Lee", 4, 3),
        ("Robert", "Garcia", 5, 5),
        ("Kevin", "Martinez", 6, 5),
        ("Amelia", "Thompson", 7, 7),
        ("Laura", "Hernandez", 8, 7);