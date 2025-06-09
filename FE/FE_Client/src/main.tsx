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
import UpdateAddress from './pages/update_address.tsx';
import ShopDetail from './pages/shop_detail.tsx';
import FollowedShops from './pages/followed_shops.tsx';
import ProductDetailPage from './pages/product_detail.tsx';
import ProfilePage from './pages/profile.tsx';
import { Button, Result } from 'antd';
import { AuthWrapper } from './components/context/auth.context.tsx';

import 'antd/dist/reset.css';
import OAuth2RedirectHandler from './pages/oauth2-redirect.tsx';
import ChangePasswordPage from './pages/change_password_page.tsx';
import WalletPage from './components/WalletPage.tsx';
import WalletDepositPage from './components/WalletDepositPage.tsx';
import StoreRequestForm from './pages/store_request.tsx';
import SellerRegistrationForm from './pages/store_request.tsx';

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
        path: "/c/:alias",
        element: <ProductFilterPage />
      },
      {
        path: "/search",
        element: <ProductFilterPage />
      },
      {
        path: "/checkout",
        element: <Checkout />
      },
      {
        path: "/add-address",
        element: <AddAddress />
      }, {
        path: "/edit-address",
        element: <EditAddress />
      },
      {
        path: "update-address",
        element: <UpdateAddress />
      },
      {
        path: "/shop/:id",
        element: <ShopDetail />
      },
      {
        path: "/followed-shops",
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
        path: '/order-detail/:id',
        element: <OrderDetail />
      },
      {
        path: '/orders',
        element: <OrderTracking />,
      },
      {
        path: '/wallet',
        element: <WalletPage />,
      },
      {
        path: '/wallet/deposit',
        element: <WalletDepositPage />,
      },
      {
        path: '/store-request',
        element: <SellerRegistrationForm />,
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
    path: "/forgot-password",
    element: <ForgotPasswordPage />
  },
  {
    path: "/oauth2/redirect",
    element: <OAuth2RedirectHandler />
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
