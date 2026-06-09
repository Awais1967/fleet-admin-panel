/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "../firebase/client";

const AuthContext = createContext(null);

function mapFirebaseUser(firebaseUser) {
  if (!firebaseUser) return null;

  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email || "Admin",
    role: "Admin",
    email: firebaseUser.email,
  };
}

function getAuthErrorMessage(error) {
  switch (error?.code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password. Create this admin user in Firebase Authentication or use an existing account.";
    case "auth/operation-not-allowed":
      return "Email/password login is not enabled in Firebase Authentication.";
    case "auth/too-many-requests":
      return "Too many login attempts. Please wait a moment and try again.";
    case "auth/network-request-failed":
      return "Could not reach Firebase. Check your internet connection and Firebase project settings.";
    default:
      return error?.message || "Login failed";
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      return undefined;
    }

    return onAuthStateChanged(auth, (firebaseUser) => {
      setUser(mapFirebaseUser(firebaseUser));
      setIsBootstrapping(false);
    });
  }, []);

  const login = useCallback(async ({ email, password }) => {
    if (!email || !password) throw new Error("Email and password are required");

    if (!isFirebaseConfigured || !auth) {
      setUser({ id: "demo-admin", name: "Admin", role: "Super Admin", email });
      return;
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      setUser(mapFirebaseUser(credential.user));
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  }, []);

  const logout = useCallback(async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBootstrapping,
      login,
      logout,
      isFirebaseConfigured,
    }),
    [user, isBootstrapping, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
