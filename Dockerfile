# Use uma imagem base do Ubuntu para FFmpeg e Node.js
FROM ubuntu:20.04

# Atualize pacotes e instale dependências necessárias
RUN apt-get update && apt-get install -y \
    ffmpeg \
    nodejs \
    npm && \
    apt-get clean

# Defina o diretório de trabalho
WORKDIR /app

# Copie o servidor HTTP para o contêiner
COPY server.js /app/

# Inicialize um projeto Node.js e instale dependências
RUN npm init -y && npm install express

# Expor a porta usada pelo servidor
EXPOSE 3000

# Comando padrão para iniciar o servidor
CMD ["node", "server.js"]
