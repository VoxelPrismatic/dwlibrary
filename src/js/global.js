async function uploadImage(elem) {
    cache_svg();
    const label = $("label[data-for='" + elem.id + "']");
    const button = label.$("button");

    label.onclick = () => elem.click();
    button.classList.add("rot");
    button.innerHTML = SVG.loader;

    const file = elem.files[0];
    const data = new FormData();
    data.append("file", file);

    let uri = ""
    switch(elem.accept) {
        case "image/png, image/jpeg, image/webp":
            uri = "/htmx/upload-img";
            break;
        case "image/svg+xml":
            uri = "/htmx/upload-svg";
            break;
        default:
            throw Error("Unknown accept type: " + elem.accept);
    }

    const resp = await fetch(uri, {
        method: "POST",
        body: data,
        headers: {
            "Hx-Target": elem.dataset.for,
            "X-Name": elem.dataset.name,
            "X-Target": elem.dataset.target
        }
    });

    const target = $(elem.dataset.for);
    const src = await resp.text();

    target.src = src;
    target.nextElementSibling.value = src;

    button.classList.remove("rot");
    button.innerHTML = SVG.upload;
}

