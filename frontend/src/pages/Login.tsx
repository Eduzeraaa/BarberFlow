import './Login.css'
import { useState } from 'react'

export function Login () {

    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')


    return (
        <>
            <div className="login-content">
            <h1 className="header-login">Login</h1>

                <div className="login-container">
                    
                    <div className='user'>
                        <label>Usuário</label>
                        <input 
                            type="text"
                            onChange={(event) => setUser(event.target.value)}
                        />
                    </div>


                    <div className='password'>
                        <label>Senha</label>
                        <input 
                            type="password"
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>


                        <button className='confirm-button'>Confirmar</button>

                    <p>Usuário: {user}</p>
                    <p>Senha: {password}</p>
                    
                </div>
            </div>
        </>
    )
}