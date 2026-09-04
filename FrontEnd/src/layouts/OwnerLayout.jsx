import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import TopBar from '../components/shared/TopBar';

const pageTitles = {
  '/owner/dashboard': { title: 'Dashboard Overview', subtitle: "Welcome back. Here's the current status of your mobile bar operations." },
  '/owner/bookings': { title: 'Booking Management', subtitle: 'Manage and track customer bookings' },
  '/owner/bookings/calendar': { title: 'Calendar & Schedule', subtitle: 'Manage and view your approved, pending, and past event bookings.' },
  '/owner/bookings/history': { title: 'Booking History', subtitle: 'Archive of completed and cancelled events.' },
  '/owner/package': { title: 'Package Management', subtitle: 'Manage service packages, pricing, and add-ons.' },
  '/owner/clients': { title: 'Messaging & Notifications', subtitle: '' },
  '/owner/payments': { title: 'Payment Management', subtitle: 'Manage your payment methods.' },
};

export default function OwnerLayout() {
  const location = useLocation();
  const current = pageTitles[location.pathname] || {};

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-60 flex-1 min-h-screen bg-gray-50">
        <TopBar title={current.title} subtitle={current.subtitle} />
        <main className="px-6 pb-6 pt-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}