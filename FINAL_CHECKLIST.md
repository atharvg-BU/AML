# Final Submission Checklist

Use this as the last pass before uploading the YouTube recording and submitting the repo.

## README / Final Report

- [ ] Replace `Presentation video: add YouTube link here before the final submission.` near the top of `README.md` with the final YouTube URL.
- [x] Build/run instructions are first and include the Makefile workflow.
- [x] Data sources are identified and justified: IBM AML and SAML-D.
- [x] Data collection method is implemented in `data/download.py`.
- [x] Data cleaning and harmonization are described in the README and implemented in `ds_final.ipynb`.
- [x] Feature extraction is explained with categorical and numeric feature families.
- [x] Modeling and evaluation strategy are described with chronological train/validation/test splits.
- [x] Results are reported from `reports/artifacts/split_metrics.csv`.
- [x] Limitations and failure cases are called out.
- [x] Visualizations are embedded from `reports/figures/`.

## Reproducibility

- [x] `make all` installs dependencies and runs tests.
- [x] `make download` downloads the two final datasets through KaggleHub.
- [x] `make reproduce` executes the final notebook into `reports/`.
- [x] `.github/workflows/ci.yml` runs the test suite on pushes and pull requests.
- [ ] Run `make all` in a clean environment before the final submission if time allows.

## Presentation

- [x] Final deck path: `presentation/final_presentation.pptx`.
- [x] Four-speaker script path: `presentation/final_presentation_script.md`.
- [x] Main visuals to show: dataset overview, temporal heatmap, feature association, threshold sweep, rank diagnostics, model diagnostics.
- [ ] Record a 10-minute video with all four members speaking.
- [ ] Upload the recording to YouTube.
- [ ] Add the YouTube link to the top of `README.md`.
