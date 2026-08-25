import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@nx-playground/ui-components';
import { useMemo } from 'react';

import { DataTable, type Column } from '../../../components/DataTable';
import { useOpsTranslation } from '../hooks/useOpsTranslation';
import '../i18n';
import { MockDataApplications } from '../mock/mockApplications';
import type { DataApplication, DataApplicationStatus } from '../types';

const STATUS_CLASS: Record<DataApplicationStatus, string> = {
  pending: 'bg-amber-100 text-amber-900',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export function OpsPage() {
  const { t } = useOpsTranslation();
  const rows = useMemo(() => MockDataApplications.list(), []);

  const columns: Column<DataApplication>[] = [
    {
      key: 'requester',
      title: t('ops.apps.col.requester') as string,
      sortable: true,
    },
    {
      key: 'purpose',
      title: t('ops.apps.col.purpose') as string,
    },
    {
      key: 'asset',
      title: t('ops.apps.col.asset') as string,
      sortable: true,
    },
    {
      key: 'status',
      title: t('ops.apps.col.status') as string,
      render: value => {
        const status = value as DataApplicationStatus;
        return (
          <Badge className={STATUS_CLASS[status]}>
            {t(`ops.apps.status.${status}`) as string}
          </Badge>
        );
      },
    },
    {
      key: 'submittedAt',
      title: t('ops.apps.col.submitted') as string,
      render: value =>
        new Intl.DateTimeFormat(undefined, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(value as string)),
      sortable: true,
    },
  ];

  return (
    <div className='space-y-8 p-6'>
      <header className='flex flex-wrap items-start gap-3'>
        <div>
          <h1 className='text-2xl font-semibold text-text-primary'>
            {t('ops.title') as string}
          </h1>
          <p className='mt-2 max-w-2xl text-sm text-text-secondary'>
            {t('ops.desc') as string}
          </p>
        </div>
        <Badge className='bg-amber-100 text-amber-900'>
          {t('ops.mockBadge') as string}
        </Badge>
      </header>

      <section aria-labelledby='ops-alerts-title'>
        <h2 id='ops-alerts-title' className='mb-2 text-lg font-medium'>
          {t('ops.alerts.title') as string}
        </h2>
        <p className='mb-4 max-w-2xl text-sm text-text-secondary'>
          {t('ops.alerts.desc') as string}
        </p>
        <div className='space-y-3'>
          <Alert variant='info'>
            <AlertTitle>{t('ops.alerts.info.title') as string}</AlertTitle>
            <AlertDescription>
              {t('ops.alerts.info.body') as string}
            </AlertDescription>
          </Alert>
          <Alert variant='warning'>
            <AlertTitle>{t('ops.alerts.warning.title') as string}</AlertTitle>
            <AlertDescription>
              {t('ops.alerts.warning.body') as string}
            </AlertDescription>
          </Alert>
          <Alert variant='destructive'>
            <AlertTitle>{t('ops.alerts.error.title') as string}</AlertTitle>
            <AlertDescription>
              {t('ops.alerts.error.body') as string}
            </AlertDescription>
          </Alert>
        </div>
      </section>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>{t('ops.apps.title') as string}</CardTitle>
          <Badge className='bg-amber-100 text-amber-900'>
            {t('ops.mockBadge') as string}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className='mb-4 max-w-2xl text-sm text-text-secondary'>
            {t('ops.apps.desc') as string}
          </p>
          <DataTable
            data={rows}
            columns={columns}
            searchable
            pagination={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
