const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit'); // Додаємо бібліотеку для обмеження запитів

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

// Налаштовуємо ліміт для запитів (100 запитів за 10 секунд)
const limiter = rateLimit({
  windowMs: 10 * 1000, // 10 секунд
  max: 100, // ліміт 100 запитів за 10 секунд
  message: 'Too many requests, please try again later.', // повідомлення про перевищення ліміту
  statusCode: 500 // код помилки для перевищення ліміту
});

// Застосовуємо ліміт на всі POST запити
app.use('/submit', limiter);

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
