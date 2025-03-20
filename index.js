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

    app.get('/dados', async (req, res) => {
      try {
        await sql.connect(config);
        const result = await sql.query('SELECT * FROM Teste');
        res.json(result.recordset);
      } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar dados');
      } finally {
        sql.close();
      }
    });

    app.listen(port, () => {
      console.log(`API rodando em http://localhost:${port}`);
    });