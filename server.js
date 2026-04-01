const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.use(express.static(path.join(__dirname, "public")));

app.post("/ask", async (req, res) => {
    try {
        const question = req.body.question;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: "אתה מומחה בריאות עופות. ענה קצר וברור בעברית: " + question
                        }]
                    }]
                })
            }
        );

        const data = await response.json();

        const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || "לא התקבלה תשובה";

        res.json({ answer });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
