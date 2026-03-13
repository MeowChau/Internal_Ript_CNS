export type ItemFunctionTabMain = {
  new: boolean;
  title: string;
};

export type ItemSwipeHome = {
  anhDaiDien: string;
  tieuDe: string;
};

export type ItemListEventBanner = {
  thoiGian: string;
  tieuDe: string;
  diaDiem: string;
};

export type DateCalendarObject = {
  dateString: string;
  day: number;
  month: number;
  timestamp: number;
  year: number;
};

export type ItemImageObject = {
  type: string;
  uri: string;
  name: string;
};

export type TypePostImage = {
  filename: string;
  public: boolean;
  file: ItemImageObject;
};

export type TypeResponsePostImage = {
  data: {
    url: string;
  };
};
