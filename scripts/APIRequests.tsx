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

let githubToken: string | null = null;

/**
 * Sets the GitHub token for subsequent API requests.
 * @param token The personal access token from the login screen.
 */
export function setGithubToken(token: string) {
    githubToken = token;
}

export async function getBadDataSites()
{
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

export async function setBadData(siteName: string, instrument: string, newEntry: string, commitMessage: string)
{
    siteName = siteName.toLowerCase();
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
        //console.log(response)
        if (response.ok) {
            const data = await response.json();
            let plainContent = atob(data.content);
            let entries = plainContent.substring(plainContent.indexOf("\n"))
            let headers = plainContent.substring(0, plainContent.indexOf("\n"))
            sha = data.sha
            newFile = headers + '\n' + entries + '\n' + newEntry
            newFile = btoa(newFile)
            //console.log(headers);
            //console.log(entries);
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

    const bodyString = `{"message":"${commitMessage}","content":"${newFile}","sha":"${sha}"}`
    headers = new Headers();
    headers.append("User-Agent", "ResearchFlow");
    headers.append("Accept", "application/vnd.github+json");
    headers.append("Authorization", `Bearer ${githubToken}`);
    headers.append("X-GitHub-Api-Version", "2022-11-28");

    requestOptions = new Request(url, 
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
 * @author August O'Rourke
 * This appends the string in the content field the contents of a markdown file in the site notes folder from the CS_4000_mock_docs repository, if it exists,
 * this method could also create a new file, but that has not been tested/ won't be used in the final app (at least right now)
 * @param siteName the name of the site that we are trying to edit the notes for 
 * @param content the content we are going to append to the exitsting file
 * @param commitMessage the commit message that will go on gitHub
 * @returns the contents of the file as a string
 */
export async function setInstrumentFile(path: string, content: string, commitMessage: string, mobile:boolean, site?: string) {
    console.log("here")
    const pullResponse = (await getFile(path))
    if(pullResponse.error)
    {
        return {success: false, error: pullResponse.error}
    }
    console.log(pullResponse)
    const hash = pullResponse.data.sha
    const existingContent = atob(pullResponse.data.content)
    const maintenanceHeader = `Maintenance Log\n---`
    let staticHeader = existingContent.substring(0,existingContent.indexOf(maintenanceHeader) + maintenanceHeader.length)
    if(mobile && site)
    {
        let staticHeaderNoLocation  = staticHeader.substring(0, staticHeader.indexOf("---\nCurrently At"))
        let locationHeader = `---\nCurrently At ${site}\n` + maintenanceHeader
        staticHeader = staticHeaderNoLocation + locationHeader
    }
    const existingNotes = existingContent.substring(existingContent.indexOf(maintenanceHeader) + maintenanceHeader.length) 
    console.log(existingNotes)
    console.log(staticHeader)
    const fullDoc = btoa(staticHeader +"\n" + content + existingNotes)

    const url = `https://api.github.com/repos/Mostlie/CS_4000_mock_docs/contents/${path}.md`;
    const bodyString = `{"message":"${commitMessage}","content":"${fullDoc}","sha":"${hash}"}`
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
        console.log(response)
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
 *  This method gets a list of sites from the CS_4000_mock_docs repository
 * @returns returns a list of sites with the type of siteResponse
 */
export async function getDirectory(path: string)
{
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
        if (path === "instrument_maint") {
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
    path.toLowerCase()
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
        console.log(response)
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
    path = path.toLowerCase();
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
export async function setFile(siteName: string, content: string, commitMessage: string) {
    siteName = siteName.toLowerCase();
    const pullResponse = (await getFile(`site_notes/${siteName}`))
    if(pullResponse.error)
    {
        return {success: false, error: pullResponse.error}
    }
    const hash = pullResponse.data.sha
    const existingContent = atob(pullResponse.data.content)
    const siteHeader = `# Site id: **${siteName}**`
    const existingNotes = existingContent.substring(siteHeader.length, existingContent.length -1) 
    const fullDoc = btoa(siteHeader +"\n" + content + existingNotes)

    const url = `https://api.github.com/repos/Mostlie/CS_4000_mock_docs/contents/site_notes/${siteName}.md`;
    const bodyString = `{"message":"${commitMessage}","content":"${fullDoc}","sha":"${hash}"}`
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