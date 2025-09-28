CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  correo VARCHAR(255) NOT NULL UNIQUE,
  contraseña VARCHAR(255) NOT NULL, -- aquí guardaremos el hash, no la contraseña en texto plano
  tipo_usuario VARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('cliente','prestador')),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS servicios (
  id_servicio SERIAL PRIMARY KEY,
  id_prestador INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio NUMERIC(10,2) NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS citas (
  id_cita SERIAL PRIMARY KEY,
  id_cliente INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  id_servicio INT NOT NULL REFERENCES servicios(id_servicio) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado VARCHAR(20) DEFAULT 'activa' CHECK (estado IN ('activa','cancelada','completada')),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nombre, correo, contraseña, tipo_usuario)
VALUES 
  ('Ana Pérez', 'ana@example.com', '1234', 'cliente'),
  ('Carlos López', 'carlos@example.com', 'abcd', 'prestador');

INSERT INTO servicios (id_prestador, nombre, descripcion, precio)
VALUES
  (2, 'Corte de cabello', 'Corte de cabello para dama o caballero', 150.00),
  (2, 'Peinado', 'Peinado sencillo para eventos', 200.00);

INSERT INTO citas (id_cliente, id_servicio, fecha, hora, estado)
VALUES
  (1, 1, '2025-09-20', '10:00', 'activa'),
  (1, 2, '2025-09-22', '15:30', 'activa');

