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

    sample_rows = df.head(3).to_dict(orient="records")

    schema_fields = list(STANDARD_SCHEMA.keys())

    prompt = ChatPromptTemplate.from_template(schema_prompt)

    chain = prompt | model

    response = chain.invoke({
        "schema": schema_fields,
        "columns": columns,
        "sample_rows": sample_rows
    })

    raw = response.content.strip()
    print("LLM RAW RESPONSE:", raw)

    import re

    # Robust extraction function
    def extract_and_parse_json(raw_text: str):
        text = raw_text.strip()
        
        # 1. Try simple json.loads first on the whole text
        try:
            return json.loads(text)
        except Exception:
            pass

        # 2. Try to extract JSON code block: ```json ... ``` or similar
        code_block_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL | re.IGNORECASE)
        if code_block_match:
            try:
                return json.loads(code_block_match.group(1))
            except Exception:
                cleaned_block = (
                    code_block_match.group(1)
                    .replace("'", '"')
                    .replace("None", "null")
                    .replace("True", "true")
                    .replace("False", "false")
                )
                try:
                    return json.loads(cleaned_block)
                except Exception:
                    pass

        # 3. Find the first '{' and use json.JSONDecoder().raw_decode() to parse the JSON object
        start = text.find("{")
        if start != -1:
            json_slice = text[start:]
            cleaned_slice = (
                json_slice
                .replace("'", '"')
                .replace("None", "null")
                .replace("True", "true")
                .replace("False", "false")
            )
            
            # Try raw_decode on cleaned_slice
            try:
                decoder = json.JSONDecoder()
                decoded, index = decoder.raw_decode(cleaned_slice)
                return decoded
            except Exception:
                pass
                
            # Try raw_decode on original json_slice as a fallback
            try:
                decoder = json.JSONDecoder()
                decoded, index = decoder.raw_decode(json_slice)
                return decoded
            except Exception:
                pass
                
            # Last-resort regex mapping if it's completely malformed but has clear KV structure
            try:
                pairs = re.findall(r'"([^"]+)"\s*:\s*(?:"([^"]+)"|([A-Za-z0-9_]+))', cleaned_slice)
                if pairs:
                    extracted = {}
                    for k, val, other in pairs:
                        if other:
                            other_clean = other.lower()
                            if other_clean in ("null", "none"):
                                extracted[k] = None
                            elif other_clean == "true":
                                extracted[k] = True
                            elif other_clean == "false":
                                extracted[k] = False
                            else:
                                extracted[k] = other
                        else:
                            extracted[k] = val
                    return extracted
            except Exception:
                pass

        raise ValueError("Failed to extract valid JSON from LLM response.")

    try:
        mapping = extract_and_parse_json(raw)
    except Exception as e:
        print("JSON PARSE ERROR:", e)
        print("RAW OUTPUT:", raw)
        raise ValueError("Invalid JSON returned from LLM")  

    return mapping