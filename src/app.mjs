import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';
import sanitizeHtml from 'sanitize-html';

const app = express();
const port = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// ── RATE LIMITER ──
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, message: 'Too many messages sent. Please try again in an hour.' }
});

// ── DAILY EMAIL COUNTER ──
let dailyCount = 0;
let lastReset = new Date().toDateString();
const DAILY_LIMIT = 50;

function checkDailyLimit() {
  const today = new Date().toDateString();
  if (today !== lastReset) { dailyCount = 0; lastReset = today; }
  return dailyCount < DAILY_LIMIT;
}

// ── NODEMAILER TRANSPORTER ──
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// ── ROUTES ──
// Home
app.get('/', (req, res) => res.render('home', { homeNav: true }));

// Portfolio hub
app.get('/portfolio', (req, res) => res.render('portfolio', { homeNav: false }));

// Gallery pages
app.get('/portfolio/traditional-art',  (req, res) => res.render('traditional-art',  { homeNav: false }));
app.get('/portfolio/digital-art',      (req, res) => res.render('digital-art',      { homeNav: false }));
app.get('/portfolio/generative-art',   (req, res) => res.render('generative-art',   { homeNav: false }));

// UI/UX hub & case studies
app.get('/portfolio/uiux-design',                    (req, res) => res.render('uiux-design',       { homeNav: false }));
app.get('/portfolio/uiux-design/democracy-viewer',   (req, res) => res.render('democracy-viewer',  { homeNav: false }));
app.get('/portfolio/uiux-design/smart-scheduler',    (req, res) => res.render('smart-scheduler',   { homeNav: false }));

// Generative installations
app.get('/portfolio/generative-art/installation-tree-of-life', (req, res) => res.render('installation-tree-of-life', { homeNav: false }));
app.get('/portfolio/generative-art/installation-flutter',      (req, res) => res.render('installation-flutter',      { homeNav: false }));

// ASIM 3310
app.get('/portfolio/asim-3310',              (req, res) => res.render('asim-3310',                 { homeNav: false }));
app.get('/portfolio/asim-3310/flutter',      (req, res) => res.render('installation-flutter-asim', { homeNav: false }));
app.get('/portfolio/asim-3310/coloring',     (req, res) => res.render('asim-coloring',             { homeNav: false }));
app.get('/portfolio/asim-3310/more-work',    (req, res) => res.render('asim-more-work',            { homeNav: false }));

// About & Contact
app.get('/about',   (req, res) => res.render('about',   { homeNav: false }));
app.get('/contact', (req, res) => res.render('contact', { homeNav: false }));

// ── CONTACT FORM POST ──
app.post('/contact', contactLimiter, async (req, res) => {
  const name = sanitizeHtml(req.body.name || '', { allowedTags: [] });
  const email = sanitizeHtml(req.body.email || '', { allowedTags: [] });
  const topic = sanitizeHtml(req.body.topic || '', { allowedTags: [] });
  const message = sanitizeHtml(req.body.message || '', { allowedTags: [] });

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please fill out all required fields.' });
  }

  if (!checkDailyLimit()) {
    return res.status(429).json({ success: false, message: 'Daily message limit reached. Please try again tomorrow.' });
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `New message from ${name}${topic ? ` — ${topic}` : ''}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${topic ? `<p><strong>Topic:</strong> ${topic}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    dailyCount++;
    res.json({ success: true, message: 'Your message was sent! I\'ll be in touch soon.' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ success: false, message: 'Something went wrong. Please try emailing me directly.' });
  }
});

app.listen(port, () => console.log(`Application listening at http://localhost:${port}`));