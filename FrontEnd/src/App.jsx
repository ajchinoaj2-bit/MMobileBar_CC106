import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OwnerLayout from './layouts/OwnerLayout';
import Dashboard from './pages/owner/Dashboard';
import Bookings from './pages/owner/Bookings';
import Package from './pages/owner/Package';
import Login from './pages/Login';
import Clients from './pages/owner/Clients';
import Payments from './pages/owner/Payments';
import BookingHistory from './pages/owner/BookingHistory';
import Calendar from './pages/owner/Calendar';
import BookingDetails from './pages/owner/BookingDetails';
import ClientSignup from './pages/client/Signup';
import ClientLayout from './layouts/ClientLayout';
import ClientDashboard from './pages/client/Dashboard';
import ClientPackage from './pages/client/Package';
import BookingForm from './pages/client/BookingForm';
import BookingConfirmation from './pages/client/BookingConfirmation';
import CBookingHistory from './pages/client/CBookingHistory';
import CBookingDetails from './pages/client/CBookingDetails';
import ClientMessages from './pages/client/Messages';

import ProtectedRoute from './components/shared/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter basename="/MMobileBar_CC106/">
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="owner"
          element={
            <ProtectedRoute role="owner">
              <OwnerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="package" element={<Package />} />
          <Route path="clients" element={<Clients />} />
          <Route path="payments" element={<Payments />} />
          <Route path="bookings/history" element={<BookingHistory />} />
          <Route path="bookings/calendar" element={<Calendar />} />
          <Route path="bookings/:id" element={<BookingDetails />} />
        </Route>

        <Route path="/client/signup" element={<ClientSignup />} />

        <Route
          path="/client"
          element={
            <ProtectedRoute role="client">
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="package" element={<ClientPackage />} />
          <Route path="booking-form" element={<BookingForm />} />
          <Route path="booking-confirmation" element={<BookingConfirmation />} />
          <Route path="booking-history" element={<CBookingHistory />} />
          <Route path="booking-history/:id" element={<CBookingDetails />} />
          <Route path="messages" element={<ClientMessages />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}