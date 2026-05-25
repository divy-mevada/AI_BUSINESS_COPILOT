schema_prompt = """
You are a business CSV schema analyzer.

Your task is to map uploaded CSV columns
to the standard business schema.

Standard Schema:
{schema}

CSV Columns:
{columns}

Sample Rows:
{sample_rows}

Important mappings examples:
- sale_amount -> total_revenue
- sales_value -> total_revenue
- item_title -> product_name
- units_sold -> quantity_sold
- customer_feedback -> review
- stars -> rating
- refunds -> return_count
- current_inventory -> inventory
- stock -> inventory
- inventory_count -> inventory


Rules:
- Return ONLY valid JSON
- Do NOT explain anything
- Do NOT add markdown
- Do NOT use ```json
- Use double quotes only
- Keys must be standard schema fields
- Values must be matching CSV column names
- If no matching column exists, use null

Example Output:

{{
    "product_name": "item_title",
    "total_revenue": "sales_value",
    "quantity_sold": "units",
    "rating": null
}}
"""