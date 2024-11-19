# Use uma imagem base do Ubuntu para FFmpeg e Node.js
FROM ubuntu:20.04

# Configura o frontend para evitar prompts interativos
ENV DEBIAN_FRONTEND=noninteractive

# Atualize pacotes e instale dependências necessárias
RUN apt-get update && apt-get install -y \
    ffmpeg \
    nodejs \
    npm \
    curl && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Defina o diretório de trabalho
WORKDIR /app

# Copie o servidor HTTP para o contêiner
COPY server.js /app/

# Inicialize um projeto Node.js e instale dependências
RUN npm init -y && npm install express

# Crie um diretório para arquivos temporários
RUN mkdir -p /tmp

# Garanta que o diretório temporário seja limpo ao iniciar o contêiner
RUN echo '#!/bin/bash\nrm -rf /tmp/*\nexec "$@"' > /usr/local/bin/entrypoint.sh && \
    chmod +x /usr/local/bin/entrypoint.sh

# Expor a porta usada pelo servidor
EXPOSE 3000

# Use o script de limpeza como entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Comando padrão para iniciar o servidor
CMD ["node", "server.js"]
