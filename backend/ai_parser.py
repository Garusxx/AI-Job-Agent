import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def parse_cv_with_ai(cv_text: str):
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": "You are an AI CV parser. Return only valid JSON.",
            },
            {
                "role": "user",
                "content": f"""
Extract structured candidate profile from this CV text.

Choose the SINGLE best and most accurate job search title for this candidate.
The title should be optimized for searching real job boards.

Return JSON with this exact shape:
{{
  "name": "",
  "email": "",
  "phone": "",
  "location": "",
  "summary": "",
  "skills": [],
  "roles": [],
  "seniority": "",
  "years_of_experience": "",
  "technologies": [],
  "recommended_search_role": ""
}}

CV TEXT:
{cv_text}
""",
            },
        ],
        temperature=0,
        response_format={"type": "json_object"},
    )

    content = response.choices[0].message.content

    print("AI RESPONSE:", content)

    return json.loads(content)