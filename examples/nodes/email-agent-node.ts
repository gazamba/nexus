import type { NodeInput } from "@/types/types";

export const emailAgentNodeInputs: NodeInput[] = [
  {
    name: "to",
    type: "string",
    required: true,
    description: "Email address of the recipient",
  },
  {
    name: "subject",
    type: "string",
    required: true,
    description: "Subject line of the email",
  },
  {
    name: "body",
    type: "string",
    required: true,
    description: "Body content of the email",
  },
  {
    name: "from",
    type: "string",
    required: false,
    description: "Email address of the sender",
  },
  {
    name: "attachments",
    type: "array",
    required: false,
    description: "Array of file attachments",
  },
];

export const emailAgentNodeCode = `
// This function sends an email using an email service
// It would typically use SendGrid or similar
async function execute(inputs, context) {
  try {
    const { to, subject, body, from, attachments } = inputs;
    
    await context.logger.info(\`Sending email to: \${to}\`);
    
    // In a real implementation, this would use SendGrid or similar
    // For this example, we'll return mock data
    const result = {
      success: true,
      messageId: \`\${Math.random().toString(36).substring(2, 15)}\`,
      to,
      from: from || 'nexus@example.com',
      subject,
      body: body.substring(0, 50) + (body.length > 50 ? '...' : '')
    };
    
    await context.logger.success(\`Successfully sent email to \${to}\`);
    
    return {
      result
    };
  } catch (error) {
    await context.logger.error(\`Error sending email: \${error.message}\`);
    throw error;
  }
}

return execute(inputs, context);
`;
