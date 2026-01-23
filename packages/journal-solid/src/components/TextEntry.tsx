import type { TextEntry as TextEntryType } from "@durandj/journal-core";
import type { VoidComponent } from "solid-js";

type Props = {
	entry: TextEntryType;
};

const TextEntry: VoidComponent<Props> = (props) => (
	<div class="p-1">
		<div class="card card-border bg-base-300 inline-block">
			<p class="card-body">
				{props.entry.data}
				<em>{props.entry.updatedOn.toISOString()}</em>
			</p>
		</div>
	</div>
);

export default TextEntry;
