import { Button } from '@nx-playground/ui-components';
import { useState } from 'react';

export function TextBlockToolbar() {
  const [buttonOnClick, setButtonOnClick] = useState(0);

  return (
    <div className='w-full flex flex-row border-b-1  items-center justify-between p-4'>
      {/* 左側 */}
      <div className='rounded-md border border-border-primary gap-1 p-1'>
        <Button
          type='button'
          onClick={() => setButtonOnClick(0)}
          variant={buttonOnClick === 0 ? 'primary' : 'default'}
        >
          <p>標題</p>
        </Button>
        <Button
          type='button'
          onClick={() => setButtonOnClick(1)}
          variant={buttonOnClick === 1 ? 'primary' : 'default'}
        >
          <p>副標題</p>
        </Button>
        <Button
          type='button'
          onClick={() => setButtonOnClick(2)}
          variant={buttonOnClick === 2 ? 'primary' : 'default'}
        >
          <p>一般文字</p>
        </Button>
        <Button
          type='button'
          onClick={() => setButtonOnClick(3)}
          variant={buttonOnClick === 3 ? 'primary' : 'default'}
        >
          <p>引言</p>
        </Button>
        <Button
          type='button'
          onClick={() => setButtonOnClick(4)}
          variant={buttonOnClick === 4 ? 'primary' : 'default'}
        >
          <p>編號列表</p>
        </Button>
        <Button
          type='button'
          onClick={() => setButtonOnClick(5)}
          variant={buttonOnClick === 5 ? 'primary' : 'default'}
        >
          <p>項目列表</p>
        </Button>
      </div>
      <div className=''>
        <Button
          type='button'
          onClick={() => setButtonOnClick(6)}
          className=''
          variant={buttonOnClick === 6 ? 'primary' : 'default'}
        >
          <p>粗體</p>
        </Button>
        <Button
          type='button'
          onClick={() => setButtonOnClick(7)}
          variant={buttonOnClick === 7 ? 'primary' : 'default'}
        >
          <p>斜體</p>
        </Button>
        <Button
          type='button'
          onClick={() => setButtonOnClick(8)}
          variant={buttonOnClick === 8 ? 'primary' : 'default'}
        >
          <p>連結</p>
        </Button>
      </div>
    </div>
  );
}
