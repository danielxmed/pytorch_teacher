import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { ModulePage } from './pages/ModulePage'
import { CurriculumPage } from './pages/CurriculumPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="curriculum" element={<CurriculumPage />} />
        <Route path="module/:moduleId" element={<ModulePage />} />
      </Route>
    </Routes>
  )
}

export default App
