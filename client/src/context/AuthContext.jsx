import { createContext, useContext, useEffect, useState } from "react";

const authContext = createContext({
    authUser: null,
    setAuthUser: () => {},
    isLoading: true,
});

export const useAuthContext = () => {
    const context = useContext(authContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthContextProvider");
    }
    return context;
}


export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("/api/auth/me")
                const data = await response.json();
                if (response.ok) {
                    console.log("User fetched successfully:", data);
                    setAuthUser(data.user);
                } else {
                    console.error("Error fetching user:", data.error);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <authContext.Provider value={{ authUser, setAuthUser, isLoading }}>
            {children}
        </authContext.Provider>
    );
}