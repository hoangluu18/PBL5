import { createContext, useState } from "react";

interface User {
    id: number;
    name: string;
    roles: string[];
    photo: string;
}

interface AuthContextType {
    user: User;
    setUser: (user: User) => void;
    isAppLoading: boolean;
    setIsAppLoading: (isLoading: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: {
        id: 0,
        name: "",
        photo: "",
        roles: []
    },
    setUser: () => { },
    isAppLoading: true,
    setIsAppLoading: () => { },
});

export const AuthWrapper = (props: React.PropsWithChildren<{}>) => {
    const storedUser = localStorage.getItem("user");

    const [user, setUser] = useState<User>(() => {
        return storedUser ? JSON.parse(storedUser) : {
            id: 0,
            name: "",
            photo: "",
            roles: []
        };
    });

    const [isAppLoading, setIsAppLoading] = useState(true);

    return (
        <AuthContext.Provider value={{ user, setUser, isAppLoading, setIsAppLoading }}>
            {props.children}
        </AuthContext.Provider>
    );
};