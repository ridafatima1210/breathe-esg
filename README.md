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
```
```bash
# Initialize your Python virtual isolated environment sandbox
python3 -m venv venv
source venv/bin/activate
```
```bash
# Upgrade local package handlers and download structural dependencies 
python3 -m pip install --upgrade pip
pip install -r requirements.txt
```
```bash
# Run initial database configuration scripts
python manage.py makemigrations ingestion
python manage.py migrate
```
```bash
# Seed the default demonstration organization data tenant record
python manage.py shell -c "from ingestion.models import Organization; Organization.objects.get_or_create(id=1, name='Enterprise Client Demo')"
```
```bash
# Launch the backend server local instance
python manage.py runserver
```
# The backend instance will initialize live at: http://127.0.0.1:8000/

### 2. Spin Up the React Frontend Workspace
# Open a secondary terminal tab or terminal window:
```bash
# Move into the frontend directory workspace
cd frontend
```
```bash
# Install UI framework elements and Tailwind engines
npm install
```
```bash
# Run the local Vite dev server
npm run dev
```
# The frontend user interface will initialize live at: http://localhost:5173/

---

# 🌍 Production Cloud Deployment Configuration

## Backend Deployment
The backend service is deployed on **Render** using an explicit web service configuration powered through the **Gunicorn WSGI runtime interface** for scalable production execution.

## Frontend Deployment
The frontend application is deployed on **Vercel**, with the root optimization target configured directly toward the static production build generated inside the `/frontend` sub-directory.

---

# 📦 Core Documentation Manifest

The repository root workspace contains detailed technical and architectural reference documents explaining system design decisions, trade-offs, and implementation methodology.

## Documentation Files

### `MODEL.md`
Contains:
- Architectural blueprints
- Database schema field diagrams
- Carbon emission coefficient calculation formulas
- ESG computation model definitions

### `DECISIONS.md`
Contains:
- Foundational engineering decisions
- Framework and library selection reasoning
- Environment configuration choices
- Deployment architecture considerations

### `TRADEOFFS.md`
Contains:
- Speed vs scalability evaluations
- Data assumption explanations
- Dependency boundary discussions
- Performance optimization considerations

### `SOURCES.md`
Contains:
- Regulatory documentation references
- GHG Protocol citations
- EPA emission factor guidance references
- Sustainability data source acknowledgements

---

# 🚀 Deployment Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | Vercel |
| Backend    | Render |
| Runtime    | Gunicorn |
| Framework  | Django |
| API Layer  | Django REST Framework |

---

# 📁 Repository Structure

```bash
project-root/
│
├── backend/
├── frontend/
│
├── MODEL.md
├── DECISIONS.md
├── TRADEOFFS.md
├── SOURCES.md
│
└── README.md
```
