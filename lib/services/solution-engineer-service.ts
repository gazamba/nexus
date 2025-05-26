import { createClient } from "../../utils/supabase/client";
import { Profile } from "@/types/types";

const supabase = createClient();

export const getSolutionEngineer = async (
  clientId: string
): Promise<{ data: Profile | undefined }> => {
  const { data: assignment, error: assignmentError } = await supabase
    .from("solutions_engineer_assignment")
    .select("se_user_id")
    .eq("client_id", clientId)
    .single();

  if (assignmentError || !assignment) {
    console.error("No solution engineer assigned:", assignmentError);
    return { data: undefined };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("*")
    .eq("user_id", assignment.se_user_id)
    .single();

  if (profileError || !profile) {
    console.error("Error fetching solution engineer profile:", profileError);
    return { data: undefined };
  }

  return { data: profile };
};
