import express from 'express'; 
// looked up these two imports to fit with my website requirements 
import path from "path";
import { fileURLToPath } from "url";

const app = express(); 
const port = 8080; 


// AI resources said these consts would be helpful for my art portfolio for the future to build correct file paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// website files from public folder 
app.use(express.static(path.join(__dirname, "../public")));

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

