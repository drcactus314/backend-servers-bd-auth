const mongoose = require("mongoose");


// створення функції-конструктор, а саме моделі схеми збереження даних
const taskSchema = new mongoose.Schema({
    text:{
        type: 'string',
        require: [true, "Task description is reqiured"], 
    },
    isComplited:{
        type: 'boolean',
        default: false,
    }

})
const Task = mongoose.model('Task', taskSchema);    /* модель приймає два арг, назва колекції MongoDB (автоматично згенерує таск і буде шукати нам колекцію з такою назвою. А TaskSchema буде вказувати як структурувати дані для MongoDB)*/

module.exports = {
    Task,
};