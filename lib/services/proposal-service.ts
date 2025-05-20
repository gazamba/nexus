import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

export const getProposalById = async (
  supabase: SupabaseClient,
  proposalId: string
) => {
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

export const createProposal = async (
  supabase: SupabaseClient,
  data: {
    id: string;
    client_id: string;
    user_id: string;
    latex_content: string;
    pipeline_group_id: string;
  }
) => {
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

export const updateProposal = async (
  supabase: SupabaseClient,
  proposalId: string,
  data: any
) => {
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

export const deleteProposal = async (
  supabase: SupabaseClient,
  proposalId: string
) => {
  const { error } = await supabase
    .from("proposal")
    .delete()
    .eq("id", proposalId);

  if (error) {
    throw new Error(error.message);
  }
};
