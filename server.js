const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { exec } = require('child_process');

app.use(bodyParser.json());

app.post('/process', async (req, res) => {
    try {
        const { inputVideo } = req.body;

        if (!inputVideo) {
            return res.status(400).send("URL do vídeo é obrigatória.");
        }

        console.log(`Processando vídeo: ${inputVideo}`);

        // Diretórios e arquivos temporários
        const videoPath = '/tmp/input.mp4';
        const subtitlePath = '/tmp/output.srt';

        // Baixa o vídeo (simulação com comando curl)
        exec(`curl -o ${videoPath} "${inputVideo}"`, (err) => {
            if (err) {
                console.error('Erro ao baixar vídeo:', err);
                return res.status(500).send("Erro ao baixar o vídeo.");
            }

            // Processa o vídeo com FFmpeg
            exec(`ffmpeg -i ${videoPath} -map 0:s:0 ${subtitlePath}`, (err) => {
                if (err) {
                    console.error('Erro ao processar FFmpeg:', err);
                    return res.status(500).send("Erro ao processar o vídeo.");
                }

                // Lê o arquivo de legendas e envia como resposta
                fs.readFile(subtitlePath, 'utf8', (err, data) => {
                    if (err) {
                        console.error('Erro ao ler o arquivo de legendas:', err);
                        return res.status(500).send("Erro ao ler as legendas.");
                    }

                    // Limpa os arquivos temporários
                    fs.unlink(videoPath, () => console.log('Arquivo de vídeo removido.'));
                    fs.unlink(subtitlePath, () => console.log('Arquivo de legendas removido.'));

                    res.json({
                        message: 'Legenda extraída com sucesso!',
                        subtitles: data
                    });
                });
            });
        });
    } catch (error) {
        console.error('Erro no servidor:', error);
        res.status(500).send("Erro interno do servidor.");
    }
});

// Inicia o servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
