import { Menu, MenuProps } from "antd";
import './style.css'

const HeaderMenu = () => {

    type MenuItem = Required<MenuProps>['items'][number];
    const menus: MenuItem[] = [
        {
            label: 'Home',
            key: 'home',
        },
        {
            label: 'Products',
            key: 'products',
        },
        {
            label: 'Shipping info',
            key: 'shippingInfo',
        },
        {
            label: 'Track order',
            key: 'trackOrder',
        },
        {
            label: 'Checkout',
            key: 'checkout',
        },
    ];

    return (
        <>
            <Menu
                forceSubMenuRender={true} multiple={true}
                mode="horizontal"
                items={menus} style={{ borderBottom: "none", overflow: "visible", flex: "1", justifyContent: "right" }} />
        </>
    );
}

export default HeaderMenu;
