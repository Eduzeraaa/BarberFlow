import './Menu.css'
import { useState } from 'react'
import { FiMenu, FiLogOut } from 'react-icons/fi'
import { RiCalendarScheduleFill } from 'react-icons/ri'
import { MdAdminPanelSettings } from 'react-icons/md'
import { FaCalendarDay } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom'
import { apiUrl } from '../../config/api'
import { useUser } from '../../context/UserContext'

export function Menu() {

    const { refreshUser } = useUser()

    const [modalOpen, setModalOpen] = useState(false)

    const redirect = useNavigate()
    const location = useLocation()

    const isAuthPage = location.pathname === '/login' || location.pathname === '/cadastro'

    if (isAuthPage) {
        return null
    }

    async function handleLogout() {
        await fetch(`${apiUrl}/logout`, {
            method: 'POST',
            credentials: 'include'
        })
        await refreshUser()
        redirect('/login')
    }

    return (

        <div className="menu-container">

            <button
                className="menu-button"
                onClick={() => setModalOpen(!modalOpen)}
            ><FiMenu /></button>

            {modalOpen && (
                <div className="side-modal">

                    <button
                        className="logout"
                        onClick={handleLogout}
                    >Logout <FiLogOut /></button>

                    {location.pathname !== '/meusAgendamentos' && (
                        <button
                            className='alternativa'
                            onClick={() => redirect('/meusAgendamentos')}
                        >Meus Horários<FaCalendarDay /></button>
                    )}

                    {(location.pathname === '/admin' || location.pathname === '/meusAgendamentos') && (
                        <button
                            className="alternativa"
                            onClick={() => redirect('/agendamento')}
                        >Agendamento <RiCalendarScheduleFill /></button>
                    )}

                    {location.pathname === '/agendamento' && (
                        <button
                            className="alternativa"
                            onClick={() => redirect('/admin')}
                        >Admin <MdAdminPanelSettings /></button>
                    )}

                </div>
            )}

        </div>

    )
}