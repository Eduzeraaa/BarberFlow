import { useState } from 'react'
import { Header } from "../components/RoutesHeader/RoutesHeader"
import { apiUrl } from "../config/api"
import './Admin.css'

interface Appointment {
    _id: string
    user: string
    service: string
    barber: string
    date: string
    time: string
}

export function Admin () {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(false)

    async function loadAppointments() {
        setLoading(true)
        
        const response = await fetch(`${apiUrl}/buscarAgendamentos`)
        const data = await response.json()
        
        setAppointments(data)
        setLoading(false)
    }

    return (
        <>
            
            <Header />

            <div className="header-admin">
                <h1>Dados e Estatísticas</h1>
                <button className='button-load-apoointments' onClick={loadAppointments}>
                    {loading ? 'Carregando...' : 'Carregar Agendamentos'}
                </button>
            </div>

            <div className="content-admin">

                <table className='tabela'>
                <thead className='titulo-coluna'>
                    <tr>
                        <th>Usuário</th>
                        <th>Serviço</th>
                        <th>Barbeiro</th>
                        <th>Data</th>
                        <th>Horário</th>
                    </tr>
                </thead>

                <tbody>
                    {appointments.map((appointment) => (
                    <tr key={appointment._id}>
                        <td>{appointment.user}</td>
                        <td>{appointment.service}</td>
                        <td>{appointment.barber}</td>
                        <td>{appointment.date}</td>
                        <td>{appointment.time}</td>
                    </tr>
                    ))}
                </tbody>
                </table>

            </div>

        </>
    )
}