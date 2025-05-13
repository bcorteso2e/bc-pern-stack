import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { useAuthContext } from './context/AuthContext'

function App() {

  const {authUser, setAuthUser, isLoading} = useAuthContext()
  console.log("Auth User:", authUser)


  if (isLoading) return <div className="flex items-center justify-center min-h-screen bg-base-200">Loading...</div>

  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300">
      <Navbar />
      <Routes>
        <Route path="/" element={ authUser ? <HomePage /> : <Navigate to={"/login"} />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/signup" element={ !authUser ? <SignUp /> : <Navigate to={"/"} /> } />
        <Route path="/login" element={ !authUser ? <Login /> : <Navigate to={"/"} />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
