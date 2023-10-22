import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import AddReservation from './pages/AddReservation';
import EditReservation from './pages/EditReservation';
import NoPage from './pages/NoPage';
import { ReservationProvider } from './store/ReservationContext';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ReservationProvider>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="addReservation" element={<AddReservation />} />
            <Route path="editReservation/:id" element={<EditReservation />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </ReservationProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
