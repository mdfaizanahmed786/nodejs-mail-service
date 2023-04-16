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
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/send", (req, res) => {
  const { email, name } = req.body;
  if(!email || !name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  (async () => {
    // launch a new chrome instance

    try {
      const browser = await puppeteer.launch({
        headless: true,
      });

      // create a new page
      const page = await browser.newPage();

    
      await page.setContent(`<!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>${name}</title>
        
            <style>
              .invoice-box {
                max-width: 800px;
                margin: auto;
                padding: 30px;
                border: 1px solid #eee;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
                font-size: 16px;
                line-height: 24px;
                font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
                color: #555;
              }
        
              .invoice-box table {
                width: 100%;
                line-height: inherit;
                text-align: left;
              }
        
              .invoice-box table td {
                padding: 5px;
                vertical-align: top;
              }
        
              .invoice-box table tr td:nth-child(2) {
                text-align: right;
              }
        
              .invoice-box table tr.top table td {
                padding-bottom: 20px;
              }
        
              .invoice-box table tr.top table td.title {
                font-size: 45px;
                line-height: 45px;
                color: #333;
              }
        
              .invoice-box table tr.information table td {
                padding-bottom: 40px;
              }
        
              .invoice-box table tr.heading td {
                background: #eee;
                border-bottom: 1px solid #ddd;
                font-weight: bold;
              }
        
              .invoice-box table tr.details td {
                padding-bottom: 20px;
              }
        
              .invoice-box table tr.item td {
                border-bottom: 1px solid #eee;
              }
        
              .invoice-box table tr.item.last td {
                border-bottom: none;
              }
        
              .invoice-box table tr.total td:nth-child(2) {
                border-top: 2px solid #eee;
                font-weight: bold;
              }
        
              @media only screen and (max-width: 600px) {
                .invoice-box table tr.top table td {
                  width: 100%;
                  display: block;
                  text-align: center;
                }
        
                .invoice-box table tr.information table td {
                  width: 100%;
                  display: block;
                  text-align: center;
                }
              }
        
              /** RTL **/
              .invoice-box.rtl {
                direction: rtl;
                font-family: Tahoma, "Helvetica Neue", "Helvetica", Helvetica, Arial,
                  sans-serif;
              }
        
              .invoice-box.rtl table {
                text-align: right;
              }
        
              .invoice-box.rtl table tr td:nth-child(2) {
                text-align: left;
              }
            </style>
          </head>
        
          <body>
            <div class="invoice-box">
              <table cellpadding="0" cellspacing="0">
                <tr class="top">
                  <td colspan="2">
                    <table>
                      <tr>
                        <td class="title">
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsh08cy0Ct6-cjeCNhpY6fxte0_DBdQULoqwLVGxmL7g&usqp=CAU&ec=48665701"
                            style="width: 100%;"
                          />
                        </td>
        
                        <td>
                          Invoice #: 123<br />
                          Created: January 1, 2015<br />
                          Due: February 1, 2015
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
        
                <tr class="information">
                  <td colspan="2">
                    <table>
                      <tr>
                        <td>
                          Sparksuite, Inc.<br />
                          12345 Sunny Road<br />
                          Sunnyville, CA 12345
                        </td>
        
                        <td>
                          Acme Corp.<br />
                          John Doe<br />
                          john@example.com
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
        
                <tr class="heading">
                  <td>Payment Method</td>
        
                  <td>Check #</td>
                </tr>
        
                <tr class="details">
                  <td>Check</td>
        
                  <td>1000</td>
                </tr>
        
                <tr class="heading">
                  <td>Item</td>
        
                  <td>Price</td>
                </tr>
        
                <tr class="item">
                  <td>Website design</td>
        
                  <td>${name}</td>
                </tr>
        
                <tr class="item">
                  <td>Hosting (3 months)</td>
        
                  <td>$75.00</td>
                </tr>
        
                <tr class="item last">
                  <td>Domain name (1 year)</td>
        
                  <td>$10.00</td>
                </tr>
        
                <tr class="total">
                  <td></td>
        
                  <td>Total: $385.00</td>
                </tr>
              </table>
              <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsh08cy0Ct6-cjeCNhpY6fxte0_DBdQULoqwLVGxmL7g&usqp=CAU&ec=48665701"
           
            />
            </div>
          </body>
        </html>`
        ,{
          waitUntil: ['domcontentloaded', 'networkidle0', 'load', 'networkidle2'],
      }) 

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
        html:`<!DOCTYPE html>
        <html>
        <body style="background-color:powderblue;">
        
        <h1>This is a heading</h1>
        <p>This is a paragraph.</p>
        
        </body>
        </html>
        '`,
        attachments: [
          {
            filename: "Invoice.pdf",
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
