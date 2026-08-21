import { Home } from './pages/Home'
import { Admin } from './pages/Admin'
import { Agendamento } from './pages/Agendamento'
import { Login } from './pages/Login'
import { Cadastro } from './pages/Cadastro'
import { Recuperar } from './pages/RecuperarSenha'
import { MeusAgendamentos } from './pages/MeusAgendamentos'
import { NotFound } from './pages/NotFound'
import { Route, Routes } from 'react-router-dom'
import { UserProvider } from './context/UserContext'

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />}/>
        <Route path='/recovery' element={<Recuperar />} />
        <Route path='/meusAgendamentos' element={<MeusAgendamentos />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </UserProvider>
  )
}

export default App