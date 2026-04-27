import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Home — passes homeNav flag directly to the template
app.get('/', (req, res) => res.render('home', { homeNav: true }));

// Portfolio hub
app.get('/portfolio', (req, res) => res.render('portfolio', { homeNav: false }));

// Gallery pages
app.get('/portfolio/traditional-art', (req, res) => res.render('traditional-art', { homeNav: false }));
app.get('/portfolio/digital-art',     (req, res) => res.render('digital-art',     { homeNav: false }));
app.get('/portfolio/generative-art',  (req, res) => res.render('generative-art',  { homeNav: false }));

// UI/UX hub + case studies
app.get('/portfolio/uiux-design',                  (req, res) => res.render('uiux-design',       { homeNav: false }));
app.get('/portfolio/uiux-design/democracy-viewer', (req, res) => res.render('democracy-viewer',  { homeNav: false }));
app.get('/portfolio/uiux-design/smart-scheduler',  (req, res) => res.render('smart-scheduler',   { homeNav: false }));

// Generative installations
app.get('/portfolio/generative-art/installation-tree-of-life', (req, res) => res.render('installation-tree-of-life', { homeNav: false }));
app.get('/portfolio/generative-art/installation-flutter',      (req, res) => res.render('installation-flutter',      { homeNav: false }));

// About & Contact
app.get('/about',   (req, res) => res.render('about',   { homeNav: false }));
app.get('/contact', (req, res) => res.render('contact', { homeNav: false }));

app.get('/api/status', (req, res) => {
  res.json({ message: 'Hello, World!', project: 'Hailey DeMark Art Portfolio', status: 'Server is working correctly' });
});

app.listen(port, () => {
  console.log(`Application listening at http://localhost:${port}`);
});
