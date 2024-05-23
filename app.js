const express = require('express');

// importando as bibliotecas de sessões e cookies
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

// configurar o uso da biblioteca cookie-parser
app.use(cookieParser());

// configurar a sessão
app.use(
    session({
        secret: 'minhachave', //chave para assinar os cookies da sessão
        resave: false, //evitar regravar as sessões sem alterações
        saveUnitialized: true, // salva sessões não inicializadas (anônimas)
    })
);

// exemplos
const produtos = [
    {id: 1, nome: 'Produto 1', preco: 10},
    {id: 2, nome: 'Produto 2', preco: 15},
    {id: 3, nome: 'Produto 3', preco: 20},
];

app.get('/produtos', (req, res) => {
    res.send(`
        <h1>Lista de Produtos</h1>
        <ul>
            ${produtos.map((produto) => 
                `<li>${produto.nome} - ${produto.preco}
                <a href="/adicionar/:${produto.id}">Adicionar ao Carrinho</a></li>`)
                .join("")}
        </ul>
        <a href="/carrinho">Ver Carrinho</a>
        `);
});

// rota para adicionar produtos no carrinho
app.get('/adicionar/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const produto = produtos.find((p) => p,id === id);

    if(produto){
        if(!req.session.carrinho){
            req.session.carrinho = [];
        }
        req.session.carrinho.push(produto);
    }
    res.redirect('/produtos');
});

// rota para exibir o carrinho de compras
app.get('/carrinho', (req, res) => {
    const carrinho = req.session.carrinho || [];

    const total = carrinho.reduce((acc, produto) => acc + produto.preco, 0);

    res.send(`
        <h1>Carrinho de Compras</h1>
        <ul>
            ${carrinho.map((produto) => `<li>${produto.nome} - ${produto.preco}</li>`)
                .join("")}
        </ul>
        <p>Total: ${total}</p>
        <a href="/produtos">Continuar Comprando</a>

    `);
});

app.listen(3000, () => {
    console.log('Aplicação rodando')
});