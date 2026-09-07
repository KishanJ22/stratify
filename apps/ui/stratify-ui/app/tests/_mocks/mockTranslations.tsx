export const mockNextIntlFactory = () => ({
    useTranslations: (namespace?: string) => {
        const fullKey = (key: string) =>
            namespace ? `${namespace}.${key}` : key;

        const withValues = (key: string, values?: Record<string, unknown>) =>
            values ? `${fullKey(key)} ${JSON.stringify(values)}` : fullKey(key);

        return Object.assign(withValues, {
            markup: withValues,
            raw: fullKey,
            rich: (key: string, values?: Record<string, unknown>) => {
                if (!values) return fullKey(key);

                let content: React.ReactNode = fullKey(key);
                const rest: Record<string, unknown> = {};

                for (const [name, value] of Object.entries(values)) {
                    if (typeof value === "function") {
                        content = value(content);
                    } else {
                        rest[name] = value;
                    }
                }

                return Object.keys(rest).length ? (
                    <>
                        {content} {JSON.stringify(rest)}
                    </>
                ) : (
                    content
                );
            },
        });
    },
    useFormatter: () => ({
        number: (value: number) => String(value),
        dateTime: (value: Date) => value.toISOString(),
    }),
    NextIntlClientProvider: ({ children }: { children: React.ReactNode }) =>
        children,
});
