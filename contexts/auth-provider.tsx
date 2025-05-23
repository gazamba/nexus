"use client";

import type React from "react";
import { createClient } from "@/utils/supabase/client";
import { createContext, useContext, useState, useEffect } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Profile } from "@/types/types";

interface AuthContextType {
  user: Profile | null;
  setUser: (user: Profile) => void;
  isAdmin: boolean;
  isClient: boolean;
  isSE: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSupabaseUser(supabaseUser: SupabaseUser): Profile {
  return {
    id: supabaseUser.id,
    user_id: supabaseUser.id,
    full_name:
      supabaseUser.user_metadata?.name ||
      supabaseUser.email?.split("@")[0] ||
      "User",
    avatar_initial:
      supabaseUser.user_metadata?.name?.charAt(0).toUpperCase() ||
      supabaseUser.email?.split("@")[0]?.charAt(0).toUpperCase() ||
      "U",
    role: supabaseUser.user_metadata?.role || "client",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    email: supabaseUser.email || "",
    phone: "",
    billing: false,
    admin: false,
    notes: "",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
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
