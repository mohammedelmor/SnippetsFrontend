'use client';
import {Snippet} from "@/types"
import {Chip} from "@nextui-org/chip";
import {Link} from "@nextui-org/react";

type SnippetProps = {
    snippet: Snippet;
}
export default function SnippetCard({snippet} : SnippetProps ) {
    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-3 p-4">
            <div className="p-8">
                <Chip color="primary">{snippet.language}</Chip>
                <Link href={`/snippets/${snippet.id}`} className="block mt-1 text-lg leading-tight font-bold text-black hover:text-indigo-500 mb-2">{snippet.title}</Link>
                <p className="text-gray-500 text-sm">{snippet.createdDate}</p>
                <p className="text-gray-500 text-sm">{snippet.createdBy}</p>
            </div>
        </div>
    );
}