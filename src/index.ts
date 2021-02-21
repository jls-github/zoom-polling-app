import dotenv from "dotenv";
import express from "express";
import path from "path";
import axios from "axios";

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

const zoomRedirectUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.BASE_URL}/`;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  if (req.query.code) {
    getAccessToken(req.query.code as string)
      .then((data) => {
        res.render("index", {
          accessToken: data.access_token,
          scope: data.scope,
        });
      })
      .catch((error) => {
        res.send(`An error occured on the server: ${error}`);
      });
  } else {
    res.redirect(zoomRedirectUrl);
  }
});

app.post("/", (req, res) => {
  res.send("Question submitted (not really)")
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});

async function getAccessToken(oauthCode: string): Promise<Record<string, any>> {
  const idAndSecret = `${process.env.OAUTH_CLIENT_ID}:${process.env.OAUTH_CLIENT_SECRET}`;
  const oAuthBuffer = Buffer.from(idAndSecret).toString("base64");
  const res = await axios.post(
    `https://zoom.us/oauth/token?grant_type=authorization_code&code=${oauthCode}&redirect_uri=${process.env.BASE_URL}/`,
    {},
    {
      headers: {
        Authorization: `Basic ${oAuthBuffer}`,
        Accept: "application/json",
      },
    }
  );
  const data = res.data;
  if (data.access_token) {
    return { access_token: data.access_token, scope: data.scope };
  } else {
    return { error: "Could not fetch access token" };
  }
}
