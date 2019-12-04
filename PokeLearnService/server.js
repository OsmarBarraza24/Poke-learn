console.log('server is starting');

var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var app = express();
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'perron12',
    database: 'pokelearndb'
});

connection.connect((error) =>{
    if (error) {
        console.log(error);
    }else{
        console.log('Conectada');
    }
});

var server = app.listen(3000, listening);

function listening(){
    console.log('listening...');
}

app.use(bodyParser.json());

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/addUser', (request, response) =>{
    var nombre = request.body.nombre;
    var apellido = request.body.apellido;
    var correo = request.body.correo;
    var psw = request.body.psw;

    if (!nombre || !apellido || !correo || !psw) {
        var reply={
            msg: "You´ve got something wrong, please check"
        }
        response.send(reply);
    }
    else{
        var usuario  = {
          nombre: nombre,
          apellido: apellido,
          correo: correo,
          psw: psw  
        };
        var query = connection.query('INSERT INTO usuarios SET ?', usuario, function (error, results, fields) {
            if (error) throw error;
            else{
                var reply = {
                    id: results.insertId,
                    nombre: nombre,
                    apellido: apellido,
                    correo: correo,
                    psw: psw,
                    msg: 'thank you'
                }
                
                response.send(reply);
            } 
          });
        
    }

});


app.post('/Login', (request, response) =>{
    var correo = request.body.correo;
    var psw = request.body.psw;

    if (!correo || !psw) {
        var reply={
            msg: "You´ve got something wrong, please check"
        }
        response.send(reply);
    }
    else{

        var query = connection.query('SELECT * FROM usuarios WHERE correo = ? AND psw = ?', [correo, psw], function (error, rows, fields) {
            if (error) throw error;
            else response.send(rows[0]);
          });
    }

});