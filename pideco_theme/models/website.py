from odoo import fields, models


class Website(models.Model):
    _inherit = "website"

    pideco_promo_text_1 = fields.Char(
        string="Promo message 1",
        translate=True,
        default="Nationwide shipping",
    )
    pideco_promo_text_2 = fields.Char(
        string="Promo message 2",
        translate=True,
        default="Minimum purchase $200,000",
    )
    pideco_promo_text_3 = fields.Char(
        string="Promo message 3",
        translate=True,
        default="Store pickup available",
    )


class ResConfigSettings(models.TransientModel):
    _inherit = "res.config.settings"

    pideco_promo_text_1 = fields.Char(
        related="website_id.pideco_promo_text_1",
        readonly=False,
    )
    pideco_promo_text_2 = fields.Char(
        related="website_id.pideco_promo_text_2",
        readonly=False,
    )
    pideco_promo_text_3 = fields.Char(
        related="website_id.pideco_promo_text_3",
        readonly=False,
    )
