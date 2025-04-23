import { createContext, useState } from "react";

interface Customer {
    id: number;
    username: string;
    email: string;
    phoneNumber: string;
    avatar: string;
}

interface AuthContextType {
    customer: Customer;
    setCustomer: (customer: Customer) => void;
    isAppLoading: boolean;
    setIsAppLoading: (isLoading: boolean) => void;
    cartCount: number;
    setCartCount: (count: number) => void;
}

export const AuthContext = createContext<AuthContextType>({
    customer: {
        id: 0,
        username: "",
        email: "",
        phoneNumber: "",
        avatar: ""

    },
    setCustomer: () => { },
    isAppLoading: true,
    setIsAppLoading: () => { },
    cartCount: 0,
    setCartCount: () => { }
});

export const AuthWrapper = (props: React.PropsWithChildren<{}>) => {
    const storedCustomer = localStorage.getItem("customer");

    const [customer, setCustomer] = useState<Customer>(() => {
        return storedCustomer ? JSON.parse(storedCustomer) : {
            id: 0,
            username: "",
            email: "",
            phoneNumber: "",
            avatar: ""
        };
    });

    const [isAppLoading, setIsAppLoading] = useState(true);
    const [cartCount, setCartCount] = useState<number>(0);


    return (
        <AuthContext.Provider value={{ customer, setCustomer, isAppLoading, setIsAppLoading, cartCount, setCartCount }}>
            {props.children}
        </AuthContext.Provider>
    );
};