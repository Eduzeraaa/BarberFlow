import './Cadastro.css'
import { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { TbLock } from 'react-icons/tb' 
import { useNavigate } from 'react-router-dom'
import { apiUrl } from '../config/api'
import { Header } from '../components/RoutesHeader/RoutesHeader'

export function Cadastro () {

    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [confirm, setConfirm] = useState('')

    const redirect = useNavigate()

    const [error, setError] = useState('')

    async function handleConfirm() {
        if (password.length < 8){
            setError('Sua senha contém menos que 8 caracteres.')
            return // fim da funçao
        }
        
        else if (password !== passwordConfirm) {
            setError('Senhas diferentes!')
            return // fim da funçao
        }

        setError('')

        const response = await fetch(`${apiUrl}/cadastro`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                user,
                password
            })
        })

        const data = await response.json()

        if (data.message === 'Cadastro realizado!'){
            redirect('/login', {
                state: {
                    message: data.message
                }
            })
        }

        else{
            setConfirm(data.message)
        }

        

    }

    return (
        <>
            <div className="cadastro-content">

                <Header />

                <div className='header-cadastro'>
                    <h1>Cadastro</h1>
                </div>

                    <div className="cadastro-container">
                        
                        <div className='user-cadastro'>
                            <FaUser/>
                            <label>Usuário</label>
                            <input 
                                type="text"
                                placeholder='Nome de usuário'
                                onChange={(event) => setUser(event.target.value)}
                            />
                        </div>


                        <div className='password-cadastro'>
                            <TbLock/>
                            <label>Senha</label>
                            <input 
                                type="password"
                                placeholder='Mínimo 8 caracteres'
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>
                        
                        <div className='password-confirm'>
                            <TbLock />
                            <label>Confirmar Senha</label>
                            <input 
                                type="password"
                                placeholder='Confirme sua senha'
                                onChange={(event) => setPasswordConfirm(event.target.value)}
                            />
                        </div>


                        <button 
                            className='confirm-button'
                            onClick={handleConfirm}
                        >Confirmar</button>

                        <p>{error}</p>

                        <div className='confirmacao-login'>
                            <h2>{confirm}</h2>
                        </div>
                        
                    </div>

            </div>

        </>
    )
}