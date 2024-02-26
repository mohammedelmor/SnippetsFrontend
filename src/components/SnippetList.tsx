// pages/SnippetList.tsx
import { fetchSnippets } from '@/lib/fetchSnippets';
import SnippetCard from "@/components/SnippetCard";
import {GetSessionParams, getSession} from "next-auth/react";
import {Snippet} from "@/types";

type SnippetListProps = {
    snippets: Snippet[];
};

export default function SnippetList({snippets} : SnippetListProps) {
    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-4 gap-3">
                {snippets.map((snippet) => (
                    <SnippetCard key={snippet.id} snippet={snippet}/>
                ))}
            </div>
        </div>
    );
}

// pages/SnippetList.tsx
// export async function getServerSideProps(context: GetSessionParams | undefined) {
//     const session = await getSession(context);
//     if (!session) {
//         return {
//             redirect: {
//                 destination: '/login',
//                 permanent: false,
//             },
//         }
//     }
//
//     try {
//         // @ts-ignore
//         const [id] = await fetchSnippets(session.accessToken);
//         return {
//             props: {
//                 [id],
//             },
//         };
//     } catch (error) {
//         console.error('Failed to fetch [id]:', error);
//         return {
//             props: {
//                 [id]: [],
//             },
//         };
//     }
// }