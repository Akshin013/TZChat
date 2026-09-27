'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const [instanceId, setInstanceId] = useState<string>('');
  const [apiToken, setApiToken] = useState<string>('');
  
  const handleConnect = () => {
    if (!instanceId || !apiToken) return;
    localStorage.setItem('instanceId', instanceId);
    localStorage.setItem('apiToken', apiToken);
    router.push('/chat');
  
    router.push('/chat');
  }

  return (
    <main className='min-h-screen bg-[#0b0d10] text-white flex items-center justify-center px-5'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='w-14 h-14 mx-auto mb-5 rounded-2xl bg-white flex items-center justify-center text-black text-2xl font-bold'>
            М
          </div>
        
          <h1 className='text-3xl font-semibold tracking-tight'>
            Whatsapp Messenger
          </h1>

          <p className='text-gray-400 mt-2'>
            Подключение к GREEN-API
          </p>
        </div>

        <div className='bg-[#13161b] border bord-white/10 rounded-3xl p-6 shadow-2xl'>
          <div className='space-y-5'>
            <div>
              <label className='block text-sm text-gray-300 mb-2'>
                ID Instance
              </label>
 
              <input
                value={instanceId}
                onChange={(e) => setInstanceId(e.target.value)}
                placeholder='Введите ID Instance'
                className='w-full h-12 rounded-xl bg-[#0d0f13] border border-white/10 px-4 outline-none transition focus:border-white/30 placeholder:text-gray-600'
              />
            </div>

            <div>
              <label className='block text-sm text-gray-300 mb-2'>
                API Token
              </label>

              <input 
                type='password'
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="Введите API Token"
                className="w-full h-12 rounded-xl bg-[#0d0f13] border border-white/10 px-4 outline-none transition focus:border-white/30 placeholder:text-gray-600"
              />
            </div>

            <button 
              onClick={handleConnect}
              className='w-full h-12 rounded-xl cursor-pointer bg-white text-black font-medium transition hover:bg-gray-200 active:scale-[0.98] '>
              Подключиться
            </button>
          </div>
        </div>

        <p className='text-center text-xs text-gray-600 mt-5'>
          GREEN-API * WHATSAPP
        </p>

      </div>

    </main>
  );
}
