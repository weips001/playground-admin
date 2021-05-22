export type TableListItem = {
  id: string;
  compName: string;
  status: string;
  address: string;
  bossName: string;
  bossPhone: string;
  dueDate: string;
  dueDate: string;
  createTime: number;
  status: string
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
