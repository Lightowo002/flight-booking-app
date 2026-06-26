'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export interface AuthUser {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  numeroDocumento: string;
  fechaRegistro: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  tipoDocumento: string;
  numeroDocumento: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isReady: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  loginWithGoogle: (token: string) => Promise<AuthUser>;
  register: (data: RegisterData) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'skytracker-user';
const API_URL = 'https://localhost:7118/api/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
    setIsReady(true);
  }, []);

  const persist = (next: AuthUser | null) => {
    setUser(next);
    if (next) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo: email, contraseña: password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Credenciales incorrectas');
    }

    const data = await response.json();

    const nextUser: AuthUser = {
      firstName: data.usuario.nombres,
      lastName: data.usuario.apellidos,
      email: data.usuario.correo,
      role: data.usuario.rol,
      phone: data.usuario.telefono,
      numeroDocumento: data.usuario.numeroDocumento,
      fechaRegistro: data.usuario.fechaRegistro,
    };
    persist(nextUser);
    return nextUser;
  };

  const loginWithGoogle = async (token: string) => {
    const response = await fetch(`${API_URL}/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'No se pudo iniciar sesión con Google');
    }

    const data = await response.json();

    const nextUser: AuthUser = {
      firstName: data.usuario.nombres,
      lastName: data.usuario.apellidos,
      email: data.usuario.correo,
      role: data.usuario.rol,
      phone: data.usuario.telefono,
      numeroDocumento: data.usuario.numeroDocumento,
      fechaRegistro: data.usuario.fechaRegistro,
    };
    persist(nextUser);
    return nextUser;
  };

  const register = async (data: RegisterData) => {
    const response = await fetch(`${API_URL}/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombres: data.firstName,
        apellidos: data.lastName,
        tipoDocumento: data.tipoDocumento,
        numeroDocumento: data.numeroDocumento,
        correo: data.email,
        telefono: data.phone,
        contraseña: data.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.message) {
        throw new Error(errorData.message);
      }
      const firstError = errorData.errors
        ? (Object.values(errorData.errors)[0] as string[])
        : null;
      throw new Error(firstError ? firstError[0] : 'No se pudo registrar');
    }

    const nextUser: AuthUser = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: 'Pasajero',
      phone: data.phone,
      numeroDocumento: data.numeroDocumento,
      fechaRegistro: new Date().toISOString(),
    };
    persist(nextUser);
    return nextUser;
  };

  const logout = () => {
    persist(null);
  };

  return (
    <AuthContext.Provider value={{ user, isReady, login, loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}