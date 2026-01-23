import type { VoidComponent } from "solid-js";

type Props = {
	onChange: (fields: { data: string }) => void;
};

// TODO: add autogrow for text area
const CreateTextEntryFields: VoidComponent<Props> = (props) => (
	<textarea
		required
		minLength="1"
		placeholder="Entry data"
		onChange={(event) =>
			props.onChange({ data: event.currentTarget.value })
		}
		class="textarea"
	/>
);

export default CreateTextEntryFields;
