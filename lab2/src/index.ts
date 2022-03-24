
import express from 'express'
import {Request, Response} from 'express'
import {Note} from './note'
import {Tag} from './tag'
import fs from 'fs';

const app = express()

app.use(express.json())


let notes: Note[]= [
  {
    title: "a",
    content: "a",
    createDate: "16-02-2022",

    tags: [{ id: 1, name: "a" }],
    id: 1,
  },
  {
    title: "b",
    content: "b",
    createDate: "17-02-2022",
    tags: [{ id: 2, name: "b" }],
    id: 2,
  },
]
let tags: Tag[] = [{
  id: 1,
  name: "a",
},
{
  id: 2,
  name: "b",
},
]




async function  readStorage(): Promise<void> {
  try {
      const data = await fs.promises.readFile('./storeFile.json', 'utf-8');
  } catch (err) {
      console.log(err)
  }
}
 async function updateStorage(data:Note): Promise<void> {
  try {
      await fs.promises.writeFile('./storeFile.json', JSON.stringify(data));
  } catch (err) {
      console.log(err)
  }
}

//Notes

app.get('/note/:id', async function (req: Request, res: Response) {
  await readStorage();
  const note = notes.find(el => el.id === req.body.id)
  if(note === undefined) {
    res.status(404).send('Note does not exist');
  } else {
    res.status(200).send(note)
  }
 
})
app.get('/notes', async function (req: Request, res: Response) {
   await readStorage();
   res.status(200).send(notes);
   
})
app.post('/note',  async function (req: Request, res: Response) {
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
   await updateStorage(note);
});

app.put('/note/:id', async function (req: Request, res: Response) {
  
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
      } else{
      newNote = note;
      res.status(201).send(note)
      }
  }
  await updateStorage(note);
});

app.delete('/note/:id', async function (req: Request, res: Response){
  
    const note = notes.find(el => el.id === req.body.id)
    if(note === undefined) {
        res.status(400).send('Note does not exist')
    }
    else {
        notes.splice(req.body.id, 1)
        res.status(204).send(note)
        await updateStorage(note);
    }

})

//Tags

app.get('/tags', function (req: Request, res: Response) {

  res.status(200).send(tags);

})

app.get('/tag/:id', function (req: Request, res: Response) {
  const tag = tags.find(el => el.id === req.body.id)
  
  if(tag === undefined) {
    res.status(404).send('Tag does not exist')
  } else {
    res.status(200).send(tag)
  }
  readStorage();
})

app.post('/tag', function (req: Request, res: Response) {
  if (req.body.name) {
    const name = req.body.name.toLowerCase();
    let nameUpper = name.toLowerCase();

    const tagFind = tags.find((name) => name.name === nameUpper)
    if(tagFind){
      res.status(404).send("The Note exists.");
    }
    else{
      const tag : Tag = req.body
      if(tag.id === undefined) {
          res.status(400).send('Tag id is undefined.')
      } else if(tag.name === undefined) {
          res.status(400).send('Tag name is undefined.')
      } else {
          tag.id = Date.now()
          tags.push(tag)
          res.status(201).send(tag)
      }
    }
  }
});
app.put('/tag/:id', function (req: Request, res: Response) {
  const tag: Tag = req.body
  const name = req.body.name.toLowerCase();
  let nameUpper = name.toLowerCase();
  nameUpper.toLowerCase();
  const tagFind = tags.find((name) => name.name === nameUpper)
  if(tagFind){
    
    res.status(400).send('The Tag exists.')
    return;
  }

  if(tag.name === undefined) {
      res.status(400).send('Tag title is undefined')
  } else if(tag.id === undefined) {
      res.status(400).send('Tag id is undefined')
  } else {
      let newTag = tags.find(el => el.id === tag.id)
      if(newTag === undefined) {
        res.status(404).send('Tag does not exist')
      } else{
      newTag = tag;
      res.status(201).send(tag)
      }
  }

});
app.delete('/tag/:id', function (req: Request, res: Response){
  const tag = tags.find(el => el.id === req.body.id)
  if(tag === undefined) {
      res.status(400).send('Tag does not exist')
  }
  else {
      tags.splice(req.body.id, 1)
      res.status(204).send(tag)
  }
});

app.listen(3000)


