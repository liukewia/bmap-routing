type rawPOIDataType = {
  key: React.Key;
  name: string;
  lng: number;  // longitude
  lat: number;  // latitude
}

export function localSearch(
  defaultCity: string,
  POIName: string,
  options: BMapGL.LocalSearchOptions
) {
  const newlocalSearch = new BMapGL.LocalSearch(defaultCity, options);
  newlocalSearch.search(POIName);
}

let timer: number | undefined | null;
let currentValue: string;

// 放 service
export function fetchBmapPOI(userInput: string, callback: (formerState: rawPOIDataType[]) => void) {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  currentValue = userInput;

  function searchCallbackHandler(results: any) {
    // console.log(results);
    if (currentValue === userInput) {
      const { _pois } = results;
      const rawPOIData: rawPOIDataType[] = [];
      _pois.forEach((item: any) => {
        rawPOIData.push({
          key: item.uid,
          name: item.title,
          lng: item.point.lng,
          lat: item.point.lat,
        });
      });
      console.log(rawPOIData);
      callback(rawPOIData);
    }
  }

  function search() {
    localSearch('北京', userInput, {
      onSearchComplete: searchCallbackHandler,
    });
  }
  timer = setTimeout(search, 100);  // 节流
}