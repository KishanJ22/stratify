import countries from "./en/countries.json";
import enGB from "./en/messages.json";

const messages = {
    "en-GB": {
        ...enGB,
        countries: countries,
    },
};

export default messages;
