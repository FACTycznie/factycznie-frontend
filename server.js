// server.js
'use strict';

const express = require('express');

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

const path = require('path');
const serveStatic = require('serve-static');

const app = express();
app.use(serveStatic(__dirname + "/dist"));

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
