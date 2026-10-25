import re
from typing import List, Tuple
from app.schemas import PromptAnalysis


ROLE_PATTERNS = [
    r"\bact as\b",
    r"\byou are an?\b",
    r"\bassume the role\b",
    r"\bas an? \w+\b",
    r"\bfrom the perspective of\b",
]

TASK_VERBS = [
    r"\bexplain\b",
    r"\bdescribe\b",
    r"\banalyze\b",
    r"\bcompare\b",
    r"\bcontrast\b",
    r"\bsummarize\b",
    r"\bgenerate\b",
    r"\bcreate\b",
    r"\bdesign\b",
    r"\bdevelop\b",
    r"\bwrite\b",
    r"\bimplement\b",
    r"\bevaluate\b",
    r"\bcritique\b",
    r"\bsolve\b",
    r"\boutline\b",
    r"\btranslate\b",
]

AUDIENCE_PATTERNS = [
    r"\bbeginners?\b",
    r"\bnovices?\b",
    r"\bstudents?\b",
    r"\bexperts?\b",
    r"\bengineers?\b",
    r"\bdevelopers?\b",
    r"\bexecutives?\b",
    r"\bprofessionals?\b",
    r"\bchildren\b",
    r"\bkids?\b",
    r"\bgeneral audience\b",
    r"\bnon-technical\b",
    r"\bundergraduates?\b",
]

FORMAT_PATTERNS = [
    r"\btables?\b",
    r"\bbullet points?\b",
    r"\blists?\b",
    r"\bstep-by-step\b",
    r"\bjson\b",
    r"\bmarkdown\b",
    r"\bcode\b",
    r"\bpseudocode\b",
    r"\bnumbered list\b",
    r"\bstructure\b",
    r"\bcomparison table\b",
    r"\bcsv\b",
]

CONSTRAINT_PATTERNS = [
    r"\bdo not\b",
    r"\bdon't\b",
    r"\bavoid\b",
    r"\blimit to\b",
    r"\bmaximum\b",
    r"\bminimum\b",
    r"\bwithin \d+\b",
    r"\bunder \d+ words\b",
    r"\bstrictly\b",
    r"\bwithout\b",
    r"\bkeep it concise\b",
    r"\bonly include\b",
    r"\bdo not include\b",
]

EXAMPLE_PATTERNS = [
    r"\bexamples?\b",
    r"\breal-world\b",
    r"\bcase stud(y|ies)\b",
    r"\bsamples?\b",
    r"\billustrat(e|ion|ions)\b",
    r"\buse cases?\b",
]


def analyze_prompt_structure(prompt: str) -> PromptAnalysis:
    """
    Performs surface-level structural analysis of prompt text.
    Independent of neural network inference.
    """
    lower = prompt.lower()
    words = re.findall(r"\b\w+\b", prompt)
    word_count = len(words)
    char_count = len(prompt)

    has_role_or_context = any(re.search(pat, lower) for pat in ROLE_PATTERNS)
    has_task_instruction = any(re.search(pat, lower) for pat in TASK_VERBS)
    has_audience = any(re.search(pat, lower) for pat in AUDIENCE_PATTERNS)
    has_format_specification = any(re.search(pat, lower) for pat in FORMAT_PATTERNS)
    has_constraints = any(re.search(pat, lower) for pat in CONSTRAINT_PATTERNS)
    has_examples_request = any(re.search(pat, lower) for pat in EXAMPLE_PATTERNS)

    # Breadth category
    elements_present = sum([
        has_role_or_context,
        has_task_instruction,
        has_audience,
        has_format_specification,
        has_constraints,
        has_examples_request,
    ])

    if elements_present >= 4 and word_count >= 20:
        structural_breadth = "Comprehensive"
    elif elements_present >= 2 and word_count >= 10:
        structural_breadth = "Moderate"
    elif word_count >= 5:
        structural_breadth = "Basic"
    else:
        structural_breadth = "Minimal"

    return PromptAnalysis(
        word_count=word_count,
        char_count=char_count,
        has_role_or_context=has_role_or_context,
        has_task_instruction=has_task_instruction,
        has_audience=has_audience,
        has_format_specification=has_format_specification,
        has_constraints=has_constraints,
        has_examples_request=has_examples_request,
        structural_breadth=structural_breadth,
    )


def generate_independent_suggestions(prompt: str, analysis: PromptAnalysis) -> List[str]:
    """
    Generate transparent, conditional writing suggestions based on general
    prompt-engineering best practices.

    NOTE: These suggestions are generated independently from the BiLSTM model.
    They do not represent internal feature activations or sub-rubric scores.
    """
    suggestions: List[str] = []

    # Check 1: Extreme brevity / vagueness
    if analysis.word_count < 6:
        suggestions.append(
            "Your prompt is very brief. Adding specific context and objectives helps AI produce more focused responses."
        )

    # Check 2: Persona / Context
    if not analysis.has_role_or_context:
        suggestions.append(
            "Consider establishing a role or context (e.g., 'Act as an NLP specialist...' or 'In the context of a college data science course...')."
        )

    # Check 3: Explicit task directive
    if not analysis.has_task_instruction:
        suggestions.append(
            "Specify an explicit action verb (e.g., 'Compare', 'Synthesize', 'Explain step-by-step') to direct the response."
        )

    # Check 4: Target audience
    if not analysis.has_audience:
        suggestions.append(
            "Define the intended audience (e.g., 'for first-year students' or 'for software professionals') to calibrate tone and depth."
        )

    # Check 5: Desired output format
    if not analysis.has_format_specification:
        suggestions.append(
            "Specify a concrete output structure (e.g., 'Format as a markdown table', 'Use bulleted key takeaways', or 'Provide clean JSON')."
        )

    # Check 6: Constraints / boundaries
    if not analysis.has_constraints:
        suggestions.append(
            "Add scope constraints or exclusions (e.g., 'Keep response under 250 words', 'Avoid jargon', or 'Focus strictly on practical tradeoffs')."
        )

    # Check 7: Concrete examples
    if not analysis.has_examples_request and analysis.word_count >= 8:
        suggestions.append(
            "Request concrete examples or real-world use cases to ground theoretical concepts."
        )

    # If the prompt already has many attributes, provide positive reinforcement
    if len(suggestions) <= 1:
        suggestions.append(
            "Your prompt is well-structured with clear instructional elements. Experiment with further edge cases or domain-specific constraints."
        )

    return suggestions


def generate_suggested_template(prompt: str, analysis: PromptAnalysis) -> str:
    """
    Generate an optional structured prompt drafting template based on the user's core topic.
    Clearly marked as a local template helper, NOT a Deep Learning generation.
    """
    core_topic = prompt.strip().rstrip(".").strip()

    # Clean leading verbs if present to extract the topic
    topic_clean = re.sub(
        r"^(explain|tell me about|what is|how to|write about|describe|act as)\s+",
        "",
        core_topic,
        flags=re.IGNORECASE,
    ).strip()

    if not topic_clean:
        topic_clean = core_topic

    template = (
        f"Act as a domain expert in {topic_clean.title()}.\n\n"
        f"Goal: Explain {topic_clean} clearly, covering core principles and operational mechanisms.\n"
        f"Target Audience: Undergraduate engineering students with basic programming knowledge.\n"
        f"Structure & Format:\n"
        f"1. Executive Summary (2-3 sentences)\n"
        f"2. Core Concepts with 2 real-world examples\n"
        f"3. Comparison table highlighting key tradeoffs\n"
        f"Constraints: Keep explanation concise, avoid unnecessary jargon, and format with clear markdown headings."
    )
    return template
