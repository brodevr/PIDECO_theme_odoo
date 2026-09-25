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

function escapeHtml(value) {
    const node = document.createElement("div");
    node.textContent = value || "";
    return node.innerHTML;
}

function clearResults(form) {
    form?.querySelector(".pideco-live-results")?.remove();
}

function renderResults(form, results) {
    clearResults(form);
    if (!results.length) return;
    const menu = document.createElement("div");
    menu.className = "pideco-live-results dropdown-menu show";
    menu.innerHTML = results.map((item) => `
        <a class="dropdown-item" href="${escapeHtml(item.website_url || "/shop")}">
            ${item.image_url ? `<img src="${escapeHtml(item.image_url)}" alt=""/>` : ""}
            <span class="pideco-live-copy">
                <span>${escapeHtml(item.name)}</span>
                ${item.description ? `<small>${escapeHtml(item.description)}</small>` : ""}
            </span>
            ${item.detail ? `<em>${escapeHtml(item.detail)}</em>` : ""}
        </a>`).join("");
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

async function openCart() {
    const drawer = document.querySelector("#pideco-cart-drawer");
    if (!drawer || drawer.getAttribute("aria-busy") === "true") return;
    // Language url codes come from the footer selector, so any website language is supported.
    const langCodes = [...document.querySelectorAll("[data-pideco-language]")].map((link) => link.dataset.pidecoLanguage);
    const firstSegment = window.location.pathname.split("/")[1];
    const prefix = langCodes.includes(firstSegment) ? `/${firstSegment}` : "";
    const cartUrl = `${prefix}/shop/cart`;
    drawer.setAttribute("aria-busy", "true");
    try {
        // Render the current order through Odoo, including its translated totals.
        const response = await fetch(cartUrl, {credentials: "same-origin", cache: "no-store"});
        if (!response.ok) throw new Error("Cart unavailable");
        const page = new DOMParser().parseFromString(await response.text(), "text/html");
        const updated = page.querySelector("#pideco-cart-drawer");
        if (!updated) throw new Error("Cart unavailable");
        drawer.innerHTML = updated.innerHTML;
        document.documentElement.classList.add("pideco-cart-open");
        drawer.setAttribute("aria-hidden", "false");
    } catch {
        window.location.assign(cartUrl);
    } finally {
        drawer.removeAttribute("aria-busy");
    }
}

function closeCart() {
    document.documentElement.classList.remove("pideco-cart-open");
    document.querySelector("#pideco-cart-drawer")?.setAttribute("aria-hidden", "true");
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
    if (event.target.closest("[data-pideco-cart-open]")) return openCart();
    if (event.target.closest("[data-pideco-cart-close]")) return closeCart();
    const previous = event.target.closest("[data-pideco-slider-prev]");
    if (previous) return moveSlider(previous.dataset.pidecoSliderPrev, -1);
    const next = event.target.closest("[data-pideco-slider-next]");
    if (next) return moveSlider(next.dataset.pidecoSliderNext, 1);
});

document.addEventListener("keydown", (event) => {
    const nav = document.querySelector("#pidecoNav.show");
    if (event.key === "Tab" && nav && window.matchMedia("(max-width: 991.98px)").matches) {
        const controls = [...nav.querySelectorAll("a[href], button, input")].filter(el => el.getClientRects().length && getComputedStyle(el).visibility === "visible" && !el.disabled);
        const first = controls[0], last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    if (event.key === "Escape") {
        closeSearch();
        closeCart();
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

// Odoo emits this event after the cart service successfully adds a line.
// Refresh and open the PIDECO mini-cart so the shopper sees the updated order.
function initAutoCart() {
    document.querySelectorAll(".oe_website_sale").forEach((container) => {
        if (container.dataset.pidecoCartReady) return;
        container.dataset.pidecoCartReady = "true";
        container.addEventListener("add_to_cart_event", () => {
            window.setTimeout(() => openCart(), 180);
        });
    });
}

// The hero carousel fills the viewport below the header, whose height changes with
// the announcement bar and breakpoints. The CSS falls back to 140px without this.
function initHeroHeight() {
    const header = document.querySelector(".pideco-header");
    if (!header || header.dataset.pidecoHeightReady || !window.ResizeObserver) return;
    header.dataset.pidecoHeightReady = "true";
    new ResizeObserver(() => {
        document.documentElement.style.setProperty("--pideco-top-h", `${header.offsetHeight}px`);
    }).observe(header);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        initPromoSliders();
        initAutoCart();
        initHeroHeight();
    }, {once: true});
} else {
    initPromoSliders();
    initAutoCart();
    initHeroHeight();
}
