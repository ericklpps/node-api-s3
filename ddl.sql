CREATE TABLE Pacientes (
    ID INT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    CPF VARCHAR(14) UNIQUE NOT NULL,
    DataNascimento DATE,
    Telefone VARCHAR(20),
    Email VARCHAR(255) UNIQUE
);

CREATE TABLE Consultas (
    ID INT PRIMARY KEY,
    PacienteID INT,
    DataConsulta DATETIME NOT NULL,
    TipoConsulta VARCHAR(255),
    Dentista VARCHAR(255),
    Observacoes TEXT,
    FOREIGN KEY (PacienteID) REFERENCES Pacientes(ID)
);