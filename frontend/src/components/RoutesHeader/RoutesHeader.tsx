import './RoutesHeader.css'
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

export function Header() {

    const redirect = useNavigate()

    return (

        <div className='total-header'>

            <header className='header'>

                <img className='logo' src="https://cdn-icons-png.flaticon.com/512/7338/7338646.png" alt="Logo" />

                <h1 className='title'>Barber Flow</h1>

                <button
                    className='logout'
                    onClick={() => {
                    localStorage.removeItem('currentUser')
                    redirect('/login')
                    }}
                > <FiLogOut /></button>

            </header>

        </div>

    )

}