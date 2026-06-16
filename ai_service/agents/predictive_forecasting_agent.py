import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

def forecast_sales(df):
    if "total_revenue" not in df.columns:
        return {"error": "Missing revenue data for forecasting"}
        
    df = df.copy()
    df["total_revenue"] = pd.to_numeric(df["total_revenue"], errors="coerce").fillna(0)
    
    # Check if date exists
    if "date" not in df.columns or df["date"].dropna().empty:
        # Fallback: Use rows as a simple index sequence to estimate direction
        y = df["total_revenue"].values
        X = np.arange(len(y)).reshape(-1, 1)
        if len(y) < 3:
            return {"error": "Insufficient data points for forecasting"}
        model = LinearRegression()
        model.fit(X, y)
        slope = float(model.coef_[0])
        future_indices = np.arange(len(y), len(y) + 7).reshape(-1, 1)
        predictions = model.predict(future_indices)
        
        # We don't have real dates, so we return generic labels
        return {
            "trend": "upward" if slope > 0 else "downward",
            "daily_growth_rate": round(slope, 2),
            "historical_dates": [f"Day {i+1}" for i in range(min(10, len(y)))],
            "historical_values": [float(val) for val in y[-10:]],
            "forecast_dates": [f"Day {len(y) + i + 1}" for i in range(7)],
            "forecast_values": [round(float(val), 2) for val in predictions]
        }
        
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df = df.dropna(subset=["date"]).sort_values("date")
    
    # Resample to daily/weekly to consolidate duplicates on the same date
    daily_sales = df.groupby(df["date"].dt.date)["total_revenue"].sum().reset_index()
    
    if len(daily_sales) < 3:
        # Not enough days, resample might be too sparse. Let's try row level index.
        y = daily_sales["total_revenue"].values
        X = np.arange(len(y)).reshape(-1, 1)
        model = LinearRegression()
        model.fit(X, y)
        slope = float(model.coef_[0])
        future_indices = np.arange(len(y), len(y) + 7).reshape(-1, 1)
        predictions = model.predict(future_indices)
        
        return {
            "trend": "upward" if slope > 0 else "downward",
            "daily_growth_rate": round(slope, 2),
            "historical_dates": [str(d) for d in daily_sales["date"]],
            "historical_values": [float(val) for val in y],
            "forecast_dates": [f"Day {len(y) + i + 1}" for i in range(7)],
            "forecast_values": [round(float(val), 2) for val in predictions]
        }
        
    daily_sales["date_ordinal"] = pd.to_datetime(daily_sales["date"]).apply(lambda x: x.toordinal())
    
    X = daily_sales[["date_ordinal"]].values
    y = daily_sales["total_revenue"].values
    
    model = LinearRegression()
    model.fit(X, y)
    
    slope = float(model.coef_[0])
    
    # Predict next 7 days starting from last date
    last_date_obj = daily_sales["date"].max()
    last_date_ordinal = last_date_obj.toordinal()
    
    future_ordinals = np.array([[last_date_ordinal + i] for i in range(1, 8)])
    predictions = model.predict(future_ordinals)
    
    # Generate future date strings
    future_dates = [str(pd.Timestamp.fromordinal(int(o[0])).date()) for o in future_ordinals]
    
    # Return last 15 days of historical data for neat plotting
    history_slice = daily_sales.tail(15)
    
    return {
        "trend": "upward" if slope > 0 else "downward",
        "daily_growth_rate": round(slope, 2),
        "historical_dates": [str(d) for d in history_slice["date"]],
        "historical_values": [round(float(val), 2) for val in history_slice["total_revenue"]],
        "forecast_dates": future_dates,
        "forecast_values": [round(float(max(0.0, val)), 2) for val in predictions] # prevent negative sales prediction
    }
