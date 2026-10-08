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

function moveSlider(name, direction) {
    const slider = document.querySelector(`[data-pideco-slider="${name}"]`);
    if (!slider) return;
    const items = [...slider.children];
    if (items.length < 2) return;
    const first = items[0].getBoundingClientRect();
    const step = items[1].getBoundingClientRect().left - first.left;
    if (step <= 0) return;
    const current = Math.round(slider.scrollLeft / step);
    const next = Math.max(0, Math.min(items.length - 1, current + direction));
    // Absolute card positions avoid accumulating fractional-pixel scroll errors.
    slider.scrollTo({
        left: items[next].getBoundingClientRect().left - first.left,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
}

function initPromoSliders() {
    document.querySelectorAll("[data-pideco-promo-slider]").forEach((slider) => {
        if (slider.dataset.pidecoPromoReady) return;
        const items = [...slider.querySelectorAll(".pideco-promo-item")].filter(
            (item) => item.textContent.trim()
        );
        if (items.length < 2) return;
        slider.dataset.pidecoPromoReady = "true";
        let currentIndex = 0;
        let timer;

        const showNext = () => {
            const current = items[currentIndex];
            const nextIndex = (currentIndex + 1) % items.length;
            const next = items[nextIndex];
            current.classList.remove("is-active");
            current.classList.add("is-previous");
            next.classList.remove("is-previous");
            next.getBoundingClientRect();
            next.classList.add("is-active");
            currentIndex = nextIndex;
        };
        const start = () => {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
            window.clearInterval(timer);
            timer = window.setInterval(showNext, 4000);
        };
        const stop = () => window.clearInterval(timer);

        slider.addEventListener("mouseenter", stop);
        slider.addEventListener("mouseleave", start);
        slider.addEventListener("focusin", stop);
        slider.addEventListener("focusout", start);
        start();
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
    const previous = event.target.closest("[data-pideco-slider-prev]");
    if (previous) return moveSlider(previous.dataset.pidecoSliderPrev, -1);
    const next = event.target.closest("[data-pideco-slider-next]");
    if (next) return moveSlider(next.dataset.pidecoSliderNext, 1);
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

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        initPromoSliders();
        initHeaderMetrics();
    }, {once: true});
} else {
    initPromoSliders();
    initHeaderMetrics();
}
