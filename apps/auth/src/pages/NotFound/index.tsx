import PrimaryTxtInterLink from '../../components/PrimaryTxtInterLink/PrimaryTxtInterLink';

function NotFound() {
  return (
    <div className='context flex flex-col items-center justify-center h-[500px]'>
      <h1 className='font-bold'>404 - 找不到頁面</h1>
      <p className='my-4'>您要訪問的頁面不存在。</p>
      <PrimaryTxtInterLink txt='回到 APP' to='https://app.oosa.life/' />
    </div>
  );
}

export default NotFound;
