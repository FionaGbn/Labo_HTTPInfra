# version
FROM node:14.17.0

# installation de nano
RUN apt-get update && apt-get install nano

# copie du dossier src
COPY src/ /opt/app

# lancement du script index.js au démarrage
CMD ["node", "/opt/app/index.js"]
