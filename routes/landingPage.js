const express = require("express");
require("dotenv").config();
const app=express();
const router=express.Router();

const ejs=require("ejs");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

router.get("/", async (req, res) => {
    
    res.render("components/landingPage");

});

module.exports = router;