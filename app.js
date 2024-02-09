/*
> npm init
> npm install express
> npm i nodemon --save-dev
> package.json inside "scripts" adding new ("start": "nodemon app.js") after "test"
> npm i mongoose

> npm start
*/

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 8080;

const myDataBase = "ponczki";
const url = `mongodb://localhost:27017/${myDataBase}`;
mongoose.connect(url);
const db = mongoose.connection; // obiekt do interakcji z bazą danych


app.get("/", (req, res) => {
    res.send("server mongo activated");
});

app.get("/api/ponczki", async (req, res) => {
    try {
        const collection = db.collection("handmode");
        const allPonczkis = await collection.find({}).toArray();
        res.send(allPonczkis);
    } catch (err) {
        res.status(500).json({err: err.message});
    }
});

app.get("/api/ponczki/:id", async (req, res) => {
    try {
        const currentID = +req.params.id;
        if (isNaN(currentID)) return res.status(400).json({message: "Invalid ID"});
        const collection = db.collection("handmode");
        const ponczekDokument = await collection.findOne({id: currentID});
        if (!ponczekDokument) return res.status(404).json({message: "Dokument not found"});
        res.send(ponczekDokument);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

app.post("/api/ponczki", async (req, res) => {
    try {
        const collection = db.collection("handmode");
        const newPonczekDokument = req.body;
        console.log(newPonczekDokument.name);

        if (!newPonczekDokument || typeof newPonczekDokument !== Object) return res.status(400).json({message: "Invalid document format"});
        const result = await collection.insertOne(newPonczekDokument);
        if (!result.acknowledged) return res.status(500).json({message: "Failed to add the document"});
        res.status(201).json({message: "Document added successfully", insertID: result.insertedId});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

app.listen(PORT, () => console.log("server is running on " + PORT));

process.on("SIGINT", () => {
    console.log("zamykanie połącznia z mongo");
    db.close(() => {
        process.exit();
    })
});