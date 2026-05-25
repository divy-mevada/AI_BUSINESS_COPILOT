import pandas as pd

def analyze_sales(df):

    insights = {}

    if "total_revenue" in df.columns:

        insights["total_revenue"] = float(
            df["total_revenue"]
            .fillna(0)
            .sum()
        )

    if "quantity_sold" in df.columns:

        insights["total_quantity_sold"] = int(
            df["quantity_sold"]
            .fillna(0)
            .sum()
        )

    if (
        "product_name" in df.columns
        and "total_revenue" in df.columns
    ):

        grouped = (
            df.groupby("product_name")[
                "total_revenue"
            ]
            .sum()
        )

        if not grouped.empty:

            insights["best_selling_product"] = str(
                grouped.idxmax()
            )
    # Average Rating
    avg_rating = (
        df["rating"]
        .fillna(0)
        .mean()
    )

    if pd.isna(avg_rating):

        avg_rating = 0

    insights["average_rating"] = round(
        float(avg_rating),
        2
    )

    # Most Returned Product
    if (
        "product_name" in df.columns
        and "return_count" in df.columns
    ):

        returned = (
            df.groupby("product_name")[
                "return_count"
            ]
            .sum()
        )

        if not returned.empty:

            insights["most_returned_product"] = str(
                returned.idxmax()
            )

    # Lowest Rated Product
    if (
        "product_name" in df.columns
        and "rating" in df.columns
    ):

        avg_rating = (
            df.groupby("product_name")[
                "rating"
            ]
            .mean() 
        )

        if not avg_rating.empty:

            insights["lowest_rated_product"] = str(
                avg_rating.idxmin()
            )
    return insights