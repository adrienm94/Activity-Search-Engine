import { loadEvents, loadEventsByTitle } from "./services/api";

export function init() {
    console.log("initialisation");
    loadEvents().then(data => {
        showEventsByMonth(data);
    });

    const form = document.querySelector("form");
    form?.addEventListener("submit", submitHandler);

    const nextPage = document.getElementById("next-page-button");
    nextPage?.addEventListener("click", goToNextPage);
}

function showEventsByTitle(data: any) {
    document.getElementById("events")?.replaceChildren();
    showEventsByMonth(data);

}

function showEventsByMonth(data: any) {
    const eventsHTML = buildEventsHTML(data);
    const sectionsArray = eventsHTML[0] as HTMLElement[];
    const sections = eventsHTML[1] as HTMLElement;
    console.log(sectionsArray);
    console.log(sections);
    sectionsArray?.forEach((section) => {
        sections?.appendChild(section);
    })

}

function buildEventsHTML(data: any) {

    if (!document.getElementById("events")) {
        const eventsSection = document.createElement("section");
        const loadingIconSection = document.getElementById("loading-icon-section");
        eventsSection.id = "events";
        loadingIconSection?.insertAdjacentElement("afterend", eventsSection);
    }

    console.log(document.getElementById("events"));

    let sectionsArray: HTMLElement[] = [];

    data.results.forEach((element: any) => {

        let event = JSON.parse(element.event);

        let section = document.createElement("section");
        let titre = document.createElement("h2");
        let fieldVignette = document.createElement("img");
        let fieldDate = document.createElement("h3");
        let description = document.createElement("p");
        let communes = document.createElement("p");
        let lieu = document.createElement("p");
        let acces = document.createElement("p");
        let thematique = document.createElement("p");
        let urlParagraph = document.createElement("p");
        let urlAnchor = document.createElement("a");

        section.className = "event";

        titre.textContent = event.titre?.normalize();
        fieldVignette.src = event.field_vignette.src?.normalize();
        fieldVignette.alt = event.field_vignette.alt?.normalize();
        fieldDate.textContent = event.field_date?.normalize();
        description.innerHTML = event.description?.normalize() || "";
        communes.textContent = event.field_communes?.normalize();
        lieu.textContent = event.field_lieu?.normalize();
        acces.innerHTML = event.field_acces?.normalize() || "";
        thematique.textContent = event.field_thematique?.normalize();
        urlAnchor.href = event.url?.normalize();
        urlAnchor.textContent = event.url?.normalize();

        section.appendChild(titre);
        section.appendChild(fieldVignette);
        section.appendChild(fieldDate);
        section.appendChild(description);
        section.appendChild(communes);
        section.appendChild(lieu);
        section.appendChild(acces);
        section.appendChild(thematique);
        section.appendChild(urlParagraph);
        urlParagraph.appendChild(urlAnchor);

        let loadingIconSection = document.getElementById("loading-icon-section");
        loadingIconSection?.remove();

        sectionsArray.push(section);

    })

    if (document.getElementById("events")?.childElementCount === data.total_count) {
        const nextPage = document.getElementById("next-page-button");
        nextPage?.remove();
    }

    return [sectionsArray, document.getElementById("events")];
}

function goToNextPage(e: Event) {
    console.log("btn cliqué");
    const sections = document.getElementById("events");
    const numberOfEventsShowed = sections?.childElementCount;
    loadEvents(numberOfEventsShowed).then(data => {
        showEventsByMonth(data);
    }
    );
}

function submitHandler(e: Event) {
    e.preventDefault();
    const title = document.querySelector("input[name='title']") as HTMLInputElement;
    const nextPage = document.getElementById("next-page-button");
    nextPage?.remove();
    loadEventsByTitle(title)
        .then(data => {
            console.log(data);
            showEventsByTitle(data);
        });
}