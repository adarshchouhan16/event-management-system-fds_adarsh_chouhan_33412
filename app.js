const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Initialize Express app
const app = express();
const port = 3000;

// Setup body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup static files
app.use(express.static(path.join(__dirname, 'public')));

// Setup Sequelize
const sequelize = new Sequelize({
    username: 'root',
    password: 'SQL@7030',
    database: 'event_management_db',
    host: '127.0.0.1',
    dialect: 'mysql'
});

// Define the Event model
const Event = sequelize.define('Event', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

// Synchronize the model with the database
sequelize.sync()
    .then(() => console.log('Database connected and synchronized!'))
    .catch(err => console.error('Unable to connect to the database:', err));

// Routes
// Get all events
app.get('/events', async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Add a new event
app.post('/events', async (req, res) => {
    const { title, description, date } = req.body;

    try {
        const event = await Event.create({ title, description, date });
        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add event' });
    }
});

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Route to send an email notification (for example, after adding an event)
app.post('/send-email', (req, res) => {
    const { to, subject, text } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to send email' });
        }
        res.status(200).json({ message: 'Email sent successfully', info });
    });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
