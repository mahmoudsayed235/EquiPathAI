# EquiPath AI — Team business walkthrough

**The one-sentence story:** EquiPath AI turns real Finnish regional cancer data into a practical investigation, then tests whether a proposed *handoff safeguard* creates an accountable review task. **The regional data are real; the case events used to test the safeguard are synthetic.**

## 1. Three screens, one business workflow

| Screen | Question it answers | What to click |
|---|---|---|
| **National Radar** | Which region deserves investigation? | Select **Kymenlaakso** from the 22-area comparison. |
| **Pathway Explorer** | At which *measured* stage does the gap show up? | Read the four-step screening path and compare 62.1% with the national 72.7%. |
| **CareProof Action Lab** | Can a continuity failure be detected and handed to a responsible professional? | Pick **County-to-county handoff**, then **Apply safeguard & replay**. Try **Verified continuity** as a negative control. |

**Who benefits?** A wellbeing services county screening lead, referral coordinator, or quality manager. The prototype is a decision-support and process-quality tool, not patient diagnosis software.

## 2. What every important number means

### Screen A — National Radar · real 2024 Finnish Cancer Registry data

| On-screen field | Value | Interpretation / formula |
|---|---:|---|
| **People selected for screening** | **421,365** | People in the 2024 programme cohort; not all were necessarily mailed an invitation. |
| **Screening participation** | **73.5%** | 309,871 participants ÷ 421,365 selected. |
| **Positive FIT tests** | **14,083** | Participants with positive faecal immunochemical tests (FIT). About 4.5% of participants. |
| **Colonoscopy follow-up** | **72.7%** | 10,244 with a recorded colonoscopy ÷ 14,083 positive tests. Not the rate of all clinically appropriate resolutions. |
| **22** | **22 regions** | Mainland wellbeing services areas including Helsinki; excludes Åland. |
| **10 below national rate** | **10 regions** | A simple count with recorded colonoscopy rate below 72.7%; **not** a validated quality ranking. |
| **Regional table: Positive FIT** | Depends on region | Number of positive tests in that county. |
| **Regional table: Follow-up** | Depends on region | Recorded colonoscopies ÷ positive tests for that county. |
| **Regional table: VS FI** | Percentage points | County follow-up rate minus national rate. `pp` means *percentage points*, not percent change. |

### Screen B — Pathway Explorer · Kymenlaakso, 2024

| Stage / field | Value | Interpretation |
|---|---:|---|
| **Selected** | **14,431** | People selected for local colorectal screening. |
| **Participated** | **10,098 (70.0%)** | People who participated; divided by selected. |
| **Positive FIT** | **496 (4.9%)** | Positive results; divided by participants. |
| **Recorded colonoscopy** | **308 (62.1%)** | Positive-test participants with a colonoscopy recorded in the programme table. |
| **National completion** | **72.7%** | Comparator for *recorded colonoscopy* follow-up. |
| **Difference** | **−10.6 pp** | 62.1% − 72.7%, using unrounded rates. |
| **No recorded colonoscopy** | **188** | 496 − 308. This does **not** establish that 188 people missed needed care. |
| **Goal 3 context** | **25.8 vs 22.0** | Kymenlaakso vs Finland age-standardised colorectal mortality per 100,000 person-years for **2020–2024**. It is a different population and period: **no causal claim**. |

**Important nuance:** Public aggregates cannot identify delayed patients, clinical exclusions, patient choices, CT colonography or reporting differences. The Finnish screening quality manual recommends colonoscopy within one month after a positive FIT, but the on-screen table contains no individual waiting-time values.

### Screen C — Action Lab · synthetic software demonstration

| On-screen element | Business meaning |
|---|---|
| **4 scenario choices** | County handoff, missing report, unacknowledged referral, and fully resolved pathway. The cases are fictional, not real patients. |
| **DAY 0 / 2 / 4 / 8** | Fictional timeline of test events; not real medical waiting times. |
| **Baseline: 1 UNVERIFIED** | A required acknowledgement or report is absent in the simulated event record. No review task yet. |
| **Safeguard check passed** | The deterministic engine generated a review task linked to the unresolved event. This is software behaviour, not care delivery. |
| **TASK-001** | A synthetic task record with an assigned role, such as *Sending screening coordinator*. |
| **Accountable owner** | Proposed real-life owner of the quality-improvement programme: the wellbeing services county screening programme lead. |
| **Primary KPI** | Share of clinically eligible positive FIT cases with documented diagnostic resolution within an agreed time target. *This is a future pilot KPI, not measured by this demo.* |
| **What-if target: 73%** | A user-selected hypothetical goal, not an AI forecast. |
| **Projected count: 362** | `round(496 × 0.73)`. |
| **Additional: +54** | `362 − 308`; arithmetic change in recorded colonoscopy count **if** 73% were achieved with a cohort of the same size. |
| **Evidence interpreter** | Offline answers are a transparent **rules-based explainer**. Optional live LLM requires private backend settings and a demo access code. |
| **Export action plan** | Downloads a JSON record of the observed aggregate data, proposed safeguard, owner, KPI, synthetic test result and source links. |

### Screen D — Evidence & Sources

Links to Finnish Cancer Registry screening statistics, regional cancer outcome context, the Finnish colorectal screening quality manual, and Finland's National Cancer Strategy. It also labels information as **observed**, **derived**, **synthetic** or **unknown**.

## 3. The business value in 30 seconds

> Our first finding is not that patients were neglected. It is that a measurable share of positive screening results lacks a colonoscopy recorded in the public programme statistics. The product highlights the region and the pathway step, then helps a county investigate the possible reasons. Separately, CareProof demonstrates how a missing handoff acknowledgement could be detected and assigned for review. That is the practical contribution: from a regional signal to a testable operational safeguard.

### Suggested team demo: 90 seconds

1. **20 sec — National Radar:** Show real national totals, choose Kymenlaakso, explain the 62.1% vs 72.7% gap.
2. **20 sec — Pathway Explorer:** Walk through 14,431 → 10,098 → 496 → 308 and explain why 188 is *not* a count of missed care.
3. **35 sec — Action Lab:** Run the county-transfer failure: baseline **1 unverified** → safeguard creates **one assigned review task**. Switch to the fully resolved case to show there is **no false alert**.
4. **15 sec — Close:** Show the county action plan, responsible owner, KPI, and a *clearly hypothetical* 73% scenario.

## 4. Technical map: what is actually implemented?

- `data/colorectal-2024.csv` and `data/regions-2024.js`: 2024 official **aggregate counts** for 22 areas.
- `src/app.js`: dashboard, figures, navigation, simulated cases, export and offline answers.
- `src/engine.js`: **deterministic** workflow rules and task assignment logic. It does **not** diagnose cancer or infer actual missed treatment.
- `tests/engine.test.js`: 11 passing tests covering data reconciliation, three failure types and a negative control.
- `api/analyze.js`: **optional** POST `/api/analyze` serverless AI explanation endpoint; needs server-side `OPENAI_API_KEY` and separate `DEMO_ACCESS_TOKEN`. Not required for the static site.

**Neither the static app nor the prototype database includes actual patient records.** A clinical pilot would require hospital integration, authorised data, clinical governance and evaluation.

### Primary sources

- Finnish Cancer Registry colorectal screening 2024: https://stats.cancerregistry.fi/joukkistilastot/colorectal.html
- Cancer in Finland 2024: https://syoparekisteri.fi/assets/themes/ssy3/factsheets/cancer_in_finland_2024.html
- Colorectal screening quality manual: https://syoparekisteri.fi/assets/files/2024/12/Quality-manual-for-colorectal-cancer-screening.pdf
- National Cancer Strategy 2026–2035: https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf
