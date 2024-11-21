import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
// import getRawBody from "raw-body";
// import { NextApiRequest } from "next";

export const config = {
  api: {
    bodyParser: {
      type: "application/json",
      raw: true, // Captura o corpo como texto bruto
    },
  },
};

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.error();
  }
  // const signature = request.headers["stripe-signature"] as string;
  const signature = request.headers.get("stripe-signature") as string;
  if (!signature) {
    return NextResponse.error();
  }

  const text = await request.text();
  // const text = await getRawBody(request);

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-10-28.acacia",
  });

  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );
  switch (event.type) {
    case "invoice.paid": {
      //Atualizar o usuário com o novo plano
      const { customer, subscription, subscription_details } =
        event.data.object;

      const clerkUserId = subscription_details?.metadata?.clerk_user_id;
      if (!clerkUserId) {
        return NextResponse.error();
      }
      await clerkClient().users.updateUser(clerkUserId, {
        privateMetadata: {
          stripeCustomerId: customer,
          stripeSubscriptionID: subscription,
        },
        publicMetadata: {
          subscriptionPlan: "premium",
        },
      });
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = await stripe.subscriptions.retrieve(
        event.data.object.id,
      );
      const clerkUserId = subscription.metadata.clerk_user_id;
      if (!clerkUserId) {
        return NextResponse.error();
      }
      await clerkClient().users.updateUser(clerkUserId, {
        privateMetadata: {
          stripeCustomerId: null,
          stripeSubscriptionID: null,
        },
        publicMetadata: {
          subscriptionPlan: null,
        },
      });
      break;
    }
  }
  return NextResponse.json({ received: true });
};