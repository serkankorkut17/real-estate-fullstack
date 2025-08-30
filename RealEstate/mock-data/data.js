/* Mock property uploader (multipart/form-data) */
const axios = require('axios');
const FormData = require('form-data');
// const fs = require('fs'); // görsel eklersen aç

const API_URL = process.env.API_URL || 'http://localhost:8000/api/properties';
const OWNER_ID = 1;

const propertyStatuses = [
  { id: 1, name: 'Satılık' },
  { id: 2, name: 'Kiralık' },
];

const propertyTypes = [
  { id: 1, name: 'Apartment' },
  { id: 2, name: 'Villa' },
  { id: 3, name: 'Office' },
  { id: 4, name: 'Land' },
  { id: 5, name: 'Detached House' },
  { id: 6, name: 'Building' },
  { id: 7, name: 'Timeshare' },
  { id: 8, name: 'Touristic Facility' },
];

// İngilizce tip adlarını daha anlamlı Türkçe başlık için eşle
const typeLabelTr = {
  Apartment: 'Daire',
  Villa: 'Villa',
  Office: 'Ofis',
  Land: 'Arsa',
  'Detached House': 'Müstakil Ev',
  Building: 'Bina',
  Timeshare: 'Devremülk',
  'Touristic Facility': 'Turistik Tesis',
};

const currencies = [
  { id: 1, value: 'TRY', label: 'Türk Lirası (₺)', symbol: '₺' },
  { id: 2, value: 'USD', label: 'Amerikan Doları ($)', symbol: '$' },
  { id: 3, value: 'EUR', label: 'Euro (€)', symbol: '€' },
];

const districts = [
  { name: 'Beylikdüzü', neighborhoods: ['Adnan Kahveci', 'Gürpınar', 'Yakuplu'] },
  { name: 'Kadıköy', neighborhoods: ['Göztepe', 'Caddebostan', 'Fenerbahçe'] },
  { name: 'Üsküdar', neighborhoods: ['Çengelköy', 'Kuzguncuk', 'Acıbadem'] },
  { name: 'Beşiktaş', neighborhoods: ['Levent', 'Etiler', 'Ortaköy'] },
  { name: 'Şişli', neighborhoods: ['Mecidiyeköy', 'Nişantaşı', 'Esentepe'] },
  { name: 'Bakırköy', neighborhoods: ['Ataköy', 'Florya', 'Yeşilköy'] },
  { name: 'Ataşehir', neighborhoods: ['Atatürk', 'Örnek', 'Barbaros'] },
];

const roomCounts = ['1+1', '2+1', '3+1', '4+1'];
const heatingTypes = ['Doğalgaz Kombi', 'Merkezi Sistem', 'Yerden Isıtma', 'Klima'];
const listedBy = ['Sahibinden', 'Emlak Ofisinden'];
const deedStatuses = ['Kat Mülkiyeti', 'Kat İrtifakı', 'Hisseli'];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomBool(p = 0.5) { return Math.random() < p; }

// İstanbul yakın koordinatlar
function randomIstanbulCoords() {
  const lat = 40.90 + Math.random() * 0.4;  // 40.90 - 41.30
  const lon = 28.60 + Math.random() * 0.8;  // 28.60 - 29.40
  return { lat: +lat.toFixed(6), lon: +lon.toFixed(6) };
}

function buildTitle(statusTr, typeTr, rc, d, n) {
  const adjectives = ['Ferah', 'Geniş', 'Masrafsız', 'Metroya Yakın', 'Yatırıma Uygun', 'Yeni Yapı'];
  const extras = ['Deniz Manzaralı', 'Site İçinde', 'Asansörlü', 'Otoparklı', 'Bahçeli'];
  return `${statusTr} ${rc} ${typeTr} – ${d} ${n}’de ${pick(adjectives)} ${pick(extras)}`;
}

function buildDescription({ d, n, rc, gross, net, statusTr, typeTr, currencySymbol, priceDisplay }) {
  const lines = [
    `${d} / ${n} bölgesinde bulunan ${rc} ${typeTr}, ${statusTr.toLowerCase()} olarak listelenmiştir.`,
    `Brüt ${gross} m², net ${net} m² kullanım alanı sunar; gün boyu aydınlık ve ferah.`,
    `Ulaşım olanaklarına yakın; çevresinde okul, market ve park bulunmaktadır.`,
    `Liste fiyatı: ${priceDisplay} ${currencySymbol}.`,
  ];
  if (randomBool(0.6)) lines.push('Site içerisinde güvenlik ve otopark mevcuttur.');
  if (randomBool(0.5)) lines.push('Bina düzenli bakımlıdır ve ekstra masraf gerektirmez.');
  return lines.join(' ');
}

// Basit kur (yaklaşık) – istersen güncel kura göre düzenleyebilirsin
const FX = { USD: 32, EUR: 34.5 }; // 1 USD ~ 32 TRY, 1 EUR ~ 34.5 TRY

function priceFor(typeName, statusId) {
  // TRY bazlı aralık belirle
  const byType = {
    Apartment: [2_500_000, 15_000_000],
    Villa: [8_000_000, 60_000_000],
    Office: [3_000_000, 25_000_000],
    Land: [1_500_000, 40_000_000],
    'Detached House': [5_000_000, 35_000_000],
    Building: [20_000_000, 150_000_000],
    Timeshare: [400_000, 2_000_000],
    'Touristic Facility': [15_000_000, 120_000_000],
  };
  const rentByType = {
    Apartment: [20_000, 120_000],
    Villa: [50_000, 350_000],
    Office: [25_000, 180_000],
    Land: [10_000, 80_000],
    'Detached House': [35_000, 220_000],
    Building: [150_000, 900_000],
    Timeshare: [5_000, 25_000],
    'Touristic Facility': [120_000, 800_000],
  };

  const range = statusId === 2 ? rentByType[typeName] : byType[typeName];
  const [min, max] = range ?? [2_000_000, 10_000_000];
  return randomInt(min, max); // TRY
}

async function postOne(i) {
  const d = pick(districts);
  const n = pick(d.neighborhoods);

  const type = pick(propertyTypes);
  const status = pick(propertyStatuses); // istersen sadece 1 ve 2 ile sınırla
  const currency = pick(currencies);

  const typeTr = typeLabelTr[type.name] || type.name;
  const statusTr = status.name;

  const rc = pick(roomCounts);
  const heating = pick(heatingTypes);
  const listed = pick(listedBy);
  const deed = pick(deedStatuses);

  const gross = randomInt(80, 220);
  const net = Math.max(50, gross - randomInt(10, 50));
  const floor = randomInt(1, 12);
  const totalFloors = Math.max(floor + randomInt(0, 15), floor);
  const bathrooms = randomInt(1, 3);
  const buildingAge = randomInt(0, 25);
  const priceTRY = priceFor(type.name, status.id);
  const { lat, lon } = randomIstanbulCoords();

  // Para birimine göre fiyatı dönüştür
  let price = priceTRY;
  if (currency.value === 'USD') price = Math.round(priceTRY / FX.USD);
  if (currency.value === 'EUR') price = Math.round(priceTRY / FX.EUR);
  const currencySymbol = currency.symbol;
  const priceDisplay = price.toLocaleString('tr-TR');

  const title = buildTitle(statusTr, typeTr, rc, d.name, n);
  const description = buildDescription({
    d: d.name,
    n,
    rc,
    gross,
    net,
    statusTr,
    typeTr,
    currencySymbol,
    priceDisplay,
  });

  const form = new FormData();
  form.append('Title', title);
  form.append('Description', description);
  form.append('PropertyTypeId', String(type.id));
  form.append('PropertyStatusId', String(status.id));
  form.append('Country', 'Turkey');
  form.append('City', 'İstanbul');
  form.append('District', d.name);
  form.append('Neighborhood', `${n} Mah.`);
  form.append('Street', 'Atatürk Caddesi');
  form.append('AddressLine', `${n} Mah. No:${randomInt(1, 200)}/${randomInt(1, 10)}`);
  form.append('Latitude', String(lat));
  form.append('Longitude', String(lon));
  form.append('Price', String(price));
  form.append('CurrencyId', String(currency.id));

  // Kiralık ise depozito ve aidatı daha anlamlı doldur
  if (status.id === 2) {
    const monthlyFee = randomInt(0, 3000);
    const deposit = randomInt(price, price * 2); // 1-2 kira
    form.append('Deposit', String(deposit));
    form.append('MonthlyFee', String(monthlyFee));
  } else {
    form.append('Deposit', String(0));
    form.append('MonthlyFee', String(randomInt(0, 2500)));
  }

  form.append('GrossArea', String(gross));
  form.append('NetArea', String(net));
  form.append('RoomCount', rc);
  form.append('BuildingAge', String(buildingAge));
  form.append('FloorNumber', String(floor));
  form.append('TotalFloors', String(totalFloors));
  form.append('BathroomCount', String(bathrooms));
  form.append('HeatingType', heating);
  form.append('HasKitchen', String(true));
  form.append('HasBalcony', String(randomBool()));
  form.append('HasElevator', String(randomBool()));
  form.append('HasParking', String(randomBool()));
  form.append('HasGarden', String(randomBool(0.35)));
  form.append('IsFurnished', String(randomBool(0.25)));
  form.append('UsageStatus', randomBool(0.3) ? 'Boş' : 'Kiracılı');
  form.append('IsInComplex', String(randomBool(0.6)));
  form.append('IsEligibleForLoan', String(true));
  form.append('DeedStatus', deed);
  form.append('ListedBy', listed);
  form.append('IsExchangeable', String(randomBool(0.15)));
  form.append('OwnerId', String(OWNER_ID));
  form.append('StartDate', new Date().toISOString());

  // Örnek resim:
  // form.append('images', fs.createReadStream('/path/to/img1.jpg'), 'img1.jpg');

  const headers = form.getHeaders();
  try {
    const res = await axios.post(API_URL, form, { headers, maxBodyLength: Infinity });
    console.log(`#${i} OK`, res.status, res.data?.id ?? '');
  } catch (err) {
    if (err.response) {
      console.error(`#${i} FAIL`, err.response.status, err.response.data);
    } else {
      console.error(`#${i} ERR`, err.message);
    }
  }
}

const COUNT = 20;

(async () => {
  for (let i = 1; i <= COUNT; i++) {
    await postOne(i);
  }
})();