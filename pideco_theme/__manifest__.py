{
    "name": "PIDECO Theme",
    "summary": "Identidad PIDECO para Website y eCommerce en Odoo 19",
    "version": "19.0.1.5.0",
    "category": "Website/eCommerce",
    "license": "LGPL-3",
    "author": "PIDECO",
    "depends": ["website_sale", "website_sale_wishlist", "website_mass_mailing"],
    "data": [
        "data/mailing_list_data.xml",
        "views/res_config_settings_views.xml",
        "views/product_template_views.xml",
        "views/pideco_theme_19.xml",
    ],
    "assets": {
        "web.assets_frontend": [
            ("prepend", "pideco_theme/static/src/scss/primary_variables.scss"),
            "pideco_theme/static/src/scss/pideco_19.scss",
            "pideco_theme/static/src/js/pideco_ui.js",
        ],
    },
    "installable": True,
    "application": False,
}
