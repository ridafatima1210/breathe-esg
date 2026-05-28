# Corporate Multi-Tenant ESG Data Model Architecture

## Design Methodology
The data architecture relies on decoupled transaction ingestion tracking combined with consolidated storage arrays (`NormalizedEmissionData`). This provides high lookup flexibility without over-complicating database normalization.

### 1. Multi-Tenancy Strategy
* Enforced through an explicit logical foreign key constraint link directly referencing `Organization`. Every transaction, query, view scope, and transformation flow checks against the authenticated user organization perimeter context.

### 2. Scope Categorization Compliance
* **Scope 1 (Direct Emissions):** Captured from raw structural material processing line records (e.g., stationary combustion elements present within raw structural industrial system files under SAP configurations).
* **Scope 2 (Indirect Grid Infrastructure):** Driven entirely through grid consumption logs metrics (`UTILITY` entries matching meter intervals).
* **Scope 3 (Extended Value Chain Ecosystem):** Extracted from third-party transaction systems (e.g., flight legs data tracking captured via `CONCUR`).

### 3. Verification Data Lineage & Audit Trails
* Records lock instantly into immutable storage arrays after transitions change to status `APPROVED`.
* The `raw_payload_snapshot` JSON element retains the unmodified context structure. This ensures transparency if parsing anomalies require human data forensic evaluation.