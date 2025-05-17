import type { NodeInput } from "@/types/types";

export const salesforceIntegrationNodeInputs: NodeInput[] = [
  {
    name: "operation",
    type: "string",
    required: true,
    description: "Operation to perform (create, read, update, delete, query)",
  },
  {
    name: "objectType",
    type: "string",
    required: true,
    description: "Salesforce object type (e.g., Account, Contact, Opportunity)",
  },
  {
    name: "data",
    type: "object",
    required: false,
    description: "Data for create/update operations",
  },
  {
    name: "query",
    type: "string",
    required: false,
    description: "SOQL query for query operation",
  },
  {
    name: "recordId",
    type: "string",
    required: false,
    description: "Record ID for read/update/delete operations",
  },
];

export const salesforceIntegrationNodeCode = `
// This function integrates with Salesforce to perform CRUD operations
// It would typically use the Salesforce API
async function execute(inputs, context) {
  try {
    const { operation, objectType, data, query, recordId } = inputs;
    
    await context.logger.info(\`Performing Salesforce \${operation} operation on \${objectType}\`);
    
    // In a real implementation, this would use the Salesforce API
    // For this example, we'll return mock data
    let result = {};
    
    switch (operation) {
      case 'create':
        result = {
          id: 'SF' + Math.floor(Math.random() * 1000000),
          success: true,
          created: true
        };
        break;
        
      case 'update':
        result = {
          id: recordId || 'SF' + Math.floor(Math.random() * 1000000),
          success: true,
          updated: true
        };
        break;
        
      case 'query':
        result = {
          records: [
            {
              Id: 'SF123456',
              Name: 'ACME Corp',
              Type: 'Customer',
              Industry: 'Technology'
            },
            {
              Id: 'SF123457',
              Name: 'Globex',
              Type: 'Customer',
              Industry: 'Manufacturing'
            }
          ],
          totalSize: 2,
          done: true
        };
        break;
        
      case 'delete':
        result = {
          id: recordId,
          success: true,
          deleted: true
        };
        break;
        
      default:
        throw new Error(\`Unsupported operation: \${operation}\`);
    }
    
    await context.logger.success(\`Successfully performed Salesforce \${operation} operation\`);
    
    return result;
  } catch (error) {
    await context.logger.error(\`Error in Salesforce integration: \${error.message}\`);
    throw error;
  }
}

return execute(inputs, context);
`;
