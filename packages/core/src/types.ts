export type JournalDocument = {
	entries: Entry[];
};

export type Entry = TextEntry;
export type TextEntry = {
	type: "text";
	data: string;
};
