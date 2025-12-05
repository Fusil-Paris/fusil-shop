const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async function (req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { items, locale = 'fr' } = req.body;

        const line_items = items.map(item => ({
            price: item.priceId,
            quantity: 1
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: 'https://fusil-shop.vercel.app?success=true',
            cancel_url: 'https://fusil-shop.vercel.app?canceled=true',
            locale: locale === 'en' ? 'en' : 'fr',
            shipping_address_collection: {
                allowed_countries: ['FR', 'BE', 'CH', 'LU', 'DE', 'IT', 'ES', 'NL', 'AT', 'PT', 'GB', 'IE']
            }
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
