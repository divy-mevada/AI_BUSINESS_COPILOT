from langchain_core.prompts import ChatPromptTemplate
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from config.setting import HUGGINGFACE_API_KEY

llm = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.1-8B-Instruct",
    task="text-generation",
    huggingfacehub_api_token=HUGGINGFACE_API_KEY,
    temperature=0.3,
    max_new_tokens=450
)

model = ChatHuggingFace(llm=llm)

strategy_prompt = """
You are an expert Chief Marketing Officer (CMO) and Business Growth Strategist.

Analyze the following Machine Learning Customer Cohorts and Sales Forecasting insights:

Customer Cohorts (K-Means Clustering):
{segmentation}

Sales Forecasting (Regression Trend):
{forecasting}

Provide a targeted growth strategy containing:
1. **Targeted Campaigns for Cohorts**: Concrete, actionable marketing strategies for each identified customer segment (e.g. VIPs, loyal, churn-risk).
2. **Sales Trend Optimization**: Strategic adjustments based on the forecasted trend (upward/downward).
3. **Conversion Hacks**: 2 highly specific tactics to improve customer lifetime value (LTV).

Keep the response structured in Markdown, professional, and directly actionable.
"""

def generate_marketing_strategy(segmentation, forecasting):
    # If there was an error in segmentation or forecasting, return a simple summary
    if "error" in segmentation or "error" in forecasting:
        return "Insufficient data to compile custom marketing segments. Please ensure your CSV includes pricing, sales quantities, customer IDs, and dates."

    prompt = ChatPromptTemplate.from_template(strategy_prompt)
    chain = prompt | model
    
    try:
        response = chain.invoke({
            "segmentation": str(segmentation),
            "forecasting": str(forecasting)
        })
        return response.content.strip()
    except Exception as e:
        return f"AI was unable to generate custom marketing strategies: {str(e)}"
