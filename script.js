const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', e => { glow.style.opacity = '1'; glow.style.left = `${e.clientX}px`; glow.style.top = `${e.clientY}px`; });
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }), { threshold: .16 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
