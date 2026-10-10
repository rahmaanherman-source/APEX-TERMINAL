# APEX Design References

**Owner:** Mac (Rahmann Herman)
**Status:** CANONICAL. These images are the visual source of truth. Builders match them; they do not reinterpret them.

| File | Surface | Used for |
|---|---|---|
| `apex-executive-office.png` | **APEX Executive Office** (Corporate Office 360) | Command center: Gabby as Chief of Staff, system status, operating lanes, AI workers, integrations |
| `apex-global-market.png` | **APEX Global Market** | Shopping storefront: categories, search, top sellers, new arrivals, trending |
| `apex-360-atelier.png` | **APEX 360 Atelier** | Photo/video booth: live camera, transform modes, worlds, approve and share |
| `gabby-omni-studio.jpg` | **Gabby, APEX Omni Studio** | Gabby's identity and look, and the "Ask Gabby" command bar |

## Rules for every builder

1. **Match the picture.** Layout, proportions, colors and type come from the image. Do not add sections, remove sections, or "improve" the composition unless Mac approves it.
2. **The main thing stays the biggest thing.** Each surface has one hero (see below). Nothing covers it, and it never shrinks to make room for side panels.
3. **High-end, not cluttered.** Black and deep-navy glass, thin glowing borders, generous spacing, premium type. No crowding and no empty gaps.
4. **One reference per prompt.** When sending a design to a builder (Google Stitch, Google AI Studio, Grok, v0), attach only the one image for the screen being built. Mixing images makes builders blend the designs.
5. **Change layout without losing features.** A visual rebuild keeps every working button, route and function. See `docs/APEX_VISUAL_BUILD_PRESERVATION_PROTOCOL.md`.
6. **Every control works or says why it doesn't.** No fake "LIVE", "CONNECTED" or numbers without real data behind them.

---

## 1. APEX Executive Office — `apex-executive-office.png`

**Palette:** black, warm gold, soft white. Serif display headline, clean sans for UI.
**Hero:** Gabby, Chief of Staff, beside the "APEX Cognitive Intelligence" headline and the gold APEX orb.

Top to bottom:
1. **Top nav:** APEX Life Global logo · Front Desk · Cognitive Intel · Command Center · Marketplace · Analytics · About · search · alerts · profile · gold **Get Started**.
2. **Hero:** "APEX Cognitive Intelligence" headline, "Think Deeper. Build Smarter. Execute Faster." Two buttons: **Launch APEX Front Desk** (gold) and **Watch Demo**. Stats: Operating Lanes · AI Workers · ∞ Possibilities. Gabby portrait with the "Knowledge Builds Empires" quote and the gold orb. Right edge: GUIDE · EXECUTE · VERIFY · BUILD · SCALE.
3. **Left sidebar:** Front Desk (active, gold) · Command Center · Unified Inbox · 35 Lanes · 20 Workers · Cognitive Engines · Memory Slab · Skill Builder · Model Builder · Tool Registry · Audit Feed · Analytics · Marketplace · Files · Code · Terminal · Connections · Settings.
4. **Mode switch:** LOCAL · HYBRID · CLOUD.
5. **Status strip:** System Status · Active Jobs · Waiting Approvals · Total Revenue · Live Leads · Appointments · System Health. Every number comes from a real source or shows "—".
6. **Command bar:** "Tell Gabby what you want to do…" with Attach · Voice · Deep Think · Use Tools · gold send button.
7. **35 Operating Lanes:** a 7-column grid of numbered tiles (Command Center, Unified Inbox, Content Studio … AI Lab Provider Mesh). Side card: "Turn Information Into Power" with Explore Marketplace.
8. **20 AI Workers:** a portrait grid with name and role and a green online dot.
9. **Four feature cards:** Cognitive Intelligence · Skill Building · Audit Feed · Real Integrations, each with a gold action button.
10. **Footer:** logo · "People × Ideas × Technology × Impact" · Privacy · Terms · Support · Contact · GODSPEED.

## 2. APEX Global Market — `apex-global-market.png`

**Palette:** deep space navy, electric blue to violet glow, white type.
**Hero:** the glowing globe with products orbiting it, "Global Brands. Real Deals. Bigger Possibilities."

Top to bottom:
1. **Top nav:** APEX Global Market logo · Shop (active) · Deals · Categories · Brands · New Arrivals · Top Sellers · search · Account · Wishlist · Cart with count · menu.
2. **Hero:** globe with an orbiting product carousel and arrows. "Shop · Compare · Discover — all in one place" on the left; "One World. Infinite Choices." on the right.
3. **Category circles:** Women's Fashion · Men's Fashion · Shoes · Bags & Accessories · Electronics · Home & Living · Health & Fitness · Beauty & Care · Toys & Kids · Auto & Tools · Pet Supplies.
4. **Search bar:** large and centered, with a gradient **Search** button and **Search with Photo**.
5. **Trust strip:** Best Prices · Verified Sellers & Secure Checkout · Fast Global Shipping · Compare & Save · Shop Smarter with APEX.
6. **Three promo banners:** New Season New Style · Top Tech Top Brands · Make It Home Your Way.
7. **Product rows:** Top Sellers · New Arrivals · Trending Now. Each product card shows image, name, price, rating and review count.
8. **Shop Across Top Marketplaces** row.
9. **Footer:** Track Orders · Global Shipping · Secure Payments · 24/7 Support · "Explore. Shop. Belong."

**Data rule:** products, prices and ratings come from the APEX 365 Shopify store. Never show made-up ratings or review counts.
**Brand rule:** show another company's logo (Amazon, eBay, Walmart, Target, Best Buy, Etsy, AliExpress, Wayfair) only where there is a real, active integration or partnership. Otherwise show text labels or leave the row out.

## 3. APEX 360 Atelier — `apex-360-atelier.png`

**Palette:** black and navy glass, electric blue glow, gold for the selected item.
**Hero:** the **live camera / preview frame**, the largest element, never covered.

Desktop grid:
- **Top bar (64px):** APEX 360 Atelier logo · LIVE · CONNECTED · 4K HDR · volume · help · owner · menu.
- **Middle row:** left column 260px (Capture card, Transform Mode: People Only / Background Only / Both / Keep Everything, Green Screen + Key Quality) · **center: camera frame, about 65% of the width, with the 1X / WIDE / FULLSCREEN pill at its bottom** · right column 320px (Gabby chat, command input, mic).
- Gabby sits above the frame as a small orb and label, never on top of the camera.
- **Popular Worlds row (120px):** a sideways-scrolling strip of thumbnails; the last tile is "+ Custom World". Tapping a world applies it.
- **Bottom row (110px):** Audio/Music · Capture → Transform → Preview → Approve → Share with the gold **Approve & Share** · Share To (Instagram, Snapchat, TikTok, Facebook, Messages, More) + Send to Phone.
- **Smaller screens:** the side columns collapse into slide-out tabs and the camera takes the space. On phones the camera goes full width on top.

**Naming rule:** world names must not be TV show titles or logos (for example "Stranger Things", "Bridgerton", "Love Island"). Use original names: Island Villa, Upside Down, Regency Ballroom, Night Shift ER, Oil Country, Tokyo Night, White Room.

## 4. Gabby — `gabby-omni-studio.jpg`

Gabby's identity reference: warm, confident, professional, in APEX black. Her line: "I got you." She appears as the Chief of Staff in the Executive Office, as an orb and avatar in the 360 Atelier, and as the voice behind the "Ask Gabby anything…" command bar (Shopify · Projects · Automations · Analytics · More).

Use this image for Gabby's look only. It is not a layout for a screen.
