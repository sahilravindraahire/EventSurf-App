import Navbar from "./components/Navbar"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Home from "./pages/Home"
import Register from "./pages/Register"
import EventDetail from "./pages/EventDetail"
import Login from "./pages/Login"
import AdminDashboard from "./pages/AdminDashboard"
import PaymentFailed from "./pages/PaymentFailed"
import PaymentSuccess from "./pages/PaymentSuccess"
import UserDashboard from "./pages/UserDashboard"

function App() {
  

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar/>
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/events/:id" element={<EventDetail/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/admin" element={<AdminDashboard/>}/>
            <Route path="/payment-failed" element={<PaymentFailed/>}/>
            <Route path="/dashboard" element={<UserDashboard/>}/>
            <Route path="/payment-success" element={<PaymentSuccess/>}/>
            <Route path="*" element={<h1 className="text-3xl font-bold text-center mt-20">404.... Page Not Found</h1>}/>
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
