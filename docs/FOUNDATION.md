# Psukhe Project Foundation

Psukhe is an open-source research project for helping people understand patterns in their gameplay through explainable evidence.

## Product direction

The first usable experience will let a person connect a supported gaming profile, import achievement data, and receive an explainable behavioural profile. Every displayed insight must show the underlying gameplay evidence and state its limits. Psukhe does not diagnose people or treat gameplay as a complete account of personality.

Steam is the first platform because it is the repository's stated starting point. Other platforms, including Xbox and Blizzard, will be assessed after the first path is trustworthy and only where their public or user-authorised data access supports the same standard of explainability and user control.

## Evidence model

Psukhe separates:

1. **Observed facts** — platform-supplied achievements and available metadata.
2. **Normalised records** — a consistent representation of those facts.
3. **Behavioural interpretations** — transparent, revisable links between evidence and ontology concepts.
4. **Profile summaries** — carefully worded explanations, not personality labels or clinical claims.

An interpretation must identify the records and rules that produced it. Missing, private, or unavailable data must never be presented as absence of behaviour.

## Non-negotiable principles

- User ownership and control of connected data.
- Explainability before predictive sophistication.
- Evidence before assumptions.
- Reproducible research and versioned ontology decisions.
- Privacy by design and data minimisation.

## Initial delivery sequence

1. Define the data contract for a Steam achievement import.
2. Implement a small, end-to-end Steam-only path.
3. Create the first versioned behaviour ontology and evidence links.
4. Validate output with real users and document limits.
5. Assess additional platforms only after the above is reliable.

## Documentation map

This document is the starting point. As the first vertical slice takes shape, it will be split into roadmap, glossary, data-and-privacy, research methodology, ontology, and short decision records.

## Decisions to make together

Before shipping the first public user experience, we will decide the consent model, data-retention policy, public license, supported Steam access method, and the language used for behavioural insights.
