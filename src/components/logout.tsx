'use client'
import React from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, useDisclosure} from "@nextui-org/react";
import {useSession, signOut} from "next-auth/react";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";

export default function LogoutDropdown() {
    const {data: session} = useSession()

    const onSignOut = async () => {
        await signOut({
            callbackUrl: "/api/auth/logout",
        });
     }
    if (!session) return null
    return (
        <>
            <Button onPress={() => onSignOut()} color="danger" variant="light">
                Sign Out
            </Button>

        </>
    );
}
