import React, { useEffect, useRef } from 'react';

type Props = {
  totalSupply: number;
};

function Meter({ totalSupply }: Props) {
  const [cursorSize, setCursorSize] = React.useState(0);
  const meterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('here', totalSupply);
    let length = 16;
    if (totalSupply > 4) {
      length = Math.round(((meterRef.current?.offsetWidth ?? 1) * totalSupply) / 150);
    }
    setCursorSize(length);
  }, [meterRef.current?.offsetWidth, totalSupply]);

  console.log(cursorSize);
  return (
    <div className="w-[50rem] mt-16 text-white flex items-center">
      <div>{totalSupply}&nbsp;Minted</div>
      <div ref={meterRef} className="bg-gray-900 h-4 w-full rounded-xl mx-4">
        <div className={`bg-gradient-to-r from-blue-700 to-red-700 h-full rounded-xl`} style={{ width: cursorSize }}>
          <i className="absolute mt-5" style={{ marginLeft: cursorSize }}>
            {150 - totalSupply} tokens left
          </i>
        </div>
      </div>
      <div>150&nbsp;Max&nbsp;Supply</div>
    </div>
  );
}

export default Meter;
