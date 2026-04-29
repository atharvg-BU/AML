# Final Presentation Prep

**Deck:** `presentation/final_presentation.pptx` (13 widescreen slides)
**Script:** `presentation/final_presentation_script.md`
**Target length:** 10 minutes (~45 sec per slide on average)

## Speaker Assignments

| Speaker | Slides | Time | Main job |
| --- | ---: | ---: | --- |
| Speaker 1 | 1 → 3   | ~2:00 | Title, frame the AML problem, walk the 5-step pipeline |
| Speaker 2 | 4 → 7   | ~3:00 | Datasets, dataset overview chart, cleaning, feature engineering |
| Speaker 3 | 8 → 10  | ~2:30 | Temporal heatmap, feature signal views, model benchmark |
| Speaker 4 | 11 → 13 | ~2:30 | Threshold + diagnostics, headline test results, ranking + limitations + close |

## Slide-by-slide map

| # | Slide                                          | Visual asset(s) used                                                |
| - | ---------------------------------------------- | ------------------------------------------------------------------- |
| 1 | Title (dark navy)                              | none                                                                |
| 2 | Problem — three cards + project goal           | none                                                                |
| 3 | Pipeline — 5 numbered steps + tech chips       | none                                                                |
| 4 | Two complementary datasets                     | none                                                                |
| 5 | What the merged dataset looks like             | `dataset_overview_final.png`                                        |
| 6 | Cleaning produces one fair shared schema       | none                                                                |
| 7 | Features describe behavior around each tx      | none                                                                |
| 8 | Visualization 1 — temporal patterns            | `temporal_patterns_final.png`                                       |
| 9 | Visualization 2 — feature signal               | `feature_association_views_final.png`, `feature_importance_final.png`|
| 10 | Six candidates benchmarked, one ensemble selected | candidate table from `reports/artifacts/candidate_results.csv`   |
| 11 | Threshold + diagnostics                        | `threshold_sweep_final.png`, `model_diagnostics_final.png`          |
| 12 | Held-out test results                          | metric callouts + split table from `reports/artifacts/`             |
| 13 | What the ranking actually means (close)        | `rank_diagnostics_final.png` + 99.97% / 91.7% callouts              |

## Recording flow

1. Open the deck in slideshow mode and the script in another tab.
2. Each speaker uses the script as notes — do not read it word-for-word.
3. Use the explicit `[Hand off]` lines in the script for clean transitions.
4. After recording, upload to YouTube and paste the link at the top of `README.md`.

## Must-Hit Points

- The project is an AML transaction-ranking system, not a generic classifier.
- The two final datasets are IBM AML and SAML-D, merged into one shared schema.
- We use leak-aware history features computed strictly from prior rows.
- The split is **chronological**: 64 / 16 / 20 train / validation / test.
- PR-AUC, PR lift, precision/recall/F1, precision-at-k, lift-at-k beat accuracy under severe imbalance.
- Selected model: **weighted ensemble** at threshold **0.925**.
- Held-out test metrics: PR-AUC `0.985`, precision `0.994`, recall `0.949`, F1 `0.971`, PR lift `~904x`.
- Ranking story: top `0.1%` ranked alerts have precision `99.97%` and recover `91.7%` of all positives.
- Main limitation: both datasets are synthetic — results should not be read as production performance.

## Likely Q&A

**Why not use accuracy?**
Accuracy is misleading under extreme imbalance — a "say-no-to-everything" model is 99.9% accurate and useless.

**Why a chronological split?**
AML decisions happen over time. A random split lets history-derived features peek into the future.

**Why tree ensembles?**
Tabular, non-linear, imbalanced, mixed categorical/numeric — tree ensembles dominate that combination.

**What would you do next?**
Validate on less synthetic data, add graph/network features, calibrate thresholds to investigator capacity, monitor drift across time windows.
