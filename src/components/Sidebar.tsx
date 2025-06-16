'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className='bg-zinc-950 text-zinc-200 w-48 p-4 space-y-4'>
      <div className='flex items-center justify-center'>
        <Image
          src='/VasaraLogo.png'
          alt='Vasara Logo'
          width={152}
          height={152}
        />
      </div>

      <nav className='space-y-2'>
        <Link href='/' className='block hover:text-cyan-400'>
          Dashboard
        </Link>

        <Link href='/settings' className='block hover:text-cyan-400'>
          Settings
        </Link>
      </nav>
    </aside>
  );
}
