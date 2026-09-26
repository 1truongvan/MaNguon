// src/App.tsx
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/routes.js';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
export default App;
