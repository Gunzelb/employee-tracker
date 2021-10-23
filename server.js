const express = require("express");
const { menu } = require("./menu");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const start = async () => {
  if (await menu()) {
    start();
  } else {
    process.exit();
  }
};

//APP methods
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  start();
});
