# BreatheESG — Multi-Tenant Data Ingestion & Audit Pipeline
### Technical Evaluation Prototype Workspace

A responsive, high-fidelity full-stack application built to ingestion-stream, calculate, and audit Scope 1, Scope 2, and Scope 3 greenhouse gas emissions. The system models enterprise ERP workflows, captures asynchronous anomalies via predefined constraint handlers, and exposes a premium multi-tenant review sandbox dashboard for climate risk analysts.

---

## 🏗 System Architecture Overview

The system is split into two independent modules decoupled over an explicit JSON API abstraction tier:

* **Backend (`/backend`):** Built with Python and Django 4.2. Employs an extraction ingestion service schema to receive raw ERP metrics payloads, validate structures, map relational tenant hierarchies, compute explicit metrics formulas, and handle database persistence via an transactional SQLite lockbox engine.
* **Frontend (`/frontend`):** Built with React 18, Vite, and Tailwind CSS. Provides a premium, high-contrast dark visual command center featuring micro-analytic metrics counters, real-time activity scope tables, operational status indicators, and an interactive data lineage forensics side inspector.

---

## ⚡ Core Engineering Features

### 1. Extensible Data Ingestion Framework
The ingest controller dynamically validates and maps diverse enterprise payload formats into explicit global carbon ledger streams:
* **SAP/ERP (Scope 1 - Direct):** Direct diesel fuel tracking metrics measured explicitly in metric liters.
* **Utility Portals (Scope 2 - Indirect):** Location-based grid electricity monitoring measured via consumption kilowatt-hours (`kWh`).
* **Concur Travel (Scope 3 - Value Chain):** Business-travel aviation tracking processing airport routing pairs.

### 2. Operational Validation & Forensic Anomaly Trigger Engine
Every record flowing through the pipeline is automatically monitored by automated constraint hooks. If a row violates environmental limits or logical dates, it is permanently marked with an amber anomaly banner. Triggered constraints inside this prototype include:
* **Out-of-Period Flight Check:** Flags multi-leg travel entries that accidentally reuse identical destination codes (`LHR` to `LHR`) before emitting an audit flag.
* **Quantity Spikes:** Flags unrealistic transaction metric spikes for human verification review.

### 3. Absolute Auditor Sign-off Ledger Lifecycle
Records enter the ledger state as `PENDING`. Analysts can explicitly execute real-time state overrides (`APPROVED` / `REJECTED`) right from the UI dashboard view. Approved states permanently recalculate the global **Certified Carbon Footprint** workspace matrix.

---

## 🛠️ Local Sandbox Installation & Execution

### Prerequisites
* Python 3.9+ 
* Node.js 18+ & `npm`

### 1. Spin Up the Django Backend Server
```bash
# Move into the backend folder
cd backend

# Initialize your Python virtual isolated environment sandbox
python3 -m venv venv
source venv/bin/activate

# Upgrade local package handlers and download structural dependencies 
python3 -m pip install --upgrade pip
pip install -r requirements.txt

# Run initial database configuration scripts
python manage.py makemigrations ingestion
python manage.py migrate

# Seed the default demonstration organization data tenant record
python manage.py shell -c "from ingestion.models import Organization; Organization.objects.get_or_create(id=1, name='Enterprise Client Demo')"

# Launch the backend server local instance
python manage.py runserver
The backend instance will initialize live at: http://127.0.0.1:8000/

### 2. Spin Up the React Frontend Workspace
```bash
# Move into the backend folder
cd backend

# Initialize your Python virtual isolated environment sandbox
python3 -m venv venv
source venv/bin/activate

# Upgrade local package handlers and download structural dependencies 
python3 -m pip install --upgrade pip
pip install -r requirements.txt

