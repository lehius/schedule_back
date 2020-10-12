const express = require("express");
const multer = require("multer");
const exphbs = require("express-handlebars");
const Emitter = require("events");

let emitter = new Emitter();

const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

// app.use(express.static('public'))
app.use(express.static(__dirname + "/public"));

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    cb(null, "data.csv");
  },
});
app.use(multer({
  storage: storageConfig
}).single("filedata"));

app.get("/", (req, res) => {
  res.render("index");
});
app.post("/upload", function (req, res, next) {
  let filedata = req.file;
  if (!filedata) {
    console.log("don't uploaded");
  } else {
    console.log("uploaded");
    emitter.emit('reload')
  }
  res.redirect("/");
  res.end();
});

app.post('/subscribe', (req, res) => {
  console.log('server: req - subscribe')

  const id = setTimeout(() => {
    console.log('server: timeout')
    res.end(JSON.stringify({
      reload: false,
    }))
  }, 30000)

  emitter.on('reload', () => {
    clearTimeout(id)
    console.log('server: reload')
    res.end(JSON.stringify({
      reload: true,
    }))
  })
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});