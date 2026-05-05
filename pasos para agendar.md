Table: ingresos

Columns:
	id_ingreso	int AI PK
	ingreso	int
	id_paciente	int
	autorizacion	varchar(45)
	fecha_ingreso	datetime
	created_at	timestamp
	update_at	timestamp

----------------------------------------------

Table: ordenes_medicas

Columns:
	id_orden	int AI PK
	id_ingreso	int
	creado_por	int
	fecha_orden	date
	observacion	text
	estado	enum('VIGENTE','SUSPENDIDA','VENCIDA','FINALIZADA','CANCELADA')
	created_at	timestamp
	updated_at	timestamp


----------------------------------------------

Table: ordenes_servicios

Columns:
	id_orden_servicio	int AI PK
	id_orden	int
	id_servicio	int
	id_profesional_asignado	int
	numero_sesiones	int
	frecuencia_dias	int
	estado	varchar(50)
	created_at	timestamp
	updated_at	timestamp

----------------------------------------------

Table: visitas_domiciliarias

Columns:
	id_visita	int AI PK
	codigo_ingreso	varchar(20)
	id_orden_servicio	int
	id_paciente	int
	id_personal	int
	fecha_programada	datetime
	id_usuario_programa	int
	fecha_realizada	datetime
	latitud_checkin	decimal(10,8)
	longitud_checkin	decimal(11,8)
	latitud_checkout	decimal(10,8)
	longitud_checkout	decimal(11,8)
	estado	enum('PROGRAMADA','COMPLETADA','CANCELADA','REPROGRAMADA','NO_ATENDIDA')
	motivo_cancelacion	varchar(255)
	observaciones	text
	created_at	timestamp
	updated_at	timestamp
	tipo_atencion_ext	varchar(100)
	remitido_a	varchar(255)


----------------------------------------------

Table: servicios

Columns:
	id_servicio	int AI PK
	codigo_servicio	varchar(50)
	nombre_servicio	varchar(255)
	descripcion	text
	estado	tinyint
	created_at	timestamp
	updated_at	timestamp

----------------------------------------------
pasos para agenda [sin conexion solo ui]

el nuevo modulo sera agendamiento.
-ese modulo mostrara las agendas (esa vista no tenga nada por el momento, solo tenga boton que dira agendar)

-cuando oprimo el botn de agendar me lleva a otra vista que seria  para crear la orden medica (un campo para buscar el ingreso,  si en tal caso el ingreso no aparece pues un boton de buscar por servicio externo)
y cuando seleccion el ingreso me trae  autoamtimaente la autorizacion en el otro lado donde esta el ingreso,  y luego abajo habra la opcion de observaciones y abajo la opcion de crear ordenes y servicio, debo seleccionar el servicio,  y el profesional  y sesiones  esto debe ser un campo para crear multiples ordenes y servicios. 



campos del fomrulario



