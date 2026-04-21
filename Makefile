PYTHON ?= python3
PIP ?= $(PYTHON) -m pip
NOTEBOOK ?= ds_final.ipynb

.PHONY: help install test download run

help:
	@echo "Available targets:"
	@echo "  make install   Install Python dependencies from requirements.txt"
	@echo "  make test      Run the repository test suite"
	@echo "  make download  Download IBM AML + SAML-D datasets into data/raw/"
	@echo "  make run       Open the final notebook in JupyterLab"

install:
	$(PIP) install -r requirements.txt

test:
	pytest tests/ -v --tb=short --timeout=60

download:
	$(PYTHON) data/download.py

run:
	$(PYTHON) -m jupyter lab $(NOTEBOOK)
