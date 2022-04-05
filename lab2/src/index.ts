import express from 'express'
import {Request, Response} from 'express'
import Storage from "../Classes/Storage";
import Note from '../Classes/Note';
import Tag from '../Classes/Tag';
import Repository from "../Classes/Repository";
import jwt from "jsonwebtoken";
import User from '../Classes/User';

const dotenv = require("dotenv");
dotenv.config();

const app = express();

const repo: Repository = new Repository();
let loggedInUser = new User();
const secret = "test"

let storage: Storage;
repo.readStorage().then((el) => {
  if (el) {
    storage = JSON.parse(el);
  } else {
    storage = new Storage()
  }
});


app.use(express.json());

//Notes
app.get("/notes", function (req: Request, res: Response) {
  const authData = req.headers.authorization ?? ''
  if (loggedInUser.IfUserIsAuthorized(authData, secret)) {
    try {
      res.status(200).send(storage.notes.filter(el => loggedInUser.notesIds.includes(el.id ?? 0)));
    } catch (error) {
      res.status(400).send(error);
    }
  } else {
    res.status(401).send("Unauthorized user")
  }
  
});

app.get("/note/:id", function (req: Request, res: Response) {
  const authData = req.headers.authorization ?? ''
  if (loggedInUser.IfUserIsAuthorized(authData, secret)) {
    const note = storage.notes.find((el) => el.id === +req.params.id && loggedInUser.notesIds.includes(+req.params.id));
    if (note === undefined) {
      res.status(404).send("Note doesn't exist");
    } else {
      res.status(200).send(note);
    }
  } else {
    res.status(401).send("Unauthorized user")
  }
});

app.post("/note", function (req: Request, res: Response) {
  const authData = req.headers.authorization ?? ''
  if(loggedInUser.IfUserIsAuthorized(authData, secret)) {
    const note: Note = req.body;
    if (note.title === undefined) {
      res.status(400).send("Note title is undefined");
    } else if (note.content === undefined) {
      res.status(400).send("Note content is undefined");
    } else {
      if (note.tags !== undefined) {
        note.tags.forEach((tag) => {
          if (!storage.tags.find((el) => el.name === tag.name)) {
            const newTag: Tag = {
              id: Date.now(),
              name: tag.name,
            };
            storage.tags.push(newTag);
            loggedInUser.tagsIds.push(newTag.id ?? 0)
          }
        });
      }
      note.id = Date.now();
      storage.notes.push(note);
      loggedInUser.notesIds.push(note.id);
      res.status(201).send(note);
      repo.updateStorage(JSON.stringify(storage));
    } 
  } else {
    res.status(401).send("Unauthorized user")
  }
});

app.put("/note/:id", function (req: Request, res: Response) {
  const authData = req.headers.authorization ?? ''
  if(loggedInUser.IfUserIsAuthorized(authData, secret)) {
    const note: Note = req.body;
    if (note.title === undefined) {
      res.status(400).send("Note title is undefined");
    } else if (note.content === undefined) {
      res.status(400).send("Note content is undefined");
    } else if (note.id === undefined) {
      res.status(400).send("Note id is undefined");
    } else {
      let newNote = storage.notes.find((el) => el.id === note.id);
      if (newNote === undefined) {
        res.status(404).send("Note doesn't exist");
      } else newNote = note;
      res.status(201).send(note);
      repo.updateStorage(JSON.stringify(storage));
    }
  } else {
    res.status(401).send("Unauthorized user")
  }
});

app.delete("/note/:id", function (req: Request, res: Response) {
  const authData = req.headers.authorization ?? ''
  if(loggedInUser.IfUserIsAuthorized(authData, secret)) {
    const note = storage.notes.find((el) => el.id === +req.params.id);
    if (note === undefined) {
      res.status(400).send("Note doesn't exist");
    } else {
      storage.notes.splice(req.body.id, 1);
      loggedInUser.notesIds.splice(req.body.id, 1)
      res.status(204).send(note);
      repo.updateStorage(JSON.stringify(storage));
    }
  } else {
    res.status(401).send("Unauthorized user")
  }
  
});



// Tags
app.get("/tags", function (req: Request, res: Response) {
  const authData = req.headers.authorization ?? ''
  if(loggedInUser.IfUserIsAuthorized(authData, secret)) {
    try {
      res.status(200).send(storage.tags.filter(el => loggedInUser.tagsIds.includes(el.id ?? 0)));
    } catch (error) {
      res.status(400).send(error);
    }
  } else {
    res.status(401).send("Unauthorized user")
  }
});

app.get("/tag/:id", function (req: Request, res: Response) {
  const authData = req.headers.authorization ?? ''
  if(loggedInUser.IfUserIsAuthorized(authData, secret)) {
    const tag = storage.tags.find((el) => el.id === +req.params.id && loggedInUser.tagsIds.includes(+req.params.id));
    if (tag === undefined) {
      res.status(404).send("Tag doesn't exist");
    } else {
      res.status(200).send(tag);
    }
  } else {
    res.status(401).send("Unauthorized user")
  }
});

app.post("/tag", function (req: Request, res: Response) {
  const authData = req.headers.authorization ?? ''
  if(loggedInUser.IfUserIsAuthorized(authData, secret)) {
    const tag: Tag = req.body;
    if (tag.name === undefined) {
      res.status(400).send("Tag name is undefined");
    } else if (storage.tags.find((el) => el.name === req.body.name)) {
      res.status(400).send("This tag name has already exist");
    } else {
      tag.id = Date.now();
      storage.tags.push(tag);
      loggedInUser.tagsIds.push(tag.id ?? 0)
      res.status(201).send(tag);
      repo.updateStorage(JSON.stringify(storage));
    }
  } else {
    res.status(401).send("Unauthorized user")
  }
});

app.put("/tag/:id", function (req: Request, res: Response) {
  const authData = req.headers.authorization ?? ''
  if(loggedInUser.IfUserIsAuthorized(authData, secret)) {
    const tag: Tag = req.body;
    if (tag.name === undefined) {
      res.status(400).send("Tag name is undefined");
    } else if (storage.tags.find((el) => el.name === req.body.name)) {
      res.status(400).send("This tag name has already exist");
    } else if (tag.id === undefined) {
      res.status(400).send("Tag id is undefined");
    } else {
      let newTag = storage.tags.find((el) => el.id === tag.id);
      if (newTag === undefined) {
        res.status(404).send("Tag doesn't exist");
      } else newTag = tag;
      res.status(201).send(tag);
      repo.updateStorage(JSON.stringify(storage));
    }
  } else {
    res.status(401).send("Unauthorized user")
  }
});

app.delete("/tag/:id", function (req: Request, res: Response) {
  const authData = req.headers.authorization ?? ''
  if(loggedInUser.IfUserIsAuthorized(authData, secret)) {
    const tag = storage.tags.find((el) => el.id === +req.params.id);
    if (tag === undefined) {
      res.status(400).send("Tag doesn't exist");
    } else {
      storage.tags.splice(req.body.id, 1);
      loggedInUser.tagsIds.splice(req.body.id, 1)
      res.status(204).send(tag);
      repo.updateStorage(JSON.stringify(storage));
    }
  }
});

// Login

app.post("/login", function(req: Request, res: Response) {
  const user: User = req.body
  if(!user.login || !user.password) {
    res.status(401).send("Login or password is undefined")
  }
  user.id = Date.now();
  const payload = user.id.toString()
  loggedInUser = new User();
  loggedInUser.id = user.id
  loggedInUser.login = user.login
  loggedInUser.password = user.password
  const token = jwt.sign(payload, secret)
  res.status(200).send(token)
  storage.users.push(user);
  repo.updateStorage(JSON.stringify(storage));
  
})

app.listen(3000);



