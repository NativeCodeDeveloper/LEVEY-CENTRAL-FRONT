const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function obtenerUbicaciones(token) {
    const response = await fetch(
        `${API_URL}/ubicacion`,
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
        throw new Error("Error al obtener las ubicaciones");
    }

    return response.json();
}




export async function seleccionarUbicacionEspecifica(
    idUbicacion,
    token) {
    const response = await fetch(
        `${API_URL}/ubicaciones/${idUbicacion}`,
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
        throw new Error("Error al obtener la ubicación específica");
    }

    return response.json();
}



export async function insertarUbicacion(
    nombreUbicacion,
    detalleUbicacion,
    detalleAlmacenamiento,
    usuarioCreacion,
    token) {
    const response = await fetch(
        `${API_URL}/ubicacion`,
        {
            method: "POST",
            headers: {
                "Accept":"application/json",
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                nombreUbicacion,
                detalleUbicacion,
                detalleAlmacenamiento,
                usuarioCreacion
            })
        }
    );

    if (!response.ok) {
        throw new Error("Error al insertar la ubicación");
    }

    return response.json();
}




export async function actualizarUbicacion(
    idUbicacion,
    nombreUbicacion,
    detalleUbicacion,
    detalleAlmacenamiento,
    usuarioModificacion,
    token) {
    const response = await fetch(
        `${API_URL}/ubicacion/actualizar`,
        {
            method: "PUT",
            headers: {
                "Accept":"application/json",
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                idUbicacion,
                nombreUbicacion,
                detalleUbicacion,
                detalleAlmacenamiento,
                usuarioModificacion
            })
        }
    );

    if (!response.ok) {
        throw new Error("Error al insertar la ubicación");
    }

    return response.json();
}









export async function desactivar(
    idUbicacion,
    token
) {
    const response = await fetch(
        `${API_URL}/ubicaciones/desactivar/${idUbicacion}`,
        {
            method: "PATCH",
            headers: {
                "Accept":"application/json",
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Error al desactivar la ubicación");
    }

    return response.json();
}



export async function activar(
    idUbicacion,
    token
) {
    const response = await fetch(
        `${API_URL}/ubicaciones/activar/${idUbicacion}`,
        {
            method: "PATCH",
            headers: {
                "Accept":"application/json",
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Error al activar la ubicación");
    }

    return response.json();
}