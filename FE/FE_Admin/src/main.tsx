import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import 'antd/dist/reset.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

//import Hompage from './pages/homepage.tsx'
import Customers from './pages/customers.tsx';
import CustomerDetail from './pages/customerDetail.tsx';
import Dashboard from './pages/sales_person/overview/DashBoard.tsx'
import InvoiceManagementPage from './pages/sales_person/invoice/InvoiceManagement.tsx'
import LoginPage from './pages/layouts/login.tsx'
import { AuthWrapper } from './utils/auth.context.tsx'
import ProductManagement from './pages/sales_person/product_management/ProductManagement.tsx'
import ProtectedRoute from './utils/protected.route.tsx'
import UnauthorizedPage from './pages/unauthorize.page.tsx'
import AdminLayout from './pages/layouts/admin.layout.tsx'
import NavBar from './pages/layouts/shop.layout.tsx'
import DashBoardAdmin from './pages/admin/DashboardAdmin.tsx';
import ShopManagement from './pages/admin/ShopManagerPage.tsx';
import SettingPage from './pages/admin/SettingPage.tsx';
import BrandPage from './pages/admin/BrandManagerPage.tsx';
import CategoriesManagement from './pages/admin/CategoryManagerPage.tsx';
import LogisticsNav from './pages/layouts/logistic.layout.tsx';
import OrderManagement from './pages/logistics/orderManagement.tsx';
import ProfilePage from './pages/logistics/profile.tsx';

import StoreRequestPage from './pages/admin/StoreRequestPage.tsx';

import ShopProfile from './pages/shop_profile/ShopProfile.tsx';
import ShopWallet from './pages/sales_person/wallet/ShopWallet.tsx';

const router = createBrowserRouter([
  // ADMIN ROUTES
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashBoardAdmin />
      },
      {
        path: "dashboard",
        element: <DashBoardAdmin />
      },
      {
        path: "brands",
        element: <BrandPage />
      },
      {
        path: "shops",
        element: <ShopManagement />
      },
      {
        path: "categories",
        element: <CategoriesManagement />
      },
      {
        path: "store_requests",
        element: <StoreRequestPage />
      },
      {
        path: "settings",
        element: <SettingPage />
      },
    ]
  },

  // Logistics ROUTES
  {
    path: "/logistic",
    element: (
      <ProtectedRoute allowedRoles={["Logistic"]}>
        <LogisticsNav />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <OrderManagement />
      },
      {
        path: "orderManagement",
        element: <OrderManagement />
      },
      {
        path: "profile",
        element: <ProfilePage />
      }
    ]
  },
  // SALESPERSON ROUTES
  {
    path: "/shop",
    element: (
      <ProtectedRoute allowedRoles={["Seller"]}>
        <NavBar />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "customers",
        element: <Customers />
      },
      {
        path: "customers/:id",
        element: <CustomerDetail />
      },
      {
        path: "invoice",
        element: <InvoiceManagementPage />
      },
      {
        path: "products",
        element: <ProductManagement />
      },
      {
        path: "profile",
        element: <ShopProfile />
      },
      {
        path: 'wallet',
        element: <ShopWallet />
      }
    ]
  },

  // AUTH & GENERAL ROUTES
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <LoginPage /> // Redirect to login or choose appropriate landing page
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />
  }
]);

createRoot(document.getElementById('root')!).render(

  <AuthWrapper>
    <RouterProvider router={router} />
  </AuthWrapper>
)