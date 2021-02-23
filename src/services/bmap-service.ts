import type { RawPOIDataType } from '@/services/bmap-type';


function localSearch(
  defaultCity: string,
  POIName: string,
  options: BMapGL.LocalSearchOptions
): void {
  const newlocalSearch = new BMapGL.LocalSearch(defaultCity, options);
  newlocalSearch.search(POIName);
}


export function fetchBmapPOI(
  userInput: string,
  callback: (formerState: RawPOIDataType[]) => void
): void {
  function searchCallbackHandler(results: any): void {
    const { _pois } = results;
    const rawPOIData: RawPOIDataType[] = [];
    _pois.forEach((item: any) => {
      rawPOIData.push({
        key: item.uid,
        name: item.title,
        lng: item.point.lng,
        lat: item.point.lat,
      });
    });
    // console.log(rawPOIData);
    callback(rawPOIData);
  }

  localSearch('北京', userInput, {
    onSearchComplete: searchCallbackHandler,
  });
}

export function generatePointKey(): string {
  return Math.random().toString(36).slice(-8);
}