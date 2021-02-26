import type { POIDataType } from '@/pages/VRP/data';

export type SearchInputProps = {
  // id: string;  // dataIndex
  record: POIDataType;
  saveSearchResult: (selectedRow: RawPOIDataType) => Promise<void>;
  priorSearchCity: { arr: ReactText[] };
  // value: string;
}

export type SearchInputState = {
  pointData: RawPOIDataType;
  searchResult: RawPOIDataType[];
}