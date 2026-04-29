# AML Risk Detection Final Presentation Script

Target length: about 10 minutes. Replace `Speaker 1` through `Speaker 4` with your team members' names before recording.

## Speaker 1: Problem And Goal (Slides 1-2, about 2:00)

**Slide 1 - Title**

Hi, we are presenting our CS 506 final project: AML Risk Detection. Our project studies how to rank suspicious transactions using two public synthetic AML datasets, IBM AML and SAML-D.

The goal is to build a reproducible end-to-end data science pipeline: start with raw transaction data, clean and standardize it, engineer behavioral features, train models, and evaluate whether the highest-risk transactions are actually useful for review.

**Slide 2 - Problem**

AML detection is a rare-event triage problem. A bank may process a very large number of transactions, but investigators can only review a limited number of alerts.

That means accuracy is not enough. A model could be accurate by predicting almost everything as normal, while still missing the suspicious transactions. We care about precision, recall, PR-AUC, lift, and especially how good the top-ranked alerts are.

Our project goal is to build an AML risk-ranking workflow that catches suspicious activity while controlling false-positive load.

## Speaker 2: Data, Cleaning, And Features (Slides 3-5, about 3:00)

**Slide 3 - Data**

The final project uses two public synthetic transaction-monitoring datasets: IBM Transactions for Anti Money Laundering and SAML-D.

This visualization gives the first reason we need careful preprocessing and evaluation. The datasets have different sizes and laundering rates, and transaction amounts are heavily skewed. That is why the report uses log-scaled visualizations and imbalance-aware metrics.

The data is synthetic, which is useful because labels are available for evaluation. But it is also a limitation, so we do not treat the final scores as production-level bank performance.

**Slide 4 - Cleaning**

Before modeling, both datasets are harmonized into one shared schema. We standardize fields for timestamp, sender and receiver accounts, banks, amount, currencies, payment format, and the laundering label.

The cleaning steps include timestamp parsing, numeric amount coercion, text normalization, missing-field handling, and chronological sorting.

We also remove leak-prone shortcuts from training. For example, laundering type and source dataset are useful for auditing and interpretation, but they are not allowed as model features.

**Slide 5 - Feature Engineering**

The key feature idea is that a transaction is more informative when we compare it against prior behavior.

We use amount features, time features, sender and receiver history, pair and route counts, time gaps, novelty counts, first-seen flags, and an Isolation Forest anomaly score.

The important guardrail is that cumulative features only use transactions that happened earlier in time. That keeps the feature engineering closer to a real scoring setting and avoids future leakage.

## Speaker 3: Visualizations And Modeling (Slides 6-8, about 2:45)

**Slide 6 - Temporal Visualization**

This heatmap shows laundering rate by weekday and hour. The pattern is not perfectly uniform, which supports adding calendar and time-window features.

The point is not that one hour causes laundering. The point is that timing gives useful context, and the heatmap summarizes millions of rows in a readable way.

**Slide 7 - Feature Signal Visualization**

These feature association and importance views show that history and relationship features carry strong signal.

Pair history, sender and receiver behavior, route behavior, and currency context rank highly. This supports our feature engineering approach: laundering is usually a pattern across transactions, not just one isolated amount.

**Slide 8 - Modeling**

We benchmarked multiple models instead of trusting a single method: regularized XGBoost, recall-focused XGBoost, undersampled XGBoost, histogram gradient boosting, balanced random forest, extra trees, and a weighted ensemble.

The evaluation uses a chronological split: 64 percent train, 16 percent validation, and 20 percent test. The weighted ensemble was selected on validation performance, and the chosen threshold was 0.925.

We prioritize PR-AUC, PR lift, precision, recall, F1, precision-at-k, and lift-at-k because these metrics reflect rare-event ranking better than accuracy.

## Speaker 4: Results, Ranking, And Limitations (Slides 9-10, about 2:15)

**Slide 9 - Results**

On the held-out test window, the selected weighted ensemble performs strongly. The test PR-AUC is 0.9851, precision is 0.9941, recall is 0.9487, and F1 is 0.9709.

The PR lift over the baseline prevalence is about 903.78 times. The diagnostics show strong score separation and strong precision-recall behavior.

The threshold sweep is important because thresholding is an operating decision. A lower threshold catches more cases but creates more alerts; a higher threshold reduces alert volume but can miss suspicious transactions.

**Slide 10 - Ranking, Limitations, And Close**

The ranking result is the most operational part of the project. In the top 0.1 percent of ranked alerts, precision is about 99.97 percent, and that top slice recovers about 91.7 percent of all positives in the test set.

The main limitations are that both final datasets are synthetic, and the validation and test windows are effectively SAML-D-only. In a real deployment, we would need less synthetic data, calibrated costs, investigator-capacity constraints, and monitoring for drift.

For future work, we would add graph features, validate on more realistic data, and test robustness across later time windows.

That concludes our presentation. The README is the final report and contains build instructions, data documentation, visualizations, results, and the video link.
