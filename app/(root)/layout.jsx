import Link from 'next/link';

import React from 'react';

import Image from 'next/image';

import {
  isAuthenticated,
} from '@/lib/actions/auth.action';

import {
  redirect,
} from 'next/navigation';

import NavbarActions
  from '@/components/NavbarActions';

const RootLayout =
  async ({
    children,
  }) => {

    const isUserAuthenticated =
      await isAuthenticated();

    if (
      !isUserAuthenticated
    ) {

      redirect(
        '/sign-in'
      );
    }

    return (

      <div className="root-layout">

        <nav className="flex items-center justify-between">

          {/* LOGO */}

          <Link
            href="/"
            className="flex items-center gap-2"
          >

            <Image
              src="/logo.svg"
              alt="logo"
              height={32}
              width={38}
            />

            <h2 className="text-primary-100">

              CaliPrep
            </h2>
          </Link>

          {/* CLIENT ACTIONS */}

          <NavbarActions />
        </nav>

        {children}
      </div>
    );
  };

export default RootLayout;