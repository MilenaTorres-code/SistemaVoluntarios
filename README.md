# 🧹 Limpeza Brás

Sistema desenvolvido para auxiliar no gerenciamento de voluntários e no controle de presença e frequência.

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

### AC2 — Busca e registro de presença

**✅ Concluído**

* Busca de voluntário pelo nome
* Seleção do voluntário
* Registro de presença com data
* Bloqueio de presença duplicada no mesmo dia
* Consulta das presenças do dia e resumo (total, homens e mulheres)
* Alteração de registro de presença
* Ativação e inativação de voluntário
* Bloqueio de presença para voluntário inativo
* Integração Front-end e Back-end
* Persistência no banco de dados
* Testes da API com Swagger

### Próximas etapas

**📌 Planejado**

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

## 📁 Estrutura

```text
SistemaVoluntarios/
├── README.md
├── SistemaVoluntarios.Api/
└── limpezabras-frontend/
```

## 🗄️ Banco de dados

Tabelas principais:

```text
voluntarios   → cadastro dos voluntários (AC1)
presencas     → registros de presença por data (AC2)
```

A API é desenvolvida em ASP.NET Core e utiliza Entity Framework Core para comunicação com o banco de dados.

## 📋 Desenvolvimento

As tarefas do projeto são acompanhadas pelo GitHub Projects e pelas issues, e este README é atualizado conforme cada AC é concluída.

### Legenda

* ✅ Concluído
* 🔄 Em andamento
* 📌 Planejado

Desenvolvido por Milena Torres
