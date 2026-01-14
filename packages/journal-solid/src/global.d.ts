/// <reference types="@solidjs/start/env" />

type OpenFilePickerOptions = {
	excludeAcceptAllOption?: boolean;
	id?: string;
	multiple?: boolean;
	startIn?: FileSystemHandle;
	types: Array<{
		accept: Record<string, string[]>;
		description?: string;
	}>;
};

type SaveFilePickerOptions = {
	excludeAcceptAllOption?: boolean;
	id?: string;
	startIn?: FileSystemHandle;
	suggestedName?: string;
	types: Array<{
		accept: Record<string, string[]>;
		description?: string;
	}>;
};

declare global {
	interface Window {
		showOpenFilePicker: (
			options?: OpenFilePickerOptions,
		) => Promise<FileSystemFileHandle[]>;

		showSaveFilePicker: (
			options?: SaveFilePickerOptions,
		) => Promise<FileSystemFileHandle>;
	}
}

export {}; // Forces the file to be treated as a module
