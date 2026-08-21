import { useState, useEffect } from 'react'
import './Agendamento.css'
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../config/api';
import { Header } from '../components/RoutesHeader/RoutesHeader';
import { useUser } from '../context/UserContext'

export function Agendamento () {

    const { user, loading } = useUser()

    const [service, setService] = useState('')
    const [barber, setBarber] = useState('')
    const [date, setDate] = useState ('')
    const [time, setTime] = useState ('')
    const [confirm, setConfirm] = useState('')
    const [bookedTimes, setBookedTimes] = useState<string[]>([])

    const hoje = new Date().toISOString().split('T')[0]
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

        async function fetchBookedTimes() {
            const response = await fetch(`${apiUrl}/buscarAgendamentos`, {
                credentials: 'include'
            })

            const appointments = await response.json()
            const booked = appointments
                .filter((apt: any) => apt.barber === barber && apt.date === date && apt.status === true)
                .map((apt: any) => apt.time)

            setBookedTimes(booked)
        }

        fetchBookedTimes()
    }, [barber, date])


    async function handleConfirm() {


        const response = await fetch(`${apiUrl}/agendamento`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                user: user?.user,
                phone: userPhone,
                service,
                barber,
                date,
                time
            })
        })

        const data = await response.json()

        setConfirm(data.message)

    }

    return (
        <>
        <div className="container-agendamento">

            <Header />

            <div className="header-agendamento">
                <h1>Agende seu horário</h1>
            </div>

            <div className="content-agendamento">

                <div className="options-agendamento">

                    <h2 className='subtitle'>Serviço</h2>
                    <select className='servico' onChange={(event) => setService(event.target.value)}>
                        <option value="escolha-service">Escolha um serviço:</option>
                        <option value="Barba">Barba</option>
                        <option value="Degradê">Degradê</option>
                        <option value="Social">Social</option>
                    </select>
                
                    <h2 className='subtitle'>Barbeiro</h2>
                    <select className='barber' onChange={(event) => setBarber(event.target.value)}>
                        <option value="escolha-barber">Escolha um barbeiro:</option>
                        <option value="José">José</option>
                        <option value="Roberto">Roberto</option>
                        <option value="Cláudio">Cláudio</option>
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
                    >Confirmar agendamento</button>

                    
                    <div className='confirmacao-agendamento'>
                        <h2>{confirm}</h2>
                    </div>


                </div>

            </div>
        </div>

        </>
    )
}