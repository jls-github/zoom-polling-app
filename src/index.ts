import express from "express";
const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.post("/polls", (req, res) => {
  res.send("post new poll");    
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
