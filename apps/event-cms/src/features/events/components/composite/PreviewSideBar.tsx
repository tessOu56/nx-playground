import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from '@nx-playground/ui-components';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { MockDataManager, type PreferPaymentItem } from '../../mock/mockAPI';
import { usePreviewStore } from '../../stores';
import { type EventFormValue } from '../../types';
import { Text } from '../core';

export function PreviewSideBar() {
  const isOpenPrefer = usePreviewStore(state => state.openPreferAccount);
  const { getValues, setValue } = useFormContext<EventFormValue>();
  const { setPreferPayment } = usePreviewStore();
  const PreferPayment = usePreviewStore(state => state.preferPayment);

  const [editingIdx, setEditingIdx] = useState(-1);
  const [buttonDisable, setButtonDisable] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [tempEditPayment, setTempEditPayment] = useState<PreferPaymentItem>({
    id: Date.now().toString(),
    bankName: '',
    branchName: '',
    account: '',
    accountName: '',
    type: 'ATM',
  });

  const { addToast } = useToast();

  // 取得常用帳戶
  useEffect(() => {
    const fetchData = async () => {
      const response = await MockDataManager.getPreferPayment();
      setPreferPayment(response);
    };
    fetchData();
  }, []);

  // 關閉常用帳戶編輯時
  useEffect(() => {
    if (!isOpenPrefer) setEditingIdx(-1);
  }, [isOpenPrefer]);
  useEffect(() => {
    if (isCreating) setIsCreating(false);
  }, []);

  useEffect(() => {
    console.log(PreferPayment);
  }, [PreferPayment]);

  // 控制完成按鈕是否可用
  useEffect(() => {
    if (
      !tempEditPayment.account ||
      !tempEditPayment.accountName ||
      !tempEditPayment.bankName ||
      !tempEditPayment.branchName ||
      tempEditPayment.account.toString().length < 9
    ) {
      setButtonDisable(true);
    } else {
      setButtonDisable(false);
    }
  }, [tempEditPayment]);

  // 選擇常用帳戶
  const clickPreferPayment = (item: PreferPaymentItem) => {
    setEditingIdx(-1);
    const oldPayment = getValues('bankTransfer');
    const newPayment = {
      ...oldPayment,
      id: item.id,
      accountName: item.accountName,
      account: item.account,
      bankName: item.bankName,
      branchName: item.branchName,
    };
    setValue('bankTransfer', newPayment);
  };

  // 開啟編輯
  const handleOpenEdit = (
    e: React.MouseEvent,
    item: PreferPaymentItem,
    idx: number
  ) => {
    e.stopPropagation();
    const newTempPayment = {
      id: item.id,
      bankName: item.bankName ?? '',
      branchName: item.branchName ?? '',
      account: item.account ?? NaN,
      accountName: item.accountName ?? '',
      type: item.type ?? 'ATM',
    };
    setTempEditPayment(newTempPayment);
    setEditingIdx(idx);
  };

  // 完成編輯
  const handleFinishEdit = async (id: string, update: PreferPaymentItem) => {
    console.log('PreviewSideBar,', update);
    await MockDataManager.updatePreferPayment(id, update);

    usePreviewStore.setState(state => {
      const updated = state.preferPayment.map(p =>
        p.id === id
          ? {
              ...p,
              branchName: update.branchName ?? '',
              bankName: update.bankName ?? '',
              account: update.account ?? NaN,
              accountName: update.accountName ?? '',
            }
          : p
      );
      return { preferPayment: updated };
    });

    setEditingIdx(-1);
    setIsCreating(false);
  };

  // 刪除常用帳戶
  const handleDeletePreferPayment = (id: string) => {
    const oldPayment = PreferPayment;
    const deletedPaymentIndex = PreferPayment.findIndex(p => p.id === id);
    if (deletedPaymentIndex === -1) return;

    const deletedPayment = oldPayment[deletedPaymentIndex];
    const newPayment = PreferPayment.filter(p => p.id !== id);
    setPreferPayment(newPayment);

    const currentPaymentId = getValues('bankTransfer.id');
    if (currentPaymentId !== deletedPayment.id) return;
    if (PreferPayment.length === 1) return;

    if (deletedPaymentIndex === PreferPayment.length - 1) {
      const newBankTransfer = PreferPayment[deletedPaymentIndex - 1];
      setValue('bankTransfer', { ...newBankTransfer, enable: true });
    }
    if (deletedPaymentIndex === 0) {
      const newBankTransfer = PreferPayment[deletedPaymentIndex + 1];
      setValue('bankTransfer', { ...newBankTransfer, enable: true });
    }

    let undo = true;
    setEditingIdx(-1);
    setIsCreating(false);

    // 顯示刪除通知
    addToast({
      message: '常用帳戶已刪除',
      type: 'success',
      duration: 5000,
      action: {
        label: '復原',
        onClick: () => {
          undo = false;
          usePreviewStore.setState(state => {
            const restored = [...state.preferPayment];
            restored.splice(deletedPaymentIndex, 0, deletedPayment);
            return { preferPayment: restored };
          });
          addToast({
            message: '已還原常用帳戶',
            type: 'success',
            duration: 5000,
          });
        },
      },
    });

    // 5 秒後確認是否真的刪除
    setTimeout(async () => {
      if (undo) {
        await MockDataManager.deletePreferPayment(id);
      }
    }, 5000);
  };

  // 新增常用帳戶
  const handleAddPreferPayment = () => {
    const newTempPayment = {
      id: Date.now().toString(),
      bankName: tempEditPayment.bankName || '',
      branchName: tempEditPayment.branchName || '',
      account: tempEditPayment.account || '',
      accountName: tempEditPayment.accountName || '',
      type: 'ATM',
    };
    setPreferPayment([newTempPayment, ...PreferPayment]);
    setTempEditPayment({
      id: Date.now().toString(),
      bankName: '',
      branchName: '',
      account: '',
      accountName: '',
      type: 'ATM',
    });
    setIsCreating(false);
    setEditingIdx(-1);
  };

  return (
    <div
      className='w-[360px] py-4 gap-6'
      onClick={() => {
        setEditingIdx(-1);
      }}
    >
      {isOpenPrefer && (
        <div className='w-full py-4 px-6 gap-6 flex flex-col items-center justify-center'>
          <Text variant='title'>常用帳戶</Text>

          <Button
            variant='primary'
            type='button'
            className={`w-full ${isCreating ? 'hidden' : ''}`}
            onClick={() => {
              setTempEditPayment({
                id: Date.now.toString(),
                bankName: '',
                branchName: '',
                account: '',
                accountName: '',
                type: 'ATM',
              });
              setIsCreating(true);
            }}
          >
            <Text variant='content' color='white'>
              + 新增常用帳戶
            </Text>
          </Button>
          {/* 新增 */}
          {isCreating && (
            <div
              className='flex flex-col w-full rounded-xl border p-4 gap-6'
              onClick={e => e.stopPropagation()}
            >
              {/* 銀行名稱 */}
              <div className='flex flex-col gap-2'>
                <Text variant='content'>銀行名稱＊</Text>
                <Select
                  onValueChange={val =>
                    setTempEditPayment({ ...tempEditPayment, bankName: val })
                  }
                  value={tempEditPayment.bankName ?? ''}
                >
                  <SelectTrigger className='w-full bg-white'>
                    <SelectValue placeholder='篩選' />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    <SelectItem value='all'>全部</SelectItem>
                    <SelectItem value='004 車斯銀行'>004 車斯銀行</SelectItem>
                    <SelectItem value='005 台灣銀行'>005 台灣銀行</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 分行名稱 */}
              <div className='flex flex-col gap-2'>
                <Text variant='content'>分行名稱＊</Text>
                <Select
                  onValueChange={val =>
                    setTempEditPayment({ ...tempEditPayment, branchName: val })
                  }
                  value={tempEditPayment.branchName ?? ''}
                  disabled={!tempEditPayment.bankName}
                >
                  <SelectTrigger className='w-full bg-white'>
                    <SelectValue placeholder='篩選' />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    <SelectItem value='all'>全部</SelectItem>
                    <SelectItem value='測試部'>測試部</SelectItem>
                    <SelectItem value='專案部'>專案部</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 戶名 */}
              <div className='flex flex-col gap-2'>
                <Text variant='content'>戶名＊</Text>
                <Input
                  type='text'
                  onClick={e => e.stopPropagation()}
                  value={tempEditPayment.accountName ?? ''}
                  onChange={e =>
                    setTempEditPayment({
                      ...tempEditPayment,
                      accountName: e.target.value,
                    })
                  }
                />
              </div>

              {/* 銀行帳號 */}
              <div className='flex flex-col gap-2'>
                <Text variant='content'>銀行帳號＊</Text>
                <Input
                  type='number'
                  onClick={e => e.stopPropagation()}
                  value={tempEditPayment.account ?? NaN}
                  onChange={e =>
                    setTempEditPayment({
                      ...tempEditPayment,
                      account: e.target.value,
                    })
                  }
                />
              </div>

              {/* 按鈕群 */}
              <div className='flex flex-row justify-between items-center'>
                <Button
                  variant='ghost'
                  type='button'
                  className='py-2 px-3 gap-1'
                  onClick={() => {
                    setIsCreating(false);
                  }}
                >
                  <span className='w-5 h-5 rounded-full bg-gray-200' />
                  刪除
                </Button>

                <Button
                  variant='ghost'
                  type='button'
                  className='py-2 px-3 gap-1'
                  onClick={() => {
                    handleAddPreferPayment();
                  }}
                  disabled={buttonDisable}
                >
                  ✅ 完成編輯
                </Button>
              </div>
            </div>
          )}

          {PreferPayment.map((item, idx) => {
            const currentId = getValues('bankTransfer.id');
            const isCheck = currentId === item.id;

            // 編輯模式
            if (editingIdx === idx && !isCreating) {
              return (
                <div
                  key={item.id}
                  className='flex flex-col w-full rounded-xl border p-4 gap-6'
                  onClick={e => e.stopPropagation()}
                >
                  {/* 銀行名稱 */}
                  <div className='flex flex-col gap-2'>
                    <Text variant='content'>銀行名稱＊</Text>
                    <Select
                      onValueChange={val =>
                        setTempEditPayment({
                          ...tempEditPayment,
                          bankName: val,
                        })
                      }
                      value={tempEditPayment.bankName ?? ''}
                    >
                      <SelectTrigger className='w-full bg-white'>
                        <SelectValue placeholder='篩選' />
                      </SelectTrigger>
                      <SelectContent className='bg-white'>
                        <SelectItem value='all'>全部</SelectItem>
                        <SelectItem value='004 車斯銀行'>
                          004 車斯銀行
                        </SelectItem>
                        <SelectItem value='005 台灣銀行'>
                          005 台灣銀行
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 分行名稱 */}
                  <div className='flex flex-col gap-2'>
                    <Text variant='content'>分行名稱＊</Text>
                    <Select
                      onValueChange={val =>
                        setTempEditPayment({
                          ...tempEditPayment,
                          branchName: val,
                        })
                      }
                      value={tempEditPayment.branchName ?? ''}
                      disabled={!tempEditPayment.bankName}
                    >
                      <SelectTrigger className='w-full bg-white'>
                        <SelectValue placeholder='篩選' />
                      </SelectTrigger>
                      <SelectContent className='bg-white'>
                        <SelectItem value='all'>全部</SelectItem>
                        <SelectItem value='測試部'>測試部</SelectItem>
                        <SelectItem value='專案部'>專案部</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 戶名 */}
                  <div className='flex flex-col gap-2'>
                    <Text variant='content'>戶名＊</Text>
                    <Input
                      type='text'
                      onClick={e => e.stopPropagation()}
                      value={tempEditPayment.accountName ?? ''}
                      onChange={e =>
                        setTempEditPayment({
                          ...tempEditPayment,
                          accountName: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* 銀行帳號 */}
                  <div className='flex flex-col gap-2'>
                    <Text variant='content'>銀行帳號＊</Text>
                    <Input
                      type='number'
                      onClick={e => e.stopPropagation()}
                      value={tempEditPayment.account ?? NaN}
                      onChange={e =>
                        setTempEditPayment({
                          ...tempEditPayment,
                          account: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* 按鈕群 */}
                  <div className='flex flex-row justify-between items-center'>
                    <Button
                      variant='ghost'
                      type='button'
                      className='py-2 px-3 gap-1'
                      onClick={() => handleDeletePreferPayment(item.id)}
                    >
                      <span className='w-5 h-5 rounded-full bg-gray-200' />
                      刪除
                    </Button>

                    <Button
                      variant='ghost'
                      type='button'
                      className='py-2 px-3 gap-1'
                      onClick={() => handleFinishEdit(item.id, tempEditPayment)}
                      disabled={buttonDisable}
                    >
                      ✅ 完成編輯
                    </Button>
                  </div>
                </div>
              );
            }

            // 顯示模式
            return (
              <div
                key={item.id}
                className='gap-4 p-4 border rounded-xl flex group flex-row'
                onClick={() => clickPreferPayment(item)}
              >
                <Input
                  type='radio'
                  checked={isCheck}
                  className='w-5 h-5 rounded-full'
                  onChange={() => clickPreferPayment(item)}
                />
                <div className='gap-3'>
                  <Text variant='content' className='w-full'>
                    {item.bankName} | {item.branchName}
                  </Text>
                  <Text variant='note' className='w-full'>
                    {item.accountName}
                  </Text>
                  <Text variant='note' className='w-full'>
                    {item.account}
                  </Text>
                </div>
                <Button
                  variant='primary'
                  type='button'
                  className='w-8 h-8 rounded-full hidden group-hover:flex'
                  onClick={e => handleOpenEdit(e, item, idx)}
                >
                  <Text variant='content' color='white'>
                    編輯
                  </Text>
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
