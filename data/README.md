## Downloading the final project datasets

Run this from the project root:

```bash
make download
```

or directly:

```bash
python data/download.py
```

This downloads the two datasets used by the final notebook:

- IBM AML
- SAML-D

`data/download.py` uses `kagglehub` and then creates symlinks inside `data/raw/` so the notebook can use stable local paths even though KaggleHub stores the actual files in a cache directory.

Before running the download step, make sure your Kaggle credentials are configured on the machine.
