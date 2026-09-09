import { useState, useEffect } from 'react'
import './Agendamento.css'
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../config/apiFetch';
import { Header } from '../components/RoutesHeader/RoutesHeader';
import { useUser } from '../context/UserContext'
import { dataDeHoje } from '../utils/data'

type Barbeiro = {
    _id: string
    barber: string
}

type Servico = {
    _id: string
    service: string
}

export function Agendamento () {

    const { user, loading } = useUser()

    const [service, setService] = useState('')
    const [barber, setBarber] = useState('')
    const [date, setDate] = useState ('')
    const [time, setTime] = useState ('')
    const [confirm, setConfirm] = useState('')
    const [sending, setSending] = useState(false)
    const [bookedTimes, setBookedTimes] = useState<string[]>([])
    const [recarregarHorarios, setRecarregarHorarios] = useState(0)
    const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([])
    const [servicos, setServicos] = useState<Servico[]>([])

    const hoje = dataDeHoje()
    const redirect = useNavigate()

    
    const userPhone = user?.phone
    
    useEffect(() => {
        if (!loading && user === null){
            redirect('/login')
        }
    }, [user, loading, redirect])

    useEffect(() => {
        if (!barber || !date) {
            setBookedTimes([])
            return
        }


        let ignorar = false

        async function fetchBookedTimes() {
            const { data } = await apiFetch<{ times?: string[] }>(
                `/horariosOcupados?barber=${encodeURIComponent(barber)}&date=${encodeURIComponent(date)}`
            )

            if (!ignorar) {
                setBookedTimes(data.times ?? [])
            }
        }

        fetchBookedTimes()

        return () => { ignorar = true }
    }, [barber, date, recarregarHorarios])

    useEffect(() => {

        async function allTheBarbers() {
        
            const { ok, data } = await apiFetch<Barbeiro[]>('/barbeiros')

            if (ok) {
                setBarbeiros(data)
            }

        }

        allTheBarbers()

    }, [])

    useEffect(() => {

        async function allTheServices() {
            
            const { ok, data } = await apiFetch<Servico[]>('/servicos')

            if (ok){
                setServicos(data)
            }
        }

        allTheServices()

    }, [])


    async function handleConfirm() {

        setSending(true)

        const { data } = await apiFetch('/agendamento', {
            method: 'POST',
            body: JSON.stringify({
                user: user?.user,
                phone: userPhone,
                service,
                barber,
                date,
                time
            })
        })

        setConfirm(data.message)

        setRecarregarHorarios((valor) => valor + 1)

        setSending(false)

    }


    return (
        <>
        <div className="container-agendamento">

            <Header />

            <div className="header-agendamento">
                <h1>Olá, {`${user?.user}.`}</h1>
                <h1>Agende seu horário</h1>
            </div>

            <div className="content-agendamento">

                <div className="options-agendamento">

                    <h2 className='subtitle'>Serviço</h2>
                    <select className='servico' onChange={(event) => setService(event.target.value)}>
                        <option value="escolha-service">Escolha um serviço:</option>
                        {servicos.map(servico => (
                            <option
                                key={servico._id}
                                value={servico.service}
                            >{servico.service}</option>
                        ))}
                    </select>
                
                    <h2 className='subtitle'>Barbeiro</h2>
                    <select className='barber' onChange={(event) => setBarber(event.target.value)}>
                        <option value="escolha-barber">Escolha um barbeiro:</option>
                        {barbeiros.map(barbeiro => (
                            <option
                                key={barbeiro._id}
                                value={barbeiro.barber}
                            >{barbeiro.barber}</option>
                        ))}
                    </select>

                    <h2 className='subtitle'>Data</h2>
                    <input
                        className='botao-data'
                        type="date"
                        min={hoje}
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                    />

                    <h2 className='subtitle'>Horário</h2>
                    <select className='horario' name="horario" onChange={(event) => setTime(event.target.value)}>
                        <option value="escolha-time">Escolha um horário:</option>
                        {['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'].map(timeSlot => (
                            <option
                                key={timeSlot}
                                value={timeSlot}
                                disabled={bookedTimes.includes(timeSlot)}
                            >
                                {timeSlot}
                            </option>
                        ))}
                    </select>
                            
                    <button
                        className='botao-confirmacao'
                        onClick={handleConfirm}
                        disabled={sending}
                    >{sending ? 'Enviando dados...' : 'Confirmar Agendamento'}</button>

                    
                    <div className='confirmacao-agendamento'>
                        <h2>{confirm}</h2>
                    </div>


                </div>

            </div>
        </div>

        </>
    )
}