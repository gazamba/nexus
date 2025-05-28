import { createClient } from "../../utils/supabase/client";
import { User } from "@/types/types";

const supabase = createClient();

export const getSolutionEngineer = async (
  clientId: string
): Promise<{ data: User | undefined }> => {
  const { data: assignment, error: assignmentError } = await supabase
    .from("solutions_engineer_assignment")
    .select("se_user_id")
    .eq("client_id", clientId)
    .single();

  if (assignmentError || !assignment) {
    console.error("No solution engineer assigned:", assignmentError);
    return { data: undefined };
  }

  const { data: user, error: userError } = await supabase
    .from("user")
    .select("*")
    .eq("user_id", assignment.se_user_id)
    .single();

  if (userError || !user) {
    console.error("Error fetching solution engineer:", userError);
    return { data: undefined };
  }

  return { data: user };
};
