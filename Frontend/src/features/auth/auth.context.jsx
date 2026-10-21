import { createContext, useState, useEffect } from "react";
import { getme } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchUser = async () => {
            try {
                const data = await getme();
                if (isMounted && data?.user) {
                    setUser(data.user);
                }
            } catch (err) {
                if (isMounted) setUser(null);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchUser();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};