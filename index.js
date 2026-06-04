require('dotenv').config()
const getConnection =require( "./config/db");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const sqlite = require("sqlite3").verbose();
require("./config/db");
const {Task} = require("./models/taskModel");

getConnection();

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

app.use(bodyParser.json());

const checkExist = (task, res, error) => {
  if (!task) {
    return res.status(404).json({
      message: error ?? "Завдання не існує",
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
app.get("/tasks", async (req, res) => {
  try {
    const allTasks = await Task.find();
     //Тут можна дати умову по якій буде шукати, або фільтр. Також можна додати оператори-фільтри через знак $.

    return res.status(200).json(allTasks);
  } catch (error) {
    console.error("Помилка запиту на сервер" + error);
    serverError(error, res);
  }
});

// Доступаємся до завдання по ID
app.get("/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const taskID = await Task.findById(taskId);

    checkExist(taskID, res);

    return res.status(200).json(taskID);
  } catch (error) {
    console.error("Помилка завдання" + error);
    serverError(error, res);
  }
});

// Записуємо завдання в БазуДаних
app.post("/tasks", async (req, res) => {
  try {
    const newTask = req.body;
    const task = await Task.create({
      text: newTask.text,
    });

    checkExist(task, res);

    return res.status(201).json(task, "Ваше завдання додано");
  } catch (error) {
    console.error("task creation failed" + error);
    serverError(error, res);
  }
});

// Редагуємо завдання по ID
app.put("/tasks/:id", async (req, res) => {
  try {
    const { text, isComplited } = req.body;
    const taskId = req.params.id;
    const editTask = await Task.findByIdAndUpdate(taskId, {text, isComplited }, {new: true});  //Дуже важливо додати цей параметр, оскільки без нього mongoose верне старий об'єкт
    checkExist(editTask, res)
    return res.status(200).json({
      editTask
    });
  } catch (error) {
    console.error("Ви не можете редагувати, помилка" + error);
    serverError(error, res);
  }
});

// Видаляємо по id
app.delete("/tasks/:id", async (req, res) => {
try {
    const taskId = req.params.id;
  const deleteTask = await Task.findByIdAndDelete(taskId);
  checkExist(deleteTask, res)
  return res.status(204).send();
  
} catch (error) {
  console.error("Завдання не було видалено через" + error); 
  serverError(error, res);
}
});

// ejld3mbBWJ2zrYrI
// mongodb+srv://arturkril9_db_user:<db_password>@training.omehpum.mongodb.net/?appName=Training
