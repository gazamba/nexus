import type { NodeInput } from "@/types/types";

export const emailMonitorNodeInputs: NodeInput[] = [
  {
    name: "emailAccount",
    type: "string",
    required: true,
    description: "Email account to monitor",
  },
  {
    name: "searchCriteria",
    type: "string",
    required: true,
    description: "Search criteria for filtering emails",
  },
  {
    name: "maxResults",
    type: "number",
    required: false,
    description: "Maximum number of emails to process",
  },
];

export const emailMonitorNodeCode = `
// This function monitors an email inbox and returns new emails
// It would typically use Gmail API or Microsoft Graph API
async function execute(inputs, context) {
  try {
    const { emailAccount, searchCriteria, maxResults } = inputs;
    
    await context.logger.info(\`Monitoring email account: \${emailAccount}\`);
    
    // In a real implementation, this would use the Gmail API or Microsoft Graph API
    // For this example, we'll return mock data
    const mockEmails = [
      {
        id: 'email1',
        subject: 'New Invoice #12345',
        from: 'accounting@example.com',
        date: new Date().toISOString(),
        body: 'Please find attached the invoice #12345',
        attachments: [
          {
            filename: 'invoice-12345.pdf',
            contentType: 'application/pdf',
            content: 'base64encodedcontent'
          }
        ]
      },
      {
        id: 'email2',
        subject: 'Customer Inquiry',
        from: 'customer@example.com',
        date: new Date().toISOString(),
        body: 'I have a question about my recent order',
        attachments: []
      }
    ];
    
    await context.logger.success(\`Retrieved \${mockEmails.length} emails\`);
    
    return {
      emails: mockEmails
    };
  } catch (error) {
    await context.logger.error(\`Error monitoring email: \${error.message}\`);
    throw error;
  }
}

return execute(inputs, context);
`;
