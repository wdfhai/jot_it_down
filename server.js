const express = require('express');
const path = require('path');
const fs = require('fs');
const { uniqueNamesGenerator, NumberDictionary } = require('unique-names-generator');
let notes = require('./db/db.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static(__dirname + "/public"));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));
app.get('/api/notes', (req, res) => res.sendFile(path.join(__dirname, '/db/db.json')));

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = parseInt(NumberDictionary.generate({ min: 1000, max: 9999 }));
    notes.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json(newNote);
});

app.delete('/api/notes/:id', (req,res) => {
    const deleteThisId = req.params.id;
    const notes2 = notes.filter(note => note.id != deleteThisId);
    notes = notes2;
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json(notes);
});


app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));