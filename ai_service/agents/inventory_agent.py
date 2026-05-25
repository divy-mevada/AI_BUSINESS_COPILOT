def analyze_inventory(df):

    insights = {}

    low_stock_products = []

    fast_moving_products = []

    dead_inventory_products = []

    if (
        "inventory" in df.columns
        and "product_name" in df.columns
    ):

        for _, row in df.iterrows():

            inventory = row["inventory"]
            product = row["product_name"]

            quantity_sold = row.get(
                "quantity_sold",
                0
            )

            if inventory in ["", None]:

                continue

            inventory = int(inventory)

            quantity_sold = int(
                quantity_sold
            )

            # Low Stock
            if inventory < 5:

                low_stock_products.append(
                    product
                )

            # Fast Moving
            if (
                quantity_sold > 5
                and inventory < 10
            ):

                fast_moving_products.append(
                    product
                )

            # Dead Inventory
            if (
                quantity_sold < 2
                and inventory > 15
            ):

                dead_inventory_products.append(
                    product
                )

    insights["low_stock_products"] = (
        low_stock_products
    )

    insights["fast_moving_products"] = (
        fast_moving_products
    )

    insights["dead_inventory_products"] = (
        dead_inventory_products
    )

    return insights