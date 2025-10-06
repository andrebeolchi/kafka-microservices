# Sistema de Microserviços com Kafka

## O que é este projeto?
Este projeto foi desenvolvido para entender na prática conceitos fundamentais de **microserviços**, **Apache Kafka** e **Elasticsearch**. Trata-se de um sistema de e-commerce distribuído onde cada serviço tem sua responsabilidade específica e se comunica de forma assíncrona através do Kafka.

## Índice
- [Sistema de Microserviços com Kafka](#sistema-de-microserviços-com-kafka)
  - [O que é este projeto?](#o-que-é-este-projeto)
  - [Índice](#índice)
  - [Estrutura do Projeto](#estrutura-do-projeto)
  - [Arquitetura](#arquitetura)
  - [Como Executar o Projeto?](#como-executar-o-projeto)
    - [Pré-requisitos](#pré-requisitos)
    - [Passos para Configuração](#passos-para-configuração)
  - [Como Testar o Projeto?](#como-testar-o-projeto)
    - [Gerenciar Produtos](#gerenciar-produtos)
    - [Gerenciar Carrinho](#gerenciar-carrinho)
    - [Criar Pedidos](#criar-pedidos)
    - [Autenticação](#autenticação)
    - [Documentação da API](#documentação-da-api)
    - [Testes Automatizados](#testes-automatizados)
    - [Tecnologias Utilizadas](#tecnologias-utilizadas)

## Estrutura do Projeto
```plain
kafka-microservices/
├── catalog-service/         # Serviço de catálogo de produtos
│   ├── src/
│   ├── prisma/
│   └── package.json
├── order-service/           # Serviço de pedidos e carrinho
│   ├── src/
│   ├── drizzle/
│   └── package.json
├── user-service/           # Serviço de usuários e autenticação
│   ├── src/
│   └── package.json
├── payment-service/        # Serviço de pagamentos
│   ├── src/
│   └── package.json
├── broker/                 # Configuração do Kafka
├── db/                     # Scripts de banco de dados
└── docker-compose.yml      # Orquestração dos containers
```

> [!NOTE]
> O ideal é que o `docker-compose.yml` não esteja na raiz do projeto. Foi colocado aqui apenas para facilitar a execução do projeto.

## Arquitetura
O sistema é composto por:

- **Catalog Service**: Gerenciamento de produtos e integração com Elasticsearch
- **Order Service**: Processamento de pedidos e carrinho de compras
- **User Service**: Autenticação e gerenciamento de usuários
- **Payment Service**: Processamento de pagamentos

## Como Executar o Projeto?

### Pré-requisitos

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) ou [npm](https://www.npmjs.com/)

### Passos para Configuração

1. **Clone o repositório**
```bash
git clone git@github.com:andrebeolchi/kafka-microservices.git
cd kafka-microservices
```

2. **Configure as variáveis de ambiente**

```bash
# Para cada serviço, copie o arquivo .env.example para .env
cp catalog-service/.env.example catalog-service/.env
cp order-service/.env.example order-service/.env
cp user-service/.env.example user-service/.env
cp payment-service/.env.example payment-service/.env
```

3. **Inicie os serviços com Docker Compose**
```bash
# na raiz do projeto
docker-compose up -d
```

4. **Execute as migrações dos bancos de dados**
```bash
# Para cada serviço que utiliza banco
cd catalog-service && yarn db:migrate
cd ../order-service && yarn db:migrate
```
> [!IMPORTANT]
> Para `user-service` você precisará rodar o script `db.sql` manualmente no seu banco PostgreSQL.

5. **Inicie os serviços**
```bash
# Em terminais separados
cd catalog-service && yarn dev
cd order-service && yarn dev
cd user-service && yarn dev
cd payment-service && yarn dev
```

6. (OPCIONAL) **Inicie o [frontend](https://github.com/andrebeolchi/kafka-ms-frontend)** para testar a aplicação
```bash
  cd kafka-ms-frontend
  yarn install
  yarn dev
```

A aplicação estará disponível em:

- **Frontend**: http://localhost:9000
- **Catalog Service**: http://localhost:3000
- **Order Service**: http://localhost:3001
- **User Service**: http://localhost:3002
- **Payment Service**: http://localhost:3003

## Como Testar o Projeto?

### Gerenciar Produtos

```bash
# Criar produto
POST http://localhost:3000/products
Content-Type: application/json

{
  "name": "Smartphone",
  "description": "Smartphone moderno",
  "price": 899.99,
  "stock": 50
}

# Listar produtos
GET http://localhost:3000/products

# Buscar produto por ID
GET http://localhost:3000/products/1
```

### Gerenciar Carrinho

```bash
# Adicionar item ao carrinho
POST http://localhost:3001/cart
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "customerId": 1,
  "productId": 1,
  "quantity": 2
}

# Ver carrinho
GET http://localhost:3001/cart
Authorization: Bearer YOUR_TOKEN
```

### Criar Pedidos

```bash
# Criar pedido
POST http://localhost:3001/orders
Authorization: Bearer YOUR_TOKEN

# Listar pedidos
GET http://localhost:3001/orders
Authorization: Bearer YOUR_TOKEN
```

### Autenticação

```bash
# Registrar usuário
POST http://localhost:3002/auth/register
Content-Type: application/json

{
  "username": "usuario",
  "email": "usuario@email.com",
  "password": "123456"
}

# Login
POST http://localhost:3002/auth/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "123456"
}
```

### Documentação da API

Cada serviço possui um arquivo `postman.json` na raiz do seu diretório. Você pode importar esses arquivos no Postman para facilitar os testes das APIs.

- [Catalog Service Postman Collection](catalog-service/postman.json)
- [Order Service Postman Collection](order-service/postman.json)
- [User Service Postman Collection](user-service/postman.json)
- [Payment Service Postman Collection](payment-service/postman.json)

### Testes Automatizados
Não foram implementados testes unitários pois o objetivo principal era o aprendizado da arquitetura distribuída.

### Tecnologias Utilizadas

**Backend**
  - **Node.js** com **TypeScript**
  - **Express.js** para APIs REST
  - **Apache Kafka** para messaging
  - **Elasticsearch** para busca
  - **PostgreSQL** como banco de dados
  - **Prisma** e **Drizzle** como ORMs
  - **Docker** e **Docker Compose** para containerização