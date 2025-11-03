-- 1. USUARIOS (OK - sin cambios)
CREATE TABLE usuarios (
  id_usuario SERIAL PRIMARY KEY,
  nombre VARCHAR NOT NULL,
  correo VARCHAR NOT NULL UNIQUE,
  contrasena VARCHAR NOT NULL,
  telefono VARCHAR,
  tipo_usuario VARCHAR CHECK (tipo_usuario IN ('cliente', 'proveedor')),
  fecha_registro TIMESTAMP DEFAULT now()
);

-- 2. EMPRENDIMIENTOS (OK - sin cambios)
CREATE TABLE emprendimientos (
  id_emprendimiento SERIAL PRIMARY KEY,
  id_proveedor INTEGER REFERENCES usuarios(id_usuario),
  nombre_negocio VARCHAR NOT NULL,
  descripcion TEXT,
  domicilio VARCHAR,
  hora_apertura TIME,
  hora_cierre TIME,
  logo VARCHAR,
  imagenes_trabajos TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. SERVICIOS (CORREGIDO - agregando alias para compatibilidad)
CREATE TABLE servicios (
  id_servicio SERIAL PRIMARY KEY,
  id_emprendimiento INTEGER REFERENCES emprendimientos(id_emprendimiento),
  nombre_servicio VARCHAR NOT NULL,
  descripcion TEXT,
  precio NUMERIC NOT NULL,
  duracion INTEGER,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  imagen_referencia TEXT
);

-- Crear vista para compatibilidad con código que usa 'nombre'
CREATE OR REPLACE VIEW servicios_view AS 
SELECT *, nombre_servicio as nombre FROM servicios;

-- 4. CITAS (CORREGIDO - nombres que espera el código)
CREATE TABLE citas (
  id_cita SERIAL PRIMARY KEY,
  id_cliente INTEGER REFERENCES usuarios(id_usuario),
  id_servicio INTEGER REFERENCES servicios(id_servicio),
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado VARCHAR DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada', 'completada')),
  mensaje TEXT,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABLAS OPCIONALES (para futuro)
CREATE TABLE imagenes_emprendimiento (
  id_imagen SERIAL PRIMARY KEY,
  id_emprendimiento INTEGER REFERENCES emprendimientos(id_emprendimiento),
  url_imagen VARCHAR NOT NULL
);

CREATE TABLE resenas (
  id_resena SERIAL PRIMARY KEY,
  id_cliente INTEGER REFERENCES usuarios(id_usuario),
  id_emprendimiento INTEGER REFERENCES emprendimientos(id_emprendimiento),
  calificacion INTEGER CHECK (calificacion >= 1 AND calificacion <= 5),
  comentario TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. POLÍTICAS RLS (Row Level Security)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE emprendimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE citas ENABLE ROW LEVEL SECURITY;

-- Políticas permisivas para desarrollo
CREATE POLICY "Allow all for usuarios" ON usuarios FOR ALL USING (true);
CREATE POLICY "Allow all for emprendimientos" ON emprendimientos FOR ALL USING (true);
CREATE POLICY "Allow all for servicios" ON servicios FOR ALL USING (true);
CREATE POLICY "Allow all for citas" ON citas FOR ALL USING (true);