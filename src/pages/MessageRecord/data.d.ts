export type TableListItem = {
  id: string;
  birthday: string;
  cardId: string;
  cardType: string;
  createTime: string;
  isSend: string;
  isYearCard: string;
  lastUseDate: string;
  lastUseTime: number;
  money: number;
  name: string;
  overdate: string;
  phone: string;
  remark: string;
  restTotal: number;
  sex: string;
  total: string;
  usedTotal: number;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  status?: string;
  compName?: string;
  bossName?: string;
  bossPhone?: string;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
