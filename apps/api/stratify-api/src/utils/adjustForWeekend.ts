export const adjustForWeekend = (date: Date) => {
    const adjusted = new Date(date);
    const day = adjusted.getDay();

    if (day === 0 || day === 6) {
        adjusted.setDate(adjusted.getDate() - (day === 0 ? 2 : 1));
    }

    return adjusted;
};
