import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ClinicPage from './pages/ClinicPage'
import ExportPage from './pages/ExportPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/clinic" element={<ClinicPage />} />
      <Route path="/export" element={<ExportPage />} />
    </Routes>
  )
}

export default App
