const express = require("express");
const { exec } = require("child_process");
const app = express();

app.use(express.json());

const downloadVideo = (url, outputPath) => {
    return new Promise((resolve, reject) => {
        const command = `curl -L "${url}" -o ${outputPath}`;
        exec(command, (err, stdout, stderr) => {
            if (err) return reject(stderr);
            resolve(stdout);
        });
    });
};

app.post("/process", async (req, res) => {
    const { inputVideo } = req.body;
    const outputPath = "/tmp/input.mp4";

    try {
        // Baixar o vídeo primeiro
        await downloadVideo(inputVideo, outputPath);

        // Processar o vídeo com FFmpeg
        const command = `ffmpeg -i ${outputPath} -map 0:s:0 /tmp/output.srt`;
        exec(command, (err, stdout, stderr) => {
            if (err) return res.status(500).send(stderr);
            res.send("Legenda extraída com sucesso!");
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
