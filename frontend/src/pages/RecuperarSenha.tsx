import './RecuperarSenha.css'
import { Header } from '../components/RoutesHeader/RoutesHeader'
import { FaPhoneAlt } from "react-icons/fa"
import { TbLock } from 'react-icons/tb'
import { useState, useEffect } from 'react'
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
    const [cooldownSeconds, setCooldownSeconds] = useState(0)
    const [precisaNovoCodigo, setPrecisaNovoCodigo] = useState(false)

    const redirect = useNavigate()

    async function handleRequestCode() {
        if (!phone) {
            setMessage('Informe seu telefone')
            return
        }

        if (cooldownSeconds > 0) {
            return
        }

        const response = await fetch(`${apiUrl}/recovery/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ phone })
        })

        const data = await response.json()

        if (data.success) {
            setPrecisaNovoCodigo(false)
            setCode('')
            setPostValidation(true)
            setMessage('Código enviado! Verifique seu SMS.')
            return
        }

        // no cooldown quem explica é a linha do contador, não a mensagem
        if (data.cooldownSeconds) {
            setCooldownSeconds(data.cooldownSeconds)
            return
        }

        setMessage(data.message)
    }

    // só mexe no contador. a mensagem é assunto do servidor.
    useEffect(() => {
        if (cooldownSeconds <= 0) return

        const timer = setTimeout(() => {
            setCooldownSeconds(prev => prev - 1)
        }, 1000)

        return () => clearTimeout(timer)
    }, [cooldownSeconds])

    async function handleResetPassword() {
        if (!code || !newPassword || !confirmPassword) {
            setMessage('Preencha todos os campos')
            return
        }

        if (newPassword.length < 8) {
            setMessage('Sua senha tem menos que 8 caracteres.')
            return
        }

        const response = await fetch(`${apiUrl}/recovery/reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
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
            return
        }

        if (data.message.includes('muitas tentativas') || data.message.includes('expirou')) {
            setPrecisaNovoCodigo(true)
        }
    }

    const emCooldown = cooldownSeconds > 0

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

                            <button onClick={handleRequestCode} disabled={emCooldown}>
                                {emCooldown ? `Aguarde ${cooldownSeconds}s` : 'Solicitar Código'}
                            </button>
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
                                    disabled={precisaNovoCodigo}
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
                                    disabled={precisaNovoCodigo}
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
                                    disabled={precisaNovoCodigo}
                                />
                            </div>

                            {precisaNovoCodigo ? (
                                <button onClick={handleRequestCode} disabled={emCooldown}>
                                    {emCooldown ? `Aguarde ${cooldownSeconds}s` : 'Pedir novo código'}
                                </button>
                            ) : (
                                <button onClick={handleResetPassword}>
                                    Resetar Senha
                                </button>
                            )}
                        </>
                    )}

                    {message && <p className='recovery-message'>{message}</p>}

                    {emCooldown && (
                        <p className='recovery-cooldown'>
                            Novo código disponível em {cooldownSeconds}s
                        </p>
                    )}
                </div>
            </div>
        </>
    )
}
