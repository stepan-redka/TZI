const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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
app.use(bodyParser.json());  // Додаємо підтримку JSON
app.use(express.static('public'));

// Маршрут для обробки даних з форми
app.post('/submit', async (req, res) => {
    const { name } = req.body;
    console.log('Received data:', req.body);  // Логування отриманих даних

    if (!name) {
        return res.status(400).send('Name is required');  // Якщо немає name, вивести помилку
    }

    try {
        const formData = new FormData({ name });
        console.log('Saving data:', formData);  // Логування даних перед збереженням

        // Спроба зберегти дані
        await formData.save();

        console.log('Data saved');  // Лог після успішного збереження
        res.send('Дані збережено!');
    } catch (error) {
        console.error('Error saving data:', error);  // Лог на помилку
        res.status(500).send('Помилка при збереженні даних.');
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
