const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Підключення до MongoDB
const mongoURI = 'mongodb+srv://stepanredka17:mongodb@cluster0.1jrdk.mongodb.net/formdata?retryWrites=true&w=majority';
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Створення схеми і моделі для зберігання даних з форми
const formDataSchema = new mongoose.Schema({
    name: String
});
const FormData = mongoose.model('FormData', formDataSchema);

// Налаштування для отримання POST-запитів у форматі JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Маршрут для обробки даних з форми
app.post('/submit', async (req, res) => {
    const { name } = req.body;
    try {
        const formData = new FormData({ name });
        await formData.save();
        res.send('Дані збережено!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Помилка при збереженні даних.');
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
