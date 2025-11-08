import type { Kysely } from "kysely";
import type { DB } from "../types.js";
import countries from "i18n-iso-countries";
import countryToCurrency from "country-to-currency";

interface SeedCountry {
    name: string;
    alpha2: string;
    alpha3: string;
    currency: string;
}

const getCountries = () => {
    const countryNames = countries.getNames("en", { select: "official" });
    const threeCharCodes = countries.getAlpha2Codes();

    const countryData = Object.entries(countryNames).map(([alpha2, name]) => {
        const alpha3 = threeCharCodes[alpha2];
        const currency =
            countryToCurrency[alpha2 as keyof typeof countryToCurrency];
        return {
            name,
            alpha2,
            alpha3,
            currency,
        } satisfies SeedCountry;
    });

    return countryData;
};

const writeCountries = (db: Kysely<DB>, countries: SeedCountry[]) =>
    db.insertInto("stratify.countries").values(countries);

export async function seed(db: Kysely<DB>): Promise<void> {
    const countryData = getCountries();
    await writeCountries(db, countryData).execute();
}
