import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWhatsApp from '../common/FloatingWhatsApp';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col animated-bg">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}