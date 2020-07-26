require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV, EMAIL_PASS } = require('./config')
var nodemailer = require('nodemailer');
const { endianness } = require('os')
const bodyparser = express.json()
const sgMail = require('@sendgrid/mail');

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.get('/', (req, res) => {
  res.send("Hello! This is taeil2's back end")
})

app.post('/contact', bodyparser, (req, res) => {
  // Using SendGrid
  sgMail.setApiKey('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');

  const msg = {
    to: 'taeil2@gmail.com',
    from: 'taeil2@gmail.com',
    subject: `Message from ${req.body.name} (${req.body.email})`,
    text: req.body.message,
    html: `<p>Message from Taeil2.com</p><p>From ${req.body.name} (${req.body.email})</p><br /><p>${req.body.message}</p>`,
  };

  sgMail.send(msg).then((response) => {
    res.sendStatus(response[0].statusCode);
  }).catch((error) => {
    console.log(error.response.body)
  })

  /*
  // This code is using node-mailer
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'taeil2@gmail.com',
      pass: EMAIL_PASS,
    }
  });

  const mailOptions = {
    from: 'taeil2@taeil2.com', // sender address
    to: 'taeil2@gmail.com', // list of receivers
    subject: `Message from Taeil2.com - ${req.body.name} (${req.body.email})`, // Subject line
    html: `
      <p>Message from Taeil2.com</p>
      <p>From ${req.body.name} (${req.body.email})</p>
      <br />
      <p>${req.body.message}</p>
    ` // plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log(info);
  });
  */
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
    res.status(500).json(response)
  })

module.exports = app
