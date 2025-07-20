const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get("/parse", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    const url = `https://rus.hitmotop.com/search?q=${encodeURIComponent(query)}`;
    await page.goto(url, { waitUntil: "networkidle2" });

    await page.waitForSelector("a.track__download-btn", { timeout: 5000 });
    const link = await page.$eval("a.track__download-btn", el => el.href);

    await browser.close();
    res.json({ download_link: link });
  } catch (e) {
    res.status(404).json({ error: "Download link not found or site blocked" });
  }
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
