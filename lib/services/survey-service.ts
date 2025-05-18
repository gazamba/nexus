import { SurveyResponse } from "@/types/types";
import { createClient } from "../../utils/supabase/client";
const supabase = createClient();

export const createSurveyResponse = async (surveyResponse: SurveyResponse) => {
  const { data, error } = await supabase
    .from("survey_response")
    .insert([surveyResponse])
    .select("id")
    .single();

  return { data, error };
};

export const getSurveyResponse = async (
  id: string
): Promise<SurveyResponse | null> => {
  const { data, error } = await supabase
    .from("survey_response")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching survey response:", error);
    return null;
  }

  return {
    ...data,
  };
};

export const listSurveyResponses = async (
  userId: string
): Promise<SurveyResponse[] | null> => {
  const { data, error } = await supabase
    .from("survey_response")
    .select("*")
    .eq("user_id", userId);

  if (error || !data) {
    console.error("Error fetching survey response:", error);
    return null;
  }

  return data;
};
