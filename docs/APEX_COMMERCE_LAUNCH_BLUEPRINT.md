# APEX Commerce Launch Blueprint

## Source-derived launch sequence
1. Validate a product before spending significant time on store design.
2. Prefer products that solve a recognizable problem.
3. Look for multiple legitimate customer angles.
4. Consider the emotional/customer benefit.
5. Examine demand signals, audience, pain points, cost of goods, and target customer.
6. Consider repeat or recurring demand when the product naturally supports replenishment.
7. Create a simple offer page with what the product is, who it is for, what the customer gets, timing, and applicable guarantee/terms.
8. Produce professional short-form creative from a natural-language brief.
9. Drive traffic from social content/ads to the focused offer page.
10. Measure actual business outcomes rather than treating views or likes as proof of product success.

## Evidence boundary
Social likes, views, ads, or search visibility are research signals. They are not by themselves proof of sales, margin, customer satisfaction, or product-market fit.

The APEX Truth Gate must preserve the distinction between observed evidence, source-provided claims, AI-generated suggestions, and unverified assumptions.
No generated product information should be presented as verified merely because an AI model produced it.

## Implementation
The focused surface is available at /commerce. It is additive and does not replace the existing APEX Terminal home or Character Studio.
Donation destination is configured through NEXT_PUBLIC_DONATION_URL. No payment URL is invented in source code.

The commerce surface can later connect to the universal catalog/CSV mapper, but no marketplace upload, supplier connection, or payment processor is claimed verified until an actual integration test provides evidence.