const customSearchName = "Кізима Дмитро Миколайович 12 марта 1985 года рождения. Зарегистрирован в селе Угерско, улица Жидачівська 12, Львовская область, Стрыйский район, Украина. Іпн 3111724753";
const dobMatch = customSearchName.match(/(\d{1,2})\s*(?:марта|березня|січня|января|лютого|февраля|квітня|апреля|травня|мая|червня|июня|липня|июля|серпня|августа|вересня|сентября|жовтня|октября|листопада|ноября|грудня|декабря)\s*(\d{4})|(\d{2}\.\d{2}\.\d{4})/i);
if (dobMatch) {
    if (dobMatch[3]) console.log(dobMatch[3]);
    else {
        let month = '01';
        const mStr = customSearchName.toLowerCase();
        if (mStr.includes('март') || mStr.includes('берез')) month = '03';
        console.log(`${dobMatch[1].padStart(2, '0')}.${month}.${dobMatch[2]}`);
    }
}
