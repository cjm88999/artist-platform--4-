import React from 'react';

const ConnectStripeButton = () => {
  const stripeOAuthUrl = 'https://connect.stripe.com/oauth/authorize?redirect_uri=http://localhost:3001/oauth/callback&client_id=your-client-id&response_type=code&scope=read_write&stripe_user[country]=US';

  return (
    <a href={stripeOAuthUrl}>
      <button>Connect with Stripe</button>
    </a>
  );
};

export default ConnectStripeButton;
