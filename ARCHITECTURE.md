# CommercePilot Architecture

```text
                 ┌──────────────────────────┐
                 │     React Dashboard      │
                 │ metrics / opportunities  │
                 └────────────┬─────────────┘
                              │ REST
                              ▼
                 ┌──────────────────────────┐
                 │      Express API         │
                 │ dashboard / campaigns    │
                 └────────────┬─────────────┘
                              │
                     ┌────────┴────────┐
                     ▼                 ▼
              ┌─────────────┐   ┌──────────────┐
              │ Growth Data │   │  AI Agent    │
              │ mock/demo   │   │ OpenAI/local │
              └─────────────┘   └──────┬───────┘
                                       │
                                       ▼
                              Structured action plan
                                       │
                                       ▼
                              Merchant approval
                                       │
                                       ▼
                              Simulated execution
```

## Agent safety

The agent produces a structured plan. Execution is explicitly separated from planning and requires merchant approval. The prototype uses simulated execution so no real customers are contacted.
