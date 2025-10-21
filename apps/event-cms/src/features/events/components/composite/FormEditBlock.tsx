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
import React, { useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import {
  type Control,
  Controller,
  useFormContext,
  useWatch,
} from 'react-hook-form';

import { useFormStore } from '../../stores';
import {
  type EventFormFieldType as FormFieldType,
  type EventFormValue,
} from '../../types';
import { Text } from '../core';

export function FormEditBlock() {
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext<EventFormValue>();
  const { setHasError } = useFormStore();
  const editingFormId = useFormStore(state => state.editingFormId);
  const formBlock = useWatch({ control, name: 'formBlock' }) ?? {
    id: Date.now.toString(),
    formName: '',
    fields: [],
  };
  const { addToast } = useToast();
  const [editingFormIndex, setEditingFormIndex] = useState<number | null>(null);

  // 更新 errors
  useEffect(() => {
    const haserror = !!(
      errors.formBlock?.fields?.length && errors.formBlock?.fields?.length > 0
    );
    setHasError(haserror);
  }, [errors.formBlock, setHasError]);

  // 找到當前編輯的 form field index
  useEffect(() => {
    if (!editingFormId) {
      setEditingFormIndex(null);
      return;
    }
    const idx = formBlock.fields.findIndex(f => f.id === editingFormId);
    setEditingFormIndex(idx !== -1 ? idx : null);
  }, [editingFormId, formBlock.fields]);

  const editingField =
    editingFormIndex !== null ? formBlock.fields[editingFormIndex] : null;

  if (editingFormIndex === null || !editingField) return null;

  // 多選欄位 選項操作函數
  const addNewOption = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newOption: string[] = [...(editingField.options ?? []), '選項'];
    setValue(`formBlock.fields.${editingFormIndex}.options`, newOption);
  };

  const deleteNewOption = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    if (!editingField.options) return;
    if (editingField.options.length <= 2) {
      addToast({
        message: '至少需要保留兩個選項',
        type: 'error',
      });
      return;
    }
    const removedOption = editingField.options[idx];
    const newOptions = editingField.options.filter((_, i) => i !== idx);

    setValue(`formBlock.fields.${editingFormIndex}.options`, newOptions, {
      shouldValidate: true,
      shouldDirty: true,
    });

    addToast({
      message: '選項已刪除。',
      type: 'success',
      action: {
        label: '復原',
        onClick: () => {
          const latest = getValues(
            `formBlock.fields.${editingFormIndex}.options`
          ) as string[];
          setValue(
            `formBlock.fields.${editingFormIndex}.options`,
            [...latest, removedOption],
            {
              shouldValidate: true,
              shouldDirty: true,
            }
          );
        },
      },
    });
  };

  const applyTemplate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const oldField = editingField;
    const newField: FormFieldType = {
      id: editingField.id,
      fieldType: 'text',
      label: '姓名',
      description: '',
      noteContent: '',
      isRequired: true,
      hint: '請輸入姓名',
    };
    setValue(`formBlock.fields.${editingFormIndex}`, newField);
    addToast({
      message: '已套用欄位範本',
      type: 'success',
      action: {
        label: '復原',
        onClick: () => {
          setValue(`formBlock.fields.${editingFormIndex}`, oldField, {
            shouldValidate: true,
            shouldDirty: true,
          });
          addToast({ message: '已還原內容', type: 'success' });
        },
      },
    });
  };

  const moveOption = (from: number, to: number) => {
    if (!editingField.options) return;
    const [removed] = editingField.options.splice(from, 1);
    const oldField = editingField.options;
    oldField.splice(to, 0, removed);
    setValue(`formBlock.fields.${editingFormIndex}.options`, oldField);
  };

  return (
    <div className='w-[360px] h-fit bg-background-primary sticky top-0'>
      <div className='flex flex-col p-6 gap-6 w-full h-fit overflow-y-auto'>
        <Text variant='title'>欄位設定</Text>

        {/* 範本套用 */}
        <div className='flex flex-col gap-2 px-2 py-4 rounded-xl w-[312px] bg-gray-200'>
          <Text variant='content' className='font-bold'>
            套用範本
          </Text>
          <Button
            variant='primary'
            type='button'
            className='w-fit h-fit rounded-full flex flex-row gap-0.5 px-3 py-2'
            onClick={applyTemplate}
          >
            <Text variant='content' color='white'>
              +
            </Text>
            <Text variant='content' color='white'>
              姓名
            </Text>
          </Button>
        </div>

        {editingField.fieldType && (
          <div className='flex flex-col gap-4 rounded-md'>
            {/* 標題 */}
            <div className='flex flex-col gap-2'>
              <Text variant='content' className='font-bold'>
                標題 *
              </Text>
              <Controller
                key={`formBlock.fields.${editingField.id}.label`}
                name={`formBlock.fields.${editingFormIndex}.label`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder='請輸入標題'
                    maxLength={51}
                    className='rounded-md border border-border-primary p-3 gap-2.5'
                  />
                )}
              />
              {errors.formBlock?.fields?.[editingFormIndex]?.label && (
                <span className='text-red-500 text-sm'>
                  {errors.formBlock.fields[editingFormIndex].label?.message}
                </span>
              )}
            </div>

            {/* 提示文字 */}
            {!['radio', 'select', 'checkbox'].includes(
              editingField.fieldType
            ) && (
              <div className='flex flex-col gap-2'>
                <Text variant='content' className='font-bold'>
                  提示文字
                </Text>
                <Controller
                  key={`formBlock.fields.${editingField.id}.hint`}
                  name={`formBlock.fields.${editingFormIndex}.hint`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      placeholder='請輸入提示文字'
                      maxLength={101}
                      className='rounded-md border border-border-primary p-3 gap-2.5'
                    />
                  )}
                />
                {errors.formBlock?.fields?.[editingFormIndex]?.hint && (
                  <span className='text-red-500 text-sm'>
                    {errors.formBlock.fields[editingFormIndex].hint?.message}
                  </span>
                )}
              </div>
            )}

            {/* 說明文字 */}
            <div className='flex flex-col gap-2'>
              <Text variant='content' className='font-bold'>
                說明文字
              </Text>
              <Controller
                key={`formBlock.fields.${editingField.id}.description`}
                name={`formBlock.fields.${editingFormIndex}.description`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder='請輸入說明文字'
                    maxLength={201}
                    className='rounded-md border border-border-primary p-3 gap-2.5'
                  />
                )}
              />
              {errors.formBlock?.fields?.[editingFormIndex]?.description && (
                <span className='text-red-500 text-sm'>
                  {
                    errors.formBlock.fields[editingFormIndex].description
                      ?.message
                  }
                </span>
              )}
            </div>

            {/* 選項欄位 (radio / checkbox / select) */}
            {['radio', 'checkbox', 'select'].includes(
              editingField.fieldType
            ) && (
              <div className='flex flex-col gap-2 items-center'>
                <Text variant='content' className='font-bold w-full text-start'>
                  選項 *
                </Text>
                {editingField.options?.map((opt, idx) => (
                  <DraggableOption
                    key={idx}
                    idx={idx}
                    option={opt}
                    editingFormIndex={editingFormIndex}
                    editingFieldId={editingField.id}
                    moveOption={moveOption}
                    deleteNewOption={deleteNewOption}
                    control={control}
                    error={
                      errors.formBlock?.fields?.[editingFormIndex]?.options?.[
                        idx
                      ]?.message
                    }
                  />
                ))}

                <Button
                  variant='primary'
                  type='button'
                  className='w-fit h-fit rounded-full flex flex-row gap-0.5 px-3 py-2'
                  onClick={addNewOption}
                >
                  <Text variant='content' color='white'>
                    + 新增選項
                  </Text>
                </Button>
              </div>
            )}

            {/* 格式驗證 (text) */}
            {editingField.fieldType === 'text' && (
              <div className='flex flex-col gap-2'>
                <Text variant='content' className='font-bold'>
                  格式驗證 *
                </Text>
                <Controller
                  key={`formBlock.fields.${editingField.id}.fieldType`}
                  name={`formBlock.fields.${editingFormIndex}.fieldType`}
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={val => field.onChange(val)}
                      value={field.value}
                    >
                      <SelectTrigger className='bg-white text-left'>
                        <SelectValue placeholder='選擇選項' />
                      </SelectTrigger>
                      <SelectContent className='bg-white cursor-pointer'>
                        <SelectItem value='text'>
                          <Text variant='content'>文字</Text>
                        </SelectItem>
                        <SelectItem value='number'>
                          <Text variant='content'>數字</Text>
                        </SelectItem>
                        <SelectItem value='tel'>
                          <Text variant='content'>電話</Text>
                        </SelectItem>
                        <SelectItem value='email'>
                          <Text variant='content'>信箱</Text>
                        </SelectItem>
                        <SelectItem value='url'>
                          <Text variant='content'>網址</Text>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}

            {/* 備註說明 */}
            {editingField.fieldType === 'description' && (
              <div className='flex flex-col gap-2'>
                <Text variant='content' className='font-bold'>
                  內文 *
                </Text>
                <Controller
                  key={`formBlock.fields.${editingField.id}.noteContent`}
                  name={`formBlock.fields.${editingFormIndex}.noteContent`}
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      value={field.value ?? ''}
                      maxLength={501}
                      placeholder='說明文字'
                      className='rounded-md border border-border-primary p-3 gap-2.5 h-auto'
                      onInput={e => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = `${target.scrollHeight}px`;
                      }}
                    />
                  )}
                />
                <Text variant='note'>
                  字數{editingField.noteContent.length ?? 0}/500
                </Text>
                {errors.formBlock?.fields?.[editingFormIndex]?.noteContent && (
                  <span className='text-red-500 text-sm'>
                    {
                      errors.formBlock.fields[editingFormIndex].noteContent
                        ?.message
                    }
                  </span>
                )}
              </div>
            )}

            {/* 必填欄位 */}
            {editingField.fieldType && (
              <div className='flex flex-row gap-2 items-center'>
                <Text variant='content'>必填欄位</Text>
                <Controller
                  key={`formBlock.fields.${editingField.id}.isRequired`}
                  name={`formBlock.fields.${editingFormIndex}.isRequired`}
                  control={control}
                  render={({ field }) => {
                    const isChecked = field.value === true;
                    return (
                      <Input
                        type='checkbox'
                        className='w-5 h-5'
                        checked={isChecked}
                        onChange={e => field.onChange(e.target.checked)}
                      />
                    );
                  }}
                />
                {errors.formBlock?.fields?.[editingFormIndex]?.isRequired && (
                  <span className='text-red-500 text-sm'>
                    {
                      errors.formBlock.fields[editingFormIndex].isRequired
                        ?.message
                    }
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

type DraggableOptionProps = {
  idx: number;
  option: string;
  editingFormIndex: number;
  editingFieldId: string;
  moveOption: (dragIndex: number, hoverIndex: number) => void;
  deleteNewOption: (e: React.MouseEvent, idx: number) => void;
  control: Control<EventFormValue>;
  error?: string;
};

export const DraggableOption: React.FC<DraggableOptionProps> = ({
  idx,
  editingFormIndex,
  editingFieldId,
  moveOption,
  deleteNewOption,
  control,
  error,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: 'OPTION',
    hover(dragged: { index: number }) {
      if (!ref.current) return;
      if (dragged.index === idx) return;

      moveOption(dragged.index, idx);
      dragged.index = idx; // 更新拖曳中的 index
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'OPTION',
    item: { index: idx },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className='flex flex-col w-full gap-2'
      style={{ opacity: isDragging ? 0.7 : 1 }}
    >
      <div className='flex flex-row items-center justify-center w-full gap-2'>
        <Controller
          key={`formBlock.fields.${editingFieldId}.options.${idx}`}
          name={`formBlock.fields.${editingFormIndex}.options.${idx}`}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value ?? ''}
              placeholder='請輸入選項文字'
              maxLength={51}
              className='rounded-md border border-border-primary p-3 gap-2.5'
            />
          )}
        />
        <Button
          variant='secondary'
          type='button'
          className='w-8 h-8 rounded-full flex items-center justify-center'
          onClick={e => deleteNewOption(e, idx)}
        >
          ✕
        </Button>
      </div>
      {error && <span className='text-red-500 text-sm'>{error}</span>}
    </div>
  );
};
