/** @typedef {'Critical' | 'High' | 'Medium'} Severity */
/** @typedef {{ icon: import('./icons.js').IconName, label: string, value: string, note: string, color: string }} Metric */
/** @typedef {{ title: string, severity: Severity, area: string, resource: string, description: string, evidence: string[], guidance: string }} Finding */
/** @typedef {{ title: string, metrics: Metric[], findings: Finding[], postureLabel: string, score: number }} Preview */

/** Presentation-only examples. These records are never fetched from a live environment.
 * @type {Readonly<Record<string, Preview>>}
 */
export const previews = {
  overview: {
    title: 'Security overview',
    metrics: [
      {
        icon: 'active-attack',
        label: 'Active attacks',
        value: '2',
        note: 'Assets under investigation',
        color: '#ef4444',
      },
      {
        icon: 'exposure-graph',
        label: 'Exposure paths',
        value: '7',
        note: 'Paths to investigate',
        color: '#f59e0b',
      },
      {
        icon: 'control-validation',
        label: 'Control pass rate',
        value: '84%',
        note: 'Passed evaluated checks',
        color: '#7c3aed',
      },
      {
        icon: 'identity-access',
        label: 'Identity risks',
        value: '15',
        note: 'Access findings to review',
        color: '#2563eb',
      },
    ],
    findings: [
      {
        title: 'Exposed workload with privileged access',
        severity: 'Critical',
        area: 'Identity',
        resource: 'demo-web-01',
        description:
          'An example investigation connecting a publicly reachable workload with a privileged identity associated with it.',
        evidence: [
          'The sample workload is marked internet-facing.',
          'An associated identity has elevated resource access.',
          'Exposure and identity details can be reviewed in a shared investigation.',
        ],
        guidance:
          'Confirm the expected reachability and review whether the identity needs the assigned privileges. Validate proposed changes with the resource owner.',
      },
      {
        title: 'Cloud configuration requires review',
        severity: 'High',
        area: 'Cloud',
        resource: 'demo-cloud-02',
        description:
          'A sample cloud assessment identifies a configuration that needs investigation in its resource context.',
        evidence: [
          'The finding belongs to an example cloud scope.',
          'Affected resource details are available alongside the assessment.',
          'The assessment is a demo result, not a live cloud evaluation.',
        ],
        guidance:
          'Review the configuration against the intended resource policy and determine which assets are affected before planning a change.',
      },
      {
        title: 'Endpoint coverage gap identified',
        severity: 'Medium',
        area: 'Endpoint',
        resource: 'demo-endpoint-03',
        description:
          'An example asset has an agent coverage condition that should be reviewed with its health information.',
        evidence: [
          'The asset appears in the demonstration inventory.',
          'A sample agent health assessment indicates a coverage gap.',
          'Coverage and control assessment results are distinct signals.',
        ],
        guidance:
          'Inspect the agent state, expected coverage and assessment history with the endpoint owner.',
      },
    ],
    postureLabel: 'Security posture',
    score: 84,
  },
  cloud: {
    title: 'Cloud security',
    metrics: [
      {
        icon: 'cloud-security',
        label: 'Cloud scopes',
        value: '3',
        note: 'Example accounts and workloads',
        color: '#7c3aed',
      },
      {
        icon: 'exposure-graph',
        label: 'Priority findings',
        value: '12',
        note: 'Cloud findings to investigate',
        color: '#ef4444',
      },
      {
        icon: 'infrastructure-network',
        label: 'Affected assets',
        value: '24',
        note: 'Assets in this example',
        color: '#2563eb',
      },
      {
        icon: 'control-validation',
        label: 'Assessment pass rate',
        value: '78%',
        note: 'Passed evaluated checks',
        color: '#059669',
      },
    ],
    findings: [
      {
        title: 'Public access on a cloud workload',
        severity: 'Critical',
        area: 'Azure',
        resource: 'demo-azure-app',
        description:
          'An illustrative Azure workload is flagged for review of its public access configuration.',
        evidence: [
          'The example workload is assigned to a demo subscription.',
          'An assessment flags public reachability.',
          'Resource and scope details provide the investigation context.',
        ],
        guidance:
          'Check whether public access is required, review the access policy and confirm the business context with the application owner.',
      },
      {
        title: 'Overprivileged cloud role',
        severity: 'High',
        area: 'AWS',
        resource: 'demo-aws-role',
        description:
          'An illustrative AWS identity has permissions that should be assessed against its intended workload.',
        evidence: [
          'The example role is associated with a demo account.',
          'The sample assessment identifies elevated permissions.',
          'The related workload gives context for reviewing the access.',
        ],
        guidance:
          'Compare the granted access with the workload requirements and review a narrower policy with the resource owner.',
      },
      {
        title: 'Workload configuration gap',
        severity: 'Medium',
        area: 'M365',
        resource: 'demo-m365-workload',
        description:
          'A sample Microsoft 365 workload assessment highlights a configuration condition for review.',
        evidence: [
          'The finding belongs to an illustrative Microsoft 365 workload.',
          'The assessment includes resource-level context.',
          'No production tenant is connected to this preview.',
        ],
        guidance:
          'Check the applicable tenant policy and the intended workload configuration before deciding on a remediation plan.',
      },
    ],
    postureLabel: 'Cloud assessment',
    score: 78,
  },
  controls: {
    title: 'Security control validation',
    metrics: [
      {
        icon: 'control-validation',
        label: 'Controls assessed',
        value: '15',
        note: 'Security control categories',
        color: '#7c3aed',
      },
      {
        icon: 'security-posture',
        label: 'Passed tests',
        value: '427',
        note: 'Passed evaluated checks',
        color: '#059669',
      },
      {
        icon: 'exposure-graph',
        label: 'Failed tests',
        value: '173',
        note: 'Checks requiring attention',
        color: '#ef4444',
      },
      {
        icon: 'agent-health',
        label: 'Pass rate',
        value: '71.2%',
        note: '427 of 600 evaluated',
        color: '#2563eb',
      },
    ],
    findings: [
      {
        title: 'Web application protection gap',
        severity: 'Critical',
        area: 'WAF',
        resource: 'demo-waf-control',
        description: 'An illustrative web application firewall assessment contains a failed control check.',
        evidence: [
          'The finding is associated with the WAF control category.',
          'A sample evaluated check did not meet its expected result.',
          'A failed validation check and a finding count are separate measures.',
        ],
        guidance:
          'Inspect the failed check and its policy context, confirm the affected applications and agree on a change with the control owner.',
      },
      {
        title: 'Endpoint detection check failed',
        severity: 'High',
        area: 'EDR',
        resource: 'demo-edr-control',
        description: 'A demonstration endpoint detection assessment includes a failed validation check.',
        evidence: [
          'The example check is part of an EDR control assessment.',
          'Assessment evidence can be reviewed with the affected asset.',
          'This is a sample validation result, not a live attack or remediation.',
        ],
        guidance:
          'Review the check evidence, endpoint state and expected detection policy before scheduling a follow-up validation.',
      },
      {
        title: 'Data protection policy needs review',
        severity: 'Medium',
        area: 'DLP',
        resource: 'demo-dlp-control',
        description:
          'An illustrative data protection assessment identifies a policy condition for investigation.',
        evidence: [
          'The sample finding belongs to a DLP control assessment.',
          'The assessment flags a policy condition that needs review.',
          'Supporting control and asset context belongs to the same example.',
        ],
        guidance:
          'Compare the policy with the intended protection requirements and discuss a correction with the data protection owner.',
      },
    ],
    postureLabel: 'Control pass rate',
    score: 71.2,
  },
};
