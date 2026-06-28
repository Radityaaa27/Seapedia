import { createContext,useContext,useState,useEffect, Children } from "react";
import api from "../services/api";
import type {User, LoginInput, RegisterInput, AuthResponse } from "../types/auth.types";
import type { ReactNode } from "react";

interface AuthContextType{
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (input: LoginInput) => Promise<void>;
    register: (input: RegisterInput) => Promise<void>;
    logout: () => void;
}
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider =  ({children } : { children: ReactNode }) => {
    const [user,setUser] = useState<User | null>(null);
    const [token,setToken] = useState<string | null>(null);
    const [isLoading,setIsLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem("seapedia_token");
        const savedUser = localStorage.getItem("seapedia_user");

        if (savedToken && savedUser) {
            try{
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            }catch{
                localStorage.removeItem("seapedia_token");
                localStorage.removeItem("seapedia_user");
            }
        }
        setIsLoading(false);
    }, []);
    const saveSession = (data:AuthResponse) => {
        localStorage.setItem("seapedia_token",data.token);
        localStorage.setItem("seapedia_user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
    };

    const login = async (input: LoginInput) => {
        const response = await api.post<{ data: AuthResponse }>("auth/login", input);
        saveSession(response.data.data);
    };
    const register = async (input: RegisterInput) => {
        const response = await api.post<{ data: AuthResponse }>("auth/register", input);
        saveSession(response.data.data);
    };
    const logout = () => {
        localStorage.removeItem("seapedia_token");
        localStorage.removeItem("seapedia_user");
        setToken(null);
        setUser(null);
    };
    return (
        <AuthContext.Provider 
        value={{
            user,
            token,
            isLoading,
            isAuthenticated: !!token && !!user,
            login,
            register,
            logout
        }}
            >
            {children}
        </AuthContext.Provider>
    );
};
export {AuthContext};