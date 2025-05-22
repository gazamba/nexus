import { createClient } from "../../utils/supabase/client";
import { Profile } from "@/types/types";

const supabase = createClient();

export const getSolutionEngineer = async (
  clientId: string
): Promise<{ data: Profile | null }> => {
  const { data: assignment, error: assignmentError } = await supabase
    .from("solutions_engineer_assignment")
    .select("se_user_id")
    .eq("client_id", clientId)
    .single();

  if (assignmentError || !assignment) {
    console.error(
      "Error fetching solution engineer assignment:",
      assignmentError
    );
    return { data: null };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("*")
    .eq("user_id", assignment.se_user_id)
    .single();

  if (profileError || !profile) {
    console.error("Error fetching solution engineer profile:", profileError);
    return { data: null };
  }

  return { data: profile };
};
