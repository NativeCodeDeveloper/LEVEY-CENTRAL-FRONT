const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function insertarValorAnaliticoApi(
    idMedicion,
    idCorrida,
    idNivelesAnalitosControl,
    valorAnalitico,
    usuarioModificacion,
    token) {
    const response = await fetch(
        `${API_URL}/nivel/insercion/data/analitica`,
        {
            method: "POST",
            headers: {
                "Accept":"application/json",
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                idMedicion,
                idCorrida,
                idNivelesAnalitosControl,
                valor: valorAnalitico,
                usuarioModificacion
            })
        }
    );
    if (!response.ok) {
        throw new Error("Error al insertar la corrida");
    }
    return response.json();
}
