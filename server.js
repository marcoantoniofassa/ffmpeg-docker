const fs = require("fs");

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

        // Lê o arquivo de legendas e retorna como resposta
        fs.readFile(outputFile, "utf8", (err, data) => {
            if (err) {
                console.error("Erro ao ler o arquivo:", err);
                return res.status(500).send("Erro ao ler o arquivo de legendas.");
            }
            res.send({ message: "Legenda extraída com sucesso!", subtitles: data });
        });
    });
});
