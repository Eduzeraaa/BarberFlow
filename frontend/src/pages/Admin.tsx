import { useState, useEffect } from 'react'
import { Header } from "../components/RoutesHeader/RoutesHeader"
import { apiUrl } from "../config/api"
import './Admin.css'
import { useNavigate } from 'react-router-dom'
import { MdCancel } from "react-icons/md";

interface Appointment {
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

    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [confirm, setConfirm] = useState('')
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

    const redirect = useNavigate()

    const currentUser = localStorage.getItem('currentUser')
    const userRole = localStorage.getItem('userRole')
        
    useEffect(() => {
        
        if (currentUser === null){
            redirect('/login')
        }

        if (currentUser !== null && userRole !== 'admin'){
            redirect('/agendamento')
        }

    })

    async function loadAppointments() {

        setLoading(true)

        const response = await fetch(`${apiUrl}/buscarAgendamentos`)
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