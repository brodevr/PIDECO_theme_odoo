from odoo import fields, models


class ProductTemplate(models.Model):
    _inherit = "product.template"

    pideco_featured = fields.Boolean(
        string="Featured on the home page",
        help="Show this product in the \"Featured products\" slider of the home page. "
        "Only published products are shown. While no product is marked, the slider "
        "shows the latest published products.",
        copy=False,
    )
