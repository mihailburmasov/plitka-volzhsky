import { company, url, esc, img, credit, show, draft, isTodo, hasMetrika, crumbs, faqBlock, faqLd, ctaBand, business } from '../lib/ui.mjs';
import { miterCompare, icons } from '../lib/svg.mjs';
import { SERVICES, serviceCard } from './services.mjs';

const tel = `tel:${company.phone}`;

// Объекты из фото клиента. Названия описательные: адресов и площадей клиент не сообщал.
export const WORKS = [
  { t: 'Санузел в тёмном мраморе с инсталляцией', d: 'Крупный керамогранит, короб с полкой из плитки, душевой поддон из плитки с линейным трапом', ids: ['chernyy-mramor-polka', 'chernyy-mramor-dush', 'chernyy-mramor-okno'] },
  { t: 'Ванная с «ёлочкой» под дерево', d: 'Акцентная стена ёлочкой, серый керамогранит, облицованный экран ванны', ids: ['elochka-vannaya', 'elochka-ekran'] },
  { t: 'Санузел с сине-золотой вставкой', d: 'Вертикальная вставка на коробе инсталляции, стены и пол под белый мрамор, душевая с трапом', ids: ['zoloto-installyatsiya', 'zoloto-stena', 'zoloto-ugol', 'zoloto-dush'] },
  { t: 'Санузел с белой рельефной плиткой', d: 'Рельефные вставки, швы совпадают по углам и стенам', ids: ['belyy-relef', 'belyy-relef-2', 'belyy-relef-ugol'] },
  { t: 'Кухонный фартук до потолка', d: 'Белая глянцевая плитка, вырезы под розетки и выводы', ids: ['fartuk-kuhnya', 'fartuk-kuhnya-2', 'fartuk-kuhnya-3'] },
  { t: 'Санузел в двух тонах', d: 'Серая плитка в нижней части стен, светлая — в верхней, одна линия по всему периметру', ids: ['seryy-dva-tona', 'seryy-dva-tona-2'] },
];

export const HOME_FAQ = [
  { q: 'Сколько стоит укладка плитки в Волжском?', a: 'Стоимость считаю после осмотра: она зависит от площади, формата плитки, раскладки, состояния стен и пола и количества запилов, ниш и вырезов. Опишите задачу в форме расчёта или позвоните — назову цену и сроки.' },
  { q: 'Что такое заусовка, или запил под 45°?', a: 'Это срез кромки плитки под углом 45°. Две плитки сходятся на внешнем углу тонким ребром без пластикового уголка. Так оформляют короба, откосы, ниши, бортики ванны и торцы столешниц.', more: `Подробнее — на странице <a href="${url('/uslugi/zapil-45/')}">о запиле 45°</a>.` },
  { q: 'Делаете ли ванную комнату под ключ?', a: 'Да. Беру ванную или санузел целиком: демонтаж старого кафеля, сантехника, электрика, короба из гипсокартона, скрытые люки, плитка с нишами и запилом 45°. Вы общаетесь с одним мастером.', more: `Этапы — на странице <a href="${url('/uslugi/vannaya-pod-klyuch/')}">ванная под ключ</a>.` },
  { q: 'Можно ли сделать нишу или полку из плитки?', a: 'Да: нишу в стене, если позволяет толщина, или в коробе из гипсокартона, и полку над коробом инсталляции. Швы ниши совпадают со стеной, кромки — с запилом 45°.' },
  { q: 'Нужно ли снимать старую плитку?', a: 'Чаще всего да. Если старая плитка отходит или звучит пусто, новая на ней не удержится. После осмотра скажу, что можно оставить. Демонтаж старого кафеля делаю сам.' },
  { q: 'Где вы работаете?', a: `Работаю ${company.cityIn} (${company.region}).`, more: isTodo(company.areaNote) ? show(company.areaNote) : esc(company.areaNote) },
];

const process = [
  ['Осмотр и расчёт', 'Смотрю помещение, проверяю стены и пол, обсуждаем плитку, ниши, короба. Называю стоимость.'],
  ['Подготовка', 'Демонтаж, сантехника, электрика, короба из гипсокартона — всё, что должно быть готово до плитки.'],
  ['Раскладка', 'Заранее решаю, где лягут целые плитки и подрезка, как совпадут швы с выводами и углами.'],
  ['Укладка', 'Кладу на СВП, режу и делаю запил под 45° профессиональным инструментом.'],
  ['Затирка и сдача', 'Затираю швы, ставлю люки и сантехнику, убираю за собой.'],
];

function quiz() {
  const step = (n, q, name, opts, multi = false) => `<fieldset class="qz__step" data-step="${n}"${n > 1 ? ' hidden' : ''}>
  <legend class="qz__q"><span class="qz__n">${n} / 5</span>${q}</legend>
  <div class="qz__opts">${opts.map(o => `<label class="opt"><input type="${multi ? 'checkbox' : 'radio'}" name="${name}" value="${esc(o)}"><span>${esc(o)}</span></label>`).join('')}</div>
</fieldset>`;
  return `<form class="qz" id="quiz" novalidate>
${step(1, 'Что нужно сделать?', 'task', ['Ванная или санузел под ключ', 'Укладка плитки', 'Кухонный фартук или столешница', 'Ниша, полка, запил 45°', 'Другое'])}
${step(2, 'Примерная площадь укладки?', 'area', ['До 5 м²', '5–10 м²', '10–20 м²', 'Больше 20 м²', 'Не знаю'])}
${step(3, 'Что ещё понадобится?', 'extra', ['Демонтаж старой плитки', 'Сантехника', 'Электрика', 'Короба из гипсокартона', 'Скрытый люк', 'Ничего из этого'], true)}
${step(4, 'Когда планируете начать?', 'when', ['Как можно скорее', 'В течение месяца', 'Пока присматриваюсь'])}
<fieldset class="qz__step" data-step="5" hidden>
  <legend class="qz__q"><span class="qz__n">5 / 5</span>Куда сообщить расчёт?</legend>
  <div class="qz__fields">
    <label class="fld"><span>Имя</span><input name="name" autocomplete="given-name" required maxlength="60"></label>
    <label class="fld"><span>Телефон</span><input name="phone" type="tel" autocomplete="tel" required inputmode="tel" placeholder="+7" maxlength="20"></label>
    <label class="fld fld--wide"><span>Комментарий <i>(необязательно)</i></span><textarea name="comment" rows="2" maxlength="600" placeholder="Например: санузел 4 м², плитка уже куплена"></textarea></label>
    <label class="hp" aria-hidden="true">Не заполняйте <input name="website" tabindex="-1" autocomplete="off"></label>
    <label class="consent"><input type="checkbox" name="consent" checked required><span>Даю <a href="${url('/soglasie/')}" target="_blank">согласие на обработку персональных данных</a> по <a href="${url('/politika-konfidentsialnosti/')}" target="_blank">политике конфиденциальности</a></span></label>
  </div>
</fieldset>
<div class="qz__nav">
  <button type="button" class="btn btn--ghost" data-prev hidden>Назад</button>
  <button type="button" class="btn" data-next>Дальше</button>
  <button type="submit" class="btn" data-submit hidden>Получить расчёт</button>
</div>
<p class="qz__err" role="alert" hidden></p>
<div class="qz__done" hidden tabindex="-1"></div>
</form>`;
}

export function home() {
  return {
    path: '/', title: `Укладка плитки в Волжском — плиточник ${company.master}, «${company.brand}»`,
    ogTitle: `${company.brand} — укладка плитки в Волжском`,
    description: 'Плиточник в Волжском: укладка плитки и керамогранита, запил 45°, ниши и полки из плитки, столешницы и фартуки, ванная под ключ. Тел. ' + company.phoneDisplay,
    jsonld: [business(), faqLd(HOME_FAQ)],
    bodyClass: 'page-home',
    body: `
<section class="hero">
  <div class="hero__bg">${img('hero-vannaya', { eager: true, bare: true, sizes: '100vw' })}</div>
  <div class="wrap hero__in">
    <div class="hero__txt">
      <p class="eyebrow">Плиточник в Волжском · мастер ${esc(company.master)}</p>
      <h1 class="hero__h">Укладка плитки в&nbsp;Волжском — <em>ровно</em>, с&nbsp;запилом под&nbsp;45°</h1>
      <p class="hero__lead">Санузлы и ванные под ключ, кухонные фартуки и столешницы из керамогранита, ниши и полки из плитки. Работаю профессиональным инструментом и беру на себя электрику, сантехнику и короба.</p>
      <div class="btns"><a class="btn" href="#raschet">Рассчитать стоимость</a><a class="btn btn--ghost" href="${tel}" data-goal="phone">${esc(company.phoneDisplay)}</a></div>
      <ul class="hero__chips">${['Запил 45°', 'Система выравнивания СВП', 'Ниши и полки', 'Под ключ'].map(c => `<li>${c}</li>`).join('')}</ul>
    </div>
  </div>
  <p class="hero__credit">${credit('hero-vannaya')}</p>
</section>

<section class="sec sec--intro"><div class="wrap intro">
  <h2 class="intro__h reveal">Чем занимаюсь</h2>
  <p class="intro__p reveal"><b>«${esc(company.brand)}» — мастер-плиточник ${esc(company.master)} из Волжского.</b> Укладываю плитку и керамогранит на стены и пол, делаю запил углов под 45° (заусовку), ниши и полки из плитки, столешницы и фартуки из керамогранита и ванные комнаты под ключ. Сопутствующие работы тоже беру на себя: монтаж электрики и сантехники, короба из гипсокартона, скрытые люки, демонтаж старого кафеля.</p>
</div></section>

<section class="sec" id="uslugi"><div class="wrap">
  <div class="sec__head"><h2 class="h2 reveal">Услуги</h2><a class="link" href="${url('/uslugi/')}">Все услуги ${icons.arrow}</a></div>
  <div class="svcs">${SERVICES.map(serviceCard).join('')}</div>
</div></section>

<section class="sec sec--peach miter"><div class="wrap miter__in">
  <div class="miter__txt reveal">
    <p class="eyebrow">${icons.miter} Деталь, по которой видно мастера</p>
    <h2 class="h2">Углы без пластиковых уголков</h2>
    <p>Внешние углы коробов, ниш, откосов и бортиков делаю запилом под 45°. Плитки сходятся тонким ребром, рисунок «огибает» угол, и нет полоски пластика, которая желтеет и выдаёт дешёвый ремонт.</p>
    <a class="link" href="${url('/uslugi/zapil-45/')}">Подробнее о запиле 45° ${icons.arrow}</a>
  </div>
  <div class="diagram-wrap reveal">${miterCompare}</div>
</div></section>

<section class="sec" id="raboty"><div class="wrap">
  <div class="sec__head"><h2 class="h2 reveal">Мои работы</h2><a class="link" href="${url('/raboty/')}">Все работы ${icons.arrow}</a></div>
  <div class="works">${WORKS.map((w, i) => `<a class="work reveal${i === 0 ? ' work--big' : ''}" href="${url('/raboty/')}#obekt-${i + 1}">
    <span class="work__img">${img(w.ids[0], { sizes: i === 0 ? '(max-width: 760px) 100vw, 50vw' : '(max-width: 760px) 50vw, 25vw' })}</span>
    <span class="work__cap"><b>${esc(w.t)}</b><small>${w.ids.length} фото</small></span>
  </a>`).join('')}</div>
</div></section>

<section class="sec sec--tint"><div class="wrap">
  <h2 class="h2 reveal">Как работаю</h2>
  <div class="how">
    <ol class="steps">${process.map(([t, d]) => `<li class="reveal"><b>${t}</b><span>${d}</span></li>`).join('')}</ol>
    <div class="how__ph">
      ${img('process-okno', { sizes: '(max-width: 760px) 50vw, 22vw', caption: 'Шнуры и СВП держат плоскость' })}
      ${img('process-svp', { sizes: '(max-width: 760px) 50vw, 22vw', caption: 'Ряды выставлены до клея' })}
    </div>
  </div>
</div></section>

${faqBlock(HOME_FAQ)}

<section class="sec sec--mint" id="raschet"><div class="wrap raschet">
  <div class="raschet__txt">
    <h2 class="h2">Рассчитать стоимость</h2>
    <p>Ответьте на 4 вопроса и оставьте телефон — перезвоню, уточню детали и назову стоимость и сроки.</p>
    <p class="raschet__alt">Или сразу:<br><a href="${tel}" data-goal="phone">${esc(company.phoneDisplay)}</a><br><span>звонок или MAX по этому номеру</span></p>
  </div>
  ${quiz()}
</div></section>`,
  };
}

export function works() {
  const cr = [{ name: 'Главная', path: '/' }, { name: 'Работы', path: '/raboty/' }];
  return {
    path: '/raboty/', title: `Фото работ плиточника в Волжском — «${company.brand}»`, crumbs: cr,
    description: 'Фото работ мастера-плиточника из Волжского: санузлы и ванные под ключ, керамогранит под мрамор, ёлочка, ниши и короба, кухонные фартуки.',
    jsonld: [business()],
    body: `${crumbs(cr)}
<section class="sec sec--top"><div class="wrap">
  <h1 class="h1">Мои работы</h1>
  <p class="lead lead--narrow">Санузлы, ванные и кухни, которые я облицевал. Часть кадров — в процессе: видно систему выравнивания и как выставлены ряды до затирки.</p>
  ${WORKS.map((w, i) => `<article class="obj" id="obekt-${i + 1}">
    <h2 class="h3 reveal">${esc(w.t)}</h2><p class="obj__d reveal">${esc(w.d)}</p>
    <div class="gal">${w.ids.map(id => `<a class="gal__i reveal" href="${url(`/assets/img/${id}-1600.webp`)}" data-lb>${img(id, { sizes: '(max-width: 760px) 50vw, 25vw' })}</a>`).join('')}</div>
  </article>`).join('')}
  <article class="obj" id="process">
    <h2 class="h3 reveal">В процессе</h2><p class="obj__d reveal">Укладка на СВП, шнуры, выводы под розетки и коллектор — до облицовки.</p>
    <div class="gal">${['process-svp', 'process-okno', 'process-kollektor'].map(id => `<a class="gal__i reveal" href="${url(`/assets/img/${id}-1600.webp`)}" data-lb>${img(id, { sizes: '(max-width: 760px) 50vw, 25vw' })}</a>`).join('')}</div>
  </article>
</div></section>
${ctaBand('Хотите так же? Посчитаю стоимость вашего объекта')}`,
  };
}

export function contacts() {
  const cr = [{ name: 'Главная', path: '/' }, { name: 'Контакты', path: '/kontakty/' }];
  return {
    path: '/kontakty/', title: `Контакты плиточника в Волжском — «${company.brand}»`, crumbs: cr,
    description: `Связаться с мастером-плиточником в Волжском: ${company.phoneDisplay}, звонок или MAX. Укладка плитки, ванные под ключ, запил 45°.`,
    jsonld: [business()],
    body: `${crumbs(cr)}
<section class="sec sec--top"><div class="wrap contacts">
  <div>
    <h1 class="h1">Контакты</h1>
    <p class="lead">Мастер ${esc(company.master)}, «${esc(company.brand)}». Работаю ${esc(company.cityIn)}, ${esc(company.region)}.</p>
    <dl class="cdl">
      <dt>Телефон</dt><dd><a class="big" href="${tel}" data-goal="phone">${esc(company.phoneDisplay)}</a></dd>
      <dt>MAX</dt><dd>по этому же номеру ${isTodo(company.maxUrl) ? show(company.maxUrl) : `· <a href="${esc(company.maxUrl)}" target="_blank" rel="noopener" data-goal="max">написать в MAX</a>`}</dd>
      <dt>E-mail</dt><dd>${isTodo(company.email) ? show(company.email) : `<a href="mailto:${esc(company.email)}">${esc(company.email)}</a>`}</dd>
      <dt>Когда звонить</dt><dd>${show(company.hours)}</dd>
      <dt>Где работаю</dt><dd>${esc(company.city)}${isTodo(company.areaNote) ? '<br>' + show(company.areaNote) : ', ' + esc(company.areaNote)}</dd>
    </dl>
  </div>
  <div class="contacts__card cut">
    <p class="h3">Посчитать стоимость</p>
    <p>Ответьте на 4 вопроса — и я перезвоню с ценой и сроками.</p>
    <a class="btn" href="${url('/#raschet')}">Открыть расчёт</a>
  </div>
</div></section>`,
  };
}

export function privacy() {
  const cr = [{ name: 'Главная', path: '/' }, { name: 'Политика конфиденциальности', path: '/politika-konfidentsialnosti/' }];
  const op = show(company.operator);
  return {
    path: '/politika-konfidentsialnosti/', title: `Политика конфиденциальности — «${company.brand}»`, crumbs: cr,
    description: `Политика обработки персональных данных на сайте мастера-плиточника «${company.brand}», Волжский: какие данные собираются через форму расчёта и как используются.`,
    body: `${crumbs(cr)}
<section class="sec sec--top"><div class="wrap wrap--narrow prose">
  <h1 class="h1">Политика конфиденциальности</h1>
  <p>Документ описывает, как обрабатываются персональные данные посетителей сайта «${esc(company.brand)}» в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».</p>
  <h2 class="h3">1. Оператор</h2>
  <p>Оператор персональных данных: ${op}. Город: ${esc(company.city)}, ${esc(company.region)}. Телефон для обращений: ${esc(company.phoneDisplay)}. E-mail: ${show(company.email)}.</p>
  <h2 class="h3">2. Какие данные собираются</h2>
  <p>Через форму расчёта стоимости: имя, номер телефона, комментарий (по желанию) и ответы на вопросы о работе (вид работ, площадь, сроки). Других персональных данных сайт не запрашивает.</p>
  <h2 class="h3">3. Цели обработки</h2>
  <p>Связаться с вами, уточнить задачу, рассчитать стоимость и сроки работ. Данные не используются для рассылок и не передаются третьим лицам, кроме случаев, предусмотренных законом.</p>
  <h2 class="h3">4. Основание и срок</h2>
  <p>Основание — ваше <a href="${url('/soglasie/')}">согласие</a>, которое вы даёте, отмечая галочку в форме. Данные хранятся до достижения цели обработки, но не дольше одного года с момента обращения, либо до отзыва согласия.</p>
  <h2 class="h3">5. Ваши права</h2>
  <p>Вы можете запросить сведения о своих данных, потребовать их уточнения или удаления и отозвать согласие, позвонив по телефону ${esc(company.phoneDisplay)}${isTodo(company.email) ? '' : ' или написав на ' + esc(company.email)}.</p>
  <h2 class="h3">6. Cookie</h2>
  <p>Сайт использует cookie и локальное хранилище браузера только для корректной работы — например, чтобы запомнить, что вы закрыли уведомление о cookie. ${hasMetrika ? 'Для статистики посещений установлен сервис Яндекс Метрика (ООО «Яндекс»): он собирает обезличенные данные о посещениях — страницы, время, тип устройства, примерное местоположение по IP. Отключить cookie можно в настройках браузера.' : 'Сервисы аналитики и рекламы на сайте не установлены.'}</p>
  <h2 class="h3">7. Изменения</h2>
  <p>Политика может обновляться; актуальная версия всегда опубликована на этой странице.</p>
</div></section>`,
  };
}

export function consent() {
  const cr = [{ name: 'Главная', path: '/' }, { name: 'Согласие на обработку персональных данных', path: '/soglasie/' }];
  return {
    path: '/soglasie/', title: `Согласие на обработку персональных данных — «${company.brand}»`, crumbs: cr,
    description: 'Текст согласия на обработку персональных данных, которое даёт посетитель, отправляя заявку через форму расчёта стоимости на сайте.',
    body: `${crumbs(cr)}
<section class="sec sec--top"><div class="wrap wrap--narrow prose">
  <h1 class="h1">Согласие на обработку персональных данных</h1>
  <p>Отправляя заявку через форму расчёта стоимости на сайте «${esc(company.brand)}» и отмечая флажок согласия, я свободно, своей волей и в своём интересе даю согласие оператору — ${show(company.operator)} (далее — Оператор) — на обработку моих персональных данных на следующих условиях.</p>
  <h2 class="h3">1. Перечень данных</h2>
  <p>Имя; номер телефона; комментарий и ответы в форме расчёта (вид работ, площадь, дополнительные работы, сроки), если я их указал; адрес страницы, с которой отправлена заявка.</p>
  <h2 class="h3">2. Цели обработки</h2>
  <p>Связь со мной по заявке, расчёт стоимости и сроков работ, согласование осмотра объекта, выполнение работ.</p>
  <h2 class="h3">3. Действия с данными</h2>
  <p>Сбор, запись, систематизация, накопление, хранение, уточнение, использование, блокирование, удаление и уничтожение — с использованием средств автоматизации и без них.</p>
  <h2 class="h3">4. Срок действия и отзыв</h2>
  <p>Согласие действует до достижения целей обработки, но не более одного года с момента его получения. Я могу отозвать согласие в любой момент, сообщив об этом по телефону ${esc(company.phoneDisplay)}${isTodo(company.email) ? '' : ' или на e-mail ' + esc(company.email)}. После отзыва Оператор прекращает обработку и уничтожает данные в течение 30 дней, если иное не предусмотрено законом.</p>
  <p>Подробнее — в <a href="${url('/politika-konfidentsialnosti/')}">политике конфиденциальности</a>.</p>
</div></section>`,
  };
}

export function notFound() {
  return {
    path: '/404.html', file: '404.html', noindex: true, title: `Страница не найдена — «${company.brand}»`,
    description: 'Такой страницы нет. Перейдите на главную или к услугам мастера-плиточника в Волжском.',
    body: `<section class="sec sec--top"><div class="wrap wrap--narrow nf">
  <p class="nf__code">404</p>
  <h1 class="h1">Такой страницы нет</h1>
  <p class="lead">Возможно, ссылка устарела. Начните с главной или посмотрите услуги.</p>
  <div class="btns"><a class="btn" href="${url('/')}">На главную</a><a class="btn btn--ghost" href="${url('/uslugi/')}">Услуги</a></div>
</div></section>`,
  };
}
