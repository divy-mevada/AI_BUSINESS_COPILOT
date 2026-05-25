import json

from langchain_huggingface import ChatHuggingFace , HuggingFaceEndpoint
from config.setting import HUGGINGFACE_API_KEY
from langchain_core.prompts import ChatPromptTemplate

from prompts.schema_prompt import schema_prompt
from schemas.standard_schema import STANDARD_SCHEMA

import os

llm = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.1-8B-Instruct",
    task="text-generation",
    huggingfacehub_api_token=HUGGINGFACE_API_KEY,
    temperature=0.1,
    max_new_tokens=300
)

model = ChatHuggingFace(llm= llm)

def map_schema(df):

    columns = list(df.columns)

    sample_rows = (
        df.head(3)
        .to_dict(orient="records")
    )

    prompt = ChatPromptTemplate.from_template(
        schema_prompt
    )

    chain = prompt | model

    response = chain.invoke({
        "schema": STANDARD_SCHEMA,
        "columns": columns,
        "sample_rows": sample_rows
    })

    raw = response.content.strip()
    print("LLM RAW RESPONSE:", raw)

    # Extract JSON block if LLM wraps it in markdown or extra text
    start = raw.find("{")
    end = raw.rfind("}") + 1
    if start == -1 or end == 0:
        raise ValueError(f"No JSON found in LLM response: {raw}")

    json_string = raw[start:end]

    json_string = (
        json_string
        .replace("'", '"')
        .replace("None", "null")
    )
    try:
      mapping = json.loads(json_string)
    except Exception as e:

      print("JSON PARSE ERROR:", e)
      print("RAW OUTPUT:", raw)

      raise ValueError(
        "Invalid JSON returned from LLM"
      )  

    return mapping