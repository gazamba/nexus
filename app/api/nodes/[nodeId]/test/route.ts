import { NextRequest, NextResponse } from "next/server";
import { getNode, executeNodeCode } from "@/lib/services/node-service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ nodeId: string }> }
) {
  try {
    const { inputs, context } = await request.json();
    const { nodeId } = await params;

    const node = await getNode(nodeId);
    if (!node) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 });
    }
    if (!node.code) {
      return NextResponse.json(
        { error: "Node code not found" },
        { status: 400 }
      );
    }

    console.log(`inputs: ${JSON.stringify(inputs)}`);
    console.log(`context: ${JSON.stringify(context)}`);

    const result = await executeNodeCode(node.code, inputs, context);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error in node test route:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
