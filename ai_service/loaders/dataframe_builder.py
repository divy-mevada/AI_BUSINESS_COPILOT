import pandas as pd

from schemas.standard_schema import STANDARD_SCHEMA


def build_standard_dataframe(df, mapping):

    standardized_df = pd.DataFrame()

    for standard_col in STANDARD_SCHEMA.keys():

        user_col = mapping.get(standard_col)

        if user_col and user_col in df.columns:

            standardized_df[standard_col] = df[user_col]

        else:

            standardized_df[standard_col] = None

    standardized_df = standardized_df.where(
        pd.notnull(standardized_df),
        None
    )

    if (
        pd.isna(standardized_df["total_revenue"]).all()
        and "price" in standardized_df.columns
        and "quantity_sold" in standardized_df.columns
    ):
        price = pd.to_numeric(standardized_df["price"], errors="coerce").fillna(0)
        quantity = pd.to_numeric(standardized_df["quantity_sold"], errors="coerce").fillna(0)
        standardized_df["total_revenue"] = price * quantity

    return standardized_df