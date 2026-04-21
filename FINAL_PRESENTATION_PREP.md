# Final Presentation Prep

This file is for the 10-minute final presentation, not the written report only.

## Recommended 10-Minute Structure

### 1. Problem and goal

Say:

> We studied AML transaction detection as a ranking problem. The practical goal is to push suspicious transactions to the top of an analyst review queue while keeping false positives manageable.

### 2. Data

Say:

> Our final project uses two public synthetic datasets: IBM AML and SAML-D. We dropped the Czech dataset from the final pipeline so we could focus on one stronger, cleaner transaction-level workflow.

### 3. Data processing

Say:

> We standardized both datasets into a shared schema, parsed timestamps, normalized text fields, coerced amount columns, sorted everything chronologically, and built historical features using only past transactions.

Important defense point:

> We explicitly kept leak-prone columns like `laundering_type` and `source_dataset` out of the training feature set.

### 4. Features

Say:

> The main contribution is the feature engineering. Instead of only using raw transaction metadata, we built sender, receiver, pair, and route history features, time gaps, novelty counts, and amount-deviation features.

### 5. Models

Say:

> We benchmarked multiple model families including several XGBoost variants, histogram gradient boosting, balanced random forest, extra trees, and a weighted ensemble. We also appended an Isolation Forest anomaly score as an extra feature.

### 6. Evaluation

Say:

> Because AML is highly imbalanced, we focused on PR-AUC, PR lift, precision, recall, F1, and precision-at-k instead of relying on accuracy alone.

Important defense point:

> We used a chronological split because this is a time-ordered problem. Random splitting would make the task unrealistically easy.

### 7. Results

Say:

> Our final selected model was a weighted ensemble. On the held-out test set it achieved PR-AUC 0.9851, precision 0.9941, recall 0.9487, and F1 0.9709 at threshold 0.925.

Best practical result to emphasize:

> In the top 0.1% of alerts, precision is about 0.9997 and recall is about 0.917. That means the model is especially strong as an alert-ranking system.

### 8. Limitations

Say:

> We want to be honest about three limitations: the datasets are synthetic, the validation and test windows are effectively SAML-D-only, and this is still a course-project pipeline rather than a production AML system.

### 9. Wrap-up

Say:

> The main takeaway is that leak-aware historical behavioral features are much more useful than raw transaction fields alone, and that the final system is strongest as a ranking model for investigator triage.

## Best Figures To Show

Show these if you only have time for four:

1. `reports/figures/temporal_patterns_final.png`
2. `reports/figures/feature_association_views_final.png`
3. `reports/figures/threshold_sweep_final.png`
4. `reports/figures/rank_diagnostics_final.png`

Add this if you have time:

5. `reports/figures/model_diagnostics_final.png`

## Likely Questions

### Why these features?

Answer:

> AML patterns are behavioral. A single transaction can look normal, but repeated pair behavior, unusual timing, cross-border novelty, and deviations from account history are much more informative.

### Why chronological split?

Answer:

> It prevents future information from leaking into the past and better matches how a real monitoring system would be used.

### Why PR-AUC instead of accuracy?

Answer:

> Because the positive class is about 0.1%, accuracy is not informative. A trivial always-negative model would look good on accuracy and still be useless.

### Why is the model performing so well?

Answer:

> Likely because the datasets are synthetic and the held-out evaluation is effectively SAML-D-only. We present the results as strong synthetic holdout performance, not real-world AML readiness.

### What are the main failure cases?

Answer:

> False positives are often normal but unusual cross-border transfers. False negatives include some single-large, cycle, and cash-withdrawal patterns that are harder to separate with the current feature set.

## What Not To Say

- Do not say the model is production-ready
- Do not say the evaluation proves equal generalization across IBM and SAML-D
- Do not lean on accuracy as the main metric
- Do not describe the threshold-0.10 profile as truly high precision

## Last-Minute Presentation Checklist

- [ ] Put the YouTube link into the README before submitting
- [ ] Make sure the presenter knows the 4 headline metrics
- [ ] Make sure the presenter knows the 3 main limitations
- [ ] Make sure someone can explain why historical features are leak-safe
- [ ] Make sure someone can explain why PR-AUC and precision-at-k matter more than accuracy
