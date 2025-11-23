export const obtenerCoordenadas = async ({ calle, numero, localidad, provincia, pais }) => {
  try {
    const direccion = `${calle} ${numero}, ${localidad}, ${provincia}, ${pais}`;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      direccion
    )}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "MiAppReact/1.0", 
        "Accept-Language": "es",
      },
    });

    const data = await response.json();

    if (!data || data.length === 0) {
      console.warn("No se encontraron coordenadas para:", direccion);
      return null;
    }

    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };

  } catch (error) {
    console.error("Error al obtener coordenadas:", error);
    return null;
  }
};