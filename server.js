const express = require('express');

const port = 3333;

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('<h1>Welcome to Sprint Challenge Express-Node</h1>');
})

server.listen(port, () => console.log(`Server running on ${port}`));