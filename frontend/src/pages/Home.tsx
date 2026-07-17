import { Link } from 'react-router-dom'
import './Home.css'
export function Home() {
    return (
        <>
        <div className="container-home">
            <h1 className='header-home'>Bem-vindo à barbearia!</h1>
            <Link to="/agendamento" className='linkpera'>Clique aqui para agendar seu horário!</Link>
            <h2 className='subtitle-home'>Nossos serviços</h2>
            <div className='content-home'>
                <h3>Desgradê</h3>
                <h3>Social</h3>
                <h3>Barba</h3>
            </div>
        </div>
        </>
    )
}