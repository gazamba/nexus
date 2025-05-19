import { SurveyResponse } from "@/types/types";
import { createClient } from "../../utils/supabase/client";
const supabase = createClient();

export const createSurveyResponse = async (
  surveyResponse: SurveyResponse & { pipeline_group_id?: string }
) => {
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

export const updateAnalyzedSurveyResponse = async (
  analyzedSurveyResponse: any,
  surveyId: string
): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from("survey_response")
      .update({ analyzed_survey_response: analyzedSurveyResponse })
      .eq("id", surveyId)
      .select()
      .single();

    if (error) {
      throw new Error(
        `Failed to insert analyzed survey response: ${error.message}`
      );
    }

    console.log(`Inserted/Updated analyzed survey response: ${data.id}`);
  } catch (error: any) {
    console.error("Insertion failed:", error.message);
    throw new Error(
      `Failed to insert analyzed survey response: ${error.message}`
    );
  }
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

export const getSurveyResponseByClientAndUser = async (
  clientId: string,
  userId: string
): Promise<SurveyResponse | null> => {
  const { data, error } = await supabase
    .from("survey_response")
    .select("*")
    .eq("client_id", clientId)
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    console.error("Error fetching survey response by client and user:", error);
    return null;
  }

  return data;
};
