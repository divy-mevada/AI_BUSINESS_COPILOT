from textblob import TextBlob
from collections import Counter
import re


def analyze_customers(df):

    insights = {}

    positive_reviews = 0
    negative_reviews = 0

    positive_words = []
    negative_words = []

    overall_sentiment = 0

    stopwords = {
        "the", "is", "was", "and",
        "very", "but", "with",
        "this", "that", "are"
    }

    if "review" in df.columns:

        reviews = (
            df["review"]
            .dropna()
            .tolist()
        )

        total_reviews = len(reviews)

        for review in reviews:

            blob = TextBlob(review)

            polarity = (
                blob.sentiment.polarity
            )

            overall_sentiment += polarity

            if polarity > 0:

                positive_reviews += 1

            else:

                negative_reviews += 1

            words = re.findall(
                r'\b\w+\b',
                review.lower()
            )

            cleaned_words = [
                word for word in words
                if word not in stopwords
            ]

            if polarity > 0:

                positive_words.extend(
                    cleaned_words
                )

            else:

                negative_words.extend(
                    cleaned_words
                )

        avg_sentiment = 0

        if total_reviews > 0:

            avg_sentiment = round(
                overall_sentiment /
                total_reviews,
                2
            )

        insights["positive_reviews"] = (
            positive_reviews
        )

        insights["negative_reviews"] = (
            negative_reviews
        )

        insights["overall_sentiment"] = (
            avg_sentiment
        )

        insights["top_positive_keywords"] = [
            word for word, _ in Counter(
                positive_words
            ).most_common(5)
        ]

        insights["top_negative_keywords"] = [
            word for word, _ in Counter(
                negative_words
            ).most_common(5)
        ]

    return insights