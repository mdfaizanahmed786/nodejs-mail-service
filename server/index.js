const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const morgan = require("morgan");
const nodemailer = require("nodemailer");
const puppeteer = require("puppeteer");
require("dotenv").config();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/send", (req, res) => {
  (async () => {
    // launch a new chrome instance

    try {
      const browser = await puppeteer.launch({
        headless: true,
      });

      // create a new page
      const page = await browser.newPage();

      // set your html as the pages content
      const html = fs.readFileSync(`${__dirname}/template.html`, "utf8");
      await page.setContent(html, {
        waitUntil: "domcontentloaded",
      });

      // or a .pdf file
      await page.pdf({
        format: "A4",
        path: `${__dirname}/my-fance-invoice.pdf`,
      });

      let emailClient = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_PASSWORD,
        },
      });

      emailClient.sendMail({
        from: "actiongamesandtrailers@gmail.com",
        to: "ahmedriyan528@gmail.com",

        subject: "Test",
        text: "Test",
        attachments: [
          {
            filename: "test.pdf",
            path: `${__dirname}/my-fance-invoice.pdf`,
            contentType: "application/pdf",
          },
        ],
      });

      // close the browser
      await browser.close();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })();

  res.status(200).json({ message: "Email sent!" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
