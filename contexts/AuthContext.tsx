import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthMethod = 'wallet' | 'email' | 'phone' | null;

interface AuthContextType {
  authMethod: AuthMethod;
  userCredential: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithWallet: (walletAddress: string) => Promise<void>;
  loginWithEmail: (email: string) => Promise<void>;
  loginWithPhone: (phone: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_METHOD_KEY = '@stacksave_auth_method';
const AUTH_CREDENTIAL_KEY = '@stacksave_auth_credential';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authMethod, setAuthMethod] = useState<AuthMethod>(null);
  const [userCredential, setUserCredential] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth state on mount
  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const [method, credential] = await Promise.all([
        AsyncStorage.getItem(AUTH_METHOD_KEY),
        AsyncStorage.getItem(AUTH_CREDENTIAL_KEY),
      ]);

      if (method && credential) {
        setAuthMethod(method as AuthMethod);
        setUserCredential(credential);
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAuthState = async (method: AuthMethod, credential: string) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(AUTH_METHOD_KEY, method || ''),
        AsyncStorage.setItem(AUTH_CREDENTIAL_KEY, credential),
      ]);
    } catch (error) {
      console.error('Error saving auth state:', error);
    }
  };

  const loginWithWallet = async (walletAddress: string) => {
    setAuthMethod('wallet');
    setUserCredential(walletAddress);
    await saveAuthState('wallet', walletAddress);
  };

  const loginWithEmail = async (email: string) => {
    // In production, this would verify email and generate custodial wallet
    setAuthMethod('email');
    setUserCredential(email);
    await saveAuthState('email', email);
  };

  const loginWithPhone = async (phone: string) => {
    // In production, this would verify phone and generate custodial wallet
    setAuthMethod('phone');
    setUserCredential(phone);
    await saveAuthState('phone', phone);
  };

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(AUTH_METHOD_KEY),
        AsyncStorage.removeItem(AUTH_CREDENTIAL_KEY),
      ]);
      setAuthMethod(null);
      setUserCredential(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const isAuthenticated = authMethod !== null && userCredential !== null;

  return (
    <AuthContext.Provider
      value={{
        authMethod,
        userCredential,
        isAuthenticated,
        isLoading,
        loginWithWallet,
        loginWithEmail,
        loginWithPhone,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
