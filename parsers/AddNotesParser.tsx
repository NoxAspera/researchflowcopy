interface TankInfo {
    id: string;
    value: number;
    unit: string;
    pressure: string;
}

interface Entry {
    time_in: string | null;
    time_out: string | null;
    names: string[] | null;
    instrument: string | null;
    n2_pressure: string | null;
    lts: TankInfo | null;
    low_cal: TankInfo | null;
    mid_cal: TankInfo | null;
    high_cal: TankInfo | null;
    additional_notes: string[];
}

interface ParsedData {
    site_id: string | null;
    entries: Entry[];
}

export function parseDocument(text: string): ParsedData {
    const siteIdPattern = /# Site id: \*\*(.*?)\*\*/;
    const timePattern = /- Time (in|out): (.*?)z/gi;
    const namePattern = /- Name: (.*?)\n/;
    const instrumentPattern = /- Instrument: (.*?)\n/;
    const n2Pattern = /- N2: (.*?) psi\n/;
    const tankPattern = /- (LTS|Low cal|Mid cal|High cal): (.*?) value (.*?) ppm (\d+ psi)/g;
    const additionalNotesPattern = /- (?!Time|Name|Instrument|N2|LTS|Low cal|Mid cal|High cal)(.*)/g;

    // Parse site ID
    const siteIdMatch = text.match(siteIdPattern);
    const siteId = siteIdMatch ? siteIdMatch[1] : null;

    // Parse times
    const times: { [key: string]: string | null } = { in: null, out: null };
    const timeMatches = text.matchAll(timePattern);
    for (const match of timeMatches) {
        const timeType = match[1].toLowerCase();
        const timeValue = match[2].trim();
        if (timeType === "in") times.in = timeValue;
        if (timeType === "out") times.out = timeValue;
    }

    // Parse names
    const nameMatch = text.match(namePattern);
    const names = nameMatch ? nameMatch[1].split(", ").map(name => name.trim()) : null;

    // Parse instrument details
    const instrumentMatch = text.match(instrumentPattern);
    const instrument = instrumentMatch ? instrumentMatch[1] : null;

    // Parse N2 pressure
    const n2Match = text.match(n2Pattern);
    const n2_pressure = n2Match ? n2Match[1] + " psi" : null;

    // Parse tank information
    const tanks: { [key: string]: TankInfo | null } = { lts: null, low_cal: null, mid_cal: null, high_cal: null };
    let tankMatch;
    while ((tankMatch = tankPattern.exec(text)) !== null) {
        const tankType = tankMatch[1].toLowerCase().replace(" ", "_") as keyof typeof tanks;
        tanks[tankType] = {
            id: tankMatch[2],
            value: parseFloat(tankMatch[3]),
            unit: "ppm",
            pressure: tankMatch[4]
        };
    }

    // Parse additional notes
    const additionalNotes: string[] = [];
    let noteMatch;
    while ((noteMatch = additionalNotesPattern.exec(text)) !== null) {
        additionalNotes.push(noteMatch[1].trim());
    }

    // Construct final parsed data
    const jsonData: ParsedData = {
        site_id: siteId,
        entries: [
            {
                time_in: times.in,
                time_out: times.out,
                names: names,
                instrument: instrument,
                n2_pressure: n2_pressure,
                lts: tanks.lts,
                low_cal: tanks.low_cal,
                mid_cal: tanks.mid_cal,
                high_cal: tanks.high_cal,
                additional_notes: additionalNotes
            }
        ]
    };

    return jsonData;
}
