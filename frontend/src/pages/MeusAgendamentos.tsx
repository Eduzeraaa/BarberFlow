import { useState, useEffect } from 'react'
import { Header } from "../components/RoutesHeader/RoutesHeader"
import { apiUrl } from "../config/api"
import './MeusAgendamentos.css'
import { useNavigate } from 'react-router-dom'
import { MdCancel } from "react-icons/md"
import { useUser } from '../context/UserContext'
import type { Appointment } from './Admin'

export function MeusAgendamentos () {

    const { user, loading: loadingUser } = useUser()

    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
    const [confirm, setConfirm] = useState('')
    const [recarregar, setRecarregar] = useState(0)

    const redirect = useNavigate()

    useEffect(() => {

        if (loadingUser) {
            return
        }

        if (user === null){
            redirect('/login')
        }

    }, [user, loadingUser, redirect])

    useEffect(() => {

        if (loadingUser || user === null) {
            return
        }

        async function loadMyAppointments() {

            setLoading(true)

            const response = await fetch(`${apiUrl}/meusAgendamentos`, {
                credentials: 'include'
            })

            const data = await response.json()

            const appointmentsAtivos = data.filter((app: Appointment) => app.status !== false)
            setAppointments(appointmentsAtivos)
            setLoading(false)

        }

        loadMyAppointments()

    }, [user, loadingUser, recarregar])

    async function handleCancel(id: string) {

        const response = await fetch(`${apiUrl}/cancelarAgendamento`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ id })
        })

        const data = await response.json()

        setConfirm(data.message)
        setModalOpen(false)
        setSelectedAppointment(null)
        setRecarregar((valor) => valor + 1)

    }

    const hoje = new Date().toISOString().split('T')[0]

    const proximos = appointments
        .filter((app) => app.date >= hoje)
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))

    const anteriores = appointments
        .filter((app) => app.date < hoje)
        .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))

    return (
        <>

            <Header />

            <div className="header-meus-agendamentos">

                <h1>Meus Agendamentos</h1>

            </div>

            <div className="content-meus-agendamentos">

                {loading && <p className='aviso-meus-agendamentos'>Carregando...</p>}

                {!loading && appointments.length === 0 && (
                    <p className='aviso-meus-agendamentos'>
                        Você ainda não tem agendamentos.
                    </p>
                )}

                {!loading && proximos.length > 0 && (
                    <>
                        <h2 className='subtitulo-meus-agendamentos'>Próximos</h2>

                        <table className='tabela tabela-proximos'>

                            <thead className='titulo-coluna'>
                                <tr>
                                    <th>Serviço</th>
                                    <th>Barbeiro</th>
                                    <th>Data</th>
                                    <th>Horário</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {proximos.map((appointment) => (
                                    <tr key={appointment._id}>
                                        <td>{appointment.service}</td>
                                        <td>{appointment.barber}</td>
                                        <td>{appointment.date}</td>
                                        <td>{appointment.time}</td>
                                        <td>
                                            <button
                                                className='botao-cancelamento'
                                                title='Cancelar agendamento'
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
                    </>
                )}

                {!loading && anteriores.length > 0 && (
                    <>
                        <h2 className='subtitulo-meus-agendamentos'>Anteriores</h2>

                        <table className='tabela tabela-anteriores'>

                            <thead className='titulo-coluna'>
                                <tr>
                                    <th>Serviço</th>
                                    <th>Barbeiro</th>
                                    <th>Data</th>
                                    <th>Horário</th>
                                </tr>
                            </thead>

                            <tbody>
                                {anteriores.map((appointment) => (
                                    <tr key={appointment._id}>
                                        <td>{appointment.service}</td>
                                        <td>{appointment.barber}</td>
                                        <td>{appointment.date}</td>
                                        <td>{appointment.time}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </>
                )}

                {modalOpen && selectedAppointment && (

                    <div className="cancelamento-modal">

                        <p>
                            Cancelar o {selectedAppointment.service} com {selectedAppointment.barber} em{' '}
                            {selectedAppointment.date} às {selectedAppointment.time}?
                        </p>

                        <button
                            className="confirmar-cancelamento"
                            onClick={() => handleCancel(selectedAppointment._id)}
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
                            Voltar
                        </button>

                    </div>

                )}

                <p className='confirmacao-cancelamento'>{confirm}</p>

            </div>

        </>
    )
}
