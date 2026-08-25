import './Login.css'
import { useState } from 'react'
import { FiLogIn } from "react-icons/fi";
import { TbLock } from 'react-icons/tb' 
import { useNavigate, useLocation } from 'react-router-dom'
import { apiFetch } from '../config/apiFetch'
import { Link } from 'react-router-dom'
import { Header } from '../components/RoutesHeader/RoutesHeader'
import { useUser } from '../context/UserContext'

export function Login () {

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [sending, setSending] = useState(false)

    const redirect = useNavigate()
    const location = useLocation()
    const { refreshUser } = useUser()

    async function handleConfirm() {

        setSending(true)

        const { ok, data } = await apiFetch('/login', {
            method: 'POST',
            body: JSON.stringify({
                userOrPhone: login,
                password,
            })
        })

        if (ok){
            await refreshUser()
            redirect('/agendamento')
        }

        else {
            setConfirm(data.message)
        }

        setSending(false)
        
    }
    
    
    return (
        <>
            <div className="login-content">

                <Header />

                <div className='header-login'>
                    <h1>Login</h1>
                </div>


                <h2>{location.state?.message}</h2>

                    <div className="login-container">
                        
                        <div className='user-login'>
                            <FiLogIn />
                            <label>Login</label>
                            <input 
                                className='user-input-login'
                                type="text"
                                placeholder='Nome ou Telefone'
                                onChange={(event) => setLogin(event.target.value)}
                                />
                        </div>


                        <div className='password-login'>
                            <TbLock/>
                            <label>Senha</label>
                            <input
                                className='password-input-login'
                                type="password"
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>

                        <div className='links'>
                            <Link to={'/cadastro'}>Não tenho conta</Link>
                            <Link to={'/recovery'}>Esqueci a senha</Link>
                        </div>


                        <button
                            className='botao-confirmacao'
                            onClick={handleConfirm}
                            disabled={sending}
                        >{sending ? 'Carregando...' : 'Confirmar'}</button>

                        <div className='confirmacao-login'>
                            <h2>{confirm}</h2>
                        </div>
                        
                    </div>

            </div>
        </>
    )
}