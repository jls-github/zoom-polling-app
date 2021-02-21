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

async function getAccessToken(oauthCode: string): Promise<Record<string, any>> {

  const options = {
    hostname: 'zoom.us',
    path: '/oauth/token',
    method: 'post',
    headers: {
      'Authorization': `Basic ${oauthCode}` 
    }
  }

  https.request('https://zoom.us/oauth/token', {method: "post"}, (resp) => {
  let data = '';

  // A chunk of data has been received.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    console.log(JSON.parse(data).explanation);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
  return {"hello": "world"}
}