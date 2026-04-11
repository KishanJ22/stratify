import enCountries from "./en/countries.json";
import en from "./en/messages.json";

const messages = {
    en: {
        ...en,
        countries: enCountries,
    },
};

export default messages;
