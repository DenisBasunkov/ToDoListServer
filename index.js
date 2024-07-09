import express from "express"
import { v4 as uuid4 } from "uuid"
import multer from "multer"

import sqlite3 from "sqlite3"
const SQLite3 = sqlite3.verbose();
const db = new SQLite3.Database('myDatabase.db');

const PORT = 5000
const upload = multer()
const app = express()

app.get("/", (req, res) => {
    res.json("Hello")
})

app.get("/api/User", (req, res) => {
    const { Login, Password } = req.query;
    db.serialize(() => {
        db.each(`SELECT Id, Name FROM User WHERE (Login = "${Login}") and (Password = "${Password}") `, (err, row) => {
            if (err) {
                console.log(err)
            } else {
                console.log(row)
                db.each(`SELECT TasksData FROM TasksList WHERE UserId = ${row.Id}`, (err, Tasksrow) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(Tasksrow)
                        res.json({ status: true, dataUSER: row, data: Tasksrow })
                    }
                })
            }

        })
    })
})

app.put("/api/User", (req, res) => {
    const { Login, Password, Name } = req.query;
    db.serialize(() => {
        db.run(`INSERT INTO User (Login,Password,Name) VALUES ("${Login}", "${Password}", "${Name}")`, function (err) {
            if (err) {
                console.log(err)
                res.json({ status: false })

            } else {
                console.log(this.lastID)
                const UsId = this.lastID
                const data = JSON.stringify([{ id: uuid4(), title: "Основной", items: [] }])
                db.run(`INSERT INTO TasksList (TasksData,UserId) VALUES (?,?)`, [data, UsId], (err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.json({ status: true, dataUSER: { Id: UsId, Name: Name }, data: data })
                    }
                })
            }
        })
    })
})

app.put("/api/TaskList", (req, res) => {
    const { User_Id, datas } = req.query
    console.log(User_Id)
    console.log(datas)
    if (User_Id) {

        db.serialize(() => {
            db.run(`UPDATE TasksList Set TasksData = ? WHERE UserId = ?`, [datas, User_Id], (err) => {
                if (err) {
                    res.json({ status: false, mess: err })
                } else {
                    res.json({ status: true })
                }

            })
        })
    }
})

app.listen(PORT, () => {
    console.log("fss")
})