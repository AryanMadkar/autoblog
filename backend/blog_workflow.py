from typing import TypedDict, List
from langgraph.graph import StateGraph, END
from langchain_groq import ChatGroq
from config import get_settings
import urllib.parse
from langchain_core.messages import SystemMessage, HumanMessage
from pydantic import SecretStr
import hashlib
from datetime import datetime

setting = get_settings()
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=SecretStr(setting.groq_api_key),
    max_retries=2,
    temperature=0.7,  # Reduced for more focused output
    max_tokens=4096,
)


class BlogState(TypedDict):
    topic: str
    title: str
    content: str
    tags: List[str]
    category: str
    image_prompt: str
    image_url: str
    short_image_id: str


def generate_topic(state: BlogState) -> BlogState:
    """Generate trending, high-quality blog topic with specific constraints"""
    messages = [
        SystemMessage(
            content="""You are an expert content strategist specializing in trending topics.

**Task**: Generate ONE highly specific, trending topic for a blog post
**Requirements**:
- Topic must be recent and relevant to 2025
- Focus on: AI, Technology, Web Development, Software Engineering, or Career Growth
- Topic should be specific, not generic (e.g., "AI Agent Orchestration with LangGraph" not just "AI")
- Must have practical value for readers
- Should be searchable and SEO-friendly

**Format**: Return ONLY the topic as a single clear sentence, no explanations or bullet points.
**Length**: 8-15 words maximum"""
        ),
        HumanMessage(
            content=f"Generate a trending, specific blog topic for {datetime.now().strftime('%B %Y')}"
        ),
    ]
    response = llm.invoke(messages)
    state["topic"] = response.content.strip().strip('"')
    return state


def generate_title(state: BlogState) -> BlogState:
    """Generate SEO-optimized, click-worthy title"""
    messages = [
        SystemMessage(
            content="""You are an expert SEO copywriter and headline specialist.

**Task**: Create a compelling blog post title
**Requirements**:
- Include power words (e.g., Ultimate, Complete, Essential, Revolutionary)
- Add numbers when relevant (e.g., "7 Ways...", "Complete Guide...")
- Make it specific and benefit-focused
- Keep it between 50-60 characters for SEO
- Must create curiosity while being informative
- Use title case formatting

**Format**: Return ONLY the title, nothing else
**Avoid**: Clickbait, vague terms, or overly complex language"""
        ),
        HumanMessage(
            content=f"""Create an SEO-optimized title for this topic:

Topic: {state['topic']}

Focus: Make it compelling, specific, and search-friendly."""
        ),
    ]
    response = llm.invoke(messages)
    state["title"] = response.content.strip().strip('"')
    return state


def generate_content(state: BlogState) -> BlogState:
    """Generate comprehensive, well-structured blog content"""
    messages = [
        SystemMessage(
            content="""You are a professional technical blog writer with expertise in creating engaging, informative content.

**Task**: Write a comprehensive blog post
**Structure Requirements**:
1. **Introduction** (2-3 paragraphs): Hook the reader, explain why this matters, preview key points
2. **Main Content** (4-6 sections with subheadings): 
   - Use ## for main headings
   - Each section: 2-4 paragraphs
   - Include practical examples, use cases, or code snippets where relevant
   - Add actionable insights
3. **Key Takeaways/Best Practices** (bullet points): 3-5 clear takeaways
4. **Conclusion** (1-2 paragraphs): Summarize value, call-to-action

**Writing Style**:
- Professional yet conversational tone
- Use short paragraphs (3-4 sentences max)
- Mix short and longer sentences for rhythm
- Include transition phrases
- Back claims with reasoning
- Use analogies for complex concepts

**Content Quality**:
- Be specific with examples and numbers
- Provide actionable advice
- Show expertise without jargon overload
- Focus on practical value

**Length**: 800-1200 words
**Format**: Use proper Markdown formatting for headings and lists"""
        ),
        HumanMessage(
            content=f"""Write a detailed, expert-level blog post:

**Topic**: {state['topic']}
**Title**: {state['title']}

Create engaging, valuable content that demonstrates expertise while remaining accessible."""
        ),
    ]
    response = llm.invoke(messages)
    state["content"] = response.content.strip()
    return state


def generate_metadata(state: BlogState) -> BlogState:
    """Generate accurate, relevant metadata"""
    messages = [
        SystemMessage(
            content="""You are an SEO metadata specialist.

**Task**: Generate optimized tags and category
**Requirements**:
- Tags must be specific, searchable keywords (not generic words)
- Mix of broad and niche tags
- Tags should match what users actually search for
- Category must be ONE of: Technology, AI/ML, Web Development, Software Engineering, Career, Tutorial, Guide, News

**Format** (STRICT):
TAGS: tag1, tag2, tag3, tag4, tag5
CATEGORY: Category_Name

**Example**:
TAGS: LangGraph, AI Agents, Python Automation, Workflow Orchestration, LLM Development
CATEGORY: AI/ML"""
        ),
        HumanMessage(
            content=f"""Generate metadata for this blog:

**Title**: {state['title']}
**First 500 characters**: {state['content'][:500]}

Provide 5 specific, searchable tags and one category."""
        ),
    ]
    response = llm.invoke(messages)
    metadata = response.content.strip()

    tags = []
    category = "Technology"

    for line in metadata.split("\n"):
        line = line.strip()
        if line.startswith("TAGS:"):
            tags = [tag.strip() for tag in line.replace("TAGS:", "").split(",")]
        elif line.startswith("CATEGORY:"):
            category = line.replace("CATEGORY:", "").strip()

    state["tags"] = tags[:5] if tags else ["blog", "technology", "programming"]
    state["category"] = category
    return state


def generate_image_prompt(state: BlogState) -> BlogState:
    """Generate detailed, visual image prompt"""
    messages = [
        SystemMessage(
            content="""You are an expert at creating image generation prompts for blog thumbnails.

**Task**: Create a detailed visual prompt for an AI image generator
**Requirements**:
- Describe the main visual elements clearly
- Include style guidance (e.g., modern, minimalist, professional, tech-themed)
- Specify colors or mood if relevant
- Make it visually appealing and professional
- Keep it concise but descriptive (20-40 words)

**Format**: Return ONLY the image prompt, no explanations
**Avoid**: Text overlays, specific people, copyrighted characters"""
        ),
        HumanMessage(
            content=f"""Create an image generation prompt for this blog thumbnail:

**Title**: {state['title']}
**Category**: {state['category']}

Focus: Professional, eye-catching, relevant to the topic."""
        ),
    ]
    response = llm.invoke(messages)
    state["image_prompt"] = response.content.strip().strip('"')
    return state


def generate_image(state: BlogState) -> BlogState:
    """Generate blog image with shortened URL"""
    # Create full Pollinations AI URL
    encoded_prompt = urllib.parse.quote(state["image_prompt"])
    full_image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1200&height=630&nologo=true&enhance=true"

    # Generate short hash ID for the URL
    hash_object = hashlib.sha256(state["image_prompt"].encode())
    short_id = hash_object.hexdigest()[:8]  # 8 character hash

    state["image_url"] = full_image_url
    state["short_image_id"] = short_id
    return state


# Build the workflow graph
workflow = StateGraph(BlogState)

# Add all nodes
workflow.add_node("generate_topic", generate_topic)
workflow.add_node("generate_title", generate_title)
workflow.add_node("generate_content", generate_content)
workflow.add_node("generate_metadata", generate_metadata)
workflow.add_node("generate_image_prompt", generate_image_prompt)
workflow.add_node("generate_image", generate_image)

# Define the sequential flow
workflow.set_entry_point("generate_topic")
workflow.add_edge("generate_topic", "generate_title")
workflow.add_edge("generate_title", "generate_content")
workflow.add_edge("generate_content", "generate_metadata")
workflow.add_edge("generate_metadata", "generate_image_prompt")
workflow.add_edge("generate_image_prompt", "generate_image")
workflow.add_edge("generate_image", END)

# Compile the workflow
blog_graph = workflow.compile()


def create_blog_post() -> dict:
    """Run the complete enhanced blog generation workflow"""
    initial_state = BlogState(
        topic="",
        title="",
        content="",
        tags=[],
        category="",
        image_prompt="",
        image_url="",
        short_image_id="",
    )

    result = blog_graph.invoke(initial_state)
    return result
