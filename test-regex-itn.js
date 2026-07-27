const customSearchName = "Кізима Дмитро Миколайович 12 марта 1985 года рождения. Зарегистрирован в селе Угерско, улица Жидачівська 12, Львовская область, Стрыйский район, Украина. Іпн 3111724753";
const itnMatch = customSearchName.match(/\b\d{10}\b/);
console.log(itnMatch ? itnMatch[0] : null);
