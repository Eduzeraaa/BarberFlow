import { useState } from 'react'
import './Agendamento.css'
import { BlocoSelecao } from '../components/BlocoSelecao/BlocoSelecao'
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from "react-icons/fi";
import { apiUrl } from '../config/api';
import { useEffect } from 'react';

export function Agendamento () {

    const [service, setService] = useState('')
    const [barber, setBarber] = useState('')
    const [date, setDate] = useState ('')
    const [time, setTime] = useState ('')
    const [confirm, setConfirm] = useState('')

    const hoje = new Date().toISOString().split('T')[0]
    const redirect = useNavigate()

    const currentUser = localStorage.getItem('currentUser')
    
    useEffect(() => {
        
        if (currentUser === null){
            redirect('/login')
        }

    })


    async function handleConfirm() {


        const response = await fetch(`${apiUrl}/agendamento`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                user: currentUser,
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
            <div className="header-agendamento">
                <h1>Agende seu horário</h1>
                <button
                    className='logout'
                    onClick={() => {
                        localStorage.removeItem('currentUser')
                        redirect('/login')
                    }}
                > <FiLogOut /></button>
            </div>

            <div className="content-agendamento">

                <div className="options-agendamento">
                
                    <BlocoSelecao 
                        titulo="Serviço"
                        opcoes={['Barba', 'Degradê', 'Social']}
                        valorSelecionado={service}
                        aoSelecionar={setService}
                    />

                    <BlocoSelecao
                        titulo="Barbeiro"
                        opcoes={['José', 'Roberto', 'Cláudio']}
                        valorSelecionado={barber}
                        aoSelecionar={setBarber}
                    />

                    <h2>Data</h2>
                    <input
                        className='botao-data'
                        type="date"
                        min={hoje}
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                    />

                    <h2>Horário</h2>
                    <select className='horario' name="horario" onChange={(event) => setTime(event.target.value)}>
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
                        className='botao-confirmacao-resumo'
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