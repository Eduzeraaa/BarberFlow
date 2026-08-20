import { Link, useNavigate } from 'react-router-dom'
import './Home.css'
import { useEffect } from 'react'
import { Header } from '../components/RoutesHeader/RoutesHeader'
import { useUser } from '../context/UserContext'

export function Home() {

    const { user, loading } = useUser()

    const redirect = useNavigate()

    useEffect(() => {
        if (!loading && user === null){
            redirect('/login')
        }
    }, [user, loading, redirect])

    return (
        <>
        {user?.user}
        {user?.role}
        <div className="container-home">

            <Header />

            <h1 className='header-home'>Bem-vindo à barbearia!</h1>

            <div className='about-us'>
                <h2>Quem somos?</h2>
                <p>Somos uma barbearia muito prestigiada na região! Temos os melhores barbeiros e oferecemos os melhores serviços por um preço acessível, sempre pensando em você!</p>
            </div>
            <div className='our-services'>
                <h2>Nossos serviços</h2>
                <div className='row-our-services'>
                    <p>Barba</p>
                    <p>Degradê</p>
                    <p>Social</p>
                </div>
            </div>

            <Link to="/agendamento">Agende já o seu horário!</Link>

        </div>

        </>
    )
}