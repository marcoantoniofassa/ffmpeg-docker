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

            // Processa o vídeo com FFmpeg (note o "?")
            exec(`ffmpeg -i ${videoPath} -map 0:s:0? ${subtitlePath}`, (err) => {
                if (err) {
                    console.error('Aviso: nenhuma legenda encontrada ou erro no FFmpeg:', err);
                    // Aqui, só registramos o erro, sem retornar pois pode não haver legendas
                }

                // Lê o arquivo de legendas (se existir)
                fs.readFile(subtitlePath, 'utf8', (err, data) => {
                    // Se der erro de leitura ou o arquivo estiver vazio, retorna sem legenda
                    if (err || !data.trim()) {
                        console.log('Nenhuma legenda foi encontrada.');

                        // Limpa os arquivos temporários
                        fs.unlink(videoPath, () => console.log('Arquivo de vídeo removido.'));
                        fs.unlink(subtitlePath, () => console.log('Arquivo de legendas removido.'));

                        return res.json({
                            message: 'Nenhuma legenda encontrada.',
                            subtitles: ''
                        });
                    }

                    // Caso haja legendas
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
        return res.status(500).send("Erro interno do servidor.");
    }
});

// Inicia o servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
