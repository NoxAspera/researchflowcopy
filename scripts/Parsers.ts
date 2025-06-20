import { json } from "../jest.config";
import { TankRecord, visit } from "./APIRequests";
import { getFileContents } from "./APIRequests";

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
 * @author Megan Ostlie, Callum O'Rourke
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
        let tankMatch: any[];
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
 * @author Callum O'Rourke
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
    if(data.additional_notes.trim() != "")
    {
        result += `- ${data.additional_notes.replace(/\n/g, "\n- ")}\n`;
    }
    return result
}

/**
 * @author Callum O'Rourke
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
    if(data.additional_notes.trim() != "")
    {
        result += `- ${data.additional_notes.replace(/\n/g, "\n- ")}\n`;
    }
    return result
}

 /**
  * small function taken from https://stackoverflow.com/questions/13089306/escape-special-characters-in-a-string
  * @param str 
  * @returns 
  */
export function sanitize(str: string) {
    return str.replace(/[\b\f\n\r\t\v\0\'\"\\]/g, (match: string | number) => {
      return {
        '\b': '\\b',
        '\f': '\\f',
        '\n': '\\n',
        '\r': '\\r',
        '\t': '\\t',
        '\v': '\\v',
        '\0': '\\0',
        '\'': '\\\'',
        '\"': '\\\"',
        '\\': '\\\\'
      }[match]
    })
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
/**
 * @author  David schiwal
 * a small interface to contain list of visits
 * 
 */
export interface VisitList {
    visits: VisitInfo[];
}
/**
 * @author David Schiwal
 * a small interface for the visit
 */
export interface VisitInfo {
    date: string | null;
    equipment: string | null;
    name: string | null;
    notes: string | null;
    site: string | null;
}
/**
 * @author David Schiwal, Megan Ostlie, Callum O'Rourke
 * @param text the document being parsed
 * 
 * @returns a VisitList object that contains the visits from the visit document
 */
export function parseVisits(text: string): VisitList{    
    //const visitPattern = /- {(.*?)}/;
    const datePattern = /{"date":"(.*?)",/;
    const equipmentPattern = /"equipment":"(.*?)",/;
    const namePattern = /"name":"(.*?)",/;
    const notesPattern = /"notes":"(.*?)"}/;
    const sitePattern = /"site":"(.*?)",/;
    const visitBlocks = text.split("\n");
    const visits: VisitInfo[] = visitBlocks.map((block) => {
        // Parse date
        const dateMatch = block.match(datePattern);
        const date = dateMatch ? dateMatch[1] : null;
        // Parse name
        const nameMatch = block.match(namePattern);
        const name = nameMatch ? nameMatch[1] : null;
        // Parse site
        const siteMatch = block.match(sitePattern);
        const site = siteMatch ? siteMatch[1] : null;
        // Parse equipment
        const equipmentMatch = block.match(equipmentPattern);
        const equipment = equipmentMatch ? equipmentMatch[1] : null;
        // Parse notes
        const notesMatch = block.match(notesPattern);
        const notes = notesMatch ? notesMatch[1] : null;
        if(date != null){
            return{
                date: date,
                equipment: equipment,
                name: name,
                notes: notes,
                site: site,
            };
        }
    });
    // Construct final parsed data
    const jsonData: VisitList = {
        visits: visits,
    };
    return jsonData;
}

function formDate(dateString: string)
{
    let strings = dateString.split(" ")
    let month = strings[0]
    let day = strings[1]
    let year = strings[2]

    switch(month)
    {
        case "Jan":
            month = "01"
            break
        case "Feb":
            month = "02"
            break
        case "Mar":
            month = "03"
            break
        case "Apr":
            month = "04"
            break
        case "May":
            month = "05"
            break
        case "Jun":
            month = "06"
            break
        case "Jul":
            month = "07"
            break
        case "Aug":
            month = "08"
            break
        case "Sep":
            month = "09"
            break
        case "Oct":
            month = "10"
            break
        case "Nov":
            month = "11"
            break
        case "Dec":
            month = "12"
            break
    }
    return `${year}-${month}-${day}`
}

export function processVisits(jsonString: string)
{
    let result: visit[] = []
    jsonString.split("\n").forEach((value) => {
        if (value === "")
        {
            return
        }
        let date = formDate(value.substring(value.indexOf("date\":\"")+11,value.indexOf("\",\"")))
        let temp = value.substring(value.indexOf("\",\"") + 3)
        let name = temp.substring(7, temp.indexOf("\",\""))
        temp = temp.substring(temp.indexOf("\",\"")+3)
        let site = temp.substring(7,temp.indexOf("\",\""))
        temp = temp.substring(temp.indexOf("\",\"")+3)
        let equipment = temp.substring(12,temp.indexOf("\",\"") )
        temp = temp.substring(temp.indexOf("\",\""))
        let note = temp.substring(11, temp.length -2)
        let visit: visit = {date: date, name: name, site: site, equipment: equipment, notes: note }
        result.push(visit)
    })
    return result
}

/**
 * @author Megan Ostlie
 *  a function that pulls the current note document for the specified site from GitHub
 *  @param siteName the name of the site
 * 
 * @returns a ParsedData object that contains the information of the given document
 */
export async function processNotes(siteName: string) {
    const fileContents = await getFileContents(`site_notes/${siteName}`);
    if(fileContents.data){
      return parseNotes(fileContents.data)
    }
    else
    {
      return null
    }
  }

/**
 * 
 * @param time 
 * @param name 
 * @param site 
 * @returns 
 */
export function installedInstrumentNotes(time: string, name: string, site: string): string {
    let result: string = `- Time in: ${time}\n`;

    result += `- Name: ${sanitize(name)}\n`;
    result += `- Notes: Installed at ${site}\n`;
    result += "---\n";

    return result;
}

/**
 * 
 * @param time 
 * @param name 
 * @param site 
 * @returns 
 */
export function removedInstrumentNotes(time: string, name: string, site: string): string {
    let result: string = `- Time in: ${time}\n`;

    result += `- Name: ${sanitize(name)}\n`;
    result += `- Notes: Removed from ${site}\n`;
    result += "---\n";

    return result;
}

export function buildInstrumentNotes(startDate, name, notes): string {
    const time = new Date(startDate);
    const year = time.getFullYear().toString()
    const month = (time.getMonth() + 1).toString() // now.getMonth() is zero-base (i.e. January is 0), likely due to something with Oracle's implementation - Callum
    const day = time.getDate().toString()
    const hours= time.getHours().toString()
    const minutes = time.getMinutes().toString()

    let result: string = `- Time in: ${year}-${month}-${day} ${hours}:${minutes}Z\n`;

    result += `- Name: ${sanitize(name)}\n`;
    result += `- Notes: ${sanitize(notes)}\n`;
    result += "---\n";

    return result;
  };

// Function to format the date
function formatDate(date: Date | null): string {
    return date ? date.toISOString().split("T")[0] : "";
};

/**
 * 
 * @param startDate 
 * @param endDate 
 * @param oldID 
 * @param newID 
 * @param name 
 * @param reason 
 * @param fromAddNotes 
 * @returns 
 */
export function buildBadDataString(startDate: Date, endDate: Date, oldID: string, newID: string, name: string, reason: string, fromAddNotes: boolean): string {
    const startTime = startDate.toISOString().split(".")[0] + "Z";
    const endTime = endDate.toISOString().split(".")[0] + "Z";
    const currentTime = new Date().toISOString().split(".")[0] + "Z";

    if (fromAddNotes) {
        var result: string = `${startTime},${endTime},${oldID},${newID},${currentTime},${sanitize(name)},${sanitize(reason)}`;
    }
    else {
        var result: string = `${formatDate(startDate)}T${startTime},${formatDate(endDate)}T${endTime},${oldID},${newID},${currentTime},${sanitize(name)},${sanitize(reason)}`;
    }

    console.log("done")
    return result;
}