import './Cadastro.css'
import { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { TbLock } from 'react-icons/tb' 
import { useNavigate, Link } from 'react-router-dom'
import { apiFetch } from '../config/apiFetch'
import { Header } from '../components/RoutesHeader/RoutesHeader'
import { FaPhoneAlt } from "react-icons/fa";

export function Cadastro () {

    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [phone, setPhone] = useState('')
    const [confirm, setConfirm] = useState('')
    const [confirmDeuCerto, setConfirmDeuCerto] = useState(false)
    const [codigo, setCodigo] = useState('')
    const [etapa, setEtapa] = useState<'dados' | 'codigo'>('dados')
    const [enviando, setEnviando] = useState(false)

    const redirect = useNavigate()

    const [error, setError] = useState('')

    async function handleConfirm() {
        if (password.length < 8){
            setError('Sua senha contém menos que 8 caracteres.')
            return
        }

        else if (password !== passwordConfirm) {
            setError('Senhas diferentes!')
            return
        }

        setError('')
        setConfirm('')
        setEnviando(true)

        const { ok, data } = await apiFetch('/cadastro', {
            method: 'POST',
            body: JSON.stringify({
                user,
                password,
                phone
            })
        })

        setEnviando(false)

        setConfirmDeuCerto(ok)
        setConfirm(data.message)

        if (ok){
            setEtapa('codigo')
        }

    }

    async function handleConfirmarCodigo() {

        if (!codigo) {
            setError('Informe o código que chegou no seu WhatsApp.')
            return
        }

        setError('')
        setEnviando(true)

        const { ok, data } = await apiFetch('/cadastro/confirmar', {
            method: 'POST',
            body: JSON.stringify({
                user,
                password,
                phone,
                code: codigo
            })
        })

        setEnviando(false)

        if (ok){
            redirect('/login', {
                state: {message: data.message}
            })
            return
        }

        setConfirmDeuCerto(false)
        setConfirm(data.message)

    }

    return (
        <>
            <div className="cadastro-content">

                <Header />

                <div className='header-cadastro'>
                    <h1>Cadastro</h1>
                </div>

                    <div className="cadastro-container">

                        {etapa === 'codigo' && (
                            <>
                                <div className='codigo-cadastro'>
                                    <TbLock />
                                    <label>Código</label>
                                    <input
                                        className='codigo-input-signup'
                                        type="text"
                                        inputMode='numeric'
                                        placeholder='Código de 6 dígitos'
                                        value={codigo}
                                        onChange={(event) => setCodigo(event.target.value)}
                                    />
                                </div>

                                <button
                                    className='confirm-button'
                                    onClick={handleConfirmarCodigo}
                                    disabled={enviando}
                                >{enviando ? 'Confirmando...' : 'Confirmar código'}</button>

                                <button
                                    className='voltar-button'
                                    onClick={() => {
                                        setEtapa('dados')
                                        setCodigo('')
                                        setConfirm('')
                                        setError('')
                                    }}
                                >Corrigir meus dados</button>

                                {/* aviso, não erro: falta preencher, nada quebrou */}
                                <p className='mensagem-cadastro'>{error}</p>

                                <p className={confirmDeuCerto ? 'mensagem-cadastro sucesso' : 'mensagem-cadastro erro'}>
                                    {confirm}
                                </p>
                            </>
                        )}

                        {etapa === 'dados' && (
                        <>

                        <div className='user-cadastro'>
                            <FaUser/>
                            <label>Nome</label>
                            <input 
                                className='user-input-signup'
                                type="text"
                                placeholder='Nome'
                                onChange={(event) => setUser(event.target.value)}
                            />
                        </div>

                        <div className='telefone-cadastro'>
                            <FaPhoneAlt />
                            <label>Telefone</label>
                            <input 
                                className='user-number-signup'
                                type="text"
                                placeholder='(61) 99999-8888'
                                onChange={(event) => setPhone(event.target.value)}
                            />
                        </div>


                        <div className='password-cadastro'>
                            <TbLock/>
                            <label>Senha</label>
                            <input
                                className='password-input-signup'
                                type="password"
                                placeholder='Mínimo 8 caracteres'
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>
                        
                        <div className='password-confirm'>
                            <TbLock />
                            <label>Confirmar Senha</label>
                            <input
                                className='password-input-signup'
                                type="password"
                                placeholder='Confirme sua senha'
                                onChange={(event) => setPasswordConfirm(event.target.value)}
                            />
                        </div>

                        <div className='to-login'>
                            <Link to={'/login'}>Já tenho conta</Link>
                        </div>


                        <button
                            className='confirm-button'
                            onClick={handleConfirm}
                            disabled={enviando}
                        >{enviando ? 'Enviando código...' : 'Confirmar'}</button>

                        <p className='mensagem-cadastro erro'>{error}</p>

                        <p className={confirmDeuCerto ? 'mensagem-cadastro sucesso' : 'mensagem-cadastro erro'}>
                            {confirm}
                        </p>

                        </>
                        )}

                    </div>

            </div>

        </>
    )
}