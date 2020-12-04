const express = require('express')
const mongoose = require("mongoose");
const User = require("./src/model/User.model.ts")
const app = express()

app.get("/", async (req, res) => {
  const user = new User({username: 'hgdfhdfhfgdh'})
  user.save().then(() => console.log("user saved"))
  res.json({message: user.username})
})

app.get("/users", async (req, res) => {
  const user = new User({username: 'hgdfhdfhfgdh'})
  res.json({message: user.username})
})

app.listen(8080, () => {
    console.log(`Listening on 8080`);
    mongoose.connect("mongodb://mongo:27017/mongo-test")
})