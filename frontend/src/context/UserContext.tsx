import { createContext, useState, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import { apiUrl } from '../config/api'

type User = {
    user: string
    phone: string
    role: string
}

const UserContext = createContext<{ user: User | null }>({ user: null })

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        fetch(`${apiUrl}/perfil`)
            .then(r => r.json())
            .then(data => setUser(data.data))
            .catch(err => console.error('Erro ao carregar user:', err))
    }, [])

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext)
}