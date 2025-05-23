"use server";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return error;
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as string;
  const phone = formData.get("phone") as string;
  const isBilling = formData.get("isBilling") === "true";
  const isAdmin = formData.get("isAdmin") === "true";
  const notes = formData.get("notes") as string;

  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        avatar_initial: fullName[0],
        role,
        phone,
        isBilling,
        isAdmin,
        notes,
      },
    },
  });
  if (signUpError) {
    console.error("Error signing up:", signUpError);
    return signUpError;
  } else {
    console.log("Created user ID:", data.user?.id);
    const { error: profileError } = await supabase.from("profile").insert({
      user_id: data.user?.id,
      email: email,
      full_name: fullName,
      avatar_initial: fullName[0],
      role: role,
      phone: phone,
      billing: isBilling,
      admin: isAdmin,
      notes: notes,
    });
    if (profileError) {
      console.error("Error creating profile:", {
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
      });
      console.error("Error creating profile:", profileError);
      return profileError;
    } else {
      console.log("Profile created successfully:", data);
      return null;
    }
  }
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  return error;
}
