import { MarkdownFile } from './types';

// This acts as the "Database" for the Archive
export const INITIAL_KNOWLEDGE_BASE: MarkdownFile[] = [
  {
    path: "/Bio/Main_Bio.md",
    category: "Bio",
    lastUpdated: "2024-05-22",
    content: `# Main Bio

Colton Batts is a filmmaker and designer based in Fort Worth, Texas, specializing in video editing, motion graphics, and creative-tech workflows. After years working in corporate design, he shifted into freelance work under Alternative Design LLC, where he helps brands and studios produce clean, effective visuals and streamlined content systems.

His focus is on delivering work that makes clients look good fast — balancing craft and speed with modern production tools, including AI-assisted editing and automation where it helps. Recent work includes post-production and motion design across commercial, corporate, and social campaigns, with clients such as Under Armour and Google.

Colton’s strengths include editing, motion design, branding, and building systems that reduce production bottlenecks. He cares about clarity, creativity, and helping teams move from messy first drafts to polished final delivery without drama.

He is currently taking on new freelance work in post-production, content creation, and design.`
  },
  {
    path: "/Brand/Positioning.md",
    category: "Brand",
    lastUpdated: "2024-05-22",
    content: `# Positioning

## Who I Help
Mid-sized brands, creative studios, and independent founders who need high-quality video content delivered quickly and consistently.

## The Core Value
I bridge creative vision and execution: fast turnaround, strong taste, modern workflows.

## What Makes This Different
- Experience in both corporate and independent creative environments
- Systems-driven approach that reduces friction and revision cycles
- Ability to integrate AI tools without compromising quality or craft
- Hands-on production mindset: I edit, design, animate, and solve problems

## The Promise
Clear communication. Clean visuals. On-time delivery.

## Results
Projects that feel polished, consistent, and aligned with the brand — without the typical chaos of production.`
  },
  {
    path: "/Bio/Skills_Stack.md",
    category: "Bio",
    lastUpdated: "2024-05-22",
    content: `# Skills Stack

## Core Strengths
- Video editing (Premiere Pro, DaVinci Resolve)
- Motion graphics and title design (After Effects)
- Brand and content design (Photoshop, Illustrator)
- Story structure, pacing, and editorial clarity
- Thumbnail and social asset design for high engagement

## Workflow & Technology
- AI-assisted post-production and automation
- LLM-powered creative workflows (Gemini, Claude, ChatGPT)
- Asset organization and versioning systems
- Cloud collaboration for remote teams

## Additional Capabilities
- Light 3D integration for motion design
- Sound design support for small teams
- Content strategy input where helpful

## Current Focus Areas
- Faster iterative editing for high-volume social content
- Developing modular brand systems for repeat campaigns
- Helping clients adopt efficient creative-tech workflows`
  }
];

export const SYSTEM_INSTRUCTION_HEADER = `
### ROLE & OBJECTIVE
You are the "Colton Archive," a digital knowledge assistant for Colton Batts. Your purpose is to retrieve and manage professional data. You are efficient, precise, and professional.

### CORE BEHAVIORS
1. **Brand Guardian:** Adhere to the professional tone found in /Brand/Positioning.md.
2. **Source Citation:** When providing facts, reference the source file (e.g., [Ref: /Bio/Main_Bio.md]).
3. **Constructive Gaps:** If asked about a topic not in the database, state clearly that the record is missing, but suggest *where* it should be added.
4. **Formatting:** Use Markdown. Bold key terms.

### PERSONALITY
- You are NOT a robot. You are an extension of Colton's professional intent.
- Be concise.
`;