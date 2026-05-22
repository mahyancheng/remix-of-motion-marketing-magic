# Open-Source Bloomberg-Maven Hybrid: Research Lineage and Proposed Architecture

> Status: research scaffold. No code yet — this document fixes the problem
> statement, the lineage of prior art, and the proposed architecture before
> anything gets built.

## 1. Problem statement

Build an open-source analytical terminal that combines:

- The **breadth and real-time feel of Bloomberg Terminal** — multi-asset, multi-source,
  charting, news, screening — using only open or cheap data feeds.
- The **ontology + agent capabilities of Palantir Maven / AIP / Foundry** — a typed
  object model over heterogeneous data, with LLM-driven agents that can reason
  about, query, and act on that model.

The terminal is the *delivery surface*. The underlying research bet is that a
**deliberately messy, multi-source ingest** + **random-matrix-theory (RMT)
compression** + **bidirectional masked transformer** + **cross-source backcasting
validation** is a coherent training recipe that has not been assembled before in
the literature, even though every individual piece has prior art.

## 2. The core research bet, in one paragraph

Most financial ML overfits because the sample correlation matrix is dominated
by noise when the number of features N is comparable to the number of time
observations T. Marchenko-Pastur (1967) tells us *exactly* which eigenvalues
of a sample covariance matrix are statistically indistinguishable from noise.
Ledoit-Péché (2011) and subsequent rotationally-invariant estimators tell us
how to optimally shrink them. If we (a) ingest an enormous, deliberately
unfiltered set of sources to maximize the chance of capturing real
cross-modal structure, (b) RMT-clean the resulting covariance before any
modeling, (c) train a bidirectional masked transformer over the cleaned
multimodal stream, and (d) validate by predicting *backward* on a held-out
*data source* (not a held-out time slice), then we get a model whose
generalization claim is mechanically stronger than the standard
forward-prediction-on-held-out-time setup. Forward prediction can be gamed
by autocorrelation; backcasting requires the model to have learned a
generative structure, because the forward arrow of market microstructure
destroys information.

## 3. Research lineage

Every component below has prior art. The novelty is the *combination*, not
any single piece.

### 3.1 Random matrix theory for financial covariance

| Year | Authors | Contribution |
|------|---------|--------------|
| 1955 | E. Wigner | Random matrix theory for nuclear energy levels |
| 1967 | V. Marchenko, L. Pastur | Limiting spectral distribution of large sample covariance matrices |
| 1999 | L. Laloux, P. Cizeau, J.-P. Bouchaud, M. Potters | First application of MP to S&P 500 — found only ~6% of eigenvalues outside the noise bulk |
| 2004 | O. Ledoit, M. Wolf | Linear shrinkage estimator for large covariance matrices |
| 2011 | O. Ledoit, S. Péché | Eigenvectors of large sample covariance matrix ensembles (arXiv:0911.3010) — foundation of nonlinear shrinkage |
| 2015-2020 | O. Ledoit, M. Wolf | QuEST / analytical nonlinear shrinkage |
| 2016-2017 | J. Bun, J.-P. Bouchaud, M. Potters | Rotationally-invariant estimators; survey "Cleaning large correlation matrices: tools from random matrix theory" |

**Practical: Capital Fund Management (CFM)** has run RMT-cleaned strategies
in production for two decades and publishes openly.

### 3.2 Multi-source / alt-data ingestion at scale

- **Numerai** — closest *public* analog: ~thousands of obfuscated features,
  crowdsourced models, careful overfit controls. Open to participate.
- **WorldQuant BRAIN / Alphathon** — crowdsourced alpha mining on a curated
  dataset.
- **Two Sigma, Renaissance, Citadel, DE Shaw, Point72** — private; the
  industry standard.
- **OpenBB Terminal** — open-source Bloomberg analog; closest existing
  product to the terminal layer we want.

### 3.3 Foundation models for time series and finance

| Model | Author | Notes |
|-------|--------|-------|
| BloombergGPT (2023) | Bloomberg | 50B-param LLM on financial text; text only |
| Chronos | Amazon | Time-series foundation model, tokenized numeric series |
| Moirai | Salesforce | Universal time-series forecasting transformer |
| TimesFM | Google | Decoder-only TS foundation model |
| Lag-Llama | ServiceNow et al. | Open foundation model for probabilistic TS forecasting |
| JPMorgan DocLLM | JPMorgan | Document-layout-aware financial LLM |

None train on the messy multimodal mix (numeric + text + on-chain + satellite
+ shipping + filings) with bidirectional masking that we propose.

### 3.4 Validation methodology

- **Combinatorial purged cross-validation** — M. López de Prado, *Advances
  in Financial Machine Learning* (2018). The current state of the art for
  defeating temporal leakage in finance.
- **Backcasting** — standard in IPCC climate models and macroeconomic
  nowcasting; rarely applied as the *primary* validation metric in finance.
- **Held-out-by-source** rather than held-out-by-time — we are not aware of
  this being formalized in the finance literature.

## 4. Proposed architecture

```
                       ┌──────────────────────────────────────────────┐
                       │           TERMINAL UI (React)                │
                       │  panels: chart / screener / chat / ontology  │
                       │  TradingView Lightweight Charts, AG Grid,    │
                       │  FINOS Perspective                           │
                       └──────────────────────────────────────────────┘
                                          ▲
                                          │ GraphQL / WS
                                          ▼
   ┌─────────────────────────────────────────────────────────────────────┐
   │                       AGENT LAYER (Maven-style)                     │
   │   LangGraph / Claude Agent SDK orchestrator                         │
   │   Tools: ontology query, backtest, screen, alert, document fetch    │
   └─────────────────────────────────────────────────────────────────────┘
                                          ▲
                                          │
                                          ▼
   ┌────────────────────────────┐   ┌────────────────────────────────────┐
   │   ONTOLOGY (typed graph)   │   │       INFERENCE SERVICE            │
   │   Neo4j or TerminusDB      │   │  bidirectional masked transformer  │
   │   Object types: Security,  │   │  serves: forecast, backcast,       │
   │   Issuer, Event, Filing,   │   │           embedding, anomaly       │
   │   Position, Counterparty   │   │                                    │
   └────────────────────────────┘   └────────────────────────────────────┘
                ▲                                    ▲
                │                                    │
                └────────────────┬───────────────────┘
                                 │
                                 ▼
   ┌─────────────────────────────────────────────────────────────────────┐
   │                  FEATURE / SIGNAL LAYER                             │
   │   RMT cleaning (MP cutoff + nonlinear shrinkage)                    │
   │   Per-modality encoders → shared embedding space                    │
   │   ClickHouse / QuestDB for tick + bar storage                       │
   │   DuckDB for ad-hoc analytical queries                              │
   └─────────────────────────────────────────────────────────────────────┘
                                 ▲
                                 │
                                 ▼
   ┌─────────────────────────────────────────────────────────────────────┐
   │                       INGEST LAYER                                  │
   │   Sources (deliberately broad, deliberately uncleaned):             │
   │     prices: ccxt, yfinance, Alpaca, Polygon free tier               │
   │     filings: SEC EDGAR, company websites                            │
   │     news: GDELT, RSS firehose, HN, Reddit                           │
   │     on-chain: public node RPCs, Dune                                │
   │     macro: FRED, World Bank, IMF                                    │
   │     shipping/satellite: AIS public feeds, Sentinel-2 open data      │
   │     weather: NOAA, ECMWF open data                                  │
   │   Transport: Kafka or Redpanda; orchestration: Dagster              │
   └─────────────────────────────────────────────────────────────────────┘
```

## 5. The training + validation recipe

1. **Ingest broadly, store raw.** No cleanup at ingest time. Each event is
   tagged with `{source_id, ingest_ts, event_ts, modality}`.
2. **Per-modality tokenization.** Numeric series → quantile-binned tokens
   (Chronos-style). Text → BPE. Events → typed event tokens.
3. **Align onto a common time axis** at multiple resolutions (1m, 1h, 1d).
4. **RMT-clean the cross-feature covariance** at each resolution. Drop or
   shrink eigenmodes inside the Marchenko-Pastur support; keep the rest as
   the active feature subspace.
5. **Pretrain a bidirectional masked transformer** on the cleaned multimodal
   token stream. Mask spans in both temporal directions.
6. **Validate by source holdout, not time holdout.**
   - Train on sources {A, B, C, D, E}.
   - Hold out source F entirely.
   - Mask spans within sources {A..E} and measure reconstruction.
   - Then mask spans of *source F* given {A..E} as context and measure
     reconstruction — both forward and backward in time.
   - A model that has learned real structure should backcast F from {A..E}
     above noise floor; a model that has memorized correlations specific to
     {A..E} cannot.
7. **Report backcast accuracy as the headline metric**, alongside forward
   forecast accuracy. Backcast > noise floor on held-out source = signal.

## 6. Why this is worth doing

- **Each component is proven.** RMT cleaning has 25 years of deployment at
  CFM and elsewhere. Foundation TS models (Chronos, Moirai, TimesFM) are a
  year old and work. Numerai validates the "crowd-sourced messy feature"
  thesis at small scale.
- **The combination is not in the literature.** Specifically, "messy
  multimodal ingest → RMT compress → bidirectional pretrain →
  held-out-by-source backcast validation" is, as far as we can tell, novel.
- **The terminal is a useful artifact even if the research bet fails.** An
  open-source OpenBB-equivalent with an ontology + agent layer is valuable
  on its own; the research model becomes one inference tool among several.

## 7. Roadmap

Phase 0 — research scaffold (this document).

Phase 1 — minimum viable ingest:
- One numeric source (yfinance daily for S&P 500).
- One text source (SEC EDGAR 10-K/10-Q).
- DuckDB + Parquet storage, no streaming yet.

Phase 2 — RMT cleaning notebook:
- Implement MP cutoff + Ledoit-Wolf nonlinear shrinkage from scratch.
- Reproduce the Laloux 1999 result on current S&P data as a sanity check.

Phase 3 — terminal UI skeleton:
- React panel system (we have the React app already).
- Chart panel + screener panel + chat panel.
- Backed by FastAPI/GraphQL serving cleaned data and naive forecasts.

Phase 4 — ontology + agent:
- Neo4j with Security / Issuer / Filing / Event types.
- LangGraph agent with ontology-query tool, backtest tool, screen tool.

Phase 5 — training run:
- Tokenize multimodal stream.
- Pretrain small (≤500M param) bidirectional transformer.
- Implement source-holdout backcast validation harness.
- Report numbers honestly. Kill or scale based on results.

## 8. Open questions

- How small can the bidirectional model be and still backcast above noise
  floor? (Smaller is better — easier to iterate.)
- What is the right tokenization for fundamentally different modalities
  (continuous tick prices vs discrete event tokens vs natural language)?
  Single shared vocabulary or per-modality vocabularies with cross-attention?
- Does RMT cleaning interact well with learned embeddings, or do we need to
  rederive an analog of MP for the embedding space?
- Source-holdout validation: how many sources do we need before the metric
  becomes statistically meaningful?

## 9. References

- Marchenko, V. A.; Pastur, L. A. (1967). "Distribution of eigenvalues for
  some sets of random matrices." *Math USSR-Sbornik.*
- Laloux, L.; Cizeau, P.; Bouchaud, J.-P.; Potters, M. (1999). "Noise
  dressing of financial correlation matrices." *Physical Review Letters.*
- Ledoit, O.; Wolf, M. (2004). "A well-conditioned estimator for
  large-dimensional covariance matrices." *Journal of Multivariate Analysis.*
- Ledoit, O.; Péché, S. (2011). "Eigenvectors of some large sample covariance
  matrix ensembles." *Probability Theory and Related Fields.* arXiv:0911.3010
- Bun, J.; Bouchaud, J.-P.; Potters, M. (2017). "Cleaning large correlation
  matrices: tools from random matrix theory." *Physics Reports.*
- López de Prado, M. (2018). *Advances in Financial Machine Learning.* Wiley.
- Wu, S. et al. (2023). "BloombergGPT: A Large Language Model for Finance."
  arXiv:2303.17564
- Ansari, A. F. et al. (2024). "Chronos: Learning the Language of Time
  Series." arXiv:2403.07815
- Woo, G. et al. (2024). "Moirai: A Time Series Foundation Model."
  arXiv:2402.02592
- Das, A. et al. (2024). "TimesFM: A decoder-only foundation model for time
  series forecasting." arXiv:2310.10688
