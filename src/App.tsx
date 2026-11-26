import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from './components/MainLayout.tsx'
import { AppProvider } from './context/AppContext.tsx'
import { AboutPage } from './pages/AboutPage.tsx'
import { CatalogPage } from './pages/CatalogPage.tsx'
import { DetailPage } from './pages/DetailPage.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { NotFoundPage } from './pages/NotFoundPage.tsx'
import { NotesPage } from './pages/NotesPage.tsx'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="katalog" element={<CatalogPage />} />
            <Route path="katalog/:id" element={<DetailPage />} />
            <Route path="catatan" element={<NotesPage />} />
            <Route path="tentang" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
