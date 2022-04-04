require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const route = require('./src/routes/index');

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));

// Init route
route(app);

//http://localhost:3000/
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

