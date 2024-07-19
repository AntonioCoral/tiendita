# Utiliza una imagen base oficial de Node.js
FROM node:14

# Crea el directorio de la aplicación en el contenedor
WORKDIR /app

# Copia el package.json y el package-lock.json
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Instala TypeScript globalmente
RUN npm install -g typescript

# Copia el resto de los archivos del proyecto
COPY . .

# Compila el proyecto TypeScript
RUN npm run build

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 500

# Define el comando para ejecutar la aplicación
CMD ["npm", "start"]
