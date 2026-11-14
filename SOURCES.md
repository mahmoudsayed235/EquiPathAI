# Evidence provenance and limitations

## Main data: Finnish Cancer Registry (2024)

Official annual colorectal cancer screening statistics published 20 May 2026:
https://stats.cancerregistry.fi/joukkistilastot/colorectal.html

Data used: Wellbeing services counties → Screening process → **2024**; selected population (Picked), screening participation (Attended), positive FIT results, and recorded follow-up colonoscopies. CSV transcribed into `data/colorectal-2024.csv` and checked via counts reconciliation.

All 22 area rows sum to official 2024 national totals:

| Field | Verified total |
|---|---:|
| Selected | 421,365 |
| Attended | 309,871 |
| Positive FIT | 14,083 |
| Recorded colonoscopies | 10,244 |

Kymenlaakso: 14,431 selected; 10,098 attended; 496 positive FIT; 308 recorded colonoscopies; 62.1% completion vs national 72.7%.

*Do not call `496 - 308` 'missed care'. It means positive FIT tests without a recorded colonoscopy in this table. Other investigations and appropriate clinical dispositions are not represented by this simple calculation.*

## Regional outcome context: Cancer in Finland 2024

https://syoparekisteri.fi/assets/themes/ssy3/factsheets/cancer_in_finland_2024.html

Colorectal cancer age-standardised mortality, 2020–2024: Finland 22.0 per 100,000 person-years; Kymenlaakso 25.8. The registry identifies Kymenlaakso as significantly above the national average. **Do not draw causal claims from a 2024 screening indicator and 2020–2024 colorectal outcomes.**

## Clinical operational guidance

Finnish Cancer Registry/FICAN, *Quality manual for colorectal cancer screening* (18 April 2024):
https://syoparekisteri.fi/assets/files/2024/12/Quality-manual-for-colorectal-cancer-screening.pdf

Manual sections 11.3 and 12: if a participant changes screening centres after positive FIT but before further screening, the screening chain can be broken in reporting. It recommends colonoscopy within one month of a positive test and describes screening-nurse follow-up. This supports an operational **hypothesis** for testing, not an established explanation for regional differences.

## Strategic alignment

Finland, *National Cancer Strategy 2026–2035*; challenge resource:
https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf

The broader goal is equal effective cancer care (Goal 3); this prototype's deeper observed pathway is screening/diagnostic follow-up (also aligned with Goal 2). Demonstrating complete diagnosis-to-treatment tracking will need validated additional data.

## Data policies

- All demo statistics are **public aggregate** data, not medical records.
- Synthetic timelines use `DEMO` cases and fictional event messages.
- The rules engine measures *evidence of workflow continuity*, not medical outcomes.
- The what-if slider calculates counts from user-chosen percentages, **not** patient-level outcomes or intervention effectiveness.
- The optional LLM adapter is disabled by default and refuses requests without a configured server-side API key and separate demo access token.
