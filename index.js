const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { error } = require("console");
const sqlite = require("sqlite3").verbose();
const dbName = "tasks.db";
const port = 3000;

const db = new sqlite.Database(dbName);

let tasks = [
  { id: 1, task: "Help mum" },
  { id: 2, task: "Help dad" },
  { id: 3, task: "Help sisiter" },
  { id: 4, task: "Help aunt" },
  { id: 5, task: "Help granny" },
];

const aPP = app.use(bodyParser.json());
console.log(aPP);

const checkExist = (task, res) => {
  if (!task) {
    return res.status(404).json({
      message: "Завдання не існує",
    });
  }
};

const serverError = (err, res) => {
  if (err) {
    return res.status(500).json({ error: err.message });
  }
};

app.get("/", (req, res) => {
  res.send("Привіт Експрес");
});
// Ця функція запускає сервер, а саме, через метод лісенінг
app.listen(port, () => {
  console.log(`Сервер відрито на порту${port} `);
});

// Доступаємся до всіх завдань в базі
app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", (err, rows) => {
    serverError(err, res);
  });
  return res.status(200).json(rows);
});

// Доступаємся до завдання по ID
app.get("/tasks/:id", (req, res) => {
  // Беремо id зі завдання
  // Метод парс інт перетворює на число
  const taskId = parseInt(req.params.id);
  db.get('SELECT * from tasks WHERE id = ?', taskId, (err, row)=>{
    serverError(err, res);
    checkExist(foundTask, res);
    return res.status(200).json(row);
  })
});

// Записуємо завдання в БазуДаних
app.post("/tasks", (req, res) => {
  // Отримуємо дані з тіла запиту
  const newTask = req.body;
  // Пушимо в масив
  db.run("INSERT INTO tasks {text} VALUE {?}", [newTask.text], (err) => {
    serverError(err, res);
    return res.status(201).json({ id: this.lastID }, "Ваше завдання додано");
  });
  //   tasks.push(newTask);
  // Відповідаємо статусом про успіх або новоствореного завдання
  //   return res.status(201).json(newTask);
});

// Редагуємо завдання по ID
app.put("/tasks/:id", (req, res) => {
  // Беремо id зі завдання
  // Метод парс інт перетворює на число
  const { text } = req.body;
  const taskId = parseInt(req.params.id);

  db.run("UPDATE tasks  SET text = ? WHERE id = ?", [text, taskId], (err) => {
    serverError(err, res);
    return res.status(200).json({
      id: taskId,
      text,
    });
  });
});

// Видаляємо по id
app.delete("/tasks/:id", (req, res) => {
  // Отримуємо ідентифікатор завдання
  const taskId = parseInt(req.params.id);
//   tasks = tasks.filter(t=> t.id !== taskId) 
db.run('DELETE from tasks WWHERE id =?', taskId, (err)=>{
    serverError();
    return res.send(204).send()
})
});


