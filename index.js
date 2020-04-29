const express = require('express');
const app = express();
let {PythonShell} = require('python-shell');
var path = require('path');
fs = require('fs');

const bodyParser = require('body-parser');
app.use(bodyParser.text({ type: "text/plain" }));


let runCode = (callback) => {
  var options = {
    mode: 'text',
    pythonPath: './python377/python',
    pythonOptions: ['-u'],
    scriptPath: './',
  };
  PythonShell.run('response.py', options, function (err, results) {
    if (err){
      callback({status: "ERROR", response: results})
      return false
    }else{
      callback({status: "PASS", response: results})
      return true
    }
  });
}


app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next()
})

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.post('/code', async function(req, res){
  console.log('We got somping');
  console.log(req.body);

  fs.writeFile('response.py', req.body, function (err) {
    if (err) return console.log(err);

    console.log('Hello World > helloworld.txt');
    runCode((response) => {
        console.log(response);
        res.send(JSON.stringify(response))
    })
  });
})





// app.get('/run/*', async (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");

// });


app.listen(3000, () => {
  console.log('Running on port 3000')
});
