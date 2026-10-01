import iaModel from "../config/ia.config.js";

const MAXIMO_DIAS_ITINERARIO = 14;

const esperar = (milisegundos) =>
    new Promise((resolve) => {
        setTimeout(resolve, milisegundos);
    });

const formatearFecha = (fecha) => new Date(fecha).toISOString().slice(0, 10);

export const calcularDias = (fechaInicio, fechaFin) => {
    const unDia = 24 * 60 * 60 * 1000;
    const dias = Math.round((new Date(fechaFin) - new Date(fechaInicio)) / unDia) + 1;
    return Math.min(dias, MAXIMO_DIAS_ITINERARIO);
};


const itinerarioGenerico = (viaje, dias) => {
    const lineas = [];
    for (let dia = 1; dia <= dias; dia++) {
        if (dia === 1) {
            lineas.push(`Día ${dia}: Llegada a ${viaje.destino}, check-in y recorrida por la zona.`);
        } else if (dia === dias) {
            lineas.push(`Día ${dia}: Últimas compras y regreso.`);
        } else {
            lineas.push(`Día ${dia}: Día libre para explorar ${viaje.destino}.`);
        }
    }
    return lineas.join("\n");
};

/**
 * Genera un itinerario día por día para un viaje usando Gemini.
 *
 * Mismo patrón que embellish-text.service.js de clase10:
 * si Gemini falla por un error temporal (429, 500, 503) se reintenta con espera progresiva,
 * y si se agotan los intentos se devuelve un itinerario genérico en vez de romper la petición.
 *
 * @returns {Promise<{ itinerario: string, generadoPorIA: boolean }>}
 */
export const generarItinerario = async (viaje, maximoIntentos = 2) => {
    const dias = calcularDias(viaje.fechaInicio, viaje.fechaFin);
    const fallback = { itinerario: itinerarioGenerico(viaje, dias), generadoPorIA: false };

    if (!iaModel) {
        return fallback;
    }

    const prompt = `
Armá un itinerario de ${dias} días para este viaje.

Destino: ${viaje.destino}
Fechas: del ${formatearFecha(viaje.fechaInicio)} al ${formatearFecha(viaje.fechaFin)}
Tipo de viaje: ${viaje.tipoDeViaje?.nombre ?? "sin especificar"}
Notas del viajero: ${viaje.notas || "sin notas"}
    `.trim();

    for (let intento = 1; intento <= maximoIntentos; intento++) {
        try {
            const result = await iaModel.generateContent(prompt);
            const itinerario = result.response.text().trim();

            if (!itinerario) {
                return fallback;
            }
            return { itinerario, generadoPorIA: true };
        } catch (error) {
            console.error(`Error de IA. Intento ${intento}/${maximoIntentos}:`, error.message);


            const sePuedeReintentar =
                error.message?.includes("429") ||
                error.message?.includes("500") ||
                error.message?.includes("503");

            if (sePuedeReintentar && intento < maximoIntentos) {
                await esperar(intento * 1000);
                continue;
            }

            console.warn("Gemini no está disponible. Se devuelve un itinerario genérico.");
            return fallback;
        }
    }

    return fallback;
};
