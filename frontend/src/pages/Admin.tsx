import { useState, useEffect } from 'react'
import { Header } from "../components/RoutesHeader/RoutesHeader"
import { apiUrl } from "../config/api"
import './Admin.css'
import { useNavigate } from 'react-router-dom'
import { MdCancel } from "react-icons/md";
import { useUser } from '../context/UserContext'

export interface Appointment {
    _id: string,
    user: string,
    phone: string,
    service: string,
    barber: string,
    date: string,
    time: string,
    status?: boolean,
}

export function Admin () {

    const { user, loading: loadingUser } = useUser()

    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [confirm, setConfirm] = useState('')
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

    const redirect = useNavigate()

    const userRole = user?.role
        
    useEffect(() => {

        if (loadingUser) {
            return
        }

        if (user === null){
            redirect('/login')
        }

        if (user !== null && userRole !== 'admin'){
            redirect('/agendamento')
        }

    }, [user, userRole, loadingUser, redirect])

    async function loadAppointments() {

        setLoading(true)

        const response = await fetch(`${apiUrl}/buscarAgendamentos`, {credentials: 'include'})
        const data = await response.json()

        const appointmentsAtivos = data.filter((app: Appointment) => app.status !== false)
        setAppointments(appointmentsAtivos)
        setLoading(false)

    }

    async function handleConfirm(barber: string, date: string, time: string) {

        const response = await fetch(`${apiUrl}/cancelarAgendamento`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                barber,
                date,
                time
            })
        })

        const data = await response.json()

        setConfirm(data.message)

        setModalOpen(false)

        await loadAppointments()

    }

    return (
        <>
            
            <Header />

            <div className="header-admin">

                <h1>Dados e Estatísticas</h1>

                <button 
                    className='button-load-appointments'
                    onClick={loadAppointments}
                >
                    {loading ? 'Carregando...' : 'Carregar Agendamentos'}
                </button>

            </div>

            <div className="content-admin">

                <table className='tabela'>

                    <thead className='titulo-coluna'>

                        <tr>
                            <th>Cliente</th>
                            <th>Serviço</th>
                            <th>Barbeiro</th>
                            <th>Data</th>
                            <th>Horário</th>
                            <th>Telefone</th>
                            <th></th>
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
                                <td>{appointment.phone}</td>

                                <td>

                                    <button 
                                        className='botao-cancelamento'
                                        onClick={() => {
                                            setSelectedAppointment(appointment)
                                            setModalOpen(true)
                                        }}
                                    >
                                        <MdCancel />
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

                {modalOpen && (

                    <div className="cancelamento-modal">

                        <p>Você realmente deseja cancelar esse horário?</p>
            
                        <button
                            className="confirmar-cancelamento"
                            onClick={() => {

                                if (selectedAppointment) {

                                    handleConfirm(
                                        selectedAppointment.barber,
                                        selectedAppointment.date,
                                        selectedAppointment.time
                                    )

                                }

                            }}
                        >
                            Confirmar
                        </button>
            
                        <button
                            className="cancelar-cancelamento"
                            onClick={() => {
                                setModalOpen(false)
                                setSelectedAppointment(null)
                            }}
                        >
                            Cancelar
                        </button>
            
                    </div>

                )}

                    <p className='confirmacao-cancelamento'>{confirm}</p>

            </div>

        </>
    )
}