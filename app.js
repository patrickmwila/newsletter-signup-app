// require modules
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

// setup express
const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

// setup ndineCoders server to listen on port 3000 
app.listen(process.env.PORT || 3000, (req, res) => {
  console.log('Ndine Coder\'s Server is Running on port 3000');
});

// handle ndineCoders server get requests
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

// handle ndineCoders server post requests
app.post('/', (req, res) => {

  // extract data from client post
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.emailAddress;

  // setup data to be sent to mailchimp
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);

  // setup post request to mailchimp
  // syntax: https.request(url, option, callbackFxn());
  const url = 'https://us17.api.mailchimp.com/3.0/lists/d5c018dba0';
  const options = {
    method: 'POST',
    auth: 'ndinecoder:b6b0c71b5fe1eb8baccba57249bdcf20-us17'
  };

  // post request
  const apiRequest = https.request(url, options, (apiResponse) => {

    // check if post request was accepted
    if (apiResponse.statusCode === 200) {
      // make ndine coders sever send a response to client
      res.sendFile(__dirname + '/success.html');

    } else {
      res.sendFile(__dirname + '/failure.html');
    }

    apiResponse.on('data', (data) => {
      const apiResponseData = JSON.parse(data);
      console.log(apiResponseData);
    });
  });   

  apiRequest.write(jsonData);
  apiRequest.end();

});

function checkSuccess(apiResponseData) {
}
// mailchimp api-key: b6b0c71b5fe1eb8baccba57249bdcf20-us17
// mailchimp list-id: d5c018dba0