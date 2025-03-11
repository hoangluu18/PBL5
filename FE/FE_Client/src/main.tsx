import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/login.tsx';
import RegisterPage from './pages/register.tsx';
import ForgotPasswordPage from './pages/forgot_password.tsx';
import Homepage from './pages/homepage.tsx';

import ProductFilterPage from './pages/products_filter.tsx';

import Checkout from './pages/checkout.tsx';
import AddAddress from './pages/add_address.tsx';
import EditAddress from './pages/edit_address.tsx';



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

        path: "/account",
        element: <div>abcdfafds</div>
      },
      {
        path: "/products/filter",
        element: <ProductFilterPage />

        path: "/checkout",
        element: <Checkout />
      },
      {
        path: "/add_address",
        element: <AddAddress />
      },      {
        path: "/edit_address",
        element: <EditAddress />

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
