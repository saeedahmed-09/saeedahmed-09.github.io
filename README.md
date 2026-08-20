# Saeed Ahmed — Portfolio Website

Elegant/premium multi-page portfolio site. 4 pages: `index.html` (home + slider), `about.html`, `work.html`, `contact.html`.

## GitHub Pages par live karna (free)

1. GitHub par login karein → naya repository banayein (agar personal site chahiye to naam bilkul `<aapka-username>.github.io` rakhein, ya koi bhi naam rakh kar project page use karein).
2. Is folder ki **saari files** (index.html, about.html, work.html, contact.html, css/, js/, assets/, README.md) us repository mein upload/push kar dein.
3. Repository ke **Settings → Pages** mein jayein.
4. "Branch" mein `main` select karein aur Save karein.
5. 1-2 minute mein site is link par live ho jayegi:
   - `https://<username>.github.io` (agar repo naam `.github.io` tha)
   - `https://<username>.github.io/<repo-name>` (agar koi aur naam tha)

## Real portfolio images add karna

Work page (`work.html`) mein abhi placeholder tiles hain (sirf naam likha hai, tasveer nahi). Real images add karnay ke liye:

1. Saeed ki actual project images `assets/work/<category>/` folders mein daal dein (jaise `assets/work/logos/ibox.jpg`).
2. `work.html` file kholein, jo card update karni hai us mein ye block dhoondein:
   ```html
   <div class="work-thumb frame-corners"><span class="fc-tr"></span><span class="fc-bl"></span>
     <div class="ph-label">...</div>
   </div>
   ```
   Ise is sy replace kar dein:
   ```html
   <div class="work-thumb frame-corners">
     <span class="fc-tr"></span><span class="fc-bl"></span>
     <img src="assets/work/logos/ibox.jpg" alt="Ibox logo design" style="width:100%;height:100%;object-fit:cover;">
   </div>
   ```
3. `about.html` mein Saeed ki actual photo add karnay ke liye `about-portrait` div mein `<img>` tag daal dein.

## Content edit karna

Har page ek simple HTML file hai — text seedha `<h1>`, `<p>`, `<li>` tags ke andar likha hai, koi build step nahi chahiye. Kisi bhi text editor (ya GitHub ke apnay online editor) sy directly edit kar saktay hain.

## Contact form

`contact.html` ka form abhi `mailto:` ke zarye kaam karta hai (submit karnay par user ka email app khul jata hai, Saeed ko email pehlay sy fill hui aa jati hai). Agar aap chahen ke form seedha kisi database/inbox mein jaye, to Formspree jaisi free service use ki ja sakti hai.
