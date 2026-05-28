# Real-World Corporate Data Ecosystem Research

### 1. SAP Material Ledgers
* **Reality Profile:** Standard system exports use localized technical identifiers (e.g., `MENGE` for Quantity, `MEINS` for Base Unit of Measure). Text fields frequently default to local operational languages like German.
* **Sample Payload Structure Used:**
  ```json
  { "MENGE": "4500", "MEINS": "LITER", "MATNR": "DIESEL_FUEL_04" }