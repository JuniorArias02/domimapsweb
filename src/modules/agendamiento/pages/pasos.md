endpoint /api/v1/agenda/listado-detallado





{
    "success": true,
    "data": [
        {
            "id_orden": 1797,
            "fecha_orden": "2026-04-28",
            "observacion": null,
            "estado_orden": "VIGENTE",
            "autorizacion": "T37551393042026",
            "id_paciente": 440,
            "identificacion": "37551393",
            "nombre_paciente": "ELOISA FONSECA SANDOVAL",
            "telefono": "3123902007",
            "direccion": "AV. 11 # 27-24 BARRIO BELLAVISTA - LA LIBERTAD",
            "ordenes_servicios": [
                {
                    "id_orden_servicio": 1800,
                    "id_orden": 1797,
                    "id_servicio": 1,
                    "id_profesional_asignado": 2,
                    "numero_sesiones": 1,
                    "frecuencia_dias": 60,
                    "fecha_inicio": null,
                    "estado": "ACTIVO",
                    "created_at": "2026-04-28 18:43:53",
                    "updated_at": "2026-04-29 09:40:33",
                    "nombre_servicio": "ATENCION [VISITA] DOMICILIARIA, POR MEDICINA GENERAL",
                    "nombre_profesional": "MORENO HERNANDEZ MARIA ROSSANA",
                    "visitas_domiciliarias": [
                        {
                            "id_visita": 1800,
                            "id_orden_servicio": 1800,
                            "fecha_programada": "2026-04-28 07:09:00",
                            "fecha_realizada": "2026-04-28 07:09:00",
                            "estado": "COMPLETADA",
                            "tipo_atencion_ext": null
                        },
                        {
                            "id_visita": 3612,
                            "id_orden_servicio": 1800,
                            "fecha_programada": "2026-06-27 07:09:00",
                            "fecha_realizada": null,
                            "estado": "PROGRAMADA",
                            "tipo_atencion_ext": null
                        }
                    ]
                }
            ]
        },
         ],
    "meta": {
        "total": 1809,
        "per_page": 10,
        "current_page": 1,
        "last_page": 181
    }

}