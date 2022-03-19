const path = require('path');
const IPFS = require('ipfs-api');
const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);

async function emptyFolder(path) {
    try {
      const files = await readdir(path);
      const unlinkPromises = files.map(filename => unlink(`${path}/${filename}`));
      return Promise.all(unlinkPromises);
    }
    catch(err) {
        throw err;
    }
  }
async function createIpfs() {
  return IPFS('localhost', 5001, {
    protocol: 'http'
  });
}

async function uploadArt(ipfs, pathToFolder) {
    console.log(`Uploading "${pathToFolder}" to ipfs ...`);
    let hash;

    let result = await ipfs.util.addFromFs(pathToFolder, { recursive: true });
    hash = result[result.length - 1].hash;
    console.log(`Uploaded ${result.length} file(s) to ipfs.`);
    console.log(`Art folder hash : "${hash}"`);
    console.log()

    return hash;
}

async function uploadMetadata(ipfs, pathToFolder) {
    console.log(`Uploading "${pathToFolder}" to ipfs ...`);
    let hash;

    let result = await ipfs.util.addFromFs(pathToFolder, { recursive: true });
    hash = result[result.length - 1].hash;
    console.log(`Uploaded ${result.length} file(s) to ipfs.`);
    console.log(`Metadata folder hash : "${hash}"`);
    console.log()


    return hash;
}

const artFolder = path.resolve(__dirname, './art'); // content of folder should be files named 1, 2 ,3 or unrevealed.png
const metadataFolder = path.resolve(__dirname, './metadata'); // content of folder should be files named 1, 2 ,3 or unrevealed.png

//IN CASE OF EMFILE ERROR
// sudo su username --shell /bin/bash --command "ulimit -n" 
// su username --shell /bin/bash

async function main(){
    // upload art 
  const ipfs = await createIpfs();
  const artHash = await uploadArt(ipfs, artFolder);
    // generate metadata

    const maxSupply = 4888;
    const collectionName = "Bored Azuki";

    await emptyFolder(metadataFolder)
    for (let i = 1; i <= maxSupply; ++i){
        let data = 
        {
            "id": i,
            "name": collectionName+" #"+i,
            "image": "ipfs://"+artHash+"/unrevealed.png", // unrevealed
            "description": "Leave the drab reality and enter the world of "+collectionName+". "+collectionName+" is home to "+maxSupply+" generative arts where colors reign supreme.",
            "attributes": [
                { 
                    "trait_type": "Status",
                    "value": "Unrevealed"
                }
            ]
        }
        await fs.writeFileSync(metadataFolder + '/' + i, JSON.stringify(data, null, 2));
    }
    console.log(maxSupply + " Metadata generated ")

    const metadataHash = await uploadMetadata(ipfs, metadataFolder);

    fs.writeFileSync('./deployed.json', JSON.stringify({ipfsArt:artHash, ipfsMetadata : metadataHash},null,2));
    
    await emptyFolder(metadataFolder)
}

main()


