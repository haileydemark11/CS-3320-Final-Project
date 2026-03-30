import express from 'express'; 
// looked up these two imports to fit with my website requirements 
import path from "path";
import { fileURLToPath } from "url";

const app = express(); 
const port = 8080; 

// I had a server error when running and lines 10-11 fixed things: 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// website files from public folder 
app.use(express.static(path.join(__dirname, "../public")));

// pages
// home page 
app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "../public/home.html"));
});

// portfolio page 
app.get("/portfolio", (request, response) => {
  response.sendFile(path.join(__dirname, "../public/portfolio.html"));
});

// portfolio page sections 
// traditional art page 
app.get("/portfolio/traditional-art", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/traditional-art.html"));
});

// digital art page 
app.get("/portfolio/digital-art", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/digital-art.html"));
});

// UI/UX design page 
app.get("/portfolio/uiux-design", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/uiux-design.html"));
});

// Subpages within the UI/UX portfolio page
// smart scheduler project
app.get("/portfolio/uiux-design/smart-scheduler", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/smart-scheduler.html"));
});

// democracy viewer project
app.get("/portfolio/uiux-design/democracy-viewer", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/democracy-viewer.html"));
});

// gerneative art page 
app.get("/portfolio/generative-art", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/generative-art.html"));
});


app.get("/about", (request, response) => {
  response.sendFile(path.join(__dirname, "../public/about.html"));
});

app.get("/contact", (request, response) => {
  response.sendFile(path.join(__dirname, "../public/contact.html"));
});

// this section creates an API test route
app.get("/api/status", (request, response) => {
  response.json({
      message: "Hello, World!",
      project: "Hailey DeMark Art Portfolio",
      status: "Server is working correctly"
  });
});

app.listen(port, () => {
    console.log(`Application listening at http://localhost:${port}`);   
})

