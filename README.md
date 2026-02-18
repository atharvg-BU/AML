# AML
Anti Money Laundering Project - CS506

# AML (Anti-Money Laundering) Risk Detection Using Transaction Data

## Project Description
This project focuses on applying the full data science lifecycle to the problem of Anti-Money Laundering (AML) risk detection using publicly available transaction datasets. Financial institutions must analyze large volumes of transaction data to identify suspicious activity while controlling false positives.

The project will focus on understanding transaction behavior at both the transaction and account levels, engineering meaningful features, and evaluating machine learning models that identify anomalous or suspicious activity. Emphasis will be placed on clear goals, data understanding, and reproducible analysis appropriate for a two-month course project.

## Project Goals
The primary goals of this project are:
- Detect anomalous financial transactions based on behavioral patterns in transaction data.
- The input features will be the amount transferred as well the reason for the transfer
- Identify and categorize high-risk accounts using transaction-level and account-level features.

These goals are specific and measurable. Success will be evaluated by comparing model outputs against labeled suspicious activity and reporting standard classification metrics such as precision, recall, and F1-score.

## Model I/O
- **Model input (features):** We will use transaction amount (numerical) and transfer reason / description (categorical/text). The reason field will be converted into model-ready features via (1) one-hot encoding for a small set of common reasons and/or (2) TF-IDF embeddings if it is free-form text.
- **Prediction target:** The model predicts whether a transaction is suspicious (1) vs. non-suspicious (0) using the dataset’s provided label. 
- **Account-level extension (if time permits):** Aggregate these transaction-level features per account (e.g., average amount, variance, frequency by reason category) to produce an account risk score.
- **Measurable success criteria:** Performance will be evaluated on a held-out test set using precision, recall, F1, and we will also report PR-AUC due to likely class imbalance.

## Data Collection Plan
- **Primary Dataset:** Synthetic Transaction Monitoring Dataset for AML  


- **Source:** Kaggle  
https://www.kaggle.com/datasets/berkanoztas/synthetic-transaction-monitoring-dataset-aml

Additional datasets may be explored if needed for comparison or extension:
- https://www.kaggle.com/datasets/ellipticco/elliptic-data-set
- https://www.kaggle.com/datasets/ellipticco/elliptic2-data-set


- **Data Type:** Tabular CSV files  
- **Collection Method:** Downloading publicly available datasets

The selected datasets contain transaction-level records including sender and receiver identifiers, transaction amounts, timestamps, and labels indicating suspicious activity. No web scraping or manual data collection is required.

## Data Cleaning Plan
Data cleaning will focus on preparing the raw transaction data for analysis, including:
- Inspecting and handling missing or inconsistent timestamps
- Removing duplicate or invalid transaction records
- Normalizing transaction amounts
- Merging transaction data with typology and metadata files
- Aggregating transaction records to generate account-level summaries

## Feature Extraction
Feature engineering will include transaction-level and account-level features such as:
- Transaction frequency and total transaction volume
- Rolling statistical features (e.g., mean and standard deviation over time windows)
- Account balance volatility
- Number of unique counterparties per account

These features are intended to capture behavioral patterns relevant to suspicious activity detection.

## Modeling Approach (Preliminary)
At this stage, we plan to explore a small number of standard machine learning approaches suitable for tabular data, including:
- Unsupervised anomaly detection methods
- Supervised classification models using labeled data

The final choice of models may evolve as we gain more insight into the data and as additional methods are introduced during the course.

## Visualization Plan (Preliminary)
Initial visualizations will focus on understanding the data and communicating results, including:
- Distributions of transaction amounts and frequencies
- Time-series plots of transaction activity
- Summary visualizations of model outputs and evaluation metrics
More advanced visualizations may be added later as the project progresses.

## Test Plan (Preliminary)
- Split the dataset into training and testing subsets
- Evaluate model performance using precision, recall, F1-score, and ROC-AUC
- Compare baseline and more advanced approaches
- Analyze false positives and false negatives to assess practical usefulness

## Project Timeline

### March Check-In (Rubric Targets)
By the check-in, we will have:
- ✅ **Preliminary Data Visualizations**: at least 1–4 labeled plots showing meaningful patterns  
- ✅ **Data Processing Progress**: initial cleaning + clear reasoning for choices  
- ✅ **Modeling Methods**: a clear prediction task + chosen features + justification  
- ✅ **Preliminary Results**: baseline metrics + interpretation (even if performance is weak)

### Final Submission (Due 5/1)
Final deliverables in the repo:
- ✅ **Tests** + **GitHub Actions** workflow
- ✅ **Visualizations** (interactive encouraged)
- ✅ **Data processing + modeling description**
- ✅ **Results showing goal achieved**
- ✅ **10-minute YouTube presentation link** at the top of this README


## 8-Week Timeline

### Week 1 — Repo Setup + Data Familiarization
**Goals**
- Set up project structure
- Download Kaggle dataset and document schema
- Initial EDA: dataset size, label distribution, missing values, duplicates

**Deliverables**
- Repo skeleton + dataset loaded
- Quick EDA notebook + notes on data quality

---

### Week 2 — Data Cleaning + Early Visualizations (Check-In Ready)
**Goals**
- Implement initial cleaning pipeline:
  - parse/standardize timestamps
  - remove duplicates/invalid records
  - normalize/transform amounts (e.g., log transform / scaling)
  - handle missing or inconsistent values
- Create **2–4 well-labeled visualizations**, for example:
  - transaction amount distribution (overall + suspicious vs non-suspicious)
  - transaction frequency per account
  - activity over time (daily/weekly volume)
  - unique counterparties distribution

**Deliverables**
- Data Processing code
- Notebook with labeled plots

---

### Week 3 — Feature Engineering (Transaction + Account Level)
**Goals**
- Build transaction-level features:
  - time features (hour/day-of-week)
  - time since last transaction per account
  - rolling statistics (mean/std over time windows)
- Build account-level aggregations:
  - tx count, total volume, avg/std amount
  - in/out volume ratio, unique counterparties
  - volatility / burstiness features
- Verify no leakage (avoid future information)

**Deliverables**
- Feature Engineering code
- Feature tables saved (e.g., `data/processed/transactions_features.csv`, `accounts_features.csv`)

---

### Week 4 — Baselines + Preliminary Results (March Check-In Complete)
**Goals**
- Train baseline models:
  - Supervised: Logistic Regression / Random Forest
  - Unsupervised comparison: Isolation Forest / One-Class SVM
- Evaluate with:
  - precision, recall, F1, ROC-AUC
  - confusion matrix
- Quick error analysis:
  - inspect false positives/false negatives and hypothesize causes

**Deliverables (March Check-In Package)**
- At least one meaningful visualization + interpretation
- Clear cleaning steps + reasoning
- Defined prediction task + chosen features + justification
- Baseline metrics + preliminary interpretation

---

### Week 5 — Modeling (Stronger Models + Tuning)
**Goals**
- Try stronger models to see which achieves the best accuracy
- Tune for AML priorities (e.g., reduce false positives while maintaining recall)

**Deliverables**
- Improved model + documented tradeoffs and thresholds
- Updated evaluation plots

---

### Week 6 — Deeper Analysis + Final Visual Story
**Goals**
- Generate AML-style outputs:
  - account risk scoring + top risky accounts list
  - behavior patterns (bursts, many counterparties, rapid pass-through)
- Produce final-quality visualizations:
  - PR curve with threshold annotations
  - feature importance (if available)
  - time-series behavior for suspicious vs normal accounts

**Deliverables**
- Polished figures in `reports/figures/`
- Narrative draft of “findings + interpretation”

---

### Week 7 — Reproducibility: Tests + GitHub Actions + README Draft
**Goals**
- Add minimal, meaningful tests:
  - timestamp parsing works
  - feature outputs have expected columns/shapes
  - end-to-end pipeline runs on a small sample
- Add GitHub Actions CI workflow to run tests on push
- Draft README (final report format):
  1) How to build and run
  2) data + processing
  3) modeling approach
  4) results + visuals
  5) limitations + future work

**Deliverables**
- `tests/` + `.github/workflows/ci.yml`
- README draft + reproducible run commands

---

### Week 8 — Final Report + Presentation (Due 5/1)
**Goals**
- Lock final model + threshold and rerun full pipeline
- Finalize README report with visuals and interpretation
- Record 10-minute presentation and upload to YouTube
- Add video link at top of README
- Do a clean “reproduce from scratch” run

**Deliverables**
- Final repo + README report
- YouTube presentation link added
- Passing tests + CI

---

