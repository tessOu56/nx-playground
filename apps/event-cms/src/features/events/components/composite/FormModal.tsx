import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  useToast,
} from '@nx-playground/ui-components';
import { useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { MockDataManager } from '../../mock/mockAPI';
import { useFormStore } from '../../stores';
import {
  type EventFormFieldType as FormFieldType,
  type EventFormValue,
} from '../../types';
import { Text } from '../core';

export function FormModal() {
  const formSaveTemplate = useFormStore(state => state.openSaveTemplate);
  const formApplyTemplate = useFormStore(state => state.openApplyTemplate);
  const template = useFormStore(state => state.template);
  const isOpen = formSaveTemplate || formApplyTemplate;

  const { control, setValue } = useFormContext<EventFormValue>();
  const { setOpenSaveTemplate, setOpenApplyTemplate, setHasForm } =
    useFormStore();
  const formBlock = useWatch({ control, name: 'formBlock' }) ?? {
    id: Date.now.toString(),
    formName: '',
    fields: [],
  };
  const { addToast } = useToast();

  const [selectTemplateIndex, setSelectTemplateIndex] = useState<number>(0);

  const handleClickBackGround = () => {
    setOpenSaveTemplate(false);
    setOpenApplyTemplate(false);
  };

  const handleTemplateSave = () => {
    setOpenSaveTemplate(false);
  };

  const handleTemplateApply = () => {
    const oldFormBlock = formBlock;
    setOpenApplyTemplate(false);
    setHasForm(true);
    setValue('formBlock', template[selectTemplateIndex]);
    addToast({
      message: '模板已套用',
      type: 'success',
      action: {
        label: '復原',
        onClick: () => {
          setValue('formBlock', oldFormBlock, {
            shouldValidate: true,
            shouldDirty: true,
          });
          addToast({ message: '已還原表單', type: 'success' });
        },
      },
    });
  };

  const handleTemplateDelete = (id: string) => {
    const deletedTemplateIndex = useFormStore
      .getState()
      .template.findIndex(t => t.id === id);
    if (deletedTemplateIndex === -1) return;

    const deletedTemplate =
      useFormStore.getState().template[deletedTemplateIndex];

    // 先從 store 移除模板
    useFormStore.setState(state => {
      const newTemplate = state.template.filter(t => t.id !== id);
      return { template: newTemplate };
    });
    let undo = true;

    // 顯示刪除通知
    addToast({
      message: '模板已刪除',
      type: 'success',
      duration: 5000,
      action: {
        label: '復原',
        onClick: () => {
          undo = false;

          // 復原模板
          useFormStore.setState(state => {
            const restored = [...state.template];
            restored.splice(deletedTemplateIndex, 0, deletedTemplate);
            setSelectTemplateIndex(deletedTemplateIndex);
            return {
              template: restored,
            };
          });

          addToast({
            message: '已還原模板',
            type: 'success',
            duration: 5000,
          });
        },
      },
    });

    // 5秒後確認是否真的刪除
    setTimeout(() => {
      if (undo) {
        MockDataManager.deleteTemplate(id);
      }
    }, 5000);
  };

  if (!isOpen) return;

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      {/* 遮罩 */}
      <div
        className='absolute inset-0 bg-black opacity-40'
        onClick={handleClickBackGround}
      />

      {/* Save Modal 內容 */}
      {formSaveTemplate && (
        <div className='w-full max-w-[600px] rounded-xl border h-fit bg-white z-40'>
          {/* Header */}
          <div className='flex flex-row gap-2 py-4 px-6 items-center justify-between '>
            <div className='flex gap-2 flex-row items-center justify-start '>
              <Text variant='title'>儲存當前表單為模板</Text>
              <div className='relative group flex justify-start items-center  '>
                <Text
                  variant='content'
                  className='w-5 h-5 rounded-full border border-black  text-center items-center justify-center flex cursor-pointer'
                >
                  ?
                </Text>
                <div className="hidden group-hover:block absolute bottom-8 left-1/2 -translate-x-1/2 px-3 py-2 rounded-md w-fit h-fit bg-black after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-black">
                  <Text
                    variant='note'
                    color='white'
                    className='whitespace-nowrap'
                  >
                    將目前設計的表單儲存為模板，以便日後快速套用
                  </Text>
                </div>
              </div>
            </div>
            <div
              className='flex items-center justify-center w-6 h-6 cursor-pointer'
              onClick={() => setOpenSaveTemplate(false)}
            >
              <Text variant='title'>X</Text>
            </div>
          </div>
          {/* Input */}
          <div className='flex py-4 gap-4'>
            <div className='px-6 gap-2 flex flex-col w-full'>
              <Text variant='content' className='font-bold'>
                模板名稱
              </Text>
              <Controller
                key={`${formBlock.id}.formName`}
                name={'formBlock.formName'}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder='請輸入模板名稱'
                    className='flex-1 gap-2'
                    value={field.value ?? ''}
                  />
                )}
              />
            </div>
          </div>
          {/* Buttons */}
          <div className='flex flex-row p-6 gap-4 justify-end '>
            <Button
              variant='secondary'
              type='button'
              onClick={() => {
                setOpenSaveTemplate(false);
              }}
            >
              <Text variant='content'>取消</Text>
            </Button>
            <Button
              variant='primary'
              type='button'
              className='flex flex-row justify-center items-center py-2 px-4 gap-2.5 rounded-md border border-background-primary'
              onClick={() => {
                handleTemplateSave();
              }}
            >
              <span className='w-5 h-5 rounded-full bg-gray-200 ' />
              <Text variant='content' color='white'>
                儲存為模板
              </Text>
            </Button>
          </div>
        </div>
      )}
      {formApplyTemplate && (
        <div className='w-[928px] rounded-xl border h-fit bg-white z-40'>
          {/* Header */}
          <div className='flex flex-row gap-2 py-4 px-6 items-center justify-between '>
            <div className='flex flex-1 gap-2 flex-row items-center justify-start '>
              <Text variant='title'>套用模板</Text>
              <div className='relative group flex justify-start items-center  '>
                <Text
                  variant='content'
                  className='w-5 h-5 rounded-full border border-black  text-center items-center justify-center flex cursor-pointer'
                >
                  ?
                </Text>
                <div className="hidden group-hover:block absolute bottom-8 left-1/2 -translate-x-1/2 px-3 py-2 rounded-md w-fit h-fit bg-black after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-black">
                  <Text
                    variant='note'
                    color='white'
                    className='whitespace-nowrap'
                  >
                    選擇一個模板套用到當前表單，替換當前表單的所有欄位
                  </Text>
                </div>
              </div>
            </div>
            <div
              className='flex items-center justify-center w-6 h-6 cursor-pointer'
              onClick={() => setOpenApplyTemplate(false)}
            >
              <Text variant='title'>X</Text>
            </div>
          </div>
          {/* content */}
          <div className='flex flex-row gap-6 px-6 h-[616px]'>
            {/* left side - current template */}
            <div className='flex flex-col gap-2 h-full  '>
              <Text variant='note'>現有模板{template.length}/3</Text>
              <div className='flex flex-col gap-2'>
                {template.map((item, index) => {
                  return (
                    <div
                      key={`template-${index}`}
                      className={`w-[368px] flex flex-row rounded-md items-center justify-between border p-2 gap-4 ${
                        selectTemplateIndex === index && 'bg-gray-200'
                      } cursor-pointer`}
                      onClick={() => setSelectTemplateIndex(index)}
                    >
                      <div className='gap-1 flex flex-col w-[294px] justify-center'>
                        <Text variant='content' className='truncate'>
                          {item.formName}
                        </Text>
                        <Text variant='note'>最後編輯時間：2025/07/07</Text>
                      </div>
                      <Text
                        variant='content'
                        className='w-5 h-5 gap-2.5 flex items-center justify-center'
                      >
                        {'>'}
                      </Text>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* right side - template preview */}
            {template[selectTemplateIndex] && (
              <div className='flex flex-row rounded-xl p-6 gap-2'>
                <div className='gap-4 flex flex-1 flex-col'>
                  {/* Template preView */}
                  <div className='rounded-xl w-[440px] flex flex-col h-[484px] overflow-y-auto border gap-6 px-2 pt-4 pb-6'>
                    {/* Form Name & last edit time */}
                    <div className='w-full flex flex-col gap-2 py-4 px-6'>
                      <Text variant='title'>
                        {template[selectTemplateIndex].formName}
                      </Text>
                      <Text variant='note'>最後編輯時間：2025/07/07</Text>
                    </div>
                    {/* Fields */}
                    <div className='flex flex-col px-6 gap-6'>
                      {template[selectTemplateIndex].fields.map(
                        (item, index) => {
                          return (
                            <PreViewFields
                              item={item}
                              key={`PreViewFields-${index}`}
                            />
                          );
                        }
                      )}
                    </div>
                  </div>
                  {/* Buttons */}
                  <div className='flex flex-row items-center justify-center gap-2.5'>
                    <Button
                      variant='primary'
                      type='button'
                      onClick={() =>
                        handleTemplateDelete(template[selectTemplateIndex].id)
                      }
                      className='py-1 gap-2.5 w-14 h-14 rounded-full'
                    >
                      <Text variant='content' color='white'>
                        刪除
                      </Text>
                    </Button>
                    <Button
                      variant='primary'
                      type='button'
                      className='gap-2.5 py-3 px-18  rounded-md border flex-1'
                      onClick={() => handleTemplateApply()}
                    >
                      <Text variant='content' color='white'>
                        套用模板
                      </Text>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface PreViewFieldsProps {
  item: FormFieldType;
}

const PreViewFields: React.FC<PreViewFieldsProps> = ({ item }) => {
  return (
    <div>
      <Text variant='content' className='w-full font-bold'>
        {item.label}
        {item.isRequired ? '*' : ''}
      </Text>
      {(() => {
        switch (item.fieldType) {
          case 'text':
            return (
              <Input
                placeholder={item.hint}
                disabled
                style={{ pointerEvents: 'none' }}
              />
            );
          case 'email':
            return (
              <Input
                type='email'
                placeholder={item.hint}
                disabled
                style={{ pointerEvents: 'none' }}
              />
            );
          case 'number':
            return (
              <Input
                type='number'
                placeholder={item.hint}
                disabled
                style={{ pointerEvents: 'none' }}
              />
            );
          case 'tel':
            return (
              <Input
                type='tel'
                placeholder={item.hint}
                disabled
                style={{ pointerEvents: 'none' }}
              />
            );
          case 'url':
            return (
              <Input
                type='url'
                placeholder={item.hint}
                disabled
                style={{ pointerEvents: 'none' }}
              />
            );
          case 'textarea':
            return (
              <Textarea
                placeholder={item.hint}
                disabled
                style={{ pointerEvents: 'none' }}
              />
            );
          case 'date':
            return (
              <Input
                type='date'
                placeholder={item.hint}
                disabled
                style={{ pointerEvents: 'none' }}
              />
            );
          case 'radio':
            return item.options?.length ? (
              <div className='flex flex-col gap-2'>
                {item.options.map((opt, i) => (
                  <div key={i} className='flex items-center gap-2'>
                    <Input
                      type='radio'
                      disabled
                      style={{ pointerEvents: 'none' }}
                      className='w-5 h-5'
                    />
                    <Text variant='content'>{opt}</Text>
                  </div>
                ))}
              </div>
            ) : null;
          case 'checkbox':
            return item.options?.length ? (
              <div className='flex flex-col gap-2'>
                {item.options.map((opt, i) => (
                  <div key={i} className='flex items-center gap-2'>
                    <Input
                      type='checkbox'
                      disabled
                      style={{ pointerEvents: 'none' }}
                      className='w-5 h-5'
                    />
                    <Text variant='content'>{opt}</Text>
                  </div>
                ))}
              </div>
            ) : null;
          case 'select':
            return item.options?.length ? (
              <Select>
                <SelectTrigger className='bg-white text-left'>
                  <SelectValue placeholder='選擇選項' />
                </SelectTrigger>
                <SelectContent className='bg-white cursor-pointer'>
                  {item.options.map((opt, i) => (
                    <SelectItem value={opt} key={i}>
                      <Text variant='content'>{opt}</Text>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null;
          case 'description':
            return <Text variant='note'>{item.noteContent}</Text>;
          default:
            return null;
        }
      })()}
      <Text variant='content'>{item.description}</Text>
    </div>
  );
};
