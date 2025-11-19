import { MarkdownFile } from './types';

// This acts as the "Database" for the Archive
export const INITIAL_KNOWLEDGE_BASE: MarkdownFile[] = [
  {
    path: "/Brand/Voice_Guidelines.md",
    category: "Brand",
    lastUpdated: "2024-10-01",
    content: `# Brand Voice Guidelines [DRAFT]

## Core Principles
1. **Clarity Over Cleverness:** We prioritize understanding.
2. **Technical Precision:** Use correct terminology. Do not oversimplify engineering concepts.
3. **Minimalist Professionalism:** Tone is objective, efficient, and helpful.

## Formatting Standards
- Headers are functional.
- Lists are preferred for data.
- Code snippets must include language tags.
`
  },
  {
    path: "/Bio/Profile.md",
    category: "Bio",
    lastUpdated: "2024-10-01",
    content: `# Professional Profile [TEMPLATE]

## Summary
[Insert 2-3 sentences about your current focus, e.g., Full Stack Engineer specializing in AI integration...]

## Core Competencies
- **Frontend:** React ecosystem, UI/UX Systems
- **Backend:** Scalable Node.js/Go architectures
- **Strategy:** Product Lifecycle Management
`
  },
  {
    path: "/Projects/Current_Work.md",
    category: "Projects",
    lastUpdated: "2024-10-05",
    content: `# Active Projects

## Project A: [Name]
**Status:** In Development
**Tech Stack:** Next.js, Gemini API, Tailwind
**Notes:**
- Currently refining the integration layer.
- Needs performance audit on the vector search.

## Project B: [Name]
**Status:** Concept Phase
**Notes:**
- Researching feasibility of edge computing solution.
`
  },
  {
    path: "/Philosophy/Engineering.md",
    category: "Philosophy",
    lastUpdated: "2023-11-10",
    content: `# Engineering Philosophy

## Simplicity
"Complexity is the enemy of reliability."

## User Centricity
- Speed is a feature.
- Accessibility is a requirement, not an add-on.
- Aesthetic minimalism reduces cognitive load.
`
  }
];

export const SYSTEM_INSTRUCTION_HEADER = `
### ROLE & OBJECTIVE
You are the "Colton Archive," a digital knowledge assistant for Colton Batts. Your purpose is to retrieve and manage professional data. You are efficient, precise, and professional.

### CORE BEHAVIORS
1. **Brand Guardian:** Adhere to the professional tone found in /Brand/Voice_Guidelines.md.
2. **Source Citation:** When providing facts, reference the source file (e.g., [Ref: /Bio/Profile.md]).
3. **Gap Analysis:** If information is missing from the knowledge base, simply state: "Data not found in current archive."
4. **Content Generation:** If asked to draft content, stick to the minimal, high-contrast aesthetic described in the design ethos.

### STYLE
- **Professional & Direct**
- **No Roleplay:** Do not use phrases like "Sentinel Online" or "System Failure". Speak naturally but concisely.
`;