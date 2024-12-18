export function loadEvents(offset : number = 0) {
    const url : string = `https://www.herault-data.fr/api/explore/v2.1/catalog/datasets/agenda-evenements-3m/records?order_by=date_et_heure&limit=10&offset=${offset}`;

    return fetch(url)
    .then(response => {return response.json()})
    .then(data => {return data})
    .catch(error => console.error(error))
}

export function loadEventsByTitle(titleInput: HTMLInputElement) {
    const titre: string = titleInput.value;
    return fetch(`https://www.herault-data.fr/api/explore/v2.1/catalog/datasets/agenda-evenements-3m/records?where=event_titre LIKE '${titre}%'`)
        .then(response => {return response.json()})
        .then(data => {return data})
        .catch(error => console.error(error)
        );
}