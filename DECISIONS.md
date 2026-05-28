# Architectural Strategy & Analytical Inferences

## Core Data Scope Assumptions
1. **SAP Interface Subsets:** Instead of handling enterprise-grade remote OData connections, the prototype parses localized text-based batch CSV ledger variants. This mimics standard automated cron exports extracted using standard internal transactions (`SE16N`).
2. **Utility Data Inconsistencies:** The pipeline parses continuous billing run windows rather than calendar months. Missing days or overlap flags are handled dynamically by triggering a `Suspicious` classification flag.
3. **Travel Routing Geometry:** Distance fields derived from Concur endpoints ignore routing paths. Instead, they default to using airport code geographic references (e.g., Great-Circle distance proxies) to avoid missing flight metric fields.

## Structural Strategy
* Custom data validations use native Django model triggers. This approach avoids dependency bloat from external pandas structures or calculation layer engines.
* The system enforces an automated fallback conversion schema to catch unexpected variations in input metrics.