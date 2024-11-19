const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const app = express();

// Aumenta o limite do corpo para 200 MB
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "2000mb" }));

app.post("/process", (req, res) => {
    const { inputVideo } = req.body;

    // Simula um processamento apenas como exemplo
    exec(`ffmpeg -i ${inputVideo} -map 0:s:0 output.srt`, (err, stdout, stderr) => {
        if (err) {
            res.status(500).send(`Erro: ${stderr}`);
        } else {
            res.send("Legenda extraída com sucesso!");
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
