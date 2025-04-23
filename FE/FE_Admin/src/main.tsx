import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/login.tsx';
import { Button, Result } from 'antd';
import { AuthWrapper } from './components/context/auth.context.tsx';
import 'antd/dist/reset.css';
import ForgotPasswordPage from './pages/forgot_password.tsx';
import ChangePasswordPage from './pages/change_password_page.tsx';
import Homepage from './pages/homepage.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={<Button type="primary"><Link to={"/"}>Back Home</Link></Button>}
    />,
    children: [
      {
        index: true,
        element: <Homepage />
      }

    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />
  },
  {
    path: "/reset-password",
    element: <ChangePasswordPage />
  }
]);

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  //   <RouterProvider router={router} />
  // </StrictMode>,

  <AuthWrapper>
    <RouterProvider router={router} />
  </AuthWrapper>
)
