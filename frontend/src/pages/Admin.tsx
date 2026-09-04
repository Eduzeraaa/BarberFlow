import { useState, useEffect } from 'react'
import { Header } from "../components/RoutesHeader/RoutesHeader"
import { apiFetch } from "../config/apiFetch"
import './Admin.css'
import { useNavigate } from 'react-router-dom'
import { MdCancel } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { useUser } from '../context/UserContext'

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

    const [criarAdminOpen, setCriarAdminOpen] = useState(false)
    const [novoAdminNome, setNovoAdminNome] = useState('')
    const [novoAdminTelefone, setNovoAdminTelefone] = useState('')
    const [criarAdminMsg, setCriarAdminMsg] = useState('')
    const [criarAdminDeuCerto, setCriarAdminDeuCerto] = useState(false)
    const [criandoAdmin, setCriandoAdmin] = useState(false)

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

    const hoje = new Date().toISOString().split('T')[0]

    const proximos = filteredAppointments
        .filter((app) => app.date >= hoje)
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))

    const anteriores = filteredAppointments
        .filter((app) => app.date < hoje)
        .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))

    async function handleCriarAdmin() {

        setCriandoAdmin(true)

        const { ok, data } = await apiFetch('/criarAdmin', {
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

    function fecharCriarAdmin() {
        setCriarAdminOpen(false)
        setCriarAdminMsg('')
        setNovoAdminNome('')
        setNovoAdminTelefone('')
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
                        <option value="José">José</option>
                        <option value="Roberto">Roberto</option>
                        <option value="Cláudio">Cláudio</option>
                    </select>

                    <button
                        className='button-novo-admin'
                        onClick={() => setCriarAdminOpen(true)}
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

                                            {appointment.status === true && appointment.barber === user?.user &&(
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

                {criarAdminOpen && (

                    <div className="criar-admin-modal">

                        <h2>Novo administrador</h2>

                        <div className='campo-novo-admin'>
                            <label>Nome</label>
                            <input
                                type="text"
                                placeholder='Nome do administrador'
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
                            {criandoAdmin ? 'Criando...' : 'Criar'}
                        </button>

                        <button
                            className="cancelar-cancelamento"
                            onClick={fecharCriarAdmin}
                        >
                            Fechar
                        </button>

                    </div>

                )}

                    <p className='confirmacao-cancelamento'>{confirm}</p>

            </div>

        </>
    )
}