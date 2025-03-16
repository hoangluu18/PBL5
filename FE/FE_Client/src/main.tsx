import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/login.tsx';
import RegisterPage from './pages/register.tsx';
import ForgotPasswordPage from './pages/forgot_password.tsx';
import Homepage from './pages/homepage.tsx';
import CartPage from './pages/cart.tsx';
import OrderDetail from './pages/order_details.tsx';
import OrderTracking from './pages/order_tracking.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>Error</div>,
    children: [
      {
        index: true,
        element: <Homepage />
      },
      {
        path: "/checkout",
        element: <div>abcdfafds</div>
      },
      {
        path: "/account",
        element: <div>abcdfafds</div>
      },
      {
        path: "/cart",
        element: <CartPage />
      },
      {
        path: '/order/:id', // Route mới cho Chi tiết đơn hàng
        element: <OrderDetail />
      },
      {
        path: '/order-tracking/:id', // Route mới cho OrderTracking
        element: <OrderTracking />,
      },

    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/forgot_password",
    element: <ForgotPasswordPage />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
