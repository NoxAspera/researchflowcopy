import csv from 'csvtojson';
import * as FileSystem from 'expo-file-system'
import * as Network from 'expo-network'

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
 * @author August O'Rourke
 * This method turns an array of tankRecords into a csv string
 * @param object -an array of TankRecord Objects
 * @returns a csv-ifyed string
 */
function csvify( object: TankRecord[])
{
    let returnString = "fillId,serial,updatedAt,pressure,location,owner,co2,co2Stdev,co2Sterr,co2N,ch4,ch4Stdev,ch4Sterr,ch4N,co,coStdev,coSterr,coN,d13c,d13cStdev,d13cSterr,d13cN,d18o,d18oStdev,d18oSterr,d18oN,co2RelativeTo,comment,userId,co2InstrumentId,ch4InstrumentId,coInstrumentId,ottoCalibrationFile,co2CalibrationFile,ch4RelativeTo,ch4CalibrationFile,coRelativeTo,coCalibrationFile,tankId\n"
    object.forEach(value => 
        { 
            //i really don't like this but i don't know how else to do it, this sucks
            let newLine = `${value.fillId},${value.serial},${value.updatedAt},${value.pressure},${value.location},${value.owner},${value.co2},${value.co2Stdev},${value.co2Sterr},${value.co2N},${value.ch4},${value.ch4Stdev},${value.ch4Sterr},${value.ch4N},${value.co},${value.coStdev},${value.coSterr},${value.coN},${value.d13c},${value.d13cStdev},${value.d13cSterr},${value.d13cN},${value.d18o},${value.d18oStdev},${value.d18oSterr},${value.d18oN},"${value.co2RelativeTo}","${value.comment}",${value.userId},${value.co2InstrumentId},${value.ch4InstrumentId},${value.coInstrumentId},"${value.ottoCalibrationFile}","${value.co2CalibrationFile}","${value.ch4RelativeTo}","${value.ch4CalibrationFile}","${value.coRelativeTo}","${value.coCalibrationFile}",${value.tankId}\n`
            returnString += newLine.replaceAll("undefined", "")
            //console.log("finished loop")
        })

    return returnString
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

async function loop(path: string)
{
    FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + path)
    //console.log("here")
    let response = (await getDirectory(path))
    if(response.success)
    {
        response.data.forEach(element => {
            //console.log(FileSystem.documentDirectory + path + `/${element}`)
            loop(path + `/${element}`)
        });
    }
}

export async function tankTrackerOffline()
{
    let string = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + "tank_tracker/names")
    let names = string.split("\n")
    tankDict = new Map()
    names.forEach(element => {
        tankDict.set(element, undefined)
    })
}

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
    await tankTrackerSpinUp()
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
            existingContent = atob(pullResponse.data.content) + "\n"       
        }
        const fullDoc = btoa(existingContent + JSON.stringify(visit))

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
            console.log(path)
            let exists = (await FileSystem.getInfoAsync(path)).exists
            let content = ""
            if(exists)
            {
                content = await FileSystem.readAsStringAsync(path)
            }
            else
            {
                
            }
            content += `{date: ${visit.date}, equipment: ${visit.equipment}, name: ${visit.name}, notes: ${visit.notes}, site: ${visit.site}}\n`
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
 * Sets the GitHub token for subsequent API requests.
 * @param token The personal access token from the login screen.
 */
export function setGithubToken(token: string) {
    githubToken = token;
}

export function addEntrytoTankDictionary(newEntry: TankRecord) {
    let tankEntries = tankDict.get(newEntry.tankId);
    tankEntries.push(newEntry);
    tankDict.set(newEntry.tankId, tankEntries);
}

/**
 * This method updates the tank tracker csv on the repo
 * @author August O'Rourke
 * @param newEntry the new entry to be added to the tank tracker csv
 * @returns a resopnse containing whether or not adding was successful, and the response data
 */
export async function setTankTracker()
{
    let temp = Array.from(tankDict.values())
    let plainfullDoc: TankRecord[] = []

    temp.forEach(value =>
        {
            value.forEach(value =>
            {
                plainfullDoc.push(value)
            })
        }
    )

    let newContent = csvify(plainfullDoc)

    if((await Network.getNetworkStateAsync()).isConnected)
    {
        const fullDoc = btoa(newContent)

        const url = `https://api.github.com/repos/Mostlie/CS_4000_mock_docs/contents/tank_tracker/tank_db.csv`;
        const bodyString = `{"message":"updating from research flow","content":"${fullDoc}","sha":"${tankTrackerSha}"}`
        return setFile(bodyString, url)
    }
    else
    {
        try
        {
            let path = FileSystem.documentDirectory + "offline_updates/tanktracker.txt"
            console.log(path)
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
    //console.log(tankDict)
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

            console.log("spin-up complete")
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
 * This method gets the data files from this site
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
            console.log(path)
            let exists = (await FileSystem.getInfoAsync(path)).exists
            let content = ""
            if(exists)
            {
                content = await FileSystem.readAsStringAsync(path)
            }
            else
            {
                
            }
            content += `{siteName: ${siteName}, instrument: ${instrument}, newEntry: ${newEntry}}\n`
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
    //return match ? match[1] : null;
    return { success: true, data: match ? match[1] : null };
}

/**
 * @author August O'Rourke
 * This appends the string in the content field the contents of a markdown file in the site notes folder from the CS_4000_mock_docs repository, if it exists,
 * this method could also create a new file, but that has not been tested/ won't be used in the final app (at least right now)
 * @param siteName the name of the site that we are trying to edit the notes for 
 * @param content the content we are going to append to the exitsting file
 * @param commitMessage the commit message that will go on gitHub
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
            let path = FileSystem.documentDirectory + "offline_updates/instrument_maint.txt"
            console.log(path)
            let exists = (await FileSystem.getInfoAsync(path)).exists
            let content = ""
            if(exists)
            {
                content = await FileSystem.readAsStringAsync(path)
            }
            content += `{path: ${path}, content: ${content}, mobile: ${mobile}}\n`
            if(site)
            {
                content = content.substring(0, content.length - 3)
                content += `, path: ${path}}\n`
            }

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
 * @author August O'Rourke
 *  This method gets a list of sites from the CS_4000_mock_docs repository
 * @returns returns a list of sites with the type of siteResponse
 */
export async function getDirectory(path: string)
{
    let check = await Network.getNetworkStateAsync()
    console.log(check.isConnected)
    if(!check.isConnected)
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
        //console.log(response)
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
    //path.toLowerCase()
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
        //console.log(response)
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
    //path = path.toLowerCase();
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
 * This appends the string in the content field the contents of a markdown file in the site notes folder from the CS_4000_mock_docs repository, if it exists,
 * this method could also create a new file, but that has not been tested/ won't be used in the final app (at least right now)
 * @param siteName the name of the site that we are trying to edit the notes for 
 * @param content the content we are going to append to the exitsting file
 * @param commitMessage the commit message that will go on gitHub
 * @returns the contents of the file as a string
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
            console.log(path)
            let exists = (await FileSystem.getInfoAsync(path)).exists
            let content = ""
            if(exists)
            {
                content = await FileSystem.readAsStringAsync(path)
            }
            else
            {
                
            }
            content += `{siteName: ${siteName}, content: ${content}}\n`
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