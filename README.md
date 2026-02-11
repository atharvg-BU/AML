# AML
Anti Money Laundering Project - CS506

# AML (Anti-Money Laundering) Risk Detection Using Transaction Data

## Project Description
This project focuses on applying the full data science lifecycle to the problem of Anti-Money Laundering (AML) risk detection using publicly available transaction datasets. Financial institutions must analyze large volumes of transaction data to identify suspicious activity while controlling false positives.

The project will focus on understanding transaction behavior at both the transaction and account levels, engineering meaningful features, and evaluating machine learning models that identify anomalous or suspicious activity. Emphasis will be placed on clear goals, data understanding, and reproducible analysis appropriate for a two-month course project.

## Project Goals
The primary goals of this project are:
- Detect anomalous financial transactions based on behavioral patterns in transaction data.
- Identify and categorize high-risk accounts using transaction-level and account-level features.

These goals are specific and measurable. Success will be evaluated by comparing model outputs against labeled suspicious activity and reporting standard classification metrics such as precision, recall, and F1-score.

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
- Analyze false positives and false negatives to assess practical usefulne

