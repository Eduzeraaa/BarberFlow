import { useState, useEffect } from 'react'
import { Header } from "../components/RoutesHeader/RoutesHeader"
import { apiFetch } from "../config/apiFetch"
import './Admin.css'
import { useNavigate } from 'react-router-dom'
import { MdCancel } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { useUser } from '../context/UserContext'
import { dataDeHoje } from '../utils/data'

export type Barbeiro = {
    _id: string
    barber: string
}

export type Servico = {
    _id: string
    service: string
}

export interface Appointment {
    _id: string,
    user: string,
    phone: string,
    service: string,
    barber: string,
    date: string,
    time: string,
    status?: boolean,
}

export function Admin () {

    const { user, loading: loadingUser } = useUser()

    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [confirm, setConfirm] = useState('')
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
    const [filterBarber, setFilterBarber] = useState('')
    const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([])
    const [servicos, setServicos] = useState<Servico[]>([])

    const [modalGerencia, setModalGerencia] = useState(false)
    const [excluirAdminOpen, setExcluirAdminOpen] = useState(false)
    const [excluirServicoOpen, setExcluirServicoOpen] = useState(false)
    const [novoAdminNome, setNovoAdminNome] = useState('')
    const [novoAdminTelefone, setNovoAdminTelefone] = useState('')
    const [criarAdminMsg, setCriarAdminMsg] = useState('')
    const [criarAdminDeuCerto, setCriarAdminDeuCerto] = useState(false)
    const [criandoAdmin, setCriandoAdmin] = useState(false)
    const [barberToDeactivated, setBarberToBeDeactivated] = useState('')
    const [serviceToDeactivated, setServiceToBeDeactivated] = useState('')
    const [desativarMsg, setDesativarMsg] = useState('')
    const [desativarDeuCerto, setDesativarDeuCerto] = useState(false)
    const [desativando, setDesativando] = useState(false)

    const [abaAtiva, setAbaAtiva] = useState<'barbeiro' | 'servico'>('barbeiro')

    const [novoServicoNome, setNovoServicoNome] = useState('')
    const [criarServicoMsg, setCriarServicoMsg] = useState('')
    const [criarServicoDeuCerto, setCriarServicoDeuCerto] = useState(false)
    const [criandoServico, setCriandoServico] = useState(false)


    const redirect = useNavigate()

    const userRole = String(user?.role)

    const adminRoles:string[] = ['admin', 'dev']
        
    useEffect(() => {

        if (loadingUser) {
            return
        }

        if (user === null){
            redirect('/login')
        }

        if (user !== null && !adminRoles.includes(userRole)){
            redirect('/agendamento')
        }

    }, [user, userRole, loadingUser, redirect])

    const filteredAppointments = filterBarber
        ? appointments.filter(apt => apt.barber === filterBarber)
        : appointments

    const hoje = dataDeHoje()

    const proximos = filteredAppointments
        .filter((app) => app.date >= hoje)
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))

    const anteriores = filteredAppointments
        .filter((app) => app.date < hoje)
        .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))

    async function handleCriarAdmin() {

        setCriandoAdmin(true)

        const { ok, data } = await apiFetch('/criarBarber', {
            method: 'POST',
            body: JSON.stringify({
                user: novoAdminNome,
                phone: novoAdminTelefone
            })
        })

        setCriandoAdmin(false)

        setCriarAdminDeuCerto(ok)
        setCriarAdminMsg(data.message)

        if (ok) {
            setNovoAdminNome('')
            setNovoAdminTelefone('')
        }

    }

    async function handleCriarServico() {

        setCriandoServico(true)

        const { ok, data } = await apiFetch('/criarServico', {
            method: 'POST',
            body: JSON.stringify({service: novoServicoNome})
        })

        setCriandoServico(false)

        setCriarServicoDeuCerto(ok)
        setCriarServicoMsg(data.message)

        if (ok) {
            setNovoServicoNome('')
        }

    }


    async function handleExcluirServico() {

        if (!serviceToDeactivated) {
            setDesativarDeuCerto(false)
            setDesativarMsg('Escolha um serviço para desativar.')
            return
        }

        setDesativando(true)

        const { ok, data } = await apiFetch('/excluirServico', {
            method: 'POST',
            body: JSON.stringify({ service: serviceToDeactivated })
        })

        setDesativando(false)

        setDesativarDeuCerto(ok)
        setDesativarMsg(data.message)

        if (ok) {
            setServicos((lista) => lista.filter((item) => item.service !== serviceToDeactivated))
            setServiceToBeDeactivated('')
        }

    }

    async function handleExcluirBarbeiro() {

        if (!barberToDeactivated) {
            setDesativarDeuCerto(false)
            setDesativarMsg('Escolha um barbeiro para desativar.')
            return
        }

        setDesativando(true)

        const { ok, data } = await apiFetch('/excluirBarber', {
            method: 'POST',
            body: JSON.stringify({ barber: barberToDeactivated })
        })

        setDesativando(false)

        setDesativarDeuCerto(ok)
        setDesativarMsg(data.message)

        if (ok) {
            setBarbeiros((lista) => lista.filter((item) => item.barber !== barberToDeactivated))
            setBarberToBeDeactivated('')
        }

    }


    function fecharDesativar() {
        setExcluirAdminOpen(false)
        setExcluirServicoOpen(false)
        setBarberToBeDeactivated('')
        setServiceToBeDeactivated('')
        setDesativarMsg('')
    }

    function fecharCriarAlgo() {
        setModalGerencia(false)
        setCriarAdminMsg('')
        setNovoAdminNome('')
        setNovoAdminTelefone('')
        setCriarServicoMsg('')
        setNovoServicoNome('')
        fecharDesativar()
    }


    async function loadAppointments() {

        setLoading(true)

        const { ok, data } = await apiFetch<Appointment[]>('/buscarAgendamentos')

        if (ok) {
            setAppointments(data)
        } else {
            setConfirm((data as any).message)
        }

        setLoading(false)

    }

    async function handleConfirm(id: string) {

        const { data } = await apiFetch('/cancelarAgendamento', {
            method: 'POST',
            body: JSON.stringify({ id })
        })

        setConfirm(data.message)

        setModalOpen(false)

        await loadAppointments()

    }

    useEffect(() => {
    
            async function allTheBarbers() {
            
                const { ok, data } = await apiFetch<Barbeiro[]>('/barbeiros')
    
                if (ok) {
                    setBarbeiros(data)
                }
    
            }
    
            allTheBarbers()
    
        }, [])
    
        useEffect(() => {
    
            async function allTheServices() {
                
                const { ok, data } = await apiFetch<Servico[]>('/servicos')
    
                if (ok){
                    setServicos(data)
                }
            }
    
            allTheServices()
    
        }, [])





        // =============================================================================================================================
        // =========================================================== FRONT ===========================================================
        // =============================================================================================================================

    return (
        <>
            
            <Header />

            <div className="header-admin">

                <h1>Agendamentos</h1>

                <div className="controls-admin">
                    <button
                        className='button-load-appointments'
                        onClick={loadAppointments}
                    >
                        {loading ? 'Carregando...' : 'Carregar Agendamentos'}
                    </button>

                    <select
                        className='filter-barbeiro'
                        value={filterBarber}
                        onChange={(e) => setFilterBarber(e.target.value)}
                    >
                        <option value="">Todos os barbeiros</option>
                        {barbeiros.map (barbeiro => (
                            <option 
                                key={barbeiro._id}
                                value={barbeiro.barber}
                            >{barbeiro.barber}</option>
                        ))}
                    </select>

                    <button
                        className='button-novo-admin'
                        onClick={() => setModalGerencia(true)}
                    >
                        <IoMdAddCircle />
                    </button>
                </div>

            </div>

            <div className="content-admin">

                {proximos.length > 0 && (
                    <>
                        <h2 className='subtitulo-admin'>Próximos</h2>

                        <table className='tabela tabela-proximos'>

                            <thead className='titulo-coluna'>

                                <tr>
                                    <th>Cliente</th>
                                    <th>Serviço</th>
                                    <th>Barbeiro</th>
                                    <th>Data</th>
                                    <th>Horário</th>
                                    <th>Telefone</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>

                            </thead>

                            <tbody>

                                {proximos.map((appointment) => (

                                    <tr key={appointment._id}>

                                        <td>{appointment.user}</td>
                                        <td>{appointment.service}</td>
                                        <td>{appointment.barber}</td>
                                        <td>{appointment.date}</td>
                                        <td>{appointment.time}</td>
                                        <td>{appointment.phone}</td>
                                        <td>{appointment.status === true ? 'Agendado' : 'Cancelado'}</td>

                                        <td>

                                            {appointment.status === true && appointment.barber === user?.user || appointment.status === true && user?.role === 'dev' &&(
                                                <button
                                                    className='botao-cancelamento'
                                                    title='Cancelar agendamento'
                                                    onClick={() => {
                                                        setSelectedAppointment(appointment)
                                                        setModalOpen(true)
                                                    }}
                                                >
                                                    <MdCancel />
                                                </button>
                                            )}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>
                    </>
                )}

                {/* ========== agendamentos passados ========== */}

                {anteriores.length > 0 && (
                    <>
                        <h2 className='subtitulo-admin'>Anteriores</h2>

                        <table className='tabela tabela-anteriores'>

                            <thead className='titulo-coluna'>

                                <tr>
                                    <th>Cliente</th>
                                    <th>Serviço</th>
                                    <th>Barbeiro</th>
                                    <th>Data</th>
                                    <th>Horário</th>
                                    <th>Telefone</th>
                                    <th>Status</th>
                                </tr>

                            </thead>

                            <tbody>

                                {anteriores.map((appointment) => (

                                    <tr key={appointment._id}>

                                        <td>{appointment.user}</td>
                                        <td>{appointment.service}</td>
                                        <td>{appointment.barber}</td>
                                        <td>{appointment.date}</td>
                                        <td>{appointment.time}</td>
                                        <td>{appointment.phone}</td>
                                        <td>{appointment.status === true ? 'Realizado' : 'Cancelado'}</td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>
                    </>
                )}

                {modalOpen && (

                    <div className="cancelamento-modal">

                        <p>Você realmente deseja cancelar esse horário?</p>
            
                        <button
                            className="confirmar-cancelamento"
                            onClick={() => {

                                if (selectedAppointment) {

                                    handleConfirm(selectedAppointment._id)

                                }

                            }}
                        >
                            Sim
                        </button>
            
                        <button
                            className="cancelar-cancelamento"
                            onClick={() => {
                                setModalOpen(false)
                                setSelectedAppointment(null)
                            }}
                        >
                            Não
                        </button>
            
                    </div>

                )}

                {modalGerencia && (

                    <div className="criar-admin-modal">


                        <div className='abas-modal'>
                            <button
                                className={abaAtiva === 'barbeiro' ? 'aba ativa' : 'aba'}
                                onClick={() => setAbaAtiva('barbeiro')}
                            >
                                Barbeiro
                            </button>
                            <button
                                className={abaAtiva === 'servico' ? 'aba ativa' : 'aba'}
                                onClick={() => setAbaAtiva('servico')}
                            >
                                Serviço
                            </button>
                        </div>

                        <div className='corpo-modal'>

                            {abaAtiva === 'barbeiro' && (
                                <>
                                    <h2 className='titulo-secao'>Criar novo barbeiro</h2>

                                    <div className='campo-novo-admin'>
                                        <label>Nome</label>
                                        <input
                                            type="text"
                                            placeholder='Nome do barbeiro'
                                            value={novoAdminNome}
                                            onChange={(event) => setNovoAdminNome(event.target.value)}
                                        />
                                    </div>

                                    <div className='campo-novo-admin'>
                                        <label>Telefone</label>
                                        <input
                                            type="text"
                                            placeholder='Telefone para contato'
                                            value={novoAdminTelefone}
                                            onChange={(event) => setNovoAdminTelefone(event.target.value)}
                                        />
                                    </div>

                                    <p className='aviso-novo-admin'>
                                        A senha não é definida aqui. Depois de criar, peça para
                                        que ele entre em "Esqueci a senha" e defina a dele.
                                    </p>

                                    {criarAdminMsg && (
                                        <p className={criarAdminDeuCerto ? 'resultado-novo-admin sucesso' : 'resultado-novo-admin erro'}>
                                            {criarAdminMsg}
                                        </p>
                                    )}

                                    <button
                                        className="confirmar-novo-admin"
                                        onClick={handleCriarAdmin}
                                        disabled={criandoAdmin}
                                    >
                                        {criandoAdmin ? 'Criando...' : 'Criar barbeiro'}
                                    </button>

                                    <button
                                        className='botao-desativar'
                                        onClick={() => setExcluirAdminOpen(true)}
                                    >
                                        Desativar barbeiro
                                    </button>

                                </>
                            )}

                            {abaAtiva === 'servico' && (
                                <>
                                    <h2 className='titulo-secao'>Criar novo serviço</h2>

                                    <div className='campo-novo-servico'>
                                        <label>Nome do Serviço</label>
                                        <input
                                            type="text"
                                            placeholder='Nome do serviço'
                                            value={novoServicoNome}
                                            onChange={(event) => setNovoServicoNome(event.target.value)}
                                        />
                                    </div>

                                    <p className='aviso-novo-servico'>
                                        O serviço será automaticamente adicionado aos agendamentos. Confira se tudo está certo antes de confirmar.
                                    </p>

                                    {criarServicoMsg && (
                                        <p className={criarServicoDeuCerto ? 'resultado-novo-servico sucesso' : 'resultado-novo-servico erro'}>
                                            {criarServicoMsg}
                                        </p>
                                    )}

                                    <button
                                        className="confirmar-novo-admin"
                                        onClick={handleCriarServico}
                                        disabled={criandoServico}
                                    >
                                        {criandoServico ? 'Criando...' : 'Criar serviço'}
                                    </button>

                                    <button
                                        className='botao-desativar'
                                        onClick={() => setExcluirServicoOpen(true)}
                                    >
                                        Desativar serviço
                                    </button>

                                </>
                            )}

                            <button
                                className="cancelar-cancelamento"
                                onClick={fecharCriarAlgo}
                            >
                                Fechar
                            </button>

                        </div>

                    </div>

                )}

                {excluirAdminOpen && (

                    <div className="desativar-modal">

                        <h2 className='titulo-desativar'>Desativar barbeiro</h2>

                        <p className='aviso-desativar'>
                            O barbeiro deixa de aparecer para os clientes, todos os horários dele são cancelados,
                            mas os agendamentos antigos continuam com ele no histórico.
                        </p>

                        <select
                            className='select-desativar'
                            value={barberToDeactivated}
                            onChange={(event) => setBarberToBeDeactivated(event.target.value)}
                        >
                            <option value="">Escolha um barbeiro:</option>
                            {barbeiros.map(barbeiro => (
                                <option
                                    key={barbeiro._id}
                                    value={barbeiro.barber}
                                >{barbeiro.barber}</option>
                            ))}
                        </select>

                        {desativarMsg && (
                            <p className={desativarDeuCerto ? 'resultado-desativar sucesso' : 'resultado-desativar erro'}>
                                {desativarMsg}
                            </p>
                        )}

                        <button
                            className="confirmar-cancelamento"
                            onClick={handleExcluirBarbeiro}
                            disabled={desativando}
                        >
                            {desativando ? 'Desativando...' : 'Desativar barbeiro'}
                        </button>

                        <button
                            className="cancelar-cancelamento"
                            onClick={fecharDesativar}
                        >
                            Cancelar
                        </button>

                    </div>

                )}

                {excluirServicoOpen && (

                    <div className="desativar-modal">

                        <h2 className='titulo-desativar'>Desativar serviço</h2>

                        <p className='aviso-desativar'>
                            O serviço deixa de aparecer para os clientes, mas os
                            agendamentos antigos continuam com ele no histórico.
                        </p>

                        <select
                            className='select-desativar'
                            value={serviceToDeactivated}
                            onChange={(event) => setServiceToBeDeactivated(event.target.value)}
                        >
                            <option value="">Escolha um serviço:</option>
                            {servicos.map(servico => (
                                <option
                                    key={servico._id}
                                    value={servico.service}
                                >{servico.service}</option>
                            ))}
                        </select>

                        {desativarMsg && (
                            <p className={desativarDeuCerto ? 'resultado-desativar sucesso' : 'resultado-desativar erro'}>
                                {desativarMsg}
                            </p>
                        )}

                        <button
                            className="confirmar-cancelamento"
                            onClick={handleExcluirServico}
                            disabled={desativando}
                        >
                            {desativando ? 'Desativando...' : 'Desativar serviço'}
                        </button>

                        <button
                            className="cancelar-cancelamento"
                            onClick={fecharDesativar}
                        >
                            Cancelar
                        </button>

                    </div>

                )}

                    <p className='confirmacao-cancelamento'>{confirm}</p>

            </div>

        </>
    )
}