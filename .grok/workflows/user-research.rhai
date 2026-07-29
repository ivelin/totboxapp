let meta = #{
    name: "user-research",
    description: "Synthetic ICP filter: N peers (default 10), parallel score+dialogue, binary verdict, founder gate",
    when_to_use: "Rank ICP candidates before real tests; diversity sample; iterate until agree_ready or kill",
    phases: [
        #{ title: "Context", detail: "Thesis + tried set + founder notes" },
        #{ title: "Propose", detail: "N diverse ICP peers (keep strong_fit + new axes)" },
        #{ title: "Scorecards", detail: "Reward/risk scores (parallel)" },
        #{ title: "Synthetic", detail: "Dialogues + binary verdict (parallel)" },
        #{ title: "Challenge", detail: "Adversarial rank + ready flag" },
        #{ title: "Report", detail: "ROUND report + FOUNDER_FEEDBACK template" },
        #{ title: "Founder gate", detail: "iterate | agree_ready | kill" },
    ],
};

// args: mode=round|status, round_label, founder_notes, max_rounds(1-5), slate_n(5-10, default 10)

let RULES = "";
RULES += "PUBLIC-SAFE: no real names, emails, phones, street addresses, personal zips.\n";
RULES += "SYNTHETIC ONLY: filter not PMF; real jobs still required later.\n";
RULES += "THESIS: Shape A job PM (host LLM + Totbox MCP checklist, human approve-before-send).\n";
RULES += "  Hard no vendor directory/marketplace. Beachhead: recurring HVAC PM + house cleaning.\n";
RULES += "VERDICT binary only: strong_fit = real-test shortlist | weak_fit = out this round.\n";
RULES += "  Uncertain → weak_fit. Forbidden: promote_lean, hold, demote, poor_fit, unclear.\n";
RULES += "AUDIENCE: teenage solo founders using Company OS. Write plain English a sharp 16-year-old\n";
RULES += "  can skim. No dense jargon piles. Prefer everyday words over score jargon.\n";
RULES += "RATIONALE (verdict_key_factors) style — required for the table column:\n";
RULES += "  - One short sentence, max ~20 words. One idea: why this verdict.\n";
RULES += "  - Pattern: \"Keep — …\" if strong_fit, or \"Out — …\" if weak_fit.\n";
RULES += "  - Say what a founder would feel/do, not score names (avoid: channel_fit, TTS, WTP,\n";
RULES += "    LTV, SaaS gravity, dual-approve, pay_or_act, Shape A as unexplained jargon).\n";
RULES += "  - OK plain words: email, phone, partner, budget, hard to reach, few jobs a year,\n";
RULES += "    other apps already win, people won't pay, takes too long to learn.\n";
RULES += "  - Bad: \"Self-approve Shape A, high channel_fit, soft WTP; residual falsifiers open\"\n";
RULES += "  - Good: \"Keep — one person can decide fast; still unproven if they'll pay.\"\n";
RULES += "  - Bad: \"PM-SaaS gravity, triple stall, thin reach/slow TTS\"\n";
RULES += "  - Good: \"Out — too much like big property software; too hard to get a first customer.\"\n";

// MECE diversity axes — each NEW challenger claims exactly one primary cell; no two NEW share same cell.
let DIVERSITY = "";
DIVERSITY += "DIVERSITY SAMPLING (anti-infinite similar weak_fits):\n";
DIVERSITY += "1) EXCLUDE: never re-propose ids already tried as slate members unless KEEP list.\n";
DIVERSITY += "2) KEEP strong_fit peers as re-scored equals (not automatic winners).\n";
DIVERSITY += "3) Each NEW challenger MUST set diversity_axis + diversity_value (primary stress only):\n";
DIVERSITY += "   axes (MECE): buyer_seat | cadence | channel | monetization | vertical | ops_context\n";
DIVERSITY += "   values examples:\n";
DIVERSITY += "     buyer_seat: single_dm | dual_household | association | remote_care | property_mgr |\n";
DIVERSITY += "                 adult_child | employer_payer | operator_payer | str_host | nonprofit_facility\n";
DIVERSITY += "     cadence: recurring_preventive | episodic_burst | seasonal | emergency | continuous_service\n";
DIVERSITY += "     channel: email_first | phone_first | portal_native | hybrid\n";
DIVERSITY += "     monetization: household_user | association_budget | operator_payer | employer_b2b2c | high_wtp\n";
DIVERSITY += "     vertical: hvac_cleaning | tree_arborist | grounds | multi_home_service | restoration_claim\n";
DIVERSITY += "     ops_context: urban_metro | rural_after_hours | second_home_snowbird | new_build_warranty |\n";
DIVERSITY += "                  pcs_relocation | multi_gen_household | short_term_rental\n";
DIVERSITY += "4) Across NEW seats: diversity_value cells must be UNIQUE (no two NEW share same value).\n";
DIVERSITY += "5) Prefer unfilled cells from landscape gaps; do not clone prior weak_fits with new names.\n";
DIVERSITY += "6) Max 1 pure operator_payer; max 1 emergency cadence; max 1 phone_first channel.\n";

// Ids already on prior slates (do not recycle as NEW). KEEP may re-include strong_fit.
let TRIED = "";
TRIED += "TRIED_EXCLUDE (do not re-use as NEW challengers):\n";
TRIED += "KEEP only: household-single-decision-maker-recurring, household-dual-income-recurring.\n";
TRIED += "R1: remote-care-or-multi-site-coordinator, household-seasonal-tree-arborist,\n";
TRIED += "  operator-agentic-inbound-payer, sms-phone-native-grounds.\n";
TRIED += "1-r2: household-new-homeowner-move-in-burst, small-landlord-tenant-split-coordinator,\n";
TRIED += "  household-emergency-hvac-repair.\n";
TRIED += "1-r3: household-aging-in-place-adult-child-coordinator, household-membership-portal-native,\n";
TRIED += "  household-white-glove-concierge.\n";
TRIED += "1-r4: condo-hoa-common-area-coordinator, b2b2c-hvac-cleaning-operator-partnership,\n";
TRIED += "  household-phone-native-low-email-recurring.\n";
TRIED += "1-r5: multi-home-snowbird-second-home, multi-gen-household-shared-home,\n";
TRIED += "  new-build-warranty-punch-window, short-term-rental-host-turnover,\n";
TRIED += "  mid-portfolio-property-manager, insurance-claim-restoration-coordinator,\n";
TRIED += "  corporate-relocation-employer-paid, rural-after-hours-home-service.\n";

let mode = "round";
let round_label = "1";
let founder_notes = "";
let max_rounds = 4;
let slate_n = 10;

if args != () {
    if args.mode != () { mode = args.mode; }
    if args.round_label != () { round_label = args.round_label; }
    if args.founder_notes != () { founder_notes = args.founder_notes; }
    if args.max_rounds != () {
        let mr = args.max_rounds;
        if mr >= 1 && mr <= 5 { max_rounds = mr; }
    }
    if args.slate_n != () {
        let sn = args.slate_n;
        if sn >= 5 && sn <= 10 { slate_n = sn; }
    }
}
if mode != "round" && mode != "status" {
    pause("verification", "args.mode must be round | status");
}

// --- Schemas ---

let context_schema = #{
    "type": "object",
    "required": ["thesis_summary", "existing_icp_notes", "prior_feedback", "product_constraints", "tried_ids"],
    "properties": #{
        "thesis_summary": #{ "type": "string" },
        "existing_icp_notes": #{ "type": "string" },
        "prior_feedback": #{ "type": "string" },
        "product_constraints": #{ "type": "string" },
        "tried_ids": #{ "type": "string" },
    },
};

let propose_schema = #{
    "type": "object",
    "required": ["icps", "rationale", "diversity_map"],
    "properties": #{
        "rationale": #{ "type": "string" },
        "diversity_map": #{ "type": "string" },
        "icps": #{
            "type": "array", "minItems": 5, "maxItems": 10,
            "items": #{
                "type": "object",
                "required": [
                    "id", "name", "who", "pain", "job_to_be_done", "why_candidate",
                    "seat_role", "diversity_axis", "diversity_value", "prior_status"
                ],
                "properties": #{
                    "id": #{ "type": "string" },
                    "name": #{ "type": "string" },
                    "who": #{ "type": "string" },
                    "pain": #{ "type": "string" },
                    "job_to_be_done": #{ "type": "string" },
                    "why_candidate": #{ "type": "string" },
                    "seat_role": #{ "type": "string" },
                    "diversity_axis": #{ "type": "string" },
                    "diversity_value": #{ "type": "string" },
                    "prior_status": #{ "type": "string" },
                },
            },
        },
    },
};

let scorecard_schema = #{
    "type": "object",
    "required": [
        "icp_id", "icp_name", "reward_notes", "risk_notes",
        "pain_score", "pay_or_act_score", "reach_score", "channel_fit_score",
        "risk_score", "time_to_signal_score", "kill_criteria"
    ],
    "properties": #{
        "icp_id": #{ "type": "string" },
        "icp_name": #{ "type": "string" },
        "reward_notes": #{ "type": "string" },
        "risk_notes": #{ "type": "string" },
        "pain_score": #{ "type": "number" },
        "pay_or_act_score": #{ "type": "number" },
        "reach_score": #{ "type": "number" },
        "channel_fit_score": #{ "type": "number" },
        "risk_score": #{ "type": "number" },
        "time_to_signal_score": #{ "type": "number" },
        "kill_criteria": #{ "type": "string" },
    },
};

let synthetic_schema = #{
    "type": "object",
    "required": [
        "icp_id", "persona_sketch", "dialogue_summaries",
        "synthetic_verdict", "verdict_key_factors", "evidence_notes"
    ],
    "properties": #{
        "icp_id": #{ "type": "string" },
        "persona_sketch": #{ "type": "string" },
        "dialogue_summaries": #{ "type": "string" },
        "synthetic_verdict": #{ "type": "string" },
        "verdict_key_factors": #{ "type": "string" },
        "evidence_notes": #{ "type": "string" },
    },
};

let challenge_schema = #{
    "type": "object",
    "required": [
        "ranking_sound", "overclaimed", "missing_challengers",
        "recommended_rank_order", "ready_for_real_world_ai", "conditions", "diversity_ok"
    ],
    "properties": #{
        "ranking_sound": #{ "type": "boolean" },
        "overclaimed": #{ "type": "string" },
        "missing_challengers": #{ "type": "string" },
        "recommended_rank_order": #{ "type": "string" },
        "ready_for_real_world_ai": #{ "type": "boolean" },
        "conditions": #{ "type": "string" },
        "diversity_ok": #{ "type": "boolean" },
    },
};

let report_schema = #{
    "type": "object",
    "required": [
        "ok", "report_path", "feedback_path", "top3_summary",
        "primary_recommendation", "ai_ready_for_real_world", "message"
    ],
    "properties": #{
        "ok": #{ "type": "boolean" },
        "report_path": #{ "type": "string" },
        "feedback_path": #{ "type": "string" },
        "top3_summary": #{ "type": "string" },
        "primary_recommendation": #{ "type": "string" },
        "ai_ready_for_real_world": #{ "type": "boolean" },
        "message": #{ "type": "string" },
    },
};

let feedback_schema = #{
    "type": "object",
    "required": ["decision", "notes", "file_found"],
    "properties": #{
        "decision": #{ "type": "string" },
        "notes": #{ "type": "string" },
        "file_found": #{ "type": "boolean" },
    },
};

let status_out_schema = #{
    "type": "object",
    "required": ["has_report", "has_feedback", "ready_marker", "summary"],
    "properties": #{
        "has_report": #{ "type": "boolean" },
        "has_feedback": #{ "type": "boolean" },
        "ready_marker": #{ "type": "boolean" },
        "summary": #{ "type": "string" },
    },
};

// Seed: 2 KEEP strong_fit + 8 NEW never-tried (unique diversity cells). Used if propose fails.
// Cells used in 1-r5 NEW: employer_b2b2c, property_mgr, second_home_snowbird, str_host,
// new_build_warranty, phone_first, multi_gen_household, restoration_claim — do not reuse.
let seed_icps = [
    #{
        id: "household-single-decision-maker-recurring",
        name: "Single decision-maker household (recurring home-service PM)",
        who: "Owner-occupant alone owns money/access/booking for HVAC PM + cleaning",
        pain: "Solo cognitive load, quote loops, forgotten next-due",
        job_to_be_done: "Finish jobs with fewer touchpoints; self-approve money/time",
        why_candidate: "KEEP strong_fit learning seat",
        seat_role: "user",
        diversity_axis: "buyer_seat",
        diversity_value: "single_dm",
        prior_status: "keep",
    },
    #{
        id: "household-dual-income-recurring",
        name: "Busy dual-income household (HVAC + cleaning chore PM)",
        who: "Dual-income household coordinating HVAC PM + cleaning with partner approve",
        pain: "Partner lag, dual calendars, multi-turn quotes, next-due forget",
        job_to_be_done: "Complete jobs across two adults with fewer touchpoints",
        why_candidate: "KEEP strong_fit multi-party topology A/B",
        seat_role: "user",
        diversity_axis: "buyer_seat",
        diversity_value: "dual_household",
        prior_status: "keep",
    },
    #{
        id: "military-pcs-relocation-household",
        name: "Military PCS / frequent-move household",
        who: "Service family resetting HVAC and cleaning setup at each permanent-change-of-station move",
        pain: "Short setup window, new metro each move, re-find vendors, calendar chaos",
        job_to_be_done: "Stand up preventive home services after each move with fewer emails",
        why_candidate: "NEW ops_context: pcs_relocation (not employer RMC 1-r5)",
        seat_role: "user",
        diversity_axis: "ops_context",
        diversity_value: "pcs_relocation",
        prior_status: "new",
    },
    #{
        id: "small-nonprofit-facility-coordinator",
        name: "Small nonprofit / faith-community facility coordinator",
        who: "Volunteer or staff who books HVAC and cleaning for a small building (not HOA plant)",
        pain: "Board budget, sparse volunteers, seasonal events, vendor follow-up",
        job_to_be_done: "Finish facility jobs without association software",
        why_candidate: "NEW buyer_seat: nonprofit_facility (not condo-HOA 1-r4)",
        seat_role: "user",
        diversity_axis: "buyer_seat",
        diversity_value: "nonprofit_facility",
        prior_status: "new",
    },
    #{
        id: "pool-spa-seasonal-service-household",
        name: "Pool / spa seasonal service household",
        who: "Homeowner with pool/spa needing open/close and mid-season service plus HVAC cadence",
        pain: "Seasonal windows, multi-vendor (pool + HVAC), forgotten next open/close",
        job_to_be_done: "Track seasonal pool jobs and preventive home services together",
        why_candidate: "NEW vertical: pool_spa_seasonal (not tree/grounds R1)",
        seat_role: "user",
        diversity_axis: "vertical",
        diversity_value: "pool_spa_seasonal",
        prior_status: "new",
    },
    #{
        id: "ev-charger-install-plus-home-service",
        name: "EV charger install + ongoing home-service household",
        who: "Homeowner adding EV charger then keeping HVAC/cleaning coordination in one place",
        pain: "One-time install quote chaos plus recurring home services after",
        job_to_be_done: "Close install job then keep recurring cadence without re-research",
        why_candidate: "NEW cadence: install_then_recurring hybrid",
        seat_role: "user",
        diversity_axis: "cadence",
        diversity_value: "install_then_recurring",
        prior_status: "new",
    },
    #{
        id: "hoa-board-email-native-treasurer",
        name: "HOA treasurer / email-native board seat (unit-owner view)",
        who: "Board treasurer who mostly uses email for vendor bills and unit-owner HVAC issues",
        pain: "Invoices, approvals, and vendor threads without full HOA ops suite",
        job_to_be_done: "Clear board-related home-service jobs with human gates",
        why_candidate: "NEW channel: email_board_finance (not condo plant coordinator 1-r4)",
        seat_role: "user",
        diversity_axis: "channel",
        diversity_value: "email_board_finance",
        prior_status: "new",
    },
    #{
        id: "home-warranty-plan-subscriber",
        name: "Home warranty plan subscriber (dispatch + rebook)",
        who: "Homeowner with a home-warranty membership who still fights dispatch and rebook email",
        pain: "Warranty portal + email thrash, denied claims, reschedule loops",
        job_to_be_done: "Run warranty-covered service jobs without full portal autopilot myth",
        why_candidate: "NEW monetization/path: warranty_plan_residual (not ST membership 1-r3)",
        seat_role: "user",
        diversity_axis: "monetization",
        diversity_value: "warranty_plan_residual",
        prior_status: "new",
    },
    #{
        id: "accessible-aging-in-place-on-site",
        name: "On-site aging-in-place household (accessibility mods + HVAC)",
        who: "Older adult or co-residing family doing accessibility upgrades and HVAC at same home",
        pain: "Multi-trade access mods, medical calendar, HVAC seasonal, approval among family on-site",
        job_to_be_done: "Coordinate access-related and recurring jobs with safety gates",
        why_candidate: "NEW buyer_seat: on_site_aging (not remote adult-child 1-r3)",
        seat_role: "user",
        diversity_axis: "buyer_seat",
        diversity_value: "on_site_aging",
        prior_status: "new",
    },
    #{
        id: "solar-battery-plus-hvac-bundle",
        name: "Solar / battery + HVAC bundle household",
        who: "Homeowner with solar/battery install or service plus HVAC membership cadence",
        pain: "Two tech stacks, warranty vs service confusion, multi-vendor email",
        job_to_be_done: "Keep energy + HVAC jobs moving without marketplace inventory",
        why_candidate: "NEW vertical: solar_battery_hvac",
        seat_role: "user",
        diversity_axis: "vertical",
        diversity_value: "solar_battery_hvac",
        prior_status: "new",
    },
];

fn icp_field(ic, key, fallback) {
    if ic == () { return fallback; }
    if key == "id" && ic.id != () { return ic.id; }
    if key == "name" && ic.name != () { return ic.name; }
    if key == "who" && ic.who != () { return ic.who; }
    if key == "pain" && ic.pain != () { return ic.pain; }
    if key == "job" && ic.job_to_be_done != () { return ic.job_to_be_done; }
    if key == "seat_role" && ic.seat_role != () { return ic.seat_role; }
    if key == "diversity_axis" && ic.diversity_axis != () { return ic.diversity_axis; }
    if key == "diversity_value" && ic.diversity_value != () { return ic.diversity_value; }
    if key == "prior_status" && ic.prior_status != () { return ic.prior_status; }
    fallback
}

fn take_n(list, seed, n) {
    if list == () || list.len() < n { return seed; }
    if list.len() == n { return list; }
    let out = [];
    let i = 0;
    while i < n {
        out.push(list[i]);
        i += 1;
    }
    out
}

// --- status ---

if mode == "status" {
    phase("Context");
    let sp = "";
    sp += "Read-only status of Totbox user-research. Use tools; do not invent files.\n";
    sp += "Check: research/icps/README.md, latest ROUND_*_report.md, FOUNDER_FEEDBACK.md,\n";
    sp += "READY_FOR_REAL_WORLD.md, company/state/company-state.json.\n";
    sp += "Return has_report, has_feedback, ready_marker, short summary.\n";
    sp += RULES;
    let st = agent(sp, #{
        label: "ur-status",
        capability_mode: "read-only",
        output_schema: status_out_schema,
    });
    if st == () || !st.success || st.output == () {
        pause("infra", "user-research status agent failed");
    }
    let sum = "status ok";
    let hr = false;
    let hf = false;
    let rm = false;
    if st.output.summary != () { sum = st.output.summary; }
    if st.output.has_report == true { hr = true; }
    if st.output.has_feedback == true { hf = true; }
    if st.output.ready_marker == true { rm = true; }
    let report = "# User research status\n\n" + sum + "\n\n";
    report += "- has_report: " + hr.to_string() + "\n";
    report += "- has_feedback: " + hf.to_string() + "\n";
    report += "- ready_marker: " + rm.to_string() + "\n";
    let p = write_scratch_file("user-research-status.md", report);
    complete(#{
        mode: "status", path: p,
        has_report: hr, has_feedback: hf, ready_marker: rm, summary: sum,
    });
}

// --- round loop ---

let round_i = 1;
let last_notes = founder_notes;
let last_primary = "";
let last_top3 = "";
let last_report_path = "";
let ai_ready = false;

while true {
    if round_i > max_rounds {
        await_user(
            "user",
            "max_rounds hit. Edit research/icps/FOUNDER_FEEDBACK.md then re-launch with higher max_rounds or agree_ready."
        );
        pause("verification", "Re-launch user-research after founder decision.");
    }

    let this_label = round_label;
    if round_i > 1 {
        this_label = round_label + "-r" + round_i.to_string();
    }
    log("user-research round " + round_i.to_string() + " label=" + this_label + " slate_n=" + slate_n.to_string());

    // ===== Context =====
    phase("Context");
    let ctx_p = "";
    ctx_p += "Load Totbox user-research context. Tools only; do not invent missing files.\n";
    ctx_p += "Read: docs/product_thesis.md, docs/company-os/instance/thesis.md,\n";
    ctx_p += "docs/company-os/operating-system.md (synthetic + reward/risk),\n";
    ctx_p += "research/icps/README.md + ALL ROUND_*_report.md + FOUNDER_FEEDBACK.md,\n";
    ctx_p += "list research/icps/*.md for tried ICP ids, company/state/company-state.json.\n";
    ctx_p += "Round: " + this_label + " slate_n=" + slate_n.to_string() + "\n";
    if last_notes != "" { ctx_p += "Founder notes:\n" + last_notes + "\n"; }
    ctx_p += TRIED;
    ctx_p += "Return short: thesis_summary, existing_icp_notes, prior_feedback,\n";
    ctx_p += "product_constraints, tried_ids (comma list of ids already slated).\n";
    ctx_p += RULES;

    let ctx = agent(ctx_p, #{
        label: "ur-context-" + round_i.to_string(),
        capability_mode: "read-only",
        output_schema: context_schema,
    });

    let thesis_s = "";
    let existing_s = "";
    let prior_s = "";
    let constr_s = "";
    let tried_s = TRIED;
    if ctx != () && ctx.success && ctx.output != () {
        if ctx.output.thesis_summary != () { thesis_s = ctx.output.thesis_summary; }
        if ctx.output.existing_icp_notes != () { existing_s = ctx.output.existing_icp_notes; }
        if ctx.output.prior_feedback != () { prior_s = ctx.output.prior_feedback; }
        if ctx.output.product_constraints != () { constr_s = ctx.output.product_constraints; }
        if ctx.output.tried_ids != () { tried_s = ctx.output.tried_ids; }
    } else {
        log("context weak; continuing");
    }

    // ===== Propose =====
    phase("Propose");
    let prop_p = "";
    prop_p += "Propose exactly " + slate_n.to_string() + " peer ICPs for synthetic validation.\n";
    prop_p += "Thesis:\n" + thesis_s + "\nExisting:\n" + existing_s + "\n";
    prop_p += "Prior feedback:\n" + prior_s + "\nConstraints:\n" + constr_s + "\n";
    prop_p += "Tried ids:\n" + tried_s + "\n";
    if last_notes != "" { prop_p += "Founder notes (honor KEEP/DROP):\n" + last_notes + "\n"; }
    prop_p += DIVERSITY;
    prop_p += TRIED;
    prop_p += "Slate construction:\n";
    prop_p += "- Exactly " + slate_n.to_string() + " ICPs.\n";
    prop_p += "- KEEP strong_fit: household-single-decision-maker-recurring +\n";
    prop_p += "  household-dual-income-recurring (re-score peers; prior_status=keep).\n";
    prop_p += "- Remaining seats: NEW only (prior_status=new). Never re-use TRIED as new.\n";
    prop_p += "- Each ICP: id, name, who, pain, job_to_be_done, why_candidate,\n";
    prop_p += "  seat_role (user|payer|payer_hybrid|channel_control),\n";
    prop_p += "  diversity_axis, diversity_value, prior_status (keep|new).\n";
    prop_p += "- diversity_map: one line per NEW: value → id (prove unique cells).\n";
    prop_p += "- rationale: why this slate covers orthogonal axes vs past weak_fits.\n";
    prop_p += "- No verdict yet. " + RULES;

    let prop = agent(prop_p, #{
        label: "ur-propose-" + round_i.to_string(),
        capability_mode: "read-only",
        output_schema: propose_schema,
    });

    let icps = seed_icps;
    let propose_rationale = "seed slate (propose incomplete)";
    let diversity_map = "seed diversity map";
    if prop != () && prop.success && prop.output != () && prop.output.icps != () {
        if prop.output.icps.len() >= slate_n {
            icps = take_n(prop.output.icps, seed_icps, slate_n);
            if prop.output.rationale != () { propose_rationale = prop.output.rationale; }
            else { propose_rationale = "agent slate"; }
            if prop.output.diversity_map != () { diversity_map = prop.output.diversity_map; }
        } else {
            log("propose n=" + prop.output.icps.len().to_string() + " < slate_n; seed");
        }
    } else {
        log("propose failed; seed");
    }
    icps = take_n(icps, seed_icps, slate_n);
    log("slate n=" + icps.len().to_string() + " diversity_map=" + diversity_map);

    // ===== Scorecards (parallel) =====
    phase("Scorecards");
    let score_jobs = [];
    let si = 0;
    while si < icps.len() {
        let ic = icps[si];
        let ic_id = icp_field(ic, "id", "icp-" + si.to_string());
        let ic_name = icp_field(ic, "name", "unnamed");
        let sc_p = "";
        sc_p += "Score ONE ICP (solo-founder bootstrap).\n";
        sc_p += "id=" + ic_id + " name=" + ic_name + "\n";
        sc_p += "who=" + icp_field(ic, "who", "") + "\n";
        sc_p += "pain=" + icp_field(ic, "pain", "") + "\n";
        sc_p += "job=" + icp_field(ic, "job", "") + "\n";
        sc_p += "seat_role=" + icp_field(ic, "seat_role", "") + "\n";
        sc_p += "axis=" + icp_field(ic, "diversity_axis", "") + " value=" + icp_field(ic, "diversity_value", "") + "\n";
        sc_p += "thesis:\n" + thesis_s + "\n";
        sc_p += "Scores 0–1: pain, pay_or_act, reach, channel_fit, risk (higher=riskier),\n";
        sc_p += "time_to_signal (higher=faster). reward_notes + risk_notes concrete.\n";
        sc_p += "kill_criteria. Set icp_id/icp_name. No verdict.\n";
        sc_p += RULES;
        score_jobs.push(#{
            prompt: sc_p,
            label: "ur-score-" + round_i.to_string() + "-" + si.to_string(),
            capability_mode: "read-only",
            output_schema: scorecard_schema,
        });
        si += 1;
    }

    let score_results = parallel(score_jobs);
    let scorecards = [];
    let sj = 0;
    while sj < score_results.len() {
        let sr = score_results[sj];
        if sr != () && sr.success && sr.output != () {
            scorecards.push(sr.output);
        } else {
            log("score fail idx=" + sj.to_string());
            scorecards.push(#{
                icp_id: "unknown-" + sj.to_string(),
                icp_name: "score-failed",
                reward_notes: "score failed",
                risk_notes: "unscored",
                pain_score: 0.0,
                pay_or_act_score: 0.0,
                reach_score: 0.0,
                channel_fit_score: 0.0,
                risk_score: 1.0,
                time_to_signal_score: 0.0,
                kill_criteria: "no scorecard",
            });
        }
        sj += 1;
    }

    // ===== Synthetic (parallel) =====
    phase("Synthetic");
    let syn_jobs = [];
    let yi = 0;
    while yi < icps.len() {
        let ic2 = icps[yi];
        let id2 = icp_field(ic2, "id", "icp-" + yi.to_string());
        let sc_blob = "";
        if yi < scorecards.len() { sc_blob = json_encode(scorecards[yi]); }

        let sy_p = "";
        sy_p += "Synthetic research for ONE ICP. Willing to falsify.\n";
        sy_p += "id=" + id2 + " name=" + icp_field(ic2, "name", "") + "\n";
        sy_p += "who=" + icp_field(ic2, "who", "") + "\n";
        sy_p += "pain=" + icp_field(ic2, "pain", "") + "\n";
        sy_p += "job=" + icp_field(ic2, "job", "") + "\n";
        sy_p += "seat_role=" + icp_field(ic2, "seat_role", "") + "\n";
        sy_p += "axis=" + icp_field(ic2, "diversity_axis", "") + " value=" + icp_field(ic2, "diversity_value", "") + "\n";
        sy_p += "scorecard:\n" + sc_blob + "\n";
        sy_p += "Output:\n";
        sy_p += "1) persona_sketch — who they are in plain words (not a real person)\n";
        sy_p += "2) dialogue_summaries — discovery | offer | objection (plain English)\n";
        sy_p += "3) synthetic_verdict — strong_fit | weak_fit only (uncertain→weak_fit)\n";
        sy_p += "4) verdict_key_factors — HUMAN Rationale for founders (see RULES):\n";
        sy_p += "   one short sentence, \"Keep — …\" or \"Out — …\", everyday words only\n";
        sy_p += "5) evidence_notes — what a real trial must prove or kill (plain English)\n";
        sy_p += "Set icp_id=" + id2 + ". " + RULES;

        syn_jobs.push(#{
            prompt: sy_p,
            label: "ur-synth-" + round_i.to_string() + "-" + yi.to_string(),
            capability_mode: "read-only",
            output_schema: synthetic_schema,
        });
        yi += 1;
    }

    let syn_results = parallel(syn_jobs);
    let synthetics = [];
    let yj = 0;
    while yj < syn_results.len() {
        let yr = syn_results[yj];
        if yr != () && yr.success && yr.output != () {
            let o = yr.output;
            let verdict = "weak_fit";
            if o.synthetic_verdict == "strong_fit" { verdict = "strong_fit"; }
            let persona = "";
            let dialogues = "";
            let factors = "";
            let evidence = "";
            let oid = "unknown-" + yj.to_string();
            if o.icp_id != () { oid = o.icp_id; }
            if o.persona_sketch != () { persona = o.persona_sketch; }
            if o.dialogue_summaries != () { dialogues = o.dialogue_summaries; }
            if o.verdict_key_factors != () { factors = o.verdict_key_factors; }
            if o.evidence_notes != () { evidence = o.evidence_notes; }
            synthetics.push(#{
                icp_id: oid,
                persona_sketch: persona,
                dialogue_summaries: dialogues,
                synthetic_verdict: verdict,
                verdict_key_factors: factors,
                evidence_notes: evidence,
            });
        } else {
            log("synth fail idx=" + yj.to_string());
            synthetics.push(#{
                icp_id: "unknown-" + yj.to_string(),
                persona_sketch: "n/a",
                dialogue_summaries: "synthetic failed",
                synthetic_verdict: "weak_fit",
                verdict_key_factors: "Out — research agent failed; treat as not ready.",
                evidence_notes: "Need a successful synthetic run before any real test.",
            });
        }
        yj += 1;
    }

    // ===== Challenge =====
    phase("Challenge");
    let pack = #{
        icps: icps,
        scorecards: scorecards,
        synthetics: synthetics,
        propose_rationale: propose_rationale,
        diversity_map: diversity_map,
        thesis: thesis_s,
        founder_notes: last_notes,
        slate_n: slate_n,
    };
    let pack_json = json_encode(pack);

    let ch_p = "";
    ch_p += "Adversarial skeptic. Fail closed. Pack:\n" + pack_json + "\n";
    ch_p += "Return:\n";
    ch_p += "- ranking_sound: order justified by evidence+scores (not favorite)\n";
    ch_p += "- diversity_ok: true only if NEW seats use unique diversity_value cells and no TRIED recycle\n";
    ch_p += "- overclaimed / missing_challengers / conditions\n";
    ch_p += "- recommended_rank_order: best→worst; all strong_fit before weak_fit\n";
    ch_p += "- ready_for_real_world_ai: true only if ≥1 strong_fit worth shadow tests;\n";
    ch_p += "  default false if failures, zero strong_fit, diversity broken, or beachhead unchallenged\n";
    ch_p += RULES + DIVERSITY;

    let chal = agent(ch_p, #{
        label: "ur-challenge-" + round_i.to_string(),
        capability_mode: "read-only",
        output_schema: challenge_schema,
    });

    let ranking_sound = false;
    let diversity_ok = false;
    let overclaimed = "challenge failed";
    let missing_ch = "";
    let rank_order = "unverified";
    let ready_ai = false;
    let conditions = "re-run challenge before real tests";
    if chal != () && chal.success && chal.output != () {
        if chal.output.ranking_sound == true { ranking_sound = true; }
        if chal.output.diversity_ok == true { diversity_ok = true; }
        if chal.output.overclaimed != () { overclaimed = chal.output.overclaimed; }
        if chal.output.missing_challengers != () { missing_ch = chal.output.missing_challengers; }
        if chal.output.recommended_rank_order != () { rank_order = chal.output.recommended_rank_order; }
        if chal.output.ready_for_real_world_ai == true { ready_ai = true; }
        if chal.output.conditions != () { conditions = chal.output.conditions; }
    } else {
        log("challenge failed → ready=false");
        ready_ai = false;
    }
    // Fail closed if diversity broken
    if !diversity_ok {
        log("diversity_ok=false; ready forced false");
        ready_ai = false;
    }
    ai_ready = ready_ai;

    // ===== Report =====
    phase("Report");
    let rep_p = "";
    rep_p += "Write ROUND report + gate template. Write tools. Round=" + this_label + "\n";
    rep_p += "slate_n=" + slate_n.to_string() + " ready=" + ready_ai.to_string() + "\n";
    rep_p += "ranking_sound=" + ranking_sound.to_string() + " diversity_ok=" + diversity_ok.to_string() + "\n";
    rep_p += "rank_order: " + rank_order + "\n";
    rep_p += "overclaimed: " + overclaimed + "\n";
    rep_p += "missing_challengers: " + missing_ch + "\n";
    rep_p += "conditions: " + conditions + "\n";
    rep_p += "diversity_map: " + diversity_map + "\n";
    rep_p += "pack:\n" + pack_json + "\n\n";
    rep_p += "WRITE:\n";
    rep_p += "1) research/icps/ROUND_" + this_label + "_report.md\n";
    rep_p += "   a) Header: SYNTHETIC ONLY, round, slate_n, ready, ranking_sound, diversity_ok\n";
    rep_p += "   b) Exec: ≤2 short plain-English paras (teen-founder readable) + FIRST table:\n";
    rep_p += "      Rank | ICP | seat_role | Synthetic verdict | Rationale\n";
    rep_p += "      All " + slate_n.to_string() + " rows. Verdict strong_fit|weak_fit only.\n";
    rep_p += "      Rationale MUST be humanized: one short \"Keep — …\" or \"Out — …\" sentence\n";
    rep_p += "      from verdict_key_factors (rewrite denser pack text into plain English).\n";
    rep_p += "      Forbidden: promote_lean columns; forbidden jargon piles (channel_fit, TTS, WTP,\n";
    rep_p += "      LTV, SaaS gravity, pay_or_act, dual-approve) in the Rationale column.\n";
    rep_p += "   c) Diversity map table: diversity_value | ICP id | prior_status\n";
    rep_p += "   d) Method + tried-exclusion (short; plain English)\n";
    rep_p += "   e) Scorecard numeric table (all N) — scores may stay technical\n";
    rep_p += "   f) Top 3 why in plain English; shortlist = strong_fit only; kill criteria\n";
    rep_p += "   g) Skeptic; next real tests if any strong_fit (plain English)\n";
    rep_p += "   h) Label SYNTHETIC ONLY\n";
    rep_p += "2) FOUNDER_FEEDBACK.md template (decision blank)\n";
    rep_p += "3) README.md latest pointer + same rank columns (+ optional Brief)\n";
    rep_p += "4) Optional briefs for strong_fit only\n";
    rep_p += "5) Do NOT write READY_FOR_REAL_WORLD.md\n";
    rep_p += "ai_ready_for_real_world must be " + ready_ai.to_string() + ".\n";
    rep_p += RULES;

    let rep = agent(rep_p, #{
        label: "ur-report-" + round_i.to_string(),
        capability_mode: "read-write",
        output_schema: report_schema,
    });

    let report_path = "research/icps/ROUND_" + this_label + "_report.md";
    let feedback_path = "research/icps/FOUNDER_FEEDBACK.md";
    let top3 = "";
    let primary = "";
    let rep_msg = "report done";
    if rep != () && rep.success && rep.output != () {
        if rep.output.report_path != () { report_path = rep.output.report_path; }
        if rep.output.feedback_path != () { feedback_path = rep.output.feedback_path; }
        if rep.output.top3_summary != () { top3 = rep.output.top3_summary; }
        if rep.output.primary_recommendation != () { primary = rep.output.primary_recommendation; }
        if rep.output.message != () { rep_msg = rep.output.message; }
        if rep.output.ai_ready_for_real_world == false { ai_ready = false; }
    } else {
        log("report agent failed");
    }
    last_report_path = report_path;
    last_top3 = top3;
    last_primary = primary;

    let scratch = "# Round " + this_label + " slate_n=" + slate_n.to_string() + "\n\n" + rep_msg + "\n\n";
    scratch += "- report: " + report_path + "\n";
    scratch += "- feedback: " + feedback_path + "\n";
    scratch += "- top3: " + top3 + "\n";
    scratch += "- primary: " + primary + "\n";
    scratch += "- ready: " + ai_ready.to_string() + " diversity_ok: " + diversity_ok.to_string() + "\n";
    scratch += "- rank: " + rank_order + "\n";
    let spath = write_scratch_file("user-research-round-" + this_label + ".md", scratch);

    // ===== Founder gate =====
    phase("Founder gate");
    let gate_msg = "";
    gate_msg += "ROUND " + this_label + " complete (slate_n=" + slate_n.to_string() + ").\n";
    gate_msg += "Report: " + report_path + "\nScratch: " + spath + "\n";
    gate_msg += "AI ready: " + ai_ready.to_string() + " diversity_ok: " + diversity_ok.to_string() + "\n";
    gate_msg += "Primary: " + primary + "\nTop3: " + top3 + "\n\n";
    gate_msg += "Edit research/icps/FOUNDER_FEEDBACK.md:\n";
    gate_msg += "  decision: iterate | agree_ready | kill\n";
    gate_msg += "  notes: redirects (keep/drop must respect diversity cells)\n";
    gate_msg += "Then resume. agree_ready = OK for shadow real tests, not PMF.\n";
    await_user("user", gate_msg);

    let fb_p = "";
    fb_p += "Read research/icps/FOUNDER_FEEDBACK.md. decision: iterate|agree_ready|kill.\n";
    fb_p += "Blank/missing → iterate, file_found=false. Copy notes.\n";
    let fb = agent(fb_p, #{
        label: "ur-feedback-" + round_i.to_string(),
        capability_mode: "read-only",
        output_schema: feedback_schema,
    });

    let decision = "iterate";
    let fb_notes = "";
    if fb != () && fb.success && fb.output != () {
        if fb.output.decision != () { decision = fb.output.decision; }
        if fb.output.notes != () { fb_notes = fb.output.notes; }
    }
    if decision != "iterate" && decision != "agree_ready" && decision != "kill" {
        log("bad decision → iterate");
        decision = "iterate";
    }
    if fb_notes != "" { last_notes = fb_notes; }
    log("decision=" + decision);

    if decision == "kill" {
        let kp = write_scratch_file(
            "user-research-killed.md",
            "# killed\nreport: " + last_report_path + "\nnotes: " + last_notes + "\n"
        );
        complete(#{
            mode: "round", outcome: "kill", path: kp,
            last_report: last_report_path, primary: last_primary, top3: last_top3,
            rounds_completed: round_i, message: "Founder kill",
        });
    }

    if decision == "agree_ready" {
        let ready_p = "";
        ready_p += "Founder agree_ready. Write research/icps/READY_FOR_REAL_WORLD.md:\n";
        ready_p += "- founder accepts strong_fit ICPs for shadow real tests\n";
        ready_p += "- primary: " + last_primary + "\n- top3: " + last_top3 + "\n";
        ready_p += "- report: " + last_report_path + "\n- AI ready was: " + ai_ready.to_string() + "\n";
        ready_p += "- not PMF; 3–5 instrumented shadow jobs + kill criteria\n";
        ready_p += "Update README. " + RULES;
        ready_p += "Return report schema; ok=true.\n";

        let ready_w = agent(ready_p, #{
            label: "ur-ready-" + round_i.to_string(),
            capability_mode: "read-write",
            output_schema: report_schema,
        });
        let ready_msg = "agree_ready marker written";
        if ready_w != () && ready_w.success && ready_w.output != () && ready_w.output.message != () {
            ready_msg = ready_w.output.message;
        }
        let dp = write_scratch_file(
            "user-research-ready.md",
            "# agree_ready\n" + ready_msg + "\nreport: " + last_report_path + "\n"
        );
        complete(#{
            mode: "round", outcome: "agree_ready", path: dp,
            last_report: last_report_path, primary: last_primary, top3: last_top3,
            rounds_completed: round_i, ai_ready_for_real_world: ai_ready,
            ready_marker: "research/icps/READY_FOR_REAL_WORLD.md", message: ready_msg,
        });
    }

    log("iterate → next round");
    round_i += 1;
}

pause("verification", "user-research loop exited unexpectedly");
