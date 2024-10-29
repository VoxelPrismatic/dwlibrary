const save_btn = $("button#save");

function check_id_conflicts() {
    let values = [];
    save_btn.disabled = false;
    save_btn.title = "Save page";
    for(var e of $$("input[data-id='show-id']")) {
        if(values.includes(e.value)) {
            e.classList.add("conflict");
            save_btn.disabled = true;
            save_btn.title = "Show IDs must be unique";
        } else {
            e.classList.remove("conflict");
        }
        values.push(e.value);
    }
}

for(var e of $$("input[data-id='show-id']")) {
    e.onkeyup = () => check_id_conflicts();
}

for(var e of $$("input[data-id='image-url']")) {
    e.onkeyup = (evt) => evt.currentTarget.previousElementSibling.src = evt.currentTarget.value;
}

for(var e of $$("button[data-id='delete-card']")) {
    e.onclick = (evt) => evt.currentTarget.parentElement.parentElement.remove();
}

for(var e of $$("div.link:not(.edit)")) {
    e.onclick = (evt) => {
        evt.currentTarget.insertAdjacentHTML("beforebegin", `<div class="link edit">
    <div>
        <input data-id="link-text" type="text" value="" placeholder="Link Text"/>
        <input data-id="link-url" type="text" value="" placeholder="Link URL"/>
    </div>
    <div>
        <button data-id="delete-link" title="Delete Link">${SVG.trash}</button>
    </div>
</div>
`);
        for(var l of $$("button[data-id='delete-link']")) {
            l.onclick = (evt) => evt.currentTarget.parentElement.parentElement.remove();
        }
    }
}

save_btn.onclick = () => {
    check_id_conflicts();

    let cards = [];

    for(var e of $$("div.home-card")) {
        order = 0;
        let card = { links: [] };
        card.show = e.$("input[data-id='show-id']").value;
        card.title = e.$("input[data-id='title']").value;
        card.subtext = e.$("input[data-id='subtext']").value;
        card.image = e.$("input[data-id='image-url']").value;

        for(var l of e.$$("div.link.edit")) {
            card.links.push({
                show: card.show,
                text: l.$("input[data-id='link-text']").value,
                link: l.$("input[data-id='link-url']").value,
                placement: order++
            });
        }

        if(card.show != "")
            cards.push(card);
    }

    fetch("/api/home", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cards)
    }).then(() => location = "/");
}
