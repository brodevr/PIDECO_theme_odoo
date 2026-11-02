from odoo import fields, models


class ProductTemplate(models.Model):
    _inherit = "product.template"

    pideco_featured = fields.Boolean(
        string="Featured on the home page",
        help="Show this product in the \"Just arrived\" section of the home page, which shows "
        "four products. Only published products are shown. While no product is marked, the "
        "section shows the latest published products.",
        copy=False,
    )
