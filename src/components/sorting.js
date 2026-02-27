import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  return (data, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === "sort") {
      // @todo: #3.1 — запомнить выбранный режим сортировки
      // поработайте с датасетом нажатой кнопки: она пришла к нам в action.
      // Нам нужно переключить её значения сортировки по кругу, и самый удобный способ для этого — карта переходов.
      // Она реализуется объектом, в котором ключ — это текущее состояние, и его значение — это следующее состояние.
      // Карта находится в константе sortMap, которую мы получаем из утилит.
      // При этом важно, что состояния внутри неё зациклены.
      action.dataset.value = sortMap[action.dataset.value]; // Сохраним и применим как текущее следующее состояние из карты
      field = action.dataset.field; // поле сортировки
      order = action.dataset.value; // направление сортировки

      // @todo: #3.2 — сбросить сортировки остальных колонок
      columns.forEach((column) => {
        // Перебираем элементы (в columns у нас массив кнопок)
        if (column.dataset.field !== action.dataset.field) {
          // Если это не та кнопка, что нажал пользователь
          column.dataset.value = "none"; // тогда сбрасываем её в начальное состояние
        }
      });
    } else {
      // @todo: #3.3 — получить выбранный режим сортировки
      columns.forEach((column) => {
        // Перебираем все наши кнопки сортировки
        if (column.dataset.value !== "none") {
          // Ищем ту, что находится не в начальном состоянии (предполагаем, что одна)
          field = column.dataset.field; // Сохраняем в переменных поле
          order = column.dataset.value; // и направление сортировки
        }
      });
    }

    return sortCollection(data, field, order);
  };
}