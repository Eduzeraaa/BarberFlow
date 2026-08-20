import { createContext, useState, useContext, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { apiUrl } from '../config/api'

type User = {
    user: string
    phone: string
    role: string
}

type UserContextType = {
    user: User | null
    loading: boolean
    refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
    user: null,
    loading: true,
    refreshUser: async () => {}
})

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    // Busca no backend quem é o usuário do cookie.
    // Usado na montagem da app e logo após o login.
    const refreshUser = useCallback(async () => {
        setLoading(true)

        try {
            const response = await fetch(`${apiUrl}/perfil`, {
                credentials: 'include'
            })

            const data = await response.json()

            setUser(data.data ?? null)
        } catch (error) {
            console.error('Erro ao carregar user:', error)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        refreshUser()
    }, [refreshUser])

    return (
        <UserContext.Provider value={{ user, loading, refreshUser }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext)
}
