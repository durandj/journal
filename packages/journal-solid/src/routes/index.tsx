import { JournalDocumentSchema } from "@durandj/journal-core";
import { createSignal, type VoidComponent } from "solid-js";

const Home: VoidComponent = () => {
	const [currentFileName, setCurrentOpenFileName] = createSignal<null | string>(
		null,
	);
	const [fileContents, setFileContents] = createSignal("");

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
			setFileContents("");

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

		setFileContents(parseResult.data.entries[0].data);
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
		await writableFile.write(JSON.stringify({ contents: fileContents() }));
		await writableFile.close();
	};

	const onEditorChange = (event: Event) => {
		const textArea = event.currentTarget as HTMLTextAreaElement;

		setFileContents(textArea.value);
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
					disabled={fileContents().length === 0}
				>
					Export
				</button>
			</nav>
			<main>
				<textarea value={fileContents()} onChange={onEditorChange}></textarea>
			</main>
		</>
	);
};

export default Home;
