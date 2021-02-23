import type { POIDataType } from '@/pages/VRP/data';




export type SearchInputProps = {
  // id: string;  // dataIndex
  saveSearchResult: (selectedRow: RawPOIDataType) => Promise<void>;
  record: POIDataType;
  // value: string;
}

export type SearchInputState = {
  pointData: RawPOIDataType;
  searchResult: RawPOIDataType[];
}