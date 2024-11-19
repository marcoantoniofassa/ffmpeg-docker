# Use uma imagem base do Ubuntu
FROM ubuntu:20.04

# Atualize pacotes e instale o FFmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean

# Defina o diretório de trabalho
WORKDIR /app

# Comando padrão para testar o FFmpeg
CMD ["ffmpeg", "-version"]
