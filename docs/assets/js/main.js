(() => {
  const S = window.SITE || {};
  const goal = name => { if (S.metrika && window.ym) window.ym(S.metrika, 'reachGoal', name); };
  const store = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  // меню
  const burger = document.querySelector('.burger');
  const nav = document.getElementById('nav');
  if (burger && nav) {
    const toggle = open => {
      burger.setAttribute('aria-expanded', open);
      nav.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => toggle(burger.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', e => { if (e.target.closest('a')) toggle(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
  }

  // цели: звонки и MAX
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-goal]');
    if (a) goal(a.dataset.goal);
  });

  // появление при прокрутке
  const els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
  } else els.forEach(el => el.classList.add('is-in'));

  // cookie
  const cookie = document.getElementById('cookie');
  if (cookie && !store.get('cookie-ok')) {
    cookie.hidden = false;
    cookie.querySelector('button').addEventListener('click', () => { store.set('cookie-ok', '1'); cookie.hidden = true; });
  }

  // лайтбокс
  const links = [...document.querySelectorAll('[data-lb]')];
  if (links.length) {
    let i = 0, box;
    const show = n => { i = (n + links.length) % links.length; const im = links[i].querySelector('img'); box.querySelector('img').src = links[i].href; box.querySelector('img').alt = im ? im.alt : ''; };
    const close = () => { box.remove(); box = null; document.body.style.overflow = ''; links[i].focus(); };
    links.forEach((a, n) => a.addEventListener('click', e => {
      e.preventDefault();
      box = document.createElement('div');
      box.className = 'lb';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      box.innerHTML = '<img alt=""><button class="lb__x" aria-label="Закрыть">×</button><button class="lb__p" aria-label="Предыдущее фото">‹</button><button class="lb__n" aria-label="Следующее фото">›</button>';
      document.body.append(box);
      document.body.style.overflow = 'hidden';
      show(n);
      box.querySelector('.lb__x').focus();
      box.addEventListener('click', ev => {
        if (ev.target.closest('.lb__p')) show(i - 1);
        else if (ev.target.closest('.lb__n')) show(i + 1);
        else if (ev.target === box || ev.target.closest('.lb__x')) close();
      });
      let x0 = null;
      box.addEventListener('touchstart', ev => { x0 = ev.touches[0].clientX; }, { passive: true });
      box.addEventListener('touchend', ev => { if (x0 === null) return; const dx = ev.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1)); x0 = null; });
    }));
    document.addEventListener('keydown', e => {
      if (!box) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(i - 1);
      if (e.key === 'ArrowRight') show(i + 1);
    });
  }

  // квиз «Рассчитать стоимость»
  const form = document.getElementById('quiz');
  if (form) {
    const steps = [...form.querySelectorAll('.qz__step')];
    const prev = form.querySelector('[data-prev]'), next = form.querySelector('[data-next]'), submit = form.querySelector('[data-submit]');
    const err = form.querySelector('.qz__err'), done = form.querySelector('.qz__done');
    let cur = 0, started = false, pointerAt = 0;
    form.addEventListener('pointerdown', () => { pointerAt = Date.now(); });
    const answered = st => !st.querySelector('.qz__opts') || st.querySelector('input:checked');
    const go = n => {
      steps[cur].hidden = true; cur = n; steps[cur].hidden = false;
      prev.hidden = cur === 0;
      next.hidden = cur === steps.length - 1;
      submit.hidden = cur !== steps.length - 1;
      err.hidden = true;
      const first = steps[cur].querySelector('input:not([type=hidden])');
      if (first && n > 0) first.focus({ preventScroll: true });
    };
    const fail = msg => { err.textContent = msg; err.hidden = false; };
    form.addEventListener('change', e => {
      if (!started) { started = true; goal('quiz_start'); }
      // радио-шаг: переходим дальше сами
      if (e.target.type === 'radio' && cur < steps.length - 1 && Date.now() - pointerAt < 1500) setTimeout(() => go(cur + 1), 180);
      // «Ничего из этого» снимает остальные галочки и наоборот
      if (e.target.name === 'extra') {
        const none = e.target.value === 'Ничего из этого';
        form.querySelectorAll('input[name=extra]').forEach(c => { if (c !== e.target && e.target.checked && (none || c.value === 'Ничего из этого')) c.checked = false; });
      }
    });
    next.addEventListener('click', () => answered(steps[cur]) ? go(cur + 1) : fail('Выберите вариант, чтобы продолжить'));
    prev.addEventListener('click', () => go(cur - 1));
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const fd = new FormData(form);
      const phone = (fd.get('phone') || '').replace(/\D/g, '');
      if (!String(fd.get('name') || '').trim()) return fail('Укажите имя');
      if (phone.length < 10) return fail('Проверьте номер телефона');
      if (!fd.get('consent')) return fail('Нужно согласие на обработку персональных данных');
      if (fd.get('website')) return; // ловушка для ботов
      const data = {
        task: fd.get('task'), area: fd.get('area'), extra: fd.getAll('extra').join(', '), when: fd.get('when'),
        name: fd.get('name'), phone: fd.get('phone'), comment: fd.get('comment'), consent: 'yes', page: location.pathname,
      };
      const finish = html => { [...steps, form.querySelector('.qz__nav')].forEach(el => { el.hidden = true; }); done.innerHTML = html; done.hidden = false; done.focus(); };
      if (!S.lead) {
        // Сайт в демо-режиме: заявке пока некуда уйти — говорим честно
        finish(`<h3>Это демо-версия сайта</h3><p>Заявки через форму пока не принимаются. Чтобы получить расчёт, позвоните или напишите в MAX: <a href="${S.tel}">${S.phone}</a>.</p>`);
        return;
      }
      submit.disabled = true;
      try {
        const r = await fetch(S.lead, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error(r.status);
        goal('lead');
        finish(`<h3>Спасибо, ${String(data.name).replace(/[<>&"]/g, '')}!</h3><p>Перезвоню, уточню детали и назову стоимость. Если срочно — <a href="${S.tel}">${S.phone}</a>.</p>`);
      } catch (x) {
        submit.disabled = false;
        fail('Не получилось отправить. Позвоните, пожалуйста: ' + S.phone);
      }
    });
  }
})();
