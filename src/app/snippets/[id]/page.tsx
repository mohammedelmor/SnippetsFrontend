'use client';
import {signIn, useSession} from "next-auth/react";
import {Snippet} from "@/types";
import {useEffect, useState} from "react";
import {fetchSnippetById} from "@/lib/fetchSnippet";
import {Editor} from "@monaco-editor/react";
import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/react";
import {router} from "next/client";
import {useRouter} from "next/navigation";
import {deleteSnippetById} from "@/lib/deleteSnippet";
import {updateSnippet} from "@/lib/UpdateSnippet";


const SnippetContainer = (props: any) => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const router = useRouter();
    const {data: session, status} = useSession();
    const [snippet, setSnippet] = useState<Snippet | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
        if (session) {
            // @ts-ignore
            if (session?.error === "RefreshAccessTokenError") {
                signIn(); // Force sign in to hopefully resolve error
            }
        }
    }, [session]);
    useEffect(() => {
        if (session) {
            console.log(props.params.id)
            // @ts-ignore
            fetchSnippetById(session.accessToken, props.params.id)
                .then(data => {
                    console.log(data)
                    setSnippet(data);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setIsLoading(false);
                });
        }
    }, [session]);

    const onEdit = () => {
        router.push(`/snippets/${props.params.id}/edit`)
    }

    const onDelete = async () => {
        if (session) {
            try {
                // @ts-ignore
                await deleteSnippetById(session.accessToken, snippet.id);
                router.push(`/`)
            } catch (err) {
                console.error(err);
            }
        }
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!snippet) {
        return <div>Snippet not found</div>;
    }

    const canEdit = session?.user?.name === snippet.createdBy;
    // @ts-ignore
    const canDelete = session?.user?.name === snippet.createdBy || session?.user?.roles.includes("admin");
    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col bg-gray-800 text-white">
                <div className="flex justify-between p-4 bg-gray-900 text-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-4 text-center">{snippet.title}</h1>
                    <div className="flex gap-1 actions">
                        {canEdit && <Button
                            color="warning"
                            onPress={onEdit}>
                            Edit
                        </Button>}
                        {canDelete && <Button
                            color="danger"
                            onPress={onOpen}>
                            Delete
                        </Button>}
                    </div>
                    <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}
                           isKeyboardDismissDisabled={true}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Delete {snippet?.title}</ModalHeader>
                                    <ModalBody>
                                        Are you sure you want to delete this snippet?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            Close
                                        </Button>
                                        <Button color="danger" onPress={onDelete}>
                                            Yes
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
                <div className="bg-white text-black rounded-lg p-4 m-2">
                    <Editor
                        theme="vs-dark"
                        height="25vh"
                        defaultLanguage={snippet.language}
                        defaultValue={snippet.code}
                        options={{
                            minimap: {enabled: false},
                            readOnly: true,
                            domReadOnly: true
                        }}
                    />
                </div>
            </div>
        </div>
    );
};


export default SnippetContainer;