const express = require('express');
const bodyParser = require('body-parser');
const { response } = require('express');
const https = require('https');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || '3000';

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/signup.html`);
});

app.post('/', (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_field: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);

  const url = process.env.apiUrl;
  const options = {
    method: 'POST',
    auth: `${process.env.user}: ${process.env.apiKey}`,
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(`${__dirname}/success.html`);
    } else {
      res.sendFile(`${__dirname}/failure.html`);
    }
    response.on('data', (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
