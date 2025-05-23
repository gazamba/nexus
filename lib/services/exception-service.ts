import { createClient } from "@/utils/supabase/server";
import { WorkflowException } from "@/types/types";

export async function getExceptions(clientFilter?: string | null) {
  const supabase = await createClient();

  let query = supabase
    .from("workflow_exception")
    .select(
      `
      id,
      reported_at,
      client_id,
      department,
      workflow:workflow_id!inner(name), 
      exception_type,
      severity,
      remedy_notes,
      status
    `
    )
    .order("reported_at", { ascending: false });

  if (clientFilter && clientFilter !== "all") {
    query = query.eq("client_id", clientFilter);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Failed to fetch exceptions");
  }

  const typedData = data as unknown as WorkflowException[];

  const clientIds = [
    ...new Set(typedData.map((exception) => exception.client_id)),
  ];

  const { data: clientsData } = await supabase
    .from("client")
    .select("id, name")
    .in("id", clientIds);

  const clientMap = new Map(
    clientsData?.map((client) => [client.id, client.name]) || []
  );

  const formattedData = typedData.map((exception) => {
    return {
      id: exception.id,
      datetime: exception.reported_at,
      clientName: clientMap.get(exception.client_id) || "-",
      department: exception.department || "-",
      workflowName: exception.workflow?.name || "-",
      exceptionType: exception.exception_type || "-",
      severity: exception.severity || "-",
      remedy: exception.remedy_notes || "-",
      status: exception.status || "-",
    };
  });

  return formattedData;
}
