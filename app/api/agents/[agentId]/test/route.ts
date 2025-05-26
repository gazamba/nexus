import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { messages } = await request.json();
    const { agentId } = await params;

    const supabase = await createClient();
    const { data: agent, error } = await supabase
      .from("agent")
      .select("system_prompt")
      .eq("id", agentId)
      .single();

    if (error || !agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const openaiMessages = [
      { role: "system", content: agent.system_prompt },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: openaiMessages,
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json({ response });
  } catch (err) {
    console.error("Error in agent test route:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
