import type { Kysely } from "kysely";
import type { DB } from "../types.js";
import currencyCodes from "currency-codes";

interface SeedCurrency {
    code: string;
    name: string;
}

const otherCurrencies = [
    {
        code: "GBX",
        name: "British Pence",
    },
] satisfies SeedCurrency[];

const insertCurrencies = (db: Kysely<DB>, currencies: SeedCurrency[]) =>
    db
        .insertInto("stratify.currencies")
        .values(currencies)
        .onConflict((c) => c.column("code").doNothing());

const getCurrencies = () =>
    currencyCodes.codes().reduce((acc, code) => {
        const currency = currencyCodes.code(code);

        if (currency?.code && currency?.currency) {
            acc.push({
                code: currency.code,
                name: currency.currency,
            });
        }

        return acc;
    }, [] as SeedCurrency[]);

export async function seed(db: Kysely<DB>) {
    const currencies = [...getCurrencies(), ...otherCurrencies];
    await insertCurrencies(db, currencies).execute();
}
