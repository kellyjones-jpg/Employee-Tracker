var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "employee_tracker"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  // createProduct();
});

questionsIntro();

function questionsIntro() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What do you want to do?',
        choices: [
          {
            name: 'view employees',
            value: 'view_employees'
          },
          {
            name: 'view departments',
            value: 'view_departments'
          },
          {
            name: 'view roles',
            value: 'view_roles'
          },
          {
            name: 'add departments',
            value: 'add_departments'
          },
          {
            name: 'add roles',
            value: 'add_roles'
          },
          {
            name: 'add employees',
            value: 'add_employees'
          },
          {
            name: 'update employee roles',
            value: 'update_employees'
          },
          {
            name: 'quit',
            value: 'quit'
          }
        ],
      },
    ])
    .then(answers => {
      // if (answers.action === 'view_departments') {
      //   readDepartments();
      // } else if (answers.action === 'view_employees') {
      //   readEmployees();
      // }

      switch (answers.action) {
        case 'view_employees':
          return readEmployees();

        case 'view_departments':
          return readDepartments();

        case 'view_roles':
          return readRoles();

        case 'add_departments':
          return addDepartment();  

          case 'add_roles':
            return addRole(); 

            case 'add_employees':
              return addEmployee(); 
            
              case 'update_employees':
                return updateEmployee();

        case 'quit':
        default:
          process.exit();
      }
    });
}

async function addDepartment() {
  inquirer
      .prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Department name?'
        }
      ])
      .then(answers => {
        createDepartment(answers.name);
      })
}

function createDepartment(newName) {
  console.log("Inserting a new department...\n");

  connection.query("INSERT INTO department SET ?", 
      {
        name: newName
      }, 
      function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " department inserted!\n");
        questionsIntro();
      }
    );
}

async function addRole() {
  var questions = [
  {
    message: "What is the new role title?",
    type: "input",
    name: "title"
  },{
    message: "What is the salary for this role?",
    type: "input",
    name: "salary"
  },{
    message: "What is the department ID for this role?",
    type: "input",
    name: "department_id"
  }
  ];
  inquirer.prompt(questions)
    .then(answers=> {
      createRole(answers);
    }
  )
}

function createRole(newRole) {
  console.log("Inserting a new role...\n");
  connection.query(
    "INSERT INTO em_role SET ?",
    {
      title: newRole.title,
      salary: newRole.salary,
      dep_id: newRole.department_id
    },
    function(err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " role inserted!\n");
      questionsIntro();
    }
  );
}

async function addEmployee() {
  var questions = [
  {
    message: "What is the employee's first name?",
    type: "input",
    name: "first_name"
  },
  {
    message: "What is the employee's last name?",
    type: "input",
    name: "last_name"
  },
  {
    message: "What is the role ID?",
    type: "input",
    name: "role_id"
  },
  {
    message: "What is the manager ID?",
    type: "input",
    name: "manager_id"
  }
  ];
  inquirer.prompt(questions)
    .then(answers=> {
      createEmployee(answers);
    }
  )
}

function createEmployee(newEmployee) {
  console.log("Inserting a new employee...\n");
  var query = connection.query(
    "INSERT INTO employee SET ?",
    {
      first_name: newEmployee.first_name,
      last_name: newEmployee.last_name,
      role_id: newEmployee.role_id,
      manager_id: newEmployee.manager_id,
    },
    function(err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " employee inserted!\n");
      questionsIntro();
    }
  );
}

async function updateEmployee() {
  var questions = [
  {
    message: "What is the employee's ID?",
    type: "input",
    name: "role_id"
  },
  {
    message: "What is the new role?",
    type: "input",
    name: "id"
  }
  ];
  inquirer.prompt(questions)
    .then(answers=> {
      updateRole(answers);
    }
  )
}

function updateRole(updateRole) {
  console.log("Updating role salary...\n");
  var query = connection.query(
    "UPDATE employee SET ? WHERE ?",
    [
      {
        role_id: updateRole.role_id
      },
      {
        id: updateRole.id
      }
    ],
    function(err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " role updated!\n");
      questionsIntro();
    }
  );
}

function readDepartments(cb) {
  console.log("Selecting all departments...\n");
  connection.query("SELECT * FROM department", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);

    questionsIntro();
  });
}

function readRoles() {
  console.log("Selecting all roles...\n");

  connection.query("SELECT * FROM em_role", function(err, res) {
    if (err) throw err;

    // Log all results of the SELECT statement
    console.table(res);
    // connection.end; add a separate function called stop
    questionsIntro();
  });
}

function readEmployees() {
  console.log("Selecting all employees...\n");

  connection.query("SELECT first_name, last_name FROM employee", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    // connection.end(); add a separate function called stop
 
    questionsIntro();
  });
}