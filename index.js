import express from "express"

const PORT = 5000

const app = express()

app.get("/", (req, res) => {
    res.json("Hello")
})

app.listen(PORT, () => {
    console.log("fss")
})