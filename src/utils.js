import { DateTime } from "luxon";
//retorna uma data a partir de uma string no formato yyyy-MM-dd
export function getDateFromDateString(dateString) {
    if (typeof dateString !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return null;
    }
    const [year, month, day] = dateString.split("-").map(Number);
    const dt = DateTime.utc(year, month, day, 3, 0);
    if (!dt.isValid || dt.year <= 2000)
        return null;
    return dt.toUTC().toJSDate(); // always UTC midnight: 2024-08-27T00:00:00.000Z
}
export function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}
export function formatCurrency(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
//retorna uma string no formato yyyy-MM-dd a partir de uma string no formato iso
export const getDateStringFromISOstring = (isoDate) => {
    if (!isoDate)
        return "";
    const dt = DateTime.fromISO(isoDate, { zone: "utc" });
    return dt.isValid ? dt.toFormat("yyyy-MM-dd") : "";
};
export function getDateStringFromDateObject(date) {
    const dt = DateTime.fromJSDate(date, { zone: "utc" });
    return dt.toFormat("dd/MM/yyyy"); // ou .toLocaleString(DateTime.DATE_SHORT) para pt-BR
}
export const formatDateToISOstring = (date) => {
    return DateTime.fromJSDate(date, { zone: "utc" }).toISO();
};
export const formatDateStringtoISOstring = (dateString) => {
    const dt = DateTime.fromISO(dateString, { zone: "utc" });
    return dt.isValid ? dt.toISO() : "";
};
export const getDateFromISOstring = (ISOstring) => {
    try {
        const date = getDateFromDateString(getDateStringFromISOstring(ISOstring));
        return date;
    }
    catch (error) {
        return null;
    }
};
