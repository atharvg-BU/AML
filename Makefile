PYTHON ?= python3
PIP ?= $(PYTHON) -m pip
NOTEBOOK ?= ds_final.ipynb
EXEC_NOTEBOOK ?= reports/ds_final.executed.ipynb

.PHONY: help all install test download run reproduce

help:
	@echo "Available targets:"
	@echo "  make all       Install dependencies and run tests"
	@echo "  make install   Install Python dependencies from requirements.txt"
	@echo "  make test      Run the repository test suite"
	@echo "  make download  Download IBM AML + SAML-D datasets into data/raw/"
	@echo "  make run       Open the final notebook in JupyterLab"
	@echo "  make reproduce Execute ds_final.ipynb and save the executed notebook"

all: install test

install:
	$(PIP) install -r requirements.txt

test:
	pytest tests/ -v --tb=short --timeout=60

download:
	$(PYTHON) data/download.py

run:
	$(PYTHON) -m jupyter lab $(NOTEBOOK)

reproduce:
	mkdir -p reports
	$(PYTHON) -m jupyter nbconvert --to notebook --execute $(NOTEBOOK) --output-dir reports --output $(notdir $(EXEC_NOTEBOOK))
