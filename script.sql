
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.
-- Script Main

CREATE TABLE public.citas (
  id_cita integer NOT NULL DEFAULT nextval('citas_id_cita_seq'::regclass),
  id_cliente integer,
  id_servicio integer,
  fecha_cita date NOT NULL,
  hora_cita time without time zone NOT NULL,
  estado character varying DEFAULT 'pendiente'::character varying CHECK (estado::text = ANY (ARRAY['pendiente'::character varying, 'confirmada'::character varying, 'cancelada'::character varying, 'completada'::character varying]::text[])),
  notas text,
  fecha_reserva timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT citas_pkey PRIMARY KEY (id_cita),
  CONSTRAINT citas_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.usuarios(id_usuario),
  CONSTRAINT citas_id_servicio_fkey FOREIGN KEY (id_servicio) REFERENCES public.servicios(id_servicio)
);
CREATE TABLE public.emprendimientos (
  id_emprendimiento integer NOT NULL DEFAULT nextval('emprendimientos_id_emprendimiento_seq'::regclass),
  id_proveedor integer,
  nombre_negocio character varying NOT NULL,
  descripcion text,
  domicilio character varying,
  hora_apertura time without time zone,
  hora_cierre time without time zone,
  logo character varying,
  imagenes_trabajos text,
  fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT emprendimientos_pkey PRIMARY KEY (id_emprendimiento),
  CONSTRAINT emprendimientos_id_proveedor_fkey FOREIGN KEY (id_proveedor) REFERENCES public.usuarios(id_usuario)
);
CREATE TABLE public.imagenes_emprendimiento (
  id_imagen integer NOT NULL DEFAULT nextval('imagenes_emprendimiento_id_imagen_seq'::regclass),
  id_emprendimiento integer,
  url_imagen character varying NOT NULL,
  CONSTRAINT imagenes_emprendimiento_pkey PRIMARY KEY (id_imagen),
  CONSTRAINT imagenes_emprendimiento_id_emprendimiento_fkey FOREIGN KEY (id_emprendimiento) REFERENCES public.emprendimientos(id_emprendimiento)
);
CREATE TABLE public.resenas (
  id_resena integer NOT NULL DEFAULT nextval('resenas_id_resena_seq'::regclass),
  id_cliente integer,
  id_emprendimiento integer,
  calificacion integer CHECK (calificacion >= 1 AND calificacion <= 5),
  comentario text,
  fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT resenas_pkey PRIMARY KEY (id_resena),
  CONSTRAINT resenas_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.usuarios(id_usuario),
  CONSTRAINT resenas_id_emprendimiento_fkey FOREIGN KEY (id_emprendimiento) REFERENCES public.emprendimientos(id_emprendimiento)
);
CREATE TABLE public.servicios (
  id_servicio integer NOT NULL DEFAULT nextval('servicios_id_servicio_seq'::regclass),
  id_emprendimiento integer,
  nombre_servicio character varying NOT NULL,
  descripcion text,
  precio numeric NOT NULL,
  duracion integer,
  fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  imagen_referencia text,
  CONSTRAINT servicios_pkey PRIMARY KEY (id_servicio),
  CONSTRAINT servicios_id_emprendimiento_fkey FOREIGN KEY (id_emprendimiento) REFERENCES public.emprendimientos(id_emprendimiento)
);
CREATE TABLE public.usuarios (
  id_usuario integer NOT NULL DEFAULT nextval('usuarios_id_usuario_seq'::regclass),
  nombre character varying NOT NULL,
  correo character varying NOT NULL UNIQUE,
  contrasena character varying NOT NULL,
  telefono character varying,
  tipo_usuario character varying CHECK (tipo_usuario::text = ANY (ARRAY['cliente'::character varying, 'proveedor'::character varying]::text[])),
  fecha_registro timestamp without time zone DEFAULT now(),
  CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario)
);