export function initFiltering(elements) {
  const updateIndexes = (elements, indexes) => {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
      // Получаем ключи из объекта и перебираем по именам
      elements[elementName].append(
        ...Object.values(indexes[elementName]).map((name) => {
          // в каждый элемент добавляем опции; формируем массив имен, значений опций
          const el = document.createElement("option"); // создаем тег option
          el.textContent = name; // заполняем его текстом, который увидит пользователь
          el.value = name; // и значением для отправки формы
          return el;
        }),
      );
    });
  };

  const applyFiltering = (query, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === "clear") {
      // проверяем, есть ли action и что это кнопка clear
      const fieldName = action.dataset.field; // Поле можно узнать через значение атрибута data-field кнопки
      const parent = action.parentElement; // можно получить родительский элемент кнопки и в нем выполнить поиск
      const input = parent.querySelector("input, select"); // ищем поле ввода

      if (input) {
        // если поле найдено
        input.value = ""; // очищаем значение
      }
      if (fieldName in state) {
        // если у нас есть fieldName
        state[fieldName] = ""; // очищаем значение
      }
    }

    // @todo: #4.5 — отфильтровать данные, используя компаратор
    const filter = {};
    Object.keys(elements).forEach((key) => {
      if (elements[key]) {
        if (
          ["INPUT", "SELECT"].includes(elements[key].tagName) &&
          elements[key].value
        ) {
          // ищем поля ввода в фильтре с непустыми данными
          filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
        }
      }
    });

    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query; // если в фильтре что-то добавилось, применим к запросу
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
