import express from "express";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";

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

const secret = "EO$WIriJESKKRNKJENWKJWEjewkjnwekjnwe";

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] })
websiteSchema.plugin(encrypt, { secret: secret, encryptedFields: ["websites"] });

const User = new mongoose.model("User", userSchema);
const Website = new mongoose.model("Website", websiteSchema);

app.get("/", (req, res) => {
  if (session.user) {

    res.render("dashboard.ejs");
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
  if (session.user) {
    const websites = typeof req.body.website === 'string' ? [req.body.website] : req.body.website;
    const passwords = typeof req.body.password === 'string' ? [req.body.password] : req.body.password;
    const data = websites.map((site, i) => {
      return { website: site, password: passwords[i] }
    }).filter(d => d.website != '');

    const website = Website({
      user_id: session.user,
      websites: data,
    });

    website.save();
    res.redirect('/');
  } else {
    res.redirect('/');
  }
});

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
