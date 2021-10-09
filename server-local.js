'use strict';
const express = require('express')
const app = require('./express/server');
const path = require('path')
app.use('/main.js', express.static(path.join(__dirname,'frontend/dist/main.js')))
app.use('/', express.static(path.join(__dirname,'frontend/dist/index.html')))
app.use('/*', express.static(path.join(__dirname,'frontend/dist/index.html')))
app.listen(3000, () => console.log('Local app listening on port 3000!'));
