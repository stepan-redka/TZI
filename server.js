const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit'); // Імпортуємо express-rate-limit

const app = express();
const PORT = process.env.PORT || 10000;

// Підключення до MongoDB
const mongoURI = 'mongodb+srv://stepanredka17:mongodb@cluster0.1jrdk.mongodb.net/sample_mflix?retryWrites=true&w=majority';
mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });

// Створення схеми і моделі для зберігання даних з форми
const formDataSchema = new mongoose.Schema({
    name: { type: String, required: true }
});
const FormData = mongoose.model('FormData', formDataSchema);

// Налаштування для отримання POST-запитів у форматі JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Налаштування ліміту запитів
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 хвилин
    max: 100, // Максимальна кількість запитів за 15 хвилин
    message: 'Ліміт запитів вичерпано. Спробуйте знову через 15 хвилин.'
});

// Застосовуємо лімітатор до всіх запитів POST на маршрут /submit
app.use('/submit', limiter);

// Маршрут для обробки даних з форми
app.post('/submit', async (req, res) => {
    const { name } = req.body;
    console.log('Received data:', req.body);

    if (!name) {
        return res.status(400).send('Name is required');
    }

    try {
        const formData = new FormData({ name });
        console.log('Saving data:', formData);

        await formData.save();

        console.log('Data saved');
        res.send('Дані збережено!');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Помилка при збереженні даних.');
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
