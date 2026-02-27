import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";

// @todo: подключение
import { initPagination } from "./components/pagination.js";

import { initSorting } from "./components/sorting.js";

import { initFiltering } from "./components/filtering.js";

import { initSearching } from "./components/searching.js";

// Исходные данные используемые в render()
const { data, ...indexes } = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  const rowsPerPage = parseInt(state.rowsPerPage); // приведём количество страниц к числу
  const page = parseInt(state.page ?? 1); // номер страницы по умолчанию 1 и тоже число

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
  let state = collectState(); // состояние полей из таблицы
  let result = [...data]; // копируем для последующего изменения

  // @todo: использование
  // Теперь применим наш модуль к данным. Для этого найдите область применения и добавьте вызов следующим образом:
  result = applySearching(result, state, action); //поиск
  result = applyFiltering(result, state, action); // фильтрация
  result = applySorting(result, state, action); // сортировка
  result = applyPagination(result, state, action); // пагинация

  sampleTable.render(result);
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"], // Начните с подключения заготовки модуля к таблице. Чтобы увидеть пагинацию добавьте вывод шаблона пагинации в таблицу следующим образом: after: ['pagination']. Готово: прокрутите страницу в самый низ и увидите, что появилась новая строка.
  },
  render,
);

// @todo: инициализация
// Импортируйте функцию initPagination() и добавьте её вызов в области инициализации
const applyPagination = initPagination(
  sampleTable.pagination.elements, // передаём сюда элементы пагинации, найденные в шаблоне
  (el, page, isCurrent) => {
    // и колбэк, чтобы заполнять кнопки страниц данными
    const input = el.querySelector("input"); // находим внутри el радиокнопку
    const label = el.querySelector("span"); // находим <span> с текстом номера страницы
    input.value = page; // указываем, какое значение будет у этого radio (номер страницы)
    input.checked = isCurrent; // если isCurrent === true, то эта радиокнопка будет отмечена
    label.textContent = page; // показываем номер страницы на самой кнопке
    return el; // возвращаем настроенный DOM-элемент кнопки
  },
);

// инициализация sorting
//  // Нам нужно передать сюда массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

// инициализация filtering
const applyFiltering = initFiltering(sampleTable.filter.elements, {
  // передаём элементы фильтра
  searchBySeller: indexes.sellers, // для элемента с именем searchBySeller устанавливаем массив продавцов
});

// инициализция searching
const applySearching = initSearching("search");

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

render();
