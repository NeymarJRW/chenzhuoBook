const router = require('./router/index')
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use('/', router);
// console.log("sssssssssssssss")
app.listen(port, function () {
  console.log(`已运行localhost:${port}`)
})