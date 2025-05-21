# Node API - Consultório Odontológico

Este projeto consiste no desenvolvimento de uma API em Node.js para gerenciar um consultório odontológico, realizando operações CRUD integradas a um banco de dados SQL hospedado no Azure.  
A solução inclui:  
✅ Integração contínua (CI)  
✅ Entrega contínua (CD)  
✅ Deploy automatizado no Azure App Service via Azure DevOps

---

## 🚀 Tecnologias Utilizadas

- **Node.js** 20.x
- **Express.js**
- **MSSQL** (biblioteca de conexão SQL)
- **Azure SQL Database**
- **Azure App Service** (hospedagem da aplicação)
- **Azure DevOps** (pipeline CI/CD)
- **Git** (versionamento)

---

## ⚙️ Funcionalidades da API

- ✅ Criar consulta odontológica e paciente  
- ✅ Listar consultas e pacientes  (/consultas e /pacientes)
- ✅ Atualizar dados de consulta e pacientes
- ✅ Deletar consulta e paciente
- ✅ Verificar conexão com o banco de dados (/verificar-conexao)  


** link API **: https://api-cosultorio-avdwe4hxd2bscpbu.eastus2-01.azurewebsites.net/


As operações são persistidas diretamente no **Azure SQL Database**.



## JSON pacientes
[
  {
    "ID": 1,
    "Nome": "João da Silva",
    "CPF": "123.456.789-00",
    "DataNascimento": "1990-05-15T00:00:00.000Z",
    "Telefone": "11999999999",
    "Email": "joao.silva@example.com"
  },
  {
    "ID": 2,
    "Nome": "Maria Oliveira",
    "CPF": "987.654.321-00",
    "DataNascimento": "1985-10-22T00:00:00.000Z",
    "Telefone": "21988888888",
    "Email": "maria.oliveira@example.com"
  },
  {
    "ID": 3,
    "Nome": "Carlos Souza",
    "CPF": "111.222.333-44",
    "DataNascimento": "1978-03-09T00:00:00.000Z",
    "Telefone": "31977777777",
    "Email": "carlos.souza@example.com"
  }
]

## JSON Consultas

[
  {
    "ID": 1,
    "PacienteID": 1,
    "DataConsulta": "2024-06-10T09:00:00.000Z",
    "TipoConsulta": "Limpeza",
    "Dentista": "Dr. Ana Paula",
    "Observacoes": "Paciente sem restrições."
  },
  {
    "ID": 2,
    "PacienteID": 2,
    "DataConsulta": "2024-06-12T14:30:00.000Z",
    "TipoConsulta": "Canal",
    "Dentista": "Dr. João Marcos",
    "Observacoes": "Paciente com histórico de dor."
  },
  {
    "ID": 3,
    "PacienteID": 3,
    "DataConsulta": "2024-06-15T11:00:00.000Z",
    "TipoConsulta": "Extração",
    "Dentista": "Dra. Fernanda Lima",
    "Observacoes": "Paciente ansioso."
  }
]


As tabelas possuem relacionamentos como pode ser visto na relação consulta/paciente
