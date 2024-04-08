# Usar a imagem node:18-alpine como base
FROM node:18-alpine

# Mudar para o diretório de trabalho /app-frontend
WORKDIR /app-frontend

# Copiar os package.json e package-lock.json para o container
COPY package*.json ./

# Instalar as dependências Node
RUN npm install

# Copiar o restante dos arquivos da aplicação para o container
COPY . .

# Sinalize que aplicação expõe a porta 5173
EXPOSE 5173

ENTRYPOINT [ "npm", "run", "dev" ]