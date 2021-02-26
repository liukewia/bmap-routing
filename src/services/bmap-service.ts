import type { RawPOIDataType } from '@/services/bmap-type';

// https://mapopen-pub-jsapi.bj.bcebos.com/jsapi/reference/jsapi_webgl_1_0.html

function localSearch(
  cityToSearch: string = '北京',
  POIName: string,
  options: BMapGL.LocalSearchOptions
): void {
  const newlocalSearch = new BMapGL.LocalSearch(cityToSearch, options);
  newlocalSearch.search(POIName);
}


export function fetchBmapPOI(
  cityToSearch: string,
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

  // console.log('cityToSearch:', cityToSearch);
  localSearch(cityToSearch, userInput, {
    onSearchComplete: searchCallbackHandler,
  });
}

export function generatePointKey(): string {
  return Math.random().toString(36).slice(-8);
}