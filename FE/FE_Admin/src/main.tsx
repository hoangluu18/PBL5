import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import 'antd/dist/reset.css'
import { Result, Button } from 'antd'
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom'
import Dashboard from './pages/sales_person/overview/DashBoard.tsx'
import InvoiceManagementPage from './pages/sales_person/invoice/InvoiceManagement.tsx'
import LoginPage from './pages/layouts/login.tsx'
import { AuthWrapper } from './utils/auth.context.tsx'
import ProductManagement from './pages/sales_person/product_management/ProductManagement.tsx'


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
        element: <Dashboard />,
      },
      {
        path: "/invoice",
        element: <InvoiceManagementPage />
      },
      {
        path: "/products",
        element: <ProductManagement />
      },
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
]);


createRoot(document.getElementById('root')!).render(

  <AuthWrapper>
    <RouterProvider router={router} />
  </AuthWrapper>
)
