const API_URL = process.env.NEXT_PUBLIC_API_URL;


export async function insertarCorrida(objetoCorridaDTO,token) {
    const response = await fetch(
        `${API_URL}/corrida/medicion/insertar`,
        {
            method: "POST",
            headers: {
                "Accept":"application/json",
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(objetoCorridaDTO)
        }
    );
    if (!response.ok) {
        throw new Error("Error al insertar la corrida");
    }
    return response.json();
}


export async function listarCorridas(token) {
    const response = await fetch(
        `${API_URL}/corrida/medicion/obtener`,
        {
            method: "GET",
            headers: {
                "Accept":"application/json",
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    if (!response.ok) {
        throw new Error("Error al obtener la corrida");
    }
    return response.json();
}




export async function INSERTARCOMENTARIO(
    token,
    DTO) {

    const Comentario = DTO.Comentario;
    const idCorrida = DTO.idCorrida;


    const response = await fetch(
        `${API_URL}/corridas/comentario`,
        {
            method: "PUT",
            headers: {
                "Accept":"application/json",
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                idCorrida: idCorrida,
                Comentario: Comentario
            })

        }
    );


    if (!response.ok) {
        throw new Error("Error al ingresar el nuevo comentario");
    }
    return response.json();
}



export async function LISTARTODAS(token) {
    const response = await fetch(
        `${API_URL}/corridas`,
        {
            method: "GET",
            headers: {
                "Accept":"application/json",
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    if (!response.ok) {
        throw new Error("Error al obtener las corridas");
    }
    return response.json();
}




export async function ACTIVAR(token, idCorrida) {
    const response = await fetch(
        `${API_URL}/corridas/activar/${idCorrida}`,
        {
            method: "PUT",
            headers: {
                "Accept":"application/json",
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    if (!response.ok) {
        throw new Error("Error al obtener las corridas");
    }
    return response.json();
}





export async function DESACTIVAR(token, idCorrida) {
    const response = await fetch(
        `${API_URL}/corridas/desactivar/${idCorrida}`,
        {
            method: "PUT",
            headers: {
                "Accept":"application/json",
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    if (!response.ok) {
        throw new Error("Error al obtener las corridas");
    }
    return response.json();
}







export async function BUSCARSIMILAR(
    token,
    Comentario) {

    const response = await fetch(

        `${API_URL}/corridas/${Comentario}`,
        {
            method: "GET",
            headers: {
                "Accept":"application/json",
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            }

        }
    );


    if (!response.ok) {
        throw new Error("Error consultar los datos");
    }

    return response.json();
}
