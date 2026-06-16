from fastapi import FastAPI, UploadFile, File

from loaders.csv_loader import load_csv
from agents.schema_maper import map_schema
from loaders.dataframe_builder import build_standard_dataframe
from agents.sales_agent import analyze_sales
from agents.recommendation_agent import generate_recommendations
from agents.customer_agent import analyze_customers
from agents.inventory_agent import analyze_inventory
from agents.customer_segmentation_agent import segment_customers
from agents.predictive_forecasting_agent import forecast_sales
from agents.statergy_agent import generate_marketing_strategy


app = FastAPI()



@app.get("/")
def home():
    return {"message": "AI Business Copilot API Running"}


@app.post("/upload-csv/")
async def upload_csv(file: UploadFile = File(...)):

    df = load_csv(file.file)

    mapping = map_schema(df)

    standardized_df = build_standard_dataframe(
        df,
        mapping
    )
    sales_insights = analyze_sales(
        standardized_df
    )

    customer_insights = analyze_customers(
        standardized_df
    )

    inventory_insights = analyze_inventory(
        standardized_df
    )

    customer_segmentation = segment_customers(
        standardized_df
    )

    sales_forecast = forecast_sales(
        standardized_df
    )

    combined_insights = {
        **sales_insights,
        **customer_insights,
        **inventory_insights,
        "customer_segmentation": customer_segmentation,
        "sales_forecast": sales_forecast
    }   

    recommendations = generate_recommendations(
        combined_insights
    )

    marketing_strategy = generate_marketing_strategy(
        customer_segmentation,
        sales_forecast
    )

    return {
        "mapping": mapping,
        "preview": standardized_df.head(5).to_dict(
            orient="records"
        ),
        "sales_insights": sales_insights,
        "recommendations" : recommendations,
        "customer_insights": customer_insights,
        "inventory_insights": inventory_insights,
        "customer_segmentation": customer_segmentation,
        "sales_forecast": sales_forecast,
        "marketing_strategy": marketing_strategy
    }