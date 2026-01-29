// Basic site interactions: reviews carousel and footer year
const reviews = [
  {text: '"ByteWave transformed our product vision into a working app in a single quarter."', author: '— Jane Doe, CEO, Acme Health'},
  {text: '"A truly dependable team — fast, professional, and communicative."', author: '— Ahmed Khan, CTO, FinServe'},
  {text: '"Their attention to UX and performance is excellent."', author: '— Li Wei, Product Lead, ShopEasy'}
];
let reviewIndex = 0;
const reviewText = document.getElementById('reviewText');
const reviewAuthor = document.getElementById('reviewAuthor');
function showReview(i){const r=reviews[i%reviews.length];if(reviewText) reviewText.textContent=r.text;if(reviewAuthor) reviewAuthor.textContent=r.author}
document.getElementById('prevReview')?.addEventListener('click',()=>{reviewIndex=(reviewIndex-1+reviews.length)%reviews.length;showReview(reviewIndex)});
document.getElementById('nextReview')?.addEventListener('click',()=>{reviewIndex=(reviewIndex+1)%reviews.length;showReview(reviewIndex)});
showReview(reviewIndex);
// Footer year
const yearEl = document.getElementById('year'); if(yearEl) yearEl.textContent = new Date().getFullYear();
// Simple nav active state
document.querySelectorAll('.nav-item').forEach(a=>{a.addEventListener('click',()=>{document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));a.classList.add('active')})});
// Contact form handling (client-side)
const contactForm = document.querySelector('#contactForm');
if(contactForm){
  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = contactForm.querySelector('#name').value; const email = contactForm.querySelector('#email').value; const message = contactForm.querySelector('#message').value;
    if(!name||!email||!message){alert('Please complete all fields.');return;} 
    contactForm.innerHTML = `<div class="card"><h3>Thanks, ${name}!</h3><p>We received your message and will contact you at <strong>${email}</strong>.</p></div>`;
  })
}

// Footer feedback form (client-side)
const fbForm = document.querySelector('#footerFeedbackForm');
if(fbForm){
  fbForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const email = fbForm.querySelector('#fb-email').value; const message = fbForm.querySelector('#fb-message').value; const res = document.getElementById('fb-response');
    if(!email||!message){res.textContent = 'Please complete both fields.';res.style.color='red';return;} 
    res.style.color=''; res.textContent = 'Thanks! We received your feedback.'; fbForm.reset();
  })
}