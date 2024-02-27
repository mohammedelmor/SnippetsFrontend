import {createContext} from "react";
import {SnippetContextObject, Snippet} from "@/types";
import {any} from "prop-types";

export const SnippetPageContext = createContext<SnippetContextObject>({
    editing: false,
    setEditing: (value:boolean) => {}
})
