const express = require("express");
require("dotenv").config();
const app=express();
const router=express.Router();

const ejs=require("ejs");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const apiKey = process.env.API_KEY;

router.get("/", async (req, res) => {
    try {
        const response = await fetch("https://www.goldapi.io/api/XAU/INR", {
            method: "GET",
            headers: {
                "x-access-token": apiKey,
                "Content-Type": "application/json",
                "User-Agent": "request"
            }
        });
        
        const data = await response.json();

        if (data.error) {
            console.error("GoldAPI error:", data);
            return res.status(400).json({ error: data.error });
        }

        // 💰 Convert price per gram
        const goldInGrams = data.price / 31.1035; // 1 oz = 31.1035 grams
        const pricePerGram = goldInGrams.toFixed(2);

        // 🕓 Convert timestamp to readable date
        const readableDate = new Date(data.timestamp * 1000).toLocaleString("en-IN");

        res.render("price",{data, pricePerGram,readableDate});

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;