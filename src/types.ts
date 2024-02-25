// types.ts
export type Snippet = {
    id: number;
    title: string;
    code: string;
    language: string;
    createdDate: number;
    modifiedDate: number;
    createdBy: string | null;
    modifiedBy: string | null;
};