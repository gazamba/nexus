import type { NodeInput } from "@/types/types";

export const pdfParserNodeInputs: NodeInput[] = [
  {
    name: "source",
    type: "string",
    required: true,
    description: "Path to the PDF file or base64 encoded PDF data",
  },
  {
    name: "extractionType",
    type: "string",
    required: false,
    description: "Type of data to extract (text, tables, forms, all)",
  },
];

export const pdfParserNodeCode = `
// This function parses a PDF file and extracts text, form data, or tables
// It would typically use a PDF parsing library
async function execute(inputs, context) {
  try {
    const { source, extractionType } = inputs;
    
    await context.logger.info(\`Parsing PDF with extraction type: \${extractionType}\`);
    
    // In a real implementation, this would use a PDF parsing library
    // For this example, we'll return mock data
    let result = {};
    
    if (extractionType === 'text' || extractionType === 'all') {
      result.text = \`
Invoice #12345
Date: 01/15/2023
Customer: ACME Corp
Amount: $1,250.00

Item 1: Widget A - $500.00
Item 2: Widget B - $750.00

Total: $1,250.00
\`;
    }
    
    if (extractionType === 'form' || extractionType === 'all') {
      result.formData = {
        invoiceNumber: '12345',
        date: '01/15/2023',
        customer: 'ACME Corp',
        amount: 1250.00
      };
    }
    
    if (extractionType === 'table' || extractionType === 'all') {
      result.tables = [
        {
          headers: ['Item', 'Description', 'Price'],
          rows: [
            ['1', 'Widget A', '$500.00'],
            ['2', 'Widget B', '$750.00']
          ]
        }
      ];
    }
    
    await context.logger.success(\`Successfully parsed PDF\`);
    
    return result;
  } catch (error) {
    await context.logger.error(\`Error parsing PDF: \${error.message}\`);
    throw error;
  }
}

return execute(inputs, context);
`;
