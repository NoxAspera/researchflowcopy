import * as Network from 'expo-network'
import { getBadDataFiles, getBadDataSites, getDirectory, getFileContents, getInstrumentSite, getLatestTankEntry, getTankList, TankRecord, visit } from './APIRequests';
import { ParsedData, parseNotes, parseVisits, processVisits, VisitList } from './Parsers';
import { SetStateAction } from 'react';
import { routeProp } from '../components/types';

async function isConnected()
{
  let check = (await Network.getNetworkStateAsync()).isConnected
  return check
}

/**
 * @author Megan Ostlie
 *  a function that pulls the current note document for the specified site from GitHub
 *  @param siteName the name of the site
 * 
 * @returns a ParsedData object that contains the information of the given document
 */
async function processNotes(siteName: string) {
  const fileContents = await getFileContents(`site_notes/${siteName}`);
  if(fileContents.data){
    return parseNotes(fileContents.data)
  }
  else
  {
    return null
  }
}

export async function fetchData(setNetworkStatus: { (value: SetStateAction<boolean>): void; (value: SetStateAction<boolean>): void; (arg0: boolean): void; }, setData: { (value: SetStateAction<ParsedData>): void; (value: SetStateAction<ParsedData>): void; (arg0: ParsedData): void; }, site: string, data: ParsedData, networkStatus: boolean) {
  setNetworkStatus(await isConnected());

  if (site && !data && networkStatus) {
    try {
      const parsedData = await processNotes(site);
      setData(parsedData); // Update state with the latest entry
    } catch (error) {
      console.error("Error processing notes:", error);
    }
  }
}

export async function fetchInstrumentNames(setInstrumentNames: { (value: SetStateAction<string[]>): void; (value: SetStateAction<string[]>): void; (arg0: any): void; }, from: any) {
  try {
    if (from) {
        var names = await getDirectory(`instrument_maint/${from}`);
    }
    else {
        var names = await getDirectory(`instrument_maint/LGR_UGGA`);
    }

    if (names?.success) {
      setInstrumentNames(names.data);
    }
  } catch (error) {
    console.error("Error processing instrument names:", error);
  }
};

export async function fetchBadDataFiles(setFileOptions: { (value: SetStateAction<string[]>): void; (arg0: string[]): void; }, site: string) {
  try {
    const response = await getBadDataFiles(site);
    if (response.success) {
      setFileOptions(response.data || []); // Set the file names as options
    } else {
      alert(`Error fetching files: ${response.error}`);
    }
  } catch (error) {
    console.error("Error fetching bad data files:", error);
  }
};

export async function fetchCalendarData(setOnline: any, setMarkedDates: { (value: SetStateAction<{}>): void; (arg0: (prevmarkedDates: any) => any): void; }, markedDates: {}, visitDict: Map<any, any>) {
  try {
    let online = isConnected();
    setOnline(online);
    if (online) {
      let response = await getFileContents("researchflow_data/visits");
      if (response.success) {
        visitDict = new Map();
        let visits: visit[] = processVisits(response.data);
        visits.forEach((value) => {
          if (visitDict.has(value.date)) {
            let temp = visitDict.get(value.date);
            temp.push(value);
            visitDict.set(value.date, temp);
          } else {
            visitDict.set(value.date, [value]);
          }

          if (markedDates) {
            setMarkedDates((prevmarkedDates: any) => ({
              ...prevmarkedDates,
              [value.date]: { marked: true, dotColor: "blue" },
            }));
          }
        });
      } else {
        console.error(response.error);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export async function fetchDiagnosticData(site: string, data: ParsedData, setData: { (value: SetStateAction<ParsedData>): void; (arg0: ParsedData): void; }) {
  if (site && !data) {
    try {
      const parsedData = await processNotes(site);
      setData(parsedData); // Update state with the latest entry
    } catch (error) {
      console.error("Error processing notes:", error);
    }
  }
}

export async function fetchSite(site: string, setSiteValue: { (value: SetStateAction<string>): void; (arg0: string): void; }) {
    if (site.includes("LGR") && isConnected()) {
      try {
        const response = await getInstrumentSite(site);
        if (response.success) {
          setSiteValue(response.data || ""); // Set the file names as options
        } else {
          alert(`Error fetching site: ${response.error}`);
        }
      } catch (error) {
        console.error("Error fetching instrument site:", error);
      }
    }
  };

export async function fetchPrevNotes(site: string, data: string[], route: routeProp, setData: { (value: SetStateAction<string[]>): void; (arg0: any): void; }) {
  if (site && !data && route) {
    try {
      const parsedData = await getFileContents(`/site_notes/${site}`);
      if (parsedData.success) {
        let fileContent = parsedData.data;
        if (site.includes("Teledyne")) {
          // Find the start of "Maintenance Log"
          const maintenanceIndex = fileContent.indexOf("Maintenance Log");
          if (maintenanceIndex !== -1) {
            // Find the end of the "Maintenance Log" line
            const startOfLogContent =
              fileContent.indexOf("\n", maintenanceIndex) + 1;

            // Keep the first line + everything after the "Maintenance Log" line
            const firstLineEnd = fileContent.indexOf("\n");
            fileContent =
              fileContent.substring(0, firstLineEnd + 1) + // Keep the first line
              fileContent.substring(startOfLogContent); // Skip "Maintenance Log" line
          }
        }

        setData(
          fileContent
            .substring(parsedData.data.indexOf("\n"))
            .split(new RegExp("(___|---)"))
        );
      } else {
        console.error("Error getting notes: ");
      }
    } catch (error) {
      console.error("Error retreiveing  notes:", error);
    }
  }
}

export async function fetchSiteNames(from: any, setSiteNames: { (value: SetStateAction<string[]>): void; (arg0: string[]): void; })  {
    try {
        let names;
        let mobile_names;
        if (from === 'AddNotes' || from === 'ViewNotes' || from === 'PlanVisit' || from === 'Diagnostics') {
            names = await getDirectory("site_notes");
            mobile_names = await getDirectory("site_notes/mobile");
        } else if (from === 'BadData') {
            names = await getBadDataSites();
        } else if (from === 'InstrumentMaintenance' || from === 'InstrumentMaintenanceNotes') {
            names = await getDirectory("instrument_maint");
        } else if (from === 'TankTracker') {
            setSiteNames(getTankList());
        }
        if(names?.success)
        {
            if (mobile_names?.success) {
                names.data.push(...mobile_names.data.map(item => "mobile/" + item));
            }
            setSiteNames(names.data);
        } // Set the fetched site names
    }
    catch (error)
    {
        console.error("Error processing site names:", error);
    }
};

export async function fetchTankNames(setTankNames: { (value: SetStateAction<string[]>): void; (arg0: string[]): void; }, setFilteredTanks: { (value: SetStateAction<string[]>): void; (arg0: string[]): void; }) {
    try {
      const tanks = getTankList(); // Ensure getTankList is returning a valid list
      const validTanks = tanks.filter((tank) => tank && tank.trim() !== "");
      setTankNames(validTanks);
      setFilteredTanks(validTanks); // Initialize filtered list
    } catch (error) {
      console.error("Error fetching tank names:", error);
    }
};

export async function fetchTank(
  tank: string,
  setNetworkStatus: { (value: SetStateAction<boolean>): void; (arg0: boolean): void; },
  setLocationValue: { (value: SetStateAction<TankRecord>): void; (arg0: string): void; },
  setCO2Value: { (value: SetStateAction<string>): void; (arg0: string): void; },
  setCH4Value: { (value: SetStateAction<string>): void; (arg0: string): void; },
  setFillIDValue: { (value: SetStateAction<string>): void; (arg0: string): void; },
  setPSIValue: { (value: SetStateAction<string>): void; (arg0: string): void; },
  setLatestEntry: { (value: SetStateAction<TankRecord>): void; (arg0: TankRecord): void; }
) {
  setNetworkStatus(await isConnected());
  if (tank) {
    let entry = getLatestTankEntry(tank);
    if (entry) {
      setLocationValue(entry.location);
      setCO2Value(entry.co2.toString());
      setCH4Value(entry.ch4.toString());
      setFillIDValue(entry.fillId);
      setPSIValue(entry.pressure.toString());
      setLatestEntry(entry);
    }
  }
}

export async function fetchNotes(
  site: string,
  data: string[],
  route: routeProp,
  setData: { (value: SetStateAction<string[]>): void; (arg0: any): void }
) {
  if (site && !data && route) {
    try {
      const parsedData = await getFileContents(site);
      if (parsedData.success) {
        let fileContent = parsedData.data;

        if (site.includes("Teledyne")) {
          // Find the start of "Maintenance Log"
          const maintenanceIndex = fileContent.indexOf("Maintenance Log");
          if (maintenanceIndex !== -1) {
            // Find the end of the "Maintenance Log" line
            const startOfLogContent =
              fileContent.indexOf("\n", maintenanceIndex) + 1;

            // Keep the first line + everything after the "Maintenance Log" line
            const firstLineEnd = fileContent.indexOf("\n");
            fileContent =
              fileContent.substring(0, firstLineEnd + 1) + // Keep the first line
              fileContent.substring(startOfLogContent); // Skip "Maintenance Log" line
          }
        }

        setData(
          fileContent
            .substring(parsedData.data.indexOf("\n"))
            .split(new RegExp("(___|---)"))
        );
      } else {
        console.error(parsedData.error);
      }
    } catch (error) {
      console.error("Error retreiveing  notes:", error);
    }
  }
}

/**
 * @author Megan Ostlie
 * a function that pulls the current note document for the specified site from GitHub
 * @param siteName the name of the site
 *
 * @returns a VisitsList object that contains the information of the given document
 */
async function processUpcomingVisits() {
  const fileContents = await getFileContents(`researchflow_data/visits`);
  if (fileContents.data) {
    return parseVisits(fileContents.data);
  } else {
    return null;
  }
}

export async function fetchUpcomingVisits(data: VisitList, setData: { (value: SetStateAction<VisitList>): void; (arg0: VisitList): void; }) {
  if (data == null) {
    try {
      const parsedData = await processUpcomingVisits();
      setData(parsedData); // Update state with the latest entry
    } catch (error) {
      console.error("Error processing notes:", error);
    }
  }
}