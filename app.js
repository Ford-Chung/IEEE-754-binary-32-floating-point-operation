//Install Command:
//npm init
//npm i express express-handlebars body-parser
const express = require('express');
const server = express();

const bodyParser = require('body-parser')
server.use(express.json()); 
server.use(express.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));

server.use(express.static('public'));

//This part of the code will load the controllers that will interact
//with the rest of the system.
const controllers = ['Routes'];
for(var i=0; i<controllers.length; i++){
  const model = require('./controllers/'+controllers[i]);
  model.add(server);
}

const port = process.env.PORT | 9090;
server.listen(port, function(){
  console.log('Listening at port '+port);
});
