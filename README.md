# 🧹 Limpeza Brás

Sistema desenvolvido para auxiliar no gerenciamento de voluntários e, futuramente, no controle de presença e frequência.

O projeto está sendo desenvolvido de forma incremental através das ACs.

## 📊 Status

**🟢 Em desenvolvimento**

### AC1 — Cadastro de voluntários

**✅ Concluído**

* Cadastro de voluntários
* Consulta de voluntários
* Alteração de voluntários
* Integração Front-end e Back-end
* Persistência no banco de dados
* Testes da API com Swagger

### Próximas etapas

**🔄 Planejado**

* Busca de voluntários
* Registro de presença
* Calendário de presença
* Controle de frequência
* Dashboard
* Aniversariantes

## 🛠️ Tecnologias

**Front-end**

* Next.js
* React
* TypeScript

**Back-end**

* C#
* ASP.NET Core
* Entity Framework Core

**Banco de dados**

* MySQL/MariaDB
* XAMPP

**Ferramentas**

* Visual Studio Code
* Swagger
* Git/GitHub
* Trello

## 📁 Estrutura

```text
SistemaVoluntarios/
├── README.md
├── SistemaVoluntarios.Api/
└── limpezabras-frontend/
```

## 🗄️ Banco de dados

A tabela principal da AC1 é:

```text
voluntarios
```

## 🔌 API

Principais endpoints:

```text
GET  /api/Voluntarios
POST /api/Voluntarios
PUT  /api/Voluntarios/{id}
```

A API é desenvolvida em ASP.NET Core e utiliza Entity Framework Core para comunicação com o banco de dados.

## 📋 Desenvolvimento

As tarefas do projeto são acompanhadas prlo git e este README será atualizado conforme cada AC for concluída.

### Legenda

* ✅ Concluído
* 🔄 Em andamento
* 📌 Planejado


Desenvolvido por Milena Torres