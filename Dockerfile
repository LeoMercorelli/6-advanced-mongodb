# 1. Imagen base de Node
FROM node:20-alpine

# 2. Establecer directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar package.json y package-lock.json primero (para cache de dependencias)
COPY package*.json ./

# 4. Instalar dependencias
RUN npm install

# 5. Copiar todo el código fuente dentro de /app
COPY ./src ./src

# 6. Exponer el puerto que usa tu app
EXPOSE 8181

# 7. Comando por defecto para levantar el server
CMD ["node", "src/server.js"]
