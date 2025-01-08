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

/**
 * @author August O'Rourke
 *  This method gets a list of sites from the CS_4000_mock_docs repository
 * @returns returns a list of sites with the type of siteResponse
 */
export async function getSites()
{
    const url = 'https://api.github.com/repos/Mostlie/CS_4000_mock_docs/contents/site_notes'
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
    const response = await fetch(requestOptions);
    const data: siteResponse[] = await response.json();
    const mdFiles = data
        .filter(item => item.name.endsWith(".md"))
        .map(item => item.name.replace(/\.md$/, ""));
    
    return mdFiles;
}
/**
 * @author August O'Rourke
 * this is a small helper method to request a file from the CS_4000_mock repository, since it is something we do frequently
 * @param siteName The site notes we are trying to get
 * @returns the json response retrieved from the rest endpoint
 */
async function getFile(siteName: string)
{
    siteName = siteName.toLowerCase();
    const url = `https://api.github.com/repos/Mostlie/CS_4000_mock_docs/contents/site_notes/${siteName}.md`;

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

export async function getFileContents(siteName: string)
{   
    siteName = siteName.toLowerCase();
    const response = await getFile(siteName)
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
    const pullResponse = (await getFile(siteName))
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