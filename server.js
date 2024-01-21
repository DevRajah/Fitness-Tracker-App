
const express = require('express');
require('dotenv').config();
const cors = require ("cors")

const fitnessRouter = require('./router/fitnessRouter');
const fileUpload = require ("express-fileupload")
const app = express();

app.use(fileUpload({
    useTempFiles: true,
    limits: { fileSize: 5 * 1024 * 1024 },
  }));



port = process.env.PORT

app.use(express.json());

app.use(cors(``*``))
require('./dbConfig/fitnessConfig')

app.get('/', (req, res) => {
    res.send("Welcome to our Fitness tracker website");
})

app.use(fitnessRouter); 

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});