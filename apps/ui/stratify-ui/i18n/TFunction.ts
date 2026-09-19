//? Credit to zacol for finding this solution: https://github.com/amannn/next-intl/discussions/1167#discussioncomment-14007049

import type {
	createTranslator,
	Messages,
	NamespaceKeys,
	NestedKeyOf,
} from "next-intl";

export type TFunction<
	NestedKey extends NamespaceKeys<Messages, NestedKeyOf<Messages>> = never,
> = ReturnType<typeof createTranslator<Messages, NestedKey>>;
