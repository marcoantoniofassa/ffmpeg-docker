# Adicione o Node.js para rodar o servidor
RUN apt-get update && apt-get install -y nodejs npm

# Copie o servidor e instale dependências
COPY server.js /app/
WORKDIR /app
RUN npm init -y && npm install express

# Inicie o servidor
CMD ["node", "server.js"]
