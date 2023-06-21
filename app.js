
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const mongoose = require("mongoose");
// mongoose.connect('mongodb://127.0.0.1:27017/todolistDB', { useNewUrlParser: true });
mongoose.connect('mongodb+srv://muthupandi7227:Freevirus1$@cluster0.3iryrrf.mongodb.net/todolistDB', { useNewUrlParser: true });


const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to Your todolist!"
});

const item2 = new Item({
  name: "Hit the + buttom to add new items!"
});

const item3 = new Item({
  name: "<-- Hit this to delete this item."
});

const defaultItems = [item1, item2, item3];




// const date = require(__dirname + "/date.js");



// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

app.get("/", function (req, res) {

  // const day = date.getDate();

  Item.find({})
    .then(function (foundItems) {

      if (foundItems.length === 0) {
        Item.insertMany(defaultItems)
          .then(function () {
            console.log("successfully saved default items to DB.");
          })
          .catch(function (err) {
            console.log(err);
          });
        res.redirect("/");
      }
      else {
        console.log(foundItems);
        res.render("list", { listTitle: "Today", newListItems: foundItems })
      }


    })


    .catch(function (err) {
      console.log(err);
    });



});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();

  res.redirect("/");
});



app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId)
    .then(function (checkedItemId) {
      if (!err) {
        console.log("Deleted");
      }
    })
    .catch(function (err) {
      console.log(err);
    });

  res.redirect("/");

});




app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});



app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
