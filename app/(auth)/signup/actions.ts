"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: "admin" | "client" | "se";
}

export async function signUp({ email, password, name, role }: SignUpData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
      },
    },
  });

  if (error) {
    throw error;
  }

  redirect("/login");
}
