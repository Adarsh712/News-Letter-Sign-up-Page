const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000.");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signUp.html");
});

//Setting up MailChimp
mailchimp.setConfig({
  apiKey: "f2538615202618af608e457ace3dc528-us8",
  server: "us8",
});

app.post("/", function (req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  console.log(firstName, lastName, email);

  const listId = "68374173d8";
  //Creating an object with the users data
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
  };
  //Uploading the data to the server
  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      },
    });
    //If all goes well logging the contact's id
    console.log(
      `Successfully added contact as an audience member. The contact's id is ${response.id}.`
    );
    res.sendFile(__dirname + "/success.html");
  }

  run().catch((e) => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

//mail chimp API Key
//f2538615202618af608e457ace3dc528-us8

//Audience ID
//68374173d8
