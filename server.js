const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Porta que o servidor irá escutar

// Define o diretório para arquivos estáticos (HTML, CSS, imagens, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Rota para sempre servir o arquivo login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
