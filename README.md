API de Consultas Odontológicas
Este projeto é uma API RESTful para gerenciamento de consultas odontológicas, desenvolvida com Node.js e Express, que se comunica com um banco de dados SQL Server hospedado na Azure.

Funcionalidades
CRUD completo para Pacientes
CRUD completo para Consultas
Validação de dados
Tratamento de erros
Conexão segura com banco de dados SQL Server na Azure
Tecnologias Utilizadas
Node.js
Express.js
SQL Server (Azure)
mssql (driver para SQL Server)
CORS
Endpoints Disponíveis
Pacientes
GET /pacientes - Lista todos os pacientes
POST /pacientes - Cadastra um novo paciente
PUT /pacientes/:id - Atualiza dados de um paciente
DELETE /pacientes/:id - Remove um paciente
Consultas
GET /consultas - Lista todas as consultas
POST /consultas - Agenda uma nova consulta
PUT /consultas/:id - Atualiza dados de uma consulta
DELETE /consultas/:id - Cancela uma consulta
Diagnóstico
GET /verificar-conexao - Verifica a conexão com o banco de dados
Configuração e Instalação
Clone o repositório
Instale as dependências:
npm install

Copy

Apply

Configure as variáveis de ambiente ou ajuste as configurações de banco de dados no arquivo index.js
Execute a aplicação:
npm start

Copy

Apply

Deploy na Azure
Esta API está configurada para ser implantada em um Web App na Azure, utilizando integração contínua com o GitHub.

Estrutura do Banco de Dados
Tabela Pacientes
ID (int)
Nome (varchar)
CPF (varchar)
DataNascimento (date)
Telefone (varchar)
Email (varchar)
Tabela Consultas
ID (int)
PacienteID (int) - Chave estrangeira referenciando Pacientes
DataConsulta (datetime)
TipoConsulta (varchar)
Dentista (varchar)
Observacoes (varchar)
Autor
