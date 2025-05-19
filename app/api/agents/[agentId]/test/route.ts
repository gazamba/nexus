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
      .select("systemprompt")
      .eq("id", agentId)
      .single();

    if (error || !agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    console.log(`agent.systemprompt: ${agent.systemprompt}`);

    const openaiMessages = [
      { role: "system", content: agent.systemprompt },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // or your preferred model
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
