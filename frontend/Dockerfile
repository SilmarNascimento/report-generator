FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app-frontend

# Copiar apenas arquivos de dependências
COPY package.json package-lock.json ./

# Corrigir o bug de dependência opcional quebrada
RUN npm ci --legacy-peer-deps

# Copiar todo o código
COPY . .

# Expor a porta padrão do Vite
EXPOSE 5173

# Ativar live reload em ambiente Docker
ENV CHOKIDAR_USEPOLLING=true
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Rodar o app em modo dev
CMD ["npm", "run", "dev"]