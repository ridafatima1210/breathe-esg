# Architectural Compromises & Omissions

### 1. Automated Unit Conversion Engine Graph
* **Compromise:** The prototype processes predefined common metrics (e.g., Liters, kWh, Miles) instead of utilizing dynamic unit conversion libraries.
* **Justification:** Hardcoded conversion schemas ensure predictable data states during initial client system tests, minimizing early edge-case processing failures.

### 2. Live Automated Third-Party OAuth Sign-In Flows
* **Compromise:** Live integrations with SAP OData endpoints or Concur sandboxes are replaced by structured batch payload drops.
* **Justification:** Implementing complete enterprise authentication trees takes a back seat to validating data normalization schemas and analyst verification interfaces.

### 3. Dynamic Calculation Factor Overrides
* **Compromise:** The emission coefficients are statically mapped instead of relying on real-time external grid intensity APIs.
* **Justification:** Using static local factors speeds up validation testing and provides consistent baselines for pipeline behavior analysis.