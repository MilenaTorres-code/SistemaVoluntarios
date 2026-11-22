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

### AC3 — Login e aniversariantes

**✅ Concluído**

* Tela de login
* Cadastro de usuário pelo site
* Autenticação com senha criptografada
* Validação de acesso ao sistema
* Página de aniversariantes do mês
* Quantidade e lista de aniversariantes em ordem de data
* Integração Front-end e Back-end
* Persistência no banco de dados
* Testes da API com Swagger

### Prova — Indicador de frequência

**✅ Concluído**

* Cálculo da frequência de cada voluntário ativo no mês
* Dias de atividade: dias do mês com pelo menos uma presença registrada
* Percentual de frequência: presenças ÷ dias de atividade
* Classificação: Alta (75% ou mais), Média (50% a 74%) e Baixa (abaixo de 50%)
* Frequência média e quantidade de voluntários por faixa
* Página de frequência com seleção do mês
* Integração Front-end e Back-end
* Testes da API com Swagger
* Diagrama de casos de uso, diagrama de classes e modelo lógico

### Próximas etapas

**📌 Planejado**

* Calendário de presença
* Dashboard

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
usuarios      → usuários com acesso ao sistema (AC3)
```

O indicador de frequência é calculado a partir da tabela `presencas`, sem tabela adicional.

A API é desenvolvida em ASP.NET Core e utiliza Entity Framework Core para comunicação com o banco de dados.

## 📋 Desenvolvimento

As tarefas do projeto são acompanhadas pelo GitHub Projects e pelas issues, e este README é atualizado conforme cada AC é concluída.

### Legenda

* ✅ Concluído
* 🔄 Em andamento
* 📌 Planejado

Desenvolvido por Milena Torres
