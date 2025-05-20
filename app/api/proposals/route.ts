import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from "uuid";
import { createProposal } from "@/lib/services/proposal-service";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const jsonData = await request.json();
    const { workflows, notes, pipeline_group_id } = jsonData;

    if (!workflows || !Array.isArray(workflows) || workflows.length === 0) {
      return NextResponse.json(
        { error: "Invalid or missing workflows data" },
        { status: 400 }
      );
    }

    const workflow = workflows[0];
    const client_id = workflow.client_id;
    const user_id = userData.user.id;
    const id = uuidv4();
    const workflow_type = workflow.name;
    const current_process = workflow.description
      ? `Manually executing the process described as: ${workflow.description}`
      : "Manually handling tasks that could be automated.";
    const triggers =
      workflow.trigger_option === "event"
        ? ["New email from specific sender"]
        : ["Scheduled execution"];
    const pain_points =
      notes && Array.isArray(notes)
        ? notes.map((note: string) =>
            note.includes("manual")
              ? "Manual processes are time-consuming"
              : note
          )
        : [
            "Manual processes are time-consuming",
            "Risk of errors in manual tasks",
            "Lack of real-time updates",
          ];
    const systems = workflow.nodes
      ? workflow.nodes
          .map((node: any) =>
            node.type === "EmailMonitor" ? "Gmail" : node.type
          )
          .filter(Boolean)
      : ["Unknown"];
    const api_access = workflow.nodes
      ? workflow.nodes
          .map((node: any) =>
            node.type === "EmailMonitor" ? "Gmail API" : `${node.type} API`
          )
          .join(", ")
      : "None";
    const outputs = workflow.nodes
      ? workflow.nodes
          .filter((node: any) => node.type === "Slack")
          .map(() => "Slack notifications")
      : ["Notifications"];
    const agent_interaction = outputs.length > 0 ? outputs : ["Notifications"];
    const volume = workflow.volume || "Moderate";
    const priority = workflow.priority || "High";

    if (!client_id || !user_id || !current_process) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const latexContent = `
\\documentclass[12pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{fancyhdr}
\\usepackage{lastpage}
\\usepackage{xcolor}
\\usepackage[T1]{fontenc}
\\usepackage{noto}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{Nexus App}
\\fancyhead[R]{\\today}
\\fancyfoot[C]{Page \\thepage\\ of \\pageref{LastPage}}
\\titleformat{\\section}{\\Large\\bfseries}{\\thesection}{1em}{}
\\titleformat{\\subsection}{\\large\\bfseries}{\\thesubsection}{1em}{}

\\begin{document}

\\begin{titlepage}
  \\centering
  \\vspace*{2cm}
  {\\Huge\\bfseries Client Automation Proposal\\par}
  \\vspace{1cm}
  {\\Large Prepared for Client ID: ${client_id}\\par}
  \\vspace{0.5cm}
  {\\large Prepared by: Nexus App Team\\par}
  \\vspace{0.5cm}
  {\\large \\today\\par}
  \\vfill
  {\\large Nexus App\\\\A platform that automates client workflows by generating custom code and AI agents from survey data and documentation.\\par}
\\end{titlepage}

\\section{Executive Summary}
This proposal outlines an automation solution tailored to address the specific needs and pain points identified in your workflow. The Nexus App team proposes an automated system to streamline your ${workflow_type} process by integrating ${systems.join(
      " and "
    )}, ensuring efficient task execution and notifications.

\\section{Current Workflow and Pain Points}
\\subsection{Current Process}
${current_process
  .replace(/%/g, "\\%")
  .replace(/\$/g, "\\$")
  .replace(/#/g, "\\#")
  .replace(/&/g, "\\&")}

\\subsection{Pain Points}
The following challenges have been identified:
\\begin{itemize}
${pain_points
  .map(
    (point: string) =>
      `  \\item ${point
        .replace(/%/g, "\\%")
        .replace(/\$/g, "\\$")
        .replace(/#/g, "\\#")
        .replace(/&/g, "\\&")}`
  )
  .join("\n")}
\\end{itemize}

\\section{Proposed Automation Solution}
\\subsection{Overview}
We propose an automation workflow that streamlines your processes by integrating with ${systems.join(
      " and "
    )} to deliver ${outputs.join(" and ")}.

\\subsection{Key Components}
\\begin{itemize}
  \\item \\textbf{Trigger}: ${triggers
    .join(", ")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/&/g, "\\&")}.
  \\item \\textbf{Systems Involved}:
    \\begin{itemize}
    ${systems
      .map(
        (system: string) =>
          `      \\item ${system
            .replace(/%/g, "\\%")
            .replace(/\$/g, "\\$")
            .replace(/#/g, "\\#")
            .replace(/&/g, "\\&")}`
      )
      .join("\n")}
    \\end{itemize}
  \\item \\textbf{Output}: ${outputs
    .join(", ")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/&/g, "\\&")}.
  \\item \\textbf{Agent Interaction}: Notifications via ${agent_interaction
    .join(", ")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/&/g, "\\&")}.
\\end{itemize}

\\subsection{Technical Details}
\\begin{itemize}
  \\item \\textbf{API Access}: ${api_access
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/&/g, "\\&")}.
  \\item \\textbf{Volume}: ${volume
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/&/g, "\\&")}.
  \\item \\textbf{Priority}: ${priority
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/&/g, "\\&")}.
\\end{itemize}

\\section{Benefits}
\\begin{itemize}
  \\item \\textbf{Reduced Delays}: Automated processes eliminate manual task execution.
  \\item \\textbf{Improved Visibility}: Real-time notifications provide instant awareness.
  \\item \\textbf{Efficiency Gains}: Automation frees up your team for higher-value tasks.
  \\item \\textbf{Scalability}: Designed to handle your current volume with room for growth.
\\end{itemize}

\\section{Implementation Plan}
\\subsection{Timeline}
\\begin{itemize}
  \\item \\textbf{Week 1}: Configure API access for ${systems
    .join(" and ")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/&/g, "\\&")}.
  \\item \\textbf{Week 2}: Develop and test the automation workflow.
  \\item \\textbf{Week 3}: Deploy the solution and train your team.
  \\item \\textbf{Week 4}: Monitor performance and make adjustments.
\\end{itemize}

\\subsection{Requirements}
\\begin{itemize}
  \\item API keys for ${systems
    .join(" and ")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/&/g, "\\&")}.
  \\item Designated notification channels.
  \\item Confirmation of trigger conditions.
\\end{itemize}

\\section{Next Steps}
Please review this proposal and provide your approval by signing below.

\\section{Client Approval}
I, the undersigned, approve the proposed automation solution and authorize the Nexus App team to proceed.

\\vspace{1cm}

\\begin{tabular}{ll}
Client Name: & \\rule{8cm}{0.4pt} \\\\
Signature: & \\rule{8cm}{0.4pt} \\\\
Date: & \\rule{8cm}{0.4pt} \\\\
\\end{tabular}

\\vspace{1cm}

\\begin{tabular}{ll}
Prepared by: & Nexus App Team \\\\
Contact: & \\href{mailto:support@nexusapp.com}{support@nexusapp.com} \\\\
\\end{tabular}

\\end{document}
`;

    try {
      const proposal = await createProposal(supabase, {
        id,
        client_id,
        user_id,
        latex_content: latexContent,
        pipeline_group_id,
      });

      const documentRes = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/documents`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: client_id,
            related_id: proposal.id,
            related_type: "proposal",
            title: "ADA Proposal",
          }),
        }
      );

      if (!documentRes.ok) {
        console.error("Failed to create document");
      }

      return NextResponse.json(proposal);
    } catch (error) {
      console.error("Error creating proposal:", error);
      return NextResponse.json(
        { error: "Failed to create proposal" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating proposal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
