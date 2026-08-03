import './Cadastro.css'
import { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { TbLock } from 'react-icons/tb' 

export function Cadastro () {

    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const [confirmedUser, setConfirmedUser] = useState('')
    const [confirmedPassword, setConfirmedPassword] = useState('')
    const [confirmedPasswordConfirm, setConfirmedPasswordConfirm] = useState('')

    const [error, setError] = useState('')

    function handleConfirm() {
        if (password.length < 8){
            setError('Sua senha contém menos que 8 caracteres.')
            return // fim da funçao
        }
        
        if (password !== passwordConfirm) {
            setError('Senhas diferentes!')
            return // fim da funçao
        }

        setError('')
        setConfirmedUser(user)
        setConfirmedPassword(password)
        setConfirmedPasswordConfirm(passwordConfirm)
    }

    return (
        <>
            <div className="cadastro-content">
            <h1>Cadastro</h1>

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
                        <p>Usuário: {confirmedUser}</p>
                        <p>Senha: {confirmedPassword}</p>
                        <p>Senha confirmada: {confirmedPasswordConfirm}</p>
                    
                </div>
            </div>
        </>
    )
}