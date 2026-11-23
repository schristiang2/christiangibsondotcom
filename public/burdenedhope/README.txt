BurdenedHope website redesign concept
Designed by Christian Gibson, November 2026

WHAT'S IN THIS FOLDER
  index.html        Home
  collection.html   Collection 01: Burden
  product.html      Product page (The Brand Tee)
  gospel.html       The Gospel
  prelaunch.html    Pre-launch / password page
  images/           Product photos, logo, and hero texture
  js/               Small scripts for the interactive parts

It's plain HTML, CSS and JavaScript with no build step or dependencies.
Fonts load from Google Fonts.

LIVES AT
  christiangibson.com/burdenedhope (static files in public/burdenedhope,
  routed in vercel.json like the other client previews)

WHAT WORKS
  - Home: the nav is clear over the hero, then turns solid black once you
    scroll past it.
  - Collection: the category filters.
  - Product: color swatches swap the photo, sizes update the price, and
    Add to cart counts up (demo only, no real checkout).
  - The Gospel: scroll animations and the "Read the Scripture" buttons.
    Scroll effects need current Chrome, Edge or Safari. Other browsers show
    the page without them.
  - Every page works on phones.

FOR THE CLIENT PREVIEW
  - A small bar at the bottom of each page links all five pages and says
    who designed it. Visitors can close it with the x. To remove it for good,
    delete js/preview-bar.js and its <script> tag on each page.
  - Each page has <meta name="robots" content="noindex, nofollow"> so search
    engines won't list the concept. Remove that line if you want it indexed.

NOTES
  - This is a design concept, not the live store. The buttons, signup forms
    and cart are for show only.
  - Product photos and prices were taken from burdenedhope.com on
    November 23, 2026, resized for the web.
  - Gospel page verses are KJV stand-ins. The live site's LSB text needs
    the Lockman Foundation permission notice.
  - The BurdenedHope name, logo and product designs belong to BurdenedHope.
