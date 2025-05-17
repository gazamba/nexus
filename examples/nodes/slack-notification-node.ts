import type { NodeInput } from "@/types/types";

export const slackNotificationNodeInputs: NodeInput[] = [
  {
    name: "channel",
    type: "string",
    required: true,
    description: "Slack channel to send the message to",
  },
  {
    name: "message",
    type: "string",
    required: true,
    description: "Message text to send",
  },
  {
    name: "blocks",
    type: "array",
    required: false,
    description: "Slack blocks for rich message formatting",
  },
  {
    name: "attachments",
    type: "array",
    required: false,
    description: "Slack attachments for additional content",
  },
  {
    name: "threadTs",
    type: "string",
    required: false,
    description: "Thread timestamp to reply to an existing message",
  },
];

export const slackNotificationNodeCode = `
// This function sends a notification to a Slack channel
// It would typically use the Slack API
async function execute(inputs, context) {
  try {
    const { channel, message, blocks, attachments } = inputs;
    
    await context.logger.info(\`Sending Slack notification to channel: \${channel}\`);
    
    // In a real implementation, this would use the Slack API
    // For this example, we'll return mock data
    const result = {
      ok: true,
      channel: channel,
      ts: new Date().getTime() / 1000,
      message: {
        text: message,
        blocks: blocks,
        attachments: attachments
      }
    };
    
    await context.logger.success(\`Successfully sent Slack notification\`);
    
    return {
      result
    };
  } catch (error) {
    await context.logger.error(\`Error sending Slack notification: \${error.message}\`);
    throw error;
  }
}

return execute(inputs, context);
`;
