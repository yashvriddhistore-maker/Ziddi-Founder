// Ziddi DMAIC Mastermind 18-Meeting Framework Configuration Data

const MASTERMIND_DATA = {
  Q1: {
    title: "QUARTER 1: DEFINE & MEASURE PHASE",
    subtitle: "Months 1 to 6 (M1 - M6)",
    color: "#FFB23F",
    badge: "PHASE 01 // DEFINE & MEASURE",
    meetings: [
      {
        id: "M1",
        number: 1,
        title: "Core Problem Definition",
        objective: "Find the root problem, baseline metrics, and set the 1-year 'Ziddi' goal.",
        trainerAction: "Have the client fill out Parts 1 & 2 before the call to jump straight into Root Cause Analysis.",
        microTask: "Complete the 5-Whys worksheet.",
        fields: [
          { id: "baseline_rev", label: "Baseline Revenue & Leads", type: "text", placeholder: "e.g. Current Avg Monthly Revenue ₹15L, Lead-to-Conversion Rate 4%", hint: "Current Average Monthly Revenue & Lead-to-Conversion Rate." },
          { id: "five_whys", label: "5-Whys Analysis (Root Cause)", type: "textarea", placeholder: "Why #1: Sales fluctuating -> Why #2: No follow-up system -> Why #3: Manual leads handling...", hint: "Uncovering the root cause of the biggest business challenge." },
          { id: "target_goal", label: "1-Year Ziddi Target Goal", type: "text", placeholder: "e.g. ₹50L/mo Revenue with 50% reduced founder involvement", hint: "Clear, measurable 1-year objective." }
        ]
      },
      {
        id: "M2",
        number: 2,
        title: "Process Mapping",
        objective: "Map the client's business journey and identify where the process breaks.",
        trainerAction: "Step-by-step mapping of the client's customer journey.",
        microTask: "Write a 3-step sales script or process fix (15 mins daily).",
        fields: [
          { id: "process_steps", label: "Core Process Flow", type: "textarea", placeholder: "Lead Gen ➔ Conversion ➔ Delivery ➔ Follow-up details...", hint: "Map customer journey from entry to delivery." },
          { id: "bottleneck_id", label: "Primary Bottleneck Location", type: "text", placeholder: "e.g. Delivery delay due to founder approval required on every design", hint: "Which step takes the most time or loses clients?" },
          { id: "impact_assessment", label: "Speed & Revenue Impact", type: "textarea", placeholder: "If lead conversion speed doubles, revenue increases by 35% without extra ads.", hint: "How a 50% speed increase affects revenue." }
        ]
      },
      {
        id: "M3",
        number: 3,
        title: "Data & Measurement",
        objective: "Establish tracking habits ('What gets measured, gets managed').",
        trainerAction: "Shift the client from feelings-based management to data-based tracking.",
        microTask: "Record daily sales and leads in the tracker.",
        fields: [
          { id: "metrics_tracked", label: "Key Metrics Tracked", type: "textarea", placeholder: "Growth (Revenue ₹), Sales (Conversion %), Productivity (Focus Hours)", hint: "Growth, Sales, Productivity KPIs." },
          { id: "goals_vs_actuals", label: "Weekly Goals vs Actuals", type: "textarea", placeholder: "Target: 20 leads/wk, Actual: 12 leads/wk (Gap: 8 leads)", hint: "Measuring performance gaps." },
          { id: "gap_log", label: "Gap Analysis Log", type: "text", placeholder: "Gap variance logged & root cause note", hint: "Logging performance variance." }
        ]
      },
      {
        id: "M4",
        number: 4,
        title: "The Reality Check",
        objective: "Analyze tracking data and evaluate variance.",
        trainerAction: "Audit work habits and adherence to previous atomic habits.",
        microTask: "Optimize the identified root cause fix.",
        fields: [
          { id: "variance_analysis", label: "Variance Analysis (+/- %)", type: "text", placeholder: "e.g. Sales Target -18% variance, Time Spent +30% on ops", hint: "Baseline vs. Current Status variance." },
          { id: "root_cause_cat", label: "Root Cause Category", type: "select", options: ["Process Gap", "Skill Gap", "Mindset / Habit Gap", "Resource Constraint"], hint: "Is it Process, Skill, or Mindset?" },
          { id: "course_correction", label: "Immediate Course Correction Plan", type: "textarea", placeholder: "Fixing issues before they compound...", hint: "Action plan to fix variance." }
        ]
      },
      {
        id: "M5",
        number: 5,
        title: "Identifying the Gaps",
        objective: "Deep-dive into performance gaps using Six Sigma methodology.",
        trainerAction: "Reframe gaps not as failures, but as valuable data points.",
        microTask: "Run a gap-closure checklist.",
        fields: [
          { id: "shortfall_metric", label: "Goal vs Actual Result", type: "textarea", placeholder: "Target: 50 clients served, Actual: 32 clients. Shortfall: 18.", hint: "Measuring the exact performance shortfall." },
          { id: "gap_quantification", label: "Gap Quantification & Impact", type: "text", placeholder: "₹3.6 Lakh revenue shortfall due to conversion delay", hint: "Calculating exact difference & cost." },
          { id: "gap_mapping", label: "Root Cause Mapping Checklist", type: "textarea", placeholder: "Why the gap occurred and what process step failed...", hint: "Detailed mapping of root cause." }
        ]
      },
      {
        id: "M6",
        number: 6,
        title: "Q1 Review & Alignment",
        objective: "Post-mortem of Q1 and strategic pivot for Q2.",
        trainerAction: "Celebrate wins, lock successful processes into SOPs, and set the Q2 agenda.",
        microTask: "Summarize top 3 root cause insights for Q2 prep.",
        fields: [
          { id: "q1_end_results", label: "Q1 Final KPI Results", type: "textarea", placeholder: "Final review against targets...", hint: "Final KPI review against Q1 targets." },
          { id: "lessons_sop", label: "Lessons Learned & SOP Conversion", type: "textarea", placeholder: "Winning sales script converted into SOP v1.0...", hint: "Converting successes into locked SOPs." },
          { id: "q2_transition", label: "Q2 Transition Strategy", type: "textarea", placeholder: "Transitioning to Analyze & Improve Phase...", hint: "Preparing for Q2 Analyze phase." }
        ]
      }
    ]
  },
  Q2: {
    title: "QUARTER 2: ANALYZE & IMPROVE PHASE",
    subtitle: "Months 7 to 11 (M7 - M11)",
    color: "#6FCF97",
    badge: "PHASE 02 // ANALYZE & IMPROVE",
    meetings: [
      {
        id: "M7",
        number: 7,
        title: "Root Cause Deep-Dive",
        objective: "Uncover deep underlying causes using the 5-Whys framework.",
        trainerAction: "Categorize flaws strictly to ensure precise remediation.",
        microTask: "Run 5-Whys analysis on top 2 business bottlenecks.",
        fields: [
          { id: "identified_prob", label: "Identified Problem (from Q1)", type: "textarea", placeholder: "High customer acquisition cost and long sales cycle...", hint: "Sourced from Q1 gaps." },
          { id: "deep_5whys", label: "5-Whys Deep Analysis", type: "textarea", placeholder: "Digging past surface symptoms to structural root cause...", hint: "Digging past symptoms." },
          { id: "defect_cat", label: "Defect Classification", type: "select", options: ["Process Flaw", "Skill Deficit", "Mindset Constraint", "Tool Breakdown"], hint: "Process, Skill, or Mindset gap." },
          { id: "ziddi_fix", label: "Targeted Ziddi Fix (Atomic Action)", type: "text", placeholder: "e.g. Automated qualification quiz before sales call", hint: "The targeted atomic action." }
        ]
      },
      {
        id: "M8",
        number: 8,
        title: "Pilot Action Tracker",
        objective: "Test solutions through small-scale pilot runs.",
        trainerAction: "Treat failed pilot runs as data inputs rather than failures.",
        microTask: "Implement the Ziddi Fix on a sample of 5 leads/tasks.",
        fields: [
          { id: "proposed_fix", label: "Proposed Ziddi Fix Solution", type: "text", placeholder: "e.g. Standardized 5-min demo video before booking call", hint: "The tested solution." },
          { id: "expected_metric", label: "Expected Metric Outcome", type: "text", placeholder: "Increase qualified call rate from 20% to 50%", hint: "Projected improvement percentage." },
          { id: "pilot_results", label: "Pilot Run Result & Real-world Lessons", type: "textarea", placeholder: "Tested on 10 leads: 6 qualified immediately, saved 4 hours...", hint: "Real-world feedback data." }
        ]
      },
      {
        id: "M9",
        number: 9,
        title: "Validation & Optimization",
        objective: "Validate pilot metrics and establish standardization.",
        trainerAction: "Ensure the solution moves the bottom-line before standardizing.",
        microTask: "Convert the successful pilot into a 1-page SOP document.",
        fields: [
          { id: "before_after", label: "Before vs After Metrics (% Change)", type: "text", placeholder: "Before: 15 days cycle ➔ After: 4 days cycle (+275% speed)", hint: "Calculating improvement percentage." },
          { id: "standardization_ready", label: "Standardization Readiness", type: "select", options: ["100% Ready for SOP", "Needs Minor Tweaks", "Requires Further Testing"], hint: "Is it ready to become a strict company rule?" },
          { id: "ziddi_tweak", label: "Final Refinement (Ziddi Tweak)", type: "textarea", placeholder: "Final adjustments before locking into company workflow...", hint: "The Ziddi Tweak." }
        ]
      },
      {
        id: "M10",
        number: 10,
        title: "Secondary Bottleneck Identification",
        objective: "Target the next constraint using the Theory of Constraints.",
        trainerAction: "Remind the client that shifting bottlenecks mean the system is working.",
        microTask: "Map out the new secondary bottleneck and list 2 fixes.",
        fields: [
          { id: "prev_fix_status", label: "Previous Fix Lock Status", type: "text", placeholder: "Primary sales script SOP is now 100% followed by team", hint: "Confirming primary fix is locked." },
          { id: "new_bottleneck", label: "New Secondary Bottleneck", type: "textarea", placeholder: "Now onboarding clients takes 3 days due to manual document collection", hint: "Where is system breaking now?" },
          { id: "impact_score", label: "Impact Score (1 to 10)", type: "select", options: ["10 - Critical Scale Blocker", "8 - Major Friction", "6 - Moderate Delay", "4 - Minor Issue"], hint: "Prioritizing the next constraint." }
        ]
      },
      {
        id: "M11",
        number: 11,
        title: "Q2 Review & Control Dashboard",
        objective: "Lock in Q2 gains and establish control measures.",
        trainerAction: "Audit sustainability and celebrate transition to Q3.",
        microTask: "Finalize Q2 Control Checklist and hand over to team/self.",
        fields: [
          { id: "q2_goals_vs_act", label: "Q2 Goals vs Actual Growth", type: "textarea", placeholder: "Q2 Target: ₹30L/mo ➔ Actual achieved: ₹34L/mo", hint: "Finalizing quarterly growth metrics." },
          { id: "sop_compliance", label: "SOP Compliance Check Score", type: "text", placeholder: "90% adherence across sales and delivery teams", hint: "Are new habits being followed?" },
          { id: "ziddi_lock", label: "Control Measure (Ziddi Lock)", type: "textarea", placeholder: "Weekly audit checklist implemented to prevent regression...", hint: "Preventing regression." }
        ]
      }
    ]
  },
  Q3: {
    title: "QUARTER 3: SCALE & AUTOMATION PHASE",
    subtitle: "Months 12 to 15 (M12 - M15)",
    color: "#56CCF2",
    badge: "PHASE 03 // SCALE & AUTOMATION",
    meetings: [
      {
        id: "M12",
        number: 12,
        title: "Automation & Delegation Audit",
        objective: "Eliminate manual friction via technology, AI, or delegation.",
        trainerAction: "Audit tasks to ensure human effort isn't wasted on repetitive processes.",
        microTask: "Identify 1 repetitive task and set up a basic automation rule.",
        fields: [
          { id: "std_processes", label: "Standardized Processes Ready for Auto", type: "textarea", placeholder: "Invoicing, Lead Assignment, Client Onboarding emails...", hint: "Processes ready for automation check." },
          { id: "auto_route", label: "Automation / Delegation Route", type: "text", placeholder: "Zapier + AI auto-responder + VA for manual checks", hint: "Tool or person required." },
          { id: "time_saved", label: "Expected Time Saved (Hours/Week)", type: "text", placeholder: "Saved 12 Hours/Week of founder time", hint: "Quantifying founder time freedom." }
        ]
      },
      {
        id: "M13",
        number: 13,
        title: "Scaling & Capacity Planning",
        objective: "Amplify volume without sacrificing quality.",
        trainerAction: "Issue the premature scaling warning—fix processes before scaling them.",
        microTask: "Test the scaled version of the primary process on a 2x larger batch.",
        fields: [
          { id: "output_capacity", label: "Current vs Target Scale Capacity", type: "text", placeholder: "Current: 20 clients/mo ➔ Target: 60 clients/mo", hint: "Measuring scale capacity." },
          { id: "capacity_bottleneck", label: "Breakage Point if Volume Triples", type: "textarea", placeholder: "Client onboarding will lag if 60 clients enter at once", hint: "What breaks if volume triples?" },
          { id: "resource_req", label: "Resource Requirements (Tools, Budget, Team)", type: "textarea", placeholder: "Need 1 Ops Executive + CRM upgraded plan", hint: "Budget, tools, and people needed." }
        ]
      },
      {
        id: "M14",
        number: 14,
        title: "System Stress Test & Quality Check",
        objective: "Stress-test workflows under increased volume loads.",
        trainerAction: "Focus on maintaining high quality during high-speed delivery.",
        microTask: "Implement 1 mistake-proofing checklist.",
        fields: [
          { id: "increased_load", label: "Increased Load Test Metric", type: "text", placeholder: "Simulated 2x volume batch run over 7 days", hint: "Doubling the volume load." },
          { id: "failure_point", label: "Identified Failure Points", type: "textarea", placeholder: "Delay in welcome email delivery and asset access...", hint: "Where did delays or quality drops occur?" },
          { id: "poka_yoke", label: "Poka-Yoke (Mistake-Proofing System)", type: "textarea", placeholder: "Added automated verification trigger before call...", hint: "Adding checklists/auto-responders." }
        ]
      },
      {
        id: "M15",
        number: 15,
        title: "Q3 Scale & Automation Review",
        objective: "Evaluate efficiency gains and prepare for Q4 mastery.",
        trainerAction: "Review stress-test fixes and transition client into the mastery phase.",
        microTask: "Document final Q3 automated workflows and hours saved.",
        fields: [
          { id: "scale_results", label: "Q3 Scale Target vs Actual", type: "textarea", placeholder: "Target ₹50L/mo ➔ Achieved ₹48L/mo with 80% automated ops", hint: "Q3 growth metrics." },
          { id: "hours_saved_audit", label: "Total Founder Hours Saved Audit", type: "text", placeholder: "Founder ops time reduced from 40 hrs/wk to 8 hrs/wk", hint: "Validating founder time-freedom." },
          { id: "stability_check", label: "Automated Workflows Stability Score", type: "select", options: ["95%+ Rock Solid", "80-95% Smooth with minor bugs", "Needs supervision"], hint: "Are automated workflows stable?" }
        ]
      }
    ]
  },
  Q4: {
    title: "QUARTER 4: MASTERY & FUTURE-PROOFING PHASE",
    subtitle: "Months 16 to 18 (M16 - M18)",
    color: "#EB5757",
    badge: "PHASE 04 // MASTERY & FUTURE-PROOFING",
    meetings: [
      {
        id: "M16",
        number: 16,
        title: "Founder Delegation & Leadership Audit",
        objective: "Transition the founder from operational manager to strategic leader.",
        trainerAction: "Enforce the 80% Rule—hand over any task someone else can do 80% as well.",
        microTask: "Hand over 1 recurring operational task completely.",
        fields: [
          { id: "resp_audit", label: "Responsibility Audit (Founder vs Team vs Tool)", type: "textarea", placeholder: "Founder: Strategy & High-ticket deals only. Team: Ops & Sales...", hint: "Founder vs Team vs Tool handling." },
          { id: "missing_sops", label: "Missing SOPs & Training Gaps", type: "textarea", placeholder: "SOP needed for monthly financial audit handover", hint: "Gaps blocking full handover." },
          { id: "handover_timeline", label: "Complete Handover Timeline", type: "text", placeholder: "Target Date: 30 days for 100% ops handover", hint: "Target dates for complete delegation." }
        ]
      },
      {
        id: "M17",
        number: 17,
        title: "The Executive Master Dashboard",
        objective: "Build a 10-minute executive command center.",
        trainerAction: "Ensure the founder can assess business health in 10 minutes without digging through files.",
        microTask: "Finalize 5 core KPIs on a single Google Sheet tab.",
        fields: [
          { id: "biz_pillars", label: "Core Business Pillars Tracked", type: "textarea", placeholder: "1. Financials (Cash flow) | 2. Sales (CAC & LTV) | 3. Operations (NPS)", hint: "Financials, Sales, Operations." },
          { id: "kpi_leading_lagging", label: "Leading vs Lagging KPIs", type: "textarea", placeholder: "Leading: Qualified leads/week ➔ Lagging: Monthly Revenue ₹", hint: "Tracking predictive metrics." },
          { id: "data_owners", label: "Data Owners & Update Frequency", type: "text", placeholder: "Ops Lead updates daily at 6 PM, Review on Monday 10 AM", hint: "Who updates what and when." }
        ]
      },
      {
        id: "M18",
        number: 18,
        title: "The Mastermind Graduation & Year-End Audit",
        objective: "Grand finale, year-end audit, and next year's vision setting.",
        trainerAction: "Compare journey data, celebrate transformation, and set Year 2 horizons.",
        microTask: "Complete final year-end audit and archive year's SOPs.",
        fields: [
          { id: "before_after_18m", label: "18-Month Before vs After Transformation", type: "textarea", placeholder: "Day 1 (M1): ₹15L/mo, 70 hrs founder work ➔ M18: ₹60L/mo, 10 hrs founder work", hint: "Baseline (M1) vs Final Result (M18)." },
          { id: "growth_impact", label: "Total Growth Impact Summary", type: "textarea", placeholder: "+300% Revenue, 14 SOPs locked, 100% process-driven business", hint: "Revenue, time saved, and SOPs created." },
          { id: "grad_status", label: "Graduation & Certification Status", type: "select", options: ["OFFICIAL ZIDDI DMAIC GRADUATE 🏆", "In Review", "Finalizing SOP Audits"], hint: "Official Ziddi DMAIC Graduate." }
        ]
      }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MASTERMIND_DATA;
}
