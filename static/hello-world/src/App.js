import React, { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';
import { ec as EC } from 'elliptic'
function App() {
  const [data, setData] = useState(null);

  useEffect(async () => {
    const ec = new EC('secp256k1')
    var key = await ec.genKeyPair();
    console.info('key',key)
    invoke('getText', { example: 'my-invoke-variable' }).then(setData);
  }, []);

  return (
    <div>
      {data ? data : 'Loading...'}
    </div>
  );
}

export default App;
