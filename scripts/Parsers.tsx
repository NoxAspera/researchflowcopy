/**
 * @author Megan Ostlie
 * a small interface for the tank information
 */
export interface TankInfo {
    id: string;
    value: string;
    unit: string;
    pressure: string;
}

/**
 * @author Megan Ostlie
 *  an interface for the information inside the documents
 */
export interface Entry {
    time_in: string | null;
    time_out: string | null;
    names: string | null;
    instrument: string | null;
    n2_pressure: string | null;
    lts: TankInfo | null;
    low_cal: TankInfo | null;
    mid_cal: TankInfo | null;
    high_cal: TankInfo | null;
    additional_notes: string | null;
}
/**
 * @author Megan Ostlie
 * a small inteface to contain the entire document
 * 
 */
export interface ParsedData {
    site_id: string | null;
    entries: Entry[];
}
/**
 * @author Megan Ostlie, August O'Rourke
 * @param text the document being parsed
 * 
 * @returns a ParsedData object that contains the information of the given document
 */
export function parseNotes(text: string): ParsedData {
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
    const names = nameMatch ? nameMatch[1]: null;

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
            value: tankMatch[3],
            unit: "ppm",
            pressure: tankMatch[4]
        };
    }

    // Parse additional notes
    const notesMatch = text.match(additionalNotesPattern);
    let additionalNotes = ""
    notesMatch ? notesMatch.forEach(function (value) {additionalNotes += (value + "\n- ")}) : null;

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
/**
 * @author August O'Rourke
 * 
 * This method should build a string that makes a valid entry for a document from the repository
 * @param data - the data for the new entry in the document
 */
export function buildNotes(data: Entry): string
{
    let result:string = "---\n"

    result += `- Time in: ${data.time_in}Z\n`;
    result += `- Time out: ${data.time_out}Z\n`;
    result += `- Name: ${data.names}\n`;
    if(data.instrument != null)
    {
        result += `- Instrument: ${data.instrument}\n`
    }
    if(data.n2_pressure == "")
    {
        result += `- N2: ${data.n2_pressure}\n`;
    }
    if(data.lts != null)
    {
        result += `- LTS: ${data.lts?.id} value ${data.lts?.value} ppm ${data.lts?.pressure}\n`;
    }
    result += `- Low Cal: ${data.low_cal?.id} value ${data.low_cal?.value} ${data.low_cal?.unit} ${data.low_cal?.pressure}\n`;
    result += `- Mid Cal: ${data.mid_cal?.id} value ${data.mid_cal?.value} ${data.mid_cal?.unit} ${data.mid_cal?.pressure}\n`;
    result += `- High Cal: ${data.high_cal?.id} value ${data.high_cal?.value} ${data.high_cal?.unit} ${data.high_cal?.pressure}\n`;
    if(data.additional_notes != "")
    {
        result += `- ${data.additional_notes}\n`;
    }
    return result
}
