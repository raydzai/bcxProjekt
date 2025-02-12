const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

app.get("/suggest", async (req, res) => {
    let query = req.query.q;
    let url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`;

    try {
        let response = await fetch(url);
        let data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy gợi ý" });
    }
});

app.listen(3000, () => console.log("Server đang chạy tại http://localhost:3000"));
