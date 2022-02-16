const path = require('path');
const IPFS = require('ipfs-api');


function createIpfs() {
  return IPFS('ipfs.infura.io', 5001, {
    protocol: 'https'
  });
}

function uploadFolder(ipfs, pathToFolder) {
  console.log("0_0 | Upload images to ipfs");

  console.log(`Uploading "${pathToFolder}" to ipfs ...`);
  ipfs.util.addFromFs(pathToFolder, { recursive: true }, (err, result) => {
    if (err) {
      throw err;
    }
    console.log()
    const hash = result[result.length - 1].hash;
    console.log(`Uploaded ${result.length} file(s) to ipfs.`);
    console.log(`Folder hash : "${hash}"`);

    const fs = require('fs');
    fs.writeFileSync('./deployed.json', JSON.stringify({ipfsAssets:hash},null,2));
  });
}

const buildDir = path.resolve(__dirname, '../scripts/assets');
try {
  const ipfs = createIpfs();
  uploadFolder(ipfs, buildDir);
} catch (err) {
  console.error(`Failed to upload "${buildDir}"`, err);
}

