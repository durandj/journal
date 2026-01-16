import {
	type JournalDocument,
	JournalDocumentSchema,
	TextEntry,
} from "@durandj/journal-core";
import { createSignal, Index, type VoidComponent } from "solid-js";
import { createStore } from "solid-js/store";

function createEmptyDocument(): JournalDocument {
	return {
		entries: [],
	};
}

const Home: VoidComponent = () => {
	const [currentFileName, setCurrentOpenFileName] = createSignal<null | string>(
		null,
	);
	const [document, setDocument] = createStore<JournalDocument>(
		createEmptyDocument(),
	);
	const [newTextEntry, setNewTextEntry] = createSignal("");

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

	const onEditorChange = (event: Event) => {
		const textArea = event.currentTarget as HTMLTextAreaElement;

		setNewTextEntry(textArea.value);
	};

	const addEntryHandler = () => {
		setDocument("entries", (entries) => [
			...entries,
			{ type: "text", data: newTextEntry() } as TextEntry,
		]);
		setNewTextEntry("");
	};

	return (
		<>
			<nav>
				<button type="button" onClick={openFileHandler}>
					Open
				</button>
				<button
					type="button"
					onClick={exportFileHandler}
					disabled={document.entries.length === 0}
				>
					Export
				</button>
			</nav>
			<main>
				<Index each={document.entries}>
					{(entry) => <p>{entry().data}</p>}
				</Index>
				<textarea value={newTextEntry()} onChange={onEditorChange} />
				<button type="button" onClick={addEntryHandler}>
					Add Entry
				</button>
			</main>
		</>
	);
};

export default Home;
