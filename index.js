const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configuração do banco de dados
const config = {
  user: 'admin1',
  password: 'bancoSprint4',  // ⚠️ Coloque aqui sua senha real
  server: 'sqlserver-odontogenda.database.windows.net',
  database: 'db-odontogenda',
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

async function executeQuery(query, params = []) {
  await poolConnect;
  try {
    const request = pool.request();
    params.forEach(param => {
      request.input(param.name, param.type, param.value);
    });
    return await request.query(query);
  } catch (err) {
    console.error('Erro ao executar consulta:', err);
    throw err;
  }
}

// ✅ Rota para verificar a conexão
app.get('/verificar-conexao', async (req, res) => {
  try {
    await poolConnect;
    res.send('Conexão com o banco de dados estabelecida com sucesso!');
  } catch (err) {
    res.status(500).send('Erro na conexão com o banco de dados: ' + err.message);
  }
});

// ✅ CRUD de Pacientes

app.get('/pacientes', async (req, res) => {
  try {
    const result = await executeQuery('SELECT * FROM Pacientes');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/pacientes', async (req, res) => {
  const { ID, Nome, CPF, DataNascimento, Telefone, Email } = req.body;
  try {
    await executeQuery(
      `INSERT INTO Pacientes (ID, Nome, CPF, DataNascimento, Telefone, Email)
       VALUES (@ID, @Nome, @CPF, @DataNascimento, @Telefone, @Email)`,
      [
        { name: 'ID', type: sql.Int, value: ID },
        { name: 'Nome', type: sql.NVarChar, value: Nome },
        { name: 'CPF', type: sql.NVarChar, value: CPF },
        { name: 'DataNascimento', type: sql.Date, value: DataNascimento },
        { name: 'Telefone', type: sql.NVarChar, value: Telefone },
        { name: 'Email', type: sql.NVarChar, value: Email }
      ]
    );
    res.send('Paciente criado com sucesso');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/pacientes/:id', async (req, res) => {
  const { Nome, CPF, DataNascimento, Telefone, Email } = req.body;
  try {
    await executeQuery(
      `UPDATE Pacientes SET Nome=@Nome, CPF=@CPF, DataNascimento=@DataNascimento,
       Telefone=@Telefone, Email=@Email WHERE ID=@ID`,
      [
        { name: 'Nome', type: sql.NVarChar, value: Nome },
        { name: 'CPF', type: sql.NVarChar, value: CPF },
        { name: 'DataNascimento', type: sql.Date, value: DataNascimento },
        { name: 'Telefone', type: sql.NVarChar, value: Telefone },
        { name: 'Email', type: sql.NVarChar, value: Email },
        { name: 'ID', type: sql.Int, value: parseInt(req.params.id) }
      ]
    );
    res.send('Paciente atualizado com sucesso');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/pacientes/:id', async (req, res) => {
  try {
    await executeQuery('DELETE FROM Pacientes WHERE ID=@ID', [
      { name: 'ID', type: sql.Int, value: parseInt(req.params.id) }
    ]);
    res.send('Paciente excluído com sucesso');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ✅ CRUD de Consultas

app.get('/consultas', async (req, res) => {
  try {
    const result = await executeQuery('SELECT * FROM Consultas');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/consultas', async (req, res) => {
  const { ID, PacienteID, DataConsulta, TipoConsulta, Dentista, Observacoes } = req.body;
  try {
    await executeQuery(
      `INSERT INTO Consultas (ID, PacienteID, DataConsulta, TipoConsulta, Dentista, Observacoes)
       VALUES (@ID, @PacienteID, @DataConsulta, @TipoConsulta, @Dentista, @Observacoes)`,
      [
        { name: 'ID', type: sql.Int, value: ID },
        { name: 'PacienteID', type: sql.Int, value: PacienteID },
        { name: 'DataConsulta', type: sql.DateTime, value: DataConsulta },
        { name: 'TipoConsulta', type: sql.NVarChar, value: TipoConsulta },
        { name: 'Dentista', type: sql.NVarChar, value: Dentista },
        { name: 'Observacoes', type: sql.NVarChar, value: Observacoes }
      ]
    );
    res.send('Consulta criada com sucesso');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/consultas/:id', async (req, res) => {
  const { PacienteID, DataConsulta, TipoConsulta, Dentista, Observacoes } = req.body;
  try {
    await executeQuery(
      `UPDATE Consultas SET PacienteID=@PacienteID, DataConsulta=@DataConsulta,
       TipoConsulta=@TipoConsulta, Dentista=@Dentista, Observacoes=@Observacoes
       WHERE ID=@ID`,
      [
        { name: 'PacienteID', type: sql.Int, value: PacienteID },
        { name: 'DataConsulta', type: sql.DateTime, value: DataConsulta },
        { name: 'TipoConsulta', type: sql.NVarChar, value: TipoConsulta },
        { name: 'Dentista', type: sql.NVarChar, value: Dentista },
        { name: 'Observacoes', type: sql.NVarChar, value: Observacoes },
        { name: 'ID', type: sql.Int, value: parseInt(req.params.id) }
      ]
    );
    res.send('Consulta atualizada com sucesso');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/consultas/:id', async (req, res) => {
  try {
    await executeQuery('DELETE FROM Consultas WHERE ID=@ID', [
      { name: 'ID', type: sql.Int, value: parseInt(req.params.id) }
    ]);
    res.send('Consulta excluída com sucesso');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ✅ Iniciar o servidor
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
