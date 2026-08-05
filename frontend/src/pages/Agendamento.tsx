import { useState } from 'react'
import './Agendamento.css'
import { BlocoSelecao } from '../components/BlocoSelecao/BlocoSelecao'
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from "react-icons/fi";

export function Agendamento () {

    const [service, setService] = useState('')
    const [barber, setBarber] = useState('')
    const [date, setDate] = useState ('')
    const [time, setTime] = useState ('')
    const [confirm, setConfirm] = useState('')

    const hoje = new Date().toISOString().split('T')[0]
    const redirect = useNavigate()

    async function handleConfirm() {

        const currentUser = localStorage.getItem('currentUser')

        const response = await fetch('http://localhost:3000/agendamento', {
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

                    <BlocoSelecao 
                        titulo="Horário"
                        opcoes={['Manhã', 'Tarde', 'Noite']}
                        valorSelecionado={time}
                        aoSelecionar={setTime}
                    />
                            
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