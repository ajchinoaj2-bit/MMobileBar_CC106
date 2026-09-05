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
import ClientLogin from './pages/client/Login';
import ClientSignup from './pages/client/Signup';
import ClientLayout from './layouts/ClientLayout';
import ClientDashboard from './pages/client/Dashboard';
import ClientPackage from './pages/client/Package';
import PackageCustomize from './pages/client/PackageCustomize';
import BookingForm from './pages/client/BookingForm';
import BookingConfirmation from './pages/client/BookingConfirmation';
import Payment from './pages/client/Payment';
import CBookingHistory from './pages/client/CBookingHistory';
import ClientMessages from './pages/client/Messages';

export default function App() {
  return (
    <BrowserRouter basename="/MMobileBar_CC106/">
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="owner" element={<OwnerLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="package" element={<Package />} />
          <Route path="clients" element={<Clients />} />
          <Route path="payments" element={<Payments />} />
          <Route path="bookings/history" element={<BookingHistory />} />
          <Route path="bookings/calendar" element={<Calendar />} />
          <Route path="bookings/:id" element={<BookingDetails />} />
        </Route>

        <Route path="/client/login" element={<ClientLogin />} />
        <Route path="/client/signup" element={<ClientSignup />} />


        <Route path="/client" element={<ClientLayout />}>
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="package" element={<ClientPackage />} />
          <Route path="package-customize" element={<PackageCustomize />} />
          <Route path="booking-form" element={<BookingForm />} />
          <Route path="booking-confirmation" element={<BookingConfirmation />} />
          <Route path="payment" element={<Payment />} />
          <Route path="booking-history" element={<CBookingHistory />} />
          <Route path="messages" element={<ClientMessages />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

