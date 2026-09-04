import { Outlet, useLocation } from 'react-router-dom';
import ClientSidebar from '../components/shared/ClientSidebar';
import TopBar from '../components/shared/TopBar';

const pageTitles = {
  '/client/dashboard': { title: 'Welcome back, Client', subtitle: 'Here is an overview of your bookings and available packages.' },
  '/client/package': { title: 'Available Packages', subtitle: 'Choose the perfect bar package for your event.' },
  '/client/package-customize': { title: 'Customize Your Experience', subtitle: 'Tailor your package to fit your event needs.' },
  '/client/booking-form': { title: 'Book Your Event', subtitle: 'Fill in your event details below.' },
  '/client/booking-confirmation': { title: 'Booking Confirmation', subtitle: 'Please review your booking details before proceeding to payment.' },
  '/client/payment': { title: 'Payment', subtitle: '' },
  '/client/booking-history': { title: 'Booking History', subtitle: 'Track the status of your upcoming and past events.' },
};

export default function ClientLayout() {
  const location = useLocation();
  const current = pageTitles[location.pathname] || {};

  return (
    <div className="flex">
      <ClientSidebar />
      <div className="ml-60 flex-1 min-h-screen bg-gray-50">
        <TopBar title={current.title} subtitle={current.subtitle} />
        <main className="px-6 pb-6 pt-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}