import axios from "axios";
import { crearError } from "../utils/crearError.js";


const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const PRONOSTICO_URL = "https://api.open-meteo.com/v1/forecast";
const HISTORICO_URL = "https://archive-api.open-meteo.com/v1/archive";


const DIAS_PRONOSTICO_FUTURO = 15;
const DIAS_PRONOSTICO_PASADO = 90;
const MAXIMO_DIAS_CLIMA = 14;


const clienteHttp = axios.create({ timeout: 5000 });

const UN_DIA = 24 * 60 * 60 * 1000;

const formatearFecha = (fecha) => fecha.toISOString().slice(0, 10);

const sumarDias = (fecha, dias) => new Date(fecha.getTime() + dias * UN_DIA);

const restarUnAnio = (fecha) => {
    const copia = new Date(fecha);
    copia.setUTCFullYear(copia.getUTCFullYear() - 1);
    return copia;
};


const describirCodigoClima = (codigo) => {
    if (codigo === 0) return "Despejado";
    if (codigo <= 3) return "Parcialmente nublado";
    if (codigo <= 48) return "Niebla";
    if (codigo <= 57) return "Llovizna";
    if (codigo <= 67) return "Lluvia";
    if (codigo <= 77) return "Nieve";
    if (codigo <= 82) return "Chaparrones";
    if (codigo <= 86) return "Chaparrones de nieve";
    return "Tormenta";
};

const buscarCoordenadas = async (destino) => {

    const ciudad = destino.split(",")[0].trim();

    const { data } = await clienteHttp.get(GEOCODING_URL, {
        params: { name: ciudad, count: 1, language: "es" },
    });

    if (!data.results?.length) {
        throw crearError(404, `No se encontró la ubicación "${ciudad}" para consultar el clima`);
    }

    const [lugar] = data.results;
    return {
        nombre: lugar.name,
        pais: lugar.country,
        latitud: lugar.latitude,
        longitud: lugar.longitude,
    };
};


const elegirFuenteDeDatos = (fechaInicio, fechaFin) => {
    const hoy = new Date();

    if (fechaFin <= sumarDias(hoy, DIAS_PRONOSTICO_FUTURO) && fechaInicio >= sumarDias(hoy, -DIAS_PRONOSTICO_PASADO)) {
        return { tipo: "pronostico", url: PRONOSTICO_URL, desde: fechaInicio, hasta: fechaFin };
    }
    if (fechaFin < hoy) {
        return { tipo: "historico", url: HISTORICO_URL, desde: fechaInicio, hasta: fechaFin };
    }
    return {
        tipo: "referencia_anio_anterior",
        url: HISTORICO_URL,
        desde: restarUnAnio(fechaInicio),
        hasta: restarUnAnio(fechaFin),
    };
};

const MENSAJES_POR_TIPO = {
    pronostico: "Pronóstico del clima para las fechas del viaje",
    historico: "Clima registrado durante las fechas del viaje",
    referencia_anio_anterior:
        "El viaje está fuera del rango del pronóstico: se muestra el clima de las mismas fechas del año anterior como referencia",
};

export const obtenerClimaDeViaje = async (viaje) => {
    const fechaInicio = new Date(viaje.fechaInicio);

    const fechaFin = new Date(Math.min(new Date(viaje.fechaFin), sumarDias(fechaInicio, MAXIMO_DIAS_CLIMA - 1)));

    try {
        const ubicacion = await buscarCoordenadas(viaje.destino);
        const fuente = elegirFuenteDeDatos(fechaInicio, fechaFin);

        const { data } = await clienteHttp.get(fuente.url, {
            params: {
                latitude: ubicacion.latitud,
                longitude: ubicacion.longitud,
                daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum",
                timezone: "auto",
                start_date: formatearFecha(fuente.desde),
                end_date: formatearFecha(fuente.hasta),
            },
        });

        const dias = data.daily.time.map((fecha, i) => ({
            fecha,
            descripcion: describirCodigoClima(data.daily.weather_code[i]),
            temperaturaMaxima: data.daily.temperature_2m_max[i],
            temperaturaMinima: data.daily.temperature_2m_min[i],
            precipitacionMm: data.daily.precipitation_sum[i],
        }));

        return {
            ubicacion,
            tipo: fuente.tipo,
            mensaje: MENSAJES_POR_TIPO[fuente.tipo],
            dias,
        };
    } catch (error) {
   
        if (error.status) throw error;

        console.error("Error consultando Open-Meteo:", error.message);
        throw crearError(503, "El servicio de clima no está disponible en este momento, intentá más tarde");
    }
};
