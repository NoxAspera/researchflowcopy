import { TankRecord } from "./APIRequests";

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
 *  an interface for the information inside mobile sites
 */
export interface MobileEntry {
    time_in: string | null;
    time_out: string | null;
    names: string | null;
    instrument: string | null;
    tank: TankInfo | null;
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
    const tankPattern = /- (LTS|Low Cal|Mid Cal|High Cal|Tank): (.*?) value (.*?) ppm (\d+ psi)/g;
    const additionalNotesPattern = /- (?!Time|Name|Instrument|N2|LTS|Low cal|Mid cal|High cal)(.*)/g;

    // Parse site ID
    const siteIdMatch = text.match(siteIdPattern);
    const siteId = siteIdMatch ? siteIdMatch[1] : null;

    // Split the text into individual entries
    const entryBlocks = text.split("---\n").slice(1);
    const entries: Entry[] = entryBlocks.map((block) => {
        // Parse times
        const times: { [key: string]: string | null } = { in: null, out: null };
        const timeMatches = block.matchAll(timePattern);
        for (const match of timeMatches) {
            const timeType = match[1].toLowerCase();
            const timeValue = match[2].trim();
            if (timeType === "in") times.in = timeValue;
            if (timeType === "out") times.out = timeValue;
        }

        // Parse names
        const nameMatch = block.match(namePattern);
        const names = nameMatch ? nameMatch[1] : null;

        // Parse instrument details
        const instrumentMatch = block.match(instrumentPattern);
        const instrument = instrumentMatch ? instrumentMatch[1] : null;

        // Parse N2 pressure
        const n2Match = block.match(n2Pattern);
        const n2_pressure = n2Match ? n2Match[1] + " psi" : null;

        // Parse tank information
        const tanks: { [key: string]: TankInfo | null } = {
            lts: null,
            low_cal: null,
            mid_cal: null,
            high_cal: null,
            tank: null,
        };
        let tankMatch;
        while ((tankMatch = tankPattern.exec(block)) !== null) {
            const tankType = tankMatch[1].toLowerCase().replace(" ", "_") as keyof typeof tanks;
            tanks[tankType] = {
                id: tankMatch[2],
                value: tankMatch[3],
                unit: "ppm",
                pressure: tankMatch[4],
            };
        }

        // Parse additional notes
        const notesMatch = block.match(additionalNotesPattern);
        let additionalNotes = "";
        notesMatch ? notesMatch.forEach((value) => (additionalNotes += value + "\n- ")) : null;

        // Return the parsed entry
        return {
            time_in: times.in,
            time_out: times.out,
            names: names,
            instrument: instrument,
            n2_pressure: n2_pressure,
            lts: tanks.lts,
            low_cal: tanks.low_cal,
            mid_cal: tanks.mid_cal,
            high_cal: tanks.high_cal,
            tank: tanks.tank,
            additional_notes: additionalNotes,
        };
    });

    // Construct final parsed data
    const jsonData: ParsedData = {
        site_id: siteId,
        entries: entries,
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
    if(data.n2_pressure != null)
    {
        result += `- N2: ${data.n2_pressure} psi\n`;
    }
    if(data.lts != null)
    {
        result += `- LTS: ${data.lts?.id} value ${data.lts?.value} ppm ${data.lts?.pressure} psi\n`;
    }
    result += `- Low Cal: ${data.low_cal?.id} value ${data.low_cal?.value} ${data.low_cal?.unit} ${data.low_cal?.pressure} psi\n`;
    result += `- Mid Cal: ${data.mid_cal?.id} value ${data.mid_cal?.value} ${data.mid_cal?.unit} ${data.mid_cal?.pressure} psi\n`;
    result += `- High Cal: ${data.high_cal?.id} value ${data.high_cal?.value} ${data.high_cal?.unit} ${data.high_cal?.pressure} psi\n`;
    if(data.additional_notes != "")
    {
        result += `- ${data.additional_notes}\n`;
    }
    return result
}

/**
 * @author August O'Rourke
 * 
 * This method should build a string that makes a valid entry for a document from the repository for mobile sites
 * @param data - the data for the new entry in the document
 */
export function buildMobileNotes(data: MobileEntry): string
{
    let result:string = "---\n"

    result += `- Time in: ${data.time_in}Z\n`;
    result += `- Time out: ${data.time_out}Z\n`;
    result += `- Name: ${data.names}\n`;
    if(data.instrument != null)
    {
        result += `- Instrument: ${data.instrument}\n`
    }
    if(data.tank != null)
    {
        result += `- Tank: ${data.tank?.id} value ${data.tank?.value} ppm ${data.tank?.pressure} psi\n`;
    }
    if(data.additional_notes != "")
    {
        result += `- ${data.additional_notes}\n`;
    }
    return result
}

/**
 * @author Megan Ostlie
 * 
 * This method creates a deep copy of a TankRecord
 * @param record - a TankRecord object that will be copied
 * @returns TankRecord object
 */
export function copyTankRecord(record: TankRecord): TankRecord
{
    let newRecord: TankRecord = {
        serial: record.serial,
        ch4: record.ch4,
        ch4CalibrationFile: record.ch4CalibrationFile,
        ch4InstrumentId: record.ch4InstrumentId,
        ch4N: record.ch4N,
        ch4RelativeTo: record.ch4RelativeTo,
        ch4Stdev: record.ch4Stdev,
        ch4Sterr: record.ch4Sterr,
        co: record.co,
        co2: record.co2,
        co2CalibrationFile: record.co2CalibrationFile,
        co2InstrumentId: record.co2InstrumentId,
        co2N: record.co2N,
        co2RelativeTo: record.co2RelativeTo,
        co2Stdev: record.co2Stdev,
        co2Sterr: record.co2Sterr,
        coCalibrationFile: record.coCalibrationFile,
        coInstrumentId: record.coInstrumentId,
        coN: record.coN,
        coRelativeTo: record.coRelativeTo,
        coStdev: record.coStdev,
        coSterr: record.coSterr,
        comment: record.comment,
        d13c: record.d13c,
        d13cN: record.d13cN,
        d13cStdev: record.d13cStdev,
        d13cSterr: record.d13cSterr,
        d18o: record.d18o,
        d18oN: record.d18oN,
        d18oStdev: record.d18oStdev,
        d18oSterr: record.d18oSterr,
        location: record.location,
        ottoCalibrationFile: record.ottoCalibrationFile,
        owner: record.owner,
        pressure: record.pressure,
        tankId: record.tankId,
        updatedAt: record.updatedAt,
        userId: record.userId,
        fillId: record.fillId
    }

    return newRecord
}