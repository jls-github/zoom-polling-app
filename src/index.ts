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

app.get("/", (req, res) => {
  if (req.query.code) {
    getAccessToken(req.query.code as string)
      .then((data) => {
        res.render("index", {
          accessToken: data["access_token"],
          scope: data["scope"],
        });
      })
      .catch((error) => {
        console.log(error);
        res.send("hello world");
      });
  } else {
    res.redirect(zoomRedirectUrl);
  }
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
  console.log("hello-----------");
  const res = await axios.get(
    `https://zoom.us/oauth/token?grant_type=authorization_code&code=${oauthCode}&redirect_uri=https://zoom-poller.herokuapp.com/`,
    {
      headers: {
        Authorization: `Basic ${oauthCode}`,
        Accept: "application/json",
      },
    }
  );
  console.log("hello2----------");
  console.log(res);
  const data = res.data;
  if (data["access_token"]) {
    return { access_token: data["access_token"], scope: data["scope"] };
  } else {
    return { error: "Could not fetch access token" };
  }
}
