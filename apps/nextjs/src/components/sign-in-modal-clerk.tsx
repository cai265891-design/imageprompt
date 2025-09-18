"use client";

import React, { useState } from "react";
import Image from "next/image";
import { OAuthStrategy } from "@clerk/types";
import { useSignIn } from "@clerk/nextjs";

import { Button } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";

import { Modal } from "~/components/modal";
import { siteConfig } from "~/config/site";
import { useSigninModal } from "~/hooks/use-signin-modal";

export const SignInClerkModal = ({
  dict,
}: {
  dict: Record<string, string>;
}) => {
  const signInModal = useSigninModal();
  const [signInClicked, setSignInClicked] = useState(false);
  const { signIn } = useSignIn();

  if (!signIn) {
    return null;
  }

  const signInWith = (strategy: OAuthStrategy) => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    return signIn
      .authenticateWithRedirect({
        strategy,
        redirectUrl: "/sign-in/sso-callback",
        redirectUrlComplete: `${protocol}//${host}/dashboard`,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err: any) => {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.log(err.errors);
        console.error(err, null, 2);
      });
  };

  return (
    <Modal showModal={signInModal.isOpen} setShowModal={signInModal.onClose}>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-neutral-200 dark:border-neutral-800 bg-background px-4 py-6 pt-8 text-center md:px-16">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
            <Icons.Image className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-urban text-2xl font-bold">ImagePrompt</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            {dict.privacy}
          </p>
        </div>

        <div className="flex flex-col space-y-4 px-4 py-8 md:px-16">
          <Button
            variant="default"
            disabled={signInClicked}
            onClick={() => {
              setSignInClicked(true);
              void signInWith("oauth_google").then(() => {
                setTimeout(() => {
                  signInModal.onClose();
                }, 1000);
              });
            }}
          >
            {signInClicked ? (
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}{" "}
            Continue with Google
          </Button>
          <Button
            variant="outline"
            disabled={signInClicked}
            onClick={() => {
              setSignInClicked(true);
              void signInWith("oauth_github").then(() => {
                setTimeout(() => {
                  signInModal.onClose();
                }, 1000);
              });
            }}
          >
            {signInClicked ? (
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.GitHub className="mr-2 h-4 w-4" />
            )}{" "}
            {dict.signup_github}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
