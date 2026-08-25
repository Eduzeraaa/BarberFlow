import { apiUrl } from './api'

type Resultado<T = any> = {
    ok: boolean
    status: number
    data: T
}

export async function apiFetch<T = any>(
    caminho: string,
    options: RequestInit = {}
): Promise<Resultado<T>> {

    try {
        const response = await fetch(`${apiUrl}${caminho}`, {
            ...options,
            credentials: 'include',
            headers: {
                ...(options.body ? { 'Content-Type': 'application/json' } : {}),
                ...options.headers
            }
        })

        const texto = await response.text()

        let data: any

        try {
            data = texto ? JSON.parse(texto) : {}
        } catch {
            data = { message: texto || 'Resposta inesperada do servidor.' }
        }

        return { ok: response.ok, status: response.status, data }

    } catch {
        return {
            ok: false,
            status: 0,
            data: {
                message: 'Não foi possível conectar ao servidor. Tente novamente.'
            } as T
        }
    }
}
