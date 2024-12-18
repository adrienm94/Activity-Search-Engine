/**
 * Retrieves events ordered by date. To avoid performance issues, it loads only the 10 first events
 * from an offset
 * @param offset 
 * @returns A promise object with data or void if an error occured
 */
export async function loadEvents(offset : number = 0) {
    const url = `https://www.herault-data.fr/api/explore/v2.1/catalog/datasets/agenda-evenements-3m/records?order_by=date_et_heure&limit=10&offset=${offset}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        return console.error(error);
    }
}

/**
 * Retrieves events by title, ordered by date 
 * @param titleInput 
 * @returns A promise object with data or void if an error occured
 */
export async function loadEventsByTitle(titleInput: HTMLInputElement) {
    const titre = titleInput.value;
    try {
        const response = await fetch(`https://www.herault-data.fr/api/explore/v2.1/catalog/datasets/agenda-evenements-3m/records?where=event_titre LIKE '${titre}%'&order_by=date_et_heure`);
        const data = await response.json();
        return data;
    } catch (error) {
        return console.error(error);
    }
}