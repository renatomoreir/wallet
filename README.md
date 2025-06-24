# Carteira Financeira - Wallet

```
O objetivo consiste na criação de uma carteira financeira em que os usuários possam realizar transferência de saldo. Teremos apenas dois tipo de usuário que tem permições para reverter transações.
```

<br/>

## Subir o Projeto

### Docker - Build do Contêiner
Acesse o site oficial para baixar e instalar Docker: https://www.docker.com/get-started

```
docker ps -a
docker-compose up -d db
-- docker-compose up -d

```
ou
```
docker run --name wallet-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=wallet -p 5432:5432 -d postgres
```

<br/>

### Node 
```
npm install
npm run start:dev
```

```
http://[::1]:3000/api
```




npm run test

npm run test:e2e
