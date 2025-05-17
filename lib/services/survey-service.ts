import { createClient } from "../../utils/supabase/client";
const supabase = createClient();

export const createSurvey = async (surveyData: any) => {
  const { error } = await supabase.from("survey").insert([surveyData]);
  return { error };
};
