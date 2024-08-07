import 'dotenv/config';
import path from 'path';
import express from 'express';
import cors from "cors";
import compression from 'compression';
import bitmapRouter from './routes/bitmapRouter.js';
import { initDB, closeDB } from './config/db.js';

const port = process.env.SERVER_PORT ?? 3000;
const app = express();

app.use(cors());

app.use(compression({
  level: 6,
  threshold: 0,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      // don't compress responses if this request header is present
      return false;
    }
    return compression.filter(req, res); // fallback to standard compression
  }
}))

//set client dist folder as public dir
app.use(express.static(process.env.STATIC_PATH)); 

app.use('/api/v1/', bitmapRouter);

//support for react router
app.get('*', (req, res) => { res.sendFile(path.join(process.env.STATIC_PATH, 'index.html')); }); 


async function main() {
  try {
    await initDB();
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  } catch (err) {
    console.log("Server Error", err.message);
  }
}

process.on('SIGINT', async function () {
  console.log("...Shutting down from SIGINT");
  
  await closeDB();

  process.exit();
});

main();