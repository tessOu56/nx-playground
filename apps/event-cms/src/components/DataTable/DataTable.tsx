import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@nx-playground/ui-components';
import {
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
} from 'lucide-react';
import { useState, useMemo } from 'react';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (record: T) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable = true,
  filterable = true,
  pagination = true,
  pageSize = 10,
  onRowClick,
  onRefresh,
  onExport,
  className = '',
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = data;

    // Apply search
    if (searchTerm) {
      result = result.filter(item =>
        columns.some(column => {
          const value = column.key;
          if (typeof value === 'string') {
            const itemValue = item[value];
            return itemValue
              ?.toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          }
          return false;
        })
      );
    }

    // Apply sorting
    if (sortField) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, sortField, sortDirection, columns]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = pagination
    ? filteredData.slice(startIndex, endIndex)
    : filteredData;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRowClick = (record: T) => {
    if (onRowClick) {
      onRowClick(record);
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(item => item.id ?? item.key)));
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const getValue = (record: T, key: string) => {
    if (key.includes('.')) {
      return key.split('.').reduce((obj, k) => obj?.[k], record);
    }
    return record[key];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Toolbar */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          {searchable && (
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <Input
                placeholder='搜尋...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10 w-64'
              />
            </div>
          )}

          {filterable && (
            <Select>
              <SelectTrigger className='w-40'>
                <SelectValue placeholder='篩選' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>全部</SelectItem>
                <SelectItem value='active'>活躍</SelectItem>
                <SelectItem value='inactive'>停用</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <div className='flex items-center gap-2'>
          {onRefresh && (
            <Button variant='outline' size='sm' onClick={onRefresh}>
              <RefreshCw className='w-4 h-4' />
            </Button>
          )}
          {onExport && (
            <Button variant='outline' size='sm' onClick={onExport}>
              <Download className='w-4 h-4' />
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className='border rounded-lg overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b'>
              <tr>
                <th className='px-4 py-3 text-left'>
                  <input
                    type='checkbox'
                    checked={
                      selectedRows.size === paginatedData.length &&
                      paginatedData.length > 0
                    }
                    onChange={handleSelectAll}
                    className='rounded border-gray-300'
                  />
                </th>
                {columns.map(column => (
                  <th
                    key={String(column.key)}
                    className={`px-4 py-3 text-${
                      column.align ?? 'left'
                    } font-medium text-gray-700 ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                    }`}
                    onClick={() =>
                      column.sortable && handleSort(String(column.key))
                    }
                    style={{ width: column.width }}
                  >
                    <div className='flex items-center gap-2'>
                      {column.title}
                      {column.sortable && sortField === column.key && (
                        <span className='text-xs'>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                <th className='px-4 py-3 text-right'>操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + 2}
                    className='px-4 py-8 text-center text-gray-500'
                  >
                    載入中...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 2}
                    className='px-4 py-8 text-center text-gray-500'
                  >
                    沒有找到數據
                  </td>
                </tr>
              ) : (
                paginatedData.map((record, index) => (
                  <tr
                    key={record.id ?? index}
                    className={`border-b hover:bg-gray-50 ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => handleRowClick(record)}
                  >
                    <td className='px-4 py-3'>
                      <input
                        type='checkbox'
                        checked={selectedRows.has(record.id ?? String(index))}
                        onChange={() =>
                          handleSelectRow(record.id ?? String(index))
                        }
                        className='rounded border-gray-300'
                        onClick={e => e.stopPropagation()}
                      />
                    </td>
                    {columns.map(column => (
                      <td
                        key={String(column.key)}
                        className={`px-4 py-3 text-${column.align ?? 'left'}`}
                      >
                        {column.render
                          ? column.render(
                              getValue(record, String(column.key)),
                              record
                            )
                          : getValue(record, String(column.key))}
                      </td>
                    ))}
                    <td className='px-4 py-3 text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={e => e.stopPropagation()}
                          >
                            <MoreHorizontal className='w-4 h-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem>查看詳情</DropdownMenuItem>
                          <DropdownMenuItem>編輯</DropdownMenuItem>
                          <DropdownMenuItem className='text-red-600'>
                            刪除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className='flex justify-between items-center'>
          <div className='text-sm text-gray-500'>
            顯示 {startIndex + 1} - {Math.min(endIndex, filteredData.length)}{' '}
            項，共 {filteredData.length} 項
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className='w-4 h-4' />
            </Button>
            <span className='text-sm'>
              第 {currentPage} 頁，共 {totalPages} 頁
            </span>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className='w-4 h-4' />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
