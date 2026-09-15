document.addEventListener('DOMContentLoaded', function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  var selector = [
    '.hero-card',
    '.skill-panel',
    '.about-card',
    '.project-card',
    '.contact-card',
    '.contact-visual'
  ].join(',');
  var targets = Array.prototype.slice.call(document.querySelectorAll(selector));
  if (!targets.length) return;

  targets.forEach(function (el) {
    el.classList.add('js-tilt');

    var shine = document.createElement('span');
    shine.className = 'tilt-shine';
    el.appendChild(shine);

    var frame = null;
    var active = false;
    var currentX = 0;
    var currentY = 0;
    var targetX = 0;
    var targetY = 0;
    var maxTilt = el.classList.contains('hero-card') ? 12 : 7;

    function render() {
      frame = null;
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      el.style.transform = 'perspective(1100px) rotateX(' + (-currentY) + 'deg) rotateY(' + currentX + 'deg) translate3d(0,-4px,10px)';
      if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        frame = requestAnimationFrame(render);
      }
    }

    function move(event) {
      var rect = el.getBoundingClientRect();
      var x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      var y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      targetX = (x - 0.5) * maxTilt;
      targetY = (y - 0.5) * (maxTilt * 0.8);
      el.style.setProperty('--shine-x', (x * 100) + '%');
      el.style.setProperty('--shine-y', (y * 100) + '%');
      if (!active) {
        active = true;
        el.classList.add('is-tilting');
      }
      if (!frame) frame = requestAnimationFrame(render);
    }

    function reset() {
      targetX = 0;
      targetY = 0;
      active = false;
      el.classList.remove('is-tilting');
      el.style.setProperty('--shine-x', '50%');
      el.style.setProperty('--shine-y', '50%');
      if (!frame) frame = requestAnimationFrame(render);
    }

    el.addEventListener('pointermove', move, { passive: true });
    el.addEventListener('pointerleave', reset, { passive: true });
  });
});
