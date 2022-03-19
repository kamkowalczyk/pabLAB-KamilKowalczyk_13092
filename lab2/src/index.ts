
import express from 'express'
import {Request, Response} from 'express'
import {Note} from './note'

const app = express()

app.use(express.json())


const notes: Note[]= []



app.get('/note/:id', function (req: Request, res: Response) {
  const note = notes.find(el => el.id === req.body.id)
  if(note === undefined) {
    res.status(404).send('Note does not exist')
  } else {
    res.status(200).send(note)
  }
})

app.post('/note', function (req: Request, res: Response) {
  const note = req.body
  if(note.title === undefined) {
      res.status(400).send('Note title is undefined')
  } else if(note.content === undefined) {
      res.status(400).send('Note content is undefined')
  } else {
      note.id = Date.now()
      notes.push(note)
      res.status(201).send(note)
  }
})

app.put('/note/:id', function (req: Request, res: Response) {
  const note: Note = req.body
  if(note.title === undefined) {
      res.status(400).send('Note title is undefined')
  } else if(note.content === undefined) {
      res.status(400).send('Note content is undefined')
  } else if(note.id === undefined) {
      res.status(400).send('Note id is undefined')
  } else {
      let newNote = notes.find(el => el.id === note.id)
      if(newNote === undefined) {
        res.status(404).send('Note does not exist')
      } else
      newNote = note;
      res.status(201).send(note)
  }
})

app.delete('/note/:id', function (req: Request, res: Response){
    const note = notes.find(el => el.id === req.body.id)
    if(note === undefined) {
        res.status(400).send('Note does not exist')
    }
    else {
        notes.splice(req.body.id, 1)
        res.status(204).send(note)
    }
})

app.listen(3000)