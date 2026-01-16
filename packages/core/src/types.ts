import zod from "zod";

// TODO: dates

export const TextEntrySchema = zod.strictObject({
	type: zod.literal("text"),
	data: zod.string(),
});

export type TextEntry = zod.infer<typeof TextEntrySchema>;

export const EntrySchema = zod.union([TextEntrySchema]);

export type Entry = zod.infer<typeof EntrySchema>;

export const JournalDocumentSchema = zod.strictObject({
	entries: zod.array(EntrySchema),
});

export type JournalDocument = zod.infer<typeof JournalDocumentSchema>;
