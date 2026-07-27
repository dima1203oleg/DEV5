const customSearchName = "Кізима Дмитро Миколайович, 12 березня 1985 року народження. Зареєстрований у селі Угерсько, вулиця Жидачівська, 12, Львівська область, Стрийський район, Україна. ІПН 3111724753. Мій телефон: 0969999070";

let extractedName = customSearchName;
const nameMatch = customSearchName.match(/^([А-ЯІЇЄҐa-zA-Z][а-яіїєґa-zA-Z]+(?:\s+[А-ЯІЇЄҐa-zA-Z][а-яіїєґa-zA-Z]+){1,2})/);
if (nameMatch) {
  extractedName = nameMatch[1];
} else if (customSearchName.includes(',')) {
  extractedName = customSearchName.split(',')[0].trim();
}
console.log({ extractedName });

let extractedDob = '29.08.1985';
const dobMatch = customSearchName.match(/(\d{1,2})\s*(?:марта|березня|січня|января|лютого|февраля|квітня|апреля|травня|мая|червня|июня|липня|июля|серпня|августа|вересня|сентября|жовтня|октября|листопада|ноября|грудня|декабря)\s*(\d{4})|(\d{2}\.\d{2}\.\d{4})/i);
if (dobMatch) {
  if (dobMatch[3]) {
    extractedDob = dobMatch[3];
  } else {
    let month = '01';
    const mStr = customSearchName.toLowerCase();
    if (mStr.includes('март') || mStr.includes('берез')) month = '03';
    else if (mStr.includes('январ') || mStr.includes('січн')) month = '01';
    else if (mStr.includes('феврал') || mStr.includes('лют')) month = '02';
    else if (mStr.includes('апрел') || mStr.includes('квіт')) month = '04';
    else if (mStr.includes('ма') || mStr.includes('трав')) month = '05';
    else if (mStr.includes('июн') || mStr.includes('черв')) month = '06';
    else if (mStr.includes('июл') || mStr.includes('лип')) month = '07';
    else if (mStr.includes('август') || mStr.includes('серп')) month = '08';
    else if (mStr.includes('сентябр') || mStr.includes('верес')) month = '09';
    else if (mStr.includes('октябр') || mStr.includes('жовт')) month = '10';
    else if (mStr.includes('ноябр') || mStr.includes('листоп')) month = '11';
    else if (mStr.includes('декабр') || mStr.includes('груд')) month = '12';
    
    extractedDob = `${dobMatch[1].padStart(2, '0')}.${month}.${dobMatch[2]}`;
  }
}
console.log({ extractedDob });

let extractedTaxId = '3129401824';
const itnMatch = customSearchName.match(/\b\d{10}\b/);
if (itnMatch) extractedTaxId = itnMatch[0];
console.log({ extractedTaxId });

let extractedAddress = '';
const fullAddrMatch = customSearchName.match(/(?:Зарегистрирован|Зареєстрован)[^\s]*\s+(?:в|у)\s+([^\.]+)/i);
if (fullAddrMatch) {
  extractedAddress = fullAddrMatch[1].trim();
} else {
  const addrMatch2 = customSearchName.match(/(село|м\.|місто|город|смт|вул\.|улица)\s+([^.]*)/i);
  if (addrMatch2) extractedAddress = (addrMatch2[1] + ' ' + addrMatch2[2]).trim();
}
console.log({ extractedAddress });

let extractedPhone = '+380 (50) 998-12-34';
const phoneMatch = customSearchName.match(/(?:телефон|тел\.?|моб\.?|т\.?|phone|tel)[:\s]*([+0-9\-\(\)\s]{10,20})/i);
if (phoneMatch) {
  let p = phoneMatch[1].replace(/[^\d+]/g, '');
  if (p.length === 10) p = '+38' + p;
  else if (p.length === 12 && !p.startsWith('+')) p = '+' + p;
  extractedPhone = p;
}
console.log({ extractedPhone });
