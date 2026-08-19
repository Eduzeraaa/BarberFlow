import { useState, useEffect } from 'react'
import './Agendamento.css'
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../config/api';
import { Header } from '../components/RoutesHeader/RoutesHeader';
import { useUser } from '../context/UserContext'

export function Agendamento () {

    const { user } = useUser()

    const [service, setService] = useState('')
    const [barber, setBarber] = useState('')
    const [date, setDate] = useState ('')
    const [time, setTime] = useState ('')
    const [confirm, setConfirm] = useState('')

    const hoje = new Date().toISOString().split('T')[0]
    const redirect = useNavigate()

    
    const userPhone = user?.phone
    
    useEffect(() => {
        if (user === null){
            redirect('/login')
        }
    }, [user, redirect])


    async function handleConfirm() {


        const response = await fetch(`${apiUrl}/agendamento`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
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
                        <option value="08:00">08:00</option>
                        <option value='08:30'>08:30</option>
                        <option value='09:00'>09:00</option>
                        <option value='09:30'>09:30</option>
                        <option value='10:00'>10:00</option>
                        <option value='10:30'>10:30</option>
                        <option value='11:00'>11:00</option>
                        <option value='11:30'>11:30</option>
                        <option value='14:00'>14:00</option>
                        <option value='14:30'>14:30</option>
                        <option value='15:00'>15:00</option>
                        <option value='15:30'>15:30</option>
                        <option value='16:00'>16:00</option>
                        <option value='16:30'>16:30</option>
                        <option value='17:00'>17:00</option>
                        <option value='17:30'>17:30</option>
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