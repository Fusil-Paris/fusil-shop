const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async function (req, res) {
    try {
        const products = await stripe.products.list({
            active: true,
            expand: ['data.default_price'],
            limit: 100
        });

        const formatted = products.data.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            images: product.images,
            metadata: product.metadata,
            price: product.default_price?.unit_amount ? product.default_price.unit_amount / 100 : 0,
            priceId: product.default_price?.id
        }));

        res.status(200).json(formatted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
