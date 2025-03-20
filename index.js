const express = require('express');
    const sql = require('mssql');
    const cors = require('cors');
    const app = express();
    const port = 3000;

    app.use(cors());

    const config = {
      user: 'admin1@servidor-sql-db001',
      password: '@dmin1234',
      server: 'servidor-sql-db001.database.windows.net',
      database: 'sql-db-sprint3',
      options: {
        encrypt: true, // Para Azure SQL
        trustServerCertificate: false, // Para Azure SQL
      },
    };

    // CRUD para Pacientes
app.get('/pacientes', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query('SELECT * FROM Pacientes');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar pacientes');
  } finally {
    sql.close();
  }
});

app.post('/pacientes', async (req, res) => {
  try {
    await sql.connect(config);
    const { ID, Nome, CPF, DataNascimento, Telefone, Email } = req.body;
    const result = await sql.query(`
      INSERT INTO Pacientes (ID, Nome, CPF, DataNascimento, Telefone, Email)
      VALUES (${ID}, '${Nome}', '${CPF}', '${DataNascimento}', '${Telefone}', '${Email}')
    `);
    res.status(201).send('Paciente criado com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar paciente');
  } finally {
    sql.close();
  }
});

app.put('/pacientes/:id', async (req, res) => {
  try {
    await sql.connect(config);
    const { id } = req.params;
    const { Nome, CPF, DataNascimento, Telefone, Email } = req.body;
    const result = await sql.query(`
      UPDATE Pacientes
      SET Nome = '${Nome}', CPF = '${CPF}', DataNascimento = '${DataNascimento}', Telefone = '${Telefone}', Email = '${Email}'
      WHERE ID = ${id}
    `);
    res.send('Paciente atualizado com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar paciente');
  } finally {
    sql.close();
  }
});

app.delete('/pacientes/:id', async (req, res) => {
  try {
    await sql.connect(config);
    const { id } = req.params;
    const result = await sql.query(`DELETE FROM Pacientes WHERE ID = ${id}`);
    res.send('Paciente excluído com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao excluir paciente');
  } finally {
    sql.close();
  }
});

// CRUD para Consultas
app.get('/consultas', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query('SELECT * FROM Consultas');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar consultas');
  } finally {
    sql.close();
  }
});

app.post('/consultas', async (req, res) => {
  try {
    await sql.connect(config);
    const { ID, PacienteID, DataConsulta, TipoConsulta, Dentista, Observacoes } = req.body;
    const result = await sql.query(`
      INSERT INTO Consultas (ID, PacienteID, DataConsulta, TipoConsulta, Dentista, Observacoes)
      VALUES (${ID}, ${PacienteID}, '${DataConsulta}', '${TipoConsulta}', '${Dentista}', '${Observacoes}')
    `);
    res.status(201).send('Consulta criada com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar consulta');
  } finally {
    sql.close();
  }
});

app.put('/consultas/:id', async (req, res) => {
  try {
    await sql.connect(config);
    const { id } = req.params;
    const { PacienteID, DataConsulta, TipoConsulta, Dentista, Observacoes } = req.body;
    const result = await sql.query(`
      UPDATE Consultas
      SET PacienteID = ${PacienteID}, DataConsulta = '${DataConsulta}', TipoConsulta = '${TipoConsulta}', Dentista = '${Dentista}', Observacoes = '${Observacoes}'
      WHERE ID = ${id}
    `);
    res.send('Consulta atualizada com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar consulta');
  } finally {
    sql.close();
  }
});

app.delete('/consultas/:id', async (req, res) => {
  try {
    await sql.connect(config);
    const { id } = req.params;
    const result = await sql.query(`DELETE FROM Consultas WHERE ID = ${id}`);
    res.send('Consulta excluída com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao excluir consulta');
  } finally {
    sql.close();
  }
});

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});