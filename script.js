// Wait until the website is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {

  // Load the flower photos from the network (Wikipedia)
  loadFlowerImages();

  // Find all the "Add to Cart" buttons
  const cartButtons = document.querySelectorAll('.add-to-cart-btn');

  // Attach a click event to every button
  cartButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Get the name of the flower from the data-flower attribute we put in the HTML
      const chosenFlower = this.getAttribute('data-flower');

      // 1. Play a quick trick to make it look like a real store
      this.innerHTML = "Added! 💖";
      this.style.backgroundColor = "#a4c9a7"; // Turn button green
      document.getElementById('cart-badge').innerText = "1"; // Update cart counter

      // 2. Wait 1.5 seconds, then trigger the surprise
      setTimeout(() => {
        triggerSurprise(chosenFlower);
      }, 1500);
    });
  });

});

// Fetches a matching photo for each flower from Wikipedia's free API.
// If a fetch fails, the original Unsplash image in the HTML stays as a fallback.
async function loadFlowerImages() {
  const imgs = document.querySelectorAll('img[data-wiki]');

  await Promise.all([...imgs].map(async (img) => {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${img.dataset.wiki}`
      );
      if (!res.ok) throw new Error('Not found');

      const data = await res.json();
      const url = data.thumbnail?.source;
      if (url) img.src = url; // use the thumbnail exactly as Wikipedia provides it
    } catch (err) {
      console.warn(`Using fallback image for ${img.alt}`, err);
    }
  }));
}

// The main function that handles sending the email and showing the letter
function triggerSurprise(flowerName) {

  // --- PART 1: SEND THE SECRET EMAIL ---
  const form = document.getElementById('secret-form');
  const flowerInput = document.getElementById('flower-input');

  // Put the flower she chose into the hidden input
  flowerInput.value = flowerName;

  // Send the data to Formspree silently in the background
  if (form.action.includes("formspree.io")) {
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).catch(error => console.log("Formspree error:", error));
  }

  // --- PART 2: THE REVEAL ---
  // Hide the store view
  document.getElementById('store-view').classList.add('hidden-element');

  // Show the letter container
  document.getElementById('letter-container').classList.remove('hidden-element');

  // --- PART 3: WRITE THE CUSTOM LETTER ---
  const letterText = document.getElementById('letter-text');

  // Using template literals (backticks) so we can insert the flowerName variable
  letterText.innerHTML = `
    <p>Hello my babi,</p>

    <p>
      I really wish to see you na. As each day passes, I yearn for you more
      and more. I really want to be with you, hug you, kiss you, and hear your
      stories—especially the promise that I will fulfill for you, babi.
    </p>

    <p>I am so excited po.</p>

    <p>
      From your babi,<br>
      I miss you so much and love you!
    </p>
  `;

  // Scroll to the top of the page so the letter is perfectly centered
  window.scrollTo(0, 0);
}