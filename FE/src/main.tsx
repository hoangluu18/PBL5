import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>Error</div>,
    children: [
      {
        index: true,
        element: <div>fadf</div>
      },
      {
        path: "/checkout",
        element: <div>abcdfafds</div>
      },
      {
        path: "/account",
        element: <div>abcdfafds</div>
      }

    ]
  },
  {
    path: "/login",
    element: <div>login page</div>
  },
  {
    path: "/register",
    element: <div>register page</div>
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
