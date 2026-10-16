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
  if (inside) { drive.keys[k] = down; if (down && !game.out) { if (k === 'ArrowUp') getOut(); } return true; }
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
const game = { on: false, out: false, basket: [], acts: [], target: null, yaw: 0, pitch: .18, zoom: 2.8, x: 0, z: 7, hand: null, mission: 0, pts: 0, bob: 0, drag: null, near: null, ready: false, rig: null };
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
  wall('img/counter.jpg', 1, .62, .2, W, H, [0, H / 2, -D / 2], 0);
  wall('img/garage.jpg', 1, .62, .2, W, H, [0, H / 2, D / 2], Math.PI);
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
  // tyres on the left: standing in rows, rubber with a lighter sidewall ring
  const rubber = new THREE.MeshStandardMaterial({ color: 0x15181b, roughness: .55, metalness: .05 }), rim = new THREE.MeshStandardMaterial({ color: 0x8e99a4, roughness: .35, metalness: .8 });
  const tyres = inst(new THREE.TorusGeometry(.3, .11, 7, 16), rubber, 320), hubs = inst(new THREE.CylinderGeometry(.19, .19, .2, 10), rim, 320);
  shelfUnit(-1, -8, 16, [.55, 1.45, 2.35, 3.25], (i, x, y, z0, len) => { for (let z = z0 + .35; z < z0 + len - .3; z += .25) { put(tyres, x, y + .41, z, 0); put(hubs, x, y + .41, z, 0, Math.PI / 2); } }); // tread toward the aisle, packed like the real rack
  // oils and batteries on the right
  const oilLab = label(['SYNTIUM', '5W-30'], '#1c242b', '#ffffff'), battLab = label(['VARTA', 'BLUE DYNAMIC'], '#1b4fa0', '#ffffff');
  // real brand marks drawn onto the labels once the SVGs load
  const brandOn = (tex, src, x, y, w, h) => { const im = new Image(); im.onload = () => { const c = tex.image, cx = c.getContext('2d'); cx.drawImage(im, x, y, w, h); tex.needsUpdate = true; }; im.src = src; };
  brandOn(oilLab, 'img/brands/petronas.svg', 8, 6, 60, 44);
  // tyre brands on a sign along the rack
  ['bridgestone', 'continental', 'pirelli'].forEach((b, i) => { const im = new Image(); im.onload = () => { const c = document.createElement('canvas'); c.width = 512; c.height = 128; const x = c.getContext('2d'); x.fillStyle = '#121a21'; x.fillRect(0, 0, 512, 128); x.fillStyle = '#fff'; x.fillRect(0, 118, 512, 10); x.fillStyle = '#fdb913'; x.fillRect(0, 118, 512, 4); const s = Math.min(420 / im.width, 80 / im.height); x.drawImage(im, 256 - im.width * s / 2, 64 - im.height * s / 2, im.width * s, im.height * s); const t = new THREE.CanvasTexture(c); const m = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 1.15), new THREE.MeshBasicMaterial({ map: t })); m.position.set(-W / 2 + .12, 3.75, -5.3 + i * 5.3); m.rotation.y = Math.PI / 2; S3.add(m); }; im.src = `img/brands/${b}.svg`; });
  const canMat = new THREE.MeshStandardMaterial({ color: 0x2b333a, roughness: .45, metalness: .15, emissive: 0x0d1216, emissiveIntensity: .5 }), capMat = new THREE.MeshStandardMaterial({ color: 0xfdb913, roughness: .35 });
  const cans = inst(new THREE.BoxGeometry(.19, .3, .13, 1, 1, 1), canMat, 160), caps = inst(new THREE.CylinderGeometry(.04, .04, .05, 6), capMat, 160), canLabels = inst(new THREE.PlaneGeometry(.17, .11), new THREE.MeshBasicMaterial({ map: oilLab }), 160);
  const battMat = new THREE.MeshStandardMaterial({ color: 0x2b3136, roughness: .6, emissive: 0x101418, emissiveIntensity: .4 }), batts = inst(new THREE.BoxGeometry(.34, .2, .2), battMat, 80), battTops = inst(new THREE.BoxGeometry(.34, .02, .2), new THREE.MeshStandardMaterial({ color: 0x1b4fa0, roughness: .5 }), 80), battLabels = inst(new THREE.PlaneGeometry(.3, .11), new THREE.MeshBasicMaterial({ map: battLab }), 80), poles = inst(new THREE.CylinderGeometry(.02, .02, .03, 5), rim, 160);
  shelfUnit(1, -8, 16, [.55, 1.35, 2.15, 2.95], (i, x, y, z0, len) => {
    if (i >= 2) for (let z = z0 + .3; z < z0 + len - .2; z += .24) { put(cans, x + .15, y + .15, z); put(caps, x + .15, y + .325, z - .035); put(canLabels, x + .15 - .066, y + .15, z, -Math.PI / 2); }
    else for (let z = z0 + .35; z < z0 + len - .3; z += .42) { put(batts, x + .1, y + .1, z); put(battTops, x + .1, y + .21, z); put(poles, x + .1, y + .235, z - .12); put(poles, x + .1, y + .235, z + .12); put(battLabels, x + .1 - .101, y + .1, z, -Math.PI / 2); }
  });
  [tyres, hubs, cans, caps, canLabels, batts, battTops, battLabels, poles].forEach(m => m.instanceMatrix.needsUpdate = true);
  // the same products as single meshes, to carry in the hand
  const heldOil = new THREE.Group(); heldOil.add(new THREE.Mesh(cans.geometry, canMat)); const hc = new THREE.Mesh(caps.geometry, capMat); hc.position.set(0, .17, -.03); heldOil.add(hc); const hl = new THREE.Mesh(canLabels.geometry, canLabels.material); hl.position.z = .066; heldOil.add(hl);
  const heldBatt = new THREE.Group(); heldBatt.add(new THREE.Mesh(batts.geometry, battMat)); const bt = new THREE.Mesh(battTops.geometry, battTops.material); bt.position.y = .11; heldBatt.add(bt); const bl = new THREE.Mesh(battLabels.geometry, battLabels.material); bl.position.z = .101; heldBatt.add(bl);
  const heldTyre = new THREE.Group(); heldTyre.add(new THREE.Mesh(tyres.geometry, rubber)); const hh = new THREE.Mesh(hubs.geometry, rim); hh.rotation.x = Math.PI / 2; heldTyre.add(hh); heldTyre.scale.setScalar(.8);
  [heldOil, heldBatt, heldTyre].forEach(g => { g.visible = false; S3.add(g); }); game.heldMeshes = { oil: heldOil, batt: heldBatt, tyre: heldTyre };
  // the shopping trolley: parked by the entrance until you take it, then it rolls in front of you
  const trolley = new THREE.Group(), chrome = new THREE.MeshStandardMaterial({ color: 0xb8c2cc, roughness: .3, metalness: .9 });
  const tub = new THREE.Mesh(new THREE.BoxGeometry(.56, .42, .82), new THREE.MeshStandardMaterial({ color: 0x9fb0bf, roughness: .35, metalness: .6, transparent: true, opacity: .35 })); tub.position.set(0, .66, 0); trolley.add(tub);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(tub.geometry), new THREE.LineBasicMaterial({ color: 0xdfe7ee })); edges.position.copy(tub.position); trolley.add(edges);
  for (let i = 0; i < 4; i++) { const bar = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, .42, 8), chrome); bar.position.set(i % 2 ? .28 : -.28, .66, i < 2 ? .41 : -.41); trolley.add(bar); }
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, .6, 10), chrome); handle.rotation.z = Math.PI / 2; handle.position.set(0, .98, .5); trolley.add(handle);
  [[-.28, .5], [.28, .5]].forEach(p => { const st = new THREE.Mesh(new THREE.CylinderGeometry(.014, .014, .55, 8), chrome); st.position.set(p[0], .7, p[1]); st.rotation.x = -.25; trolley.add(st); });
  const base = new THREE.Mesh(new THREE.BoxGeometry(.5, .03, .76), chrome); base.position.y = .18; trolley.add(base);
  [[-.24, .34], [.24, .34], [-.24, -.34], [.24, -.34]].forEach(p => { const w = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, .04, 14), new THREE.MeshStandardMaterial({ color: 0x1a2128, roughness: .7 })); w.rotation.z = Math.PI / 2; w.position.set(p[0], .06, p[1]); trolley.add(w); });
  const strip = new THREE.Mesh(new THREE.BoxGeometry(.58, .03, .02), new THREE.MeshBasicMaterial({ color: 0xfdb913 })); strip.position.set(0, .88, .42); trolley.add(strip);
  const cargo = new THREE.Group(); cargo.position.set(0, .5, 0); trolley.add(cargo);
  trolley.position.set(-1.6, 0, 3.4); trolley.rotation.y = Math.PI; S3.add(trolley); game.trolley = { g: trolley, cargo, taken: false };
  // the counter: a real desk in front of the photo wall, with the yellow strip above
  const desk = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.05, .8), graphite); desk.position.set(0, .525, -8.1); S3.add(desk);
  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(4.3, .05, .9), plankMat); deskTop.position.set(0, 1.07, -8.1); S3.add(deskTop);
  const deskLed = new THREE.Mesh(new THREE.BoxGeometry(4.2, .02, .02), ledMat); deskLed.position.set(0, .06, -7.69); S3.add(deskLed);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshPhongMaterial({ color: 0x3a4a57, specular: 0x9fb8d0, shininess: 90 })); floor.rotation.x = -Math.PI / 2; S3.add(floor);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshLambertMaterial({ color: 0x15202a })); ceil.rotation.x = Math.PI / 2; ceil.position.y = H; S3.add(ceil);
  // ceiling: yellow light strips and cool lamps, like the cluster
  // round ceiling lamps in clusters, like the real Tegeta halls
  for (let z = -7; z <= 7; z += 3.5) for (let x = -4.5; x <= 4.5; x += 4.5) { const lamp = new THREE.Mesh(new THREE.CircleGeometry(.3, 20), new THREE.MeshBasicMaterial({ color: 0xc9d8e4 })); lamp.rotation.x = Math.PI / 2; lamp.position.set(x, H - .02, z); S3.add(lamp); }
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
  new THREE.GLTFLoader().parse(Uint8Array.from(atob(window.SHOPPER_B64 || ''), c => c.charCodeAt(0)).buffer, '', g => {
    const m = g.scene; m.scale.setScalar(1); m.traverse(o => { if (o.isMesh) { o.frustumCulled = false; const mat = o.material; if (/Joints/i.test(mat.name)) { mat.color.set(0xfdb913); mat.metalness = .3; mat.roughness = .5; } else { mat.color.set(0x1f2f3c); mat.metalness = .15; mat.roughness = .65; } } if (o.isBone && /RightHand$/.test(o.name)) game.rig.hand = o; if (o.isBone && /(Left|Right)Arm$/.test(o.name)) (game.rig.arms = game.rig.arms || []).push(o); if (o.isBone && /(Left|Right)ForeArm$/.test(o.name)) (game.rig.fore = game.rig.fore || []).push(o); });
    P.add(m); const mx = new THREE.AnimationMixer(m); game.rig.mixer = mx;
    g.animations.forEach(c => game.rig.clips[c.name] = mx.clipAction(c));
    play('idle');
  }, e => showErr('პერსონაჟი ვერ ჩაიტვირთა'));
  // mirror floor under the glossy one: the room reflects, like a polished showroom
  const mirror = new THREE.Reflector(new THREE.PlaneGeometry(W, D), { textureWidth: 512, textureHeight: 512, color: 0x5e7284, clipBias: .003 }); mirror.rotation.x = -Math.PI / 2; mirror.position.y = -.005; mirror.visible = !phone; S3.add(mirror); game.mirror = mirror;
  floor.material.transparent = true; floor.material.opacity = .72;
  // soft skirting: a dark gradient at the base of every wall, so photo and floor melt into each other instead of a hard seam
  const gc = document.createElement('canvas'); gc.width = 4; gc.height = 128; const gx = gc.getContext('2d'); const gg = gx.createLinearGradient(0, 0, 0, 128); gg.addColorStop(0, 'rgba(14,22,30,0)'); gg.addColorStop(.6, 'rgba(14,22,30,.18)'); gg.addColorStop(1, 'rgba(14,22,30,.5)'); gx.fillStyle = gg; gx.fillRect(0, 0, 4, 128);
  const skirtTex = new THREE.CanvasTexture(gc), skirt = (w, pos, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, .7), new THREE.MeshBasicMaterial({ map: skirtTex, transparent: true, depthWrite: false })); m.position.set(...pos); m.rotation.y = ry; S3.add(m); };
  skirt(W, [0, .35, -D / 2 + .02], 0); skirt(W, [0, .35, D / 2 - .02], Math.PI);
  // and a soft floor shadow along the walls
  const fs = (w, pos, rz) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 1.2), new THREE.MeshBasicMaterial({ map: skirtTex, transparent: true, depthWrite: false, opacity: .45 })); m.rotation.x = -Math.PI / 2; m.rotation.z = rz; m.position.set(...pos); S3.add(m); };
  fs(W, [0, .012, -D / 2 + .6], Math.PI); fs(W, [0, .012, D / 2 - .6], 0);
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
function play(name) { const r = game.rig; if (!r.mixer || r.cur === name) return; const a = r.clips[name]; if (!a) return; if (r.cur) r.clips[r.cur].fadeOut(.25); a.reset().fadeIn(.25).play(); r.cur = name; }
function size3d() { if (!R3) return; const w = scr.clientWidth, h = scr.clientHeight; R3.setSize(w, h, false); C3.aspect = w / h; C3.fov = w < h ? 74 : 72; C3.updateProjectionMatrix(); game.zoom = w < h ? 4.6 : 2.8; game.pitch = w < h ? .2 : .12; }
const V3 = new THREE.Vector3();
function update3d(dt) {
  const k = drive.keys, SPD = 3.2, ROT = 1.7;
  if (k.ArrowLeft) game.yaw += ROT * dt; if (k.ArrowRight) game.yaw -= ROT * dt;
  let mv = (k.ArrowUp ? 1 : 0) - (k.ArrowDown ? 1 : 0), sx = 0;
  if (stick.id != null && (stick.dx || stick.dy)) { mv = Math.max(-1, Math.min(1, -stick.dy / 36)); sx = Math.max(-1, Math.min(1, stick.dx / 36)); }
  if (game.target) { // walking to a tapped point: turn toward it and go, stop when there
    const tx = game.target[0] - game.x, tz = game.target[1] - game.z, d = Math.hypot(tx, tz);
    game.marker.material.opacity *= .97;
    if (d < .5 || mv || sx) { game.target = null; game.marker.material.opacity = 0; } else { const want = Math.atan2(-tx, -tz); let da = want - game.yaw; da = Math.atan2(Math.sin(da), Math.cos(da)); game.yaw += da * Math.min(1, dt * 6); mv = 1; }
  }
  if ((mv || sx) && !$('#shop').hidden) { $('#shop').hidden = true; insideEl.classList.remove('shopping'); }
  if (mv || sx) { game.x -= (Math.sin(game.yaw) * mv - Math.cos(game.yaw) * sx) * SPD * dt; game.z -= (Math.cos(game.yaw) * mv + Math.sin(game.yaw) * sx) * SPD * dt; game.bob += dt * 9; }
  mv = mv || sx;
  game.x = Math.max(-5.2, Math.min(5.2, game.x)); game.z = Math.max(-7.2, Math.min(8, game.z));
  if (Math.abs(game.x) < 2.3 && game.z < -6.9) game.z = -6.9; // the counter desk is solid
  // third person: the figure walks ahead, the camera follows behind and above, pitch and zoom from the drag
  const rig = game.rig; rig.P.position.set(game.x, 0, game.z); if (mv || sx) { const want = game.yaw + Math.PI + Math.atan2(sx, mv); let da = want - rig.P.rotation.y; da = Math.atan2(Math.sin(da), Math.cos(da)); rig.P.rotation.y += da * Math.min(1, dt * 12); }
  if (rig.mixer) { rig.mixer.update(dt); play(mv ? 'walk' : 'idle'); if (game.trolley.taken && rig.arms) for (const b of rig.arms) { const L = b.name.includes('Left'); b.rotation.set(-1, 0, L ? -1.4 : 1.4); } if (game.trolley.taken && rig.fore) for (const b of rig.fore) b.rotation.set(0, 0, 0); }
  if (game.trolley && game.trolley.taken) { // rolls in front of the shopper, turning with it
    const tg = game.trolley.g, ang = rig.P.rotation.y; const tx = game.x + Math.sin(ang) * .62, tz = game.z + Math.cos(ang) * .62;
    tg.position.x += (Math.max(-4.6, Math.min(4.6, tx)) - tg.position.x) * Math.min(1, dt * 8); tg.position.z += (Math.max(-6.6, Math.min(7.6, tz)) - tg.position.z) * Math.min(1, dt * 8); let da = ang + Math.PI - tg.rotation.y; da = Math.atan2(Math.sin(da), Math.cos(da)); tg.rotation.y += da * Math.min(1, dt * 8);
    if (mv) for (const w of tg.children) if (w.geometry && w.geometry.type === 'CylinderGeometry' && w.position.y < .1) w.rotation.y += dt * 6; // wheels spin
  }
  for (const id in rig.held) rig.held[id].visible = !!game.hand && game.hand.id === id;
  if (game.hand && rig.hand && rig.held[game.hand.id]) { const hm = rig.held[game.hand.id]; rig.hand.getWorldPosition(hm.position); hm.position.y += .1; hm.position.x += Math.sin(game.yaw + Math.PI) * .25; hm.position.z += Math.cos(game.yaw + Math.PI) * .25; if (game.hand.id === 'tyre') hm.position.y -= .1; }
  const d = game.zoom, ph = game.pitch, fx = -Math.sin(game.yaw), fz = -Math.cos(game.yaw);
  C3.position.set(game.x - fx * d * Math.cos(ph), 1.5 + d * Math.sin(ph) + Math.sin(game.bob) * .02 * (mv ? 1 : 0), game.z - fz * d * Math.cos(ph));
  C3.position.x = Math.max(-6.6, Math.min(6.6, C3.position.x)); C3.position.z = Math.max(-8.6, Math.min(8.6, C3.position.z)); C3.position.y = Math.max(.6, Math.min(3.9, C3.position.y));
  C3.lookAt(game.x + fx * 1.5, scr.clientWidth < scr.clientHeight ? .9 : 1.2, game.z + fz * 1.5);
  // what is in reach: the nearest point within 2.2 m
  let best = null, bd = 2.2;
  const pts = [...ITEMS.map(i => ({ id: i.id, at: i.at, item: i })), ...ZONES];
  for (const p of pts) { const d = Math.hypot(p.at[0] - game.x, p.at[2] - game.z); if (d < bd) { bd = d; best = p; } }
  game.near = best;
  // the objective: the mission item on its shelf, or the counter once you hold it; the beacon and the edge arrow point there
  const obj = !game.trolley.taken ? ZONES[2] : game.hand ? ZONES[0] : ITEMS[game.mission - 1] || (game.basket.length ? ZONES[0] : ZONES[1]);
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
    if (best.item) acts = [['choose', `აირჩიე: ${best.item.shelf}`]];
    else if (best.id === 'trolley') acts = game.trolley.taken ? [] : [['take', 'აიღე ურიკა']];
    else if (best.id === 'counter') acts = game.basket.length ? [['pay', `გადაიხადე ${game.basket.reduce((s, i) => s + i.price, 0).toFixed(2)} ₾`]] : [['book', 'დაჯავშნა და სერვისები']];
    else acts = [['leave', 'ავტომობილთან დაბრუნება']];
  }
  const sig = acts.map(a => a[0]).join();
  if (pr.dataset.sig !== sig) { pr.dataset.sig = sig; pr.innerHTML = acts.map((a, i) => `<button type="button" data-a="${a[0]}" class="${i ? 'alt' : ''}">${a[1]}</button>`).join(''); }
  pr.hidden = !acts.length; game.acts = acts;
  pr.classList.toggle('ready', acts.length > 0 && (!!game.hand || bd < 1.6));
  if (acts.length && (k.ArrowUp || k.Enter || k[' '])) { k.ArrowUp = k.Enter = k[' '] = false; doAct(acts[0][0]); }
  if (acts.length > 1 && k.Backspace) { k.Backspace = false; doAct(acts[1][0]); }
  // sprites bob, the one in reach glows; labels follow their points on screen
  const t = performance.now() / 1000;
  for (const id in sprites) { const s = sprites[id]; s.sp.position.y = (ITEMS.find(i => i.id === id)?.at[1] ?? 1.3) + .9 + Math.sin(t * 2 + s.sp.position.x) * .05; s.ring.material.opacity = (best && best.id === id) ? .9 : .4; s.sp.visible = true; }
  const w = scr.clientWidth, h = scr.clientHeight;
  $$('#labels3d .lb3').forEach(l => { const p = pts.find(x => x.id === l.dataset.id); if (p.id === 'trolley' && game.trolley.taken) { l.style.display = 'none'; return; } V3.set(p.at[0], p.at[1] + .75, p.at[2]).project(C3); const vis = V3.z < 1 && Math.abs(V3.x) < 1.1; l.style.display = vis ? '' : 'none'; l.style.left = (V3.x + 1) / 2 * w + 'px'; l.style.top = (1 - V3.y) / 2 * h + 'px'; l.classList.toggle('on', best && best.id === p.id); });
  if (game.mirror) game.mirror.visible = !phone3d;
  R3.render(S3, C3);
}
function toast(m) { const t = $('#toast'); t.textContent = m; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 2600); }
function doAct(a) {
  const p = game.near;
  if (a === 'take') { game.trolley.taken = true; sprites.trolleyRing.ring.visible = false; toast('ურიკა შენია, წადი თაროებთან'); if (game.mission === 0) game.mission = 1; setMission(); }
  else if (a === 'choose' && p && p.item) { shelf('pick:' + p.item.id); $('#shop').hidden = false; insideEl.classList.add('shopping'); }
  else if (a === 'back' && game.hand) { game.hand = null; $('#hand').hidden = true; toast('დადე უკან თაროზე'); }
  else if (a === 'need') toast('ურიკა შესასვლელთან დგას');
  else if (a === 'cart' && game.hand && game.trolley.taken) {
    const it = game.hand; game.basket.push(it); game.hand = null; $('#hand').hidden = true;
    const n0 = $('#cartN'); n0.textContent = +n0.textContent + 1; n0.classList.add('bump'); setTimeout(() => n0.classList.remove('bump'), 300);
    const src = game.rig.held[it.id], cl = src.clone(); cl.visible = true; const n = game.trolley.cargo.children.length; cl.position.set((n % 2 ? .13 : -.13), .08 + Math.floor(n / 2) * .16, (n % 3 - 1) * .22); cl.rotation.set(0, Math.random(), it.id === 'tyre' ? Math.PI / 2 : 0); cl.scale.setScalar(it.id === 'tyre' ? .55 : .9); game.trolley.cargo.add(cl);
    $('#basketN').textContent = game.basket.length; $('#basket').hidden = false;
    toast(`ურიკაშია: ${it.name}`); const mi = ITEMS[game.mission - 1]; if (mi && mi.id === it.id) game.mission++; setMission();
  }
  else if (a === 'pay' && game.basket.length) {
    const sum = game.basket.reduce((s, i) => s + i.price, 0); game.pts += Math.round(sum); game.paid = (game.paid || 0) + game.basket.length; game.receipt = game.basket.slice(); game.basket = []; $('#basket').hidden = true;
    game.trolley.cargo.clear();
    toast(`+${Math.round(sum)} PLUS ქულა`); setMission(); shelf('checkout'); $('#shop').hidden = false; insideEl.classList.add('shopping');
  }
  else if (a === 'book') { shelf('book'); $('#shop').hidden = false; insideEl.classList.add('shopping'); }
  else if (a === 'leave') leave();
}
function pickProduct(type, i) {
  const base = ITEMS.find(x => x.id === type), [name, price] = CATALOG[type][i];
  game.hand = { id: type, name, price, ic: base.ic, url: base.url, spec: SPEC[type][i] }; $('#hand').hidden = false; $('#handImg').src = ic(base.ic); $('#handTx').innerHTML = `<b>${name}</b><br>${SPEC[type][i]}<br><span class="num">${price.toFixed(2)} ₾</span>`;
  closeShop(); toast('აიღე. ჩადე ურიკაში ან დადე უკან');
}
$('#prompt3d').onclick = e => { const b = e.target.closest('button'); if (b) doAct(b.dataset.a); };
function setMission() {
  const m = game.mission === 0 ? { task: 'აიღე ურიკა შესასვლელთან' } : ITEMS[game.mission - 1];
  $('#missionTx').textContent = m ? m.task : game.basket.length ? 'მიდი დახლთან და გადაიხადე კალათა' : 'ყველა დავალება შესრულებულია';
  $('#missionPts').textContent = `${game.pts} PLUS ქულა`;
  insideEl.classList.toggle('won', !m && !game.basket.length && !!game.paid);
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
const cv3 = $('#store3d'), touches = {}, stick = { id: null, x0: 0, y0: 0, dx: 0, dy: 0 }, look = { id: null, x: 0, y: 0, moved: 0 };
cv3.addEventListener('pointerdown', e => {
  $('#touchHint').hidden = true; $('#keysHint').classList.remove('show');
  touches[e.pointerId] = [e.clientX, e.clientY]; try { cv3.setPointerCapture(e.pointerId); } catch (x) {}
  const r = cv3.getBoundingClientRect(), left = e.clientX - r.left < r.width * .45;
  if (e.pointerType !== 'mouse' && left && stick.id == null) { Object.assign(stick, { id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: 0, dy: 0 }); $('#stick').hidden = false; $('#stick').style.left = e.clientX - r.left + 'px'; $('#stick').style.top = e.clientY - r.top + 'px'; }
  else if (look.id == null) Object.assign(look, { id: e.pointerId, x: e.clientX, y: e.clientY, moved: 0 });
});
cv3.addEventListener('pointermove', e => {
  if (!touches[e.pointerId]) return; touches[e.pointerId] = [e.clientX, e.clientY];
  if (e.pointerId === stick.id) { stick.dx = Math.max(-60, Math.min(60, e.clientX - stick.x0)); stick.dy = Math.max(-60, Math.min(60, e.clientY - stick.y0)); $('#stick i').style.transform = `translate(${stick.dx}px,${stick.dy}px)`; return; }
  const ids = Object.keys(touches).filter(i => +i !== stick.id);
  if (ids.length >= 2) { const [a, b] = ids.map(i => touches[i]); const dist = Math.hypot(a[0] - b[0], a[1] - b[1]); if (game.pinch) game.zoom = Math.max(1.4, Math.min(5, game.zoom * game.pinch / dist)); game.pinch = dist; look.moved = 99; return; }
  if (e.pointerId === look.id) {
    const ddx = e.clientX - look.x, ddy = e.clientY - look.y; look.moved += Math.abs(ddx) + Math.abs(ddy);
    game.yaw -= ddx * .006; game.pitch = Math.max(-.15, Math.min(.9, game.pitch + ddy * .004)); look.x = e.clientX; look.y = e.clientY;
  }
});
['pointerup', 'pointercancel'].forEach(t => cv3.addEventListener(t, e => {
  delete touches[e.pointerId]; game.pinch = null;
  if (e.pointerId === stick.id) { stick.id = null; stick.dx = stick.dy = 0; $('#stick').hidden = true; $('#stick i').style.transform = ''; }
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
$('#labels3d').addEventListener('pointerup', e => { const l = e.target.closest('.lb3'); if (!l) return; e.stopPropagation(); const p = [...ITEMS, ...ZONES].find(x => x.id === l.dataset.id); if (p) { game.target = [p.at[0], p.at[2]]; wake3d(); } });
function wake3d() { /* the loop runs while inside; nothing to wake */ }
// straight into the store: a short blink, as if stepping out of the car
function getOut() { if (game.out) return; game.out = true; if (!getOut.shown) { getOut.shown = true; $('#touchHint').hidden = false; $('#keysHint').classList.add('show'); setTimeout(() => { $('#touchHint').hidden = true; $('#keysHint').classList.remove('show'); }, 6000); } insideEl.classList.add('door'); setTimeout(() => insideEl.classList.remove('door'), 900); game.on = true; last3d = 0; loop3d = requestAnimationFrame(frame3d); }
function enter() {
  inside = true; drive.keys = {}; drive.v = 0; drive.cruise = false; game.out = false; game.on = false;
  scr.classList.add('entering'); render(); hud(0);
  setFs(true); document.body.classList.add('playing'); insideEl.classList.remove('rendered'); frames3d = 0;
  setTimeout(() => { scr.classList.add('in'); insideEl.setAttribute('aria-hidden', 'false'); $('#walk').hidden = true; try { if (!game.ready) build3d(); size3d(); } catch (e) { showErr(e); } Object.assign(game, { x: 0, z: 5.2, yaw: .35, hand: null, basket: [], mission: 0 }); if (game.trolley) { game.trolley.taken = false; game.trolley.g.position.set(-1.6, 0, 3.4); game.trolley.g.rotation.y = Math.PI; game.trolley.cargo.clear(); sprites.trolleyRing.ring.visible = true; } $('#basket').hidden = true; $('#hand').hidden = true; setMission(); getOut(); }, 700);
}
function leave() {
  inside = false; game.on = false; cancelAnimationFrame(loop3d); setFs(false); document.body.classList.remove('playing');
  scr.classList.remove('in', 'entering'); insideEl.setAttribute('aria-hidden', 'true'); $('#shop').hidden = true; insideEl.classList.remove('shopping');
  Object.assign(drive, { v: 0, pos: 0, x: 0, steer: 0, keys: {}, running: false, idle: 0, cruise: false });
  render(); hud(0);
}
$('#exitBtn').onclick = leave;
$('#hintClose').onclick = () => { $('#touchHint').hidden = true; };
const closeShop = () => { $('#shop').hidden = true; insideEl.classList.remove('shopping'); };
$('#shopClose').onclick = closeShop;
// Enter and space also act, so no one has to guess the key
addEventListener('keydown', e => { if (inside && (e.key === 'Enter' || e.key === ' ' || e.key === 'Backspace')) { drive.keys[e.key] = true; e.preventDefault(); } });
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

// #store opens the page already inside the shop (handy for sharing and testing)
if (location.hash === '#store' || location.hash === '#shop') setTimeout(() => { drive.pos = TRACK; enter(); if (location.hash === '#shop') setTimeout(() => { shelf('deal'); $('#shop').hidden = false; insideEl.classList.add('shopping'); }, 1200); }, 300);

// build the store while the page is idle, so entering is instant
if (window.THREE) setTimeout(() => { try { if (!game.ready) { build3d(); size3d(); } } catch (e) { showErr(e); } }, 1500);
else addEventListener('load', () => { if (!window.THREE) showErr('3D ბიბლიოთეკა ვერ ჩაიტვირთა'); });
