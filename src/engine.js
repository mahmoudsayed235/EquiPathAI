/** CareProof: deterministic, auditable, synthetic case-event evaluator.
 * The example checks are operational QA rules, NOT clinical decisions or real patient monitoring.
 */
export const EXAMPLES = {
  transfer: {
    name: 'County-to-county handoff',
    question: 'Who is responsible when the patient changes screening centres?',
    timeline: [
      { day: 0, type: 'positive_fit', unit: 'Screening centre A', label: 'Positive FIT test recorded' },
      { day: 2, type: 'followup_plan', unit: 'Screening nurse A', label: 'Follow-up assessment arranged' },
      { day: 4, type: 'transfer_sent', unit: 'Screening centre A', to: 'Screening centre B', label: 'Care transition sent to centre B' },
      { day: 8, type: 'check', unit: 'Coordinator A', label: 'No receiving-team acknowledgement found' }
    ],
    problem: 'Responsibility transfer is unverified, not proof that care was missed.',
    repair: 'Keep the sending coordinator accountable for reconciliation until the receiving team acknowledges the handoff.'
  },
  report: {
    name: 'Missing diagnostic report',
    question: 'What if an examination happens but its report is not visible?',
    timeline: [
      { day: 0, type: 'positive_fit', unit: 'Screening centre A', label: 'Positive FIT test recorded' },
      { day: 3, type: 'followup_plan', unit: 'Screening nurse A', label: 'Follow-up assessment arranged' },
      { day: 11, type: 'colonoscopy_booked', unit: 'Endoscopy unit', label: 'Colonoscopy appointment booked' },
      { day: 22, type: 'exam_claimed', unit: 'Endoscopy unit', label: 'Appointment marked attended, report absent' },
      { day: 29, type: 'check', unit: 'Screening nurse A', label: 'Diagnostic report not available' }
    ],
    problem: 'Completion evidence is missing; absence of a report does not prove an examination did not occur.',
    repair: 'Create a report-reconciliation task for the responsible screening team.'
  },
  referral: {
    name: 'Unacknowledged referral',
    question: 'Can a referral be sent but lack confirmation of ownership?',
    timeline: [
      { day: 0, type: 'positive_fit', unit: 'Screening centre A', label: 'Positive FIT test recorded' },
      { day: 2, type: 'referral_sent', unit: 'Primary care', to: 'Endoscopy unit', label: 'Colonoscopy referral submitted' },
      { day: 6, type: 'check', unit: 'Referral coordinator', label: 'No referral acceptance event found' }
    ],
    problem: 'Referral acceptance is unverified, not evidence of refusal or a missed treatment.',
    repair: 'Generate an ownership-verification task for a designated coordinator.'
  },
  resolved: {
    name: 'Verified continuity (negative control)',
    question: 'Does a complete pathway avoid unnecessary alerts?',
    timeline: [
      { day: 0, type: 'positive_fit', unit: 'Screening centre A', label: 'Positive FIT test recorded' },
      { day: 2, type: 'referral_sent', unit: 'Screening nurse A', to: 'Endoscopy unit', label: 'Referral sent' },
      { day: 3, type: 'referral_accepted', unit: 'Endoscopy unit', label: 'Referral accepted' },
      { day: 13, type: 'colonoscopy_booked', unit: 'Endoscopy unit', label: 'Examination booked' },
      { day: 20, type: 'exam_completed', unit: 'Endoscopy unit', label: 'Colonoscopy completed' },
      { day: 21, type: 'report_received', unit: 'Screening centre A', label: 'Report received' },
      { day: 21, type: 'clinical_closure', unit: 'Screening nurse A', label: 'Clinical follow-up documented' }
    ],
    problem: 'No unresolved continuity issue detected in the synthetic record.',
    repair: 'No operational change required.'
  }
};

function issue(code, title, description, owner, evidence) { return { code, title, description, owner, evidence }; }

export function evaluateEvents(events, { safeguards = false } = {}) {
  if (!Array.isArray(events)) throw new TypeError('Events must be an array');
  const types = new Set(events.map(e => e.type));
  const issues = [];
  if (types.has('transfer_sent') && !types.has('transfer_accepted') && !types.has('clinical_closure')) {
    issues.push(issue('TRANSFER_UNVERIFIED','Transfer acknowledgement missing','No verified acceptance from the receiving screening centre.','Sending screening coordinator','transfer_sent without transfer_accepted'));
  }
  if (types.has('referral_sent') && !types.has('referral_accepted') && !types.has('exam_completed') && !types.has('clinical_closure')) {
    issues.push(issue('REFERRAL_UNVERIFIED','Referral acknowledgement missing','No verified acceptance of the specialist referral.','Referral coordinator','referral_sent without referral_accepted'));
  }
  if ((types.has('exam_claimed') || types.has('exam_completed')) && !types.has('report_received') && !types.has('clinical_closure')) {
    issues.push(issue('REPORT_UNVERIFIED','Diagnostic report missing','The examination record has no corresponding report in the provided event stream.','Screening nurse','exam event without report_received'));
  }
  const tasks = safeguards ? issues.map((x,i)=>({
    id:`TASK-${String(i+1).padStart(3,'0')}`,issueCode:x.code,owner:x.owner,
    action:x.code==='TRANSFER_UNVERIFIED'?'Confirm receipt with the receiving centre, then document acceptance or alternative disposition.':x.code==='REFERRAL_UNVERIFIED'?'Verify referral status with the receiving unit and record the assigned next step.':'Contact the examination unit to reconcile the missing report and document the result.',
    status:'review task generated'
  })) : [];
  return { issues, tasks, verified:issues.length===0, accountable: issues.length>0 && tasks.length===issues.length };
}

export function evaluateScenario(name, safeguards = false) {
  if (!EXAMPLES[name]) throw new Error(`Unknown synthetic case: ${name}`);
  return evaluateEvents(EXAMPLES[name].timeline, { safeguards });
}

export function regionalStats(row,national={picked:421365,attended:309871,positives:14083,colonoscopies:10244}) {
  const completion = (row.colonoscopies / row.positives) * 100;
  const nationalCompletion = 100 * national.colonoscopies / national.positives;
  const participation = 100 * row.attended / row.picked;
  return {
    ...row, completion, nationalCompletion, participation,
    gap: completion-nationalCompletion,
    unresolved:row.positives-row.colonoscopies,
    // Descriptive scenario, not prediction, eligibility adjustment, or medical effect.
    hypotheticalAdditional: target => Math.max(0,Math.round(row.positives*(target/100)) - row.colonoscopies)
  };
}

export function generateActionPlan(row, scenario = 'transfer') {
  const s = regionalStats(row);
  const c = EXAMPLES[scenario] || EXAMPLES.transfer;
  return {
    county: row.region,
    focus: 'Colorectal screening follow-up',
    observed: `${s.completion.toFixed(1)}% recorded colonoscopy completion among positive FIT results (${row.colonoscopies}/${row.positives}), ${Math.abs(s.gap).toFixed(1)} percentage points ${s.gap<0?'below':'above'} the 2024 national figure.`,
    data_caution: 'Remaining positive tests are not automatically failures; clinical exclusions, alternative imaging, patient preference and missing reports are not distinguished by this aggregate measure.',
    intervention: 'Closed-loop follow-up coordination',
    diagnosis: c.problem,
    suggested_safeguard: c.repair,
    steps: ['Review and classify positive FIT cases without documented colonoscopy or alternative resolution.', 'Assign a named coordinator and require documented receiving-team acknowledgement or clinical disposition.', 'Monitor diagnostic follow-up completion and elapsed time, with clinically approved exception handling.'],
    owner: 'Wellbeing services county screening programme lead',
    kpi: 'Percentage of clinically eligible positive FIT cases with documented follow-up resolution within the locally approved time target.',
    evidence: ['Finnish Cancer Registry screening statistics 2024','Finnish colorectal screening quality manual (2024)'],
    verification: 'Replay synthetic interrupted and complete pathways; test that unresolved handoffs create assigned review tasks without falsely marking care completed.',
    assumptions: 'Proposed operational pilot; no real patient events, causal mortality claim, or known intervention effect size.'
  };
}
