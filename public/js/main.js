 var ToDo = new Vue({
     el: '#mongoApp',
     beforeCreate() {
         $.get('/todo', (dataFromServer) => {
             this.toDoList = dataFromServer;
         });
     },
     data: {
         toDoList: [],
         newToDo: {
             title: '',
             isActive: true,
             status: 'active',
             strikeIt: false

         }
     },
     methods: {
         createToDo: function (event) {
             event.preventDefault();
             $.post('/new-todo', {
                 newToDo: this.newToDo
             }, (dataFromServer) => {
                 this.toDoList.push(dataFromServer);
             })

         },
         markComplete: function (todo) {
             todo.isActive = !todo.isActive;
             todo.status = 'completed';

             $.post('/update-todo', todo, function (data) {
                 console.log('########## Data Update ##########');

             })

         },
         markDeleted: function (todo) {

             if (confirm("Are you Sure?")) {
                 todo.status = 'deleted';
                 todo.isActive = false;
                 $.post('/delete-todo', todo, function (data) {
                     console.log('########## Data Deleted ##########');
                 })
             } else {
                 alert('Disaster Averted!');
             }

         },
         markStrikeThru: function (todo) {
             todo.strikeIt = !todo.strikeIt;


         }

     }

 })
