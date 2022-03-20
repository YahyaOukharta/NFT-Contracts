const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('c2d42daeefca17994c70', '354b45cbc5fdf5294d9fa378f8a067c7df6f12885010665d45e4e5c2aef9bc42');
const path = require('path');
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


async function uploadArt(ipfs, pathToFolder) {
    console.log(`Uploading "${pathToFolder}" to ipfs ...`);
    let hash;

    let result = await pinata.pinFromFS(pathToFolder);
    console.log(result);
    hash = result.IpfsHash;
    //hash = result[result.length - 1].hash;
    console.log(`Uploaded ${result.length} file(s) to ipfs.`);
    console.log(`Art folder hash : "${hash}"`);
    console.log()

    return hash;
}

async function uploadMetadata(ipfs, pathToFolder) {
    console.log(`Uploading "${pathToFolder}" to ipfs ...`);
    let hash;

    let result = await pinata.pinFromFS(pathToFolder);
    //hash = result[result.length - 1].hash;
    hash = result.IpfsHash;
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


pinata.testAuthentication().then(async (result) => {

    // upload art 
    const ipfs = "uh"
    const artHash = await uploadArt(ipfs, artFolder);
      // generate metadata
  
      const maxSupply = 4888;
      const collectionName = "Bored Azuki";
      const tokensDescription = "Leave the drab reality and enter the world of "+collectionName+". "+collectionName+" is home to "+maxSupply+" generative arts where colors reign supreme.";
      await emptyFolder(metadataFolder)
      for (let i = 1; i <= maxSupply; ++i){
          let data = 
          {
              "id": i,
              "name": collectionName+" #"+i,
              "image": "ipfs://"+artHash+"/unrevealed.png", // unrevealed
              "description": tokensDescription,
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
      
      //delete the 4xxx metadata files
      await emptyFolder(metadataFolder)

}).catch((err) => {
    //handle error here
    console.log(err);
});
