import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from "uuid";
import { createProposal } from "@/lib/services/proposal-service";

const escapeHTML = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

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
    const workflow_type = workflow.name || "Unnamed Workflow";
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

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Client Automation Proposal</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Noto Sans', sans-serif;
      margin: 1in;
      font-size: 12pt;
      line-height: 1.5;
    }
    .page {
      page-break-after: always;
      min-height: 10in;
    }
    .title-page {
      text-align: center;
      padding-top: 2cm;
    }
    .title {
      font-size: 36pt;
      font-weight: bold;
      margin-bottom: 1cm;
    }
    .subtitle {
      font-size: 18pt;
      margin: 0.5cm 0;
    }
    .small {
      font-size: 14pt;
    }
    h1 {
      font-size: 18pt;
      font-weight: bold;
      margin-top: 1em;
    }
    h2 {
      font-size: 14pt;
      font-weight: bold;
      margin-top: 1em;
    }
    ul {
      margin-left: 20px;
      list-style-type: disc;
    }
    .header {
      position: running(header);
      font-size: 10pt;
      display: flex;
      justify-content: space-between;
    }
    .footer {
      position: running(footer);
      font-size: 10pt;
      text-align: center;
    }
    @page {
      @top-left { content: element(header); }
      @bottom-center { content: element(footer); counter-increment: page; content: "Page " counter(page) " of " counter(pages); }
    }
    table.signature {
      width: 100%;
      margin-top: 1cm;
    }
    table.signature td {
      width: 50%;
    }
    table.signature td.line {
      border-bottom: 1pt solid black;
    }
    a {
      color: #0000EE;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="header">
    <span>Nexus App</span>
    <span>${new Date().toLocaleDateString()}</span>
  </div>
  <div class="footer"></div>
  <div class="page title-page">
    <div class="title">Client Automation Proposal</div>
    <div class="subtitle">Prepared for Client ID: ${escapeHTML(client_id)}</div>
    <div class="small">Prepared by: Nexus App Team</div>
    <div class="small">${new Date().toLocaleDateString()}</div>
    <div class="small" style="margin-top: 2cm;">
      Nexus App<br>
      A platform that automates client workflows by generating custom code and AI agents from survey data and documentation.
    </div>
  </div>
  <div class="page">
    <h1>Executive Summary</h1>
    <p>This proposal outlines an automation solution tailored to address the specific needs and pain points identified in your workflow. The Nexus App team proposes an automated system to streamline your ${escapeHTML(
      workflow_type
    )} process by integrating ${escapeHTML(
      systems.join(" and ")
    )}, ensuring efficient task execution and notifications.</p>
    <h1>Current Workflow and Pain Points</h1>
    <h2>Current Process</h2>
    <p>${escapeHTML(current_process)}</p>
    <h2>Pain Points</h2>
    <p>The following challenges have been identified:</p>
    <ul>
      ${pain_points
        .map((point: string) => `<li>${escapeHTML(point)}</li>`)
        .join("\n      ")}
    </ul>
    <h1>Proposed Automation Solution</h1>
    <h2>Overview</h2>
    <p>We propose an automation workflow that streamlines your processes by integrating with ${escapeHTML(
      systems.join(" and ")
    )} to deliver ${escapeHTML(outputs.join(" and "))}.</p>
    <h2>Key Components</h2>
    <ul>
      <li><b>Trigger:</b> ${escapeHTML(triggers.join(", "))}</li>
      <li><b>Systems Involved:</b>
        <ul>
          ${systems
            .map((system: string) => `<li>${escapeHTML(system)}</li>`)
            .join("\n          ")}
        </ul>
      </li>
      <li><b>Output:</b> ${escapeHTML(outputs.join(", "))}</li>
      <li><b>Agent Interaction:</b> Notifications via ${escapeHTML(
        agent_interaction.join(", ")
      )}</li>
    </ul>
    <h2>Technical Details</h2>
    <ul>
      <li><b>API Access:</b> ${escapeHTML(api_access)}</li>
      <li><b>Volume:</b> ${escapeHTML(volume)}</li>
      <li><b>Priority:</b> ${escapeHTML(priority)}</li>
    </ul>
    <h1>Benefits</h1>
    <ul>
      <li><b>Reduced Delays:</b> Automated processes eliminate manual task execution.</li>
      <li><b>Improved Visibility:</b> Real-time notifications provide instant awareness.</li>
      <li><b>Efficiency Gains:</b> Automation frees up your team for higher-value tasks.</li>
      <li><b>Scalability:</b> Designed to handle your current volume with room for growth.</li>
    </ul>
    <h1>Implementation Plan</h1>
    <h2>Timeline</h2>
    <ul>
      <li><b>Week 1:</b> Configure API access for ${escapeHTML(
        systems.join(" and ")
      )}.</li>
      <li><b>Week 2:</b> Develop and test the automation workflow.</li>
      <li><b>Week 3:</b> Deploy the solution and train your team.</li>
      <li><b>Week 4:</b> Monitor performance and make adjustments.</li>
    </ul>
    <h2>Requirements</h2>
    <ul>
      <li>API keys for ${escapeHTML(systems.join(" and "))}</li>
      <li>Designated notification channels</li>
      <li>Confirmation of trigger conditions</li>
    </ul>
    <h1>Next Steps</h1>
    <p>Please review this proposal and provide your approval by signing below.</p>
    <h1>Client Approval</h1>
    <p>I, the undersigned, approve the proposed automation solution and authorize the Nexus App team to proceed.</p>
    <table class="signature">
      <tr><td>Client Name:</td><td class="line"></td></tr>
      <tr><td>Signature:</td><td class="line"></td></tr>
      <tr><td>Date:</td><td class="line"></td></tr>
    </table>
    <table class="signature">
      <tr><td>Prepared by:</td><td>Nexus App Team</td></tr>
      <tr><td>Contact:</td><td><a href="mailto:support@nexusapp.com">support@nexusapp.com</a></td></tr>
    </table>
  </div>
</body>
</html>
`;

    try {
      const proposal = await createProposal({
        id,
        client_id,
        user_id,
        html_content: htmlContent,
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
