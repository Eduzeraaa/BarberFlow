import './RecuperarSenha.css'
import { Header } from '../components/RoutesHeader/RoutesHeader'
import { FaPhoneAlt } from "react-icons/fa"
import { TbLock } from 'react-icons/tb'
import { useState } from 'react'
import { apiUrl } from '../config/api'
import { useNavigate } from 'react-router-dom'
import { MdOutlineTextsms } from "react-icons/md";

export function Recuperar() {
    const [postValidation, setPostValidation] = useState(false)
    const [phone, setPhone] = useState('')
    const [code, setCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const redirect = useNavigate()
    const temMuitasTentativas = message.includes('muitas tentativas')

    async function handleRequestCode() {
        if (!phone) {
            setMessage('Informe seu telefone')
            return
        }

        const response = await fetch(`${apiUrl}/recovery/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone })
        })

        const data = await response.json()

        if (data.success) {
            setMessage('Código enviado! Verifique seu SMS')
            setPostValidation(true)
        } else {
            setMessage(data.message)
        }
    }

    async function handleResetPassword() {
        if (!code || !newPassword || !confirmPassword) {
            setMessage('Preencha todos os campos')
            return
        }

        if (newPassword.length < 8){
            setMessage('Sua senha tem menos que 8 caracteres.')
            return
        }

        const response = await fetch(`${apiUrl}/recovery/reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                phone, 
                code, 
                newPassword,
                confirmNewPassword: confirmPassword
            })
        })

        const data = await response.json()
        setMessage(data.message)

        if (data.success) {
            setPostValidation(false)
            setPhone('')
            setCode('')
            setNewPassword('')
            setConfirmPassword('')
            redirect('/login')
        }
    }

    return (
        <>
            <div className='recovery-content'>
                <Header />

                <div className='recovery-header'>
                    <h1>Recuperar Senha</h1>
                </div>

                <div className='recovery-container'>
                    {!postValidation ? (
                        <>
                            <div className='telefone-recovery'>
                                <FaPhoneAlt />
                                <label>Telefone</label>
                                <input 
                                    className='user-number-recovery'
                                    type="text"
                                    placeholder='Insira seu telefone'
                                    value={phone}
                                    onChange={(event) => setPhone(event.target.value)}
                                />
                            </div>

                            <button onClick={handleRequestCode}>Solicitar Código</button>
                        </>
                    ) : (
                        <>
                            <div className='code-recovery'>
                                <MdOutlineTextsms />
                                <label>Código SMS</label>
                                <input 
                                    type="text"
                                    placeholder='Código recebido por SMS'
                                    value={code}
                                    onChange={(event) => setCode(event.target.value)}
                                />
                            </div>

                            <div className='password-recovery'>
                                <TbLock />
                                <label>Nova Senha</label>
                                <input 
                                    type="password"
                                    placeholder='Mínimo 8 caracteres'
                                    value={newPassword}
                                    onChange={(event) => setNewPassword(event.target.value)}
                                />
                            </div>

                            <div className='password-confirm-recovery'>
                                <TbLock />
                                <label>Confirmar Senha</label>
                                <input 
                                    type="password"
                                    placeholder='Confirme sua senha'
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                />
                            </div>

                            <button onClick={temMuitasTentativas ? handleRequestCode : handleResetPassword}>
                                {temMuitasTentativas ? 'Pedir novo código' : 'Resetar Senha'}
                            </button>
                        </>
                    )}

                    <p className='recovery-message'>{message}</p>
                </div>
            </div>
        </>
    )
}