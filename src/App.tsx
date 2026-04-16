import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ClinicPage from './pages/ClinicPage'
import ExportPage from './pages/ExportPage'
import CarModelPage from './pages/CarModelPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/clinic" element={<ClinicPage />} />
      <Route path="/export" element={<ExportPage />} />
      <Route path="/car-model" element={<CarModelPage />} />
    </Routes>
  )
}

export default App
