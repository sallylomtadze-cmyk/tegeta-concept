const SHOP = 'https://shop.tegetamotors.ge/ge/';
const TM = 'https://tegetamotors.ge/ka/';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const ic = n => `img/ic/${n}.png`;
const svg = id => `<svg class="i"><use href="#i-${id}"/></svg>`;
const fine = matchMedia('(pointer:fine)').matches;
const still = matchMedia('(prefers-reduced-motion:reduce)').matches;

// Category tree and product counts from shop.tegetamotors.ge (2026-10-14)
const CATS = [
  ['tyres', 'tyre', 'მსუბუქი ავტომობილის საბურავები', 2122, 'msubuqi-avtomobilis-saburavi'],
  ['tyres', 'wheel', 'კომერციული საბურავები', 177, 'komertsiuli-avtomobilis-saburavi'],
  ['battery', 'battery', 'აკუმულატორები', 282, 'batteries'],
  ['parts', 'brake', 'ნაწილები', '10 000+', 'parts'],
  ['filters', 'filter', 'ფილტრები', 3938, 'Filters'],
  ['oil', 'oil', 'ძრავის ზეთი', 550, 'dzravis-zeti-new'],
  ['oil', 'gear', 'ავტომატური ტრანსმისიის ზეთი', 111, 'avtomaturi-transmisiis-zeti'],
  ['oil', 'differential', 'მექანიკური და დიფერენციალური კოლოფის ზეთი', 118, 'meqanikuri-da-dipherentsialuri-gadatsemata-kolophis-zeti'],
  ['oil', 'jerrycan', 'ანტიფრიზი', 65, 'antiphrizi'],
  ['oil', 'brakefluid', 'სამუხრუჭე სითხე', 21, 'samuxruche-sitxe'],
  ['oil', 'grease', 'პლასტიკური საცხი', 47, 'plastikuri-satsxi'],
  ['oil', 'shock', 'საჭის ჰიდრავლიკა, ძარის დაკიდება', 13, 'hidravlika-dakidebis-sistema'],
  ['tools', 'wrench', 'ინსტრუმენტები', 583, 'instrumentebi'],
  ['tools', 'jack', 'ავტოსერვისის დანადგარი', 89, 'equipment'],
  ['tools', 'compressor', 'გენერატორი და კომპრესორი', 13, 'generatori-kompresori'],
  ['tools', 'welding', 'შედუღების დანადგარები', 33, 'shedugebis-danadgarebi'],
  ['tools', 'shelf', 'სასაწყობე დანადგარები', 24, 'sasawkobe-danadgarebi'],
  ['tools', 'washer', 'რეცხვა-დასუფთავების დანადგარები', 1, 'recxva-dasuptavebis-danadgarebi'],
  ['acc', 'spray', 'ავტოქიმია', 142, 'avtoqimia'],
  ['acc', 'seat', 'აქსესუარები', 48, 'accessories'],
  ['acc', 'triangle', 'აქსესუარები უსაფრთხოებისთვის', 5, 'Usaprtkhoebis_aqsesuarebi'],
  ['brand', 'tshirt', 'მაისური', 33, 'T_shirt'],
  ['brand', 'trousers', 'შარვალი', 16, 'Trousers'],
  ['brand', 'jacket', 'ქურთუკი', 8, 'Jacket'],
  ['brand', 'cap', 'ბრენდირებული აქსესუარები', 9, 'accesories'],
];
const GROUPS = [['all', 'ყველა'], ['tyres', 'საბურავები'], ['battery', 'აკუმულატორები'], ['parts', 'ნაწილები'], ['filters', 'ფილტრები'], ['oil', 'ზეთები და სითხეები'], ['tools', 'ინსტრუმენტები და დანადგარები'], ['acc', 'აქსესუარები'], ['brand', 'ბრენდირებული']];
const num = n => typeof n === 'number' ? n.toLocaleString('fr-FR') : n;

// Catalogue showroom: groups on the left, one big object on a lit stage, subcategories as rows
const GROUPS2 = GROUPS.filter(g => g[0] !== 'all');
const GICON = { tyres: 'tyre', battery: 'battery', parts: 'brake', filters: 'filter', oil: 'oil', tools: 'wrench', acc: 'seat', brand: 'jacket' };
const gCount = g => CATS.filter(c => c[0] === g).reduce((s, c) => s + (typeof c[3] === 'number' ? c[3] : 10000), 0);
$('#exGroups').innerHTML = GROUPS2.map((g, i) => `<button class="exg${i ? '' : ' on'}" data-g="${g[0]}"><span>${g[1]}</span><em>${num(gCount(g[0]))}${g[0] === 'parts' ? '+' : ''}</em></button>`).join('');
let stageTimer;
function setStage(icon) {
  const o = $('#stageObj'); if (o.getAttribute('src') === ic(icon)) return;
  o.classList.add('swap'); $('#stageRef').classList.add('swap');
  setTimeout(() => $('#stageRef').classList.remove('swap'), 260); clearTimeout(stageTimer);
  stageTimer = setTimeout(() => { o.src = ic(icon); $('#stageRef').src = ic(icon); o.classList.remove('swap'); }, 220);
}
function openGroup(g) {
  const name = GROUPS2.find(x => x[0] === g)[1], items = CATS.filter(c => c[0] === g);
  $('#stageName').textContent = name;
  $('#stageCount').textContent = `${num(gCount(g))}${g === 'parts' ? '+' : ''} პროდუქტი`;
  setStage(GICON[g]);
  const tot = gCount(g);
  $('#exRows').innerHTML = items.map((c, i) => { const n = typeof c[3] === 'number' ? c[3] : 10000;
    return `<a class="exr" style="animation-delay:${i * 50}ms;--share:${Math.max(2, n / tot * 100)}%" href="${SHOP}${c[4]}/products" data-ic="${c[1]}"><img src="${ic(c[1])}" alt=""><span>${c[2]}</span><em>${num(c[3])}</em></a>`; }).join('');
  $('#exCta').href = `${SHOP}${items[0][4]}/products`;
}
$('#exGroups').onclick = e => {
  const b = e.target.closest('.exg'); if (!b) return;
  $$('.exg').forEach(x => x.classList.toggle('on', x === b));
  b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  openGroup(b.dataset.g);
};
$('#exRows').addEventListener('mouseover', e => { const r = e.target.closest('.exr'); if (r) setStage(r.dataset.ic); });
$('#exRows').addEventListener('mouseleave', () => setStage(GICON[$('.exg.on').dataset.g]));
openGroup('tyres');

// Brands
const BRANDS = ['bridgestone', 'continental', 'pirelli', 'petronas'];
$('#brandTrack').innerHTML = [...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS].map(b => `<div class="brand"><img src="img/brands/${b}.svg" alt="${b[0].toUpperCase() + b.slice(1)}"></div>`).join('');

// Finder: tabs switch the fields
const opt = (id, n, a, v) => `<select id="${id}" aria-label="${n}"><option value="">${n}</option>${a.map(x => `<option${x == v ? ' selected' : ''}>${x}</option>`).join('')}</select>`;
const range = (a, b, s, f = x => x) => Array.from({ length: (b - a) / s + 1 }, (_, i) => f(a + i * s));
const FINDER = {
  tyre: [() => opt('fw', 'სიგანე', range(155, 315, 10), 225) + opt('fp', 'პროფილი', range(30, 80, 5), 45) + opt('fd', 'დიამეტრი', range(13, 22, 1, x => 'R' + x), 'R17') + opt('fs', 'სეზონი', ['ზაფხული', 'ზამთარი', 'ყველა სეზონი']), 'msubuqi-avtomobilis-saburavi'],
  battery: [() => opt('fb1', 'ტევადობა', ['45 ამპ*სთ', '60 ამპ*სთ', '70 ამპ*სთ', '75 ამპ*სთ', '95 ამპ*სთ', '100 ამპ*სთ']) + opt('fb2', 'პოლარობა', ['R+', 'L+']) + opt('fb3', 'ტექნოლოგია', ['EN SLI', 'EN EFB', 'EN AGM', 'JIS SLI']) + opt('fb4', 'ბრენდი', ['VARTA', 'EXIDE', 'BOSCH', 'FIAMM', 'MACPOWER', 'OPTIMA']), 'batteries'],
  oil: [() => opt('fo1', 'სიბლანტე', ['0W-20', '0W-30', '5W-30', '5W-40', '10W-40', '15W-40']) + opt('fo2', 'მოცულობა', ['1 ლ', '4 ლ', '5 ლ', '20 ლ']) + opt('fo3', 'ბრენდი', ['PETRONAS', 'GULF', 'MOBIL', 'CASTROL']), 'dzravis-zeti-new'],
  vin: [() => '<input id="fvin" placeholder="VIN ან ძარის ნომერი" maxlength="17" autocomplete="off">', 'parts'],
};
function renderFinder(k) {
  const f = FINDER[k];
  $('#fields').innerHTML = f[0]() + `<a class="lbtn" href="${SHOP}${f[1]}/products"><span>ძიება</span></a>`;
}
$('.tabs').onclick = e => {
  const b = e.target.closest('button'); if (!b) return;
  $$('.tabs button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
  renderFinder(b.dataset.f);
};
$('#finder').addEventListener('submit', e => e.preventDefault());
renderFinder('tyre');

// Online deals (prices as listed on the shop, 2026-10-14)
const PRODUCTS = [
  ['VARTA', 'აკუმულატორი DYNAMIC SLI', 269, 215.2, 'battery'],
  ['VARTA', 'აკუმულატორი DYNAMIC SLI', 439, 351.2, 'battery2'],
  ['VARTA', 'აკუმულატორი DYNAMIC AGM', 699, 559.2, 'battery'],
  ['MACPOWER', 'აკუმულატორი PREMIUM 62Ah R+0', null, 249, 'battery2'],
  ['PETRONAS', 'ზეთი SYNTIUM 5W-30, 4 ლ', null, 89, 'oil'],
  ['BRIDGESTONE', 'საბურავი TURANZA 225/45 R17', null, 329, 'tyre'],
];
$('#products').innerHTML = PRODUCTS.slice(0, 4).map((p, pi) => `<article class="prod surf rv">
  <div class="pic"><span class="obj"><img src="${ic(p[4])}" alt="" loading="lazy"></span></div>
  <small>${p[0]}</small><h3>${p[1]}</h3>
  ${p[2] ? `<span class="save">დაზოგე ${(p[2] - p[3]).toFixed(2)} ₾</span>` : ''}<div class="price"><b>${p[3].toFixed(2)} ₾</b>${p[2] ? `<s>${p[2].toFixed(2)} ₾</s>` : ''}<button class="orb-btn add" data-i="${pi}" aria-label="კალათაში დამატება">${svg('bag')}</button></div></article>`).join('');
// countdown to the end of the October offer
const END = new Date('2026-10-31T23:59:59+04:00');
function cd() {
  let s = Math.max(0, (END - Date.now()) / 1000 | 0);
  if (!s) { $('#cd').textContent = 'შეთავაზება დასრულდა'; return; }
  const d = s / 86400 | 0; s %= 86400;
  const p = n => String(n).padStart(2, '0');
  $('#cd').textContent = `სრულდება ${d} დღეში, ${p(s / 3600 | 0)}:${p(s % 3600 / 60 | 0)}:${p(s % 60)}`;
}
cd(); setInterval(cd, 1000);
// One cart for the deals row and the shop inside the centre
const cartItems = {};
function addToCart(i) {
  cartItems[i] = (cartItems[i] || 0) + 1;
  const n = $('#cartN'), qty = Object.values(cartItems).reduce((s, q) => s + q, 0);
  n.textContent = qty; n.classList.add('bump'); setTimeout(() => n.classList.remove('bump'), 300);
  const sum = Object.entries(cartItems).reduce((s, [k, q]) => s + PRODUCTS[k][3] * q, 0);
  $('#cartSum').innerHTML = `კალათაში ${qty} ნივთი, <b class="num">${sum.toFixed(2)} ₾</b>`;
  $$(`.add[data-i="${i}"]`).forEach(b => { b.classList.add('done'); b.innerHTML = svg('check'); });
}
$('#products').onclick = e => { const b = e.target.closest('.add'); if (b) addToCart(+b.dataset.i); };

// Services with hotspots on the wireframe car (front of the car faces right)
const SVC_IC = ['battery2', 'filter', 'seat', 'jerrycan', 'steering', 'tyre', 'shock', 'gear'];
const SERVICES = [
  ['ავტომობილის ელექტრო დიაგნოსტიკა', 'eleqtro-diagnostika', 73, 50],
  ['ჰაერის ფილტრის შეცვლა', 'aeris-filtris-shetsvla', 67, 40],
  ['სალონის ფილტრის შეცვლა', 'salonis-filtris-shecvla', 48, 48],
  ['საწვავის ფილტრის შეცვლა', 'sawvavis-filtris-shecvla', 29, 63],
  ['თვლების შეყრა, რაზვალის გასწორება', 'tvlebis-shekra-razvalis-gasworeba', 69, 31],
  ['ვულკანიზაცია', 'vulkanizacia', 28, 31],
  ['სავალი ნაწილის შემოწმება', 'savali-nawilis-shemowmeba', 60, 68],
  ['Diesel Technic', 'diesel-technic', 76, 58],
];
$('#spots').innerHTML = SERVICES.map((s, i) => `<span class="spot" data-i="${i}" style="left:${s[2]}%;top:${s[3]}%"></span>`).join('');
$('#svcList').innerHTML = SERVICES.map((s, i) => `<li data-i="${i}"><a href="${TM}${s[1]}">${s[0]}</a></li>`).join('');
let svcI = 0, svcHold = false;
function setSvc(i) {
  svcI = i;
  $$('.spot,.svc-list li').forEach(el => el.classList.toggle('on', +el.dataset.i === i));
}
$('#svcList').addEventListener('mouseover', e => { const li = e.target.closest('li'); if (li) { svcHold = true; setSvc(+li.dataset.i); } });
$('#svcList').addEventListener('mouseleave', () => svcHold = false);
setSvc(0);
setInterval(() => { if (!svcHold) setSvc((svcI + 1) % SERVICES.length); }, 2600);

// Online services
const ONLINE = [
  ['phone', 'ონლაინ მაღაზია', 'შეუკვეთე საბურავი, ნაწილი ან ზეთი სახლიდან', 'https://shop.tegetamotors.ge/'],
  ['calendar', 'დაჯავშნე სერვისი ონლაინ', 'აირჩიე ფილიალი, დღე და საათი', 'https://reservation.tegetamotors.ge/'],
  ['clipboard', 'ჩემი ავტომობილის ისტორია', 'ყველა ვიზიტი და შეცვლილი ნაწილი ერთ გვერდზე', 'https://mycarhistory.tegetamotors.ge/'],
  ['steering', 'თეგეტა კომფორტი', 'ავტომობილს თავად წავიყვანთ სერვისზე და დაგიბრუნებთ', TM + 'Tegetas-personaluri-menejeri'],
  ['keyfob', 'მომხმარებლის გვერდი', 'შეკვეთები, ინვოისები და PLUS ქულები', 'https://account.tegetamotors.ge/'],
];
$('#stack').innerHTML = ONLINE.map(o => `<a class="orow" href="${o[3]}"><img src="${ic(o[0])}" alt=""><span><b>${o[1]}</b><em>${o[2]}</em></span></a>`).join('');
// Reservation widget: step through the next days, the bar shows how far ahead you are booking
const DAYS = ['კვირა', 'ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 'ხუთშაბათი', 'პარასკევი', 'შაბათი'];
let dayOff = 0;
$('.wg-ctl').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  dayOff = Math.max(0, Math.min(13, dayOff + +b.dataset.d));
  const d = new Date(Date.now() + dayOff * 864e5);
  $('#dayName').textContent = dayOff === 0 ? 'დღეს' : dayOff === 1 ? 'ხვალ' : `${DAYS[d.getDay()]}, ${d.getDate()}`;
  $('#dayBar').style.width = (dayOff + 1) / 14 * 100 + '%';
});
// Season widget: winter tyres from October to March, summer tyres the rest of the year
{ const m = new Date().getMonth(), winter = m >= 9 || m <= 2;
  $('#seasonT').textContent = winter ? '+7°C' : '+25°C';
  $('#seasonTx').textContent = winter ? 'ზამთრის საბურავების სეზონი' : 'ზაფხულის საბურავების სეზონი';
  $('#seasonSm').textContent = winter ? 'ამ ტემპერატურის ქვემოთ ზაფხულის საბურავი ხისტდება' : 'ამ სიცხეში ზამთრის საბურავი სწრაფად ცვდება';
  $('#season').href = winter ? TM + 'zamtris-saburavebi' : SHOP + 'msubuqi-avtomobilis-saburavi/products'; }

// News (titles and dates from tegetamotors.ge, photos generated for the concept)
const NEWS = [
  ['თეგეტა მოტორსისა და გალფის ერთობლივი შეთავაზება ბიზნესს', '', '', 'img/news/workshop.jpg', 'Tegeta-motorsisa-da-galfis-erToblivi-sheTavazeba-bizness'],
  ['თვის შეთავაზებები', '19', 'ივლ', 'img/news/tyre-fit.jpg', 'Tvis-sheTavazebebi'],
  ['ბენეფიტების ახალი პროგრამა „თეგეტა მოტორსის“ ყველა ყოფილი თანამშრომლისთვის', '18', 'აგვ', 'img/news/centre.jpg', 'benefitebis-axali-programa--Tegeta-motorsis--yvela-yofili-TanamshromlisTvis'],
];
$('#news').innerHTML = NEWS.map(n => `<a class="nw surf rv" href="${TM}news/${n[4]}">
  <div class="ph"><img class="base" src="${n[3]}" alt="" loading="lazy"><img class="lit" src="${n[3]}" alt="" loading="lazy"></div>
  <div class="b">${n[1] ? `<div class="date"><b>${n[1]}</b><span>${n[2]}</span></div>` : ''}<h3>${n[0]}</h3></div></a>`).join('');
// headlight reveal: colour appears where the light falls (pointer on desktop, a sweep from below on touch)
$$('.nw .ph').forEach(ph => {
  ph.addEventListener('pointermove', e => { const r = ph.getBoundingClientRect(); ph.style.setProperty('--lx', e.clientX - r.left + 'px'); ph.style.setProperty('--ly', e.clientY - r.top + 'px'); });
});
if (!fine) { const lo = new IntersectionObserver(en => en.forEach(e => e.target.classList.toggle('sweep', e.isIntersecting)), { threshold: .6 }); $$('.nw .ph').forEach(p => lo.observe(p)); }

// Branches: service types on the left, a night map with the real branch towns (tegetamotors.ge/ka/branches) and a car driving between them
const BR = ['ყველა სერვის ცენტრი', 'სათაო ოფისი', 'მსუბუქი ავტომობილების სერვისი', 'სატვირთო ავტომობილების სერვისი', 'სავაჭრო ობიექტები', 'სპეც. დანიშნულების ტექნიკის სერვისი', 'სწრაფგამტარი სერვისი', 'ბოშის სერვისცენტრი'];
$('#branchChips').innerHTML = BR.map((b, i) => `<button class="chip${i ? '' : ' on'}" data-i="${i}">${b}</button>`).join('');
$('#branchChips').onclick = e => { const b = e.target.closest('.chip'); if (b) $$('#branchChips .chip').forEach(x => x.classList.toggle('on', x === b)); };
// [name, x, y, label side, branches] in the 600x420 map, placed roughly by geography
const TOWNS = [['თბილისი', 466, 291, 'r', 10], ['ბათუმი', 58, 313, 'r', 2], ['ქუთაისი', 197, 173, 'r', 2], ['გორი', 250, 235, 'r', 2], ['მარნეული', 468, 349, 'l', 2], ['ფოთი', 65, 199, 'r', 1], ['ზუგდიდი', 90, 122, 'r', 1], ['ახალციხე', 233, 330, 'r', 1], ['თელავი', 551, 248, 'l', 1], ['გარდაბანი', 505, 347, 'b', 1], ['ნატახტარი', 457, 246, 'l', 1], ['ყაზბეგი', 447, 90, 'r', 1]];
const ROUTE = ['ბათუმი', 'ფოთი', 'ზუგდიდი', 'ქუთაისი', 'ახალციხე', 'გორი', 'ნატახტარი', 'ყაზბეგი', 'ნატახტარი', 'თბილისი', 'თელავი', 'თბილისი', 'გარდაბანი', 'მარნეული', 'თბილისი'];
const tXY = n => { const t = TOWNS.find(x => x[0] === n); return [t[1], t[2]]; };
function smooth(pts) { // Catmull-Rom curve through the towns
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6},${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6},${p2[0]} ${p2[1]}`;
  }
  return d;
}
const rp = ROUTE.map(tXY), loop = [...rp, ...rp.slice(0, -1).reverse()];
let roads = '';
for (let i = 0; i < 9; i++) roads += `<path d="M${-20 + i * 30} ${40 + i * 45} C ${150 + i * 10} ${10 + i * 50}, ${380 - i * 8} ${120 + i * 30}, 640 ${60 + i * 42}" stroke="rgba(255,255,255,${i % 3 ? .05 : .1})" stroke-width="${i % 3 ? 1 : 2}" fill="none"/>`;
for (let i = 0; i < 7; i++) roads += `<path d="M${60 + i * 85} -10 C ${40 + i * 90} 150, ${110 + i * 80} 260, ${70 + i * 88} 440" stroke="rgba(255,255,255,.05)" fill="none"/>`;
roads += '<path d="M-10 330 C 120 300, 200 360, 300 250 S 470 130, 620 150" stroke="rgba(86,140,180,.35)" stroke-width="10" fill="none" stroke-linecap="round"/>';
$('#mapArt').innerHTML = `<defs><radialGradient id="hl" cx="0" cy=".5" r="1"><stop offset="0" stop-color="#fff6dc" stop-opacity=".6"/><stop offset="1" stop-color="#fff6dc" stop-opacity="0"/></radialGradient></defs>
  ${roads}<path id="tour" class="tour" d="${smooth(loop)}"/>
  ${TOWNS.map((t, i) => { const dx = { l: -12, r: 12, b: 0 }[t[3]], dy = t[3] === 'b' ? 24 : 4;
    return `<circle class="pinring" cx="${t[1]}" cy="${t[2]}" r="9" style="animation-delay:${i * .3}s"/><circle class="pinpt" cx="${t[1]}" cy="${t[2]}" r="${t[4] > 5 ? 6 : 4.5}"/><text class="town" x="${t[1] + dx}" y="${t[2] + dy}" text-anchor="${{ l: 'end', r: 'start', b: 'middle' }[t[3]]}">${t[0]}</text>`; }).join('')}
  <g class="mcar"><path d="M3 -3 L30 -15 L30 15 L3 3 Z" fill="url(#hl)"/><rect x="-10" y="-5" width="14" height="10" rx="3" fill="#d4dbe0"/><rect x="-1.5" y="-4" width="3.5" height="8" rx="1" fill="#2b3842"/><circle cx="3.5" cy="-3.2" r="1.2" fill="#fff"/><circle cx="3.5" cy="3.2" r="1.2" fill="#fff"/>
    <animateMotion dur="70s" repeatCount="indefinite" rotate="auto"><mpath href="#tour"/></animateMotion></g>`;

// Company
const BEN = [
  ['პროექტი „ჩართე“', 'საქველმოქმედო ორგანიზაცია საქართველოს სოფლებისთვის', 'benefits/proeqti--charTe-'],
  ['შვილობილი კომპანიები', 'თეგეტა თრაქ & ბას, თეგეტა ქონსთრაქშენ ექვიფმენტი, თეგეტა პრემიუმ ვიიქელს, ტოიოტა ცენტრი', 'benefits/shvilobili-kompaniebi'],
  ['თეგეტა კომფორტი', 'ავტომობილის შემოწმება და შეკეთება შენი დროის დაკარგვის გარეშე', 'benefits/Tegetas-personaluri-menejeri'],
  ['თეგეტა აკადემია', 'სასწავლო ცენტრი პროფესიული განათლების პოპულარიზაციისთვის', 'benefits/Tegeta-Academy'],
];
$('#benefits').innerHTML = BEN.map(b => `<a class="bn surf rv" href="${TM}${b[2]}"><h3>${b[0]}</h3><p>${b[1]}</p></a>`).join('');
const GROUP = [['JCB', 'http://jcb.ge/'], ['TOYOTA', 'https://toyota-tegeta.ge/'], ['MAN', 'http://man.com.ge/'], ['MAZDA', 'http://mazda-tbilisi.ge/'], ['PORSCHE', 'https://www.porsche.com/central-eastern-europe/en/_georgia_/'], ['VOLVO', 'https://www.volvocars.com/ge/']];
$('#group').innerHTML = GROUP.map(g => `<a class="surf" href="${g[1]}"><img src="img/brands/${g[0].toLowerCase()}.svg" alt="${g[0]}"></a>`).join('');

// Footer: full menu of tegetamotors.ge, folds into accordions on phones
const FOOT = {
  'კომპანია': [['კომპანიის შესახებ', 'about-tegeta'], ['კორპორაციული კლიენტები', 'korporaciuli-klientebi'], ['სავაჭრო წარმომადგენლები', 'Sales-Representatives'], ['ინვესტორებისთვის', 'for-investors/'], ['ფრანჩაიზინგი', 'Franchising']],
  'CSR': [['ქალთა გაძლიერება', 'qalTa-gaZliereba'], ['განათლება', 'ganaTleba'], ['გარემოზე ზრუნვა', 'garemoze-zrunva'], ['ჯანმრთელობა', 'janmrTeloba'], ['tegeta.care', 'tegeta-care']],
  'პროდუქცია': [['ზამთრის საბურავები', 'zamtris-saburavebi'], ['BRIDGESTONE', 'bridgestone-saburavebi'], ['MICHELIN', 'michelin-saburavebi'], ['Continental', 'continental-saburavebi'], ['PIRELLI', 'pirelli-saburavebi'], ['Yokohama', 'Yokohama-s-saburavebi'], ['VARTA', 'varta-akumulatorebi'], ['FIAMM', 'fiamm-akumulatorebi'], ['PETRONAS', 'PETRONAS--msoflio-lideri-sapoxi-masalebis-teqnologiebshi'], ['ზეთები', 'zeTebi']],
  'ინფორმაცია': [['აქციები და ფასდაკლებები', 'actions-and-sales'], ['სიახლეები', 'news'], ['დაბრუნების პოლიტიკა', 'dabrunebis-politika'], ['საგარანტიო პირობები', 'sagarantio-pirobebi'], ['საბითუმო არხის საგარანტიო პირობები', 'sabiTumo-arxis-standartuli-sagarantio-pirobebi'], ['TEGETA VLOG', 'TEGETA-VLOG'], ['გენერალური შეთანხმება', 'generaluri-sheTanxmeba']],
  'კონტაქტი': [['მოგვწერეთ', 'contact'], ['ვაკანსიები', 'contact#vacancies-wrapper'], ['ფილიალები', 'branches'], ['ონლაინ სერვისები', 'online-services']],
};
const wide = innerWidth > 820;
$('#footCols').innerHTML = Object.entries(FOOT).map(([h, l]) => `<details${wide ? ' open' : ''}><summary class="cap">${h}</summary><div>${l.map(x => `<a href="${TM}${x[1]}">${x[0]}</a>`).join('')}</div></details>`).join('');

// Search opens the finder
$('.ico[aria-label="ძიება"]').onclick = () => { $('#finder').scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(() => $('#fields select, #fields input')?.focus(), 500); };

// Mobile menu
function setMenu(o) {
  $('#links').classList.toggle('open', o); document.body.classList.toggle('menu-open', o);
  $('#burger').setAttribute('aria-expanded', o); $('#burger use').setAttribute('href', o ? '#i-close' : '#i-menu');
}
$('#burger').onclick = () => setMenu(!$('#links').classList.contains('open'));
addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
$('#links').onclick = e => { if (e.target.closest('a')) setMenu(false); };

// Headline: words rise one by one
const h1 = $('h1');
h1.innerHTML = h1.textContent.split(' ').map((w, i) => `<span class="w" style="animation-delay:${.2 + i * .09}s">${w}</span>`).join(' ');

// Buttons: light follows the pointer with a small magnetic pull
if (fine) document.addEventListener('pointermove', e => {
  const t = e.target.closest ? e.target : null; if (!t) return;
  const b = t.closest('.lbtn,.gbtn');
  $$('.mag').forEach(x => { if (x !== b) { x.classList.remove('mag'); x.style.translate = ''; } });
  if (b) {
    const r = b.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    b.style.setProperty('--x', x + 'px'); b.style.setProperty('--y0', y + 'px');
    b.classList.add('mag'); b.style.translate = `${(x - r.width / 2) * .1}px ${(y - r.height / 2) * .18}px`;
  }
});

const nav = $('#nav');
// Chase-camera drive: the car is seen from behind, the road streams toward you, the Tegeta centre waits at the end
const car = $('#car'), hero = $('.hero'), scr = $('#screen');
const TRACK = 130; // metres to the centre's door
const drive = { on: false, running: false, idle: 0, v: 0, pos: 0, x: 0, steer: 0, keys: {} };
const roadCv = $('#skid'), rctx = roadCv.getContext('2d');
function sizeRoad() { const d = devicePixelRatio || 1; roadCv.width = scr.clientWidth * d; roadCv.height = scr.clientHeight * d; rctx.setTransform(d, 0, 0, d, 0, 0); render(); }
const heroVisible = () => scrollY < hero.offsetHeight * .6;
let inside = false, trip = 0;
function press(k, down) {
  k = { w: 'ArrowUp', s: 'ArrowDown', a: 'ArrowLeft', d: 'ArrowRight', W: 'ArrowUp', S: 'ArrowDown', A: 'ArrowLeft', D: 'ArrowRight' }[k] || k;
  if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(k)) return false;
  if (inside) { drive.keys[k] = down; if (down) { game.step = game.step || { mv: 0, rot: 0 }; if (k === 'ArrowUp') game.step.mv += .35; if (k === 'ArrowDown') game.step.mv -= .35; if (k === 'ArrowLeft') game.step.rot += .21; if (k === 'ArrowRight') game.step.rot -= .21; game.target = null; } return true; }
  drive.keys[k] = down; if (down && k === 'ArrowUp') drive.cruise = true; if (down && k === 'ArrowDown') drive.cruise = false;
  if (down && !drive.on) { drive.on = true; hero.classList.add('driving'); }
  if (down) wake();
  return true;
}
// arrows drive whenever the hero is on screen, unless a form field has focus
addEventListener('keydown', e => { if ((inside || heroVisible()) && !e.target.closest?.('input,select,textarea') && press(e.key, true)) e.preventDefault(); });
addEventListener('keyup', e => press(e.key, false));
$$('#dpad button').forEach(b => {
  b.addEventListener('pointerdown', e => { e.preventDefault(); press(b.dataset.k, true); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => b.addEventListener(t, () => press(b.dataset.k, false)));
});
function tick() {
  if (inside) { drive.running = false; return; }
  const k = drive.keys, MAX = 34;
  // once you press forward the car keeps cruising, like a game with auto-throttle; back brakes, then reverses
  if (k.ArrowUp) { drive.cruise = true; drive.v = Math.min(MAX, drive.v + .6); }
  else if (k.ArrowDown) { drive.cruise = false; drive.v = drive.v > 0 ? Math.max(0, drive.v - .9) : Math.max(-7, drive.v - .2); }
  else if (drive.cruise) drive.v = Math.min(MAX * .7, drive.v + .3);
  else drive.v *= .992;
  if (Math.abs(drive.v) < .02 && !k.ArrowUp && !k.ArrowDown) drive.v = 0;
  const steer = (k.ArrowLeft ? -1 : 0) + (k.ArrowRight ? 1 : 0);
  drive.steer += (steer - drive.steer) * .15;
  drive.x += drive.steer * .012 * Math.min(1, Math.abs(drive.v) / 6) * Math.sign(drive.v);
  drive.x = Math.max(-1.25, Math.min(1.25, drive.x));
  if (drive.pos > TRACK * .8) drive.x *= .96; // the last stretch lines the car up with the door
  if (Math.abs(drive.x) > 1) drive.v *= .96; // off the asphalt: the car slows down
  drive.pos = Math.max(0, drive.pos + drive.v / 60);
  trip += Math.abs(drive.v) / 60 / 1000;
  if (drive.pos >= TRACK && !inside) {
    drive.pos = TRACK;
    enter();
  }
  render(); hud(steer);
  const busy = drive.v !== 0 || drive.cruise || Object.values(k).some(Boolean);
  drive.idle = busy ? 0 : drive.idle + 1;
  if (drive.idle < 30) requestAnimationFrame(tick); else drive.running = false;
}
function wake() { drive.idle = 0; if (!drive.running) { drive.running = true; requestAnimationFrame(tick); } }
// pseudo-3D road: depth z maps to screen row hy + (H - hy) * Z0 / z, like classic racing games
function render() {
  const W = scr.clientWidth, H = scr.clientHeight, hy = H * .5, Z0 = 3, narrow = W < 600;
  const half = W * (narrow ? .62 : .42), cb = W / 2 - drive.x * half * .9;
  const at = z => { const f = Z0 / z; return { y: hy + (H - hy) * f, x: W / 2 + (cb - W / 2) * f, h: half * f }; };
  rctx.clearRect(0, 0, W, H);
  // asphalt
  const g = rctx.createLinearGradient(0, hy, 0, H); g.addColorStop(0, 'rgba(58,72,88,.75)'); g.addColorStop(.25, 'rgba(44,56,70,.9)'); g.addColorStop(1, 'rgba(22,30,38,.98)');
  rctx.fillStyle = g; rctx.beginPath(); rctx.moveTo(W / 2 - 3, hy); rctx.lineTo(W / 2 + 3, hy); rctx.lineTo(cb + half, H); rctx.lineTo(cb - half, H); rctx.fill();
  // edge lines
  // light shoulders, then solid white edge lines
  rctx.strokeStyle = 'rgba(190,205,220,.35)'; rctx.lineWidth = 7;
  for (const s of [-1, 1]) { rctx.beginPath(); rctx.moveTo(W / 2 + s * 3, hy); rctx.lineTo(cb + s * half, H); rctx.stroke(); }
  rctx.strokeStyle = 'rgba(255,255,255,.9)'; rctx.lineWidth = 3;
  for (const s of [-1, 1]) { rctx.beginPath(); rctx.moveTo(W / 2 + s * 3, hy); rctx.lineTo(cb + s * half * .93, H); rctx.stroke(); }
  // dashed centre line and edge reflectors stream toward the camera
  const DASH = 1.6, GAP = 2.4, P = DASH + GAP, off = drive.pos % P;
  rctx.fillStyle = 'rgba(255,255,255,.9)';
  for (let z = P - off + Z0 * .6; z < 220; z += P) {
    const a = at(z), b = at(z + DASH), w1 = a.h * .016, w2 = b.h * .016;
    for (const l of [-.6, .6]) { // two lanes markings, so the road visibly runs under the car
      rctx.beginPath(); rctx.moveTo(a.x + l * a.h - w1, a.y); rctx.lineTo(a.x + l * a.h + w1, a.y); rctx.lineTo(b.x + l * b.h + w2, b.y); rctx.lineTo(b.x + l * b.h - w2, b.y); rctx.fill();
    }
  }
  const R = 8, roff = drive.pos % R;
  for (let z = R - roff + Z0 * .6; z < 260; z += R) {
    const a = at(z), s = Math.max(1.5, a.h * .05);
    rctx.fillStyle = `rgba(253,185,19,${Math.min(1, a.h / 60)})`;
    for (const side of [-1, 1]) rctx.fillRect(a.x + side * a.h * 1.04 - s / 2, a.y - s * 1.6, s, s * 1.6);
  }
  // the centre grows as you get closer; the car leans into turns and shakes off the asphalt
  const p = drive.pos / TRACK;
  centre.style.setProperty('--gs', (1 + 1.9 * p * p).toFixed(3));
  const lean = drive.steer * Math.min(1, Math.abs(drive.v) / 10), rough = Math.abs(drive.x) > 1 && drive.v ? (Math.random() - .5) * 3 : 0;
  car.style.setProperty('--lean', lean * 4 + 'deg');
  car.style.setProperty('--shift', lean * 14 + 'px');
  car.style.setProperty('--bump', rough + Math.sin(drive.pos * 2.4) * Math.min(1, drive.v / 30) * .8 + 'px');
  car.classList.toggle('brake', !!drive.keys.ArrowDown && drive.v >= 0);
  car.classList.toggle('reverse', drive.v < -.1);
  $('#navKm').textContent = inside ? 'მიხვედით' : ((TRACK - drive.pos) / 1000).toFixed(2) + ' კმ';
}
// Instrument cluster: speed, gear, turn signals, trip and the distance left to the next service
const SVC_KM = 550, gearEls = $$('#gears i');
function hud(steer) {
  const v = drive.v, g = !v && !drive.keys.ArrowUp ? 'P' : v < -.1 ? 'R' : v > .1 || drive.keys.ArrowUp ? 'D' : 'N';
  $('#spd').textContent = Math.round(Math.abs(v) * 3.6);
  gearEls.forEach(i => i.classList.toggle('on', i.textContent === g));
  $('#sigL').classList.toggle('on', steer < 0); $('#sigR').classList.toggle('on', steer > 0);
  $('#trip').textContent = trip.toFixed(1);
  $('#odo').textContent = String(Math.round(2146 + trip)).padStart(6, '0');
  const left = Math.max(0, Math.round(SVC_KM - trip)), s = $('#svcLeft');
  s.classList.toggle('due', !left);
  s.innerHTML = left ? `სერვისამდე <b class="num">${left}</b> კმ` : '<b>სერვისის დროა</b> დაჯავშნე';
}
// Arriving: the car rolls through the door, you get out, and the store is a 3D room you walk through
const centre = $('#centre'), insideEl = $('#inside');
// missions: take the item from its shelf, carry it to the counter, pay
const ITEMS = [
  { id: 'oil', name: 'PETRONAS SYNTIUM 5W-30, 4 ლ', price: 89, ic: 'oil', url: SHOP + 'dzravis-zeti-new/products', at: [5.6, 2.2, 2.5], shelf: 'ზეთები', task: 'აიღე ზეთი თაროდან და ჩადე კალათაში' },
  { id: 'batt', name: 'VARTA DYNAMIC SLI 60Ah', price: 215.2, ic: 'battery', url: SHOP + 'batteries/products', at: [5.6, .9, -3], shelf: 'აკუმულატორები', task: 'ახლა აკუმულატორი: აიღე და ჩადე კალათაში' },
  { id: 'tyre', name: 'BRIDGESTONE TURANZA 225/45 R17', price: 329, ic: 'tyre', url: SHOP + 'msubuqi-avtomobilis-saburavi/products', at: [-5.6, 1.4, 0], shelf: 'საბურავები', task: 'ბოლო: საბურავი კედლიდან კალათაში' },
];
// what each shelf offers: the first choice of every shelf is the mission product
const SPEC = {
  oil: ['სრულად სინთეტიკური, API SN, ACEA A3/B4', 'სინთეტიკური, API SN/CF', 'სრულად სინთეტიკური, ჰიბრიდებისთვის', 'სრულად სინთეტიკური, დასამატებლად'],
  batt: ['12V 60Ah 540A, R+, 242×175×190 მმ', '12V 74Ah 680A, R+, 278×175×190 მმ', 'AGM Start-Stop, 12V 70Ah 760A', '12V 62Ah 540A, R+'],
  tyre: ['ზაფხული, 225/45 R17 91W', 'ზაფხული, 205/55 R16 91V', 'ზაფხული, 215/60 R16 95V', 'ზამთარი, 225/45 R17 91H'],
};
const CATALOG = {
  oil: [['PETRONAS SYNTIUM 5000 5W-30, 4 ლ', 89], ['PETRONAS SYNTIUM 3000 5W-40, 4 ლ', 79], ['PETRONAS SYNTIUM 7000 0W-20, 4 ლ', 112], ['PETRONAS SYNTIUM 5000 5W-30, 1 ლ', 27]],
  batt: [['VARTA DYNAMIC SLI 60Ah', 215.2], ['VARTA DYNAMIC SLI 74Ah', 351.2], ['VARTA DYNAMIC AGM 70Ah', 559.2], ['MACPOWER PREMIUM 62Ah', 249]],
  tyre: [['BRIDGESTONE TURANZA 225/45 R17', 329], ['CONTINENTAL PREMIUMCONTACT 205/55 R16', 289], ['PIRELLI CINTURATO 215/60 R16', 279], ['BRIDGESTONE BLIZZAK 225/45 R17', 359]],
};
const ZONES = [{ id: 'counter', at: [0, 1.2, -7.6], l: 'გადახდა' }, { id: 'door', at: [0, 1.4, 8.6], l: 'გასასვლელი' }, { id: 'trolley', at: [-1.6, .9, 3.4], l: 'ურიკა' }];
const game = { char: 'a', on: false, out: false, basket: [], acts: [], target: null, yaw: 0, pitch: .18, zoom: 2.8, x: 0, z: 7, hand: null, mission: 0, pts: 0, bob: 0, drag: null, near: null, ready: false, rig: null };
let R3, S3, C3, L3 = [], sprites = {}, phone3d = innerWidth < 820;
function build3d() {
  const cv = $('#store3d'), phone = innerWidth < 820; R3 = new THREE.WebGLRenderer({ canvas: cv, antialias: !phone, alpha: false }); R3.setPixelRatio(phone ? 1 : Math.min(devicePixelRatio || 1, 1.5));
  R3.setClearColor(0x14202a);
  cv.addEventListener('webglcontextlost', e => { e.preventDefault(); showErr('3D ხელახლა იტვირთება'); }); cv.addEventListener('webglcontextrestored', () => { $('#toast').hidden = true; size3d(); }); S3 = new THREE.Scene(); S3.fog = new THREE.Fog(0x0e1a24, 4, 24);
  C3 = new THREE.PerspectiveCamera(72, 1, .1, 60);
  const T = new THREE.TextureLoader(), tex = (f, rx, ry, oy, m) => { const t = T.load(f, () => { m.map = t; m.color.set(0xffffff); m.needsUpdate = true; }); t.wrapS = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.offset.y = oy; return t; };
  // walls start as plain graphite and get their photo as soon as it has loaded
  const W = 14, D = 18, H = 4.2, wall = (f, rx, ry0, oy, w, h, pos, ry) => { const mat = new THREE.MeshBasicMaterial({ color: 0x25333f }); tex(f, rx, ry0, oy, mat); const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); m.position.set(...pos); m.rotation.y = ry; S3.add(m); };
  // the photos become the walls: each 16:9 photo is cropped to the wall height
  // side walls are real 3D shelving: graphite wall, planks with LED strips, tyres, canisters and batteries as geometry
  const graphite = new THREE.MeshStandardMaterial({ color: 0x27353f, roughness: .7, metalness: .2 });
  const plankMat = new THREE.MeshStandardMaterial({ color: 0x33414c, roughness: .5, metalness: .4, emissive: 0xfdb913, emissiveIntensity: .08 });
  const ledMat = new THREE.MeshBasicMaterial({ color: 0xffc83a });
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xfdb913, transparent: true, opacity: .32, depthWrite: false });
  [-1, 1].forEach(side => { const wm = new THREE.Mesh(new THREE.PlaneGeometry(D, H), graphite); wm.position.set(side * W / 2, H / 2, 0); wm.rotation.y = -side * Math.PI / 2; S3.add(wm); });
  // a label drawn once, sharp at any distance
  const label = (lines, bg, fg, w = 256, h = 128) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.fillStyle = bg; x.fillRect(0, 0, w, h); x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle'; lines.forEach((l, i) => { x.font = `${i ? 'normal' : 'bold'} ${i ? 22 : 40}px Saira, Arial, sans-serif`; x.fillText(l, w / 2, h / 2 + (i - (lines.length - 1) / 2) * 44); }); const t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t; };
  const inst = (geo, mat, n) => { const m = new THREE.InstancedMesh(geo, mat, n); m.count = 0; S3.add(m); return m; };
  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), SC = new THREE.Vector3(1, 1, 1), PV = new THREE.Vector3();
  const put = (m, x, y, z, ry = 0, rx = 0) => { Q.setFromEuler(new THREE.Euler(rx, ry, 0)); M4.compose(PV.set(x, y, z), Q, SC); m.setMatrixAt(m.count++, M4); };
  const shelfUnit = (side, z0, len, rows, fill) => { // planks along a wall from z0 to z0+len, rows at given heights
    const x = side * (W / 2 - .45);
    const back = new THREE.Mesh(new THREE.BoxGeometry(.06, 3.2, len), graphite); back.position.set(side * (W / 2 - .06), 1.65, z0 + len / 2); S3.add(back);
    rows.forEach((y, i) => {
      const pl = new THREE.Mesh(new THREE.BoxGeometry(.9, .05, len), plankMat); pl.position.set(x, y, z0 + len / 2); S3.add(pl);
      const led = new THREE.Mesh(new THREE.BoxGeometry(.03, .02, len - .1), ledMat); led.position.set(side * (W / 2 - .9), y - .035, z0 + len / 2); S3.add(led);
      const gl = new THREE.Mesh(new THREE.PlaneGeometry(.9, len - .1), glowMat); gl.rotation.x = Math.PI / 2; gl.position.set(x, y - .04, z0 + len / 2); S3.add(gl);
      fill(i, x, y + .025, z0, len);
    });
    for (let z = z0; z <= z0 + len + .01; z += len / 3) { const up = new THREE.Mesh(new THREE.BoxGeometry(.9, 3.2, .05), plankMat); up.position.set(x, 1.65, z); S3.add(up); }
  };
  // tyres on the left: real tyre profiles (no rims, as sold), brand moulded into the sidewall, fanned so the sidewall faces you as you walk the aisle
  const rubber = new THREE.MeshStandardMaterial({ color: 0x15181b, roughness: .55, metalness: .05 }), rim = new THREE.MeshStandardMaterial({ color: 0x8e99a4, roughness: .35, metalness: .8 });
  const prof = [[.2, -.1], [.235, -.112], [.33, -.112], [.385, -.104], [.405, -.084], [.411, -.05], [.411, .05], [.405, .084], [.385, .104], [.33, .112], [.235, .112], [.2, .1]].map(p => new THREE.Vector2(p[0], p[1]));
  const tyreGeo = new THREE.LatheGeometry(prof, 56); tyreGeo.rotateX(Math.PI / 2); // axis along z
  const sideTex = (name, size, col) => { const c = document.createElement('canvas'); c.width = 2048; c.height = 256; const x = c.getContext('2d'); x.fillStyle = '#16191c'; x.fillRect(0, 0, 2048, 256);
    const band = (v0, v1, flip) => { const y0 = (1 - v1) * 256, h = (v1 - v0) * 256; x.save(); x.translate(0, y0 + h / 2); if (flip) x.scale(-1, -1), x.translate(-2048, 0); x.textBaseline = 'middle'; x.textAlign = 'center';
      [256, 1280].forEach(u => { x.fillStyle = col; x.font = `bold ${h * .62}px Saira, Arial, sans-serif`; x.fillText(name, u, 0); x.fillStyle = '#9aa3ab'; x.font = `600 ${h * .4}px Saira, Arial, sans-serif`; x.fillText(size, u + 520, 0); }); x.restore(); };
    band(1 / 11, 3 / 11, false); band(8 / 11, 10 / 11, true);
    x.fillStyle = '#0d0f11'; for (let u = 0; u < 2048; u += 16) x.fillRect(u, (1 - 7 / 11) * 256, 6, (3 / 11) * 256); // tread blocks
    const t = new THREE.CanvasTexture(c); t.anisotropy = 8; return new THREE.MeshStandardMaterial({ map: t, roughness: .62, metalness: .04 }); };
  const brands = [['BRIDGESTONE', '225/45 R17 91W', '#f2f4f6'], ['CONTINENTAL', '205/55 R16 91V', '#fdb913'], ['PIRELLI', '215/60 R16 95V', '#f2f4f6']];
  const tyreSets = brands.map(b => inst(tyreGeo, sideTex(...b), 140));
  let tn = 0;
  shelfUnit(-1, -8, 16, [.55, 1.45, 2.35, 3.25], (i, x, y, z0, len) => { for (let z = z0 + .4; z < z0 + len - .35; z += .26) put(tyreSets[Math.floor(tn++ / 7) % 3], x, y + .41, z, .5); });
  tyreSets.forEach(m => m.instanceMatrix.needsUpdate = true);
  // oils and batteries on the right
  // product labels drawn like the real packs: PETRONAS teal band and grade, VARTA blue with the spec strip
  const pack = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.anisotropy = 8; return t; };
  const oilLab = pack(256, 160, (x, w, h) => { let g = x.createLinearGradient(0, 0, w, 0); g.addColorStop(0, '#2b333b'); g.addColorStop(.5, '#4a545e'); g.addColorStop(1, '#2b333b'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.fillStyle = '#e9eef1'; x.fillRect(0, 0, w, 52); x.fillStyle = '#00a19a'; x.fillRect(0, 52, w, 5); x.font = 'bold 22px Saira, Arial, sans-serif'; x.textBaseline = 'middle'; x.fillText('PETRONAS', 62, 27);
    x.fillStyle = '#fff'; x.textAlign = 'left'; x.textBaseline = 'alphabetic'; x.font = 'bold 30px Saira, Arial, sans-serif'; x.fillText('SYNTIUM', 16, 96); x.font = '600 15px Saira, Arial, sans-serif'; x.fillStyle = '#c9d2da'; x.fillText('5000 · FULLY SYNTHETIC', 16, 118);
    x.fillStyle = '#fdb913'; x.font = 'bold 26px Saira, Arial, sans-serif'; x.fillText('5W-30', 16, 150); x.textAlign = 'right'; x.fillStyle = '#fff'; x.font = 'bold 22px Saira, Arial, sans-serif'; x.fillText('4L', w - 14, 150); });
  const battLab = pack(256, 94, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#2366c4'); g.addColorStop(1, '#123a7a'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.fillStyle = '#fff'; x.textBaseline = 'alphabetic'; x.textAlign = 'left'; x.font = 'italic 900 32px Saira, Arial, sans-serif'; x.fillText('VARTA', 14, 34); x.font = '600 14px Saira, Arial, sans-serif'; x.fillStyle = '#9fd0ff'; x.fillText('BLUE dynamic', 130, 32);
    x.fillStyle = '#f2f4f6'; x.fillRect(0, 56, w, 38); x.fillStyle = '#123a7a'; x.font = 'bold 19px Saira, Arial, sans-serif'; x.fillText('12V   60Ah   540A', 14, 82); x.fillStyle = '#fdb913'; x.fillRect(0, 52, w, 4); });
  // real brand marks drawn onto the labels once the SVGs load
  const brandOn = (tex, src, x, y, w, h) => { const im = new Image(); im.onload = () => { const c = tex.image, cx = c.getContext('2d'); cx.drawImage(im, x, y, w, h); tex.needsUpdate = true; }; im.src = src; };
  brandOn(oilLab, 'img/brands/petronas.svg', 14, 6, 40, 41);
  // tyre brands on a sign along the rack
  ['bridgestone', 'continental', 'pirelli'].forEach((b, i) => { const im = new Image(); im.onload = () => { const c = document.createElement('canvas'); c.width = 512; c.height = 128; const x = c.getContext('2d'); x.fillStyle = '#121a21'; x.fillRect(0, 0, 512, 128); x.fillStyle = '#fff'; x.fillRect(0, 118, 512, 10); x.fillStyle = '#fdb913'; x.fillRect(0, 118, 512, 4); const s = Math.min(420 / im.width, 80 / im.height); x.drawImage(im, 256 - im.width * s / 2, 64 - im.height * s / 2, im.width * s, im.height * s); const t = new THREE.CanvasTexture(c); const m = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 1.15), new THREE.MeshBasicMaterial({ map: t })); m.position.set(-W / 2 + .12, 3.75, -5.3 + i * 5.3); m.rotation.y = Math.PI / 2; S3.add(m); }; im.src = `img/brands/${b}.svg`; });
  const canMat = new THREE.MeshStandardMaterial({ color: 0x2b333a, roughness: .45, metalness: .15, emissive: 0x0d1216, emissiveIntensity: .5 }), capMat = new THREE.MeshStandardMaterial({ color: 0xfdb913, roughness: .35 });
  const cans = inst(new THREE.BoxGeometry(.19, .3, .13, 1, 1, 1), canMat, 160), caps = inst(new THREE.CylinderGeometry(.04, .04, .05, 6), capMat, 160), canLabels = inst(new THREE.PlaneGeometry(.17, .11), new THREE.MeshBasicMaterial({ map: oilLab }), 160);
  const battMat = new THREE.MeshStandardMaterial({ color: 0x2b3136, roughness: .6, emissive: 0x101418, emissiveIntensity: .4 }), batts = inst(new THREE.BoxGeometry(.2, .2, .34), battMat, 80), battTops = inst(new THREE.BoxGeometry(.2, .02, .34), new THREE.MeshStandardMaterial({ color: 0x1b4fa0, roughness: .5 }), 80), battLabels = inst(new THREE.PlaneGeometry(.3, .11), new THREE.MeshBasicMaterial({ map: battLab }), 80), poles = inst(new THREE.CylinderGeometry(.02, .02, .03, 5), rim, 160);
  shelfUnit(1, -8, 16, [.55, 1.35, 2.15, 2.95], (i, x, y, z0, len) => {
    if (i >= 2) for (let z = z0 + .3; z < z0 + len - .2; z += .24) { put(cans, x + .15, y + .15, z); put(caps, x + .15, y + .325, z - .035); put(canLabels, x + .15 - .066, y + .15, z, -Math.PI / 2); }
    else for (let z = z0 + .35; z < z0 + len - .3; z += .42) { put(batts, x + .1, y + .1, z); put(battTops, x + .1, y + .21, z); put(poles, x + .1, y + .235, z - .12); put(poles, x + .1, y + .235, z + .12); put(battLabels, x + .1 - .101, y + .1, z, -Math.PI / 2); }
  });
  [cans, caps, canLabels, batts, battTops, battLabels, poles].forEach(m => m.instanceMatrix.needsUpdate = true);
  // the same products as single meshes, to carry in the hand
  const heldOil = new THREE.Group(); heldOil.add(new THREE.Mesh(cans.geometry, canMat)); const hc = new THREE.Mesh(caps.geometry, capMat); hc.position.set(0, .17, -.03); heldOil.add(hc); const hl = new THREE.Mesh(canLabels.geometry, canLabels.material); hl.position.z = .066; heldOil.add(hl);
  const heldBatt = new THREE.Group(); heldBatt.add(new THREE.Mesh(batts.geometry, battMat)); const bt = new THREE.Mesh(battTops.geometry, battTops.material); bt.position.y = .11; heldBatt.add(bt); const bl = new THREE.Mesh(battLabels.geometry, battLabels.material); bl.position.x = -.101; bl.rotation.y = -Math.PI / 2; // long side faces the aisle, like on the shelf heldBatt.add(bl);
  const heldTyre = new THREE.Group(); heldTyre.add(new THREE.Mesh(tyreGeo, tyreSets[0].material)); heldTyre.scale.setScalar(.8);
  [heldOil, heldBatt, heldTyre].forEach(g => { g.visible = false; S3.add(g); }); game.heldMeshes = { oil: heldOil, batt: heldBatt, tyre: heldTyre };
  // the shopping trolley: a tapered wire basket on a chrome frame, yellow handle, swivel casters; parked by the entrance until you take it
  const trolley = new THREE.Group(), chrome = new THREE.MeshStandardMaterial({ color: 0xd4dbe2, roughness: .22, metalness: .92 });
  const wires = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 1, 6), chrome, 160); wires.count = 0;
  const _a = new THREE.Vector3(), _up = new THREE.Vector3(0, 1, 0), _m = new THREE.Matrix4(), _qq = new THREE.Quaternion(), _s = new THREE.Vector3();
  const wire = (a, b, r = .005) => { _a.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]); const len = _a.length(); _qq.setFromUnitVectors(_up, _a.normalize()); _m.compose(new THREE.Vector3((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2), _qq, _s.set(r, len, r)); wires.setMatrixAt(wires.count++, _m); };
  // basket corners: bottom is narrower and shorter at the front, like a nesting trolley
  const B = (t, u, v) => { const x = (u * 2 - 1) * (.22 + t * .06), z = -.32 - t * .13 + v * (.7 + t * .11), y = .5 + t * .4; return [x, y, z]; };
  for (let t = 0; t <= 1.001; t += .25) { const r = t > .99 ? .011 : .005; wire(B(t, 0, 0), B(t, 1, 0), r); wire(B(t, 0, 1), B(t, 1, 1), r); wire(B(t, 0, 0), B(t, 0, 1), r); wire(B(t, 1, 0), B(t, 1, 1), r); } // rings, thicker rim on top
  for (let v = 0; v <= 1.001; v += 1 / 9) { wire(B(0, 0, v), B(1, 0, v)); wire(B(0, 1, v), B(1, 1, v)); wire(B(0, 0, v), B(0, 1, v)); } // side uprights and floor
  for (let u = 0; u <= 1.001; u += 1 / 6) { wire(B(0, u, 0), B(1, u, 0)); wire(B(0, u, 1), B(1, u, 1)); wire(B(0, u, 0), B(0, u, 1)); }
  [-1, 1].forEach(sd => { const x = sd * .22;
    wire([x, .5, .38], [x, .1, .36], .013); wire([x, .5, -.32], [x, .1, -.36], .013); wire([x, .1, -.38], [x, .1, .38], .013); // legs and base rail
    wire([sd * .28, .9, .49], [sd * .28, .99, .56], .012); wire([x * .8, .2, -.3], [x * .8, .2, .3], .006); }); // handle arms, lower tray
  for (let z = -.28; z <= .3; z += .1) wire([-.18, .2, z], [.18, .2, z], .005);
  wires.instanceMatrix.needsUpdate = true; const frame = new THREE.Group(); frame.add(wires); trolley.add(frame);
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(.022, .022, .6, 16), new THREE.MeshStandardMaterial({ color: 0xfdb913, roughness: .45 })); handle.rotation.z = Math.PI / 2; handle.position.set(0, .99, .56); frame.add(handle);
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(.2, .07), new THREE.MeshBasicMaterial({ map: label(['TEGETA'], '#fdb913', '#141b21', 256, 90) })); plate.position.set(0, .82, -.465); plate.rotation.set(-.3, Math.PI, 0); frame.add(plate);
  const tyreMat = new THREE.MeshStandardMaterial({ color: 0x1a2026, roughness: .6 }), fork = new THREE.MeshStandardMaterial({ color: 0x2a3138, roughness: .4, metalness: .6 });
  [[-.22, .36], [.22, .36], [-.22, -.36], [.22, -.36]].forEach(p => { const f = new THREE.Mesh(new THREE.BoxGeometry(.05, .06, .03), fork); f.position.set(p[0], .1, p[1]); frame.add(f);
    const w = new THREE.Mesh(new THREE.CylinderGeometry(.055, .055, .035, 20), tyreMat); w.rotation.z = Math.PI / 2; w.position.set(p[0], .055, p[1] - .02); trolley.add(w); });
  const cargo = new THREE.Group(); cargo.position.set(0, .52, 0); trolley.add(cargo);
  trolley.position.set(-1.6, 0, 3.4); trolley.rotation.y = Math.PI; S3.add(trolley); game.trolley = { g: trolley, cargo, taken: false };
  // the counter: a real desk in front of the photo wall, with the yellow strip above
  const desk = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.05, .8), graphite); desk.position.set(0, .525, -8.1); S3.add(desk);
  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(4.3, .05, .9), plankMat); deskTop.position.set(0, 1.07, -8.1); S3.add(deskTop);
  const deskLed = new THREE.Mesh(new THREE.BoxGeometry(4.2, .02, .02), ledMat); deskLed.position.set(0, .06, -7.69); S3.add(deskLed);
  // ---- the counter wall, fully 3D: graphite wall, glowing band, Tegeta sign, back shelf, POS terminal, light pillars
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(W, H), graphite); backWall.position.set(0, H / 2, -D / 2); S3.add(backWall);
  const band = new THREE.Mesh(new THREE.BoxGeometry(7.6, .34, .06), new THREE.MeshBasicMaterial({ color: 0xffc534 })); band.position.set(0, 2.95, -D / 2 + .05); S3.add(band);
  const bandGlow = new THREE.Mesh(new THREE.PlaneGeometry(8.6, 1.5), new THREE.MeshBasicMaterial({ color: 0xfdb913, transparent: true, opacity: .16, depthWrite: false })); bandGlow.position.set(0, 2.95, -D / 2 + .03); S3.add(bandGlow);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.6, .62), new THREE.MeshBasicMaterial({ transparent: true, color: 0xffffff })); sign.position.set(0, 3.62, -D / 2 + .04); S3.add(sign);
  { const im = new Image(); im.onload = () => { const c = document.createElement('canvas'); c.width = 1024; c.height = 244; const x = c.getContext('2d'); const s = Math.min(1000 / im.width, 230 / im.height); x.drawImage(im, 512 - im.width * s / 2, 122 - im.height * s / 2, im.width * s, im.height * s); sign.material.map = new THREE.CanvasTexture(c); sign.material.needsUpdate = true; }; im.src = 'img/logo.svg'; }
  const niche = new THREE.Mesh(new THREE.BoxGeometry(6, 1.3, .35), new THREE.MeshStandardMaterial({ color: 0x141c23, roughness: .8 })); niche.position.set(0, 1.85, -D / 2 + .18); S3.add(niche);
  for (const yy of [1.45, 1.95]) { const sh = new THREE.Mesh(new THREE.BoxGeometry(5.8, .03, .3), plankMat); sh.position.set(0, yy, -D / 2 + .33); S3.add(sh); const sl = new THREE.Mesh(new THREE.BoxGeometry(5.6, .015, .015), ledMat); sl.position.set(0, yy - .02, -D / 2 + .47); S3.add(sl);
    for (let xx = -2.6; xx <= 2.6; xx += .26) { const can = new THREE.Mesh(new THREE.BoxGeometry(.16, .26, .11), canMat); can.position.set(xx, yy + .145, -D / 2 + .3); S3.add(can); } }
  for (const sx of [-3.9, 3.9]) { const pil = new THREE.Mesh(new THREE.BoxGeometry(.05, H - .4, .05), new THREE.MeshBasicMaterial({ color: 0xffd36a })); pil.position.set(sx, H / 2, -D / 2 + .06); S3.add(pil); const pg = new THREE.Mesh(new THREE.PlaneGeometry(.7, H - .4), new THREE.MeshBasicMaterial({ color: 0xfdb913, transparent: true, opacity: .12, depthWrite: false })); pg.position.set(sx, H / 2, -D / 2 + .04); S3.add(pg); }
  const pos = new THREE.Group(); const posBody = new THREE.Mesh(new THREE.BoxGeometry(.32, .05, .24), new THREE.MeshStandardMaterial({ color: 0x0e1418, roughness: .4, metalness: .5 })); pos.add(posBody); const posStand = new THREE.Mesh(new THREE.CylinderGeometry(.02, .03, .2, 8), rim); posStand.position.y = -.1; pos.add(posStand); const posScr = new THREE.Mesh(new THREE.PlaneGeometry(.26, .18), new THREE.MeshBasicMaterial({ color: 0x5fb4ff })); posScr.position.set(0, .027, 0); posScr.rotation.x = -Math.PI / 2; pos.add(posScr); pos.position.set(.9, 1.3, -8.15); pos.rotation.x = .5; S3.add(pos); game.posScr = posScr;
  // ---- the entrance: a glass storefront with a sliding door, and the parking lot at dusk outside
  const glassMat = new THREE.MeshBasicMaterial({ color: 0x9cc6e6, transparent: true, opacity: .1, depthWrite: false, side: THREE.DoubleSide });
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(W, H), glassMat); glass.position.set(0, H / 2, D / 2); S3.add(glass);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x1a232b, roughness: .5, metalness: .6 });
  for (let xx = -W / 2; xx <= W / 2 + .01; xx += 1.75) { if (Math.abs(xx) < 1.3) continue; const m = new THREE.Mesh(new THREE.BoxGeometry(.07, H, .1), frameMat); m.position.set(xx, H / 2, D / 2); S3.add(m); }
  for (const yy of [.04, 2.6, H - .04]) { const m = new THREE.Mesh(new THREE.BoxGeometry(W, .07, .1), frameMat); m.position.set(0, yy, D / 2); S3.add(m); }
  const doorTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, .05, .08), new THREE.MeshBasicMaterial({ color: 0xffc534 })); doorTop.position.set(0, 2.66, D / 2 - .06); S3.add(doorTop);
  // two automatic sliding leaves: framed glass, they part as you come in and when you walk up to them
  const leafGlass = new THREE.MeshBasicMaterial({ color: 0xbfe0f5, transparent: true, opacity: .16, depthWrite: false, side: THREE.DoubleSide });
  game.doors = [-1, 1].map(sd => { const g = new THREE.Group(), pane = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 2.58), leafGlass); pane.position.y = 1.31; g.add(pane);
    [[-.57, 1.31, .05, 2.6], [.57, 1.31, .05, 2.6], [0, .03, 1.19, .06], [0, 2.59, 1.19, .05]].forEach(([x, y, w, h]) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, .06), frameMat); b.position.set(x, y, 0); g.add(b); });
    const pull = new THREE.Mesh(new THREE.BoxGeometry(.03, .6, .05), new THREE.MeshBasicMaterial({ color: 0xffc534 })); pull.position.set(-sd * .5, 1.1, 0); g.add(pull);
    g.position.set(sd * .6, 0, D / 2 - .03); S3.add(g); return g; });
  // outside: dusk sky, the parking lot with lines, a row of light poles
  const sky = document.createElement('canvas'); sky.width = 4; sky.height = 256; // the sky outside follows the real hour in Tbilisi: day blue, dusk and dawn amber, night deep blue
  const hr = +new Date().toLocaleString('en-GB', { timeZone: 'Asia/Tbilisi', hour: '2-digit', hour12: false }) % 24, tod = hr >= 8 && hr < 17 ? 'day' : (hr >= 6 && hr < 8) || (hr >= 17 && hr < 21) ? 'dusk' : 'night';
  { const x = sky.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 256); ({ day: ['#2f6fb5', '#79aee0', '#cfe3f2', '#8e99a1'], dusk: ['#0b1622', '#2c4a66', '#c98a52', '#3a3530'], night: ['#02060b', '#08131f', '#132538', '#15181c'] })[tod].forEach((c, i) => g.addColorStop([0, .55, .8, 1][i], c)); x.fillStyle = g; x.fillRect(0, 0, 4, 256); }
  const skyM = new THREE.Mesh(new THREE.PlaneGeometry(80, 26), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sky), fog: false })); skyM.position.set(0, 9, D / 2 + 26); skyM.rotation.y = Math.PI; S3.add(skyM);
  const lot = document.createElement('canvas'); lot.width = 512; lot.height = 512; { const x = lot.getContext('2d'); x.fillStyle = '#1d2329'; x.fillRect(0, 0, 512, 512); x.strokeStyle = 'rgba(253,185,19,.8)'; x.lineWidth = 5; for (let i = 0; i <= 512; i += 64) { x.beginPath(); x.moveTo(i, 120); x.lineTo(i, 260); x.stroke(); } x.beginPath(); x.moveTo(0, 120); x.lineTo(512, 120); x.stroke(); }
  const lotM = new THREE.Mesh(new THREE.PlaneGeometry(60, 26), new THREE.MeshLambertMaterial({ map: new THREE.CanvasTexture(lot) })); lotM.material.color.setScalar({ day: 1.25, dusk: .8, night: .5 }[tod]); lotM.rotation.x = -Math.PI / 2; lotM.position.set(0, -.01, D / 2 + 13); S3.add(lotM);
  for (let xx = -12; xx <= 12; xx += 8) { const pole = new THREE.Mesh(new THREE.CylinderGeometry(.06, .08, 6, 8), frameMat); pole.position.set(xx, 3, D / 2 + 16); S3.add(pole); const head = new THREE.Mesh(new THREE.BoxGeometry(1, .08, .25), new THREE.MeshBasicMaterial({ color: 0xffe2a8 })); head.position.set(xx + .4, 6, D / 2 + 16); S3.add(head); }
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshPhongMaterial({ color: 0x3a4a57, specular: phone ? 0x3c4a56 : 0x7f93a6, shininess: phone ? 30 : 60 })); floor.rotation.x = -Math.PI / 2; S3.add(floor);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshLambertMaterial({ color: 0x15202a })); ceil.rotation.x = Math.PI / 2; ceil.position.y = H; S3.add(ceil);
  // ceiling: yellow light strips and cool lamps, like the cluster
  // round ceiling lamps in clusters, like the real Tegeta halls
  for (let z = -7; z <= 7; z += 3.5) for (let x = -4.5; x <= 4.5; x += 4.5) { const trim = new THREE.Mesh(new THREE.RingGeometry(.17, .24, 24), new THREE.MeshBasicMaterial({ color: 0x2b363f, side: THREE.DoubleSide })); trim.rotation.x = Math.PI / 2; trim.position.set(x, H - .015, z); S3.add(trim); const lamp = new THREE.Mesh(new THREE.CircleGeometry(.17, 24), new THREE.MeshBasicMaterial({ color: 0xfff1d2, side: THREE.DoubleSide })); lamp.rotation.x = Math.PI / 2; lamp.position.set(x, H - .02, z); S3.add(lamp); } // recessed downlights
  for (let z = -6; z <= 6; z += 4) { const strip = new THREE.Mesh(new THREE.BoxGeometry(6, .05, .12), new THREE.MeshBasicMaterial({ color: 0xfdb913 })); strip.position.set(0, H - .03, z); S3.add(strip); }
  // few lights on purpose: phones have tight shader limits, more lights than this renders black on iPhone
  const warm = new THREE.PointLight(0xffd36a, 1.3, 16); warm.position.set(0, H - 1.2, -3); S3.add(warm);
  const cool = new THREE.PointLight(0x8fb8e0, 1.0, 16); cool.position.set(0, H - 1.2, 5); S3.add(cool);
  S3.add(new THREE.HemisphereLight(0xc9dcec, 0x2a3842, 1.45));
  // the shopper: a rigged mannequin in Tegeta colours, with real idle and walk animations
  const P = new THREE.Group(); S3.add(P);
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(.34, 24), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .35 })); shadow.rotation.x = -Math.PI / 2; shadow.position.y = .01; P.add(shadow);
  game.rig = { P, held: game.heldMeshes, mixer: null, clips: {}, cur: null, hand: null };
  // the model ships as base64 inside shopper.js, since the artifact host does not serve .glb files
  setCharacter(game.char || 'a');
  // mirror floor under the glossy one: the room reflects, like a polished showroom
  const mirror = new THREE.Reflector(new THREE.PlaneGeometry(W, D), { textureWidth: 512, textureHeight: 512, color: 0x5e7284, clipBias: .003 }); mirror.rotation.x = -Math.PI / 2; mirror.position.y = -.005; mirror.visible = !phone; S3.add(mirror); game.mirror = mirror;
  floor.material.transparent = true; floor.material.opacity = .72;
  // soft skirting: a dark gradient at the base of every wall, so photo and floor melt into each other instead of a hard seam
  const gc = document.createElement('canvas'); gc.width = 4; gc.height = 128; const gx = gc.getContext('2d'); const gg = gx.createLinearGradient(0, 0, 0, 128); gg.addColorStop(0, 'rgba(14,22,30,0)'); gg.addColorStop(.6, 'rgba(14,22,30,.18)'); gg.addColorStop(1, 'rgba(14,22,30,.5)'); gx.fillStyle = gg; gx.fillRect(0, 0, 4, 128);
  const skirtTex = new THREE.CanvasTexture(gc), skirt = (w, pos, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, .7), new THREE.MeshBasicMaterial({ map: skirtTex, transparent: true, depthWrite: false })); m.position.set(...pos); m.rotation.y = ry; S3.add(m); };

  // and a soft floor shadow along the walls
  const fs = (w, pos, rz) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 1.2), new THREE.MeshBasicMaterial({ map: skirtTex, transparent: true, depthWrite: false, opacity: .45 })); m.rotation.x = -Math.PI / 2; m.rotation.z = rz; m.position.set(...pos); S3.add(m); };

  const fill = new THREE.PointLight(0xdfe9f3, .7, 7); C3.add(fill); S3.add(C3); // a soft light travels with the camera so the shopper reads clearly
  // pick-up points and the counter: a 3D icon floating at the shelf with a soft ring
  const mk = (id, ic, at) => { const t = T.load(ic ? ic : 'img/logo.svg'); const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true })); sp.scale.set(.6, .6, 1); sp.position.set(at[0], at[1] + .9, at[2]); S3.add(sp);
    const ring = new THREE.Mesh(new THREE.RingGeometry(.35, .5, 40), new THREE.MeshBasicMaterial({ color: 0xfdb913, transparent: true, opacity: .55, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.set(at[0], .02, at[2]); S3.add(ring); sprites[id] = { sp, ring }; };
  ITEMS.forEach(i => mk(i.id, ic(i.ic), i.at));
  mk('counter', ic('card'), [0, 1.25, -7.6]);
  sprites.trolleyRing = { sp: { position: { y: 0 }, visible: true }, ring: new THREE.Mesh(new THREE.RingGeometry(.35, .5, 40), new THREE.MeshBasicMaterial({ color: 0xfdb913, transparent: true, opacity: .55, side: THREE.DoubleSide })) }; sprites.trolleyRing.ring.rotation.x = -Math.PI / 2; sprites.trolleyRing.ring.position.set(-1.6, .02, 3.4); S3.add(sprites.trolleyRing.ring); sprites.counter.sp.scale.set(.7, .7, 1);
  const LIC = { oil: 'oil', batt: 'battery', tyre: 'tyre', counter: 'card', door: 'keyfob', trolley: 'shelf' };
  $('#labels3d').innerHTML = [...ITEMS.map(i => ({ id: i.id, l: i.shelf })), ...ZONES].map(z => `<span class="lb3" data-id="${z.id}"><img src="${ic(LIC[z.id])}" alt="">${z.l}</span>`).join('') + '<div class="obj-arrow" id="objArrow" hidden><i></i><b></b></div>';
  // objective beacon: a tall glowing column on the place you should go next, like a game waypoint
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(.18, .32, 3.4, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0xfdb913, transparent: true, opacity: .35, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })); beam.position.y = 1.7; S3.add(beam); game.beam = beam;
  const marker = new THREE.Mesh(new THREE.RingGeometry(.25, .34, 32), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide })); marker.rotation.x = -Math.PI / 2; S3.add(marker); game.marker = marker;
  game.ready = true;
}
// two shoppers to choose from: 'a' a sleek Tegeta-coloured mannequin, 'b' a realistic man; both with idle and walk clips
// two shoppers in the same Tegeta mannequin style: 'a' as modelled, 'b' a man — same model reshaped (broader shoulders, narrower hips, taller) walking with a masculine walk cycle
const parseGlb = b64 => new Promise((ok, bad) => new THREE.GLTFLoader().parse(Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer, '', ok, bad));

// runtime retarget: a hidden mannequin plays the clip; each frame its bone world rotations are mapped onto another skeleton
function makeRetarget(src, tgt) {
  const sb = {}, pairs = [], q = new THREE.Quaternion(), qp = new THREE.Quaternion();
  src.traverse(o => { if (o.isBone) sb[o.name.replace(/^mixamorig/, '')] = o; });
  src.updateMatrixWorld(true); tgt.updateMatrixWorld(true);
  tgt.traverse(o => { const n = o.name.replace(/^mixamorig/, ''); if (o.isBone && sb[n]) { const a = new THREE.Quaternion(), b = new THREE.Quaternion(); sb[n].getWorldQuaternion(a); o.getWorldQuaternion(b); pairs.push({ t: o, s: sb[n], off: a.invert().multiply(b) }); } });
  return () => { for (const p of pairs) { p.s.getWorldQuaternion(q).multiply(p.off); p.t.parent.getWorldQuaternion(qp); p.t.quaternion.copy(qp.invert().multiply(q)); p.t.updateMatrixWorld(true); } };
}
// two shoppers: 'a' the Tegeta mannequin, 'b' a man (Ready Player Me avatar) driven by the same animations through the retarget
async function setCharacter(id) {
  game.char = id;
  const rig = game.rig; if (!rig) return;
  [rig.model, rig.src].forEach(o => o && rig.P.remove(o)); rig.mixer && rig.mixer.stopAllAction();
  if (rig.cap) { S3.remove(rig.cap); rig.cap = null; }
  Object.assign(rig, { model: null, src: null, sync: null, mixer: null, clips: {}, cur: null, hand: null, head: null, arms: [], fore: [], hips: null, male: false });
  try {
    // the models load after the page (deferred); a quick first entry waits for them instead of showing only the shadow
    if (document.readyState !== 'complete') await new Promise(r => addEventListener('load', r, { once: true })); if (game.char !== id) return;
    const g = await parseGlb(window.SHOPPER_B64); if (game.char !== id) return;
    const src = g.scene; let m = src;
    if (id === 'b') { m = (await parseGlb(window.SHOPPER2_B64)).scene; if (game.char !== id) return; }
    const paint = o => { if (o.isMesh) { o.frustumCulled = false; const mat = o.material; if (/Joints/i.test(mat.name)) { mat.color.set(0xf2b705); mat.metalness = .6; mat.roughness = .45; } else { mat.color.set(0x2a2f36); mat.metalness = .2; mat.roughness = .42; } } };
    if (m !== src) m.traverse(paint);
    src.traverse(o => {
      if (o.isMesh) { o.frustumCulled = false; const mat = o.material; if (/Joints/i.test(mat.name)) { mat.color.set(0xf2b705); mat.metalness = .6; mat.roughness = .45; } else { mat.color.set(0x2a2f36); mat.metalness = .2; mat.roughness = .42; } }
      if (o.isBone && /(Left|Right)Arm$/.test(o.name)) rig.arms.push(o);
      if (o.isBone && /(Left|Right)ForeArm$/.test(o.name)) rig.fore.push(o);
    });
    m.traverse(o => { if (o.isMesh) o.frustumCulled = false; if (o.isBone && /RightHand$/.test(o.name)) rig.hand = o; });
    rig.P.add(src); rig.model = m;
    if (m !== src) { rig.P.add(m); src.visible = false; rig.src = src; rig.sync = makeRetarget(src, m); }
    const mx = new THREE.AnimationMixer(src); rig.mixer = mx;
    g.animations.forEach(c => rig.clips[c.name.toLowerCase()] = mx.clipAction(c));
    play('idle');
  } catch (e) { showErr('პერსონაჟი ვერ ჩაიტვირთა'); }
}
// one arm points at a world point: the upper arm turns so the elbow line aims there, the forearm straightens with it
const _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _v = new THREE.Vector3(), _v2 = new THREE.Vector3(), _ax = new THREE.Vector3(), _q0 = new THREE.Quaternion();
function aimArm(arm, fore, target, w) {
  if (w <= 0) return; arm.updateMatrixWorld(true);
  arm.getWorldPosition(_v); _v2.copy(target).sub(_v).normalize(); arm.getWorldQuaternion(_q);
  _ax.copy(fore.position).normalize().applyQuaternion(_q); _q2.setFromUnitVectors(_ax, _v2).multiply(_q);
  arm.parent.getWorldQuaternion(_q); arm.quaternion.slerp(_q.invert().multiply(_q2), w); fore.quaternion.slerp(_q0, w * .85);
}
// small sounds made on the fly (no files): a soft pick, a wire-basket clink, the terminal beep, the door chime
let AC = null;
function sfx(kind) { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume();
  const tone = (f, t0, d, type = 'sine', v = .12, f2) => { const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + t0; o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.001, t + d); o.connect(g).connect(AC.destination); o.start(t); o.stop(t + d + .02); };
  if (kind === 'pick') tone(520, 0, .12, 'sine', .1, 780);
  if (kind === 'back') tone(600, 0, .14, 'sine', .08, 380);
  if (kind === 'cart') { tone(1900, 0, .18, 'triangle', .06); tone(2600, .03, .22, 'triangle', .04); tone(140, 0, .12, 'sine', .14, 90); }
  if (kind === 'pay') { tone(1320, 0, .09, 'square', .05); tone(1320, .13, .09, 'square', .05); tone(1760, .26, .25, 'sine', .08); }
  if (kind === 'door') { tone(660, 0, .5, 'sine', .07); tone(880, .18, .7, 'sine', .07); }
  if (kind === 'take') tone(220, 0, .16, 'triangle', .1, 160);
  if (navigator.vibrate && kind !== 'door') navigator.vibrate(kind === 'pay' ? [20, 60, 20] : 12);
} catch (e) {} }
// footsteps on the polished floor, and the trolley's wheels humming while it rolls
let rollG = null;
function step() { try { if (!AC || AC.state !== 'running') return; const n = AC.createBufferSource(), b = AC.createBuffer(1, AC.sampleRate * .06, AC.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
  const f = AC.createBiquadFilter(), g = AC.createGain(); f.type = 'lowpass'; f.frequency.value = 900 + Math.random() * 300; g.gain.value = .22; n.buffer = b; n.connect(f).connect(g).connect(AC.destination); n.start(); } catch (e) {} }
function roll(level) { try { if (!AC || AC.state !== 'running') return;
  if (!rollG) { const n = AC.createBufferSource(), b = AC.createBuffer(1, AC.sampleRate * 2, AC.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; n.loop = true;
    const f = AC.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 320; f.Q.value = .8; rollG = AC.createGain(); rollG.gain.value = 0; n.connect(f).connect(rollG).connect(AC.destination); n.start(); }
  rollG.gain.setTargetAtTime(level * .05, AC.currentTime, .08); } catch (e) {} }
function shelfPoint(id) { const it = ITEMS.find(x => x.id === id); return new THREE.Vector3(Math.sign(it.at[0]) * 5.15, Math.max(.8, Math.min(1.6, it.at[1])), game.z); }
function play(name) { const r = game.rig; if (!r.mixer || r.cur === name) return; const a = r.clips[name]; if (!a) return; if (r.cur) r.clips[r.cur].fadeOut(.25); a.reset().fadeIn(.25).play(); r.cur = name; }
function size3d() { if (!R3) return; const w = scr.clientWidth, h = scr.clientHeight; R3.setSize(w, h, false); C3.aspect = w / h; C3.fov = w < h ? 74 : 72; C3.updateProjectionMatrix(); game.zoom = w < h ? 4.6 : 2.8; game.pitch = w < h ? .2 : .12; }
const V3 = new THREE.Vector3();
function update3d(dt) {
  const k = drive.keys, SPD = 3.2, ROT = 1.7;
  if (k.ArrowLeft) game.yaw += ROT * dt; if (k.ArrowRight) game.yaw -= ROT * dt;
  // a tapped key still moves: the queued step is spent over a few frames so it animates
  const st = game.step; if (st && st.rot) { const r = Math.sign(st.rot) * Math.min(Math.abs(st.rot), ROT * dt * 2.5); game.yaw += r; st.rot -= r; if (Math.abs(st.rot) < 1e-3) st.rot = 0; }
  let mv = (k.ArrowUp ? 1 : 0) - (k.ArrowDown ? 1 : 0), sx = 0;
  if (!mv && st && st.mv) { const s = Math.sign(st.mv) * Math.min(Math.abs(st.mv), SPD * dt * 1.6); mv = s / (SPD * dt); st.mv -= s; if (Math.abs(st.mv) < 1e-3) st.mv = 0; }
  if (stick.id != null && (stick.dx || stick.dy)) { mv = Math.max(-1, Math.min(1, -stick.dy / 36)); sx = Math.max(-1, Math.min(1, stick.dx / 36)); }
  if (game.target) { // walking to a tapped point: turn toward it and go, stop when there
    const tx = game.target[0] - game.x, tz = game.target[1] - game.z, d = Math.hypot(tx, tz);
    game.marker.material.opacity *= .97;
    if (d < .9 || Math.abs(mv) > .05 || Math.abs(sx) > .05) { game.target = null; game.marker.material.opacity = 0; } else { const want = Math.atan2(-tx, -tz); let da = want - game.yaw; da = Math.atan2(Math.sin(da), Math.cos(da)); game.yaw += da * Math.min(1, dt * 6); mv = 1; }
  }
  const px0 = game.x, pz0 = game.z, autoWalk = !!game.target;
  if ((mv || sx) && !$('#shop').hidden) { $('#shop').hidden = true; insideEl.classList.remove('shopping'); }
  if (mv || sx) { game.x -= (Math.sin(game.yaw) * mv - Math.cos(game.yaw) * sx) * SPD * dt; game.z -= (Math.cos(game.yaw) * mv + Math.sin(game.yaw) * sx) * SPD * dt; game.bob += dt * 9; const sn = Math.floor(game.bob / Math.PI); if (sn !== game.stepN) { game.stepN = sn; step(); } }
  mv = mv || sx;
  game.x = Math.max(-5.2, Math.min(5.2, game.x)); game.z = Math.max(-7.2, Math.min(8, game.z));
  if (Math.abs(game.x) < 2.3 && game.z < -6.9) game.z = -6.9; // the counter desk is solid
  if (!game.trolley.taken) { const tg = game.trolley.g, ddx = game.x - tg.position.x, ddz = game.z - tg.position.z, dd = Math.hypot(ddx, ddz); if (dd < .75) { game.x = tg.position.x + ddx / dd * .75; game.z = tg.position.z + ddz / dd * .75; } } // the parked trolley is solid too
  // third person: the figure walks ahead, the camera follows behind and above, pitch and zoom from the drag
  if (game.trolley.taken) { const a = game.yaw + Math.PI, tx = game.x + Math.sin(a) * .62, tz = game.z + Math.cos(a) * .62; if (tx > 4.9) game.x -= tx - 4.9; if (tx < -4.9) game.x -= tx + 4.9; if (tz < -7.2) game.z -= tz + 7.2; if (tz > 8) game.z -= tz - 8; if (Math.abs(tx) < 2.4 && tz < -7.55) game.z -= tz + 7.55; }
  // auto-walk ends when you can't get closer (a rack or the trolley in the way), so it never walks in place
  if (autoWalk && game.target) { const moved = Math.hypot(game.x - px0, game.z - pz0); game.stuck = moved < SPD * dt * .3 ? (game.stuck || 0) + 1 : 0; if (game.stuck > 6) { game.target = null; game.stuck = 0; game.marker.material.opacity = 0; } }
  const rig = game.rig; rig.P.position.set(game.x, 0, game.z); if (game.trolley.taken) rig.P.rotation.y = game.yaw + Math.PI; else if (mv || sx) { const want = game.yaw + Math.PI + Math.atan2(sx, mv); let da = want - rig.P.rotation.y; da = Math.atan2(Math.sin(da), Math.cos(da)); rig.P.rotation.y += da * Math.min(1, dt * 12); }
  if (rig.mixer) { rig.mixer.update(dt); play(mv ? 'walk' : 'idle'); if (game.trolley.taken && rig.arms) for (const b of rig.arms) { const L = b.name.includes('Left'); b.rotation.set(-1, 0, L ? -1.4 : 1.4); } if (game.trolley.taken && rig.fore) for (const b of rig.fore) b.rotation.set(0, 0, 0); }
  const RA = rig.arms && rig.arms.find(b => !b.name.includes('Left')), RF = rig.fore && rig.fore.find(b => !b.name.includes('Left')), g = game.grab;
  if (RA && RF && (game.hand || g)) {
    const a = rig.P.rotation.y, T = V3.set(game.x + Math.sin(a) * .5 - Math.cos(a) * .2, 1.0, game.z + Math.cos(a) * .5 + Math.sin(a) * .2); let w = game.hand ? 1 : 0;
    if (g) { g.t = Math.min(1, g.t + dt / .9); const p = g.t, sm = x => x * x * (3 - 2 * x);
      if (g.kind === 'pick') { T.lerp(g.at, p < .45 ? sm(p / .45) : p < .6 ? 1 : 1 - sm((p - .6) / .4)); w = Math.min(1, p / .2); }
      else { T.lerp(g.at, sm(Math.min(1, p / .45))); w = p < .55 ? 1 : 1 - sm((p - .55) / .45); }
      if (g.kind !== 'cart' && p < .5) { const sd = Math.sign(g.at.x), want = g.at.x - sd * .75; if ((want - game.x) * sd > 0) game.x += (want - game.x) * Math.min(1, dt * 7); } // steps in to the shelf
      if (!g.fired && p >= .5) { g.fired = true; g.fn && g.fn(); }
      if (p >= 1) { game.grab = null; if (g.next) doAct(g.next); } }
    aimArm(RA, RF, T, w);
  }
  roll(game.trolley && game.trolley.taken && (mv || sx) ? 1 : 0);
  if (game.trolley && game.trolley.taken) { // rolls in front of the shopper, turning with it
    const tg = game.trolley.g, ang = rig.P.rotation.y; const tx = game.x + Math.sin(ang) * .62, tz = game.z + Math.cos(ang) * .62;
    tg.position.set(tx, 0, tz); tg.rotation.y = ang + Math.PI;
    if (mv) for (const w of tg.children) if (w.geometry && w.geometry.type === 'CylinderGeometry' && w.position.y < .1) w.rotation.y += dt * 6; // wheels spin
  }
  if (rig.sync) rig.sync();
  for (const id in rig.held) rig.held[id].visible = !!game.hand && game.hand.id === id;
  if (game.hand && rig.hand && rig.held[game.hand.id]) { const hm = rig.held[game.hand.id]; if (g && g.kind === 'pick' && !g.fired) hm.position.copy(g.at); else { rig.hand.getWorldPosition(hm.position); hm.position.y -= game.hand.id === 'tyre' ? .12 : .06; } hm.rotation.y = rig.P.rotation.y; }
  const d = game.zoom, ph = game.pitch, fx = -Math.sin(game.yaw), fz = -Math.cos(game.yaw);
  C3.position.set(game.x - fx * d * Math.cos(ph), 1.5 + d * Math.sin(ph) + Math.sin(game.bob) * .02 * (mv ? 1 : 0), game.z - fz * d * Math.cos(ph));
  game.fovKick = (game.fovKick || 0) + ((mv ? 1 : 0) - (game.fovKick || 0)) * Math.min(1, dt * 3); C3.fov = (scr.clientWidth < scr.clientHeight ? 74 : 72) + game.fovKick * 4; C3.updateProjectionMatrix();
  C3.position.x = Math.max(-6.6, Math.min(6.6, C3.position.x)); C3.position.z = Math.max(-8.6, Math.min(8.6, C3.position.z)); C3.position.y = Math.max(.6, Math.min(3.9, C3.position.y));
  C3.lookAt(game.x + fx * 1.5, scr.clientWidth < scr.clientHeight ? .9 : 1.2, game.z + fz * 1.5);
  // arrival shot: the camera starts in the car park, the doors part, it glides in and settles behind the shopper
  if (game.intro < 1) { game.intro = Math.min(1, game.intro + dt / 2.8); const e = 1 - Math.pow(1 - game.intro, 3), to = C3.position.clone();
    C3.position.set(0, 2.1, 15).lerp(to, e); V3.set(0, 1.5, 2).lerp(new THREE.Vector3(game.x + fx * 1.5, scr.clientWidth < scr.clientHeight ? .9 : 1.2, game.z + fz * 1.5), e); C3.lookAt(V3);
    if (game.intro >= 1) insideEl.classList.remove('intro'); }
  if (game.doors) { const want = game.intro < .7 || game.z > 6.6 ? 1 : 0; game.doorO = (game.doorO || 0) + (want - (game.doorO || 0)) * Math.min(1, dt * 3); game.doors.forEach((g, i) => g.position.x = (i ? 1 : -1) * (.6 + game.doorO * 1.15)); }
  // what is in reach: the nearest point within 2.2 m
  let best = null, bd = 2.2;
  const pts = [...ITEMS.map(i => ({ id: i.id, at: i.at, item: i })), ...ZONES];
  // shelves are reachable along their whole length, not only at one point
  for (const p of pts) { const d = p.item && Math.abs(game.z) < 7.6 ? Math.abs(p.at[0] - game.x) : Math.hypot(p.at[0] - game.x, p.at[2] - game.z); if (d < bd) { bd = d; best = p; } }
  game.near = best;
  // the objective: the mission item on its shelf, or the counter once you hold it; the beacon and the edge arrow point there
  const needed = ITEMS.filter(i => game.need && game.need.has(i.id)).sort((a, b) => Math.hypot(a.at[0] - game.x, a.at[2] - game.z) - Math.hypot(b.at[0] - game.x, b.at[2] - game.z));
  const obj = !game.trolley.taken ? ZONES[2] : needed[0] || (game.basket.length ? ZONES[0] : ZONES[1]); game.obj = obj;
  game.beam.position.x = obj.at[0]; game.beam.position.z = obj.at[2]; game.beam.material.opacity = .25 + Math.sin(performance.now() / 300) * .1; game.beam.visible = !(best && best.id === obj.id);
  V3.set(obj.at[0], obj.at[1] + .8, obj.at[2]).project(C3);
  const arrow = $('#objArrow'), onScreen = V3.z < 1 && Math.abs(V3.x) < .95 && Math.abs(V3.y) < .95;
  arrow.hidden = onScreen || (best && best.id === obj.id);
  if (!arrow.hidden) { let ax = V3.x, ay = V3.y; if (V3.z > 1) { ax = -ax; ay = -ay; } const m = Math.max(Math.abs(ax), Math.abs(ay)) || 1; ax /= m; ay /= m; const w2 = scr.clientWidth, h2 = scr.clientHeight; arrow.style.left = (ax * .86 + 1) / 2 * w2 + 'px'; arrow.style.top = (1 - ay * .8) / 2 * h2 + 'px'; arrow.style.setProperty('--r', Math.atan2(-ay, ax) * 180 / Math.PI + 'deg'); arrow.querySelector('b').textContent = Math.round(Math.hypot(obj.at[0] - game.x, obj.at[2] - game.z)) + ' მ'; }
  const pr = $('#prompt3d');
  let acts = [];
  if (game.hand) acts = game.trolley.taken ? [['cart', 'ურიკაში ჩადე'], ['back', 'დადე უკან']] : [['back', 'დადე უკან'], ['need', 'ურიკა შესასვლელთანაა']];
  if (game.hand && rig.held[game.hand.id]) { const hm = rig.held[game.hand.id]; hm.rotation.y += dt * 1.2; } // the shopper turns the product in hand, looking at it
  else if (best) {
    if (best.item) acts = ITEMS.filter(i => Math.sign(i.at[0]) === Math.sign(best.at[0])).map(i => ['choose:' + i.id, `აირჩიე: ${i.shelf}`]);
    else if (best.id === 'trolley') acts = game.trolley.taken ? [] : [['take', 'აიღე ურიკა']];
    else if (best.id === 'counter') acts = game.basket.length ? [['pay', `გადაიხადე ${game.basket.reduce((s, i) => s + i.price, 0).toFixed(2)} ₾`]] : [['book', 'დაჯავშნა და სერვისები']];
    else acts = [['leave', 'ავტომობილთან დაბრუნება']];
  }
  const sig = acts.map(a => a[0]).join();
  if (pr.dataset.sig !== sig) { pr.dataset.sig = sig; pr.innerHTML = acts.map((a, i) => `<button type="button" data-a="${a[0]}" class="${i ? 'alt' : ''}">${a[1]}</button>`).join(''); }
  pr.hidden = !acts.length; game.acts = acts;
  pr.classList.toggle('ready', acts.length > 0 && (!!game.hand || bd < 1.6));
  if (acts.length && (k.Enter || k[' '] || k.e)) { k.Enter = k[' '] = k.e = false; doAct(acts[0][0]); }
  if (acts.length > 1 && k.Backspace) { k.Backspace = false; doAct(acts[1][0]); }
  // sprites bob, the one in reach glows; labels follow their points on screen
  const t = performance.now() / 1000;
  for (const id in sprites) { const s = sprites[id]; s.sp.position.y = (ITEMS.find(i => i.id === id)?.at[1] ?? 1.3) + .9 + Math.sin(t * 2 + s.sp.position.x) * .05; s.ring.material.opacity = (best && best.id === id) ? .9 : .4; s.sp.visible = true; }
  const w = scr.clientWidth, h = scr.clientHeight;
  $$('#labels3d .lb3').forEach(l => { const p = pts.find(x => x.id === l.dataset.id); if (p.id === 'trolley' && game.trolley.taken) { l.style.display = 'none'; return; } V3.set(p.at[0], p.at[1] + .75, p.at[2]).project(C3); const vis = V3.z < 1 && Math.abs(V3.x) < 1.1; l.style.display = vis ? '' : 'none'; l.style.left = (V3.x + 1) / 2 * w + 'px'; l.style.top = (1 - V3.y) / 2 * h + 'px'; l.classList.toggle('on', best && best.id === p.id); });
  // labels never sit on the shopper, on each other or under the HUD: lift them above the head, stack them, drop the ones that can't fit
  { const head = V3.set(game.x, 1.85, game.z).project(C3), hy = (1 - head.y) / 2 * h, hx = (head.x + 1) / 2 * w, fy = (1 - V3.set(game.x, 0, game.z).project(C3).y) / 2 * h, hw = (fy - hy) * .3 + 30;
    const sr = scr.getBoundingClientRect(), top = ($('.mission')?.getBoundingClientRect().bottom || 0) - sr.top + 8, placed = [];
    ['#toast', '#hand', '#basket'].forEach(q => { const e = $(q); if (!e || e.hidden) return; const r = e.getBoundingClientRect(); if (r.width) placed.push({ x: r.left - sr.left + r.width / 2, y: r.bottom - sr.top, w: r.width, h: r.height }); }); // HUD boxes count as taken space
    $$('#labels3d .lb3').filter(l => l.style.display !== 'none').sort((a, b) => b.classList.contains('on') - a.classList.contains('on')).forEach(l => {
      const lw = l.offsetWidth, lh = l.offsetHeight, x = Math.max(lw / 2 + 8, Math.min(w - lw / 2 - 8, parseFloat(l.style.left))); let y = parseFloat(l.style.top); l.style.left = x + 'px'; // never cut by the screen edge
      if (Math.abs(x - hx) < hw + lw / 2 && y > hy && y - lh < fy) y = hy - 6;
      for (const r of placed) if (Math.abs(x - r.x) < (lw + r.w) / 2 + 6 && Math.abs(y - r.y) < lh + 4) y = r.y - r.h - 6;
      if (y - lh < top || y > h - 150) { l.style.display = 'none'; return; }
      l.style.top = y + 'px'; placed.push({ x, y, w: lw, h: lh }); }); }
  if (game.mirror) game.mirror.visible = !phone3d;
  R3.render(S3, C3);
}
function toast(m) { const t = $('#toast'); t.textContent = m; t.hidden = false;
  // sits just under the shopping list (any height), or low when a panel is open, so it never covers either
  const mr = $('.mission')?.getBoundingClientRect(), sh = !$('#shop').hidden; t.style.top = !sh && mr && mr.height ? mr.bottom - insideEl.getBoundingClientRect().top + 8 + 'px' : ''; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 2600); }
function doAct(a) {
  const p = game.near;
  if (a === 'take') { sfx('take'); game.trolley.taken = true; sprites.trolleyRing.ring.visible = false; game.need = new Set(ITEMS.map(i => i.id)); toast('ურიკა შენია, სიაში სამი ნივთია'); setMission(); }
  else if (a.startsWith('choose:')) { shelf('pick:' + a.slice(7)); $('#shop').hidden = false; insideEl.classList.add('shopping'); }
  else if (a === 'back' && game.hand) { if (game.grab) { game.grab.next = 'back'; return; } $('#hand').hidden = true; game.grab = { kind: 'back', t: 0, at: shelfPoint(game.hand.id), fn: () => { game.hand = null; sfx('back'); toast('დადე უკან თაროზე'); } }; }
  else if (a === 'need') toast('ურიკა შესასვლელთან დგას');
  else if (a === 'cart' && game.hand && game.trolley.taken) { if (game.grab) { game.grab.next = 'cart'; return; } $('#hand').hidden = true; game.grab = { kind: 'cart', t: 0, at: game.trolley.g.position.clone().setY(.95), fn: () => { sfx('cart'); toCart(game.hand); } }; }
  else if (a === 'pay' && game.basket.length) {
    const sum = game.basket.reduce((s, i) => s + i.price, 0); game.pts += Math.round(sum); game.paid = (game.paid || 0) + game.basket.length; game.receipt = game.basket.slice(); game.basket = []; $('#basket').hidden = true;
    game.trolley.cargo.clear();
    sfx('pay'); if (game.posScr) { game.posScr.material.color.set(0x34d27b); setTimeout(() => game.posScr.material.color.set(0x5fb4ff), 2500); } setMission(); shelf('checkout'); $('#shop').hidden = false; insideEl.classList.add('shopping'); toast(`+${Math.round(sum)} PLUS ქულა`);
  }
  else if (a === 'book') { shelf('book'); $('#shop').hidden = false; insideEl.classList.add('shopping'); }
  else if (a === 'leave') leave();
}
function toCart(it) {
  game.basket.push(it); game.hand = null; $('#hand').hidden = true;
  const n0 = $('#cartN'); n0.textContent = +n0.textContent + 1; n0.classList.add('bump'); setTimeout(() => n0.classList.remove('bump'), 300);
  const src = game.rig.held[it.id], cl = src.clone(); cl.visible = true; const n = game.trolley.cargo.children.length; cl.position.set((n % 2 ? .13 : -.13), .08 + Math.floor(n / 2) * .16, (n % 3 - 1) * .22); cl.rotation.set(0, Math.random(), it.id === 'tyre' ? Math.PI / 2 : 0); cl.scale.setScalar(it.id === 'tyre' ? .55 : .9); game.trolley.cargo.add(cl);
  $('#basketN').textContent = game.basket.length; $('#basket').hidden = false;
  toast(`ურიკაშია: ${it.name}`); game.need.delete(it.id); setMission();
}
function pickProduct(type, i) {
  const base = ITEMS.find(x => x.id === type), [name, price] = CATALOG[type][i];
  game.hand = { id: type, name, price, ic: base.ic, url: base.url, spec: SPEC[type][i] }; $('#hand').hidden = false; $('#handImg').src = ic(base.ic); $('#handTx').innerHTML = `<b>${name}</b><br>${SPEC[type][i]}<br><span class="num">${price.toFixed(2)} ₾</span>`;
  game.grab = { kind: 'pick', t: 0, at: shelfPoint(type), fn: () => sfx('pick') };
  closeShop(); toast('აიღე. ჩადე ურიკაში ან დადე უკან');
}
$('#prompt3d').addEventListener('pointerdown', e => { const b = e.target.closest('button'); if (b) { e.preventDefault(); doAct(b.dataset.a); } });
function setMission() {
  // a shopping list, in any order: whatever you put in the trolley is crossed off
  const NAMES = { oil: 'ზეთი', batt: 'აკუმულატორი', tyre: 'საბურავი' }, need = game.need || new Set();
  const m = !game.trolley || !game.trolley.taken ? 'აიღე ურიკა შესასვლელთან' : need.size ? 'საყიდლები: ' + [...need].map(id => NAMES[id]).join(', ') : game.basket.length ? 'სია შევსებულია, გადაიხადე სალაროსთან' : '';
  $('#missionTx').textContent = m || 'ყველაფერი ნაყიდია, მადლობა';
  insideEl.classList.toggle('won', !m && !!game.paid);
}
let loop3d = 0, last3d = 0;
let frames3d = 0;
function frame3d(ts) { if (!inside || !game.on) return; const dt = Math.min(.05, (ts - last3d) / 1000 || 0); last3d = ts; try { update3d(dt); } catch (e) { showErr(e); return; }
  if (frames3d % 60 === 0 && inside && !document.body.classList.contains('fs')) setFs(true);
  if (++frames3d % 60 === 0) { const cw = scr.clientWidth, ch = scr.clientHeight; if (cw > 1 && ch > 1 && (R3.domElement.width !== Math.round(cw * R3.getPixelRatio()) || R3.domElement.height !== Math.round(ch * R3.getPixelRatio()))) { R3.setSize(cw, ch, false); C3.aspect = cw / ch; C3.updateProjectionMatrix(); } } // heal a canvas sized while hidden, without touching the camera settings
  if (frames3d === 2) insideEl.classList.add('rendered');
  loop3d = requestAnimationFrame(frame3d); }
function showErr(e) { const t = $('#toast'); t.hidden = false; t.style.whiteSpace = 'normal'; t.textContent = 'შეცდომა: ' + (e && e.message || e); t.dataset.stack = (e && e.stack || '').slice(0, 600); console.error(e); }
// touch like Roblox: a thumb on the left half is a joystick that walks, a thumb on the right half looks around, two fingers pinch to zoom; a tap on a shelf walks there
function moveStick(e) { let dx = e.clientX - stick.x0, dy = e.clientY - stick.y0; const d = Math.hypot(dx, dy), R = 40; if (d > R) { dx *= R / d; dy *= R / d; } stick.dx = dx; stick.dy = dy; $('#stick i').style.transform = `translate(${dx}px,${dy}px)`; }
const cv3 = $('#store3d'), touches = {}, stick = { id: null, x0: 0, y0: 0, dx: 0, dy: 0 }, look = { id: null, x: 0, y: 0, moved: 0 };
cv3.addEventListener('pointerdown', e => { if (game.intro < 1) game.intro = Math.max(game.intro, .8);
  $('#touchHint').hidden = true;
  touches[e.pointerId] = [e.clientX, e.clientY]; try { cv3.setPointerCapture(e.pointerId); } catch (x) {}
  // the joystick is fixed bottom-left (like mobile games); a thumb on or near it steers, measured from its centre
  const sr = $('#stick').getBoundingClientRect(), onStick = sr.width > 0 && e.clientX > sr.left - 36 && e.clientX < sr.right + 36 && e.clientY > sr.top - 36 && e.clientY < sr.bottom + 36;
  if (onStick && stick.id == null) { Object.assign(stick, { id: e.pointerId, x0: sr.left + sr.width / 2, y0: sr.top + sr.height / 2, dx: 0, dy: 0 }); $('#stick').classList.add('on'); moveStick(e); game.target = null; }
  else if (look.id == null) Object.assign(look, { id: e.pointerId, x: e.clientX, y: e.clientY, moved: 0 });
});
cv3.addEventListener('pointermove', e => {
  if (!touches[e.pointerId]) return; touches[e.pointerId] = [e.clientX, e.clientY];
  if (e.pointerId === stick.id) { moveStick(e); return; }
  const ids = Object.keys(touches).filter(i => +i !== stick.id);
  if (ids.length >= 2) { const [a, b] = ids.map(i => touches[i]); const dist = Math.hypot(a[0] - b[0], a[1] - b[1]); if (game.pinch) game.zoom = Math.max(1.4, Math.min(5, game.zoom * game.pinch / dist)); game.pinch = dist; look.moved = 99; return; }
  if (e.pointerId === look.id) {
    const ddx = e.clientX - look.x, ddy = e.clientY - look.y; look.moved += Math.abs(ddx) + Math.abs(ddy);
    game.yaw -= ddx * .006; game.pitch = Math.max(-.15, Math.min(.9, game.pitch + ddy * .004)); look.x = e.clientX; look.y = e.clientY;
  }
});
['pointerup', 'pointercancel'].forEach(t => cv3.addEventListener(t, e => {
  delete touches[e.pointerId]; game.pinch = null;
  if (e.pointerId === stick.id) { stick.id = null; stick.dx = stick.dy = 0; $('#stick').classList.remove('on'); $('#stick i').style.transform = ''; }
  if (e.pointerId === look.id) { if (look.moved < 8) tapWalk(e); look.id = null; }
}));
cv3.addEventListener('wheel', e => { e.preventDefault(); game.zoom = Math.max(1.4, Math.min(5, game.zoom + e.deltaY * .004)); }, { passive: false });
// a tap on a label or near a shelf point sets a walking target; the shopper walks there on its own
function tapWalk(e) {
  const r = cv3.getBoundingClientRect(), px = (e.clientX - r.left) / r.width * 2 - 1, py = -((e.clientY - r.top) / r.height * 2 - 1);
  const pts = [...ITEMS.map(i => ({ id: i.id, at: i.at })), ...ZONES]; let best = null, bd = .22;
  for (const p of pts) { V3.set(p.at[0], p.at[1], p.at[2]).project(C3); if (V3.z < 1) { const d = Math.hypot(V3.x - px, V3.y - py); if (d < bd) { bd = d; best = p; } } }
  if (best) { game.target = [best.at[0], best.at[2]]; return; }
  // no point under the finger: walk to the spot on the floor that was tapped
  const ray = new THREE.Raycaster(); ray.setFromCamera({ x: px, y: py }, C3);
  const hit = new THREE.Vector3(); if (ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit)) { game.target = [Math.max(-5.6, Math.min(5.6, hit.x)), Math.max(-7.2, Math.min(8, hit.z))]; game.marker.position.set(game.target[0], .02, game.target[1]); game.marker.material.opacity = .9; }
}
$('#labels3d').addEventListener('pointerup', e => { if (e.target.closest('.obj-arrow') && game.obj) { e.stopPropagation(); game.step = null; game.target = [game.obj.at[0], game.obj.at[2]]; return; } const l = e.target.closest('.lb3'); if (!l) return; e.stopPropagation(); const p = [...ITEMS, ...ZONES].find(x => x.id === l.dataset.id); if (p) { game.target = [p.at[0], p.at[2]]; wake3d(); } });
function wake3d() { /* the loop runs while inside; nothing to wake */ }
// straight into the store: a short blink, as if stepping out of the car
function getOut() { if (game.out) return; game.out = true; if (!getOut.shown) { getOut.shown = true; $('#touchHint').hidden = false; setTimeout(() => { $('#touchHint').hidden = true; }, 6000); } insideEl.classList.add('door'); setTimeout(() => insideEl.classList.remove('door'), 900); game.on = true; last3d = 0; loop3d = requestAnimationFrame(frame3d); }
function enter() { sfx('door');
  inside = true; drive.keys = {}; drive.v = 0; drive.cruise = false; game.out = false; game.on = false;
  scr.classList.add('entering'); render(); hud(0);
  setFs(true); document.body.classList.add('playing'); insideEl.classList.remove('rendered'); frames3d = 0;
  setTimeout(() => { scr.classList.add('in'); insideEl.setAttribute('aria-hidden', 'false'); $('#walk').hidden = true; try { if (!game.ready) build3d(); size3d(); } catch (e) { showErr(e); } game.intro = 0; insideEl.classList.add('intro'); Object.assign(game, { x: 0, z: 5.2, yaw: .35, hand: null, basket: [], need: new Set(ITEMS.map(i => i.id)) }); if (game.rig) game.rig.P.rotation.y = game.yaw + Math.PI; if (game.trolley) { game.trolley.taken = false; game.trolley.g.position.set(-1.6, 0, 3.4); game.trolley.g.rotation.y = Math.PI; game.trolley.cargo.clear(); sprites.trolleyRing.ring.visible = true; } $('#basket').hidden = true; $('#hand').hidden = true; setMission(); getOut(); }, 700);
// one button swaps the shopper; it shows the one you'd switch to
const swapBtn = $('#swapChar'), paintSwap = () => { const o = game.char === 'b' ? 'a' : 'b'; swapBtn.querySelector('img').src = `img/char-${o}.png`; };
swapBtn.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); setCharacter(game.char === 'b' ? 'a' : 'b'); paintSwap(); }); paintSwap();
}
function leave() { roll(0);
  inside = false; game.on = false; cancelAnimationFrame(loop3d); document.body.classList.remove('playing');
  scr.classList.remove('in', 'entering'); insideEl.setAttribute('aria-hidden', 'true'); $('#shop').hidden = true; insideEl.classList.remove('shopping');
  Object.assign(drive, { v: 0, pos: 0, x: 0, steer: 0, keys: {}, running: false, idle: 0, cruise: false });
  render(); hud(0);
}
$('#exitBtn').onclick = leave;
$('#hintClose').onclick = () => { $('#touchHint').hidden = true; };
const closeShop = () => { $('#shop').hidden = true; insideEl.classList.remove('shopping'); };
$('#shopClose').onclick = closeShop;
// Enter and space also act, so no one has to guess the key
addEventListener('keydown', () => { if (inside && game.intro < 1) game.intro = Math.max(game.intro, .8); });
addEventListener('keydown', e => { if (inside && ['Enter', ' ', 'Backspace', 'e', 'E'].includes(e.key)) { drive.keys[e.key.length === 1 && e.key !== ' ' ? e.key.toLowerCase() : e.key] = true; e.preventDefault(); } });
addEventListener('keydown', e => { if (e.key === 'Escape' && inside) { if (!$('#shop').hidden) closeShop(); else leave(); } });
addEventListener('resize', size3d);
// Shop panels: offers you can put in the cart, every category on the shelves, booking at the counter
const SHOP_TABS = [['deal', 'აქცია'], ...GROUPS2];
$('#shopCats').innerHTML = SHOP_TABS.map(g => `<button type="button" data-g="${g[0]}">${g[1]}</button>`).join('');
function shelf(g) {
  $$('#shopCats button').forEach(x => x.classList.toggle('on', x.dataset.g === g));
  $('#shopCats').hidden = g === 'book' || g === 'checkout';
  if (g === 'checkout') $('#cartSum').innerHTML = `გადახდილია <b class="num">${game.receipt.reduce((s, i) => s + i.price, 0).toFixed(2)} ₾</b>`;
  if (g.startsWith('pick:')) { const type = g.slice(5), it = ITEMS.find(x => x.id === type); $('#shopCats').hidden = true; $('#shopItems').innerHTML = `<p class="co-h">${it.shelf}: აირჩიე</p>` + CATALOG[type].map((p, i) => `<div class="si"><img src="${ic(it.ic)}" alt=""><span><b>${p[0]}</b><em class="num">${p[1].toFixed(2)} ₾</em><small>${SPEC[type][i]}</small></span><button type="button" class="pick-btn" data-t="${type}" data-i="${i}">აიღე</button></div>`).join(''); return; }
  $('#shopItems').innerHTML = g === 'checkout'
    ? `<p class="co-h">შენი კალათა რეალურ მაღაზიაშიც გელოდება</p>` + game.receipt.map(i => `<a class="si" href="${i.url}"><img src="${ic(i.ic)}" alt=""><span><b>${i.name}</b><em class="num">${i.price.toFixed(2)} ₾</em></span><i class="go"></i></a>`).join('') + `<p class="co-t">სულ <b class="num">${game.receipt.reduce((s, i) => s + i.price, 0).toFixed(2)} ₾</b>, მიტანა თბილისში უფასოა</p>`
    : g === 'book'
    ? `<a class="si" href="https://reservation.tegetamotors.ge/"><img src="${ic('calendar')}" alt=""><span><b>ვიზიტის დაჯავშნა</b><em>აირჩიე ფილიალი, დღე და საათი</em></span></a>` + SERVICES.map((s, i) => `<a class="si" href="${TM}${s[1]}"><img src="${ic(SVC_IC[i])}" alt=""><span><b>${s[0]}</b><em>სერვისი</em></span></a>`).join('')
    : g === 'deal'
    ? PRODUCTS.slice(0, 4).map((p, i) => `<div class="si"><img src="${ic(p[4])}" alt=""><span><small>${p[0]}</small><b>${p[1]}</b><em class="num">${p[3].toFixed(2)} ₾${p[2] ? ` <s>${p[2].toFixed(2)} ₾</s>` : ''}</em></span><button type="button" class="orb-btn add${cartItems[i] ? ' done' : ''}" data-i="${i}" aria-label="კალათაში დამატება">${svg(cartItems[i] ? 'check' : 'bag')}</button></div>`).join('')
    : CATS.filter(c => c[0] === g).map(c => `<a class="si" href="${SHOP}${c[4]}/products"><img src="${ic(c[1])}" alt=""><span><b>${c[2]}</b><em>${num(c[3])} პროდუქტი</em></span></a>`).join('');
}
$('#shopCats').onclick = e => { const b = e.target.closest('button'); if (b) shelf(b.dataset.g); };
$('#shopItems').onclick = e => { const pk = e.target.closest('.pick-btn'); if (pk) return pickProduct(pk.dataset.t, +pk.dataset.i); const b = e.target.closest('.add'); if (b) addToCart(+b.dataset.i); };
addEventListener('keydown', e => { if (e.key === 'Escape' && inside) { if (!$('#shop').hidden) closeShop(); else leave(); } });

// Road on the left: a small car drives down as the page scrolls; lane markings slide under it
const mini = $('.mini'), road = $('.road'), lane = $('.lane'), bar = $('.progress'), secs = $$('.sec'), navLinks = $$('.links a');
function onScroll() {
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight, p = max ? y / max : 0;
  nav.classList.toggle('solid', y > 40);
  bar.style.setProperty('--p', p);
  mini.style.setProperty('--my', p * (road.clientHeight - 40) + 'px');
  mini.style.setProperty('--mr', Math.sin(y / 260) * 8 + 'deg');
  lane.style.setProperty('--lane', y * .6 + 'px');
  let cur = ''; secs.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * .4) cur = s.id; });
  navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + cur));
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Reveal once in view; content below the fold is visible even if this never fires
const io = new IntersectionObserver(en => en.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
$$('.rv').forEach((el, i) => { if (el.getBoundingClientRect().top > innerHeight) { el.style.animationDelay = (i % 4) * 70 + 'ms'; io.observe(el); } });

// Cluster clock: Tbilisi date and time
function clock() {
  const now = new Date(), tz = { timeZone: 'Asia/Tbilisi' };
  $('#clk').textContent = now.toLocaleTimeString('en-GB', { ...tz, hour: '2-digit', minute: '2-digit' });
  const [d, m] = now.toLocaleDateString('en-GB', { ...tz, day: 'numeric', month: 'numeric' }).split('/');
  $('#clkDate').textContent = `${d} ${['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'][m - 1]}`;
}
clock(); setInterval(clock, 10000);

sizeRoad(); addEventListener('resize', sizeRoad); addEventListener('load', sizeRoad); document.addEventListener('visibilitychange', () => { if (!document.hidden) sizeRoad(); });

// Fullscreen: the game screen takes the whole display, like a TV; the pad stays on top on phones
function setFs(on) { document.body.classList.toggle('fs', on); $('#fsBtn').classList.toggle('on', on); setTimeout(() => { sizeRoad(); size3d(); render(); if (on) scr.scrollIntoView(); }, 60); }
$('#fsBtn').onclick = e => { if (e.detail === 0 && inside) return; setFs(!document.body.classList.contains('fs')); }; // keyboard Enter never toggles it while playing
$('#fsBtn').addEventListener('keydown', e => { if (inside) e.preventDefault(); });
addEventListener('keydown', e => { if (e.key === 'f' || e.key === 'F') $('#fsBtn').click(); });
setFs(true); // the game opens full screen; the corner button takes you back to the page

// #store opens the page already inside the shop (handy for sharing and testing)
if (location.hash === '#store' || location.hash === '#shop') setTimeout(() => { drive.pos = TRACK; enter(); if (location.hash === '#shop') setTimeout(() => { shelf('deal'); $('#shop').hidden = false; insideEl.classList.add('shopping'); }, 1200); }, 300);

// build the store while the page is idle, so entering is instant
if (window.THREE) setTimeout(() => { try { if (!game.ready) { build3d(); size3d(); } } catch (e) { showErr(e); } }, 1500);
else addEventListener('load', () => { if (!window.THREE) showErr('3D ბიბლიოთეკა ვერ ჩაიტვირთა'); });

// opening page: plays once on load, a tap or key goes straight in
{ const sp = $('#splash'); if (sp) { const go = () => { sp.classList.add('out'); setTimeout(() => sp.remove(), 800); }; const t = setTimeout(go, 2900); sp.addEventListener('pointerdown', () => { clearTimeout(t); go(); }); addEventListener('keydown', () => { clearTimeout(t); go(); }, { once: true }); } }
