'use client';
import { auth } from '@/utils/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import toast from 'react-hot-toast';
import { LuLogIn } from 'react-icons/lu';

export default function LoginPage() {
  const provider = new GoogleAuthProvider();
  return (
    <>
      <h1>Login</h1>
      <button
        className='font-bold bg-amber-500 hover:bg-amber-400 transition rounded-lg w-full justify-center py-3 px-5 flex space-x-2 items-center'
        onClick={() =>
          signInWithPopup(auth, provider)
            .then((result) => {
              toast.success('Logged In!');
            })
            .catch((error) => {
              toast.error('Caught error Popup closed');
            })
        }>
        <LuLogIn className='w-7 h-7 hover:text-slate-500 transition-colors' />
        <p>Login</p>
      </button>
    </>
  );
}
