import { Link } from 'react-router-dom'
import './NotFound.css'
import { Header } from '../components/RoutesHeader/RoutesHeader'

export function NotFound() {
    return (
        <>
            <div className="notfound-content">
                <Header />
                <div className="notfound-container">
                    <h1>404</h1>
                    <p>Página não encontrada</p>
                    <Link to="/">Voltar para home</Link>
                </div>
            </div>
        </>
    )
}
