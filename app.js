//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

const todolistSchema = {
  name: String
}

const items = mongoose.model("item", todolistSchema);

const item1 = new items({
  name: "DSA sheet question"
})

const item2 = new items({
  name: "Web developemt"
})

const item3 = new items({
  name: "One daily challenge at leetcode"
})

let defaultItem = [item1, item2, item3];

// items.insertMany(defaultItem).then(function(){
//             console.log("Data insert");
//       }).catch((err)=>{
//             console.log(err);
//        })
const listSchema = {
  name: String,
  item: [todolistSchema]
}

const list = mongoose.model("list", listSchema);


app.get("/", function (req, res) {

  items.find().then((data) => {
    if (data.length == 0) {
      items.insertMany(defaultItem).then(function () {
        
      }).catch((err) => {
        console.log(err);
      })
      res.redirect("/");
    }
    else {
      res.render("list", { listTitle: "Today", newListItems: data });
    }
  }).catch((error) => {
  assert.isNotOk(error,'Promise error');
  done();
})
});



app.post("/", function (req, res) {

  const newitem = req.body.newItem;
  const listname = req.body.list;
  const item = new items({
    name: newitem
  })
  if (listname == "Today") {

    item.save();
    res.redirect("/");
  } else {

    list.findOne({ name: listname }).then((data) => {

      data.item.push(item);
      data.save();
      res.redirect("/" + listname);

    }).catch((err) => {

      console.log(err);
    })

  }

});

app.post("/delete", function (req, res) {

  let itemId = req.body.checkbox;
  let listname = req.body.list;

  if (listname == "Today") {
    async function toWork() {
      try {
        const res = await items.deleteOne({ _id: itemId });
      }
      catch (err) {
        console.log(err);
      }
    }
    toWork()
    res.redirect("/");
  }
  else {
      
      list.findOneAndUpdate({name : listname} , {"$pull" : {item : {_id : itemId}} }).then((data)=>{
         if(data){
      
          res.redirect("/" + listname);
         }
      }).catch((err)=>{
        console.log(err);
      })
  }
});

app.get("/:todo", function (req, res) {

  let name = _.capitalize(req.params.todo);

  list.findOne({ name: name })
    .then((val) => {


      if (!val) {
        const listItem = new list({
          name: name,
          item: defaultItem
        })
        listItem.save();
        res.redirect("/" + name);
      }
      else {

        res.render("list", { listTitle: name, newListItems: val.item });
      }

    })
    .catch((err) => {
      console.log(err);
    });



  // async function list() {

  //   let val = await list.findOne({ name: name });

  //   if (!val) {
  //     const listItem = new list({
  //       name: name,
  //       item: defaultItem
  //     })
  //     listItem.save();
  //     res.redirect("/" + name);
  //   }
  //   else{

  //     res.render("list" , { listTitle: name ,  newListItems: val.item });
  //   }
  // }

  // list();

  // list.findOne({ name: name }).then((data) => {

  //   if (data.name != name) {
  //     const listItem = new list({
  //       name: name,
  //       item: defaultItem
  //     })
  //     listItem.save();
  //     res.redirect("/" + name);
  //   }

  //   res.redirect("list" , { listTitle: name , newListItems: data.item })

  // })

});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
