'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormInput,
  FormSelect,
  FormTextarea,
  type SelectOption,
} from '@/components';
import { shareToLine } from '@/libs';

interface FeedbackForm {
  type: 'suggestion' | 'bug' | 'complaint' | 'praise' | 'other';
  title: string;
  description: string;
  contact: string;
  priority: 'low' | 'medium' | 'high';
}

export function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FeedbackForm>({
    defaultValues: {
      type: 'suggestion',
      title: '',
      description: '',
      contact: '',
      priority: 'medium',
    },
  });

  const onSubmit = async (data: FeedbackForm) => {
    setIsSubmitting(true);

    try {
      // 模擬提交到後台
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 分享到廠商 LINE 帳號
      const feedbackText = `意見回饋\n\n類型：${getTypeLabel(
        data.type
      )}\n標題：${data.title}\n描述：${data.description}\n聯絡方式：${
        data.contact
      }\n優先級：${getPriorityLabel(
        data.priority
      )}\n\n來自 NX Playground Events 平台`;

      shareToLine(feedbackText);

      setSubmitSuccess(true);
      reset();
    } catch (_error) {
      //
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      suggestion: '建議',
      bug: '錯誤回報',
      complaint: '投訴',
      praise: '讚美',
      other: '其他',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      low: '低',
      medium: '中',
      high: '高',
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  // 選項資料
  const typeOptions: SelectOption[] = [
    { value: 'suggestion', label: '建議' },
    { value: 'bug', label: '錯誤回報' },
    { value: 'complaint', label: '投訴' },
    { value: 'praise', label: '讚美' },
    { value: 'other', label: '其他' },
  ];

  const priorityOptions: SelectOption[] = [
    { value: 'low', label: '低 - 一般建議' },
    { value: 'medium', label: '中 - 功能改進' },
    { value: 'high', label: '高 - 緊急問題' },
  ];

  if (submitSuccess) {
    return (
      <div className='text-center'>
        <div className='bg-green-50 border border-green-200 rounded-lg p-8'>
          <h2 className='text-2xl font-bold text-green-900 mb-4'>
            意見回饋已提交
          </h2>
          <p className='text-green-700 mb-6'>
            感謝您的寶貴意見！我們會認真處理您的回饋，並盡快與您聯繫。
          </p>
          <Button
            onClick={() => setSubmitSuccess(false)}
            variant='primary'
            size='lg'
            className='bg-green-600 hover:bg-green-700'
          >
            提交新的回饋
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* 頁面標題 */}
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>意見回饋</h1>
        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
          您的意見對我們很重要！請告訴我們您的想法，我們會認真處理並改進服務。
        </p>
      </div>

      {/* 回饋表單 */}
      <Card>
        <CardHeader>
          <CardTitle>意見回饋表單</CardTitle>
          <CardDescription>
            請填寫以下資訊，我們會認真處理您的回饋
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* 回饋類型 */}
            <FormSelect<FeedbackForm>
              name='type'
              control={control}
              options={typeOptions}
              placeholder='選擇回饋類型'
              label='回饋類型'
              required
              error={errors.type?.message}
            />

            {/* 標題 */}
            <FormInput<FeedbackForm>
              name='title'
              control={control}
              type='text'
              placeholder='請簡要描述您的意見'
              label='標題'
              required
              error={errors.title?.message}
            />

            {/* 詳細描述 */}
            <FormTextarea<FeedbackForm>
              name='description'
              control={control}
              rows={4}
              placeholder='請詳細描述您的意見或遇到的問題'
              label='詳細描述'
              required
              error={errors.description?.message}
            />

            {/* 聯絡方式 */}
            <FormInput<FeedbackForm>
              name='contact'
              control={control}
              type='text'
              placeholder='LINE ID、電話或 Email（選填）'
              label='聯絡方式'
              description='選填，方便我們與您聯繫'
            />

            {/* 優先級 */}
            <FormSelect<FeedbackForm>
              name='priority'
              control={control}
              options={priorityOptions}
              placeholder='選擇優先級'
              label='優先級'
              required
              error={errors.priority?.message}
            />

            {/* 提交按鈕 */}
            <div className='pt-4'>
              <Button
                type='submit'
                disabled={isSubmitting}
                variant='primary'
                size='lg'
                className='w-full'
              >
                {isSubmitting ? '提交中...' : '提交意見回饋'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 客服資訊 */}
      <Card className='bg-blue-50 border-blue-200'>
        <CardHeader>
          <CardTitle className='text-blue-900'>客服支援</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3 text-blue-800'>
            <p>• 如需緊急協助，請直接聯繫主辦方</p>
            <p>• 平台技術問題，我們會在 24 小時內回覆</p>
            <p>• 活動相關問題，請聯繫對應的主辦方</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
