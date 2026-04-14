const https = require('https');
const fs = require('fs');
const path = require('path');

const repoBase = "https://github.com/miyonavirtual/miyona_webbuild/raw/main/";

const files = [
  "public/8590256991748008892.vrm",

  "public/MiyonaWebBuild_CallOne/Build/MiyonaWebBuild_CallOne.framework.js.unityweb",
  "public/MiyonaWebBuild_CallOne/Build/MiyonaWebBuild_CallOne.wasm.unityweb",

  "public/MiyonaWebBuild_Call/Build/MiyonaWebBuild.framework.js.unityweb",
  "public/MiyonaWebBuild_Call/Build/MiyonaWebBuild.wasm.unityweb"
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
      }
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  for (const file of files) {
    const filePath = path.join(__dirname, file);
    const url = repoBase + file;
    console.log(`Downloading: ${file}`);
    try {
      await download(url, filePath);
      console.log(`✓ Success: ${file}`);
    } catch (err) {
      console.error(`X Failed: ${file} - ${err.message}`);
      process.exit(1);
    }
  }
}

run();
