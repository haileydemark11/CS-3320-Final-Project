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
app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "../public/home.html"));
});

app.get("/portfolio", (request, response) => {
  response.sendFile(path.join(__dirname, "../public/portfolio.html"));
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

