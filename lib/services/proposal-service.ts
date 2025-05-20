import { createClient } from "@/utils/supabase/server";

export const getProposalById = async (proposalId: string) => {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData?.user?.id) {
    throw new Error("User not authenticated");
  }
  const { data: proposal, error } = await supabase
    .from("proposal")
    .select("*")
    .eq("id", proposalId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return proposal;
};

export const createProposal = async (data: {
  id: string;
  client_id: string;
  user_id: string;
  html_content: string;
  pipeline_group_id: string;
}) => {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData?.user?.id) {
    throw new Error("User not authenticated");
  }
  const { data: proposal, error } = await supabase
    .from("proposal")
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return proposal;
};

export const updateProposal = async (proposalId: string, data: any) => {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData?.user?.id) {
    throw new Error("User not authenticated");
  }
  const { data: proposal, error } = await supabase
    .from("proposal")
    .update(data)
    .eq("id", proposalId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return proposal;
};

export const deleteProposal = async (proposalId: string) => {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData?.user?.id) {
    throw new Error("User not authenticated");
  }
  const { error } = await supabase
    .from("proposal")
    .delete()
    .eq("id", proposalId);

  if (error) {
    throw new Error(error.message);
  }
};
