import {
  Button,
  Input,
  Select,
  Textarea,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@nx-playground/ui-components';
import { useEffect, useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { usePreviewStore } from '../../stores';
import { type EventFormValue } from '../../types';
import { Text } from '../core';

export function PaymentBlock() {
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<EventFormValue>();
  const eventBlock = useWatch<EventFormValue>();
  const {
    setEditingPaymentType,
    setEditingDescriptionType,
    setOpenPreferAccount,
    openPreferAccount,
    setHasError,
  } = usePreviewStore();
  const editingPaymentType = usePreviewStore(state => state.editingPaymentType);
  const hasError = usePreviewStore(state => state.hasError);
  const editingDescriptionType = usePreviewStore(
    state => state.editingDescriptionType
  );
  const preferPayment = usePreviewStore(state => state.preferPayment);
  const [allFreeTicket, setAllFreeTicket] = useState(true);

  useEffect(() => {
    const isBankEnalbe = eventBlock.bankTransfer?.enable;
    console.log(errors);
    if (!!errors.bankTransfer && isBankEnalbe) {
      console.log('set error');

      setHasError(true);
    } else {
      console.log('close error');
      setHasError(false);
    }
  }, [errors, eventBlock.bankTransfer]);

  //清空 空值的說明
  useEffect(() => {
    const cashDescription = getValues('cashpayment.description');
    const bankDescription = getValues('bankTransfer.description');
    if (cashDescription === '') setValue('cashpayment.description', undefined);
    if (bankDescription === '') setValue('bankTransfer.description', undefined);
  }, [editingDescriptionType]);

  const descriptionAction = (
    e: React.MouseEvent,
    type: string,
    action: string
  ) => {
    e.stopPropagation();
    if (hasError) return;
    switch (type) {
      case 'cash':
        if (action === 'add') {
          setValue('cashpayment.description', '');
          setEditingDescriptionType('cash');
        }
        if (action === 'delete') setValue('cashpayment.description', undefined);
        if (action === 'edit') {
          setEditingDescriptionType('cash');
        }
        break;
      case 'bank':
        if (action === 'add') {
          setValue('bankTransfer.description', '');
          setEditingDescriptionType('bank');
        }
        if (action === 'delete')
          setValue('bankTransfer.description', undefined);
        if (action === 'edit') setEditingDescriptionType('bank');
        break;
      default:
        break;
    }
  };
  const paymentInfoAction = (type: string, action: string) => {
    if (hasError) return;
    switch (type) {
      case 'bank':
        if (action === 'edit') setEditingPaymentType('bankTransfer.info');
        break;
      default:
        break;
    }
  };

  const addBankAccount = () => {
    const oldBankAccountInfo = getValues('bankTransfer');
    setValue('bankTransfer', {
      ...oldBankAccountInfo,
      id: Date.now().toString(),
    });
    setEditingPaymentType('bankTransfer.info');
    setEditingDescriptionType('null');
  };

  const ticket = getValues('ticketBlock');

  useEffect(() => {
    ticket.map(t => {
      if (t.price > 0) setAllFreeTicket(false);
    });
  }, [ticket]);

  if (allFreeTicket) return;
  return (
    <div
      className='flex flex-col w-full h-fit'
      onClick={() => {
        setOpenPreferAccount(false);
      }}
    >
      <div className='flex flex-row justify-between py-4'>
        <div className='flex flex-col gap-2'>
          <Text variant='title'>設定付款方式</Text>
          <Text variant='content'>選擇您希望如何收取活動費用</Text>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        {/* ------------ ＡＴＭ轉帳 ------------ */}
        <div className='flex flex-col rounded-xl w-full p-4 gap-3'>
          <div className='flex flex-row items-center gap-3 '>
            {/* 啟用/停用checkbox */}
            <Controller
              control={control}
              name={`bankTransfer.enable`}
              render={({ field }) => (
                <div className='flex flex-row gap-3'>
                  <Input
                    type='checkbox'
                    className='w-5 h-5 rounded-full'
                    checked={field.value}
                    onChange={e => field.onChange(e.target.checked)}
                  />
                  <Text variant='content'>銀行轉帳</Text>
                </div>
              )}
            />
          </div>

          {eventBlock.bankTransfer?.enable && (
            <>
              <div className='flex w-full py-2'>
                <div className='w-full h-[1px] border block' />
              </div>
              {!eventBlock.bankTransfer.id && (
                <div className='w-full h-[140px] flex items-center  justify-center bg-gray-100 rounded-xl p-4 gap-1'>
                  <Button
                    variant='primary'
                    type='button'
                    onClick={addBankAccount}
                  >
                    <Text variant='content' color='white'>
                      + 新增收款帳戶
                    </Text>
                  </Button>
                </div>
              )}

              {/* 收款帳戶編輯 */}
              {eventBlock.bankTransfer.id &&
                editingPaymentType === 'bankTransfer.info' && (
                  <div
                    className='flex flex-col p-4 rounded-md border gap-2.5 w-full'
                    onClick={e => e.stopPropagation()}
                  >
                    <div className='flex flex-col gap-4 w-full'>
                      <div className='w-full h-fit flex flex-row items-center justify-between'>
                        <Text variant='content' className='w-full text-start '>
                          收款帳戶
                        </Text>
                        {/* 常用帳戶 */}
                        {preferPayment.length > 0 && (
                          <Button
                            variant='primary'
                            type='button'
                            className=' px-2 py-3 gap-1 rounded-md'
                            onClick={e => {
                              e.stopPropagation();
                              const isOpen = !openPreferAccount;
                              setOpenPreferAccount(isOpen);
                            }}
                          >
                            <span className='w-5 h-5 rounded-full bg-gray-200 inline-block' />
                            <Text variant='content' color='white' className=''>
                              常用帳戶
                            </Text>
                          </Button>
                        )}
                      </div>
                      <div className='flex flex-col items-center justify-center rounded-xl p-4 gap-6 w-full'>
                        {/* bankName & branchName */}
                        <div className='flex flex-row gap-6 w-full'>
                          {/* 銀行名稱 */}
                          <div className='flex flex-col gap-2 w-1/2'>
                            <Text variant='content'>銀行名稱*</Text>
                            <Controller
                              control={control}
                              name='bankTransfer.bankName'
                              render={({ field }) => (
                                <Select
                                  onValueChange={val => field.onChange(val)}
                                >
                                  <SelectTrigger className='w-full bg-white'>
                                    <SelectValue placeholder='篩選' />
                                  </SelectTrigger>
                                  <SelectContent className='bg-white'>
                                    <SelectItem value='all'>全部</SelectItem>
                                    <SelectItem value='active'>活躍</SelectItem>
                                    <SelectItem value='inactive'>
                                      停用
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.bankTransfer?.bankName && (
                              <Text variant='content' color='red'>
                                {errors.bankTransfer.bankName.message}
                              </Text>
                            )}
                          </div>
                          {/* 分支名稱 */}
                          <div className='flex flex-col gap-2 w-1/2'>
                            <Text variant='content'>分行名稱*</Text>
                            <Controller
                              control={control}
                              name='bankTransfer.branchName'
                              render={({ field }) => (
                                <Select
                                  onValueChange={val => field.onChange(val)}
                                  disabled={!eventBlock.bankTransfer?.bankName}
                                >
                                  <SelectTrigger className='w-full bg-white'>
                                    <SelectValue placeholder='篩選' />
                                  </SelectTrigger>
                                  <SelectContent className='bg-white'>
                                    <SelectItem value='all'>全部</SelectItem>
                                    <SelectItem value='active'>活躍</SelectItem>
                                    <SelectItem value='inactive'>
                                      停用
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.bankTransfer?.branchName && (
                              <Text variant='content' color='red'>
                                {errors.bankTransfer.branchName.message}
                              </Text>
                            )}
                          </div>
                        </div>
                        {/* account & accountName */}
                        <div className='flex flex-row gap-6 w-full'>
                          {/* 用戶名稱 */}
                          <div className='flex flex-col gap-2 w-1/2'>
                            <Text variant='content'>戶名*</Text>
                            <Controller
                              control={control}
                              name='bankTransfer.accountName'
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  type='text'
                                  placeholder='請輸入戶名'
                                  className='w-full'
                                  value={field.value ?? ''}
                                  onChange={e => field.onChange(e.target.value)}
                                />
                              )}
                            />
                            {errors.bankTransfer?.accountName && (
                              <Text variant='content' color='red'>
                                {errors.bankTransfer.accountName.message}
                              </Text>
                            )}
                          </div>
                          {/* 銀行帳號 */}
                          <div className='flex flex-col gap-2 w-1/2'>
                            <Text variant='content'>銀行帳號*</Text>
                            <Controller
                              control={control}
                              name='bankTransfer.account'
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  type='text'
                                  placeholder='請輸入銀行帳號'
                                  className='w-full'
                                  value={field.value ?? ''}
                                  onChange={e => {
                                    if (e.target.value === '')
                                      field.onChange('');
                                    if (!Number(e.target.value)) return;
                                    field.onChange(e.target.value);
                                  }}
                                />
                              )}
                            />
                            {errors.bankTransfer?.account && (
                              <Text variant='content' color='red'>
                                {errors.bankTransfer.account.message}
                              </Text>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* 收款帳戶預覽 */}
              {eventBlock.bankTransfer.id &&
                editingPaymentType !== 'bankTransfer.info' && (
                  <div className='flex flex-col w-full gap-2'>
                    {/* Header & buttons */}
                    <div className='flex flex-row w-full items-center'>
                      <Text variant='content' className='flex-1 text-start '>
                        收款帳戶
                      </Text>
                      <div className='flex flex-row  gap-2.5'>
                        <Button
                          variant='primary'
                          type='button'
                          className='px-2 py-3 gap-1 rounded-md'
                          onClick={e => {
                            e.stopPropagation();
                            setOpenPreferAccount(false);
                            paymentInfoAction('bank', 'edit');
                          }}
                        >
                          <span className='w-5 h-5 rounded-full bg-gray-200 inline-block' />
                          <Text variant='content' color='white'>
                            編輯
                          </Text>
                        </Button>
                        {/* 常用帳戶 */}
                        <Button
                          variant='primary'
                          type='button'
                          className=' px-2 py-3 gap-1 rounded-md'
                          onClick={e => {
                            e.stopPropagation();
                            setEditingPaymentType('null');
                            const isOpen = !openPreferAccount;
                            setOpenPreferAccount(isOpen);
                          }}
                        >
                          <span className='w-5 h-5 rounded-full bg-gray-200 inline-block' />
                          <Text variant='content' color='white'>
                            常用帳戶
                          </Text>
                        </Button>
                      </div>
                    </div>
                    <div className='flex flex-col w-full rounded-xl p-4 gap-4 '>
                      {/* 銀行名稱 跟 分行名稱 */}
                      <div className='gap-2 w-full flex flex-row items-center justify-center'>
                        <div className='flex flex-col gap-0.5 w-1/2'>
                          <Text variant='note'>銀行名稱</Text>
                          <Text variant='content'>
                            {eventBlock.bankTransfer.bankName ??
                              '尚未設定銀行名稱'}
                          </Text>
                        </div>
                        <div className='flex flex-col gap-0.5 w-1/2'>
                          <Text variant='note'>分行名稱</Text>
                          <Text variant='content'>
                            {eventBlock.bankTransfer.branchName ??
                              '尚未設定分行名稱'}
                          </Text>
                        </div>
                      </div>
                      {/* 戶名 跟 銀行帳號 */}

                      <div className='gap-2 w-full flex flex-row items-center justify-center'>
                        <div className='flex flex-col gap-0.5 w-1/2'>
                          <Text variant='note'>戶名</Text>
                          <Text variant='content'>
                            {eventBlock.bankTransfer.accountName ??
                              '尚未設定戶名'}
                          </Text>
                        </div>
                        <div className='flex flex-col gap-0.5 w-1/2'>
                          <Text variant='note'>銀行帳戶</Text>
                          <Text variant='content'>
                            {eventBlock.bankTransfer.account ??
                              '尚未設定銀行帳戶'}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              {/* 付款說明 */}
              {eventBlock.bankTransfer.description !== undefined ? (
                editingDescriptionType === 'bank' ? (
                  <div
                    className='rounded-md border p-4 gap-2.5 flex flex-col'
                    onClick={e => e.stopPropagation()}
                  >
                    <div className='flex flex-row items-center justify-between'>
                      <Text variant='content'>付款說明</Text>
                      <Button
                        variant='primary'
                        type='button'
                        onClick={e => descriptionAction(e, 'bank', 'delete')}
                        className='rounded-md border px-3 py-2 gap-1 flex flex-row'
                      >
                        <span className='inline-block w-5 h-5 rounded-full bg-gray-300' />
                        <Text variant='content' color='white'>
                          移除
                        </Text>
                      </Button>
                    </div>
                    <Controller
                      control={control}
                      name='bankTransfer.description'
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          placeholder='請輸入付款說明，例如：「請於轉帳後告知帳號後五碼，以便核對。」'
                          value={field.value ?? ''}
                          onChange={e => field.onChange(e.target.value)}
                        />
                      )}
                    />
                  </div>
                ) : (
                  <div className='flex flex-col w-full gap-2'>
                    {/* Header & buttons */}
                    <div className='flex flex-row w-full items-center'>
                      <Text variant='content' className='flex-1 text-start '>
                        付款說明
                      </Text>
                      <div className='flex flex-row  gap-2.5'>
                        <Button
                          variant='primary'
                          type='button'
                          className='px-2 py-3 gap-1 rounded-md'
                          onClick={e => {
                            descriptionAction(e, 'bank', 'edit');
                          }}
                        >
                          <span className='w-5 h-5 rounded-full bg-gray-200 inline-block' />
                          <Text variant='content' color='white'>
                            編輯
                          </Text>
                        </Button>
                        {/* 常用帳戶 */}
                        <Button
                          variant='primary'
                          type='button'
                          className=' px-2 py-3 gap-1 rounded-md'
                          onClick={e => {
                            descriptionAction(e, 'bank', 'delete');
                          }}
                        >
                          <span className='w-5 h-5 rounded-full bg-gray-200 inline-block' />
                          <Text variant='content' color='white'>
                            移除
                          </Text>
                        </Button>
                      </div>
                    </div>
                    <div className='rounded-md p-3 gap-2.5 w-full min-h-[88px]'>
                      <Text variant='content'>
                        {eventBlock.bankTransfer.description}
                      </Text>
                    </div>
                  </div>
                )
              ) : (
                <div
                  className='px-3 py-2 gap-2 cursor-pointer'
                  onClick={e => descriptionAction(e, 'bank', 'add')}
                >
                  <Text variant='content'>+</Text>
                  <Text variant='content'>新增付款說明</Text>
                </div>
              )}
            </>
          )}
        </div>

        {/* ------------ 現場付款 ------------ */}
        <div className='flex flex-col rounded-xl w-full p-4 gap-3'>
          {/* 啟/停用 checkbox */}
          <div className='flex flex-row items-center gap-3 '>
            <Controller
              control={control}
              name={`cashpayment.enable`}
              render={({ field }) => (
                <div className='flex flex-row gap-3'>
                  <Input
                    type='checkbox'
                    className='w-5 h-5 rounded-full'
                    checked={field.value}
                    onChange={e => field.onChange(e.target.checked)}
                  />
                  <Text variant='content'>現場付費</Text>
                </div>
              )}
            />
          </div>

          {eventBlock.cashpayment?.enable && (
            <div>
              <div className='flex w-full py-2'>
                <div className='w-full h-[1px] border block' />
              </div>
              {/* 付款說明 */}
              {eventBlock.cashpayment.description !== undefined ? (
                editingDescriptionType === 'cash' ? (
                  <div
                    className='rounded-md border p-4 gap-2.5 flex flex-col'
                    onClick={e => e.stopPropagation()}
                  >
                    <div className='flex flex-row items-center justify-between'>
                      <Text variant='content'>付款說明</Text>
                      <Button
                        variant='primary'
                        type='button'
                        onClick={e => descriptionAction(e, 'cash', 'delete')}
                        className='rounded-md border px-3 py-2 gap-1 flex flex-row'
                      >
                        <span className='inline-block w-5 h-5 rounded-full bg-gray-300' />
                        <Text variant='content' color='white'>
                          移除
                        </Text>
                      </Button>
                    </div>
                    <Controller
                      control={control}
                      name='cashpayment.description'
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          placeholder='請輸入付款說明，例如：「請於轉帳後告知帳號後五碼，以便核對。」'
                          value={field.value ?? ''}
                          onChange={e => field.onChange(e.target.value)}
                        />
                      )}
                    />
                  </div>
                ) : (
                  <div className='flex flex-col w-full gap-2'>
                    {/* Header & buttons */}
                    <div className='flex flex-row w-full items-center'>
                      <Text variant='content' className='flex-1 text-start '>
                        付款說明
                      </Text>
                      <div className='flex flex-row  gap-2.5'>
                        <Button
                          variant='primary'
                          type='button'
                          className='px-2 py-3 gap-1 rounded-md'
                          onClick={e => {
                            descriptionAction(e, 'cash', 'edit');
                          }}
                        >
                          <span className='w-5 h-5 rounded-full bg-gray-200 inline-block' />
                          <Text variant='content' color='white'>
                            編輯
                          </Text>
                        </Button>
                        {/* 常用帳戶 */}
                        <Button
                          variant='primary'
                          type='button'
                          className=' px-2 py-3 gap-1 rounded-md'
                          onClick={e => {
                            descriptionAction(e, 'cash', 'delete');
                          }}
                        >
                          <span className='w-5 h-5 rounded-full bg-gray-200 inline-block' />
                          <Text variant='content' color='white'>
                            移除
                          </Text>
                        </Button>
                      </div>
                    </div>
                    <div className='rounded-md p-3 gap-2.5 w-full min-h-[88px]'>
                      <Text variant='content'>
                        {eventBlock.cashpayment.description}
                      </Text>
                    </div>
                  </div>
                )
              ) : (
                <div
                  className='px-3 py-2 gap-2 cursor-pointer'
                  onClick={e => descriptionAction(e, 'cash', 'add')}
                >
                  <Text variant='content'>+</Text>
                  <Text variant='content'>新增付款說明</Text>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
