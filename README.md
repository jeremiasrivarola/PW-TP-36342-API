# MyLibrary — API REST

Backend da aplicação MyLibrary, uma biblioteca pessoal virtual.
Desenvolvido em Node.js com Express, Prisma e autenticação JWT.

## Tecnologias utilizadas

- Node.js
- Express
- Prisma (ORM)
- PostgreSQL
- JSON Web Tokens (JWT)
- Bcrypt
- Cloudinary + Multer (upload de imagens)

## Estrutura do projeto

```
src/
├── config/         # Instância do cliente Prisma
├── controllers/    # Recebem os pedidos HTTP e delegam para os services
├── middlewares/    # Autenticação JWT e upload de imagens
├── routes/         # Definição dos endpoints por recurso
├── services/       # Lógica de negócio e acesso à base de dados
├── app.js          # Configuração do Express e registo de rotas
└── server.js       # Ponto de entrada do servidor
```

## Instalação e execução local

```bash
# Clonar o repositório
git clone https://github.com/jeremiasrivarola/PW-TP-36342-API.git
cd PW-TP-36342-API

# Instalar dependências
npm install
```

Criar um ficheiro `.env` na raiz do projeto com o seguinte conteúdo:

```
DATABASE_URL=...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

```bash
# Executar as migrações da base de dados
npx prisma db push

# Iniciar o servidor
npm start
```

## Endpoints disponíveis

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | /auth/register | Não | Registo de novo utilizador |
| POST | /auth/login | Não | Login; devolve token JWT |
| GET | /books | Sim | Listagem dos livros (filtrável por status e genre) |
| POST | /books | Sim | Criação de livro (suporta upload de capa) |
| GET | /books/:id | Sim | Detalhe de um livro |
| PUT | /books/:id | Sim | Actualização de um livro |
| DELETE | /books/:id | Sim | Eliminação de um livro |
| GET | /users/me | Sim | Dados do utilizador autenticado |
| PUT | /users/me | Sim | Actualização do perfil |
| GET | /stats | Sim | Estatísticas da biblioteca pessoal |

## Autenticação

Todas as rotas excepto `/auth/register` e `/auth/login` requerem
o cabeçalho `Authorization: Bearer <token>`.
O token tem validade de 7 dias.

## Deploy

A API está disponível em produção na Vercel.
