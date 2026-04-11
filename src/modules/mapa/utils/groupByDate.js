export const groupByDate = (visitas) => {
  return visitas.reduce((acc, visit) => {
    if (!acc[visit.fecha_realizada]) acc[visit.fecha_realizada] = [];
    acc[visit.fecha_realizada].push(visit);
    return acc;
  }, {});
};
