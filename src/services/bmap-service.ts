export const defaultSearchOption = {
  onSearchComplete: (results: any) => {
    return results;
  },
};

export async function localSearch(clickEvent, defaultCity, POI, options) {
  const newlocalSearch = new BMapGL.LocalSearch(defaultCity, options);
  await newlocalSearch.search(POI);
}
