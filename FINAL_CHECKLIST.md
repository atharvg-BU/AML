# Final Submission Checklist

Use this checklist before the BU CS 506 final project deadline.

## 1. README / Final Report

- [ ] Add the YouTube presentation link at the very top of `README.md`
- [ ] Confirm the build and run instructions are still the first practical section in `README.md`
- [ ] Confirm the README still includes:
  - [ ] how to build and run the code
  - [ ] how to test the code
  - [ ] supported environment
  - [ ] data collection explanation
  - [ ] data cleaning explanation
  - [ ] feature extraction explanation
  - [ ] model training and evaluation explanation
  - [ ] visualizations
  - [ ] final results
  - [ ] limitations / failure cases
- [ ] Make sure the final metrics in the README still match `reports/artifacts/split_metrics.csv`
- [ ] Make sure all figure paths referenced in the README still exist

## 2. Reproducibility

- [ ] Run `make install`
- [ ] Run `make test`
- [ ] Run `make download`
- [ ] Run `make run` or `make reproduce`
- [ ] Confirm `data/download.py` still downloads the correct final datasets: IBM AML + SAML-D
- [ ] Confirm `Makefile` still works from a clean clone
- [ ] Confirm raw data is not committed

## 3. GitHub / CI

- [ ] Confirm GitHub Actions is green on the latest commit
- [ ] Confirm the repo default branch contains the final README and figures
- [ ] Confirm no large temporary files or old check-in artifacts are lingering in the repo
- [ ] Confirm `.gitignore` is still ignoring raw data and notebook checkpoints

## 4. Final Visuals

- [ ] `reports/figures/temporal_patterns_final.png`
- [ ] `reports/figures/feature_association_views_final.png`
- [ ] `reports/figures/threshold_sweep_final.png`
- [ ] `reports/figures/rank_diagnostics_final.png`
- [ ] `reports/figures/model_diagnostics_final.png`

These are the best figures to lean on in the README and the presentation.

## 5. Final Talking Points

- [ ] We merged IBM AML and SAML-D into one leak-aware transaction pipeline
- [ ] We excluded `laundering_type` and `source_dataset` from training to avoid leakage
- [ ] We used chronological splitting because AML is a time-ordered prediction problem
- [ ] We emphasized PR-AUC, PR lift, and precision-at-k because the data is extremely imbalanced
- [ ] Our strongest practical result is alert ranking, not just raw classification

## 6. Important Limitations To State Clearly

- [ ] The datasets are synthetic, so this is not a production-readiness claim
- [ ] Validation and test are effectively SAML-D-only because the IBM date range ends earlier
- [ ] Strong results likely reflect both useful features and the cleaner synthetic setting

## 7. Submission Day

- [ ] Add final YouTube link to README
- [ ] Push the final commit
- [ ] Open the repo in a fresh browser session and verify the README renders correctly
- [ ] Click the figure links mentally by scanning the page and make sure there are no broken images
- [ ] Verify the repo is public and accessible
