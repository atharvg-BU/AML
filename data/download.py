import kagglehub
from pathlib import Path
import os

# adding datasets here
DATASETS =  {
    'ibm-aml': "ealtman2019/ibm-transactions-for-anti-money-laundering-aml",
    'czech_bank': "siavashraz/1999-czech-financial-dataset"
}

def main():
    ROOT = Path(__file__).resolve().parent.parent
    DATA_ROOT = ROOT / "data" / "raw"
    DATA_ROOT.mkdir(parents=True, exist_ok=True)

    for name, dataset in DATASETS.items():
        print(f"Downloading {name}")

        cache_path = Path(kagglehub.dataset_download(dataset)).resolve()
        link_path = DATA_ROOT / name

        if link_path.exists() or link_path.is_symlink():
            print("Already exists:", link_path)
            continue

        os.symlink(cache_path, link_path, target_is_directory=True)
        print("Created:", link_path)

if __name__ == "__main__":
    main()
