 // Output is on port 8080

 var express = require('express');
 var bodyParser = require('body-parser');
 var mongoose = require('mongoose');

 var app = express();

 mongoose.connect('mongodb://localhost:27017/todoApp', {
     useMongoClient: true
 }, function (err) {
     if (err) {
         console.log('failed to connect to MONGO');
         console.log(err);
     }

 });

 var db = mongoose.connection;
 mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
 mongoose.connection.once('open', function () {
     console.log('Were In');
 });


 mongoose.Promise = global.Promise;

 var ToDoSchema = new mongoose.Schema({
     title: {
         type: String,
         required: true
     },
     isActive: {
         type: Boolean,
         default: true
     },
     status: {
         type: String,
         default: 'active'
     },
     strikeIt: {
         type: Boolean,
         default: false
     }
 });

 var toDoModel = mongoose.model('todos', ToDoSchema, 'todos');

 app.use(express.static('./public'));
 app.use(bodyParser.urlencoded({
     extended: true
 }));
 app.use(bodyParser.json());
 app.use(express.static(__dirname));


// .get requests to various pages
 app.get('/', function (req, res) {
     res.sendFile('./public/html/index.html', {
         root: './'
     })
     //console.log(todoID_Val);
 });


 app.get('/todo', function (req, res) {
     toDoModel.find({},
         function (err, toDoList) {
             if (err) {
                 res.status(500).send(err);
                 return console.log(err);
             }
             res.status(200).send(toDoList);
         }
     )

 });


// .post requests to various pages
 app.post('/new-todo', function (req, res) {

     var newToDo = {
         title: req.body.newToDo.title
     };
     new toDoModel(newToDo).save(function (err, createToDo) {
         if (err) {
             res.status(500).send(err);
             return console.info(err);
         }

         res.status(200).send(createToDo);
     })
 });

 app.post('/update-todo', function (req, res) {
     var updateVal = req.body;
     toDoModel.update({
         _id: updateVal._id
     }, updateVal, function (err) {
         if (err) {
             res.send('Aliens must have abducted your update. :\( Please try again.');
         } else {
             res.send('It worked! Yay!');
         }
     });

 });

 app.post('/delete-todo', function (req, res) {
     var updateVal = req.body;
     toDoModel.remove({
         _id: updateVal._id
     }, function (err) {
         if (err) {
             res.send('Delete didn\'t work for some strange reason.  :-\( Please try again.' );
         } else {
             res.send('It worked! Yay!');
         }
     });

 });

 app.post('/strikeit', function (req, res) {
     var updateVal = req.body;
     toDoModel.update({
         todo_id: updateVal.todo_id
     }, updateVal, function (err) {
         if (err) {
             res.send('Hmmmm. That\'s interesting. Please try again');
         } else {
             res.send('It worked! Yay!');
         }
     });

 })

 app.listen(8080);