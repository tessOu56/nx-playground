/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#B34438', // 磚紅色, 主色, 用於 button bg default or disabled 
        primary_light: '#C26960', // 淡磚紅色, 用於 hover
        primary_dark: '#A33E33', // 深磚紅色, 用於 active
        primary_lighter: '#DCA9A3', // 淡紅色, 用於 secondary button disabled
        primary_lightest: '#CC827A', // 最淡磚紅色, 用於 深色背景下 text disabled

        error: '#C81E1E', // 紅色, 用於 error text

        text: '#847166', // 紅棕色, 文字主色
        text_light: '#5B4233', // 淡紅棕色, 用於 hover
        text_dark: '#331301', // 深紅棕色, 用於 active
        text_lighter: '#ADA199', // 淡棕色, 用於 disabled

        base: '#FAF9F4', // 淡米色, 背景色
        border: '#C8D8FF', // 淡藍色, 用於 border

        avatar_default: '#DBE4F7', // 淡藍色, 用於 avatar bg

        line_default: '#06C755', // 綠色, 用於 line button
        line_dark: '#05B44C', // 綠色灰階, 用於 line button hover, #06C755 opacity 90%
        line_darker: '#028B3C', // 綠色灰階, 用於 line button focus, active, #06C755 opacity 70%

        gary_default: '#1E1E1E33', // 灰色主色, 用於 disabled other button
        gray_lightest: '#D9D9D9', // 最淡灰色
        gray_light: '#E5E5E599', // 淡灰色
        gray_lighter: '#BDBDBD', // 更淡灰色
        gray_dark: '#747775', // 深灰色
        gray_darker: '#9D9D9D', // 更深灰色
        gray_darkest: '#1F1F1F', // 最深灰色, 用於 dark text 等

      },
    },
  },
  plugins: [],
}

