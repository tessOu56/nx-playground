import { Button, useToast } from '@nx-playground/ui-components';
import React, { useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { MockDataManager } from '../../mock/mockAPI';
import {
  type FormFieldType,
  type EventFormValue,
  type FormBlockType,
} from '../../types';
import { useFormStore } from '../../useEventStore';
import { descriptionField, questionField } from '../../utils/fieldsList';
import { Text } from '../core';

import { FormDNDBlock } from './FormDNDBlock';

const fieldTypeLabels: Record<string, string> = {
  text: '單行文字',
  textarea: '多行文字',
  radio: '單選',
  checkbox: '多選',
  date: '日期',
  select: '下拉選單',
  description: '備註說明',
};

// 下方來源欄位
const SourceBox: React.FC<{ field: FormFieldType }> = ({ field }) => {
  const { setValue, getValues } = useFormContext<EventFormValue>();
  const { setEditingFormId } = useFormStore();

  const addField = () => {
    const oldField = getValues('formBlock.fields');
    const newField = { ...field, id: Date.now().toString() };

    setValue('formBlock.fields', [...oldField, newField]);
    setEditingFormId(newField.id);
  };

  return (
    <Button
      type='button'
      variant='primary'
      onClick={addField}
      className='h-fit rounded-md border py-2 px-4 gap-2 flex items-center justify-center'
    >
      <span className='w-5 h-5 bg-white rounded-full' />
      <Text variant='content' color='white'>
        {fieldTypeLabels[field.fieldType] || '未知類型'}
      </Text>
    </Button>
  );
};

// DropArea
const DropArea: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { control, setValue, getValues } = useFormContext<EventFormValue>();
  const { addToast } = useToast();
  const formBlock: FormBlockType = useWatch({ control, name: 'formBlock' }) ?? {
    id: Date.now.toString(),
    formName: '',
    fields: [],
  };
  const { setToggleAreaIndex } = useFormStore();
  const toggleAreaIndex = useFormStore(state => state.toggleAreaIndex);
  const moveField = (from: number, to: number) => {
    const [removed] = formBlock.fields.splice(from, 1);
    const oldField = formBlock.fields;
    oldField.splice(to, 0, removed);
    setValue('formBlock.fields', oldField);
  };

  const deleteField = (e: React.MouseEvent, id: string) => {
    const targetField = formBlock.fields.find(f => f.id === id);
    if (!targetField) return;

    const newFields = formBlock.fields.filter(f => f.id !== id);

    setValue('formBlock.fields', newFields, {
      shouldValidate: true,
      shouldDirty: true,
    });

    addToast({
      message: '欄位已刪除。',
      type: 'success',
      action: {
        label: '復原',
        onClick: () => {
          const latestFields = getValues('formBlock.fields') as FormFieldType[];
          setValue('formBlock.fields', [...latestFields, targetField], {
            shouldValidate: true,
            shouldDirty: true,
          });
        },
      },
    });
  };

  const addField = (e: React.MouseEvent, idx: number, type: string) => {
    setToggleAreaIndex(-1);

    let template: FormFieldType | undefined;
    if (
      ['radio', 'checkbox', 'select', 'text', 'textarea', 'date'].includes(type)
    ) {
      template = questionField.find(f => f.fieldType === type);
    } else if (type === 'description') {
      const [description] = descriptionField;
      template = description;
    }

    if (!template) return;

    const newField: FormFieldType = {
      ...template,
      id: Date.now().toString(),
    };

    const oldField = formBlock.fields;
    oldField.splice(idx + 1, 0, newField);
    setValue('formBlock.fields', oldField);
  };

  return (
    <div
      ref={ref}
      className='bg-background-primary w-full h-fit min-h-120 rounded-md p-4 border gap-2 flex flex-col border-black'
    >
      {formBlock?.fields?.map((field, index) => (
        <div key={field.id}>
          <FormDNDBlock
            field={field}
            index={index}
            moveField={moveField}
            deleteField={deleteField}
          />
          {index !== formBlock.fields.length - 1 && (
            <div className='w-full min-h-4 h-fit group flex relative'>
              <div
                className={`w-full h-0.5 bg-gray-200 ${
                  toggleAreaIndex === index ? 'block' : 'hidden'
                } absolute top-1/2 group-hover:block`}
              />
              <Button
                variant='primary'
                type='button'
                className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 ${
                  toggleAreaIndex === index ? 'block' : 'hidden'
                } group-hover:block`}
                onClick={e => {
                  e.stopPropagation();
                  setToggleAreaIndex(index);
                }}
              >
                +
              </Button>
              {toggleAreaIndex === index && (
                <div className='absolute left-1/2 top-8 flex flex-col bg-background-primary py-3 px-4 gap-2.5 w-fit min-w-[248px] border border-black rounded-md z-10'>
                  <Text variant='note'>問題區塊</Text>

                  {[
                    'radio',
                    'checkbox',
                    'select',
                    'text',
                    'textarea',
                    'date',
                  ].map(type => (
                    <div
                      key={type}
                      className='flex flex-row gap-2 items-center justify-start cursor-pointer'
                      onClick={e => addField(e, index, type)}
                    >
                      <span className='w-4 h-4 rounded-full bg-gray-100 block' />
                      <Text variant='content' className='font-bold'>
                        {fieldTypeLabels[type]}
                      </Text>
                    </div>
                  ))}

                  <Text variant='note'>說明區塊</Text>
                  <div
                    className='flex flex-row gap-2 items-center justify-start cursor-pointer'
                    onClick={e => addField(e, index, 'description')}
                  >
                    <span className='w-4 h-4 rounded-full bg-gray-100 block' />
                    <Text variant='content' className='font-bold'>
                      備註說明
                    </Text>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// 主組件
export const FormMainBlock: React.FC = () => {
  const hasForm = useFormStore(state => state.hasForm);
  const { setHasForm, setOpenApplyTemplate, setToggleAreaIndex, setTemplate } =
    useFormStore();

  const { setValue } = useFormContext<EventFormValue>();

  const addNewForm = () => {
    setValue('formBlock', {
      id: Date.now().toString(),
      formName: 'newForm',
      fields: [],
    });
    setHasForm(true);
  };

  useEffect(() => {
    const fetchTemplate = async () => {
      const response = await MockDataManager.getTemplates();
      if (response.length > 0) setTemplate(response);
    };
    fetchTemplate();
  }, [setTemplate]);

  return (
    <div className='flex flex-col gap-4' onClick={() => setToggleAreaIndex(-1)}>
      {!hasForm && (
        <div className='flex flex-col gap-10 items-center justify-center'>
          <div className='w-full h-8' />
          <div className='flex flex-col gap-6 items-center justify-center'>
            <Button
              variant='primary'
              type='button'
              className='w-fit h-fit rounded-md border py-3 px-18 gap-2.5'
              onClick={addNewForm}
            >
              <Text variant='title' color='white'>
                ＋ 建立新表單
              </Text>
            </Button>

            <Button
              variant='primary'
              type='button'
              className='w-fit h-fit rounded-md border py-3 px-18 gap-2.5'
              onClick={() => setOpenApplyTemplate(true)}
            >
              <Text variant='title' color='white'>
                套用模板
              </Text>
            </Button>
          </div>
          <Text variant='note'>＊若沒有設計表單需求，可以直接前往下一步</Text>
        </div>
      )}

      {hasForm && (
        <>
          {/* DropArea */}
          <DropArea />

          {/* 下方來源欄位 */}
          <div className='flex flex-row flex-wrap rounded-md border border-black h-fit w-full bg-表background-primary p-6 gap-4 relative'>
            <Text
              variant='content'
              className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background-primary gap-2.5 px-3'
            >
              新增表單區塊
            </Text>

            <Text variant='note' className='w-full'>
              問題區塊
            </Text>
            {questionField.map(field => (
              <SourceBox key={field.id} field={field} />
            ))}

            <Text variant='note' className='w-full'>
              說明區塊
            </Text>
            {descriptionField.map(field => (
              <SourceBox key={field.id} field={field} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
