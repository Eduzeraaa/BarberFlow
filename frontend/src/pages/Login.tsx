import './Login.css'
import { useState } from 'react'
import { FiLogIn } from "react-icons/fi";
import { TbLock } from 'react-icons/tb' 
import { useNavigate, useLocation } from 'react-router-dom'
import { apiUrl } from '../config/api'
import { Link } from 'react-router-dom'
import { Header } from '../components/RoutesHeader/RoutesHeader'

export function Login () {

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')

    const redirect = useNavigate()
    const location = useLocation()

    
    async function handleConfirm() {
        
        const response = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                userOrPhone: login,
                password,
            })
        })
        
        const data = await response.json()

        localStorage.setItem('currentUser', data.user)
        localStorage.setItem('userRole', data.role)
        localStorage.setItem('userPhone', data.phone)
        
        if (data.message === 'Login efetuado com sucesso!'){
            redirect('/agendamento')
        }

        else{
            setConfirm(data.message)
        }
        
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

                        <div className='no-account'>
                            <Link to={'/cadastro'}>Não tenho conta</Link>
                        </div>


                        <button 
                            className='confirm-button'
                            onClick={handleConfirm}
                        >Confirmar</button>

                        <div className='confirmacao-login'>
                            <h2>{confirm}</h2>
                        </div>
                        
                    </div>

            </div>
        </>
    )
}