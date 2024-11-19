const express = require("express");
const { exec } = require("child_process");
const app = express();

app.use(express.json());

// Endpoint para processar vídeos
app.post("/process", (req, res) => {
    const { inputVideo } = req.body;

    if (!inputVideo) {
        return res.status(400).send("Caminho do vídeo é obrigatório.");
    }

    // Comando para extrair legendas
    const command = `ffmpeg -i ${inputVideo} -map 0:s:0 output.srt`;

    exec(command, (err, stdout, stderr) => {
        if (err) {
            return res.status(500).send(`Erro: ${stderr}`);
        }
        res.send(`Legenda extraída com sucesso! Saída:\n${stdout}`);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
