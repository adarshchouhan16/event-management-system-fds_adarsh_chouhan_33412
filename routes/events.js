const express = require('express');
const router = express.Router();
const db = require('../models');
const nodemailer = require('nodemailer');
const { eventValidationRules, validate } = require('../middleware/validator');

// Create an event
router.post('/events', eventValidationRules(), validate, async (req, res) => {
  try {
    const event = await db.Event.create(req.body);

    // Send email notification
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'recipient@example.com', // Change to your recipient email
      subject: 'New Event Created',
      text: `A new event has been created: ${event.title}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List all events
router.get('/events', async (req, res) => {
  try {
    const events = await db.Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific event
router.get('/events/:id', async (req, res) => {
  try {
    const event = await db.Event.findByPk(req.params.id);
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an event
router.put('/events/:id', eventValidationRules(), validate, async (req, res) => {
  try {
    const [updated] = await db.Event.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedEvent = await db.Event.findByPk(req.params.id);
      res.status(200).json(updatedEvent);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an event
router.delete('/events/:id', async (req, res) => {
  try {
    const deleted = await db.Event.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
