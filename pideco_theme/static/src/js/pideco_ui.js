/** @odoo-module **/

import { Interaction } from "@web/public/interaction";
import { registry } from "@web/core/registry";

class PidecoProductCard extends Interaction {
    static selector = ".pideco-home .pideco-product-card[data-product-template-id]";
    dynamicContent = {
        ".pideco-card-add": { "t-on-click.prevent": this.locked(this.addToCart) },
    };
    async addToCart(event) {
        const button = event.currentTarget;
        button.disabled = true;
        button.setAttribute("aria-busy", "true");
        try {
            await this.services.cart.add({
                productTemplateId: Number(this.el.dataset.productTemplateId),
                productId: Number(this.el.dataset.productId) || false,
                isCombo: this.el.dataset.isCombo === "true",
                quantity: 1,
            });
        } finally {
            button.disabled = false;
            button.removeAttribute("aria-busy");
        }
    }
}
registry.category("public.interactions").add("pideco_theme.product_card", PidecoProductCard);

const searchOverlaySelector = "[data-pideco-search-overlay]";
const searchFormSelector = ".pideco-overlay-form";
let searchTimer;

/* Odoo's autocomplete returns every field as an HTML fragment: the text comes already escaped, and
   the matched term and the price are wrapped in <span>. Escaping it again would show the tags as
   text, so the fragment is parsed (inert, inside a <template>) and only its text and those spans,
   with nothing but their class, are kept. */
function parseFragment(html) {
    const template = document.createElement("template");
    template.innerHTML = html || "";
    for (const node of template.content.querySelectorAll("*")) {
        if (node.tagName === "SCRIPT" || node.tagName === "STYLE") {
            node.remove();
            continue;
        }
        if (node.tagName !== "SPAN") {
            node.replaceWith(...node.childNodes);
            continue;
        }
        for (const attribute of [...node.attributes]) {
            if (attribute.name !== "class") node.removeAttribute(attribute.name);
        }
    }
    return template.content;
}

function fragmentText(html) {
    return parseFragment(html).textContent.trim();
}

function resultElement(tagName, html, className) {
    const node = document.createElement(tagName);
    if (className) node.className = className;
    node.append(parseFragment(html));
    return node;
}

function clearResults(form) {
    form?.querySelector(".pideco-live-results")?.remove();
}

function renderResults(form, results) {
    clearResults(form);
    if (!results.length) return;
    const menu = document.createElement("div");
    menu.className = "pideco-live-results dropdown-menu show";
    for (const item of results) {
        const link = document.createElement("a");
        link.className = "dropdown-item";
        const url = fragmentText(item.website_url);
        link.setAttribute("href", url.startsWith("/") ? url : "/shop");
        const imageUrl = fragmentText(item.image_url);
        if (imageUrl.startsWith("/")) {
            const image = document.createElement("img");
            image.setAttribute("src", imageUrl);
            image.alt = "";
            link.append(image);
        }
        const copy = document.createElement("span");
        copy.className = "pideco-live-copy";
        copy.append(resultElement("span", item.name, "pideco-live-name"));
        if (fragmentText(item.description)) copy.append(resultElement("small", item.description));
        link.append(copy);
        if (fragmentText(item.detail)) link.append(resultElement("em", item.detail));
        menu.append(link);
    }
    form.append(menu);
}

async function searchProducts(input) {
    const form = input.closest(searchFormSelector);
    const term = input.value.trim();
    if (!form || term.length < 2) {
        clearResults(form);
        return;
    }
    try {
        const response = await fetch("/website/snippet/autocomplete", {
            method: "POST",
            credentials: "same-origin",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                jsonrpc: "2.0",
                method: "call",
                params: {
                    search_type: "products",
                    term,
                    order: "name asc",
                    limit: 6,
                    max_nb_chars: 120,
                    options: {
                        displayImage: true,
                        displayDescription: true,
                        displayExtraLink: true,
                        displayDetail: true,
                        allowFuzzy: true,
                    },
                },
                id: Date.now(),
            }),
        });
        const payload = await response.json();
        if (input.value.trim() === term) renderResults(form, payload.result?.results || []);
    } catch {
        clearResults(form);
    }
}

function openSearch() {
    const overlay = document.querySelector(searchOverlaySelector);
    if (!overlay) return;
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("pideco-search-open");
    window.setTimeout(() => overlay.querySelector("input[type='search']")?.focus(), 80);
}

function closeSearch() {
    const overlay = document.querySelector(searchOverlaySelector);
    if (!overlay) return;
    clearResults(overlay.querySelector(searchFormSelector));
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("pideco-search-open");
}

// Announcement bar: a ribbon that scrolls continuously. The group of messages is repeated until one
// set covers the bar, and the set is doubled, so moving the track by exactly one set loops seamlessly.
// The copies are hidden from screen readers, which read the original group once.
function initPromoMarquee() {
    document.querySelectorAll("[data-pideco-promo-marquee]").forEach((bar) => {
        if (bar.dataset.pidecoPromoReady) return;
        const track = bar.querySelector(".pideco-promo-track");
        const group = track?.querySelector(".pideco-promo-group");
        if (!group || !group.textContent.trim()) return;
        bar.dataset.pidecoPromoReady = "true";
        // The messages are editable in the website editor, which records every DOM change in the header
        // as an edit of it. While editing, the bar stays still and as rendered by the server.
        const isEditing = () => document.body.classList.contains("editor_enable");
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let lastWidth = 0;
        const clear = () => {
            track.querySelectorAll("[data-pideco-promo-copy]").forEach((copy) => copy.remove());
            bar.classList.remove("is-running");
        };
        const build = () => {
            clear();
            lastWidth = bar.clientWidth;
            if (isEditing() || reducedMotion.matches) return;
            const groupWidth = group.getBoundingClientRect().width;
            if (!groupWidth) return;
            const perSet = Math.max(1, Math.ceil(bar.clientWidth / groupWidth));
            for (let index = 1; index < perSet * 2; index++) {
                const copy = group.cloneNode(true);
                copy.dataset.pidecoPromoCopy = "";
                copy.setAttribute("aria-hidden", "true");
                track.append(copy);
            }
            const distance = groupWidth * perSet;
            track.style.setProperty("--pideco-promo-distance", `-${distance}px`);
            // About 45px per second, whatever the length of the messages.
            track.style.setProperty("--pideco-promo-duration", `${Math.max(12, distance / 45)}s`);
            bar.classList.add("is-running");
        };
        if (window.ResizeObserver) {
            new ResizeObserver(() => {
                if (bar.clientWidth !== lastWidth && !isEditing()) build();
            }).observe(bar);
        }
        reducedMotion.addEventListener?.("change", build);
        // React as soon as edit mode starts, before the editor begins recording changes.
        new MutationObserver(() => {
            if (isEditing() && bar.classList.contains("is-running")) clear();
        }).observe(document.body, {attributes: true, attributeFilter: ["class"]});
        // Web fonts change the width of the messages once loaded.
        (document.fonts?.ready || Promise.resolve()).then(build);
    });
}

function closeMenu() {
    const nav = document.querySelector("#pidecoNav");
    if (!nav?.classList.contains("show")) return;
    nav.classList.remove("show");
    nav.classList.remove("pideco-mobile-category-view-open");
    nav.querySelector("[data-pideco-mobile-category-view]")?.setAttribute("aria-hidden", "true");
    nav.querySelector("[data-pideco-mega-toggle]")?.setAttribute("aria-expanded", "false");
    const toggle = document.querySelector(".pideco-mobile-menu");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.focus();
}

document.addEventListener("click", (event) => {
    if (event.target.closest("[data-pideco-menu-open]")) {
        const nav = document.querySelector("#pidecoNav");
        nav?.classList.add("show");
        document.querySelector(".pideco-mobile-menu")?.setAttribute("aria-expanded", "true");
        nav?.querySelector("[data-pideco-menu-close]")?.focus({preventScroll: true});
        return;
    }
    const menuClose = event.target.closest("[data-pideco-menu-close]");
    if (menuClose) {
        closeMenu();
        return;
    }
    const categoryBack = event.target.closest("[data-pideco-mobile-category-back]");
    if (categoryBack) {
        const nav = categoryBack.closest("#pidecoNav");
        nav?.classList.remove("pideco-mobile-category-view-open");
        nav?.querySelector("[data-pideco-mobile-category-view]")?.setAttribute("aria-hidden", "true");
        nav?.querySelector("[data-pideco-mega-toggle]")?.setAttribute("aria-expanded", "false");
        return;
    }
    if (event.target.closest("#pidecoNav a[href]")) closeMenu();
    const languageLink = event.target.closest("[data-pideco-language]");
    if (languageLink) {
        event.preventDefault();
        // Drop the current language prefix, otherwise Odoo redirects back to it and the switch is ignored.
        const langCodes = [...document.querySelectorAll("[data-pideco-language]")].map((link) => link.dataset.pidecoLanguage);
        const segments = window.location.pathname.split("/");
        if (langCodes.includes(segments[1])) segments.splice(1, 1);
        const path = segments.join("/") || "/";
        const destination = `${path}${window.location.search}${window.location.hash}`;
        window.location.href = `/website/lang/${encodeURIComponent(languageLink.dataset.pidecoLanguage)}?r=${encodeURIComponent(destination)}`;
        return;
    }
    const megaToggle = event.target.closest("[data-pideco-mega-toggle]");
    if (megaToggle) {
        if (window.matchMedia("(max-width: 991.98px)").matches) {
            const nav = megaToggle.closest("#pidecoNav");
            nav?.classList.add("pideco-mobile-category-view-open");
            nav?.querySelector("[data-pideco-mobile-category-view]")?.setAttribute("aria-hidden", "false");
            megaToggle.setAttribute("aria-expanded", "true");
            nav?.querySelector("[data-pideco-mobile-category-back]")?.focus({preventScroll: true});
            return;
        }
        const mega = megaToggle.closest("[data-pideco-mega]");
        const isOpen = mega.classList.toggle("is-open");
        megaToggle.setAttribute("aria-expanded", String(isOpen));
        return;
    }
    if (!event.target.closest("[data-pideco-mega]")) {
        document.querySelectorAll("[data-pideco-mega].is-open").forEach((mega) => {
            mega.classList.remove("is-open");
            mega.querySelector("[data-pideco-mega-toggle]")?.setAttribute("aria-expanded", "false");
        });
    }
    if (event.target.closest("[data-pideco-search-open]")) return openSearch();
    if (event.target.closest("[data-pideco-search-close]")) return closeSearch();
});

document.addEventListener("keydown", (event) => {
    const nav = document.querySelector("#pidecoNav.show");
    if (event.key === "Tab" && nav && window.matchMedia("(max-width: 991.98px)").matches) {
        const controls = [...nav.querySelectorAll("a[href], button, input, summary")].filter(el => el.getClientRects().length && getComputedStyle(el).visibility === "visible" && !el.disabled);
        const first = controls[0], last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    if (event.key === "Escape") {
        closeSearch();
        closeMenu();
        document.querySelectorAll("[data-pideco-mega].is-open").forEach((mega) => {
            mega.classList.remove("is-open");
            mega.querySelector("[data-pideco-mega-toggle]")?.setAttribute("aria-expanded", "false");
        });
    }
});

document.addEventListener("input", (event) => {
    if (!event.target.matches(`${searchFormSelector} input[type='search']`)) return;
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => searchProducts(event.target), 220);
});

// Header metrics used by the CSS:
// --pideco-top-h: header height. The hero carousel fills the viewport below it; it changes with
//   the announcement bar and breakpoints, and the CSS falls back to a fixed value without it.
// --pideco-header-bottom: how much of the header is still on screen. Odoo's cart notification is
//   drawn at the top of the viewport and starts right below that.
function initHeaderMetrics() {
    const header = document.querySelector(".pideco-header");
    if (!header || header.dataset.pidecoMetricsReady) return;
    header.dataset.pidecoMetricsReady = "true";
    const root = document.documentElement;
    let lastBottom;
    const updateBottom = () => {
        const bottom = `${Math.max(0, Math.round(header.getBoundingClientRect().bottom))}px`;
        // Once the header has scrolled away the value stays at 0px and nothing is written.
        if (bottom === lastBottom) return;
        lastBottom = bottom;
        root.style.setProperty("--pideco-header-bottom", bottom);
    };
    let scheduled = false;
    const onScroll = () => {
        if (scheduled) return;
        scheduled = true;
        window.requestAnimationFrame(() => {
            scheduled = false;
            updateBottom();
        });
    };
    // Capture phase: scroll events do not bubble, and the page may scroll inside #wrapwrap.
    document.addEventListener("scroll", onScroll, {passive: true, capture: true});
    if (window.ResizeObserver) {
        new ResizeObserver(() => {
            root.style.setProperty("--pideco-top-h", `${header.offsetHeight}px`);
            updateBottom();
        }).observe(header);
    }
    updateBottom();
}

// Product description under the title: shown trimmed, with a "View more" toggle that opens it in place.
// A text that already fits is left whole and loses the toggle. Nothing runs in the website editor,
// where the description must stay whole and editable.
function initDescriptionToggles() {
    const isEditing = () => document.body.classList.contains("editor_enable");
    const update = () => {
        if (isEditing()) return;
        document.querySelectorAll(".pideco-product-description").forEach((description) => {
            const toggle = description.parentElement.querySelector("[data-pideco-description-toggle]");
            if (!toggle || description.classList.contains("is-expanded")) return;
            description.classList.remove("is-short");
            const fits = description.scrollHeight <= description.clientHeight + 1;
            description.classList.toggle("is-short", fits);
            toggle.classList.toggle("is-hidden", fits);
        });
    };
    document.addEventListener("click", (event) => {
        const toggle = event.target.closest("[data-pideco-description-toggle]");
        if (!toggle || isEditing()) return;
        const description = toggle.parentElement.querySelector(".pideco-product-description");
        if (!description) return;
        const expanded = !description.classList.contains("is-expanded");
        description.classList.toggle("is-expanded", expanded);
        toggle.setAttribute("aria-expanded", String(expanded));
        // Closing a long text: bring its start back into view.
        if (!expanded && description.getBoundingClientRect().top < 0) {
            description.scrollIntoView({block: "start", behavior: "smooth"});
        }
    });
    update();
    window.addEventListener("resize", update, {passive: true});
    // Web fonts change the text height once loaded.
    document.fonts?.ready.then(update);
}

// The newsletter form and the popup form of the home subscribe to the "PIDECO news" list. Its id is
// rendered on #wrap, outside the editable zones, and passed here to the forms that have no list yet,
// so the zones stay free of QWeb directives and editable in the website editor.
function initNewsletterLists() {
    const listId = document.querySelector("[data-pideco-news-list]")?.dataset.pidecoNewsList;
    if (!listId) return;
    document.querySelectorAll(".pideco-newsletter-form").forEach((form) => {
        if (!Number(form.dataset.listId)) form.dataset.listId = listId;
    });
    document.querySelectorAll(".pideco-popup-form input[name='list_ids']").forEach((input) => {
        if (!input.value) input.value = listId;
    });
}

function startPidecoUi() {
    initNewsletterLists();
    initPromoMarquee();
    initHeaderMetrics();
    initDescriptionToggles();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startPidecoUi, {once: true});
} else {
    startPidecoUi();
}
