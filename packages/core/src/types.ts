import zod from "zod";

export const TextEntrySchema = zod.strictObject({
	type: zod.literal("text"),
	data: zod.string(),
	createdOn: zod.coerce.date(),
	updatedOn: zod.coerce.date(),
});

export type TextEntry = zod.infer<typeof TextEntrySchema>;

export const EntrySchema = zod.union([TextEntrySchema]);

export type Entry = zod.infer<typeof EntrySchema>;

export const JournalDocumentSchema = zod.strictObject({
	title: zod.string(),
	createdOn: zod.coerce.date(),
	updatedOn: zod.coerce.date(),
	entries: zod.array(EntrySchema),
});

export type JournalDocument = zod.infer<typeof JournalDocumentSchema>;
