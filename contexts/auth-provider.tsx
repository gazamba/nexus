"use client";

import type React from "react";
import { createClient } from "@/utils/supabase/client";
import { createContext, useContext, useState, useEffect } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { User, UserRole } from "@/types/types";

interface AuthContextType {
  user: User | null;
  setUser: (user: User) => void;
  isAdmin: boolean;
  isClient: boolean;
  isSE: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSupabaseUser(supabaseUser: SupabaseUser): User {
  return {
    id: supabaseUser.id,
    name:
      supabaseUser.user_metadata?.name ||
      supabaseUser.email?.split("@")[0] ||
      "User",
    email: supabaseUser.email || "",
    role: supabaseUser.user_metadata?.role || "client",
  };
}

export const getUserAvatar = (user: User): string => {
  if (user.avatar) {
    return user.avatar;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user.name
  )}&background=random`;
};

export const sampleUsers = {
  admin: {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin" as UserRole,
  },
  client: {
    id: "2",
    name: "Client User",
    email: "client@example.com",
    role: "client" as UserRole,
  },
  se: {
    id: "3",
    name: "SE User",
    email: "se@example.com",
    role: "se" as UserRole,
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError) {
          console.error("Error fetching session:", sessionError);
          setUser(null);
        } else if (sessionData.session) {
          const { data, error } = await supabase.auth.getUser();
          if (error) {
            console.error("Error fetching user:", error);
            setUser(null);
          } else if (data.user) {
            setUser(mapSupabaseUser(data.user));
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setUser(null);
      }
      setIsLoading(false);
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const isAdmin = user?.role === "admin";
  const isClient = user?.role === "client";
  const isSE = user?.role === "se";

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isAdmin, isClient, isSE }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
