import { Link } from 'react-router-dom'
import './Home.css'
export function Home() {
    return (
        <>
        <div className="container-home">
            <h1 className='header-home'>Bem-vindo à barbearia!</h1>
            <Link to="/agendamento">Clique aqui para agendar seu horário!</Link>
            <h2 className='subtitle-home'>Nossos serviços</h2>
            <div className='content-home'>
                <h3>Em manutenção</h3>
            </div>
        </div>
        </>
    )
}