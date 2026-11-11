# 05. `.env.example`

Site URL, contact email, owner name and AdSense settings.

```bash
# Public origin used for canonical URLs, sitemap.xml, robots.txt and JSON-LD. Required for production.
NEXT_PUBLIC_SITE_URL=https://fitkb.example.com

# Address shown on /contact and in the privacy policy.
# If unset, hello@<your domain> is used, so create that mailbox or set this.
NEXT_PUBLIC_CONTACT_EMAIL=

# Optional: the person or company running the site, shown on /about and as the guide author.
NEXT_PUBLIC_OWNER_NAME=

# Google AdSense publisher id, e.g. ca-pub-1234567890123456.
# Setting it adds the AdSense script, the google-adsense-account verification tag,
# /ads.txt, and the Google advertising section of the privacy policy. Leave empty for no ads.
NEXT_PUBLIC_ADSENSE_CLIENT=

# Optional: id of a responsive "Display" ad unit for fixed in-content slots.
# Without it, use Auto ads in the AdSense dashboard instead.
NEXT_PUBLIC_ADSENSE_SLOT=
```
