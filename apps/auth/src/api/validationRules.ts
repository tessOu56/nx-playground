import * as yup from 'yup';

export const usernameValidation = yup
  .string()
  .required('請輸入帳號')
  .matches(/^[a-zA-Z0-9_.]+$/, '帳號只能包含英數字、"." 或 "_"')
  .min(8, '帳號長度需在 8 到 20 個字元之間')
  .max(20, '帳號長度需在 8 到 20 個字元之間');

export const passwordValidation = yup
  .string()
  .required('請輸入密碼')
  .matches(/(?=.*[A-Za-z])(?=.*\d)/, '密碼必須包含至少一個字母和數字')
  .min(8, '密碼長度需在 8 到 12 個字元之間')
  .max(12, '密碼長度需在 8 到 12 個字元之間');

export const tempPasswordValidation = yup.string().required('請輸入密碼');

export const nameValidation = yup
  .string()
  .required('請輸入名稱')
  .matches(
    /^(?!.*\s{2,})[a-zA-Z0-9_.\u4e00-\u9fa5 ]+$/,
    '名稱僅能包含中英文、數字或 "_"'
  ) // 一格空格 ok, 但連續空格不行
  .min(1, '名稱最短 1 個字元')
  .max(20, '名稱最長 20 個字元');

export const emailValidation = yup
  .string()
  .matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
    '這看起來不像信箱地址'
  )
  .required('請輸入信箱');

export const avatarValidation = yup.string().required('請選擇頭貼');
