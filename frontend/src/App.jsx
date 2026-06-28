import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import { PageSkeleton } from './components/common/Skeleton';
import { fetchMe } from './store/slices/authSlice';
import { fetchSettings } from './store/slices/settingsSlice';
import { setTheme } from './store/slices/themeSlice';
import { isAdminRole } from './utils/auth';

const Home = lazy(() => import('./pages/Home'));
const EntertainmentPlans = lazy(() => import('./pages/EntertainmentPlans'));
const AIPlans = lazy(() => import('./pages/AIPlans'));
const Categories = lazy(() => import('./pages/Categories'));
const CategoryPlans = lazy(() => import('./pages/CategoryPlans'));
const PlanDetail = lazy(() => import('./pages/PlanDetail'));
const Pricing = lazy(() => import('./pages/Pricing'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Reviews = lazy(() => import('./pages/Reviews'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminPlans = lazy(() => import('./pages/admin/AdminPlans'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'));
const AdminBlogs = lazy(() => import('./pages/admin/AdminBlogs'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminSupport = lazy(() => import('./pages/admin/AdminSupport'));
const AdminNotifications = lazy(() => import('./pages/admin/AdminNotifications'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminNewsletter = lazy(() => import('./pages/admin/AdminNewsletter'));
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts'));
const AdminBackup = lazy(() => import('./pages/admin/AdminBackup'));

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');

  if (!token && !user) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, initializing } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" replace state={{ from: '/admin' }} />;
  if (initializing || (token && !user)) return <PageSkeleton />;
  if (!isAdminRole(user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppInitializer({ children }) {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    dispatch(setTheme(theme));
    dispatch(fetchSettings());
    if (localStorage.getItem('token')) {
      dispatch(fetchMe());
    }
  }, [dispatch, theme]);

  return children;
}

export default function App() {
  return (
    <AppInitializer>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="newsletter" element={<AdminNewsletter />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="backup" element={<AdminBackup />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="entertainment" element={<EntertainmentPlans />} />
            <Route path="ai-plans" element={<AIPlans />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/:slug" element={<CategoryPlans />} />
            <Route path="plans/:slug" element={<PlanDetail />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="about" element={<About />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="contact" element={<Contact />} />
            <Route path="refund-policy" element={<RefundPolicy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </AppInitializer>
  );
}