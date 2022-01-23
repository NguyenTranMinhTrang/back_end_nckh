const express = require('express');
const app = express();
const port = 3000;
const route = require('./src/routes/index');

// Init route
route(app);

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})