import csv from 'csvtojson';
import * as FileSystem from 'expo-file-system'
import * as Network from 'expo-network'
import { parseNotes, parseVisits, VisitList } from './Parsers';

/**
 * @author August O'Rourke
 * small interface to wrap the getSites response
 */
export interface siteResponse
{
    download_url: string
    git_url: string
    name: string
}

/**
 *  This method is for building a tank record string from a given entry
 * @author Megan Ostlie
 * @param record the tank record we are building a string of
 * @returns the resulting string
 */
export function buildTankRecordString( record: TankRecord)
{
    let newLine = `${record.fillId},${record.serial},${record.updatedAt},${record.pressure},${record.location},${record.owner},${record.co2},${record.co2Stdev},${record.co2Sterr},${record.co2N},${record.ch4},${record.ch4Stdev},${record.ch4Sterr},${record.ch4N},${record.co},${record.coStdev},${record.coSterr},${record.coN},${record.d13c},${record.d13cStdev},${record.d13cSterr},${record.d13cN},${record.d18o},${record.d18oStdev},${record.d18oSterr},${record.d18oN},"${record.co2RelativeTo}","${record.comment}",${record.userId},${record.co2InstrumentId},${record.ch4InstrumentId},${record.coInstrumentId},"${record.ottoCalibrationFile}","${record.co2CalibrationFile}","${record.ch4RelativeTo}","${record.ch4CalibrationFile}","${record.coRelativeTo}","${record.coCalibrationFile}",${record.tankId}\n`
    newLine.replaceAll("undefined", "");

    return newLine;
}

/**
 * This interface is taken from this public repository https://github.com/benfasoli/tank-tracker,
*/
export interface TankRecord {
    updatedAt: string;
    serial: string;
    tankId: string;
    fillId: string;
    userId: string;
    pressure: number;
    location: string;
    owner: string;
    co2?: number;
    co2Stdev?: number;
    co2Sterr?: number;
    co2N?: number;
    co2RelativeTo?: string;
    co2CalibrationFile?: string;
    co2InstrumentId?: string;
    ch4?: number;
    ch4Stdev?: number;
    ch4Sterr?: number;
    ch4N?: number;
    ch4RelativeTo?: string;
    ch4CalibrationFile?: string;
    ch4InstrumentId?: string;
    co?: number;
    coStdev?: number;
    coSterr?: number;
    coN?: number;
    coRelativeTo?: string;
    coCalibrationFile?: string;
    coInstrumentId?: string;
    d13c?: number;
    d13cStdev?: number;
    d13cSterr?: number;
    d13cN?: number;
    d18o?: number;
    d18oStdev?: number;
    d18oSterr?: number;
    d18oN?: number;
    ottoCalibrationFile?: string;
    comment?: string;
  };

export interface visit
{
    date: string,
    name: string,
    site: string,
    equipment: string,
    notes: string,
}

let githubToken: string | null = null;

let tankDict: Map<string, TankRecord[]>;

let tankTrackerSha = ""
/**
 * Typescript doesn't have a built in sleep function, so this function does that for us. This code was "generated" by Google Gemini
 * @param ms the milliseconds you want to sleep for
 * @returns void
 */
export const sleep = async (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

/**
 * @author August O'Rourke, Megan Ostlie
 * This function reads updates that were input during the offline mode. Every request made is followed by a 50 ms sleep, this is becaus the github
 * api can error when requests are made too frequently.
 */
export async function readUpdates()
{   
    //this block reads and updates visits
    if((await FileSystem.getInfoAsync(FileSystem.documentDirectory + "offline_updates/visitfile.txt")).exists)
    {
        let visits: VisitList = parseVisits(await FileSystem.readAsStringAsync(FileSystem.documentDirectory + "offline_updates/visitfile.txt"))
        await setVisitFileOffline(visits)
        FileSystem.deleteAsync(FileSystem.documentDirectory + "offline_updates/visitfile.txt")
        await sleep(50)
    }
    //this block reads and updates bad data
    if((await FileSystem.getInfoAsync(FileSystem.documentDirectory + "offline_updates/baddata.txt")).exists)
    {
        let bad_data_entries = (await FileSystem.readAsStringAsync(FileSystem.documentDirectory + "offline_updates/baddata.txt")).split("\n")

        for (let value of bad_data_entries){
            let site = value.substring(value.indexOf(": \"") + 2 , value.indexOf(", \""))
            value = value.substring(value.indexOf(", \"") + 2)
            let instrument =  value.substring(value.indexOf(": \"") + 2 , value.indexOf(", \""))
            value = value.substring(value.indexOf(", \"") + 2)
            let newEntry = value.substring(value.indexOf(": \"") + 2).slice(0, -1)

            await setBadData(site, instrument, newEntry, "updating from offline")
            await sleep(50)
            
        }
        FileSystem.deleteAsync(FileSystem.documentDirectory + "offline_updates/baddata.txt")
        
    }
    //this block reads and updates instrument maintance
    if((await FileSystem.getInfoAsync(FileSystem.documentDirectory + "offline_updates/instrument_maint.txt")).exists)
    {
        let instrument_maintence_entries = (await FileSystem.readAsStringAsync(FileSystem.documentDirectory + "offline_updates/instrument_maint.txt")).split("}\n")

        for (let value of instrument_maintence_entries){
            if(value !== ""){
                let path = value.substring(value.indexOf(": \"") + 2 , value.indexOf(", \""))
                value = value.substring(value.indexOf(", \"") + 2)
                let content =  value.substring(value.indexOf("content: \"") + 8 , value.indexOf("\", mobile:"))
                value = value.substring(value.indexOf(", ") + 2)
                let needsSite =(value.substring(value.indexOf(": \"") + 2 , value.indexOf(", \"")) === "true")
                value = value.substring(value.indexOf(", \"") + 2)
                let site = value.substring(value.indexOf(": \"") + 2)
                await setInstrumentFile(path,content,"updating from offline", needsSite, site)
                await sleep(50)
            }
            
        }
        FileSystem.deleteAsync(FileSystem.documentDirectory + "offline_updates/instrument_maint.txt")
    }
    //this block updates the site_notes file, as well as generates some additional updates to instrument_maintence and tank tracker based on what is in the site file
    let tankRecordString = "";
    if((await FileSystem.getInfoAsync(FileSystem.documentDirectory + "offline_updates/site_notes.txt")).exists)
        {
                let site_notes_entries = (await FileSystem.readAsStringAsync(FileSystem.documentDirectory + "offline_updates/site_notes.txt")).split("}\n")
                for(let value of site_notes_entries){
                    if(value !== "")
                    {
                        let siteName = value.substring(value.indexOf(": \"") + 2 , value.indexOf(", \""))
                        value = value.substring(value.indexOf(", \"") + 2)
                        let content =  value.substring(value.indexOf("content: \"") + 8)
                        let data = (await getFileContents(`site_notes/${siteName}`)).data
                        
                        await setSiteFile(siteName, content, "updating from offline")
                        await sleep(50)
                        let notes = parseNotes(content).entries[0]
                        await sleep(50)
                        //if there are previous notes...
                        if(data)
                        {
                            let previousNotes = parseNotes(data).entries[0]
                            //and the instrument doesn't match the last one, create an entry for the previous instrument
                            if(previousNotes.instrument !== notes.instrument)
                            {
                                let newNotes: string = `- Time in: ${notes.time_in}\n`;
  
                                newNotes += `- Name: ${notes.names}\n`;
                                newNotes += `- Notes: Removed from ${siteName}\n`;
                                newNotes += "---\n";
                                
                                await setInstrumentFile(`instrument_maint/LGR_UGGA/${previousNotes.instrument}`,content,"updating from offline", true, siteName)
                            }
                            //and if one of thanks has changed, create an entry for the previous tank
                            if(previousNotes.lts && notes.lts && previousNotes.lts.id !== notes.lts.id)
                            {
                                let newTankEntry = getLatestTankEntry(previousNotes.lts.id)
                                newTankEntry.location = "ASB279";
                                newTankEntry.pressure = 500;
                                newTankEntry.userId = previousNotes.names;
                                newTankEntry.updatedAt = previousNotes.time_out;
                                addEntrytoTankDictionary(newTankEntry);
                                tankRecordString += buildTankRecordString(newTankEntry);
                            }
                            if(previousNotes.mid_cal.id !== notes.mid_cal.id)
                            {
                                let newTankEntry = getLatestTankEntry(previousNotes.mid_cal.id)
                                newTankEntry.location = "ASB279";
                                newTankEntry.pressure = 500;
                                newTankEntry.userId = previousNotes.names;
                                newTankEntry.updatedAt = previousNotes.time_out;
                                addEntrytoTankDictionary(newTankEntry);
                                tankRecordString += buildTankRecordString(newTankEntry);
                            }
                            if(previousNotes.low_cal.id !== notes.low_cal.id)
                            {
                                let newTankEntry = getLatestTankEntry(previousNotes.low_cal.id)
                                newTankEntry.location = "ASB279";
                                newTankEntry.pressure = 500;
                                newTankEntry.userId = previousNotes.names;
                                newTankEntry.updatedAt = previousNotes.time_out;
                                addEntrytoTankDictionary(newTankEntry);
                                tankRecordString += buildTankRecordString(newTankEntry);
                            }

                            if(previousNotes.high_cal.id !== notes.high_cal.id)
                            {
                                let newTankEntry = getLatestTankEntry(previousNotes.high_cal.id)
                                newTankEntry.location = "ASB279";
                                newTankEntry.pressure = 500;
                                newTankEntry.userId = previousNotes.names;
                                newTankEntry.updatedAt = previousNotes.time_out;
                                addEntrytoTankDictionary(newTankEntry);
                                tankRecordString += buildTankRecordString(newTankEntry);
                            }

                        }
                    }
                    await sleep(50)
                }
                FileSystem.deleteAsync(FileSystem.documentDirectory + "offline_updates/site_notes.txt")
                await sleep(50)
        }

        //this block updates the tank tracker 
    if((await FileSystem.getInfoAsync(FileSystem.documentDirectory + "offline_updates/tank_updates.txt")).exists)
    {
            let tank_update_entries = (await FileSystem.readAsStringAsync(FileSystem.documentDirectory + "offline_updates/tank_updates.txt")).split("\n")
            tank_update_entries.forEach(async (value) => {
                if(value !== ""){
                    let tankId = value.substring(value.indexOf(": \"") + 2 , value.indexOf(", \""))
                    value = value.substring(value.indexOf(", \"") + 2)
                    let pressure =  parseInt(value.substring(value.indexOf(": \"") + 2 , value.indexOf(", \"")))
                    value = value.substring(value.indexOf(", \"") + 2)
                    let site =value.substring(value.indexOf(": \"") + 2 , value.indexOf(", \""))
                    value = value.substring(value.indexOf(", \"") + 2)
                    let time = value.substring(value.indexOf(": \"") + 2, value.indexOf(", \""))
                    value = value.substring(value.indexOf(", \"") + 2)
                    let name = value.substring(value.indexOf(": \"") + 2).slice(0, -1)

                    let previousRecord: TankRecord = getLatestTankEntry(tankId)

                    previousRecord.pressure = pressure
                    previousRecord.location = site
                    previousRecord.updatedAt = time
                    previousRecord.userId = name

                    if(co2)
                    {
                        previousRecord.co2 = co2
                        previousRecord.ch4 = ch4
                        previousRecord.comment = comment
                        previousRecord.fillId = fillId
                    }
                    
                    addEntrytoTankDictionary(previousRecord)
                    tankRecordString += buildTankRecordString(previousRecord);

                }
                
            })
            FileSystem.deleteAsync(FileSystem.documentDirectory + "offline_updates/tank_updates.txt")
    }
    if (tankRecordString != "") {
        await setTankTracker(tankRecordString);
    } 
}

/**
 * @author August O'Rourke
 * This is a helper function that facilitates offline updates for the visits
 * @param visits - the visits entered from the offline mode
 * @returns 
 */
async function setVisitFileOffline(visits: VisitList)
{
    const pullResponse = (await getFile(`researchflow_data/visits`))
        let existingContent = ""
        let hash = ""
        
        if(pullResponse.success)
        {
            hash = pullResponse.data.sha
            existingContent = atob(pullResponse.data.content)       
        }
        visits.visits.forEach((value) => 
        {
            if(value != undefined)
            {
                existingContent += `{"date":"${value.date}","name":"${value.name}","site":"${value.site}","equipment":"${value.equipment}","notes":"${value.notes}"}\n`
            }
        })    
        let fullDoc = btoa(existingContent)
        const url = `https://api.github.com/repos/Mostlie/CS_4000_mock_docs/contents/researchflow_data/visits.md`;
        let bodyString = `{"message":"updating from offline","content":"${fullDoc}"`
        if (hash!== "")
        {
            bodyString+= `,"sha":"${hash}"}`
        }
        else
        {
            bodyString += '}'
        }
        return setFile(bodyString, url)
}

/**
 * @author August O'Rourke
 * This function starts the tank Dictionary when the app is offline
 */
export async function tankTrackerOffline()
{
    let string = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + "tank_tracker/names")
    let names = string.split("\n")
    tankDict = new Map()
    names.forEach(element => {
        tankDict.set(element, undefined)
    })
}

/**
 * @author August O'Rourke
 * This function starts the process of placing a file structure the offline mode can understand, uses the loop method recursively
 */
export async function updateDirectories()
{
    let response = (await getDirectory(""))
    if(response.success)
    {
        response.data.forEach(element => {
            loop(`${element}`)
        });
    }
    loop("site_notes/mobile")
    let list = getTankList()
    let names = ""
    list.forEach(value => {
        names += (value + "\n")
    })
    await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "tank_tracker/names", names)

    FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "bad_data")
    response = await getBadDataSites()
    let entries = response.data
    entries.forEach(element => {
        loop(`bad_data/${element}`)
    });

    let result = await FileSystem.getInfoAsync(FileSystem.documentDirectory + "offline_updates")

    if(!result.exists)
    {
        FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "offline_updates")
    }
}
   
/**
 * This is a helper function for saving the directories required for offline navigation
 * @param path -the file path to create
 */
async function loop(path: string)
{
    FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + path)
    let response = (await getDirectory(path))
    if(response.success)
    {
        response.data.forEach(element => {
            loop(path + `/${element}`)
        });
    }
}

/**
 * 
 * @author August O'Rourke
 *  This is a small helper method to facilitate changing files on the git repository
 * @param bodyString - The string containing the body of the put request
 * @param url - The api enpoint's URL
 * @returns A json object containing a success field, and the response sent back, or an error message
 */
async function setFile(bodyString: string, url: string)
{
    const headers = new Headers();
    headers.append("User-Agent", "ResearchFlow");
    headers.append("Accept", "application/vnd.github+json");
    headers.append("Authorization", `Bearer ${githubToken}`);
    headers.append("X-GitHub-Api-Version", "2022-11-28");

    const requestOptions: RequestInfo = new Request(url, 
        {
            method: "PUT",
            headers: headers,
            body: bodyString,
            redirect: "follow"
        }
    )
    
    try {
        const response = await fetch(requestOptions);
        if (response.ok) {
            const data = await response.json();
            return { success: true, data };
        } else {
            const errorData = await response.json();
            return { success: false, error: errorData.message };
        }
    } catch (error) {
        return { success: false, error: error };
    }
    
}

/**
 * This method sets the plan a visit file
 * @param visit - the visit we are uploading
 * @param commitMessage - a commit message for this change
 * @returns A json object containing a success field, and the response sent back, or an error message
 */
export async function setVisitFile(visit: visit, commitMessage: string)
{
    let check = await Network.getNetworkStateAsync()

    if (check.isConnected)
    {
        const pullResponse = (await getFile(`researchflow_data/visits`))
        let existingContent = ""
        let hash = ""
        
        if(pullResponse.success)
        {
            hash = pullResponse.data.sha
            existingContent = atob(pullResponse.data.content)       
        }
        const fullDoc = btoa(existingContent + `{"date":"${visit.date}","name":"${visit.name}","site":"${visit.site}","equipment":"${visit.equipment}","notes":"${visit.notes}"}\n`)

        const url = `https://api.github.com/repos/Mostlie/CS_4000_mock_docs/contents/researchflow_data/visits.md`;
        let bodyString = `{"message":"${commitMessage}","content":"${fullDoc}"`
        if (hash!== "")
        {
            bodyString+= `,"sha":"${hash}"}`
        }
        else
        {
            bodyString += '}'
        }
        return setFile(bodyString, url)
    }
    else
    {
        try
        {
            let path = FileSystem.documentDirectory + "offline_updates/visitfile.txt"
            let exists = (await FileSystem.getInfoAsync(path)).exists
            let content = ""
            if(exists)
            {
                content = await FileSystem.readAsStringAsync(path)
            }
            else
            {
                
            }
            content += `{"date:"${visit.date}","name":"${visit.name}","site":"${visit.site}","equipment":"${visit.equipment}","notes":"${visit.notes}"}\n`
            let result = await FileSystem.writeAsStringAsync(path, content, {})
            if(await FileSystem.readAsStringAsync(path) === content)
            {
                return {success: true}  
            }
            else
            {
                return {success: false, error: "unable to write file"}
            }
        }
        catch(error)
        {
            return{success: false, error: error}
        }
    }   
}

export async function offlineTankEntry(tankID: string, pressure: number, site: string, time:string, name:string, co2?: number, ch4?: number, comment?: string, fillId?: string)
/**
 * This function adds an update for the specified tank while offline
 * @author August O'Rourke
 * @param tankID -the tanks id
 * @param pressure - the tanks pressure
 * @param site - the tanks site
 * @param time  - the time the record was created
 * @param name - who created the record
 * @returns void
 */
export async function offlineTankEntry(tankID: string, pressure: number, site: string, time:string, name:string)
{
    console.log("called")
    try {
        let path = FileSystem.documentDirectory + "offline_updates/tank_updates.txt"

        let content = ""
        if ((await FileSystem.getInfoAsync(path)).exists)
        {
            content += await FileSystem.readAsStringAsync(path)
        }

        content += `{tankId: ${tankID}, pressure: ${pressure}, site: ${site}, time: ${time}, name: ${name}`

        if(co2 && ch4 && comment)
        {
            content += `, co2: ${co2}, ch4: ${ch4}, comment: ${comment}, fillId: ${fillId}`
        }
        content += "}\n"
        console.log(content)
        await FileSystem.writeAsStringAsync(path, content)

        return {success: true}
    }  
    catch(error)
    {
        return {success: true, error: error}
    } 
}

/**
 * Sets the GitHub token for subsequent API requests.
 * @param token The personal access token from the login screen.
 */
export function setGithubToken(token: string) {
    githubToken = token;
}

/**
 * This method adds a new entry to the tank Dictionary
 * @author August O'Rourke
 * @param newEntry 
 */
export function addEntrytoTankDictionary(newEntry: TankRecord) {
    let tankEntries = tankDict.get(newEntry.tankId);
    if (tankEntries == undefined)
    {
        tankDict.set(newEntry.tankId, [newEntry])
    }
    else
    {
        tankEntries.push(newEntry);
        tankDict.set(newEntry.tankId, tankEntries);
    }
}

/**
 * This method updates the tank tracker csv on the repo
 * @author August O'Rourke
 * @param newEntry the new entry to be added to the tank tracker csv
 * @returns a resopnse containing whether or not adding was successful, and the response data
 */
export async function setTankTracker(newEntry: string)
{
    if((await Network.getNetworkStateAsync()).isConnected)
    {
        const url = `https://api.github.com/repos/Mostlie/CS_4000_mock_docs/contents/tank_tracker/tank_db.csv`;

    let headers = new Headers();
    headers.append("User-Agent", "ResearchFlow");
    headers.append("Accept", "application/vnd.github+json");
    headers.append("Authorization", `Bearer ${githubToken}`);
    headers.append("X-GitHub-Api-Version", "2022-11-28");

    let requestOptions: RequestInfo = new Request(url, 
        {
            method: "GET",
            headers: headers,
            redirect: "follow"
        }
    )
    let newFile = ""
    let sha = ""
    try {
        const response = await fetch(requestOptions);
        if (response.ok) {
            const data = await response.json();
            let plainContent = atob(data.content);
            let entries = plainContent.substring(plainContent.indexOf("\n"))
            let headers = plainContent.substring(0, plainContent.indexOf("\n"))
            sha = data.sha
            newFile = headers + entries + newEntry
            newFile = btoa(newFile)
            const bodyString = `{"message":"updating from research flow","content":"${newFile}","sha":"${sha}"}`
            return setFile(bodyString, url)
        } 
        else {
            const errorData = await response.json();
            return { success: false, error: errorData.message };
        }
    } 
    catch (error) 
    {
        return { success: false, error: error };
    }
    }
    else
    {
       return {success: true}
    }   
}
/**
 * This method returns a list of Tank Entries for a specific tank 
 * @author August O'Rourke
 * @param key - the tank we are trying to get a list for
 * @returns an array of Tank Record Objects
 */
export function getTankEntries(key:string)
{
    return tankDict.get(key)
}
/**
 * This method retrieves the latest entry of a specific tank from the dictionary
 * @author Megan Ostlie
 * @param key - the tank Id
 * @returns The latest Tank Entry
 */
export function getLatestTankEntry(key:string): TankRecord | undefined {
    let entries = getTankEntries(key);
    if (entries) {
        return entries.reduce((latest, current) => {
            return new Date(current.updatedAt) > new Date(latest.updatedAt) ? current : latest;
          });
    }
}
    
/**
 * This method returns a list of TankId's in the csv 
 * @author August O'Rourke
 * @returns a string list of all the unique tank ID's in the csv
 */
export function getTankList()
{   
    return Array.from(tankDict.keys())
}
/**
 * @author August O'Rourke, Megan Ostlie
 * This method prepares the code to run other various methods relating to the tank tracker, it needs to be called during the main menu, after authorization has already occured
 * 
 * @returns a success response, it probably isn't needed though 
 */
export async function tankTrackerSpinUp()
{
    tankDict= new Map()
    const url = `https://api.github.com/repos/Mostlie/CS_4000_mock_docs/contents/tank_tracker/tank_db.csv`;

    const headers = new Headers();
    headers.append("User-Agent", "ResearchFlow");
    headers.append("Accept", "application/vnd.github+json");
    headers.append("Authorization", `Bearer ${githubToken}`);
    headers.append("X-GitHub-Api-Version", "2022-11-28");

    const requestOptions: RequestInfo = new Request(url, 
        {
            method: "GET",
            headers: headers,
            redirect: "follow"
        }
    )
    try {
        let response = await fetch(requestOptions);
        if (response.ok) {
            let data = await response.json();
            tankTrackerSha = data.sha

            if(data._links)
                {
                   let url = `https://api.github.com/repos/Mostlie/CS_4000_mock_docs/git/blobs/${tankTrackerSha}`
                   const requestOptions: RequestInfo = new Request(url, 
                    {
                        method: "GET",
                        headers: headers,
                        redirect: "follow"
                    })
    
                    response = await fetch(requestOptions)
                    data = await response.json();
                
                }
            // Decode base64 content
            let decodedContent = atob(data.content);
            // Remove UTF-8 BOM if it exists (0xEF, 0xBB, 0xBF)
            if (decodedContent.charCodeAt(0) === 0xEF && decodedContent.charCodeAt(1) === 0xBB && decodedContent.charCodeAt(2) === 0xBF) {
                // Remove the BOM (first 3 characters)
                decodedContent = decodedContent.slice(3);
            }
            let tankData = await csv().fromString(decodedContent);
            let id_array: string[] =[]
            
            tankData.forEach(value => 
                {
                    let temp: TankRecord[] | undefined = []
                    if(tankDict?.has(value.tankId))
                    {
                       temp =  tankDict.get(value.tankId)
                    } 

                    temp?.push(value)
                    tankDict?.set(value.tankId, temp ? temp: [])
                })

            return {success: true}
        } else {
            return {success: false, status: response.status, message: response.statusText}
        }
    } catch (error) {
        return {sucess: false, error: error}
    }
}
/**
 * @author August O'Rourke, Megan Ostlie
 * This method returns all the sites in the Bad Data folder
 * @returns A json object containing a success field, and the response sent back, or an error message
 */
export async function getBadDataSites()
{
    let check = await Network.getNetworkStateAsync()

    if(!check.isConnected)
        {
           return {success: true, data: await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "bad_data")}
        }

    const url = `https://api.github.com/repos/Mostlie/CS_4000_mock_data-pipeline/contents/bad`;

    let headers = new Headers();
    headers.append("User-Agent", "ResearchFlow");
    headers.append("Accept", "application/vnd.github+json");
    headers.append("Authorization", `Bearer ${githubToken}`);
    headers.append("X-GitHub-Api-Version", "2022-11-28");

    let requestOptions: RequestInfo = new Request(url, 
        {
            method: "GET",
            headers: headers,
            redirect: "follow"
        }
    )
    try {
        const response = await fetch(requestOptions);
        if (response.ok) {
            const data = await response.json();
            // Extract all folder names from the response
            const folderNames = data
                .filter((item: any) => item.type === "dir") // Ensure only directories are included
                .map((item: any) => item.name); // Map to the "name" property

            return {success:true, data:folderNames};
        } 
        else {
            const errorData = await response.json();
            return { success: false, error: errorData.message };
        }
    } 
    catch (error) 
    {
        return { success: false, error: error };
    }
}
/**
 * @author August O'Rourke, Megan Ostlie
 * This method gets bad data files fromt the bad data repository
 * @param siteName - the name of the site we are getting the data from
 * @returns A json object containing a success field, and the response sent back, or an error message
 */
export async function getBadDataFiles(siteName: string)
{
    const url = `https://api.github.com/repos/Mostlie/CS_4000_mock_data-pipeline/contents/bad/${siteName}`;

    let headers = new Headers();
    headers.append("User-Agent", "ResearchFlow");
    headers.append("Accept", "application/vnd.github+json");
    headers.append("Authorization", `Bearer ${githubToken}`);
    headers.append("X-GitHub-Api-Version", "2022-11-28");

    let requestOptions: RequestInfo = new Request(url, 
        {
            method: "GET",
            headers: headers,
            redirect: "follow"
        }
    )
    try {
        const response = await fetch(requestOptions);
        if (response.ok) {
            const data: siteResponse[] = await response.json();
            
            const csvFiles = data
                .filter(item => item.name.endsWith(".csv"))
                .map(item => item.name.replace(/\.csv$/, ""));

            return {success:true, data:csvFiles};
        } 
        else {
            const errorData = await response.json();
            return { success: false, error: errorData.message };
        }
    } 
    catch (error) 
    {
        return { success: false, error: error };
    }
}
/**
 * @author - August O'Rourke 
 * This method sets a Bad Data file
 * @param siteName The site name the data is from 
 * @param instrument The instrument the data is collected from
 * @param newEntry The new entry in the bad data file
 * @param commitMessage the commit message for github
 * @returns A json object containing a success field, and the response sent back, or an error message
 */
export async function setBadData(siteName: string, instrument: string, newEntry: string, commitMessage: string)
{
    siteName = siteName.toLowerCase();

    if((await Network.getNetworkStateAsync()).isConnected)
    {
        const url = `https://api.github.com/repos/Mostlie/CS_4000_mock_data-pipeline/contents/bad/${siteName}/${instrument}.csv`;

        let headers = new Headers();
        headers.append("User-Agent", "ResearchFlow");
        headers.append("Accept", "application/vnd.github+json");
        headers.append("Authorization", `Bearer ${githubToken}`);
        headers.append("X-GitHub-Api-Version", "2022-11-28");

        let requestOptions: RequestInfo = new Request(url, 
            {
                method: "GET",
                headers: headers,
                redirect: "follow"
            }
        )
        let newFile = ""
        let sha = ""
        try {
            const response = await fetch(requestOptions);
            if (response.ok) {
                const data = await response.json();
                let plainContent = atob(data.content);
                let entries = plainContent.substring(plainContent.indexOf("\n"))
                let headers = plainContent.substring(0, plainContent.indexOf("\n"))
                sha = data.sha
                newFile = headers + entries + '\n' + newEntry
                newFile = btoa(newFile)
                const bodyString = `{"message":"${commitMessage}","content":"${newFile}","sha":"${sha}"}`
                return setFile(bodyString, url)
            } 
            else {
                const errorData = await response.json();
                return { success: false, error: errorData.message };
            }
        } 
        catch (error) 
        {
            return { success: false, error: error };
        }
    }

    else
    {
        try
        {
            let path = FileSystem.documentDirectory + "offline_updates/baddata.txt"
            let exists = (await FileSystem.getInfoAsync(path)).exists
            let content = ""
            if(exists)
            {
                content = await FileSystem.readAsStringAsync(path)
            }
            else
            {
                
            }
            content += `{siteName: \"${siteName}\", instrument: \"${instrument}\", newEntry: \"${newEntry}\"}\n`
            let result = await FileSystem.writeAsStringAsync(path, content, {})
            if(await FileSystem.readAsStringAsync(path) === content)
            {
                return {success: true}  
            }
            else
            {
                return {success: false, error: "unable to write file"}
            }
        }
        catch(error)
        {
            return{success: false, error: error}
        }
    }  
}
/**
 * This method gets the site of the Instrument specified
 * @author Megan Ostlie
 * @param path the instrument specified
 * @returns A json object containing a success field, and the response sent back, or an error message
 */
export async function getInstrumentSite(path: string) {
    const pullResponse = (await getFile(path))
    if(pullResponse.error)
    {
        return {success: false, error: pullResponse.error}
    }
    const existingContent = atob(pullResponse.data.content)
    const match = existingContent.match(/Currently at (.*)/);
    return { success: true, data: match ? match[1] : null };
}

/**
 * @author August O'Rourke
 * This method sets an instrument file in the repository for instrument maintence
 * @param path the path of the instrument file
 * @param content the content we are going to append to the exitsting file
 * @param commitMessage the commit message that will go on gitHub
 * @param mobile, wheter or not the site is a mobile site.
 * @param site, the site of the instrument file
 * @returns the contents of the file as a string
 */
export async function setInstrumentFile(path: string, content: string, commitMessage: string, mobile:boolean, site?: string) {

    if( (await Network.getNetworkStateAsync()).isConnected){

        const pullResponse = (await getFile(path))
        if(pullResponse.error)
        {
            return {success: false, error: pullResponse.error}
        }
        const hash = pullResponse.data.sha
        const existingContent = atob(pullResponse.data.content)
        const maintenanceHeader = `Maintenance Log\n---`
        let staticHeader = existingContent.substring(0,existingContent.indexOf(maintenanceHeader) + maintenanceHeader.length)
        if(mobile && site)
        {
            let staticHeaderNoLocation  = staticHeader.substring(0, staticHeader.indexOf("---\nCurrently at"))
            let locationHeader = `---\nCurrently at ${site}\n` + '---\n' + maintenanceHeader
            staticHeader = staticHeaderNoLocation + locationHeader
        }
        const existingNotes = existingContent.substring(existingContent.indexOf(maintenanceHeader) + maintenanceHeader.length) 
        const fullDoc = btoa(staticHeader +"\n" + content + existingNotes)

        const url = `https://api.github.com/repos/Mostlie/CS_4000_mock_docs/contents/${path}.md`;
        const bodyString = `{"message":"${commitMessage}","content":"${fullDoc}","sha":"${hash}"}`
        return setFile(bodyString, url)
    }
    else
    {
        try
        {
            let filePath = FileSystem.documentDirectory + "offline_updates/instrument_maint.txt"
            let exists = (await FileSystem.getInfoAsync(filePath)).exists
            let newContent = ""
            if(exists)
            {
                newContent = await FileSystem.readAsStringAsync(filePath)
            }
            newContent += `{path: \"${path}\", content: \"${content}\", mobile: \"${mobile}}\"\n`
            if(site)
            {
                newContent = newContent.substring(0, newContent.length - 2)
                newContent += `, site: \"${site}\"}\n`
            }

            let result = await FileSystem.writeAsStringAsync(filePath, newContent, {})
            if(await FileSystem.readAsStringAsync(filePath) === newContent)
            {
                return {success: true}  
            }
            else
            {
                return {success: false, error: "unable to write file"}
            }
        }
        catch(error)
        {
            return{success: false, error: error}
        }
    }
}

/**
 * @author August O'Rourke
 *  This method gets a list of items in a given Directory, it works for both the git repository as well as the phone's file system for offline mode
 * @param path, the file path to look inside
 * @returns returns a list of sites with the type of siteResponse
 */
export async function getDirectory(path: string)
{
    let check = await Network.getNetworkStateAsync()
    if(!(check.isConnected))
    {
       return {success: true, data: await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + path)}
    }

    const url = `https://api.github.com/repos/Mostlie/CS_4000_mock_docs/contents/${path}`
    const headers = new Headers();
    headers.append("User-Agent", "ResearchFlow");
    headers.append("Accept", "application/vnd.github.raw+json");
    headers.append("Authorization", `Bearer ${githubToken}`);
    headers.append("X-GitHub-Api-Version", "2022-11-28");

    const requestOptions: RequestInfo = new Request(url, 
        {
            method: "GET",
             headers: headers,
            redirect: "follow"
        }
    )
    try{
        const response = await fetch(requestOptions);
        const data: siteResponse[] = await response.json();
        let options;
        if (path === "instrument_maint" || path === "") {
            options = data
                .filter((item: any) => item.type === "dir")
                .map((item: any) => item.name); 
        } else {
            options = data
                .filter(item => item.name.endsWith(".md"))
                .map(item => item.name.replace(/\.md$/, ""));
        }
        return {success:true, data:options};
    }
    catch(error)
    {
        return {success: false, error: error}
    }
}
/**
 * @author August O'Rourke
 * this is a small helper method to request a file from the CS_4000_mock repository, since it is something we do frequently
 * @param siteName The site notes we are trying to get
 * @returns the json response retrieved from the rest endpoint
 */
async function getFile(path: string)
{
    const url = `https://api.github.com/repos/Mostlie/CS_4000_mock_docs/contents/${path}.md`;

    const headers = new Headers();
    headers.append("User-Agent", "ResearchFlow");
    headers.append("Accept", "application/vnd.github+json");
    headers.append("Authorization", `Bearer ${githubToken}`);
    headers.append("X-GitHub-Api-Version", "2022-11-28");

    const requestOptions: RequestInfo = new Request(url, 
        {
            method: "GET",
            headers: headers,
            redirect: "follow"
        }
    )
    try {
        const response = await fetch(requestOptions);
        if (response.ok) {
            const data = await response.json();
            return { success: true, data };
        } else {
            const errorData = await response.json();
            return { success: false, error: errorData.message };
        }
    } catch (error) {
        return { success: false, error: error };
    }

}

/**
 * @author August O'Rourke
 * This gets the contents of a markdown file in the site notes folder from the CS_4000_mock_docs repository, if it exists
 * @param siteName the name of the site that we are trying to retrieve the notes for 
 * @returns the contents of the file as a string
 */

export async function getFileContents(path: string)
{   
    const response = await getFile(path)
    if(response.success)
    {
        return {success: true, data: atob(response.data.content)}
    }
    else
    {
        return response
    }
}
/**
 * @author August O'Rourke
 * This appends the string in the content field the contents of a markdown file in the site notes folder from the CS_4000_mock_docs repository, if it exists
 * @param siteName the name of the site that we are trying to edit the notes for 
 * @param content the content we are going to append to the exitsting file
 * @param commitMessage the commit message that will go on gitHub
 * @returns a json object contatining a success message, as well as a data field or error field, if needed
 */
export async function setSiteFile(siteName: string, content: string, commitMessage: string) {
    siteName = siteName.toLowerCase();
    if((await Network.getNetworkStateAsync()).isConnected)
    {
        const pullResponse = (await getFile(`site_notes/${siteName}`))
        if(pullResponse.error)
        {
            return {success: false, error: pullResponse.error}
        }
        const hash = pullResponse.data.sha
        const existingContent = atob(pullResponse.data.content)
        let siteHeader;
        if (siteName.includes("mobile/")) {
            const site = siteName.replace("mobile/", "");
            siteHeader = `# Site id: **${site}** \n`
            siteHeader += existingContent.split("\n")[1];
            
        } else {
            siteHeader = `# Site id: **${siteName}**`
        }
        const existingNotes = existingContent.substring(siteHeader.length, existingContent.length -1) 
        const fullDoc = btoa(siteHeader +"\n" + content + existingNotes)

        const url = `https://api.github.com/repos/Mostlie/CS_4000_mock_docs/contents/site_notes/${siteName}.md`;
        const bodyString = `{"message":"${commitMessage}","content":"${fullDoc}","sha":"${hash}"}`
        return setFile(bodyString, url)
    }
    else
    {
        try
        {
            let path = FileSystem.documentDirectory + "offline_updates/site_notes.txt"
            let exists = (await FileSystem.getInfoAsync(path)).exists
            let newContent = ""
            if(exists)
            {
                newContent = await FileSystem.readAsStringAsync(path)
            }
            else
            {
                
            }
            newContent += `{siteName: \"${siteName}\", content: \"${content}\"}\n`
            let result = await FileSystem.writeAsStringAsync(path, newContent, {})
            if(await FileSystem.readAsStringAsync(path) === newContent)
            {
                return {success: true}  
            }
            else
            {
                return {success: false, error: "unable to write file"}
            }
        }
        catch(error)
        {
            return{success: false, error: error}
        }
    }   
}