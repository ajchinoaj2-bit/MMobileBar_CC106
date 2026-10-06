import { useState } from 'react';
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

function getPageInfo(pathname) {
  if (/^\/owner\/bookings\/\d+$/.test(pathname)) {
    return { title: 'Booking Details', subtitle: 'Review client info, event details, and payment status.' };
  }
  return pageTitles[pathname] || {};
}

export default function OwnerLayout() {
  const location = useLocation();
  const current = getPageInfo(location.pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-h-screen bg-ivory-50 md:ml-60">
        <TopBar title={current.title} subtitle={current.subtitle} onMenuClick={() => setSidebarOpen(true)} />
        <main className="px-4 md:px-6 pb-6 pt-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}