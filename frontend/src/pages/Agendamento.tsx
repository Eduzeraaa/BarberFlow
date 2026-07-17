    import { useState } from 'react'
    import './Agendamento.css'

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
                
                <h2>Serviço</h2>

                    <div className='botoes-servicos'>
                        <button onClick={() => {setServico('barba')}}>Barba</button>
                        <button onClick={() => {setServico('degradê')}}>Degradê</button>
                        <button onClick={() => {setServico('social')}}>Social</button>
                    </div>
                    <p>Serviço escolhido: {servico}</p>

                <h2>Barbeiro</h2>

                    <div className='botoes-barbeiros'>
                        <button onClick={() => {setBarbeiro('José')}}>José</button>
                        <button onClick={() => {setBarbeiro('Roberto')}}>Roberto</button>
                        <button onClick={() => {setBarbeiro('Cláudio')}}>Cláudio</button>
                    </div>
                    <p>Barbeiro escolhido: {barbeiro}</p>

                <h2>Data</h2>

                    <div className='botoes-data'>
                        <button onClick={() => {setData('hoje')}}>Hoje</button>
                        <button onClick={() => {setData('amanhã')}}>Amanhã</button>
                        <button onClick={() => {setData('depois de amanhã')}}>Depois de amanhã</button>
                    </div>
                    <p>Data escolhida: {data}</p>                    

                <h2>Horário</h2>

                    <div className='botoes-horario'>
                        <button onClick={() => {setHorario('manhã')}}>Manhã</button>
                        <button onClick={() => {setHorario('tarde')}}>Tarde</button>
                        <button onClick={() => {setHorario('noite')}}>Noite</button>
                    </div>
                    <p>Horário escolhido: {horario}</p>

                    <h2>Você escolheu {servico}, que será feito pelo {barbeiro} na {horario} de {data}.</h2>

                </div>

            </div>
        </div>

        </>
    )
}