import { loadEvents, loadEventsByTitle } from "./services/api";

export function init() {

    loadEvents().then(data => {
        showEvents(data);
    });

    const form = document.querySelector("form");
    form?.addEventListener("submit", submitHandler);

    const inputTitle = form?.querySelector("#title");
    inputTitle?.addEventListener("input", inputHandler);

    const nextPage = document.getElementById("next-page-button");
    nextPage?.addEventListener("click", goToNextPage);
}

/**
 * Renders events matching title from data
 * @param data 
 */
function showEventsByTitle(data: any) {
    document.getElementById("events")?.replaceChildren();
    displayLoadingIcon("block");
    showEvents(data);
}

/**
 * Render events from data
 * @param data 
 */
function showEvents(data: any) {
    const eventsHTML = buildEventsHTML(data);
    const sectionsArray = eventsHTML[0] as HTMLElement[];
    const sections = eventsHTML[1] as HTMLElement;
    console.log(sectionsArray);
    console.log(sections);
    sectionsArray?.forEach((section) => {
        sections?.appendChild(section);
    })

}

/**
 * Build the HTML logic for events
 * @param data 
 * @returns An array composed of an array with section elements and the element wrapping all section elements
 */
function buildEventsHTML(data: any) {

    let sectionsArray: HTMLElement[] = [];

    // Initialize events section when init
    if (!document.getElementById("events")) {
        const eventsSection = document.createElement("section");
        const loadingIconSection = document.getElementById("loading-icon-section");
        eventsSection.id = "events";
        loadingIconSection?.insertAdjacentElement("afterend", eventsSection);
    }

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

        displayLoadingIcon("none");

        sectionsArray.push(section);

    })

    // Remove the next page button when max number of events is reached
    if (document.getElementById("events")?.childElementCount === data.total_count) {
        const nextPage = document.getElementById("next-page-button");
        nextPage?.remove();
    }

    return [sectionsArray, document.getElementById("events")];
}

/**
 * Logic processed to display loading icon
 * @param displayMode 
 */
function displayLoadingIcon(displayMode : string){
    const loadingIconSection = document.getElementById("loading-icon-section");

    if (loadingIconSection !== null) {

        if ( displayMode == "none" || "block" ) {
            loadingIconSection.style.display = displayMode;
        } else {
            throw new Error("Mode d'affichage de l'icône de chargement inconnue.");
        }

    }
}

/**
 * Logic processed when clicking on the bottom arrow
 */
function goToNextPage() {
    const sections = document.getElementById("events");
    const numberOfEventsShowed = sections?.childElementCount;
    loadEvents(numberOfEventsShowed).then(data => {
        showEvents(data);
    }
    );
}

/**
 * WORKS BUT THIS METHOD IS IN DRAFT STATE : enables to render a select menu dynamically when typing in search field
 * @param e 
 */
async function inputHandler(){
    const titleInput = document.querySelector("input[name='title']") as HTMLInputElement;

    if (titleInput){
        if (titleInput.value) {
            const eventsByTitle = loadEventsByTitle(titleInput);
            const titleSelect = document.getElementById("select-title");

            if (titleSelect || (titleInput.value === "")) {
                titleSelect?.replaceChildren();
            }

            eventsByTitle.then(
                (data => {
                    data.results.forEach((element : any) => {
                        const titleSelectOption = document.createElement("option");
                        titleSelectOption.value = element.event_titre;
                        titleSelectOption.textContent = titleSelectOption.value;
                        titleSelectOption.addEventListener("click",() => {
                            titleInput.value = titleSelectOption.value;
                        })
                        titleSelect?.appendChild(titleSelectOption);
                    })

                })
            )
        }

    };
}

/**
 * Manages form submit to search events from a title 
 * @param e 
 */
function submitHandler(e: SubmitEvent) {
    e.preventDefault();
    const titleInput = document.querySelector("input[name='title']") as HTMLInputElement;
    const nextPage = document.getElementById("next-page-button");
    nextPage?.remove();
    loadEventsByTitle(titleInput)
        .then(data => {
            console.log(data);
            showEventsByTitle(data);
        });
}
