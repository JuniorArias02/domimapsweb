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

------

Table: ordenes_servicios

Columns:
	id_orden_servicio	int AI PK
	id_orden	int
	id_servicio	int
	id_profesional_asignado	int
	numero_sesiones	int
	frecuencia_dias	int
	fecha_inicio	datetime
	estado	varchar(50)
	created_at	timestamp
	updated_at	timestamp

------
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



Table: ingresos

Columns:
	id_ingreso	int AI PK
	ingreso	int
	id_paciente	int
	autorizacion	varchar(45)
	fecha_ingreso	datetime
	created_at	timestamp
	update_at	timestamp




pero tenemos que buscar el ingreso,  y dentro de ese ingreo encontramo lo que es la orden,  simplmene seleccionariamos el servicio correspondiente y luego rellenamos los datos (claramente) el paciente se carga automaticamente cuando pongo el ingreso,



en al vista debe tener esto campos:
tiene qeu aver estos campos: Table: visitas_domiciliarias 
codigo_ingreso	varchar(20) 
id_orden_servicio int cuando me carga las ordenes debo seleccionar el servicio correspondiente 
id_pacientei int  aca cargaria el paciente automaticamtente cuando seleciono el ingreso
id_personal	int se debe rellenar
fecha_programada	datetime 
observaciones	text





### Ejemplo JSON de respuesta (API Kubapp)

```json
{
    "data": {
        "id_ingreso": 1,
        "ingreso": 1001,
        "autorizacion": "T37551393042026",
        "id_paciente": 440,
        "nombre_paciente": "ELOISA FONSECA SANDOVAL",
        "identificacion": "37551393",
        "fecha_ingreso": "2026-04-28 08:00:00",
        "servicios": [
            {
                "id_orden_servicio": 1800,
                "id_servicio": 1,
                "nombre_servicio": "ATENCION [VISITA] DOMICILIARIA, POR MEDICINA GENERAL",
                "frecuencia": 60,
                "cantidad": 1
            },
            {
                "id_orden_servicio": 1801,
                "id_servicio": 2,
                "nombre_servicio": "TERAPIA FISICA DOMICILIARIA",
                "frecuencia": 1,
                "cantidad": 30
            }
        ]
    }
}
```


{
  "codigo_ingreso": 1001,
  "id_orden_servicio": 1800,
  "id_paciente": 440,
  "id_personal": 1,
  "fecha_programada": "2026-05-10T14:30",
  "observaciones": "Nota de ejemplo...",
  "estado": "PROGRAMADA"
}