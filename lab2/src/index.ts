import express from 'express'
import {Request, Response} from 'express'
import Storage from "../Classes/Data";
import Note from '../Classes/Note';
import Tag from '../Classes/Tag';
import Repository from "../Classes/Repository";
import Login from '../Classes/Login';
import jwt from "jsonwebtoken";
var os = require("os");

const app = express();

const repo: Repository = new Repository();
const loggedInUser = new Login();
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
  if (loggedInUser.IfUserIsAuthorized(req.headers.authorization!, secret)) {
    try {
      res.status(200).send(storage.notes);
    } catch (error) {
      res.status(400).send(error);
    }
  } else {
    res.status(401).send("User is unauthorized")
  }
  
});

app.get("/note/:id", function (req: Request, res: Response) {
  if (loggedInUser.IfUserIsAuthorized(req.headers.authorization!, secret)) {
    const note = storage.notes.find((el) => el.id === +req.params.id);
    
    if (note === undefined) {
      res.status(404).send("Note doesn't exist");
    } else {
      res.status(200).send(note);
    }
  } else {
    res.status(401).send("User is unauthorized")
  }
});

app.post("/note", function (req: Request, res: Response) {
  if(loggedInUser.IfUserIsAuthorized(req.headers.authorization!, secret)) {
    const note: Note = req.body;
    if (note.title === undefined) {
      res.status(400).send("Note title is undefined");
    } else if (note.content === undefined) {
      res.status(400).send("Note content is undefined");
    } else {
      console.log(note);
      if (note.tags !== undefined) {
        note.tags.forEach((tag) => {
          if (!storage.tags.find((el) => el.name === tag.name)) {
            const newTag: Tag = {
              id: Date.now(),
              name: tag.name,
            };
            storage.tags.push(newTag);
          }
        });
      }
      note.id = Date.now();
      storage.notes.push(note);
      res.status(201).send(note);
      repo.updateStorage(JSON.stringify(storage));
    } 
  } else {
    res.status(401).send("User is unauthorized")
  }
});

app.put("/note/:id", function (req: Request, res: Response) {
  if(loggedInUser.IfUserIsAuthorized(req.headers.authorization!, secret)) {
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
    res.status(401).send("User is unauthorized")
  }
});

app.delete("/note/:id", function (req: Request, res: Response) {
  if(loggedInUser.IfUserIsAuthorized(req.headers.authorization!, secret)) {
    const note = storage.notes.find((el) => el.id === +req.params.id);
    if (note === undefined) {
      res.status(400).send("Note doesn't exist");
    } else {
      storage.notes.splice(req.body.id, 1);
      res.status(204).send(note);
      repo.updateStorage(JSON.stringify(storage));
    }
  } else {
    res.status(401).send("User is unauthorized")
  }
  
});



// Tags

app.get("/tags", function (req: Request, res: Response) {
  if(loggedInUser.IfUserIsAuthorized(req.headers.authorization!, secret)) {
    try {
      res.status(200).send(storage.tags);
    } catch (error) {
      res.status(400).send(error);
    }
  } else {
    res.status(401).send("User is unauthorized")
  }
});

app.get("/tag/:id", function (req: Request, res: Response) {
  if(loggedInUser.IfUserIsAuthorized(req.headers.authorization!, secret)) {
    const tag = storage.tags.find((el) => el.id === +req.params.id);
    if (tag === undefined) {
      res.status(404).send("Tag doesn't exist");
    } else {
      res.status(200).send(tag);
    }
  } else {
    res.status(401).send("User is unauthorized")
  }
});

app.post("/tag", function (req: Request, res: Response) {
  if(loggedInUser.IfUserIsAuthorized(req.headers.authorization!, secret)) {
    const tag: Tag = req.body;
    if (tag.name === undefined) {
      res.status(400).send("Tag name is undefined");
    } else if (storage.tags.find((el) => el.name === req.body.name)) {
      res.status(400).send("This tag name has already exist");
    } else {
      tag.id = Date.now();
      storage.tags.push(tag);
      res.status(201).send(tag);
      repo.updateStorage(JSON.stringify(storage));
    }
  } else {
    res.status(401).send("User is unauthorized")
  }
});

app.put("/tag/:id", function (req: Request, res: Response) {
  if(loggedInUser.IfUserIsAuthorized(req.headers.authorization!, secret)) {
    const tag: Tag = req.body;
    if (tag.name === undefined) {
      res.status(400).send("Tag name is undefined");
    } else if (storage.tags.find((el) => el.name === req.body.name)) {
      res.status(400).send("This tag name has already exist");
    } else if (tag.id === undefined) {
      res.status(400).send("Tag id is undefined");
    } else {
      let oldTag = storage.tags.find((el) => el.id === tag.id);
      if (oldTag === undefined) {
        res.status(404).send("Tag doesn't exist");
      } else oldTag = tag;
      res.status(201).send(tag);
      repo.updateStorage(JSON.stringify(storage));
    }
  } else {
    res.status(401).send("User is unauthorized")
  }
});

app.delete("/tag/:id", function (req: Request, res: Response) {
  if(loggedInUser.IfUserIsAuthorized(req.headers.authorization!, secret)) {
    const tag = storage.tags.find((el) => el.id === +req.params.id);
    if (tag === undefined) {
      res.status(400).send("Tag doesn't exist");
    } else {
      storage.tags.splice(req.body.id, 1);
      res.status(204).send(tag);
      repo.updateStorage(JSON.stringify(storage));
    }
  }
});

app.post("/login", function(req: Request, res: Response) {
  const user: Login = req.body
  if(!user.login || !user.password) {
    res.status(401).send("Login or password is undefined")
  }
  const payload = user.login
  loggedInUser.login = user.login
  loggedInUser.password = user.password
  const token = jwt.sign(payload, secret)
  res.status(200).send(token)
})

app.listen(3000);



