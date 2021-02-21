import dotenv from 'dotenv';
import express from "express";
import path from "path";
import https from 'https';  

dotenv.config()

const port = process.env.PORT || 3000;

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/auth", (req, res) => {
  res.render("continue", {token: "hello"})
});

app.post("auth", (req, res) => {
  res.send("post auth")
});

app.get("/polls", (req, res) => {
  res.render("polls", {code: req.query.code});
});

app.post("/polls", (req, res) => {
  res.send("post new poll");
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});

async function getAccessToken(oauthCode: string): Promise<void> {

  const options = {
    hostname: 'zoom.us',
    path: '/oauth/token',
    method: 'post',
    headers: {
      'Authorization': `Basic ${oauthCode}` 
    }
  }

  https.request(options, (resp) => null);
}