import './Menu.css'
import { useState } from 'react'
import { FiMenu, FiLogOut } from 'react-icons/fi'
import { RiCalendarScheduleFill } from 'react-icons/ri'
import { MdAdminPanelSettings } from 'react-icons/md'
import { useLocation, useNavigate } from 'react-router-dom'

export function Menu() {

    const [modalOpen, setModalOpen] = useState(false)

    const redirect = useNavigate()
    const location = useLocation()

    const isAuthPage =
        location.pathname === '/login' || location.pathname === '/cadastro'


    if (isAuthPage) {
        return null
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
                        onClick={() => {
                            localStorage.removeItem('currentUser')
                            redirect('/login')
                        }}
                    >Logout <FiLogOut /></button>

                    {location.pathname === '/admin' && (
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