import './Login.css'
import { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { TbLock } from 'react-icons/tb' 

export function Login () {

    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')

    const [confirmedUser, setConfirmedUser] = useState('')
    const [confirmedPassword, setConfirmedPassword] = useState('')

    function handleConfirm() {
        setConfirmedUser(user)
        setConfirmedPassword(password)
    }

    return (
        <>
            <div className="login-content">
            <h1>Login</h1>

                <div className="login-container">
                    
                    <div className='user-login'>
                        <FaUser/>
                        <label>Usuário</label>
                        <input 
                            type="text"
                            onChange={(event) => setUser(event.target.value)}
                        />
                    </div>


                    <div className='password-login'>
                        <TbLock/>
                        <label>Senha</label>
                        <input 
                            type="password"
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>


                        <button 
                            className='confirm-button'
                            onClick={handleConfirm}
                        >Confirmar</button>

                    <p>Usuário: {confirmedUser}</p>
                    <p>Senha: {confirmedPassword}</p>
                    
                </div>
            </div>
        </>
    )
}