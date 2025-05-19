"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { createNextPipelineProgress } from "@/lib/services/pipeline-service";

interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: "admin" | "client" | "se";
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
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
        firstName,
        lastName,
        avatar_initial: firstName[0],
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
      full_name: `${firstName} ${lastName}`,
      avatar_initial: firstName[0],
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

      if (role === "client" && data.user?.id) {
        try {
          const { data: clientData, error: clientError } = await supabase
            .from("client_user_assignment")
            .select("client_id")
            .eq("client_user_id", data.user.id)
            .single();

          if (clientError) {
            console.error("Error fetching client ID:", clientError);
          } else if (clientData?.client_id) {
            await createNextPipelineProgress(
              data.user.id,
              clientData.client_id
            );
          }
        } catch (error) {
          console.error("Error initializing pipeline:", error);
        }
      }

      return null;
    }
  }
}
