import {
	createTextEntry,
	type Entry,
	type TextEntry,
} from "@durandj/journal-core";
import {
	createSignal,
	For,
	Index,
	Match,
	Show,
	Switch,
	type VoidComponent,
} from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import zod from "zod";

import CreateTextEntryFields from "./CreateTextEntryFields";

export type FormData = Omit<TextEntry, "createdOn" | "updatedOn">;

type Props = {
	onSubmit: (entry: Entry) => void;
};

const CreateEntryForm: VoidComponent<Props> = (props) => {
	const [formData, setFormData] = createStore<Partial<FormData>>({});
	const [errorMessages, setErrorMessages] = createSignal<null | string[]>(
		null,
	);

	const submitHandler = (event: SubmitEvent) => {
		event.preventDefault();

		const validationResult = createEntrySchema.safeParse(formData);
		if (validationResult.error) {
			setErrorMessages(
				validationResult.error.issues.map(
					(issue) => `${issue.path}: ${issue.message}`,
				),
			);

			return;
		}

		setErrorMessages(null);
		setFormData(reconcile({}));

		const entryConstructor =
			entryTypes[validationResult.data.type].constructor;
		const entry = entryConstructor(validationResult.data);
		props.onSubmit(entry);
	};

	return (
		<form onSubmit={submitHandler}>
			<fieldset class="fieldset flex flex-col gap-2 *:w-full">
				<Show when={errorMessages() !== null}>
					<div class="card bg-warning text-warning-content p-2">
						<ul>
							<For each={errorMessages()}>
								{(error) => <li>{error}</li>}
							</For>
						</ul>
					</div>
				</Show>

				<select
					class="select"
					required
					value={formData.type ?? ""}
					onChange={(event) =>
						setFormData({
							type: event.currentTarget.value as FormData["type"],
						})
					}
				>
					<option disabled selected value="">
						Entry type
					</option>

					<Index each={Object.entries(entryTypes)}>
						{(entry) => {
							const [name, details] = entry();

							return (
								<option value={name}>
									{details.displayName}
								</option>
							);
						}}
					</Index>
				</select>

				<Switch>
					<Match when={formData.type === "text"}>
						<CreateTextEntryFields
							onChange={({ data }) => setFormData("data", data)}
						/>
					</Match>
				</Switch>

				<button
					type="submit"
					disabled={formData.type === undefined}
					class="btn btn-primary"
				>
					Create
				</button>
			</fieldset>
		</form>
	);
};

const entryTypes: Record<
	FormData["type"],
	{ displayName: string; constructor: (params: FormData) => Entry }
> = {
	text: {
		displayName: "Text",
		constructor: createTextEntry,
	},
};

const createEntrySchema = zod.strictObject({
	type: zod.literal("text"),
	data: zod.string(),
});

export default CreateEntryForm;
