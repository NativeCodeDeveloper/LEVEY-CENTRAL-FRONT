const API_URL = process.env.NEXT_PUBLIC_API_URL;


export async function listarAnalitos(token) {
    const response = await fetch(
        `${API_URL}/analitos/activos`,
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
        throw new Error("Error al obtener los analitos");
    }
    return response.json();
}



