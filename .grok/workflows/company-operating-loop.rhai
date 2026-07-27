let meta = #{
    name: "company-operating-loop",
    description: "Inspect or advance the Totbox company OS living instance (status / continue / start); founder gates for journey phase",
    when_to_use: "When working the company operating system loop: where are we, continue a stage, or start a new live loop cycle",
    phases: [
        #{ title: "Inspect", detail: "Read instance state and open questions" },
        #{ title: "Act", detail: "status report, continue loop, or start loop" },
        #{ title: "Gate", detail: "Founder approval if journey advance is requested" },
    ],
};

// args.action: "status" | "continue" | "start" | "advance-journey" (default status)
// args.approve_journey: true only when founder already approved journey advance
// args.note: optional string
// args.signal: optional product signal for run-stage

let action = "status";
let approve_journey = false;
let note = "";
let signal = "";

if args != () {
    if args.action != () { action = args.action; }
    if args.approve_journey == true { approve_journey = true; }
    if args.note != () { note = args.note; }
    if args.signal != () { signal = args.signal; }
}

if action != "status" && action != "continue" && action != "start" && action != "advance-journey" {
    pause("verification", "args.action must be status | continue | start | advance-journey");
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

phase("Act");

if action == "status" {
    let report = "";
    report += "# Company OS status\n\n";
    report += sum_s + "\n\n";
    report += "- journey_phase: " + jph.to_string() + "\n";
    report += "- loop_stage: " + lst.to_string() + "\n";
    report += "- gate: " + gate_s + "\n";
    report += "- recommended_next: " + rec_s + "\n";
    report += "\nCLI: npm run company-os -- status\n";
    let p = write_scratch_file("company-os-status.md", report);
    complete(#{
        action: "status",
        path: p,
        journey_phase: jph,
        loop_stage: lst,
        gate: gate_s,
        summary: sum_s,
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
    let cont_prompt = "";
    cont_prompt += "Continue the Totbox company OS live loop by ONE stage.\n";
    cont_prompt += "1) Optionally run stage work: npm run company-os -- run-stage\n";
    if signal != "" {
        cont_prompt += "   Prefer: npm run company-os -- run-stage with product signal: " + signal + "\n";
    }
    cont_prompt += "2) Then: npm run company-os -- continue\n";
    cont_prompt += "3) Re-read company/state/company-state.json\n";
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
