    // ..required modules.. // ______________________________
const express           = require('express');               //
const mysql             = require('mysql');                 //
const bodyParser        = require('body-parser');           //
const connection        = require('express-myconnection');  //
    //_______________________________________________________

const app               = express();

    // ..importing configs and routes.. //
const routes            = require('./routes/routes');
const config            = require('./config');

    // ..setting DB param.. //
const dbCfg = {
    host:       config.database.host,
    user:       config.database.user,
    password:   config.database.password,
    port:       config.database.port,
    database:   config.database.database
};

    // ..setting template view engine.. //
app.set('view engine', 'ejs');

    // ..middlewares.. //
app.use(connection(mysql,dbCfg, 'single'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('./public'));
app.use('/', routes);

    // ..starting the server.. //
app.listen(config.server.port, function(err){
    if(err) throw err;
    console.log(`Server started on port ${config.server.port}`);
});