const express = require("express");
const app = express();
const Sequelize = require("sequelize");

const HTTP_PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");

const sequelize = new Sequelize("database", "user", "password", {
    host: "host",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false }
    }
});

const Name = sequelize.define("Name", {
  fName: Sequelize.STRING,  // first Name
  lName: Sequelize.STRING, // Last Name
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    Name.findAll({
        order: ["id"]
    }).then((data) => {
        res.render("home", { data });
    });
});

app.post("/updateName", (req, res) => {
    if (req.body.lName.length == 0 && req.body.fName.length == 0) {
        Name.destroy({
            where: { id: req.body.id }
        }).then(() => {
            console.log("successfully removed user: " + req.body.id);
            res.redirect("/"); 
        });
    } else {
        Name.update({
            lName: req.body.lName,
            fName: req.body.fName
        }, {
            where: { id: req.body.id }
        }).then(() => {
            console.log("successfully updated name: " + req.body.id);
            res.redirect("/");
        });
    }
});

app.post("/addName", (req, res) => {
    Name.create({
        lName: req.body.lName,
        fName: req.body.fName
    }).then(() => {
        console.log("successfully created a new name");
        res.redirect("/");
    });
});

sequelize.sync().then(() => {
    app.listen(HTTP_PORT, ()=>{
      console.log(`server listening on: ${HTTP_PORT}`);
    });
});
