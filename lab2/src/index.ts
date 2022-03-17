
import express from 'express'
import {Request, Response} from 'express'
import {Note} from './note'

const app = express()

app.use(express.json())


const notes: Note[]= []



app.get('/note/:id', function (req: Request, res: Response) {
  const note = notes.find(n => n.id === req.body.id)
  if(note === undefined) {
    res.status(404).send('Notatka nie isnieje.')
  } else {
    res.status(200).send(note)
  }
})

app.post('/note', function (req: Request, res: Response) {
  const note: Note = req.body
  if(note.title === undefined) {
      res.status(400).send('Podaj tytuł notatki.')
  } else if(note.content === undefined) {
      res.status(400).send('Podaj content notatki. ')
  } else {
      note.id = Date.now()
      notes.push(note)
      res.status(201).send(note)
  }
})

app.put('/note/:id', function (req: Request, res: Response) {
  const note: Note = req.body
  if(note.title === undefined) {
      res.status(400).send('Podaj tytuł notatki.')
  } else if(note.content === undefined) {
      res.status(400).send('Podaj content notatki.')
  } else if(note.id === undefined) {
      res.status(400).send('Podaj id.')
  } else {
      let newNote = notes.find(n => n.id === note.id)
      if(newNote === undefined) {
        res.status(404).send('Notatka nie isnieje.')
      } else
      newNote = note;
      res.status(201).send(note)
  }
})

app.delete('/note/:id', function (req: Request, res: Response){
    const note = notes.find(n => n.id === req.body.id)
    if(note === undefined) {
        res.status(400).send('Notatka nie isnieje.')
    }
    else {
        notes.splice(req.body.id, 1)
        res.status(204).send(note)
    }
})

app.listen(3000)