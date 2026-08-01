import { useState } from 'react'
import './Agendamento.css'
import { BlocoSelecao } from '../components/BlocoSelecao/BlocoSelecao'

export function Agendamento () {

    const [servico, setServico] = useState('')
    const [barbeiro, setBarbeiro] = useState('')
    const [data, setData] = useState ('')
    const [horario, setHorario] = useState ('')
    const hoje = new Date().toISOString().split('T')[0]

    const [confirmedService, setConfirmedService] = useState('')
    const [confirmedBarbeiro, setConfirmedBarbeiro] = useState('')
    const [confirmedData, setConfirmedData] = useState('')
    const [confirmedHorario, setConfirmedHorario] = useState('')

    function handleConfirm() {
        setConfirmedService(servico)
        setConfirmedBarbeiro(barbeiro)
        setConfirmedData(data)
        setConfirmedHorario(horario)
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
                    valorSelecionado={servico}
                    aoSelecionar={setServico}
                />

                <BlocoSelecao
                    titulo="Barbeiro"
                    opcoes={['José', 'Roberto', 'Cláudio']}
                    valorSelecionado={barbeiro}
                    aoSelecionar={setBarbeiro}
                />

                <h2>Data</h2>
                <input
                    className='botao-data'
                    type="date"
                    min={hoje}
                    value={data}
                    onChange={(event) => setData(event.target.value)}
                />

                <BlocoSelecao 
                    titulo="Horário"
                    opcoes={['Manhã', 'Tarde', 'Noite']}
                    valorSelecionado={horario}
                    aoSelecionar={setHorario}
                />

                    <div className='resumo'>
                        <div className='header-resumo'>
                            <h2>━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h2>
                            <h2>Resumo do Agendamento</h2>
                        </div>

                        <h3>Serviço: {confirmedService}</h3>
                        <h3>Barbeiro: {confirmedBarbeiro}</h3>
                        <h3>Data: {confirmedData}</h3>
                        <h3>Horário: {confirmedHorario}</h3>
                        
                        <button 
                            className='botao-confirmacao-resumo'
                            onClick={handleConfirm}
                        >Confirmar agendamento</button>

                    </div>

                </div>

            </div>
        </div>

        </>
    )
}