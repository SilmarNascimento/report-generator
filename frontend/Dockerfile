# Usar a imagem node:18-alpine como base
FROM node:18-alpine AS build

# Mudar para o diretório de trabalho /app-frontend
WORKDIR /app-frontend

# Copiar os package.json e package-lock.json para o container
COPY package*.json ./

# Instalar as dependências Node
RUN npm install

# Copiar o restante dos arquivos da aplicação para o container
COPY . .

# Construir a aplicação
RUN npm run build

# Usar a imagem node:18-alpine como base para a imagem final
FROM node:18-alpine

# Instalar o serve globalmente
RUN npm install -g serve

# Mudar para o diretório de trabalho /app-frontend
WORKDIR /app-frontend

# Copiar apenas os arquivos necessários da fase de construção
COPY --from=build /app-frontend/dist ./dist
COPY package*.json ./

# Instalar apenas as dependências de produção
RUN npm install --only=production && npm cache clean --force

# Sinalize que aplicação expõe a porta 5173
EXPOSE 5173

ENTRYPOINT [ "npm", "run", "start" ]



# # Usar a imagem node:18-alpine como base
# FROM node:18-alpine AS build

# # Mudar para o diretório de trabalho /app-frontend
# WORKDIR /app-frontend

# # Copiar os package.json e package-lock.json para o container
# COPY package*.json ./

# # Instalar as dependências Node
# RUN npm install

# # Copiar o restante dos arquivos da aplicação para o container
# COPY . .

# # Sinalize que aplicação expõe a porta 5173
# EXPOSE 5173

# ENTRYPOINT [ "npm", "run", "dev" ]