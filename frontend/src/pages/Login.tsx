import './Login.css'
import { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { TbLock } from 'react-icons/tb' 

export function Login () {

    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')

    
    async function handleConfirm() {
        
        const response = await fetch('http://localhost:3000/login', {
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

        localStorage.setItem('currentUser', data.user) // localStorage é uma memória do navegador que guarda dados mesmo depois que a página é recarregada
        
        alert(data.message)
        
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
                    
                </div>
            </div>
        </>
    )
}