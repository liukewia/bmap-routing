


export function localSearch(clickEvent, defaultCity, POI, options) {
  // the BMapGL.LocalSearch newed will be executed in the scope having AK code.
  const newlocalSearch = new BMapGL.LocalSearch(defaultCity, options);
  newlocalSearch.search(POI);
}
