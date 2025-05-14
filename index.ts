import express from "express"
import path from "path"
const app = express()

app.use(express.static(path.join(__dirname, "src")))
app.use(express.static("public"))

app.get("/", (req, res) => {
  res.render("index.html")
})

app.listen(3000)
