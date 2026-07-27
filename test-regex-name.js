const customSearchName = "Кізима Дмитро Миколайович 12 марта 1985 года рождения. Зарегистрирован в селе Угерско, улица Жидачівська 12, Львовская область, Стрыйский район, Украина. Іпн 3111724753";
const nameMatch = customSearchName.match(/^([А-ЯІЇЄҐa-zA-Z][а-яіїєґa-zA-Z]+(?:\s+[А-ЯІЇЄҐa-zA-Z][а-яіїєґa-zA-Z]+){1,2})/);
console.log(nameMatch ? nameMatch[1] : null);
