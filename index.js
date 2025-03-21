const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Configuração do banco de dados
const config = {
  user: 'admin1@servidor-sql-db001',
  password: '@dmin1234',
  server: 'servidor-sql-db001.database.windows.net',
  database: 'sql-db-sprint3',
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

// Criar pool de conexão para reutilização
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

// Função auxiliar para executar consultas
async function executeQuery(query, params = []) {
  await poolConnect;
  try {
    const request = pool.request();
    
    // Adicionar parâmetros à consulta
    params.forEach(param => {
      request.input(param.name, param.type, param.value);
    });
    
    return await request.query(query);
  } catch (err) {
    console.error('Erro ao executar consulta:', err);
    throw err;
  }
}

// CRUD para Pacientes
app.get('/pacientes', async (req, res) => {
  try {
    const result = await executeQuery('SELECT * FROM Pacientes');
    res.json({
      sucesso: true,
      mensagem: 'Pacientes recuperados com sucesso',
      dados: result.recordset
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar pacientes',
      erro: err.message
    });
  }
});

app.post('/pacientes', async (req, res) => {
  try {
    const { ID, Nome, CPF, DataNascimento, Telefone, Email } = req.body;
    
    // Validação básica
    if (!ID || !Nome || !CPF) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Campos ID, Nome e CPF são obrigatórios',
        dados: null
      });
    }
    
    await executeQuery(
      `INSERT INTO Pacientes (ID, Nome, CPF, DataNascimento, Telefone, Email)
       VALUES (@id, @nome, @cpf, @dataNascimento, @telefone, @email)`,
      [
        { name: 'id', type: sql.Int, value: ID },
        { name: 'nome', type: sql.NVarChar, value: Nome },
        { name: 'cpf', type: sql.NVarChar, value: CPF },
        { name: 'dataNascimento', type: sql.Date, value: DataNascimento },
        { name: 'telefone', type: sql.NVarChar, value: Telefone },
        { name: 'email', type: sql.NVarChar, value: Email }
      ]
    );
    
    // Buscar o paciente recém-cadastrado para retornar
    const pacienteCadastrado = await executeQuery(
      'SELECT * FROM Pacientes WHERE ID = @id',
      [{ name: 'id', type: sql.Int, value: ID }]
    );
    
    res.status(201).json({
      sucesso: true,
      mensagem: 'Paciente criado com sucesso',
      dados: pacienteCadastrado.recordset[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao criar paciente',
      erro: err.message
    });
  }
});

app.put('/pacientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Nome, CPF, DataNascimento, Telefone, Email } = req.body;
    
    // Validação básica
    if (!Nome || !CPF) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Campos Nome e CPF são obrigatórios',
        dados: null
      });
    }
    
    const result = await executeQuery(
      `UPDATE Pacientes
       SET Nome = @nome, CPF = @cpf, DataNascimento = @dataNascimento, 
           Telefone = @telefone, Email = @email
       WHERE ID = @id`,
      [
        { name: 'id', type: sql.Int, value: parseInt(id) },
        { name: 'nome', type: sql.NVarChar, value: Nome },
        { name: 'cpf', type: sql.NVarChar, value: CPF },
        { name: 'dataNascimento', type: sql.Date, value: DataNascimento },
        { name: 'telefone', type: sql.NVarChar, value: Telefone },
        { name: 'email', type: sql.NVarChar, value: Email }
      ]
    );
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Paciente não encontrado',
        dados: null
      });
    }
    
    // Buscar o paciente atualizado para retornar
    const pacienteAtualizado = await executeQuery(
      'SELECT * FROM Pacientes WHERE ID = @id',
      [{ name: 'id', type: sql.Int, value: parseInt(id) }]
    );
    
    res.json({
      sucesso: true,
      mensagem: 'Paciente atualizado com sucesso',
      dados: pacienteAtualizado.recordset[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao atualizar paciente',
      erro: err.message
    });
  }
});

app.delete('/pacientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Primeiro buscar o paciente para retornar seus dados após a exclusão
    const pacienteParaExcluir = await executeQuery(
      'SELECT * FROM Pacientes WHERE ID = @id',
      [{ name: 'id', type: sql.Int, value: parseInt(id) }]
    );
    
    if (pacienteParaExcluir.recordset.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Paciente não encontrado',
        dados: null
      });
    }
    
    const result = await executeQuery(
      'DELETE FROM Pacientes WHERE ID = @id',
      [{ name: 'id', type: sql.Int, value: parseInt(id) }]
    );
    
    res.json({
      sucesso: true,
      mensagem: 'Paciente excluído com sucesso',
      dados: pacienteParaExcluir.recordset[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao excluir paciente',
      erro: err.message
    });
  }
});

// CRUD para Consultas
app.get('/consultas', async (req, res) => {
  try {
    const result = await executeQuery('SELECT * FROM Consultas');
    res.json({
      sucesso: true,
      mensagem: 'Consultas recuperadas com sucesso',
      dados: result.recordset
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar consultas',
      erro: err.message
    });
  }
});

app.post('/consultas', async (req, res) => {
  try {
    const { ID, PacienteID, DataConsulta, TipoConsulta, Dentista, Observacoes } = req.body;
    
    // Validação básica
    if (!ID || !PacienteID || !DataConsulta || !Dentista) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Campos ID, PacienteID, DataConsulta e Dentista são obrigatórios',
        dados: null
      });
    }
    
    await executeQuery(
      `INSERT INTO Consultas (ID, PacienteID, DataConsulta, TipoConsulta, Dentista, Observacoes)
       VALUES (@id, @pacienteId, @dataConsulta, @tipoConsulta, @dentista, @observacoes)`,
      [
        { name: 'id', type: sql.Int, value: ID },
        { name: 'pacienteId', type: sql.Int, value: PacienteID },
        { name: 'dataConsulta', type: sql.DateTime, value: DataConsulta },
        { name: 'tipoConsulta', type: sql.NVarChar, value: TipoConsulta },
        { name: 'dentista', type: sql.NVarChar, value: Dentista },
        { name: 'observacoes', type: sql.NVarChar, value: Observacoes }
      ]
    );
    
    // Buscar a consulta recém-cadastrada para retornar
    const consultaCadastrada = await executeQuery(
      'SELECT * FROM Consultas WHERE ID = @id',
      [{ name: 'id', type: sql.Int, value: ID }]
    );
    
    res.status(201).json({
      sucesso: true,
      mensagem: 'Consulta criada com sucesso',
      dados: consultaCadastrada.recordset[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao criar consulta',
      erro: err.message
    });
  }
});

app.put('/consultas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { PacienteID, DataConsulta, TipoConsulta, Dentista, Observacoes } = req.body;
    
    // Validação básica
    if (!PacienteID || !DataConsulta || !Dentista) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Campos PacienteID, DataConsulta e Dentista são obrigatórios',
        dados: null
      });
    }
    
    const result = await executeQuery(
      `UPDATE Consultas
       SET PacienteID = @pacienteId, DataConsulta = @dataConsulta, 
           TipoConsulta = @tipoConsulta, Dentista = @dentista, Observacoes = @observacoes
       WHERE ID = @id`,
      [
        { name: 'id', type: sql.Int, value: parseInt(id) },
        { name: 'pacienteId', type: sql.Int, value: PacienteID },
        { name: 'dataConsulta', type: sql.DateTime, value: DataConsulta },
        { name: 'tipoConsulta', type: sql.NVarChar, value: TipoConsulta },
        { name: 'dentista', type: sql.NVarChar, value: Dentista },
        { name: 'observacoes', type: sql.NVarChar, value: Observacoes }
      ]
    );
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Consulta não encontrada',
        dados: null
      });
    }
    
    // Buscar a consulta atualizada para retornar
    const consultaAtualizada = await executeQuery(
      'SELECT * FROM Consultas WHERE ID = @id',
      [{ name: 'id', type: sql.Int, value: parseInt(id) }]
    );
    
    res.json({
      sucesso: true,
      mensagem: 'Consulta atualizada com sucesso',
      dados: consultaAtualizada.recordset[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao atualizar consulta',
      erro: err.message
    });
  }
});

app.delete('/consultas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Primeiro buscar a consulta para retornar seus dados após a exclusão
    const consultaParaExcluir = await executeQuery(
      'SELECT * FROM Consultas WHERE ID = @id',
      [{ name: 'id', type: sql.Int, value: parseInt(id) }]
    );
    
    if (consultaParaExcluir.recordset.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Consulta não encontrada',
        dados: null
      });
    }
    
    const result = await executeQuery(
      'DELETE FROM Consultas WHERE ID = @id',
      [{ name: 'id', type: sql.Int, value: parseInt(id) }]
    );
    
    res.json({
      sucesso: true,
      mensagem: 'Consulta excluída com sucesso',
      dados: consultaParaExcluir.recordset[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao excluir consulta',
      erro: err.message
    });
  }
});

// Endpoint para verificar a conexão com o banco
app.get('/verificar-conexao', async (req, res) => {
  try {
    await poolConnect;
    const result = await executeQuery('SELECT 1 as teste');
    res.json({ 
      sucesso: true, 
      mensagem: 'Conexão com o banco de dados estabelecida com sucesso',
      dados: { teste: result.recordset[0].teste }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro na conexão com o banco de dados',
      erro: err.message 
    });
  }
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err);
  res.status(500).json({
    sucesso: false,
    mensagem: 'Erro interno no servidor',
    erro: err.message
  });
});

// Iniciar o servidor
const server = app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
