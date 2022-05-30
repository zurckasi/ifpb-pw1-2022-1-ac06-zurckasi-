const http = require("http");
const path = require("path");
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");

const app = express();

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

// cria um vetor global para conter as entradas
let entries = [];
// torna o vetor acessível em todas as views
app.locals.entries = entries;

let detalhes = {};
app.locals.detalhes = detalhes;

// inicializa o logger com nível dev
app.use(logger('dev'));
// inicializa uma variável req.body, caso o usuário
// submeta um formulário
app.use(bodyParser.urlencoded({ extended: false }));

// definição dos roteadores (rotas)

app.get('/', (request, response) => {
    // views/index.ejs
    response.render('index');
});

app.get('/new-entry', (request, response) => {
    response.render('new-entry');
});

app.post('/new-entry', (request, response) => {
    if (!request.body.title || !request.body.body) {
        resonse.status(400).send('As postagens devem ter um título de um corpo.');
        return;
    }

    entries.push({
        title: request.body.title,
        content: request.body.body,
        published: new Date()
    });

    response.redirect('/');
});

//roteador que recebe um parametro e busca a mensagem cujos detalhes devem ser exibidos
app.get('/infopost/:id', (request,response)=>{
    detalhes = entries[request.params.id]
    response.redirect('/infopost')
})

app.use((request, response) => {
    response.status(404).render('404');
});

http.createServer(app).listen(3000, () => {
    console.log('App rodando na porta ' + 3000);
});
