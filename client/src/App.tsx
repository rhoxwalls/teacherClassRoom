import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import {theme} from './themeMui.js';
import  PublicLayout  from './pages/public/PublicLayout.js';
import Service from './pages/public/Service.js';

function App() {
  return (
    <ThemeProvider theme={theme}>
       <CssBaseline /> {/* Normaliza CSS para todos los navegadores */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Navigate to="/service" />} />
            <Route path="service" element={<Service />} />
            <Route path="teacher" element={<div>Perfil Maestra (Próximamente)</div>} />
            <Route path="classRoom" element={<div>Quizzes y Flashcards (Próximamente)</div>} />
            </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
