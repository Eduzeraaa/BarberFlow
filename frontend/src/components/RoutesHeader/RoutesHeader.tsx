import './RoutesHeader.css'
import { Menu } from '../Modal/Menu'

export function Header() {


    return (

        <div className='total-header'>

            <header className='header'>

                <img className='logo' src="https://cdn-icons-png.flaticon.com/512/7338/7338646.png" alt="Logo" />

                <h1 className='title'>Barber Flow</h1>

                <Menu />

            </header>

        </div>

    )

}