import {
	type Entry,
	type JournalDocument,
	JournalDocumentSchema,
} from "@durandj/journal-core";
import {
	FaSolidAdd,
	FaSolidClose,
	FaSolidFileExport,
	FaSolidFileImport,
} from "solid-icons/fa";
import { createSignal, Index, type VoidComponent } from "solid-js";
import { createStore } from "solid-js/store";
import CreateEntryForm from "~/components/CreateEntryForm";
import TextEntry from "~/components/TextEntry";

function createEmptyDocument(): JournalDocument {
	const now = new Date();

	return {
		title: now.toISOString().substring(0, 10),
		createdOn: now,
		updatedOn: now,
		entries: [],
	};
}

const Home: VoidComponent = () => {
	let addEntryDialogRef!: HTMLDialogElement;
	const [currentFileName, setCurrentOpenFileName] = createSignal<
		null | string
	>(null);
	const [document, setDocument] = createStore<JournalDocument>(
		createEmptyDocument(),
	);

	const openFileHandler = async (): Promise<void> => {
		const fileHandles = await window.showOpenFilePicker({
			types: [
				{
					accept: {
						"application/json": [".json"],
					},
				},
			],
		});
		if (fileHandles.length === 0) {
			setDocument(createEmptyDocument());

			return;
		}

		const fileHandle = fileHandles[0];
		const file = await fileHandle.getFile();

		const rawFileContents = await file.text();
		const parseResult = JournalDocumentSchema.safeParse(
			JSON.parse(rawFileContents),
		);

		if (parseResult.error) {
			alert(parseResult.error.message);

			return;
		}

		setDocument(parseResult.data);
		setCurrentOpenFileName(file.name);
	};

	const exportFileHandler = async (): Promise<void> => {
		const destinationFile = await window.showSaveFilePicker({
			suggestedName:
				currentFileName() ??
				`${new Date().toISOString().substring(0, 10)}.json`,
			types: [
				{
					accept: {
						"application/json": [".json"],
					},
				},
			],
		});

		const writableFile = await destinationFile.createWritable();
		await writableFile.write(JSON.stringify(document));
		await writableFile.close();
	};

	const openAddEntryDialogHandler = () => {
		addEntryDialogRef.showModal();
	};

	const addEntrySubmitHandler = (entry: Entry) => {
		setDocument("entries", (entries: Entry[]) => [...entries, entry]);

		addEntryDialogRef.close();
	};

	return (
		<>
			<div class="dock dock-md">
				<button type="button" onClick={openFileHandler}>
					<FaSolidFileImport size={18} />
					<span class="dock-label">Open</span>
				</button>
				<button type="button" onClick={openAddEntryDialogHandler}>
					<FaSolidAdd size={24} />
					<span class="dock-label">Add Entry</span>
				</button>
				<button
					type="button"
					onClick={exportFileHandler}
					disabled={document.entries.length === 0}
				>
					<FaSolidFileExport size={18} />
					<span class="dock-label">Export</span>
				</button>
			</div>
			<main class="p-2">
				<Index each={document.entries}>
					{(entry) => <TextEntry entry={entry()} />}
				</Index>
			</main>

			<dialog ref={addEntryDialogRef} class="modal">
				<div class="modal-box">
					<form method="dialog">
						<button
							type="submit"
							class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
						>
							<FaSolidClose />
						</button>
					</form>

					<h3 class="text-lg font-bold">Add Entry</h3>
					<CreateEntryForm onSubmit={addEntrySubmitHandler} />
				</div>

				<form method="dialog" class="modal-backdrop">
					<button type="submit">Close</button>
				</form>
			</dialog>
		</>
	);
};

export default Home;
