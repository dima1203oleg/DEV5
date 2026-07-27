const customSearchName = "Кізима Дмитро Миколайович 12 марта 1985 года рождения. Зарегистрирован в селе Угерско, улица Жидачівська 12, Львовская область, Стрыйский район, Украина. Іпн 3111724753 мій телефон: 0969999070 то воно не правельно шукпє перевір сам і виправ помилкун";

let extractedName = customSearchName;
const nameMatch = customSearchName.match(/^([А-ЯІЇЄҐa-zA-Z][а-яіїєґa-zA-Z]+(?:\s+[А-ЯІЇЄҐa-zA-Z][а-яіїєґa-zA-Z]+){1,2})/);
if (nameMatch) {
  extractedName = nameMatch[1];
} else if (customSearchName.includes(',')) {
  extractedName = customSearchName.split(',')[0].trim();
}
console.log({ extractedName });
