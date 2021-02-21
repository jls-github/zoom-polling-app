import dotenv from "dotenv";
import express from "express";
import path from "path";
import axios from "axios";

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

const zoomRedirectUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=https://zoom-poller.herokuapp.com/`;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  if (req.query.code) {
    const data = await getAccessToken(req.query.code as string);
    if (data["access_token"]) {
      res.render("index", {accessToken: data["access_token"], scope: data["scope"]})
    } else {
      res.send("could not verify access")
    }
  } else {
    res.redirect(zoomRedirectUrl);
  }
  res.render("index");
});

app.get("/auth", (req, res) => {
  res.render("continue", { token: "hello" });
});

app.post("auth", (req, res) => {
  res.send("post auth");
});

app.get("/polls", (req, res) => {
  res.render("polls", { code: req.query.code });
});

app.post("/polls", (req, res) => {
  res.send("post new poll");
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});

async function getAccessToken(oauthCode: string): Promise<Record<string, any>> {
  const res = await axios.post(
    `zoom.us/oauth/token?grant_type=authorization_code&code=${oauthCode}&redirect_url=https://zoom-poller.herokuapp.com/`,
    {},
    { headers: { Authorization: `Basic ${oauthCode}` } }
  );
  const data = res.data;
  if (data["access_token"]) {
    return { access_token: data["access_token"], scope: data["scope"] };
  } else {
    return {"error": "Could not fetch access token"};
  }
}
