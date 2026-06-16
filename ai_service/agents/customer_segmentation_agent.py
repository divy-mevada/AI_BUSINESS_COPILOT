import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

def segment_customers(df):
    # Check if customer_id exists and has non-null values
    if "customer_id" not in df.columns or df["customer_id"].dropna().empty:
        # Fallback: Segment products instead
        if "product_name" in df.columns and "total_revenue" in df.columns:
            return segment_products(df)
        return {"error": "Missing customer or product data for segmentation"}
        
    df = df.copy()
    # Ensure numeric types
    df["total_revenue"] = pd.to_numeric(df["total_revenue"], errors="coerce").fillna(0)
    df["rating"] = pd.to_numeric(df["rating"], errors="coerce").fillna(3.0) # default mid rating
    df["quantity_sold"] = pd.to_numeric(df["quantity_sold"], errors="coerce").fillna(0)
    
    # Group by customer
    cust_data = df.groupby("customer_id").agg({
        "total_revenue": "sum",
        "quantity_sold": "sum",
        "rating": "mean"
    }).fillna(0)
    
    cust_data.columns = ["total_spent", "purchase_frequency", "avg_rating"]
    
    if len(cust_data) < 3:
        # Too few customers to segment, return single/fallback group
        return {
            "cluster_0": {
                "name": "General Customers",
                "size": int(len(cust_data)),
                "avg_spent": float(cust_data["total_spent"].mean() if len(cust_data) > 0 else 0),
                "avg_freq": float(cust_data["purchase_frequency"].mean() if len(cust_data) > 0 else 0),
                "avg_rating": float(cust_data["avg_rating"].mean() if len(cust_data) > 0 else 0)
            }
        }
        
    # Scale features
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(cust_data)
    
    # Run K-Means (3 clusters)
    kmeans = KMeans(n_clusters=3, random_state=42, n_init="auto")
    cust_data["cluster"] = kmeans.fit_predict(scaled_features)
    
    # Generate statistics for each cluster
    summary = {}
    cluster_names = ["Low-Value / Risk Churn", "Loyal / Mid-Tier", "High-Value VIPs"]
    
    # Sort cluster IDs by average total_spent to assign names logically
    sorted_clusters = cust_data.groupby("cluster")["total_spent"].mean().sort_values().index.tolist()
    
    for i, cluster_id in enumerate(sorted_clusters):
        cluster_df = cust_data[cust_data["cluster"] == cluster_id]
        name = cluster_names[i] if i < len(cluster_names) else f"Cohort {i+1}"
        summary[f"cluster_{cluster_id}"] = {
            "name": name,
            "size": int(len(cluster_df)),
            "avg_spent": round(float(cluster_df["total_spent"].mean()), 2),
            "avg_freq": round(float(cluster_df["purchase_frequency"].mean()), 2),
            "avg_rating": round(float(cluster_df["avg_rating"].mean()), 2)
        }
    return summary

def segment_products(df):
    df = df.copy()
    df["total_revenue"] = pd.to_numeric(df["total_revenue"], errors="coerce").fillna(0)
    df["quantity_sold"] = pd.to_numeric(df["quantity_sold"], errors="coerce").fillna(0)
    df["rating"] = pd.to_numeric(df["rating"], errors="coerce").fillna(3.0)
    
    prod_data = df.groupby("product_name").agg({
        "total_revenue": "sum",
        "quantity_sold": "sum",
        "rating": "mean"
    }).fillna(0)
    
    prod_data.columns = ["total_revenue", "quantity_sold", "avg_rating"]
    
    if len(prod_data) < 3:
        return {
            "cluster_0": {
                "name": "General Products",
                "size": int(len(prod_data)),
                "avg_spent": float(prod_data["total_revenue"].mean() if len(prod_data) > 0 else 0),
                "avg_freq": float(prod_data["quantity_sold"].mean() if len(prod_data) > 0 else 0),
                "avg_rating": float(prod_data["avg_rating"].mean() if len(prod_data) > 0 else 0)
            }
        }
        
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(prod_data)
    
    kmeans = KMeans(n_clusters=3, random_state=42, n_init="auto")
    prod_data["cluster"] = kmeans.fit_predict(scaled_features)
    
    summary = {}
    cluster_names = ["Underperforming Items", "Steady Sellers", "Star Products (High Revenue)"]
    sorted_clusters = prod_data.groupby("cluster")["total_revenue"].mean().sort_values().index.tolist()
    
    for i, cluster_id in enumerate(sorted_clusters):
        cluster_df = prod_data[prod_data["cluster"] == cluster_id]
        name = cluster_names[i] if i < len(cluster_names) else f"Cohort {i+1}"
        summary[f"cluster_{cluster_id}"] = {
            "name": name,
            "size": int(len(cluster_df)),
            "avg_spent": round(float(cluster_df["total_revenue"].mean()), 2),
            "avg_freq": round(float(cluster_df["quantity_sold"].mean()), 2),
            "avg_rating": round(float(cluster_df["avg_rating"].mean()), 2)
        }
    return summary
