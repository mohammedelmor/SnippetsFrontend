'use client';

import {signIn} from "next-auth/react";
import {Button} from "@nextui-org/react";

export default function RequiredLogin() {
return (
    // make a nice looking page to show when the user is not logged in using tailwind and next ui and center it in the page
    <div className="flex justify-center items-center h-screen">
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-10">You need to be logged in to view this page</h1>
            <Button color="primary"
                    variant="bordered"
                    onClick={() => signIn()}>
                Sign in
            </Button>
        </div>
    </div>
  );

}