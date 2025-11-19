// -----------------------------
// Shared utilities & UI
// -----------------------------

// update live clock and years
(function localTimeAndYear(){
  function update() {
    const now = new Date();
    const localTimeEl = document.getElementById('localTime');
    if(localTimeEl) localTimeEl.textContent = now.toLocaleString();
    const years = now.getFullYear();
    document.querySelectorAll('#currentYear, #currentYearFooter1, #currentYearFooterA, #currentYearFooterP, #currentYearFooterO, #currentYearFooterC, #currentYearFooterF, #currentYearFooterE, #currentYearFooter5, #currentYearFooter6, #currentYearFooter7, #currentYearFooterContact').forEach(el=>{
      if(el) el.textContent = years;
    });
  }
  update();
  setInterval(update, 1000);
})();

// hamburger menu toggle
(function hamburger(){
  document.querySelectorAll('.hamburger').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const ul = btn.closest('.navbar').querySelector('ul');
      const expanded = ul.classList.toggle('show');
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  });
})();

// -----------------------------
// Slider
// -----------------------------
(function slider(){
  const slides = document.querySelectorAll('.slide');
  if(!slides || slides.length === 0) return;
  let idx = 0;
  const nextBtn = document.querySelector('.next');
  const prevBtn = document.querySelector('.prev');

  function show(i){
    slides.forEach((s, j)=> s.classList.toggle('active', i===j));
  }

  if(nextBtn) nextBtn.addEventListener('click', ()=> { idx = (idx+1) % slides.length; show(idx); });
  if(prevBtn) prevBtn.addEventListener('click', ()=> { idx = (idx-1+slides.length) % slides.length; show(idx); });

  setInterval(()=> { idx = (idx+1) % slides.length; show(idx); }, 5000);
})();

// -----------------------------
// Lightbox
// -----------------------------
(function lightbox(){
  const lb = document.getElementById('lightbox');
  if(!lb) return;
  const lbImg = lb.querySelector('img');
  const lbCaption = lb.querySelector('.lightbox-caption');
  const close = lb.querySelector('.lightbox-close');

  function open(imgEl){
    const src = imgEl.dataset.large || imgEl.src;
    lbImg.src = src;
    lbImg.alt = imgEl.alt || '';
    lbCaption.textContent = imgEl.alt || '';
    lb.style.display = 'flex';
    lb.setAttribute('aria-hidden','false');
  }

  // targets: any image inside .lightbox-target
  document.querySelectorAll('.lightbox-target img').forEach(img=>{
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', ()=> open(img));
  });

  if(close){
    close.addEventListener('click', ()=> { lb.style.display = 'none'; lb.setAttribute('aria-hidden','true'); });
  }
  if(lb){
    lb.addEventListener('click', (e)=> { if(e.target === lb) { lb.style.display = 'none'; lb.setAttribute('aria-hidden','true'); } });
  }
})();

// -----------------------------
// Accordions
// -----------------------------
(function accordions(){
  document.querySelectorAll('.accordion-toggle').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const panel = btn.nextElementSibling;
      const open = panel.style.display === 'block';
      // close all
      document.querySelectorAll('.accordion-panel').forEach(p=> p.style.display = 'none');
      // toggle
      panel.style.display = open ? 'none' : 'block';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });
})();

// -----------------------------
// Order & Feedback logic
// -----------------------------
(function orderAndFeedback(){
  const prices = {coffee:3.5, pastry:2.5, cake:15, tea:3};

  function calcTotal(form){
    if(!form) return 0;
    const coffee = parseInt(form.coffee?.value)||0;
    const pastry = parseInt(form.pastry?.value)||0;
    const cake = parseInt(form.cake?.value)||0;
    const tea = parseInt(form.tea?.value)||0;
    return coffee*prices.coffee + pastry*prices.pastry + cake*prices.cake + tea*prices.tea;
  }

  // Order page
  const orderForm = document.getElementById('orderForm');
  if(orderForm){
    const totalEl = document.getElementById('totalPrice');
    orderForm.addEventListener('input', ()=>{
      const total = calcTotal(orderForm);
      if(totalEl) totalEl.textContent = `Total: $${total.toFixed(2)}`;
    });

    orderForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const total = calcTotal(orderForm);
      if(total === 0){ alert('Please select at least one product to order.'); return; }

      // save simulated order to localStorage
      const order = {
        name: orderForm.customerName?.value || '',
        email: orderForm.customerEmail?.value || '',
        items: {
          coffee: parseInt(orderForm.coffee?.value)||0,
          pastry: parseInt(orderForm.pastry?.value)||0,
          cake: parseInt(orderForm.cake?.value)||0,
          tea: parseInt(orderForm.tea?.value)||0,
        },
        total,
        date: new Date().toISOString()
      };
      const orders = JSON.parse(localStorage.getItem('dule_orders')||'[]');
      orders.push(order);
      localStorage.setItem('dule_orders', JSON.stringify(orders));

      const orderMessage = document.getElementById('orderMessage');
      if(orderMessage){ orderMessage.textContent = '✔ Order placed — redirecting...'; orderMessage.style.display = 'block'; }

      // short delay then redirect
      setTimeout(()=> window.location.href = '/pages/confirmation.html', 900);
    });
  }

  // Feedback page
  const fbForm = document.getElementById('feedbackForm');
  if(fbForm){
    fbForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const rating = fbForm.rating?.value || '';
      const comments = document.getElementById('comments')?.value || '';
      const store = JSON.parse(localStorage.getItem('dule_feedback')||'[]');
      store.push({rating, comments, date: new Date().toISOString()});
      localStorage.setItem('dule_feedback', JSON.stringify(store));
      const success = document.getElementById('successMsg');
      if(success) success.style.display = 'block';
      fbForm.reset();
    });
  }

  // Enquiry form
  const eForm = document.getElementById('enquiryForm');
  if(eForm){
    eForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const msg = document.getElementById('formMessage');
      if(msg) msg.style.display = 'block';
      eForm.reset();
    });
  }
})();

// -----------------------------
// Small dynamic demo counters
// -----------------------------
(function dynamicDemo(){
  const eta = document.getElementById('etaMinutes');
  const queue = document.getElementById('ordersInQueue');
  if(!eta || !queue) return;
  function tick(){
    const nextEta = Math.max(3, Math.round(8 + Math.random()*8));
    const nextQ = Math.max(0, Math.round(Math.random()*4));
    eta.textContent = nextEta;
    queue.textContent = nextQ;
  }
  tick();
  setInterval(tick, 7000);
})();
