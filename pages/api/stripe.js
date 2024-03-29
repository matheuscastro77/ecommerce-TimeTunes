import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const params = {
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card', 'boleto'],
        billing_address_collection: 'required',
        shipping_address_collection: {
          allowed_countries: ['BR']
        },
        phone_number_collection: {
          "enabled": true
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: 0,
                currency: 'brl'
              },
              display_name: 'Entrega grátis',
              delivery_estimate: {
                minimum: {
                  unit: 'business_day',
                  value: 9
                },
                maximum: {
                  unit: 'business_day',
                  value: 11
                }
              }
            }
          },
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: 3000,
                currency: 'brl'
              },
              display_name: 'Entrega rápida',
              delivery_estimate: {
                minimum: {
                  unit: 'business_day',
                  value: 3
                },
                maximum: {
                  unit: 'business_day',
                  value: 5
                }
              }
            }
          }
        ],
        line_items: req.body.map((item) => {
          const img = item.image[0].asset._ref;
          const newImage = img.replace('image-', 'https://cdn.sanity.io/images/3zn6r243/production/').replace('-webp', '.webp');

          return {
            price_data: {
              currency: 'brl',
              product_data: {
                name: item.name,
                images: [newImage],
              },
              unit_amount: item.price * 100,
            },
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
            },
            quantity: item.quantity
          }
        }),
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
      }

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);

      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}