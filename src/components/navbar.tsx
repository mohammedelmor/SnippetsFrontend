'use client'
import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import {signIn, useSession} from "next-auth/react";
import Logout from "@/components/logout";
export default function Component() {
    const {data: session} = useSession()
    return (
        <Navbar>
            <NavbarBrand>
                <Link href="/" className="font-bold text-inherit">Snippets</Link>
            </NavbarBrand>
            <NavbarContent justify="end">
                {session && <NavbarItem className="hidden lg:flex">
                    <Logout />
                </NavbarItem> }
                {!session && <NavbarItem className="hidden lg:flex">
                    <button onClick={() => signIn()}>Sign in</button>
                </NavbarItem>}
            </NavbarContent>
        </Navbar>
    );
}
