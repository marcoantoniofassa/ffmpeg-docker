# **FFmpeg Subtitle Extractor**

Este projeto utiliza o **FFmpeg** em um ambiente Docker para extrair legendas de vídeos hospedados em URLs públicas, como S3. Ele foi desenvolvido para rodar na **Railway**, com suporte para requisições HTTP POST para processar os vídeos e retornar as legendas extraídas.

---

## **Como Funciona**

1. O cliente faz uma requisição HTTP POST para o endpoint `/process` com o link direto do vídeo.
2. O servidor baixa o vídeo para um diretório temporário.
3. O **FFmpeg** processa o vídeo para extrair as legendas em formato `.srt`.
4. As legendas são retornadas no formato JSON.

---

## **Instalação**

### **Pré-requisitos**
- Conta na [Railway](https://railway.app?referralCode=7Ci7gt).
- Node.js instalado localmente.
- FFmpeg.

### **1. Clone o Repositório**
```bash
git clone https://github.com/seu-usuario/seu-projeto.git
cd seu-projeto
```

### **2. Configure as Variáveis de Ambiente**
Crie um arquivo `.env` no diretório raiz:
```
PORT=8080
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region
```

### **3. Suba para o Railway**
1. Conecte o projeto ao Railway.
2. Confirme o build automático com o Dockerfile.

---

## **Uso**

### **Requisição HTTP POST**
Envie uma requisição POST para o endpoint `/process` com um corpo JSON contendo a URL direta do vídeo.

#### **Exemplo:**
```bash
curl -X POST "https://seu-endereco.railway.app/process" \
     -H "Content-Type: application/json" \
     -d '{"inputVideo": "https://seu-bucket-s3.s3.amazonaws.com/video.mp4"}'
```

#### **Resposta:**
```json
{
  "message": "Legenda extraída com sucesso!",
  "subtitles": "1\n00:00:00,000 --> 00:00:04,000\nOlá, bem-vindo ao vídeo..."
}
```

---

## **Dicas para o Google Drive**

Se o vídeo estiver no Google Drive, **não use o link direto** no serviço porque ele não será processado devido ao redirecionamento e à autenticação do Google, mesmo quando público.

### **Solução com n8n**
1. Use o **n8n** para automatizar o download do vídeo e envio ao S3.
   - **Node Google Drive Download:** Faz o download do vídeo.
   - **Node S3 Upload:** Envia o vídeo baixado para o S3.
2. Use o link gerado no S3 como entrada para o serviço de processamento.

### **Recomendação**
Hospede o vídeo em serviços como:
- Amazon S3
- DigitalOcean Spaces
- Qualquer outro serviço que suporte links diretos.

---

## **Desenvolvimento**

### **Estrutura do Projeto**
```
/server.js        # Código principal do servidor
/Dockerfile       # Configuração do Docker para o projeto
/README.md        # Documentação do projeto
```

### **Tecnologias Utilizadas**
- **Node.js**: Backend para processar as requisições.
- **Express.js**: Framework para criar o servidor HTTP.
- **FFmpeg**: Ferramenta de linha de comando para processar vídeos.
- **Docker**: Contêiner para empacotar e rodar o ambiente.
- **Railway**: Hospedagem do projeto.

---

## **Problemas Conhecidos**

1. **Links do Google Drive**:
   - Não utilize links do Google Drive diretamente no serviço. Prefira fazer o download para um serviço como S3 antes de processar.

2. **Erro "Invalid data found when processing input"**:
   - Ocorre quando o vídeo não está acessível ou em um formato incompatível. Verifique as permissões e o formato.
