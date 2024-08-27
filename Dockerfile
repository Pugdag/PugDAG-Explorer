# Utiliser une image de base
FROM node:14

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers de dépendance
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Installer serve globalement
RUN npm install -g serve

# Copier le reste des fichiers du projet
COPY . .

# Construire l'application (si nécessaire)
# RUN npm run build

# Exposer le port sur lequel votre application s'exécute
EXPOSE 3000

# Commande pour démarrer votre application avec serve
CMD ["serve", "-s", "build", "-l", "3000"]
