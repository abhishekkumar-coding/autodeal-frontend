
import './App.css'
import CarList from './pages/CarList'
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Admin from './pages/Admin'

function App() {

  return (
    <Router>
      <div className="p-4 border-b mb-4">
        {/* Navigation */}
        <Link to="/cars" className="mr-4 text-blue-600">Car List</Link>
        <Link to="/admin" className="text-blue-600">Admin Page</Link>
      </div>

      <Routes>
        <Route path="/cars" element={<CarList />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<CarList />} /> 
      </Routes>
    </Router>
  )
}

export default App
