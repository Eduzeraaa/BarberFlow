import { useState } from 'react'
import './Agendamento.css'
import { BlocoSelecao } from '../components/BlocoSelecao/BlocoSelecao'

export function Agendamento () {

    const [service, setService] = useState('')
    const [barber, setBarber] = useState('')
    const [date, setDate] = useState ('')
    const [time, setTime] = useState ('')
    const hoje = new Date().toISOString().split('T')[0]

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

        alert(data.message)

    }

    return (
        <>
        <div className="container-agendamento">
            <h1 className="header-agendamento">Agende seu horário</h1>

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

                </div>

            </div>
        </div>

        </>
    )
}