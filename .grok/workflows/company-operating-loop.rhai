let meta = #{
    name: "company-operating-loop",
    description: "Inspect or advance the Totbox company OS living instance (status / continue / start); hands off to user-research on research/validation stages; founder gates for journey phase",
    when_to_use: "When working the company operating system loop: where are we, continue a stage, or start a new live loop cycle",
    phases: [
        #{ title: "Inspect", detail: "Read instance state and open questions" },
        #{ title: "Research handoff", detail: "When loop/journey is in research-validation, require user-research workflow" },
        #{ title: "Act", detail: "status report, continue loop, or start loop" },
        #{ title: "Gate", detail: "Founder approval if journey advance is requested" },
    ],
};

// args.action: "status" | "continue" | "start" | "advance-journey" | "user-research" (default status)
// args.approve_journey: true only when founder already approved journey advance
// args.note: optional string
// args.signal: optional product signal for run-stage
// args.skip_research_handoff: true only to bypass research gate (founder override)

let action = "status";
let approve_journey = false;
let note = "";
let signal = "";
let skip_research_handoff = false;

if args != () {
    if args.action != () { action = args.action; }
    if args.approve_journey == true { approve_journey = true; }
    if args.note != () { note = args.note; }
    if args.signal != () { signal = args.signal; }
    if args.skip_research_handoff == true { skip_research_handoff = true; }
}

if action != "status" && action != "continue" && action != "start" && action != "advance-journey" && action != "user-research" {
    pause("verification", "args.action must be status | continue | start | advance-journey | user-research");
}

phase("Inspect");

let status_schema = #{
    "type": "object",
    "required": ["journey_phase", "loop_stage", "gate", "summary", "has_state_file"],
    "properties": #{
        "journey_phase": #{ "type": "number" },
        "loop_stage": #{ "type": "number" },
        "gate": #{ "type": "string" },
        "summary": #{ "type": "string" },
        "has_state_file": #{ "type": "boolean" },
        "recommended_next": #{ "type": "string" },
    },
};

let inspect_prompt = "";
inspect_prompt += "You are inspecting the Totbox company operating system INSTANCE (not rewriting the portable template).\n";
inspect_prompt += "Read these files with read_file (do not invent state):\n";
inspect_prompt += "1) company/state/company-state.json\n";
inspect_prompt += "2) docs/company-os/instance/README.md\n";
inspect_prompt += "3) docs/company-os/instance/scores.md (optional)\n";
inspect_prompt += "Report journey_phase (1-9), loop_stage (1-7), gate, a short summary, has_state_file=true if JSON existed,\n";
inspect_prompt += "and recommended_next one of: run-stage, continue, start, advance-journey-needs-founder, hold.\n";
inspect_prompt += "Never claim journey advanced without founder approval.\n";

let insp = agent(inspect_prompt, #{
    label: "cos-inspect",
    capability_mode: "read-only",
    output_schema: status_schema,
});

if insp == () || !insp.success || insp.output == () {
    pause("infra", "Inspect agent failed; fix tools and resume.");
}

// Safe field extraction (canned validate_only may omit schema fields)
let jph = 0;
let lst = 0;
let gate_s = "unknown";
let sum_s = "";
let rec_s = "hold";
if insp.output.journey_phase != () { jph = insp.output.journey_phase; }
if insp.output.loop_stage != () { lst = insp.output.loop_stage; }
if insp.output.gate != () { gate_s = insp.output.gate; }
if insp.output.summary != () { sum_s = insp.output.summary; }
if insp.output.recommended_next != () { rec_s = insp.output.recommended_next; }

log("Inspected company OS: journey=" + jph.to_string() + " loop=" + lst.to_string() + " gate=" + gate_s);

// Research / product-idea validation stages (Company OS live loop 1-2, or early journey)
// Workflows cannot nest; hand off to sibling workflow `user-research`.
let needs_user_research = false;
if lst == 1 || lst == 2 { needs_user_research = true; }
if jph >= 1 && jph <= 3 { needs_user_research = true; }

phase("Research handoff");

if action == "user-research" {
    let ur_msg = "";
    ur_msg += "Launch the sibling workflow **user-research** (project: .grok/workflows/user-research.rhai).\n\n";
    ur_msg += "Suggested args: { \"mode\": \"round\", \"round_label\": \"1\" }\n";
    ur_msg += "Optional: founder_notes, max_rounds (1-5).\n\n";
    ur_msg += "That workflow: proposes 5 ICPs → reward/risk scorecards → synthetic dialogues →\n";
    ur_msg += "adversarial challenge → report under research/icps/ → founder FOUNDER_FEEDBACK.md gate →\n";
    ur_msg += "iterate until decision agree_ready (writes READY_FOR_REAL_WORLD.md) or kill.\n\n";
    ur_msg += "After agree_ready, re-run company-operating-loop with action=continue.\n";
    ur_msg += "Current cursor: journey=" + jph.to_string() + " loop=" + lst.to_string() + ".\n";
    let urp = write_scratch_file("company-os-user-research-handoff.md", ur_msg);
    await_user("user", ur_msg);
    complete(#{
        action: "user-research",
        path: urp,
        journey_phase: jph,
        loop_stage: lst,
        message: "Handoff: run workflow user-research, then resume company loop.",
        handoff_workflow: "user-research",
    });
}

phase("Act");

if action == "status" {
    let report = "";
    report += "# Company OS status\n\n";
    report += sum_s + "\n\n";
    report += "- journey_phase: " + jph.to_string() + "\n";
    report += "- loop_stage: " + lst.to_string() + "\n";
    report += "- gate: " + gate_s + "\n";
    report += "- recommended_next: " + rec_s + "\n";
    report += "- research_stage_flag: " + needs_user_research.to_string() + "\n";
    report += "\nCLI: npm run company-os -- status\n";
    if needs_user_research {
        report += "\n**Research/validation stage:** run workflow `user-research` (or company-operating-loop action=user-research).\n";
        report += "Artifacts: research/icps/ROUND_*_report.md, FOUNDER_FEEDBACK.md, READY_FOR_REAL_WORLD.md\n";
    }
    let p = write_scratch_file("company-os-status.md", report);
    complete(#{
        action: "status",
        path: p,
        journey_phase: jph,
        loop_stage: lst,
        gate: gate_s,
        summary: sum_s,
        needs_user_research: needs_user_research,
    });
}

let act_schema = #{
    "type": "object",
    "required": ["ok", "message", "journey_phase", "loop_stage", "gate"],
    "properties": #{
        "ok": #{ "type": "boolean" },
        "message": #{ "type": "string" },
        "journey_phase": #{ "type": "number" },
        "loop_stage": #{ "type": "number" },
        "gate": #{ "type": "string" },
        "cli_ran": #{ "type": "boolean" },
    },
};

if action == "start" {
    let start_prompt = "";
    start_prompt += "Start or restart the company OS live loop for Totbox.\n";
    start_prompt += "Run via shell: npm run company-os -- start\n";
    if note != "" {
        start_prompt += "Optional note was requested: " + note + " — pass with --note if the CLI accepts it.\n";
    }
    start_prompt += "Then re-read company/state/company-state.json and report ok, message, journey_phase, loop_stage, gate, cli_ran.\n";
    start_prompt += "Journey phase must NOT increase. loop_stage should be 1 after start.\n";
    start_prompt += "Use execute capability for the CLI. Public-safe only.\n";

    let started = agent(start_prompt, #{
        label: "cos-start",
        capability_mode: "execute",
        output_schema: act_schema,
    });

    if started == () || !started.success || started.output == () {
        pause("infra", "start action agent failed");
    }

    let sok = true;
    let smsg = "start completed";
    let sj = jph;
    let sl = 1;
    let sg = gate_s;
    if started.output.ok != () { sok = started.output.ok; }
    if started.output.message != () { smsg = started.output.message; }
    if started.output.journey_phase != () { sj = started.output.journey_phase; }
    if started.output.loop_stage != () { sl = started.output.loop_stage; }
    if started.output.gate != () { sg = started.output.gate; }

    complete(#{
        action: "start",
        ok: sok,
        message: smsg,
        journey_phase: sj,
        loop_stage: sl,
        gate: sg,
    });
}

if action == "continue" {
    // When in research/validation stages, require user-research unless ready marker or skip
    if needs_user_research && !skip_research_handoff {
        let ready_check_schema = #{
            "type": "object",
            "required": ["ready_marker", "summary"],
            "properties": #{
                "ready_marker": #{ "type": "boolean" },
                "summary": #{ "type": "string" },
                "latest_report": #{ "type": "string" },
            },
        };
        let rc_p = "";
        rc_p += "Check whether Totbox synthetic user research is complete enough to advance past research stages.\n";
        rc_p += "Read with tools (do not invent):\n";
        rc_p += "- research/icps/READY_FOR_REAL_WORLD.md (ready_marker=true only if file exists and founder agreed)\n";
        rc_p += "- research/icps/FOUNDER_FEEDBACK.md and latest ROUND_*_report.md if present\n";
        rc_p += "Return ready_marker, summary, latest_report path or empty string.\n";
        let rchk = agent(rc_p, #{
            label: "cos-research-ready-check",
            capability_mode: "read-only",
            output_schema: ready_check_schema,
        });
        let is_ready = false;
        let rsum = "research readiness unknown";
        if rchk != () && rchk.success && rchk.output != () {
            if rchk.output.ready_marker == true { is_ready = true; }
            if rchk.output.summary != () { rsum = rchk.output.summary; }
        }
        if !is_ready {
            let hand = "";
            hand += "Company OS continue blocked: loop/journey is in RESEARCH or VALIDATION territory\n";
            hand += "(loop_stage " + lst.to_string() + ", journey_phase " + jph.to_string() + ").\n\n";
            hand += "Readiness check: " + rsum + "\n\n";
            hand += "Run sibling workflow **user-research** until founder decision agree_ready\n";
            hand += "(creates research/icps/READY_FOR_REAL_WORLD.md).\n\n";
            hand += "How:\n";
            hand += "1) /workflow user-research with args {\"mode\":\"round\",\"round_label\":\"1\"}\n";
            hand += "   or company-operating-loop action=user-research for the handoff card\n";
            hand += "2) Review research/icps/ROUND_*_report.md; edit FOUNDER_FEEDBACK.md; resume until agree_ready\n";
            hand += "3) Re-run company-operating-loop continue\n\n";
            hand += "Override only if intentional: args.skip_research_handoff=true\n";
            write_scratch_file("company-os-research-blocked.md", hand);
            await_user("user", hand);
            // After resume, re-check once; if still not ready, complete with blocked (do not silently advance)
            let rchk2 = agent(rc_p, #{
                label: "cos-research-ready-recheck",
                capability_mode: "read-only",
                output_schema: ready_check_schema,
            });
            let is_ready2 = false;
            let rsum2 = rsum;
            if rchk2 != () && rchk2.success && rchk2.output != () {
                if rchk2.output.ready_marker == true { is_ready2 = true; }
                if rchk2.output.summary != () { rsum2 = rchk2.output.summary; }
            }
            if !is_ready2 {
                complete(#{
                    action: "continue",
                    ok: false,
                    message: "Blocked pending user-research agree_ready: " + rsum2,
                    journey_phase: jph,
                    loop_stage: lst,
                    gate: gate_s,
                    handoff_workflow: "user-research",
                    needs_user_research: true,
                });
            }
            log("Research ready marker present after handoff; proceeding with continue");
        }
    }

    let cont_prompt = "";
    cont_prompt += "Continue the Totbox company OS live loop by ONE stage.\n";
    cont_prompt += "1) Optionally run stage work: npm run company-os -- run-stage\n";
    if signal != "" {
        cont_prompt += "   Prefer: npm run company-os -- run-stage with product signal: " + signal + "\n";
    }
    cont_prompt += "2) Then: npm run company-os -- continue\n";
    cont_prompt += "3) Re-read company/state/company-state.json\n";
    cont_prompt += "If research/icps/READY_FOR_REAL_WORLD.md exists, mention it in message.\n";
    cont_prompt += "Report ok, message, journey_phase, loop_stage, gate, cli_ran.\n";
    cont_prompt += "Do NOT run advance-journey. Do NOT increase journey_phase.\n";
    cont_prompt += "If gate is waiting_for_founder, set ok=false and explain founder is needed.\n";

    let cont = agent(cont_prompt, #{
        label: "cos-continue",
        capability_mode: "execute",
        output_schema: act_schema,
    });

    if cont == () || !cont.success || cont.output == () {
        pause("infra", "continue action agent failed");
    }

    let cok = true;
    let cmsg = "continue completed";
    let cj = jph;
    let cl = lst;
    let cg = gate_s;
    if cont.output.ok != () { cok = cont.output.ok; }
    if cont.output.message != () { cmsg = cont.output.message; }
    if cont.output.journey_phase != () { cj = cont.output.journey_phase; }
    if cont.output.loop_stage != () { cl = cont.output.loop_stage; }
    if cont.output.gate != () { cg = cont.output.gate; }

    complete(#{
        action: "continue",
        ok: cok,
        message: cmsg,
        journey_phase: cj,
        loop_stage: cl,
        gate: cg,
        needs_user_research: needs_user_research,
    });
}

// advance-journey — always founder-gated
phase("Gate");

if action == "advance-journey" {
    if !approve_journey {
        await_user(
            "user",
            "Journey phase advance requires explicit founder approval. Resume only if you approve advancing ONE journey phase, and re-run with args.approve_journey=true (or approve now and resume so the agent can run: npm run company-os -- advance-journey --approve)."
        );
        pause(
            "verification",
            "Re-launch company-operating-loop with args: { \"action\": \"advance-journey\", \"approve_journey\": true } after you approve."
        );
    }

    let adv_prompt = "";
    adv_prompt += "Founder APPROVED journey advance for Totbox company OS.\n";
    adv_prompt += "Run: npm run company-os -- advance-journey --approve\n";
    if note != "" {
        adv_prompt += "Include note context: " + note + "\n";
    }
    adv_prompt += "Re-read company/state/company-state.json. journey_phase must increase by 1.\n";
    adv_prompt += "Report ok, message, journey_phase, loop_stage, gate, cli_ran.\n";

    let adv = agent(adv_prompt, #{
        label: "cos-journey-advance",
        capability_mode: "execute",
        output_schema: act_schema,
    });

    if adv == () || !adv.success || adv.output == () {
        pause("infra", "advance-journey agent failed");
    }

    let aok = true;
    let amsg = "journey advanced";
    let aj = jph;
    let al = lst;
    let ag = gate_s;
    if adv.output.ok != () { aok = adv.output.ok; }
    if adv.output.message != () { amsg = adv.output.message; }
    if adv.output.journey_phase != () { aj = adv.output.journey_phase; }
    if adv.output.loop_stage != () { al = adv.output.loop_stage; }
    if adv.output.gate != () { ag = adv.output.gate; }

    complete(#{
        action: "advance-journey",
        ok: aok,
        message: amsg,
        journey_phase: aj,
        loop_stage: al,
        gate: ag,
    });
}

pause("verification", "Unhandled action branch");
