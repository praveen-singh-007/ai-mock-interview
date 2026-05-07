'use client';

import Image from 'next/image';

import {
  Button,
} from '@/components/ui/button';

import {
  signOut,
} from 'firebase/auth';

import {
  logout,
} from '@/lib/actions/auth.action';
import {
  auth,
} from '@/firebase/client';

import {
  useRouter,
} from 'next/navigation';

const NavbarActions = () => {

  const router =
    useRouter();

  const handleLogout =
  async () => {

    try {

      // clear firebase auth
      await signOut(auth);

      // clear server cookie
      await logout();

      router.replace(
        '/sign-in'
      );

      router.refresh();

    } catch (error) {

      console.log(
        'Logout error:',
        error
      );
    }
  };

  return (

    <div className="flex items-center gap-4">

      <Image
        src="/profile.svg"
        alt="profile"
        width={42}
        height={42}
        className="rounded-full object-cover"
      />

      <Button
        className="btn-secondary"
        onClick={
          handleLogout
        }
      >
        Logout
      </Button>
    </div>
  );
};

export default NavbarActions;