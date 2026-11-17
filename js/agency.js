(function () {
  const brands = {
    "hyundai": ["Hyundai", "Automotive campaigns, vehicle launches, feature-led creatives and digital marketing visuals."],
    "chery": ["Chery", "Automotive brand communication, promotional campaigns and vehicle-focused creative."],
    "omoda-jaecoo": ["Omoda Jaecoo", "Modern SUV campaigns, launch creatives and product-focused automotive design."],
    "kia-motors": ["KIA Motors", "Automotive advertising, model campaigns and digital brand communication."],
    "jac-motors": ["JAC Motors", "Commercial and passenger vehicle campaigns, promotional design and marketing visuals."],
    "icaur": ["iCAUR", "Electric and lifestyle vehicle campaigns, launch creatives and brand storytelling."],
    "changan": ["Changan", "Automotive promotional campaigns, product highlights and social media creative."],
    "xpeng": ["XPENG", "Electric mobility campaigns, technology-led visuals and product communication."]
  };
  const key = new URLSearchParams(window.location.search).get("brand");
  const brand = brands[key];
  const title = document.getElementById("brand-title");
  const description = document.getElementById("brand-description");
  if (!brand) {
    if (title) title.innerHTML = 'Brand <em>not found.</em>';
    if (description) description.textContent = "Please return to the Agency page and select a brand.";
    return;
  }
  document.title = brand[0] + " — Agency Portfolio | Saeed Ahmed";
  if (title) title.innerHTML = brand[0] + ' <em>portfolio.</em>';
  if (description) description.textContent = brand[1];
})();