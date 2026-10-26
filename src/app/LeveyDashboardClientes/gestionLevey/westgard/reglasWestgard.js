// Datos demostrativos del módulo Reglas de Westgard.
//
// TODO(integración): este arreglo es exclusivamente visual; cuando el backend
// exponga la configuración de reglas, reemplazar el import de este archivo por
// la consulta correspondiente manteniendo la misma forma de dato.
//
// Formas de dato documentadas con JSDoc (equivalente tipado en un proyecto JS):

/**
 * @typedef {"ALEATORIO" | "SISTEMATICO" | "AMBOS"} TipoErrorRegla
 * @typedef {"ADVERTENCIA" | "RECHAZO" | "TENDENCIA"} InterpretacionRegla
 * @typedef {"IMPLEMENTADA" | "PARCIAL" | "NO_IMPLEMENTADA"} ImplementacionRegla
 * @typedef {"CLASICA" | "COMPLEMENTARIA"} EsquemaRegla
 */

/**
 * @typedef {Object} ReglaWestgard
 * @property {number} id
 * @property {string} codigo                Notación de la regla (ej. "1-3s").
 * @property {string} nombre                Nombre completo (ej. "Regla 1-3s").
 * @property {string} descripcion           Explicación clínica de qué detecta.
 * @property {string} fundamentoEstadistico Condición numérica de violación.
 * @property {TipoErrorRegla} tipoError
 * @property {InterpretacionRegla} interpretacion
 * @property {ImplementacionRegla} implementacion
 * @property {boolean} activa               Estado demostrativo del interruptor.
 * @property {string | null} fechaModificacion Fecha demostrativa (dd/mm/aaaa hh:mm); null si no implementada.
 * @property {{ descripcion: string, zScores: number[] }} ejemplo  Puntos de control en Z-Score para el gráfico.
 * @property {string} interpretacionClinica Lectura de la violación desde el laboratorio clínico.
 * @property {string} accionRecomendada     Qué hacer ante la violación.
 * @property {EsquemaRegla} esquema         Clásicas del esquema multirregla vs. complementarias de esquemas ampliados.
 * @property {string | null} notaImplementacion Advertencia sobre modalidades pendientes (solo PARCIAL).
 */

/** @type {ReglaWestgard[]} */
export const REGLAS_WESTGARD = [
  {
    id: 1,
    codigo: "1-2s",
    nombre: "Regla 1-2s",
    descripcion: "Un resultado de control alcanza o supera dos desviaciones estándar respecto de su media objetivo.",
    fundamentoEstadistico: "Se viola cuando |Z-Score| ≥ 2: el control cae fuera de los límites de ±2 DE en torno a la media objetivo.",
    tipoError: "AMBOS",
    interpretacion: "ADVERTENCIA",
    implementacion: "IMPLEMENTADA",
    activa: true,
    fechaModificacion: "12/09/2026 10:12",
    ejemplo: {
      descripcion: "Glucosa, nivel 1: Z-Score +2.4.",
      zScores: [2.4],
    },
    interpretacionClinica: "Advertencia estadística que obliga a revisar el comportamiento del proceso analítico. Por sí sola no implica rechazar la corrida: dentro de un esquema multirregla funciona como señal de alerta que gatilla la evaluación de las reglas de rechazo.",
    accionRecomendada: "Revise el comportamiento reciente del analito y del control. Si la evaluación de las demás reglas no confirma una violación, puede continuar; si se confirma una regla de rechazo, aplique el procedimiento de calidad del laboratorio antes de liberar resultados.",
    esquema: "CLASICA",
    notaImplementacion: null,
  },
  {
    id: 2,
    codigo: "1-3s",
    nombre: "Regla 1-3s",
    descripcion: "Un resultado de control alcanza o supera tres desviaciones estándar respecto de su media objetivo.",
    fundamentoEstadistico: "Se viola cuando |Z-Score| ≥ 3. En un proceso en control estadístico es muy poco probable que un control caiga fuera de ±3 DE (≈ 0,3 %), por lo que se asume una condición fuera de control.",
    tipoError: "ALEATORIO",
    interpretacion: "RECHAZO",
    implementacion: "IMPLEMENTADA",
    activa: true,
    fechaModificacion: "12/09/2026 10:15",
    ejemplo: {
      descripcion: "Glucosa, nivel 1: Z-Score −3.2.",
      zScores: [-3.2],
    },
    interpretacionClinica: "El proceso analítico podría encontrarse fuera de control. Es una regla de rechazo, sensible a errores aleatorios gruesos y a desviaciones importantes de exactitud.",
    accionRecomendada: "Rechace la corrida. Investigue el proceso analítico (calibración, reactivos, manipulación del control) y aplique el procedimiento de calidad del laboratorio antes de liberar resultados de pacientes.",
    esquema: "CLASICA",
    notaImplementacion: null,
  },
  {
    id: 3,
    codigo: "2-2s",
    nombre: "Regla 2-2s",
    descripcion: "Dos resultados consecutivos de control alcanzan o superan dos desviaciones estándar hacia el mismo lado de sus respectivas medias objetivo.",
    fundamentoEstadistico: "Se viola cuando ambos Z-Scores son ≥ +2 o ambos son ≤ −2, sea entre niveles distintos del mismo analito en una corrida o entre corridas consecutivas del mismo nivel.",
    tipoError: "SISTEMATICO",
    interpretacion: "RECHAZO",
    implementacion: "PARCIAL",
    activa: true,
    fechaModificacion: "03/10/2026 16:40",
    ejemplo: {
      descripcion: "Glucosa, nivel 1: +2.3 y glucosa, nivel 2: +2.5, en la misma corrida.",
      zScores: [2.3, 2.5],
    },
    interpretacionClinica: "Detecta principalmente errores sistemáticos: una desviación sostenida de la exactitud del método, asociada por ejemplo a una calibración desplazada o al deterioro de los reactivos.",
    accionRecomendada: "Rechace la corrida y verifique la calibración y la condición de los reactivos. Aplique el procedimiento de calidad del laboratorio antes de liberar resultados.",
    esquema: "CLASICA",
    notaImplementacion: "La evaluación entre distintos niveles del mismo analito y entre corridas consecutivas todavía debe completarse.",
  },
  {
    id: 4,
    codigo: "R-4s",
    nombre: "Regla R-4s",
    descripcion: "Detecta una diferencia de al menos cuatro desviaciones estándar entre dos resultados de control comparables dentro de la misma corrida.",
    fundamentoEstadistico: "Se viola cuando dos controles de la misma corrida se ubican en extremos opuestos: uno con Z-Score ≥ +2 y el otro ≤ −2, con una diferencia total ≥ 4 DE.",
    tipoError: "ALEATORIO",
    interpretacion: "RECHAZO",
    implementacion: "PARCIAL",
    activa: true,
    fechaModificacion: "03/10/2026 16:48",
    ejemplo: {
      descripcion: "Glucosa, nivel 1: +2.5 y glucosa, nivel 2: −2.4, en la misma corrida.",
      zScores: [2.5, -2.4],
    },
    interpretacionClinica: "Aumenta la probabilidad de un error aleatorio: dispersión anómala entre niveles, asociada por ejemplo a un mezclado incompleto, un pipeteo irregular o la inestabilidad del analito.",
    accionRecomendada: "Rechace la corrida y priorice la búsqueda de causas de error aleatorio: repita los controles y revise la manipulación y la homogeneización de los materiales de control.",
    esquema: "CLASICA",
    notaImplementacion: "La evaluación completa de múltiples niveles todavía requiere ajustes.",
  },
  {
    id: 5,
    codigo: "4-1s",
    nombre: "Regla 4-1s",
    descripcion: "Cuatro resultados consecutivos de control superan una desviación estándar hacia el mismo lado de sus respectivas medias objetivo.",
    fundamentoEstadistico: "Se viola cuando cuatro Z-Scores consecutivos son todos ≥ +1 o todos ≤ −1.",
    tipoError: "SISTEMATICO",
    interpretacion: "RECHAZO",
    implementacion: "NO_IMPLEMENTADA",
    activa: false,
    fechaModificacion: null,
    ejemplo: {
      descripcion: "+1.3, +1.5, +1.2 y +1.6 en cuatro corridas consecutivas.",
      zScores: [1.3, 1.5, 1.2, 1.6],
    },
    interpretacionClinica: "Identifica errores sistemáticos incipientes: un desplazamiento moderado pero sostenido del proceso, que todavía no alcanza los límites de 2 DE.",
    accionRecomendada: "Corresponde investigar el proceso analítico y aplicar el procedimiento de calidad del laboratorio antes de liberar resultados.",
    esquema: "CLASICA",
    notaImplementacion: null,
  },
  {
    id: 6,
    codigo: "10x",
    nombre: "Regla 10x",
    descripcion: "Diez resultados consecutivos de control se encuentran al mismo lado de la media objetivo.",
    fundamentoEstadistico: "Se viola cuando diez Z-Scores consecutivos presentan el mismo signo, independientemente de su magnitud.",
    tipoError: "SISTEMATICO",
    interpretacion: "RECHAZO",
    implementacion: "NO_IMPLEMENTADA",
    activa: false,
    fechaModificacion: null,
    ejemplo: {
      descripcion: "Diez resultados consecutivos con Z-Score positivo.",
      zScores: [0.5, 0.8, 1.1, 0.6, 0.9, 1.2, 0.7, 1.0, 0.8, 1.1],
    },
    interpretacionClinica: "Detecta desplazamientos sistemáticos del proceso analítico: la exactitud del método permanece desplazada de forma persistente hacia un mismo lado.",
    accionRecomendada: "Corresponde investigar el proceso analítico y aplicar el procedimiento de calidad del laboratorio antes de liberar resultados.",
    esquema: "CLASICA",
    notaImplementacion: null,
  },
  {
    id: 7,
    codigo: "7T",
    nombre: "Regla 7T",
    descripcion: "Siete resultados consecutivos presentan una tendencia ascendente o descendente.",
    fundamentoEstadistico: "Se viola cuando siete Z-Scores consecutivos incrementan o decrementan de forma monótona, sin importar el lado de la media en que se ubiquen.",
    tipoError: "SISTEMATICO",
    interpretacion: "TENDENCIA",
    implementacion: "NO_IMPLEMENTADA",
    activa: false,
    fechaModificacion: null,
    ejemplo: {
      descripcion: "+0.1, +0.3, +0.5, +0.8, +1.1, +1.4 y +1.7 en siete corridas consecutivas.",
      zScores: [0.1, 0.3, 0.5, 0.8, 1.1, 1.4, 1.7],
    },
    interpretacionClinica: "Puede indicar un deterioro progresivo del desempeño analítico (degradación de reactivos o deriva del instrumento), visible antes de que el proceso salga de los límites de control.",
    accionRecomendada: "No es una regla de rechazo inmediato: planifique una intervención preventiva (mantenimiento o recalibración) y refuerce la vigilancia del analito.",
    esquema: "COMPLEMENTARIA",
    notaImplementacion: null,
  },
  {
    id: 8,
    codigo: "8x",
    nombre: "Regla 8x",
    descripcion: "Ocho resultados consecutivos se encuentran al mismo lado de la media objetivo.",
    fundamentoEstadistico: "Se viola cuando ocho Z-Scores consecutivos presentan el mismo signo, independientemente de su magnitud.",
    tipoError: "SISTEMATICO",
    interpretacion: "RECHAZO",
    implementacion: "NO_IMPLEMENTADA",
    activa: false,
    fechaModificacion: null,
    ejemplo: {
      descripcion: "Ocho resultados consecutivos con Z-Score positivo.",
      zScores: [0.6, 0.9, 1.2, 0.7, 1.0, 1.3, 0.8, 1.1],
    },
    interpretacionClinica: "Identifica desplazamientos sistemáticos del proceso analítico.",
    accionRecomendada: "Corresponde investigar el proceso analítico y aplicar el procedimiento de calidad del laboratorio antes de liberar resultados.",
    esquema: "COMPLEMENTARIA",
    notaImplementacion: null,
  },
  {
    id: 9,
    codigo: "12x",
    nombre: "Regla 12x",
    descripcion: "Doce resultados consecutivos se encuentran al mismo lado de la media objetivo.",
    fundamentoEstadistico: "Se viola cuando doce Z-Scores consecutivos presentan el mismo signo, independientemente de su magnitud.",
    tipoError: "SISTEMATICO",
    interpretacion: "RECHAZO",
    implementacion: "NO_IMPLEMENTADA",
    activa: false,
    fechaModificacion: null,
    ejemplo: {
      descripcion: "Doce resultados consecutivos con Z-Score positivo.",
      zScores: [0.4, 0.7, 1.0, 0.6, 0.9, 1.2, 0.5, 0.8, 1.1, 0.7, 1.0, 0.9],
    },
    interpretacionClinica: "Permite detectar desplazamientos persistentes del proceso analítico.",
    accionRecomendada: "Corresponde investigar el proceso analítico y aplicar el procedimiento de calidad del laboratorio antes de liberar resultados.",
    esquema: "COMPLEMENTARIA",
    notaImplementacion: null,
  },
  {
    id: 10,
    codigo: "2 de 3-2s",
    nombre: "Regla 2 de 3-2s",
    descripcion: "Dos de tres resultados consecutivos de control alcanzan o superan dos desviaciones estándar hacia el mismo lado de la media objetivo.",
    fundamentoEstadistico: "Se viola cuando, de tres controles consecutivos, dos presentan Z-Score ≥ +2 o dos presentan Z-Score ≤ −2, hacia el mismo lado de la media.",
    tipoError: "SISTEMATICO",
    interpretacion: "RECHAZO",
    implementacion: "NO_IMPLEMENTADA",
    activa: false,
    fechaModificacion: null,
    ejemplo: {
      descripcion: "+2.1, +1.8 y +2.4: dos de los tres controles superan +2 DE hacia el mismo lado.",
      zScores: [2.1, 1.8, 2.4],
    },
    interpretacionClinica: "Permite identificar errores sistemáticos cuando el número de controles por corrida es mayor a dos.",
    accionRecomendada: "Corresponde investigar el proceso analítico y aplicar el procedimiento de calidad del laboratorio antes de liberar resultados.",
    esquema: "COMPLEMENTARIA",
    notaImplementacion: null,
  },
  {
    id: 11,
    codigo: "3-1s",
    nombre: "Regla 3-1s",
    descripcion: "Tres resultados consecutivos de control superan una desviación estándar hacia el mismo lado de la media objetivo.",
    fundamentoEstadistico: "Se viola cuando tres Z-Scores consecutivos son todos ≥ +1 o todos ≤ −1.",
    tipoError: "SISTEMATICO",
    interpretacion: "RECHAZO",
    implementacion: "NO_IMPLEMENTADA",
    activa: false,
    fechaModificacion: null,
    ejemplo: {
      descripcion: "Tres resultados consecutivos superan +1 DE: +1.2, +1.4 y +1.3.",
      zScores: [1.2, 1.4, 1.3],
    },
    interpretacionClinica: "Puede detectar desplazamientos sistemáticos de aparición temprana, similares a los de la regla 4-1s pero con menor número de puntos.",
    accionRecomendada: "Corresponde investigar el proceso analítico y aplicar el procedimiento de calidad del laboratorio antes de liberar resultados.",
    esquema: "COMPLEMENTARIA",
    notaImplementacion: null,
  },
  {
    id: 12,
    codigo: "6x",
    nombre: "Regla 6x",
    descripcion: "Seis resultados consecutivos se encuentran al mismo lado de la media objetivo.",
    fundamentoEstadistico: "Se viola cuando seis Z-Scores consecutivos presentan el mismo signo, independientemente de su magnitud.",
    tipoError: "SISTEMATICO",
    interpretacion: "RECHAZO",
    implementacion: "NO_IMPLEMENTADA",
    activa: false,
    fechaModificacion: null,
    ejemplo: {
      descripcion: "Seis resultados consecutivos con Z-Score positivo.",
      zScores: [0.8, 1.1, 0.9, 1.2, 0.7, 1.0],
    },
    interpretacionClinica: "Identifica desplazamientos persistentes del proceso analítico.",
    accionRecomendada: "Corresponde investigar el proceso analítico y aplicar el procedimiento de calidad del laboratorio antes de liberar resultados.",
    esquema: "COMPLEMENTARIA",
    notaImplementacion: null,
  },
  {
    id: 13,
    codigo: "9x",
    nombre: "Regla 9x",
    descripcion: "Nueve resultados consecutivos se encuentran al mismo lado de la media objetivo.",
    fundamentoEstadistico: "Se viola cuando nueve Z-Scores consecutivos presentan el mismo signo, independientemente de su magnitud.",
    tipoError: "SISTEMATICO",
    interpretacion: "RECHAZO",
    implementacion: "NO_IMPLEMENTADA",
    activa: false,
    fechaModificacion: null,
    ejemplo: {
      descripcion: "Nueve resultados consecutivos con Z-Score positivo.",
      zScores: [0.5, 0.8, 1.1, 0.7, 1.0, 1.2, 0.6, 0.9, 0.8],
    },
    interpretacionClinica: "Identifica posibles errores sistemáticos.",
    accionRecomendada: "Corresponde investigar el proceso analítico y aplicar el procedimiento de calidad del laboratorio antes de liberar resultados.",
    esquema: "COMPLEMENTARIA",
    notaImplementacion: null,
  },
];
