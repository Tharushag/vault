import express from "express";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;
let session = {
  user: null,
}

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/vault');

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
});

const websiteSchema = new mongoose.Schema({
  user_id: String,
  websites: [
    {
      website: String,
      password: String,
    }
  ]
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] })
websiteSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["websites"] });

const User = new mongoose.model("User", userSchema);
const Website = new mongoose.model("Website", websiteSchema);

app.get("/", (req, res) => {
  if (session.user) {
    Website.findOne({ user_id: session.user }).then(info => {
      if (info) {
        res.render("dashboard.ejs", { data: info.websites });
      } else {
        res.render("dashboard.ejs");
      }
    }).catch(err => {
      console.log(err);
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
})

app.post("/login", (req, res) => {
  User.findOne({ name: req.body.name }).then(user => {
    if (user) {
      if (user.password === req.body.password) {
        session.user = user.id;
        res.redirect('/');
      } else {
        res.render("login.ejs", { passwordError: "*Incorrect password" });
      }
    } else {
      res.render("login.ejs", { nameError: "*Account doesn't exist" });
    }

  }).catch(err => {
    console.log(err);
    res.render("login.ejs", { bug: "Something went wrong" });
  });
})

app.get("/logout", (req, res) => {
  session.user = null;
  res.redirect("/login");
});

app.get("/sign-up", (req, res) => {
  res.render("sign-up.ejs");
})

app.post("/sign-up", (req, res) => {
  const user = new User({
    name: req.body.name,
    password: req.body.password,
  });

  user.save().then(() => {
    session.user = user.id;
    res.redirect("/");
  }).catch(err => {
    res.redirect("/sign-up", { bug: "Couldn't save user." });
  });
})

app.get("/forgot-password", (req, res) => {
  res.redirect("/");
})

app.post("/save", (req, res) => {
  let data;

  if (!req.body.website) {
    data = null;
  } else if (typeof req.body.website === "string") {
    data = [{ website: req.body.website, password: req.body.password }];
  } else {
    data = req.body.website.map((site, i) => {
      return { website: site, password: req.body.password[i] };
    })
  }

  if (data) {
    Website.findOne({ user_id: session.user }).then(infoExists => {
      if (infoExists) {
        Website.deleteMany({ user_id: session.user }).catch(err => console.log(err));
      }
  
      const newDoc = Website({
        user_id: session.user,
        websites: data,
      });
  
      newDoc.save().then(() => {
        res.redirect('/');
      }).catch(err => {
        console.log(err);
      });
    });
  } else {
    Website.deleteMany({ user_id: session.user }).catch(err => console.log(err));
    res.redirect('/');
  }
});

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
