let meta = #{
    name: "user-research",
    description: "Multi-round synthetic ICP research and validation per Company OS; founder gates until ready for real-world tests",
    when_to_use: "Journey/loop stages for synthetic research and product-idea validation; generate and rank 5 ICPs, score reward/risk, synthetic dialogues, founder review loops until agree ready for real-world testing",
    phases: [
        #{ title: "Context", detail: "Load thesis, OS blueprint, existing ICPs, prior founder feedback" },
        #{ title: "Propose", detail: "Best-guess set of exactly 5 ICP candidates" },
        #{ title: "Scorecards", detail: "Reward/risk scorecard per ICP (parallel)" },
        #{ title: "Synthetic", detail: "Synthetic research dialogues and scenarios per ICP (parallel)" },
        #{ title: "Challenge", detail: "Adversarial skeptic on ranking and promotion claims" },
        #{ title: "Report", detail: "Write round report + feedback template for founder" },
        #{ title: "Founder gate", detail: "Founder reviews, writes feedback file, resume to iterate or agree" },
    ],
};

// args.mode: "round" (default) | "status"
// args.round_label: optional string for report naming (e.g. "1", "post-feedback-2")
// args.founder_notes: optional seed notes when starting a fresh process
// args.max_rounds: optional number 1-5 (default 4) — founder-gated loops inside one run
//
// Founder control (after each report, edit then resume):
//   research/icps/FOUNDER_FEEDBACK.md  — required on resume
//     decision: iterate | agree_ready | kill
//     notes: free text for next round
//   research/icps/READY_FOR_REAL_WORLD.md — written only when founder agrees

let mode = "round";
let round_label = "1";
let founder_notes = "";
let max_rounds = 4;

if args != () {
    if args.mode != () { mode = args.mode; }
    if args.round_label != () { round_label = args.round_label; }
    if args.founder_notes != () { founder_notes = args.founder_notes; }
    if args.max_rounds != () {
        let mr = args.max_rounds;
        if mr >= 1 && mr <= 5 { max_rounds = mr; }
    }
}

if mode != "round" && mode != "status" {
    pause("verification", "args.mode must be round | status");
}

// --- Schemas ---

let context_schema = #{
    "type": "object",
    "required": ["thesis_summary", "existing_icp_notes", "open_questions", "prior_feedback", "product_constraints"],
    "properties": #{
        "thesis_summary": #{ "type": "string" },
        "existing_icp_notes": #{ "type": "string" },
        "open_questions": #{ "type": "string" },
        "prior_feedback": #{ "type": "string" },
        "product_constraints": #{ "type": "string" },
    },
};

let propose_schema = #{
    "type": "object",
    "required": ["icps", "rationale"],
    "properties": #{
        "rationale": #{ "type": "string" },
        "icps": #{
            "type": "array",
            "minItems": 5,
            "maxItems": 5,
            "items": #{
                "type": "object",
                "required": ["id", "name", "who", "pain", "job_to_be_done", "why_candidate"],
                "properties": #{
                    "id": #{ "type": "string" },
                    "name": #{ "type": "string" },
                    "who": #{ "type": "string" },
                    "pain": #{ "type": "string" },
                    "job_to_be_done": #{ "type": "string" },
                    "why_candidate": #{ "type": "string" },
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
        "risk_score", "time_to_signal_score", "composite_notes", "kill_criteria", "promote_lean"
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
        "composite_notes": #{ "type": "string" },
        "kill_criteria": #{ "type": "string" },
        "promote_lean": #{ "type": "string" },
    },
};

let synthetic_schema = #{
    "type": "object",
    "required": [
        "icp_id", "persona_sketch", "dialogue_summaries",
        "pain_realism", "status_quo", "would_try", "would_pay_or_act",
        "trust_barriers", "say_no_reasons", "synthetic_verdict",
        "verdict_key_factors", "evidence_notes"
    ],
    "properties": #{
        "icp_id": #{ "type": "string" },
        "persona_sketch": #{ "type": "string" },
        "dialogue_summaries": #{ "type": "string" },
        "pain_realism": #{ "type": "string" },
        "status_quo": #{ "type": "string" },
        "would_try": #{ "type": "string" },
        "would_pay_or_act": #{ "type": "string" },
        "trust_barriers": #{ "type": "string" },
        "say_no_reasons": #{ "type": "string" },
        "synthetic_verdict": #{ "type": "string" },
        "verdict_key_factors": #{ "type": "string" },
        "evidence_notes": #{ "type": "string" },
    },
};

let challenge_schema = #{
    "type": "object",
    "required": ["ranking_sound", "overclaimed", "missing_challengers", "recommended_rank_order", "ready_for_real_world_ai", "rationale", "conditions"],
    "properties": #{
        "ranking_sound": #{ "type": "boolean" },
        "overclaimed": #{ "type": "string" },
        "missing_challengers": #{ "type": "string" },
        "recommended_rank_order": #{ "type": "string" },
        "ready_for_real_world_ai": #{ "type": "boolean" },
        "rationale": #{ "type": "string" },
        "conditions": #{ "type": "string" },
    },
};

let report_schema = #{
    "type": "object",
    "required": ["ok", "report_path", "feedback_path", "top3_summary", "primary_recommendation", "ai_ready_for_real_world", "message"],
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
    "required": ["decision", "notes", "agrees_with_ai_ready", "file_found"],
    "properties": #{
        "decision": #{ "type": "string" },
        "notes": #{ "type": "string" },
        "agrees_with_ai_ready": #{ "type": "boolean" },
        "file_found": #{ "type": "boolean" },
        "raw_excerpt": #{ "type": "string" },
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

// --- status path (short) ---

if mode == "status" {
    phase("Context");
    let sp = "";
    sp += "Inspect Totbox user-research artifacts (read-only). Read if present:\n";
    sp += "- research/icps/README.md\n";
    sp += "- research/icps/FOUNDER_FEEDBACK.md\n";
    sp += "- research/icps/READY_FOR_REAL_WORLD.md\n";
    sp += "- research/icps/ (list latest ROUND_*-report.md if any)\n";
    sp += "- company/state/company-state.json\n";
    sp += "Set has_report, has_feedback, ready_marker, and a short summary of research readiness.\n";
    sp += "Do not invent files. Public-safe only.\n";
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
    let report = "";
    report += "# User research status\n\n";
    report += sum + "\n\n";
    report += "- has_report: " + hr.to_string() + "\n";
    report += "- has_feedback: " + hf.to_string() + "\n";
    report += "- ready_for_real_world marker: " + rm.to_string() + "\n";
    let p = write_scratch_file("user-research-status.md", report);
    complete(#{
        mode: "status",
        path: p,
        has_report: hr,
        has_feedback: hf,
        ready_marker: rm,
        summary: sum,
    });
}

// --- multi-round synthetic research ---

let round_i = 1;
let finished = false;
let last_decision = "none";
let last_notes = founder_notes;
let last_primary = "";
let last_top3 = "";
let last_report_path = "";
let ai_ready = false;

while !finished {
    if round_i > max_rounds {
        await_user(
            "user",
            "user-research hit max_rounds without founder agree_ready. Review research/icps/ reports, edit FOUNDER_FEEDBACK.md (decision: iterate|agree_ready|kill), then re-launch user-research with higher max_rounds or after agreeing."
        );
        pause(
            "verification",
            "Re-launch user-research after founder decision, or set FOUNDER_FEEDBACK.md decision=agree_ready and run again."
        );
    }

    let this_label = round_label;
    if round_i > 1 {
        this_label = round_label + "-r" + round_i.to_string();
    }

    log("user-research round " + round_i.to_string() + " label=" + this_label);

    // ===== Context =====
    phase("Context");

    let ctx_p = "";
    ctx_p += "You are loading context for Totbox SYNTHETIC user research (Company OS instance).\n";
    ctx_p += "Use read_file / list_dir. Do NOT invent contents of missing files.\n";
    ctx_p += "Read in order:\n";
    ctx_p += "1) docs/company-os/operating-system.md — sections on early phases, synthetic research, reward/risk ICP ranking\n";
    ctx_p += "2) docs/company-os/live-runtime.md — stages 1-2 if present\n";
    ctx_p += "3) docs/company-os/instance/thesis.md and docs/product_thesis.md\n";
    ctx_p += "4) docs/strategy/bootstrap_pmf_and_agentic_gap.md (venture shape A)\n";
    ctx_p += "5) docs/research/home_services_email_insights.md (patterns only)\n";
    ctx_p += "6) research/icps/README.md and any *.md under research/icps/\n";
    ctx_p += "7) research/icps/FOUNDER_FEEDBACK.md if present\n";
    ctx_p += "8) company/state/company-state.json\n";
    ctx_p += "9) docs/company-os/applied-here.md gap notes on ICPs\n";
    ctx_p += "Round label: " + this_label + "\n";
    if last_notes != "" {
        ctx_p += "Seed/prior founder notes for this process:\n";
        ctx_p += last_notes + "\n";
    }
    ctx_p += "Return: thesis_summary, existing_icp_notes, open_questions, prior_feedback, product_constraints.\n";
    ctx_p += "HARD RULES: public-safe only; no real names, emails, phones, street addresses, personal zips.\n";
    ctx_p += "Synthetic research is a filter, not final proof. Real-world is still required later.\n";

    let ctx = agent(ctx_p, #{
        label: "ur-context-" + round_i.to_string(),
        capability_mode: "read-only",
        output_schema: context_schema,
    });

    let thesis_s = "";
    let existing_s = "";
    let open_s = "";
    let prior_s = "";
    let constr_s = "";
    if ctx != () && ctx.success && ctx.output != () {
        if ctx.output.thesis_summary != () { thesis_s = ctx.output.thesis_summary; }
        if ctx.output.existing_icp_notes != () { existing_s = ctx.output.existing_icp_notes; }
        if ctx.output.open_questions != () { open_s = ctx.output.open_questions; }
        if ctx.output.prior_feedback != () { prior_s = ctx.output.prior_feedback; }
        if ctx.output.product_constraints != () { constr_s = ctx.output.product_constraints; }
    } else {
        log("context agent weak; continuing with empty context strings");
    }

    // ===== Propose exactly 5 ICPs =====
    phase("Propose");

    let prop_p = "";
    prop_p += "Propose exactly FIVE distinct ICP candidates for Totbox synthetic validation.\n";
    prop_p += "Follow Company OS: several groups, not one favorite; challenge the current ranking.\n";
    prop_p += "Use tools to re-read research/icps/ and docs/product_thesis.md if needed.\n\n";
    prop_p += "Thesis context:\n" + thesis_s + "\n\n";
    prop_p += "Existing ICP notes:\n" + existing_s + "\n\n";
    prop_p += "Open questions:\n" + open_s + "\n\n";
    prop_p += "Prior founder feedback:\n" + prior_s + "\n";
    if last_notes != "" {
        prop_p += "\nFounder notes this loop:\n" + last_notes + "\n";
    }
    prop_p += "\nProduct constraints:\n" + constr_s + "\n\n";
    prop_p += "REQUIREMENTS:\n";
    prop_p += "- Exactly 5 ICPs in the array (min and max 5).\n";
    prop_p += "- Include the current beachhead hypothesis as one candidate (not automatic winner).\n";
    prop_p += "- Include at least 2 genuine challengers (different buyer, pain, or monetization path).\n";
    prop_p += "- Include at most one pure operator/payer ICP if relevant (label clearly as payer vs user).\n";
    prop_p += "- ids: stable kebab-case (icp-1 ... or descriptive).\n";
    prop_p += "- who/pain/job_to_be_done/why_candidate: concrete, public-safe composites only.\n";
    prop_p += "- Do NOT promote yet. Do NOT invent real people or private addresses.\n";
    prop_p += "- rationale: why this slate of five tests the thesis well.\n";
    prop_p += "If founder notes demand replacing an ICP, honor them.\n";

    let prop = agent(prop_p, #{
        label: "ur-propose-" + round_i.to_string(),
        capability_mode: "read-only",
        output_schema: propose_schema,
    });

    // Deterministic seed slate (Totbox-relevant challengers). Used when the propose
    // agent fails or returns <5 ICPs so the script always validates exactly five.
    let seed_icps = [
        #{
            id: "icp-dual-income-hvac-cleaning",
            name: "Dual-income household HVAC+cleaning",
            who: "Busy dual-income household coordinating preventive HVAC and recurring cleaning",
            pain: "Multi-turn quote/schedule loops, partner approval, forgotten next-due",
            job_to_be_done: "Complete home-service jobs with fewer touchpoints via host+MCP job PM",
            why_candidate: "Current beachhead hypothesis from email intensity research",
        },
        #{
            id: "icp-hvac-preventive-only",
            name: "HVAC preventive-only household",
            who: "Homeowners focused on AC tune-up/membership cadence, less cleaning coordination",
            pain: "Membership PDF comparison, seasonal windows, rebook last provider",
            job_to_be_done: "Book and track HVAC preventive without inbox chaos",
            why_candidate: "Challenger: narrower vertical may show clearer signal faster",
        },
        #{
            id: "icp-cleaning-recurring",
            name: "Recurring cleaning household",
            who: "Households with biweekly/monthly clean and custom priority lists",
            pain: "Quote tiers, specials, partner forward, reschedule churn",
            job_to_be_done: "Stable cleaning cadence with clear scope and fewer emails",
            why_candidate: "Challenger: high frequency may differ from HVAC ticket size",
        },
        #{
            id: "icp-small-landlord",
            name: "Small landlord / multi-unit coordinator",
            who: "Owner of a few residential units coordinating vendors across properties",
            pain: "Multi-site status, PM handoffs, repeated vendor threads",
            job_to_be_done: "Track jobs across units without a full PM stack",
            why_candidate: "Challenger buyer; may need different product surface",
        },
        #{
            id: "icp-operator-inbound-payer",
            name: "Small operator (structured inbound payer)",
            who: "Solo/small HVAC or cleaning operator drowning in unqualified email/SMS leads",
            pain: "Quote ping-pong, no structured brief, calendar friction",
            job_to_be_done: "Receive structured job briefs and reduce back-and-forth",
            why_candidate: "Monetization-path ICP (payer) vs household user — test separately",
        },
    ];

    let icps = seed_icps;
    let propose_rationale = "Fallback seed slate of 5 Totbox-relevant ICPs (propose agent incomplete).";
    let used_seed = true;

    if prop != () && prop.success && prop.output != () && prop.output.icps != () {
        let proposed = prop.output.icps;
        if proposed.len() >= 5 {
            used_seed = false;
            icps = proposed;
            if prop.output.rationale != () { propose_rationale = prop.output.rationale; }
            else { propose_rationale = "Agent-proposed slate"; }
        } else {
            log("Propose returned " + proposed.len().to_string() + " ICPs (<5); using seed slate");
        }
    } else {
        log("Propose agent failed or empty; using deterministic seed slate of 5 ICPs");
    }

    // Enforce exactly 5 in script (agents are untrusted)
    if icps.len() > 5 {
        log("Truncating proposed ICPs from " + icps.len().to_string() + " to 5");
        let trimmed = [];
        let ti = 0;
        while ti < 5 {
            trimmed.push(icps[ti]);
            ti += 1;
        }
        icps = trimmed;
    }
    if icps.len() < 5 {
        log("ICP list still short after guards; forcing seed slate");
        icps = seed_icps;
        used_seed = true;
    }
    if used_seed {
        log("Using seed ICP slate for this round (agent slate incomplete)");
    }

    log("Proposed " + icps.len().to_string() + " ICPs for synthetic validation");

    // ===== Scorecards (parallel, one per ICP) =====
    phase("Scorecards");

    let score_jobs = [];
    let si = 0;
    while si < icps.len() {
        let ic = icps[si];
        let ic_id = "icp-" + si.to_string();
        let ic_name = "unnamed";
        let ic_who = "";
        let ic_pain = "";
        let ic_job = "";
        if ic.id != () { ic_id = ic.id; }
        if ic.name != () { ic_name = ic.name; }
        if ic.who != () { ic_who = ic.who; }
        if ic.pain != () { ic_pain = ic.pain; }
        if ic.job_to_be_done != () { ic_job = ic.job_to_be_done; }

        let sc_p = "";
        sc_p += "Write a Company OS reward/risk scorecard for ONE ICP candidate (solo-founder bootstrap).\n";
        sc_p += "Read docs/company-os/operating-system.md reward/risk section if needed.\n";
        sc_p += "ICP id: " + ic_id + "\n";
        sc_p += "Name: " + ic_name + "\n";
        sc_p += "Who: " + ic_who + "\n";
        sc_p += "Pain: " + ic_pain + "\n";
        sc_p += "Job: " + ic_job + "\n";
        sc_p += "Thesis: " + thesis_s + "\n";
        sc_p += "Scores 0.0-1.0: pain_score, pay_or_act_score, reach_score, channel_fit_score,\n";
        sc_p += "  risk_score (higher = riskier), time_to_signal_score (higher = faster clear signal).\n";
        sc_p += "reward_notes and risk_notes must be concrete.\n";
        sc_p += "promote_lean: promote | hold | demote (lean only; synthetic not done yet).\n";
        sc_p += "kill_criteria: clear falsifiers for this ICP.\n";
        sc_p += "Public-safe. No PII. Set icp_id and icp_name to match input.\n";

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
            log("Scorecard failed for index " + sj.to_string() + " — fail-closed placeholder");
            let fb = #{
                icp_id: "unknown-" + sj.to_string(),
                icp_name: "score-failed",
                reward_notes: "score agent failed",
                risk_notes: "unscored — treat as high uncertainty",
                pain_score: 0.0,
                pay_or_act_score: 0.0,
                reach_score: 0.0,
                channel_fit_score: 0.0,
                risk_score: 1.0,
                time_to_signal_score: 0.0,
                composite_notes: "FAIL_CLOSED_UNSCORED",
                kill_criteria: "Cannot validate without scorecard",
                promote_lean: "hold",
            };
            scorecards.push(fb);
        }
        sj += 1;
    }

    // ===== Synthetic research (parallel per ICP) =====
    phase("Synthetic");

    let syn_jobs = [];
    let yi = 0;
    while yi < icps.len() {
        let ic2 = icps[yi];
        let id2 = "icp-" + yi.to_string();
        let name2 = "unnamed";
        let who2 = "";
        let pain2 = "";
        let job2 = "";
        if ic2.id != () { id2 = ic2.id; }
        if ic2.name != () { name2 = ic2.name; }
        if ic2.who != () { who2 = ic2.who; }
        if ic2.pain != () { pain2 = ic2.pain; }
        if ic2.job_to_be_done != () { job2 = ic2.job_to_be_done; }

        let sc_blob = "";
        if yi < scorecards.len() {
            sc_blob = json_encode(scorecards[yi]);
        }

        let sy_p = "";
        sy_p += "Run SYNTHETIC user research for ONE ICP (Company OS synthetic leg).\n";
        sy_p += "This is a filter, not final proof. Be realistic and willing to falsify the hypothesis.\n";
        sy_p += "Use tools to re-read docs/company-os/operating-system.md synthetic research questions and\n";
        sy_p += "docs/research/home_services_email_insights.md for pattern grounding (not as proof of this ICP).\n\n";
        sy_p += "ICP id: " + id2 + "\nName: " + name2 + "\nWho: " + who2 + "\n";
        sy_p += "Pain: " + pain2 + "\nJob: " + job2 + "\n";
        sy_p += "Scorecard JSON:\n" + sc_blob + "\n\n";
        sy_p += "Product shape: host LLM + Totbox MCP job PM for home-service coordination;\n";
        sy_p += "NOT a public vendor directory. Channels: email/SMS/form first.\n\n";
        sy_p += "REQUIRED work product:\n";
        sy_p += "1) persona_sketch: public-safe composite (role, constraints, tech literacy) — NOT a real person.\n";
        sy_p += "2) Run THREE synthetic dialogue scenarios (summarize in dialogue_summaries):\n";
        sy_p += "   a) Discovery: how they handle the job today; friction moments.\n";
        sy_p += "   b) Offer reaction: host chat + job PM checklist + human approve-before-send; quote paste.\n";
        sy_p += "   c) Objection: trust, privacy, money/time, partner approval, or provider messiness.\n";
        sy_p += "3) Answer OS questions: pain_realism, status_quo, would_try, would_pay_or_act,\n";
        sy_p += "   trust_barriers, say_no_reasons.\n";
        sy_p += "4) synthetic_verdict: strong_fit | weak_fit | poor_fit | unclear\n";
        sy_p += "5) verdict_key_factors: ONE short phrase (roughly 12-25 words) naming the main drivers\n";
        sy_p += "   that produced this verdict (e.g. scores, channel fit, falsifiers, reach, risk).\n";
        sy_p += "   Must explain the verdict at a glance for a table column — not a full paragraph.\n";
        sy_p += "6) evidence_notes: what would real-world testing need to confirm/kill.\n";
        sy_p += "Set icp_id to " + id2 + ".\n";
        sy_p += "HARD: no PII; no real emails/phones/addresses; label everything synthetic.\n";

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
            synthetics.push(yr.output);
        } else {
            log("Synthetic research failed for index " + yj.to_string() + " — fail-closed");
            synthetics.push(#{
                icp_id: "unknown-" + yj.to_string(),
                persona_sketch: "unavailable",
                dialogue_summaries: "synthetic agent failed",
                pain_realism: "unknown",
                status_quo: "unknown",
                would_try: "unknown",
                would_pay_or_act: "unknown",
                trust_barriers: "unknown",
                say_no_reasons: "agent failure",
                synthetic_verdict: "unclear",
                verdict_key_factors: "Synthetic agent failed — treat as unverified",
                evidence_notes: "FAIL_CLOSED_NO_SYNTHETIC",
            });
        }
        yj += 1;
    }

    // ===== Adversarial challenge =====
    phase("Challenge");

    let pack = #{
        icps: icps,
        scorecards: scorecards,
        synthetics: synthetics,
        propose_rationale: propose_rationale,
        thesis: thesis_s,
        founder_notes: last_notes,
    };
    let pack_json = json_encode(pack);

    let ch_p = "";
    ch_p += "You are an adversarial skeptic on Totbox ICP ranking (fail closed).\n";
    ch_p += "Read the research pack JSON and Company OS promotion rules.\n";
    ch_p += "Re-read docs/company-os/operating-system.md ranking/promotion rules with tools.\n\n";
    ch_p += "Research pack:\n" + pack_json + "\n\n";
    ch_p += "Tasks:\n";
    ch_p += "- ranking_sound: true only if ordering is justified by synthetic evidence + reward/risk, not favorite bias.\n";
    ch_p += "- overclaimed: list claims that synthetic work does NOT support.\n";
    ch_p += "- missing_challengers: groups we should have tested but did not.\n";
    ch_p += "- recommended_rank_order: best → worst by id or name (string).\n";
    ch_p += "- ready_for_real_world_ai: true ONLY if top ICPs are high-quality enough that real-world\n";
    ch_p += "  tests would not waste founder time — still synthetic-only; never claim real PMF.\n";
    ch_p += "  Default false if scorecards/synthetics failed, verdicts unclear, or beachhead unchallenged.\n";
    ch_p += "- rationale and conditions (what must be true before real tests).\n";
    ch_p += "Public-safe. Prefer demote over promote when uncertain.\n";

    let chal = agent(ch_p, #{
        label: "ur-challenge-" + round_i.to_string(),
        capability_mode: "read-only",
        output_schema: challenge_schema,
    });

    let ranking_sound = false;
    let overclaimed = "challenge agent failed — treat ranking as unverified";
    let missing_ch = "";
    let rank_order = "unverified";
    let ready_ai = false;
    let chal_rationale = "fail-closed";
    let conditions = "Re-run challenge successfully before real-world tests.";
    if chal != () && chal.success && chal.output != () {
        if chal.output.ranking_sound == true { ranking_sound = true; }
        if chal.output.overclaimed != () { overclaimed = chal.output.overclaimed; }
        if chal.output.missing_challengers != () { missing_ch = chal.output.missing_challengers; }
        if chal.output.recommended_rank_order != () { rank_order = chal.output.recommended_rank_order; }
        if chal.output.ready_for_real_world_ai == true { ready_ai = true; }
        if chal.output.rationale != () { chal_rationale = chal.output.rationale; }
        if chal.output.conditions != () { conditions = chal.output.conditions; }
    } else {
        log("Challenge agent failed — ready_for_real_world_ai forced false");
        ready_ai = false;
    }
    ai_ready = ready_ai;

    // ===== Report + persist =====
    phase("Report");

    let rep_p = "";
    rep_p += "Write the founder-facing user-research ROUND REPORT for Totbox and persist artifacts.\n";
    rep_p += "Use write tools (read-write). Public-safe only — never write PII.\n\n";
    rep_p += "Round label: " + this_label + "\n";
    rep_p += "AI ready_for_real_world (skeptic): " + ready_ai.to_string() + "\n";
    rep_p += "ranking_sound: " + ranking_sound.to_string() + "\n";
    rep_p += "recommended_rank_order: " + rank_order + "\n";
    rep_p += "overclaimed: " + overclaimed + "\n";
    rep_p += "missing_challengers: " + missing_ch + "\n";
    rep_p += "skeptic rationale: " + chal_rationale + "\n";
    rep_p += "conditions: " + conditions + "\n\n";
    rep_p += "Full pack JSON:\n" + pack_json + "\n\n";
    rep_p += "WRITE these files (create dirs if needed):\n";
    rep_p += "1) research/icps/ROUND_" + this_label + "_report.md — full markdown report with:\n";
    rep_p += "   - Executive summary\n";
    rep_p += "   - Method (Company OS synthetic filter; not real-world proof)\n";
    rep_p += "   - REQUIRED ranked verdict table (all 5 ICPs) with columns exactly:\n";
    rep_p += "     Rank | ICP | Synthetic verdict | Key factors | promote_lean\n";
    rep_p += "     where Key factors is a brief (one short phrase) summary of the drivers that\n";
    rep_p += "     produced the verdict — prefer each ICP's verdict_key_factors from the pack;\n";
    rep_p += "     if missing, synthesize from scorecard + synthetic notes (still one short phrase).\n";
    rep_p += "   - Full scorecard table (numeric scores) — may be separate from the verdict table\n";
    rep_p += "   - Ranked top 3 with why\n";
    rep_p += "   - Primary recommendation + kill criteria\n";
    rep_p += "   - Skeptic section (overclaims, conditions)\n";
    rep_p += "   - What real-world tests should do next (concierge jobs, metrics)\n";
    rep_p += "   - Explicit label: SYNTHETIC ONLY\n";
    rep_p += "2) research/icps/FOUNDER_FEEDBACK.md — OVERWRITE with a template:\n";
    rep_p += "   ```\n";
    rep_p += "   # Founder feedback (user-research)\n";
    rep_p += "   decision: iterate | agree_ready | kill\n";
    rep_p += "   # Pick ONE decision word on the next line after 'decision:'\n";
    rep_p += "   decision: \n";
    rep_p += "   agrees_with_ai_ready: yes | no\n";
    rep_p += "   notes:\n";
    rep_p += "   (Write concrete feedback: which ICPs to drop/add, score disputes, constraints.)\n";
    rep_p += "   ```\n";
    rep_p += "3) Update research/icps/README.md index of candidates and latest round pointer.\n";
    rep_p += "4) Optionally write one short file per top ICP under research/icps/<id>.md if helpful.\n";
    rep_p += "5) Do NOT write READY_FOR_REAL_WORLD.md unless you are told founder already agreed (you are not).\n";
    rep_p += "6) Optionally append a public-safe decision note under traces/decisions/ (no PII).\n\n";
    rep_p += "Return ok, report_path, feedback_path, top3_summary, primary_recommendation,\n";
    rep_p += "ai_ready_for_real_world (must match skeptic " + ready_ai.to_string() + "), message.\n";

    let rep = agent(rep_p, #{
        label: "ur-report-" + round_i.to_string(),
        capability_mode: "read-write",
        output_schema: report_schema,
    });

    let report_path = "research/icps/ROUND_" + this_label + "_report.md";
    let feedback_path = "research/icps/FOUNDER_FEEDBACK.md";
    let top3 = "";
    let primary = "";
    let rep_msg = "report step finished";
    let rep_ok = false;
    if rep != () && rep.success && rep.output != () {
        if rep.output.ok == true { rep_ok = true; }
        if rep.output.report_path != () { report_path = rep.output.report_path; }
        if rep.output.feedback_path != () { feedback_path = rep.output.feedback_path; }
        if rep.output.top3_summary != () { top3 = rep.output.top3_summary; }
        if rep.output.primary_recommendation != () { primary = rep.output.primary_recommendation; }
        if rep.output.message != () { rep_msg = rep.output.message; }
        if rep.output.ai_ready_for_real_world == true { ai_ready = true; }
        if rep.output.ai_ready_for_real_world == false { ai_ready = false; }
    } else {
        log("Report agent failed — founder should still review partial agent outputs");
    }
    last_report_path = report_path;
    last_top3 = top3;
    last_primary = primary;

    let scratch = "";
    scratch += "# User research round " + this_label + "\n\n";
    scratch += rep_msg + "\n\n";
    scratch += "- report: " + report_path + "\n";
    scratch += "- feedback template: " + feedback_path + "\n";
    scratch += "- top3: " + top3 + "\n";
    scratch += "- primary: " + primary + "\n";
    scratch += "- ai_ready_for_real_world: " + ai_ready.to_string() + "\n";
    scratch += "- ranking_sound: " + ranking_sound.to_string() + "\n";
    scratch += "- rank_order: " + rank_order + "\n";
    scratch += "\n## Founder next step\n";
    scratch += "1. Read " + report_path + "\n";
    scratch += "2. Edit " + feedback_path + " set decision to iterate | agree_ready | kill and write notes\n";
    scratch += "3. Resume this workflow (or re-launch if process died)\n";
    let spath = write_scratch_file("user-research-round-" + this_label + ".md", scratch);

    // ===== Founder gate =====
    phase("Founder gate");

    let gate_msg = "";
    gate_msg += "USER RESEARCH ROUND " + this_label + " complete.\n\n";
    gate_msg += "Report: " + report_path + "\n";
    gate_msg += "Scratch: " + spath + "\n";
    gate_msg += "AI skeptic ready_for_real_world: " + ai_ready.to_string() + "\n";
    gate_msg += "Primary recommendation: " + primary + "\n";
    gate_msg += "Top 3: " + top3 + "\n\n";
    gate_msg += "FOUNDER ACTION (required before continue):\n";
    gate_msg += "1) Review the report on disk.\n";
    gate_msg += "2) Edit research/icps/FOUNDER_FEEDBACK.md:\n";
    gate_msg += "   - decision: iterate  (run another synthetic round with your notes)\n";
    gate_msg += "   - decision: agree_ready  (you AND process agree ICPs are high quality enough for real-world tests)\n";
    gate_msg += "   - decision: kill  (stop this research line)\n";
    gate_msg += "   - notes: concrete redirects for the next round\n";
    gate_msg += "3) Resume this workflow.\n";
    gate_msg += "agree_ready should mean you accept top ICPs for concierge/shadow real tests — not that PMF is proven.\n";

    await_user("user", gate_msg);

    // After resume: read founder feedback from disk
    let fb_p = "";
    fb_p += "Read research/icps/FOUNDER_FEEDBACK.md with read_file (required).\n";
    fb_p += "Parse founder intent. Map decision to exactly one of: iterate | agree_ready | kill.\n";
    fb_p += "If file missing or decision blank/unclear, decision=iterate and file_found=false.\n";
    fb_p += "agrees_with_ai_ready: true only if founder explicitly agrees ICPs are ready for real-world testing\n";
    fb_p += "(decision agree_ready, or notes clearly say ready for real tests).\n";
    fb_p += "notes: copy founder notes for the next research round.\n";
    fb_p += "raw_excerpt: short excerpt. Public-safe.\n";

    let fb = agent(fb_p, #{
        label: "ur-feedback-" + round_i.to_string(),
        capability_mode: "read-only",
        output_schema: feedback_schema,
    });

    let decision = "iterate";
    let fb_notes = "";
    let agrees = false;
    let file_found = false;
    if fb != () && fb.success && fb.output != () {
        if fb.output.decision != () { decision = fb.output.decision; }
        if fb.output.notes != () { fb_notes = fb.output.notes; }
        if fb.output.agrees_with_ai_ready == true { agrees = true; }
        if fb.output.file_found == true { file_found = true; }
    } else {
        log("Feedback parse failed — defaulting to iterate");
        decision = "iterate";
    }

    // Normalize decision strings loosely
    if decision != "iterate" && decision != "agree_ready" && decision != "kill" {
        // agents may return messy text; treat non-exact as iterate unless contains markers
        log("Non-canonical decision '" + decision + "' — coercing carefully");
        decision = "iterate";
    }

    last_decision = decision;
    if fb_notes != "" {
        last_notes = fb_notes;
    }

    log("Founder decision=" + decision + " agrees=" + agrees.to_string() + " file_found=" + file_found.to_string());

    if decision == "kill" {
        let kill_scratch = "";
        kill_scratch += "# User research stopped (founder kill)\n\n";
        kill_scratch += "Last report: " + last_report_path + "\n";
        kill_scratch += "Notes: " + last_notes + "\n";
        let kp = write_scratch_file("user-research-killed.md", kill_scratch);
        complete(#{
            mode: "round",
            outcome: "kill",
            path: kp,
            last_report: last_report_path,
            primary: last_primary,
            top3: last_top3,
            rounds_completed: round_i,
            message: "Founder killed this research line.",
        });
    }

    // Agreement requires founder agree_ready; AI ready alone is insufficient
    if decision == "agree_ready" {
        // Persist ready marker via agent
        let ready_p = "";
        ready_p += "Founder decision is agree_ready for Totbox ICP synthetic research.\n";
        ready_p += "Write research/icps/READY_FOR_REAL_WORLD.md with:\n";
        ready_p += "- Statement that founder agrees top ICPs are high quality enough for real-world testing\n";
        ready_p += "- primary recommendation: " + last_primary + "\n";
        ready_p += "- top3: " + last_top3 + "\n";
        ready_p += "- last report: " + last_report_path + "\n";
        ready_p += "- AI skeptic ready flag was: " + ai_ready.to_string() + "\n";
        ready_p += "- Explicit: synthetic filter only; real jobs still required for PMF\n";
        ready_p += "- Suggested real-world plan: 3-5 concierge/shadow jobs; touchpoint metrics; kill criteria\n";
        ready_p += "- Public-safe only\n";
        ready_p += "Also update research/icps/README.md to note ready marker present.\n";
        ready_p += "Optionally write a short traces/decisions/ note (no PII).\n";
        ready_p += "Return ok=true, report_path=" + last_report_path + ", feedback_path=research/icps/FOUNDER_FEEDBACK.md,\n";
        ready_p += "top3_summary, primary_recommendation, ai_ready_for_real_world, message confirming marker written.\n";

        let ready_w = agent(ready_p, #{
            label: "ur-ready-marker-" + round_i.to_string(),
            capability_mode: "read-write",
            output_schema: report_schema,
        });

        let ready_msg = "Founder agreed ICPs ready for real-world testing.";
        if ready_w != () && ready_w.success && ready_w.output != () && ready_w.output.message != () {
            ready_msg = ready_w.output.message;
        }

        let done_scratch = "";
        done_scratch += "# User research: founder agree_ready\n\n";
        done_scratch += ready_msg + "\n\n";
        done_scratch += "- last_report: " + last_report_path + "\n";
        done_scratch += "- primary: " + last_primary + "\n";
        done_scratch += "- top3: " + last_top3 + "\n";
        done_scratch += "- ai_ready_flag: " + ai_ready.to_string() + "\n";
        done_scratch += "- rounds: " + round_i.to_string() + "\n";
        done_scratch += "- marker: research/icps/READY_FOR_REAL_WORLD.md\n";
        done_scratch += "\nNext: real-world concierge/shadow tests; company-operating-loop stages 2/6.\n";
        let dp = write_scratch_file("user-research-ready.md", done_scratch);

        complete(#{
            mode: "round",
            outcome: "agree_ready",
            path: dp,
            last_report: last_report_path,
            primary: last_primary,
            top3: last_top3,
            rounds_completed: round_i,
            ai_ready_for_real_world: ai_ready,
            ready_marker: "research/icps/READY_FOR_REAL_WORLD.md",
            message: ready_msg,
        });
    }

    // iterate — next while loop
    log("Founder requested iterate; starting next synthetic round with updated notes");
    round_i += 1;
}

pause("verification", "user-research loop exited unexpectedly");
