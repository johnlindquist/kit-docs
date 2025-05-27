// Global Generate Function Example
// This script demonstrates structured object generation using the global generate() function

// Define a schema for extracting contact information
const contactSchema = z.object({
  name: z.string().describe("Person's full name"),
  email: z.string().email().describe("Email address"),
  phone: z.string().optional().describe("Phone number if mentioned"),
  company: z.string().optional().describe("Company or organization"),
  role: z.string().optional().describe("Job title or role"),
  interests: z.array(z.string()).describe("Professional interests or expertise areas"),
  priority: z.enum(['low', 'medium', 'high']).describe("Priority level for follow-up")
})

const contact = await generate(
  'The coolest person in the world',
  contactSchema
)

// Display the structured result
await div(md(`
# Contact Information Extracted

**Name:** ${contact.name}

**Email:** ${contact.email}

**Phone:** ${contact.phone || 'Not provided'}

**Company:** ${contact.company || 'Not provided'}

**Role:** ${contact.role || 'Not provided'}

**Priority:** ${contact.priority}

**Interests:**
${contact.interests.length > 0
    ? contact.interests.map(interest => `- ${interest}`).join('\n')
    : '- None specified'
  }

      ---

* Generated using the global \`generate()\` function with Zod schema validation*
`))
