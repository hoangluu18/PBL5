import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/login.tsx';
import RegisterPage from './pages/register.tsx';
import ForgotPasswordPage from './pages/forgot_password.tsx';
import Homepage from './pages/homepage.tsx';
import Checkout from './pages/checkout.tsx';


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
        path: "/account",
        element: <div>abcdfafds</div>
      },
      {
        path: "/checkout",
        element: <Checkout />
      }

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
