'use client';
import {Snippet} from "@/types"
import {Chip} from "@nextui-org/chip";
import {Link} from "@nextui-org/react";

type SnippetProps = {
    snippet: Snippet;
}
export default function SnippetCard({snippet} : SnippetProps ) {
    let date = new Date(snippet.createdDate);
    let formatter = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
    let dateString = formatter.format(date);
    return (
        <div className="w-full max-w-md mx-auto bg-zinc-300 rounded-xl shadow-md overflow-hidden md:max-w-2xl m-3 p-4">
            <div className="p-8">
                <Chip color="primary">{snippet.language}</Chip>
                <Link href={`/snippets/${snippet.id}`} className="block mt-1 text-lg leading-tight font-bold text-black hover:text-indigo-500 mb-2">{snippet.title}</Link>
                <p className="text-gray-500 text-sm">{dateString}</p>
                <p className="text-gray-500 text-sm">{snippet.createdBy || "anonymous"}</p>
            </div>
        </div>
    );
}