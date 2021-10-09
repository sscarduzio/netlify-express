'use strict';
const express = require('express')
const app = require('./express/server');
const path = require('path')
app.use('/', express.static(path.join(__dirname,'frontend/dist')))
app.listen(3000, () => console.log('Local app listening on port 3000!'));
