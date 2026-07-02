import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "../services/api";
import {
  User,
  LoginInput,
  RegisterInput,
  AuthResponse,
  RoleType,
} from "../types/auth.types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  activeRole: RoleType | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  switchRole: (role: RoleType) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Decode the active role from the JWT payload (middle part)
const decodeActiveRole = (token: string): RoleType | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.activeRole ?? null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<RoleType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on app load
  useEffect(() => {
    const savedToken = localStorage.getItem("seapedia_token");
    const savedUser = localStorage.getItem("seapedia_user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setActiveRole(decodeActiveRole(savedToken));
      } catch {
        localStorage.removeItem("seapedia_token");
        localStorage.removeItem("seapedia_user");
      }
    }
    setIsLoading(false);
  }, []);

  const saveSession = (data: AuthResponse) => {
    localStorage.setItem("seapedia_token", data.token);
    localStorage.setItem("seapedia_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    setActiveRole(decodeActiveRole(data.token));
  };

  const login = async (input: LoginInput) => {
    const response = await api.post<{ data: AuthResponse }>("/auth/login", input);
    saveSession(response.data.data);
  };

  const register = async (input: RegisterInput) => {
    const response = await api.post<{ data: AuthResponse }>("/auth/register", input);
    saveSession(response.data.data);
  };

  const logout = () => {
    localStorage.removeItem("seapedia_token");
    localStorage.removeItem("seapedia_user");
    setToken(null);
    setUser(null);
    setActiveRole(null);
  };

  // Call backend to switch role, then update local session with new token
  const switchRole = async (role: RoleType) => {
    const response = await api.post<{ data: AuthResponse }>("/roles/switch", { role });
    saveSession(response.data.data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        activeRole,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };