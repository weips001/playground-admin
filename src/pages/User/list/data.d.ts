export type TableListItem = {
  id: string;
  userCode: string;
  status: string;
  userName: string;
  department: string;
  userPhone: string;
  userEmail: string;
  status: string;
  createTime: string;
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
  id?: string;
  status?: string;
  userCode?: string;
  userName?: string;
  userPhone?: string;
  department?: string;
  userEmail?: string;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
