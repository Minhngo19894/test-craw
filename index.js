// index.js


import cors from 'cors';
import express from 'express'
import puppeteer from 'puppeteer';
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API để crawl dữ liệu
app.post('/api/crawl', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).send({ error: 'URL is required' });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Truy cập vào URL và chờ tải xong
    await page.goto(url);

    // Lấy văn bản từ div có class là list-group-item list-group-item-info
    const textContent = await page.evaluate(() => {
      const elements = document.querySelectorAll('.list-group-item.list-group-item-info');
      return Array.from(elements).map(element => element.innerText);
    });

    // Đóng trình duyệt
    await browser.close();

    // Trả về nội dung văn bản
    res.send({ text: textContent });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error crawling the URL' });
  }
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
