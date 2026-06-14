schema_prompt = """
You are a CSV column mapper.

You will be given:
1. A list of standard schema field names
2. A list of CSV column names from an uploaded file
3. Sample rows from the CSV

Your job is to match each standard field to the most relevant CSV column name.

Standard Schema Fields:
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
- Return ONLY a valid JSON object
- Do NOT explain anything
- Do NOT add markdown or ```json
- Use double quotes only
- Each key must be a standard schema field name
- Each value must be the exact matching CSV column name as a string, or null if no match
- Example: {{"product_id": "id", "product_name": "item_title", "price": null}}
"""
