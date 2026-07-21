import { useState } from 'react'
import './Agendamento.css'
import { BlocoSelecao } from '../components/BlocoSelecao/BlocoSelecao'

export function Agendamento () {

    const [servico, setServico] = useState('')
    const [barbeiro, setBarbeiro] = useState('')
    const [data, setData] = useState ('')
    const [horario, setHorario] = useState ('')

    return (
        <>
        <div className="container-agendamento">
            <h1 className="header-agendamento">Agende seu horário</h1>

            <div className="content-agendamento">

                <div className="options-agendamento">
                
                <BlocoSelecao 
                    titulo="Serviço"
                    opcoes={['Barba', 'Degradê', 'Social']}
                    confirmacao={servico}
                    aoSelecionar={setServico}
                />

                <BlocoSelecao
                    titulo="Barbeiro"
                    opcoes={['José', 'Roberto', 'Cláudio']}
                    confirmacao={barbeiro}
                    aoSelecionar={setBarbeiro}
                />

                <BlocoSelecao 
                    titulo="Data"
                    opcoes={['Hoje', 'Amanhã', 'Depois de amanhã']}
                    confirmacao={data}
                    aoSelecionar={setData}
                />

                <BlocoSelecao 
                    titulo="Horário"
                    opcoes={['Manhã', 'Tarde', 'Noite']}
                    confirmacao={horario}
                    aoSelecionar={setHorario}
                />

                    <h2>Você escolheu {servico}, que será feito pelo {barbeiro} na {horario} de {data}.</h2>

                </div>

            </div>
        </div>

        </>
    )
}