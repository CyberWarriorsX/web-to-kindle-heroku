const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');
const execFile = require('child_process').execFile;
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
//-----------------------------------------
const { createCanvas, loadImage, registerFont } = require('canvas');
const GIFEncoder = require('gifencoder');
registerFont(path.join(__dirname, 'tmp', 'Pacifico.ttf'), { family: 'Pacifico' });
registerFont(path.join(__dirname, 'tmp', 'Flick Bold Hollow.ttf'), { family: 'Flick Bold Hollow' });
 
 
//express()
app.get('/heroku', (req, res) => {
  res.sendFile('deploy.html', { root: 'public' });
});
  app.get('/', (req, res) => {
    const html = `<html>
      <head>
        <title>Thanks Page</title>
        <style>
          body {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <h1>Thanks to Suhail Ser</h1>
      </body>
    </html>`;
    res.type('html').send(html);
  })
  //----------------------------------------------------------
  app.use(express.static(path.join(__dirname, 'public')))
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')
  app.get('/getss/:url', async (req, res) => {
   const { text } = req.query;
  console.log("Url text : " + text) ; 
    const encodedUrl = req.params.url;
  const decodedUrl = decodeURIComponent(encodedUrl);
  console.log("Encoded URL : ", decodedUrl);
  //const urls = req.params.url; 
    const url = req.query.hhtps;
    console.log("Url : " + url) ; 
    //const urll = url.split("$")[0];
   // console.error("Given URL Is: " + urll);
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 800 });
    await page.goto(process.env.SCREENSHOT_URL || url);
    await page.screenshot({  path: '/tmp/screenshot.png',  });
    await browser.close();
    await convert('/tmp/screenshot.png');
    screenshot = fs.readFileSync('/tmp/screenshot.png');
    res.writeHead(200, {'Content-Type': 'image/png','Content-Length': screenshot.length, });
    return res.end(screenshot);
  })
//----------------------------------------------------------------------------
 app.use(express.urlencoded({ extended: true })) // Middleware to parse form data
 app.get('/ttp', (req, res) => {
    const html = `<html>
      <head>
        <title>Thanks Page</title>
        <style>
          body {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
          }
        </style>
      </head>
      <body>
         <form action="/ttp/:text" method="get">
          <input type="text" name="text" placeholder="Enter text" />
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>`;
    res.type('html').send(html);
  })
 //--------------------------------------------------------------------------
app.get('/ttp/:text', async (req, res) => {
    const text = req.params.text;
    console.log("Text For TTP : " + text);
    const canvas = createCanvas(300, 300);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Set text properties
    const fontSize = 30;
    const fontFamily = 'Flick Bold Hollow';
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const words = text.split(' ');
    const maxWidth = canvas.width * 0.8;
    let lines = [];
    let line = '';
    let y = centerY;
    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth) {
        lines.push(line.trim());
        line = word + ' ';
      } else { line = testLine; }
    }
    lines.push(line.trim());
    const totalTextHeight = lines.length * fontSize;
    const firstLineY = centerY - totalTextHeight / 2;
    lines.forEach((line, index) => {
      const lineY = firstLineY + index * fontSize;
      ctx.fillText(line, centerX, lineY);
    });
    // Convert the canvas to a PNG image
    const imagePath = path.join(__dirname, 'tmp', 'image.png');
    const out = fs.createWriteStream(imagePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => {
      const image = fs.readFileSync(imagePath);
      res.writeHead(200, { 'Content-Type': 'image/png','Content-Length': image.length,});
      res.end(image);
    });
  })
  //-------------------------------------------------------------
  app.get('/ttp2/:text', async (req, res) => {
    const text = req.params.text;
    console.log("Text For TTP : " + text);
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const fontSize = 40;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const words = text.split(' ');
    const maxWidth = canvas.width * 0.8;
    let line = '';
    let y = centerY;
    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth) {
        ctx.fillText(line, centerX, y);
        line = word + ' ';
        y += fontSize;
      } else {    line = testLine;   }
    }
    ctx.fillText(line, centerX, y);
    const imagePath = path.join(__dirname, 'public', 'image.png');
    const out = fs.createWriteStream(imagePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);

    out.on('finish', () => {
      const image = fs.readFileSync(imagePath);
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': image.length,
      });
      res.end(image);
    });
  })
 //---------------------------------------------------------------
app.get('/attp2/:text', async (req, res) => {
  const text = req.params.text;
  console.log("Text For ATTP : " + text);
  const frameDuration = 40;
  const gifDuration = 1000; 
  const encoder = new GIFEncoder(300, 300);
  encoder.start();
  encoder.setRepeat(0); // 0 for repeat indefinitely
  encoder.setDelay(frameDuration);
  encoder.setQuality(10); // Adjust as needed
  const canvas = createCanvas(300, 300);
  const ctx = canvas.getContext('2d');
  ctx.font = '40px Arial';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const colors = [
    [255, 0, 0],    // Red
    [0, 255, 0],    // Green
    [0, 0, 255]     // Blue
  ];
  const numFrames = Math.ceil(gifDuration / frameDuration);
  const colorIndexStep = Math.ceil(numFrames / colors.length);
  for (let frameIndex = 0; frameIndex < numFrames; frameIndex++) {
    const colorIndex = Math.floor(frameIndex / colorIndexStep);
    const currentColor = colors[colorIndex % colors.length];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `rgb(${currentColor.join(',')})`;
    const words = text.split(' ');
    const maxLineWidth = 180; // Maximum width allowed for text in pixels
    let line = '';
    let lines = [];
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxLineWidth && i > 0) {
        lines.push(line);
        line = words[i] + ' ';
      } else {  line = testLine;}
    }
    lines.push(line);
    const lineHeight = 40; // Height of each line in pixels
    const textHeight = lines.length * lineHeight;
    const startY = centerY - textHeight / 2;

    for (let i = 0; i < lines.length; i++) {
      const lineY = startY + i * lineHeight;
      ctx.fillText(lines[i], centerX, lineY);
    }
    encoder.addFrame(ctx);
  }

  encoder.finish();
  const gifBuffer = encoder.out.getData();
  const gifPath = path.join(__dirname, 'tmp', 'attp.gif');
  fs.writeFileSync(gifPath, gifBuffer);
  fs.readFile(gifPath, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while reading the GIF file.');
    } else {
     res.writeHead(200, {'Content-Type': 'image/gif','Content-Length': data.length, });
      res.end(data);
    }
  });
})
 //------------------------------------------------------------
     
app.get('/attp/:text', async (req, res) => {
  const text = req.params.text;
  console.log("Text For ATTP : " + text);
  const frameDuration = 50; // Duration in milliseconds for each frame (adjust as needed)
  const gifDuration = 1000; // Total duration of the GIF in milliseconds (2 seconds)
  const encoder = new GIFEncoder(200, 200);
  encoder.start();
  encoder.setRepeat(0); // 0 for repeat indefinitely
  encoder.setDelay(frameDuration);
  encoder.setQuality(10); // Adjust as needed
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');
  ctx.font = '40px Arial';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const colors = [[255, 0, 0],[0, 255, 0],[0, 0, 255]];
  const numFrames = Math.ceil(gifDuration / frameDuration);
  const colorIndexStep = Math.ceil(numFrames / colors.length);
  for (let frameIndex = 0; frameIndex < numFrames; frameIndex++) {
    const colorIndex = Math.floor(frameIndex / colorIndexStep);
    const currentColor = colors[colorIndex % colors.length];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `rgb(${currentColor.join(',')})`;
    ctx.fillText(text, centerX, centerY);
    encoder.addFrame(ctx);
  }
  encoder.finish();
  const gifBuffer = encoder.out.getData();
  const gifPath = path.join(__dirname, 'public', 'glowing-text.gif');
  fs.writeFileSync(gifPath, gifBuffer);
  res.writeHead(200, {'Content-Type': 'image/gif','Content-Length': gifBuffer.length, });
  res.end(gifBuffer);
})
  //-----------------------------------------------------------------
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));


function convert(filename) {
  return new Promise((resolve, reject) => {
    const args = [filename,'-gravity','center','-extent','600x800','-depth','8',filename];

   // const args = [filename, '-gravity', 'center', '-extent', '600x800', '-colorspace', 'gray', '-depth', '8', filename];
    execFile('convert', args, (error, stdout, stderr) => {
      if (error) {
        console.error({ error, stdout, stderr });
        reject();
      } else {   resolve();  }
    });
  });
}

///-----------------------------------------------------------------------

