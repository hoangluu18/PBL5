import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/login.tsx';
import RegisterPage from './pages/register.tsx';
import ForgotPasswordPage from './pages/forgot_password.tsx';
import Homepage from './pages/homepage.tsx';
import CartPage from './pages/cart.tsx';
import OrderDetail from './pages/order_details.tsx';
import OrderTracking from './pages/order_tracking.tsx';

import ProductFilterPage from './pages/products_filter.tsx';

import Checkout from './pages/checkout.tsx';
import AddAddress from './pages/add_address.tsx';
import EditAddress from './pages/edit_address.tsx';
import ShopDetail from './pages/shop_detail.tsx';
import FollowedShops from './pages/followed_shops.tsx';
import ProductDetailPage from './pages/product_detail.tsx';
import Account from './pages/profile.tsx';
import ProfilePage from './pages/profile.tsx';
import { Button, Result } from 'antd';



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
      },
      {
        path: "/products/filter",
        element: <ProductFilterPage />
      },
      {
        path: "/checkout",
        element: <Checkout />
      },
      {
        path: "/add_address",
        element: <AddAddress />
      }, {
        path: "/edit_address",
        element: <EditAddress />
      },
      {
        path: "/shop/1",
        element: <ShopDetail />
      },
      {
        path: "/followed_shops",
        element: <FollowedShops />
      },
      {
        path: "/p/:alias",
        element: <ProductDetailPage />
      },
      {
        path: "/profile",
        element: <ProfilePage />
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
