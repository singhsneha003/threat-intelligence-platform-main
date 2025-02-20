import app from "./app.js";  // Import the app from the app.js file

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
