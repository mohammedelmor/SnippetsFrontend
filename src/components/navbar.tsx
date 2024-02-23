'use client'
import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import {signIn, useSession} from "next-auth/react";
import LogoutDropdown from "@/components/logout";
export default function Component() {
    const {data: session} = useSession()
    return (
        <Navbar>
            <NavbarBrand>
                <p className="font-bold text-inherit">Snippets</p>
            </NavbarBrand>
            <NavbarContent justify="end">
                {session && <NavbarItem className="hidden lg:flex">
                    <LogoutDropdown />
                </NavbarItem> }
                {!session && <NavbarItem className="hidden lg:flex">
                    <button onClick={() => signIn()}>Sign in</button>
                </NavbarItem>}
            </NavbarContent>
        </Navbar>
    );
}
