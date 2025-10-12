import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Progress,
} from '@nx-playground/ui-components';
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { SEO } from '../../../components/SEO';
import { useDashboardTranslation } from '../hooks/useDashboardTranslation';
import '../i18n';
import { dashboardMetaData } from '../types';

// Mock data for dashboard
const mockStats = {
  totalEvents: 24,
  activeUsers: 1234,
  monthlyRevenue: 12800,
  systemStatus: 'normal',
  eventGrowth: 12.5,
  userGrowth: 8.3,
  revenueGrowth: -2.1,
};

const mockRecentEvents = [
  {
    id: 1,
    name: 'React 開發者大會',
    date: '2024-01-20',
    status: 'active',
    attendees: 150,
  },
  {
    id: 2,
    name: 'UI/UX 設計工作坊',
    date: '2024-01-18',
    status: 'completed',
    attendees: 80,
  },
  {
    id: 3,
    name: '前端技術分享會',
    date: '2024-01-25',
    status: 'upcoming',
    attendees: 0,
  },
  {
    id: 4,
    name: '產品管理研討會',
    date: '2024-01-15',
    status: 'completed',
    attendees: 120,
  },
];

const mockSystemHealth = [
  { name: 'API 響應時間', value: 95, status: 'good' },
  { name: '資料庫連接', value: 98, status: 'good' },
  { name: '檔案儲存', value: 87, status: 'warning' },
  { name: '郵件服務', value: 92, status: 'good' },
];

export const DashboardPage = () => {
  const { t } = useDashboardTranslation();
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  // Simulate data loading
  useEffect(() => {
    // Data loading simulation can be added here if needed
  }, [selectedTimeRange]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className='w-4 h-4 text-green-600' />;
      case 'upcoming':
        return <Clock className='w-4 h-4 text-blue-600' />;
      case 'completed':
        return <CheckCircle className='w-4 h-4 text-gray-600' />;
      default:
        return <AlertCircle className='w-4 h-4 text-yellow-600' />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: '進行中', className: 'bg-green-100 text-green-800' },
      upcoming: { label: '即將開始', className: 'bg-blue-100 text-blue-800' },
      completed: { label: '已結束', className: 'bg-gray-100 text-gray-800' },
    };

    const statusInfo =
      statusMap[status as keyof typeof statusMap] || statusMap.completed;

    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowUpRight className='w-4 h-4 text-green-600' />
    ) : (
      <ArrowDownRight className='w-4 h-4 text-red-600' />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <>
      <SEO config={dashboardMetaData} />
      <div className='p-6'>
        <div className='mb-6'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-3xl font-bold text-text-primary mb-2'>
                {t('dashboard.title') as string}
              </h1>
              <p className='text-text-secondary'>
                {t('dashboard.welcome') as string}
              </p>
            </div>
            <div className='flex items-center gap-4'>
              <Select
                value={selectedTimeRange}
                onValueChange={setSelectedTimeRange}
              >
                <SelectTrigger className='w-32'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='7d'>最近 7 天</SelectItem>
                  <SelectItem value='30d'>最近 30 天</SelectItem>
                  <SelectItem value='90d'>最近 90 天</SelectItem>
                  <SelectItem value='1y'>最近 1 年</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          {/* 總活動數 */}
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div className='p-2 bg-primary-100 rounded-lg'>
                    <Calendar className='w-6 h-6 text-primary-600' />
                  </div>
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-text-secondary'>
                      {t('dashboard.stats.totalEvents') as string}
                    </p>
                    <p className='text-2xl font-bold text-text-primary'>
                      {mockStats.totalEvents}
                    </p>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 ${getGrowthColor(
                    mockStats.eventGrowth
                  )}`}
                >
                  {getGrowthIcon(mockStats.eventGrowth)}
                  <span className='text-sm font-medium'>
                    {Math.abs(mockStats.eventGrowth)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 活躍用戶 */}
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div className='p-2 bg-success-100 rounded-lg'>
                    <Users className='w-6 h-6 text-success-600' />
                  </div>
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-text-secondary'>
                      {t('dashboard.stats.activeUsers') as string}
                    </p>
                    <p className='text-2xl font-bold text-text-primary'>
                      {mockStats.activeUsers.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 ${getGrowthColor(
                    mockStats.userGrowth
                  )}`}
                >
                  {getGrowthIcon(mockStats.userGrowth)}
                  <span className='text-sm font-medium'>
                    {Math.abs(mockStats.userGrowth)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 本月收入 */}
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div className='p-2 bg-warning-100 rounded-lg'>
                    <DollarSign className='w-6 h-6 text-warning-600' />
                  </div>
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-text-secondary'>
                      {t('dashboard.stats.monthlyRevenue') as string}
                    </p>
                    <p className='text-2xl font-bold text-text-primary'>
                      ${mockStats.monthlyRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 ${getGrowthColor(
                    mockStats.revenueGrowth
                  )}`}
                >
                  {getGrowthIcon(mockStats.revenueGrowth)}
                  <span className='text-sm font-medium'>
                    {Math.abs(mockStats.revenueGrowth)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 系統狀態 */}
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div className='p-2 bg-green-100 rounded-lg'>
                    <Activity className='w-6 h-6 text-green-600' />
                  </div>
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-text-secondary'>
                      {t('dashboard.stats.systemStatus') as string}
                    </p>
                    <p className='text-2xl font-bold text-green-600'>
                      {t('dashboard.stats.normal') as string}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-1 text-green-600'>
                  <CheckCircle className='w-4 h-4' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Events and System Health */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          {/* 最近活動 */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Calendar className='w-5 h-5' />
                最近活動
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {mockRecentEvents.map(event => (
                  <div
                    key={event.id}
                    className='flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    <div className='flex items-center gap-3'>
                      {getStatusIcon(event.status)}
                      <div>
                        <h4 className='font-medium text-gray-900'>
                          {event.name}
                        </h4>
                        <p className='text-sm text-gray-500'>{event.date}</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm text-gray-500'>
                        {event.attendees} 人
                      </span>
                      {getStatusBadge(event.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 系統健康狀態 */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Activity className='w-5 h-5' />
                系統健康狀態
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {mockSystemHealth.map((item, index) => (
                  <div key={index} className='space-y-2'>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm font-medium text-gray-700'>
                        {item.name}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          item.status === 'good'
                            ? 'text-green-600'
                            : item.status === 'warning'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {item.value}%
                      </span>
                    </div>
                    <Progress
                      value={item.value}
                      className={`h-2 ${
                        item.status === 'good'
                          ? '[&>div]:bg-green-500'
                          : item.status === 'warning'
                          ? '[&>div]:bg-yellow-500'
                          : '[&>div]:bg-red-500'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions and Analytics */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* 快速操作 */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <BarChart3 className='w-5 h-5' />
                {t('dashboard.quickActions.title') as string}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <Button
                  variant='primary'
                  size='default'
                  className='flex items-center gap-2'
                >
                  <Calendar className='w-4 h-4' />
                  {t('dashboard.quickActions.createEvent') as string}
                </Button>
                <Button
                  variant='secondary'
                  size='default'
                  className='flex items-center gap-2'
                >
                  <Users className='w-4 h-4' />
                  {t('dashboard.quickActions.manageUsers') as string}
                </Button>
                <Button
                  variant='outline'
                  size='default'
                  className='flex items-center gap-2'
                >
                  <BarChart3 className='w-4 h-4' />
                  {t('dashboard.quickActions.viewReports') as string}
                </Button>
                <Button
                  variant='ghost'
                  size='default'
                  className='flex items-center gap-2'
                >
                  <Activity className='w-4 h-4' />
                  {t('dashboard.quickActions.systemSettings') as string}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 搜尋和篩選 */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <PieChart className='w-5 h-5' />
                {t('dashboard.searchAndFilter.title') as string}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <label
                  htmlFor='search'
                  className='text-sm font-medium text-text-primary'
                >
                  {t('dashboard.searchAndFilter.searchEvents') as string}
                </label>
                <Input
                  id='search'
                  placeholder={
                    t('dashboard.searchAndFilter.searchPlaceholder') as string
                  }
                  className='mt-1'
                />
              </div>

              <div>
                <label
                  htmlFor='status'
                  className='text-sm font-medium text-text-primary'
                >
                  {t('dashboard.searchAndFilter.statusFilter') as string}
                </label>
                <Select>
                  <SelectTrigger className='mt-1'>
                    <SelectValue
                      placeholder={
                        t(
                          'dashboard.searchAndFilter.statusPlaceholder'
                        ) as string
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>
                      {t('dashboard.searchAndFilter.all') as string}
                    </SelectItem>
                    <SelectItem value='active'>
                      {t('dashboard.searchAndFilter.active') as string}
                    </SelectItem>
                    <SelectItem value='upcoming'>
                      {t('dashboard.searchAndFilter.upcoming') as string}
                    </SelectItem>
                    <SelectItem value='completed'>
                      {t('dashboard.searchAndFilter.completed') as string}
                    </SelectItem>
                    <SelectItem value='cancelled'>
                      {t('dashboard.searchAndFilter.cancelled') as string}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex gap-2'>
                <Button
                  variant='primary'
                  size='sm'
                  className='flex items-center gap-2'
                >
                  <TrendingUp className='w-4 h-4' />
                  {t('dashboard.searchAndFilter.search') as string}
                </Button>
                <Button variant='outline' size='sm'>
                  {t('dashboard.searchAndFilter.reset') as string}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
