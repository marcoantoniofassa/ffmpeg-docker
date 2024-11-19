const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");

const app = express(); // Certifique-se de que o Express está inicializado aqui

// Middleware para JSON
app.use(express.json());

// Rota para processar vídeos
app.post("/process", (req, res) => {
    const { inputVideo } = req.body;

    if (!inputVideo) {
        return res.status(400).send("URL do vídeo é obrigatória.");
    }

    console.log("Processando vídeo:", inputVideo);

    const outputFile = "/tmp/output.srt";
    const command = `ffmpeg -i "${inputVideo}" -map 0:s:0 ${outputFile}`;

    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error("Erro ao processar FFmpeg:", stderr);
            return res.status(500).send(`Erro no processamento: ${stderr}`);
        }

        // Retorna o conteúdo da legenda extraída
        fs.readFile(outputFile, "utf8", (err, data) => {
            if (err) {
                console.error("Erro ao ler o arquivo:", err);
                return res.status(500).send("Erro ao ler o arquivo de legendas.");
            }
            res.send({ message: "Legenda extraída com sucesso!", subtitles: data });
        });
    });
});

// Inicia o servidor na porta configurada
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
