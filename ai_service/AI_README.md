# AI Business Copilot

An AI-powered business intelligence platform that allows businesses to upload CSV files and receive automated analytics, insights, and business recommendations using LLMs and AI agents.

---

# Features

- Dynamic CSV schema understanding using LLMs
- Flexible business data ingestion
- Automatic schema standardization
- Sales analytics generation
- AI-powered business recommendations
- Handles incomplete and unknown CSV structures
- Modular multi-agent architecture

---

# Current AI Pipeline

```txt
CSV Upload
    ↓
Schema Mapper Agent
    ↓
Standardized DataFrame
    ↓
Sales Analytics Agent
    ↓
Recommendation Agent
    ↓
Business Insights
```

---

# Tech Stack

## Backend

- FastAPI
- Python
- Pandas

## AI/LLM

- LangChain
- HuggingFace
- Llama 3.1 8B Instruct

## Data Processing

- NumPy
- Scikit-learn
- TextBlob

---

# Project Structure

```txt
ai_service/
│
├── agents/
│   ├── schema_mapper_agent.py
│   ├── sales_agent.py
│   ├── customer_agent.py
│   └── recommendation_agent.py
│
├── loaders/
│   ├── csv_loader.py
│   └── dataframe_builder.py
│
├── prompts/
│   └── schema_prompt.py
│
├── schemas/
│   └── standard_schema.py
│
├── config/
│   └── setting.py
│
├── main.py
├── requirements.txt
└── .env
```

---

# Implemented Features

## 1. Dynamic Schema Mapping

The system intelligently maps unknown CSV columns into a standard business schema.

### Example

Input CSV:

```txt
sale_amount
item_title
units_sold
```

Mapped Schema:

```txt
total_revenue
product_name
quantity_sold
```

---

# 2. Standardized DataFrame

All uploaded CSVs are converted into a universal schema.

### Standard Schema

```txt
product_id
product_name
price
quantity_sold
total_revenue
rating
review
return_count
date
customer_id
```

---

# 3. Sales Analytics

Current analytics include:

- Total Revenue
- Total Quantity Sold
- Best Selling Product
- Average Rating
- Most Returned Product
- Lowest Rated Product

---

# 4. AI Recommendations

The recommendation agent generates actionable business insights such as:

- Product improvement suggestions
- Return reduction strategies
- Customer satisfaction analysis
- Business optimization recommendations

---

# API Endpoint

## Upload CSV

```txt
POST /upload-csv/
```

### Response Example

```json
{
  "sales_insights": {
    "total_revenue": 78200,
    "best_selling_product": "Wireless Earbuds"
  },
  "recommendations": "Improve Fitness Band quality..."
}
```

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone <repo_url>
cd ai-business-copilot
```

---

## 2. Create Virtual Environment

```bash
python -m venv .venv
```

Activate:

### Windows

```bash
.venv\Scripts\activate
```

### Linux/Mac

```bash
source .venv/bin/activate
```

---

# 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

# 4. Create .env File

```env
HUGGINGFACE_API_KEY=your_api_key_here
```

---

# 5. Run Server

```bash
uvicorn main:app --reload
```

---

# 6. Open Swagger Docs

```txt
http://127.0.0.1:8000/docs
```

---

# Future Improvements

- Inventory Agent
- Customer Sentiment Agent
- Multi-Agent Orchestration
- RAG-based business memory
- Real-time dashboard
- Predictive analytics
- AI chatbot for business owners
- Notification agent
- Marketing strategy agent

---

# Key Engineering Challenges Solved

- Dynamic schema mapping
- Invalid LLM JSON handling
- NaN serialization issues
- Flexible CSV ingestion
- Unknown column handling
- Numeric serialization fixes
- Missing data management

---

# Author

Divy Mevada

---

# Project Status

## Current Stage

Backend MVP Completed

Implemented:

- CSV ingestion
- Schema mapping
- Analytics generation
- AI recommendations

## Next Stage

- Customer analytics
- Frontend dashboard
- Multi-agent system
- Real-time insights
