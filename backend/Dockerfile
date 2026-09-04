# o FROM esoclhe a imagem inicial (S.O. ou linguagem)
FROM node:24-alpine

#WORKDIR muda a pasta ativa de trabalho *NO CONTAINER*
WORKDIR /app

# COPY só copia os arquivos de algum lugar
COPY package*.json ./

#RUN roda comandos durante a criação da imagem. serve principalmente para baixar as dependências do primeiro COPY
RUN npm ci

# aqui ele copia o restante do código
COPY . .

#expõe a porta que o app vai usar
EXPOSE 3000

#comando pra rodar a parada toda
CMD [ "npm", "run", "dev" ]