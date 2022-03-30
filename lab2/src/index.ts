
import express from 'express'
import {Request, Response} from 'express'
import Note from '../Classes/Note'
import Tag from '../Classes/Tag'
import Login from '../Classes/Login'
import fs from 'fs';
var os = require("os");

const app = express()

app.use(express.json())




let tags: Tag[] = [];
let notes: Note[] = [];
const registerUser = new Login();
const secret = "Test"



async function  readStorage(): Promise<void> {
  try {
   await fs.promises.readFile('./storeFile.json', 'utf-8');
    
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
const jwt = require('jsonwebtoken')

//Notes
app.get('/notes', async function (req: Request, res: Response) {
  await readStorage();
  try {
    res.status(200).send(notes)
  } catch (error) {
    res.status(400).send(error)
  }
})
app.get('/note/:id', async function (req: Request, res: Response) {
  await readStorage();
  const note = notes.find(el => el.id === +req.body.id)
  console.log(req);
  if(note === undefined) {
    res.status(404).send("Note doesn't exist.");
  } else {
    res.status(200).send(note)
  }
 
});

app.post('/note',  async function (req: Request, res: Response) {
  await readStorage();
  console.log(req);
  const note: Note = req.body
  if(note.title === undefined) {
      res.status(400).send('Note title is undefined.')
  } else if(note.content === undefined) {
      res.status(400).send('Note content is undefined.')
  } else {
      note.id = Date.now();
      notes.push(note);
      await updateStorage(note);
      res.status(201).send(note);
  }
  
});

app.put('/note/:id', async function (req: Request, res: Response) {
  
  const note: Note = req.body
  if(note.title === undefined) {
      res.status(400).send('Note title is undefined.');
  } else if(note.content === undefined) {
      res.status(400).send('Note content is undefined.');
  } else if(note.id === undefined) {
    res.status(400).send('Note id is undefined.');
  } 
   else {
      let newNote = notes.find(el => el.id === note.id)
      if(newNote === undefined) {
        res.status(404).send("Note doesn't exist.");
      } else{
      newNote = note;
      res.status(201).send(note)
      }
  }
  await updateStorage(note);
});

app.delete('/note/:id', async function (req: Request, res: Response){
    await readStorage();
    const note = notes.find(el => el.id === +req.body.id)
    if(note === undefined) {
        res.status(400).send("Note doesn't exist.");
    }
    else {
        notes.splice(req.body.id, 1)
        res.status(204).send(note)
        await updateStorage(note);
    }
  

});

//Tags

app.get('/tags', function (req: Request, res: Response) {
  try {
    res.status(200).send(tags)
  } catch (error) {
    res.status(400).send(error)
  }
})

app.get('/tag/:id', function (req: Request, res: Response) {
  const tag = tags.find(el => el.id === +req.body.id)
  
  if(tag === undefined) {
    res.status(404).send("Tag doesn't exist");
  } else {
    res.status(200).send(tag)
  }
  readStorage();
})

app.post('/tag', function (req: Request, res: Response) {
  const tag: Tag = req.body
  if(tag.name === undefined) {
      res.status(400).send('Tag name is undefined.');
  } else if(tags.find(a => a.name === req.body.name)) {
      res.status(400).send('This tag name has already exist.');
  } else {
      tag.id = Date.now()
      tags.push(tag)
      res.status(201).send(tag)
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
      res.status(400).send('Tag title is undefined.')
  } else {
      let newTag = tags.find(el => el.id === tag.id)
      if(newTag === undefined) {
        res.status(404).send("Tag doesn't exist")
      } else{
      newTag = tag;
      res.status(201).send(tag)
      }
  }

});
app.delete('/tag/:id', function (req: Request, res: Response){
  const tag = tags.find(el => el.id === +req.body.id)
  if(tag === undefined) {
      res.status(400).send("Tag doesn't exist");
  }
  else {
      tags.splice(req.body.id, 1)
      res.status(204).send(tag)
  }
});

app.post("/login", function(req: Request, res: Response) {
  const user: Login = req.body
  if(!user.login || !user.password) {
    res.status(401).send("Login or password is undefined")
  }
  const payload = user.login
  registerUser.login = user.login
  registerUser.password = user.password
  const token = jwt.sign(payload, secret)
  res.status(200).send(token)
});
 
app.listen(3000)




