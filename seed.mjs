import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://gbcigenlvchpphlbtfnr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2lnZW5sdmNocHBobGJ0Zm5yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTg4NjM0MCwiZXhwIjoyMDg1NDYyMzQwfQ.mByYBLugKfT2q-z7H3RX6okhviO15rgKYqqX1ORAR58"
);

const prompts = [
  {
    title: "Senior Code Reviewer",
    prompt_text: "Act as a senior software engineer doing a code review. Analyze the following code for bugs, performance issues, security vulnerabilities, and readability. Provide specific line-by-line feedback with severity ratings (critical, warning, suggestion). End with a summary and overall quality score from 1-10.\n\nCode:\n{paste code here}",
    category: "Coding",
    tags: ["code-review", "debugging", "best-practices"],
    is_public: true, copies: 42
  },
  {
    title: "SQL Query Optimizer",
    prompt_text: "You are a database performance expert. I will give you a SQL query and the table schema. Analyze the query for performance bottlenecks, suggest index improvements, and rewrite the query for optimal execution. Explain each optimization and estimate the performance improvement.\n\nSchema:\n{paste schema}\n\nQuery:\n{paste query}",
    category: "Coding",
    tags: ["sql", "database", "performance"],
    is_public: true, copies: 31
  },
  {
    title: "Blog Post Writer (SEO Optimized)",
    prompt_text: "Write a 1500-word blog post about [TOPIC]. Requirements:\n- Use the keyword [KEYWORD] naturally 5-8 times\n- Include an engaging hook in the first paragraph\n- Use H2 and H3 subheadings for structure\n- Add a meta description (under 155 characters)\n- Include a call-to-action at the end\n- Write in a conversational but authoritative tone\n- Add 3 internal linking opportunities marked as [INTERNAL LINK: topic]\n\nTopic: {your topic}\nKeyword: {your keyword}",
    category: "Writing",
    tags: ["seo", "blogging", "content-marketing"],
    is_public: true, copies: 67
  },
  {
    title: "Cold Email That Gets Replies",
    prompt_text: "Write a cold email to [RECIPIENT ROLE] at [COMPANY TYPE]. The goal is to [OBJECTIVE]. Follow these rules:\n- Subject line under 6 words, curiosity-driven\n- First line references something specific about them (leave a placeholder)\n- Body is under 100 words\n- One clear ask, easy to say yes to\n- No fluff, no \"I hope this finds you well\"\n- PS line with social proof or urgency\n\nWrite 3 variations with different angles.",
    category: "Business",
    tags: ["email", "sales", "outreach"],
    is_public: true, copies: 89
  },
  {
    title: "Product Launch Announcement",
    prompt_text: "Create a product launch announcement for [PRODUCT NAME]. Include:\n1. A punchy headline (under 10 words)\n2. A 2-sentence elevator pitch\n3. Three key benefits (not features) with one-line explanations\n4. Social proof element (placeholder for testimonial/stat)\n5. Clear CTA\n6. Adapt this into: tweet thread (5 tweets), LinkedIn post, and email subject + preview text\n\nProduct: {describe your product}\nAudience: {target audience}",
    category: "Marketing",
    tags: ["launch", "copywriting", "social-media"],
    is_public: true, copies: 54
  },
  {
    title: "Worldbuilding Assistant",
    prompt_text: "Help me build a fictional world. Start by asking me 5 foundational questions about the world I want to create (genre, scale, magic/tech level, core conflict, time period). Then generate:\n- A 200-word world overview\n- 3 major factions with motivations\n- A brief history timeline (5 key events)\n- 2 unique cultural details that make this world feel lived-in\n- A map description of the major regions\n\nAfter presenting this, ask what I want to explore deeper.",
    category: "Creative",
    tags: ["worldbuilding", "fiction", "writing"],
    is_public: true, copies: 38
  },
  {
    title: "React Component Generator",
    prompt_text: "Generate a production-ready React component based on this description: [DESCRIPTION]\n\nRequirements:\n- TypeScript with proper type definitions\n- Tailwind CSS for styling\n- Accessible (proper ARIA attributes, keyboard navigation)\n- Responsive design\n- Include loading and error states\n- Add JSDoc comments for props\n- Include a usage example\n\nDo not use any external dependencies beyond React and Tailwind.",
    category: "Coding",
    tags: ["react", "typescript", "frontend"],
    is_public: true, copies: 73
  },
  {
    title: "Meeting Notes to Action Items",
    prompt_text: "Convert these meeting notes into a structured summary:\n\n1. Meeting title and date\n2. Attendees (extract from context)\n3. Key decisions made (bullet points)\n4. Action items table: | Owner | Task | Deadline | Priority |\n5. Open questions that need follow-up\n6. Next meeting agenda suggestions\n\nKeep it concise. Flag any conflicting statements or unclear ownership.\n\nMeeting notes:\n{paste notes here}",
    category: "Productivity",
    tags: ["meetings", "productivity", "organization"],
    is_public: true, copies: 61
  },
  {
    title: "Competitor Analysis Framework",
    prompt_text: "Analyze [COMPETITOR] as a competitor to my business [MY BUSINESS]. Create a structured analysis:\n\n1. Product comparison matrix (features, pricing, target market)\n2. Their strengths I should be aware of\n3. Their weaknesses I can exploit\n4. Their messaging and positioning strategy\n5. Customer sentiment summary (based on what you know)\n6. Three strategic moves I could make to differentiate\n7. What they might do next (predict their roadmap)\n\nBe specific and actionable, not generic.",
    category: "Business",
    tags: ["strategy", "competitive-analysis", "market-research"],
    is_public: true, copies: 45
  },
  {
    title: "Twitter Thread Writer",
    prompt_text: "Write a viral Twitter/X thread about [TOPIC]. Rules:\n- First tweet is a bold hook that stops the scroll (under 200 chars)\n- 8-12 tweets total\n- Each tweet stands alone but builds on the narrative\n- Use concrete numbers and examples, not vague claims\n- Include one contrarian take\n- End with a summary tweet and CTA\n- No hashtags in the thread (add 3 suggested ones at the end)\n- Write like a smart friend explaining something, not a guru\n\nTopic: {your topic}",
    category: "Marketing",
    tags: ["twitter", "social-media", "viral-content"],
    is_public: true, copies: 82
  },
  {
    title: "Short Story from a Single Sentence",
    prompt_text: "Write a complete short story (800-1200 words) based on this premise: [PREMISE]\n\nRequirements:\n- Start in the middle of the action\n- Include exactly one plot twist\n- End on an image, not an explanation\n- Use sensory details (at least 3 senses)\n- Dialogue should reveal character, not just convey information\n- The theme should emerge naturally, never stated directly\n\nGenre preference: {genre or 'surprise me'}",
    category: "Creative",
    tags: ["fiction", "short-story", "creative-writing"],
    is_public: true, copies: 29
  },
  {
    title: "Learn Any Concept (Feynman Method)",
    prompt_text: "Explain [CONCEPT] using the Feynman technique. Follow these steps:\n\n1. Explain it like I am 12 years old, using everyday analogies\n2. Identify the 3 most important ideas and rank them\n3. Give a real-world example that makes it click\n4. What is the most common misconception about this topic?\n5. How does this connect to [RELATED FIELD] (suggest one if I do not specify)\n6. Give me 3 progressively harder questions to test my understanding\n\nConcept: {your concept}",
    category: "Learning",
    tags: ["education", "learning", "explanation"],
    is_public: true, copies: 56
  },
  {
    title: "API Documentation Writer",
    prompt_text: "Generate comprehensive API documentation for the following endpoint(s). Include:\n- Endpoint URL and method\n- Description (one sentence)\n- Authentication requirements\n- Request parameters (path, query, body) in a table\n- Request example (curl and JavaScript fetch)\n- Response schema with types\n- Response example (success and error)\n- Rate limits if applicable\n- Common error codes and troubleshooting\n\nEndpoint details:\n{paste your endpoint info}",
    category: "Coding",
    tags: ["api", "documentation", "developer-tools"],
    is_public: true, copies: 34
  },
  {
    title: "Weekly Newsletter Writer",
    prompt_text: "Write a weekly newsletter for my [INDUSTRY/NICHE] audience. Structure:\n- Subject line (A/B test: give 2 options)\n- Preview text (under 90 chars)\n- Opening hook tied to a current event or trend\n- Main story (200 words, one key insight)\n- 3 curated links with one-line commentary each\n- Quick tip or tool recommendation\n- Sign-off with a question to drive replies\n\nTone: Smart, concise, slightly opinionated. No fluff.\n\nNiche: {your niche}\nThis week's theme: {theme or 'pick one'}",
    category: "Marketing",
    tags: ["newsletter", "email-marketing", "content"],
    is_public: true, copies: 41
  }
];

const { data, error } = await supabase.from("prompts").insert(prompts).select("id, title");
if (error) console.error("Error:", error);
else console.log(`Seeded ${data.length} prompts`);
