const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const mongodb = require('mongodb');
const { MongoClient } = require("mongodb");
const dotenv = require('dotenv');
dotenv.config();

const client = new MongoClient(process.env.FILE_DB_URI);

const app = express();
app.use(
    cors({
        origin: "*"
    })
);

app.use(fileUpload());
app.use(express.json());

app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
  });

  async function upload_file(filename, file) {
    try {
      await client.connect();
      const database = client.db('File-Sharing');
      const Info = database.collection('Info');
      const F = database.collection('File');
      const doc = {
        title: filename,
        date: Date.now(),
      };
      const result = await Info.insertOne(doc);
      const doc2 = {
        File: file,
        File_Info: result.insertedId,
      };
      const result2 = await F.insertOne(doc2);
    } finally {
        
      await client.close();
    }
  }

app.post('/upload', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    if (req.files === null) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
  
    const file = req.files.file;
  
    upload_file(file.name).catch(console.dir);
});

app.listen(3000, () => {
    console.log("server listening on port 3000");
});

axios.get('http://localhost:3000/download')
    .then((response) => {
      console.log(response);
    });

    async function download_file(){
        mongodb.MongoClient.connect(process.env.FILE_DB_URI, async function(error, client) {
            const database = client.db('File-Sharing');
            var bucket = new mongodb.GridFSBucket(database);
            var bytes = await bucket.DownloadAsBytesAsync(ID);
        }); 
    }