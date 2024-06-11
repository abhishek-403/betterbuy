const nodemailer = require("nodemailer");

export var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "abhishek79009@gmail.com",
    pass: "dpab lhuq llut atgq",
  },
});

export type generateEmailProps = {
  receiverEmail: string;
  img: string;
  link: string;
  title: string;
  price: string;
};
export function generateEmail({
  receiverEmail,
  img,
  link,
  title,
  price,
}: generateEmailProps) {
  const html = setHtmltemplate(title, img, link, price);
  const mailOptions = {
    from: "abhishek79009@gmail.com",
    to: receiverEmail,
    subject: "Got you a Better News from BuyItBetter",
    html: `${html}`,
  };

  transporter.sendMail(mailOptions, function (error: any, info: any) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

function setHtmltemplate(
  title: string,
  img: string,
  link: string,
  price: string
) {
  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Prices at lowest buy it now!</title>
        <style>
             body, h1, p {
                margin: 0;
                padding: 0;
              }

              body {
                background-color: #f3f3f3;
                font-family: Arial, sans-serif;
              }

              .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(0, 0, 0, 0.7);
              }

              .title {
                font-size: 26px;
                font-weight: 700;
                color: #333333;
                margin-bottom: 20px;
                text-align: center;
              }

              .product-image {
                display: block;
                margin: 0 auto;
                max-width: 100%;
                height: auto;
                border-radius: 10px;
              }

              .product-title {
                font-size: 18px;
                color: #333333;
                margin: 20px 0 10px 0;
                text-align: center;
              }

              .button {
                display: block;
                width: 200px;
                margin: 20px auto;
                padding: 10px 20px;
                text-decoration: none;
                color: #ffffff;
                background-color: #8b5cf6;
                text-align: center;
                border-radius: 5px;
                font-size: 16px;
                font-weight:bold;
              }

              
              .price {
                  display: block;
                  width: fit-content;
                  margin: 20px auto;
                  padding: 10px 20px;
                  background-color:#0056b3 ;
                  color: #ffffff;
                  text-align: center;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
                  font-size: 22px;
              }
             
              
        </style>
        </head>
        <body>
        <div class="container">
            <!-- Title -->
            <h1 class="title">Prices are low, better time to buy 🛒 !!!</h1>

            <img class="product-image" src=${img} alt="Product Image">

            <h2 class="product-title">${title}</h2>
            <div class="price" >${price}</div>

            <a style="color:white;" class="button" href=${link}>Buy Now</a>
        </div>
        </body>
        </html>`;
}
