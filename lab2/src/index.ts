
import express from 'express'
import {Request, Response} from 'express'
import {Note} from './note'

const app = express()

app.use(express.json())


const notes: Note[]= []



app.get('/note/:id', function (req: Request, res: Response) {
  notes.forEach(el=>{
    if(el.id=== +req.params.id){
      res.status(200).send(el);
    }
  });
 
  //res.sendStatus(404).send("Nie można pobrać elementu.")
})
app.post('/note', function (req: Request, res: Response) {
  const note =  {
    id:1,
    title:"Notatka1",
    content:"Zrob zadanie"
  }
  notes.push(note)
  res.status(200).send('Notatka dodana.');

  //res.sendStatus(400).send("Zła zawartość.")
})
app.put('/note/:id', function (req: Request, res: Response) {
  console.log(req.body) // e.x. req.body.title 
  res.sendStatus(204).send('Zaaktualizowano dane.');
  //res.sendStatus(404).send('Nie można zaktualizować danych.');
})
app.delete('/note/:id', function (req: Request, res: Response) {
  console.log(req.body) // e.x. req.body.title 
  res.sendStatus(204).send('Usunięto dane.');
  // res.sendStatus(400).send('Nie można usunąć danych.');
})

app.listen(3000)