const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function listarAnalitosyNiveles(token) {
    const response = await fetch(
        `${API_URL}/analitoControl/niveles/listarTodos`,
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
        throw new Error("Error al obtener los analitos y niveles");
    }
    return response.json();
}

export async function listarNivelesActivos(token) {
    const response = await fetch(
        `${API_URL}/analitoControl/niveles/activos`,
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
        throw new Error("Error al obtener los analitos y niveles");
    }
    return response.json();
}



export async function listarNivelesInactivos(token) {
    const response = await fetch(
        `${API_URL}/analitoControl/niveles/inactivos`,
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
        throw new Error("Error al obtener los analitos y niveles");
    }
    return response.json();
}









    export async function listarSegunAnalitos(token, idAnalito) {
        const response = await fetch(
            `${API_URL}/analitoControl/analitos/${idAnalito}`,
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
            throw new Error("Error al obtener los analitos y niveles");
        }
        return response.json();
    }





export async function buscarEntreFechas(token, fechaInicio, fechaFin) {
    const response = await fetch(
        `${API_URL}/analitoControl/fechas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
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
        throw new Error("Error al obtener los analitos y niveles");
    }
    return response.json();
}


    export async function listarPorLoteSimilar(token, numeroLote) {
    const response = await fetch(
        `${API_URL}/analitoControl/niveles/lotes/${numeroLote}`,
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
        throw new Error("Error al obtener los analitos y niveles");
    }
    return response.json();
}




export async function listarPorSimilitudDeNombre(token, nombreControl) {
    const response = await fetch(
        `${API_URL}/analitoControl/niveles/${nombreControl}`,
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
        throw new Error("Error al obtener los analitos y niveles");
    }
    return response.json();
}
