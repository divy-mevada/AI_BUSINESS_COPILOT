from langchain_core.prompts import ChatPromptTemplate
from langchain_huggingface import (
    ChatHuggingFace,
    HuggingFaceEndpoint
)

from config.setting import (
    HUGGINGFACE_API_KEY
)


llm = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.1-8B-Instruct",
    task="text-generation",
    huggingfacehub_api_token=HUGGINGFACE_API_KEY,
    temperature=0.2,
    max_new_tokens=300
)

model = ChatHuggingFace(llm=llm)


recommendation_prompt = """
You are a business analyst AI.

Analyze the business insights below.

Business Insights:
{insights}

Give:
- strengths
- problems
- actionable recommendations

Keep response short and practical.
"""


def generate_recommendations(insights):

    prompt = ChatPromptTemplate.from_template(
        recommendation_prompt
    )

    chain = prompt | model

    response = chain.invoke({
        "insights": insights
    })

    return response.content