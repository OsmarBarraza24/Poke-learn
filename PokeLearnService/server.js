console.log('server is starting');
global.fetch = require("node-fetch");


var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var app = express();
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'npokp1rt',
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

app.use(express.json({limit:'1mb'}));


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

app.post('/pokeAnimales', async function(request, response){
    const data = await fetch("https://pokeapi.co/api/v2/pokemon-species/rattata/");
    const data2 = await fetch("https://pokeapi.co/api/v2/pokemon-species/piplup/");
    const data3 = await fetch("https://pokeapi.co/api/v2/pokemon-species/rayquaza/");
    const json = await data.json();
    const json2 = await data2.json();
    const json3 = await data3.json();
    var numero1;
    var numero2;
    var numero3;
    for (let i = 0; i < json.pokedex_numbers.length; i++) {
        if (json.pokedex_numbers[i].pokedex.name === "national") {
            numero1 = json.pokedex_numbers[i].entry_number;
        }
    }
    for (let i = 0; i < json2.pokedex_numbers.length; i++) {
        if (json2.pokedex_numbers[i].pokedex.name === "national") {
            numero2 = json2.pokedex_numbers[i].entry_number;
        }
    }
    for (let i = 0; i < json3.pokedex_numbers.length; i++) {
        if (json3.pokedex_numbers[i].pokedex.name === "national") {
            numero3 = json3.pokedex_numbers[i].entry_number;
        }
    }


    var respuesta = [
        {
            nombre: json.name,
            descrpicion: json.flavor_text_entries[4].flavor_text,
            numero: numero1
        },
        {
            nombre: json2.name,
            descrpicion: json2.flavor_text_entries[3].flavor_text,
            numero: numero2
        },
        {
            nombre: json3.name,
            descrpicion: json3.flavor_text_entries[3].flavor_text,
            numero: numero3
        }
    ];
    response.send(respuesta);
});