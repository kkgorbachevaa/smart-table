import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    // переберите по ключам объект с индексами и для каждого в соответствующий элемент создайте и выведите тег <option value="name">name</option>.
    Object.keys(indexes) // Получаем ключи из объекта
    .forEach((elementName) => {  // Перебираем по именам
        elements[elementName].append( // в каждый элемент добавляем опции
            ...Object.values(indexes[elementName]) // формируем массив имен, значений опций
            .map(name => { // используйте name как значение и текстовое содержимое
                const option = document.createElement('option'); // создаем тег option
                option.value = name; // заполняем его значением для отправки формы
                option.textContent = name; // и текстом, который увидит пользователь
                return option; // возвращаем option из колбэка
            })
        )
    })

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        // проверьте наличие действия. Если это кнопка с именем clear, тогда найдите input рядом с нашей кнопкой. 
        // Для этого можете получить родительский элемент кнопки и в нём выполнить поиск. 
        // Для найденного поля ввода сбросьте value и сделайте то же самое для соответствующего поля в state. 
        // Поле можно узнать через значение атрибута data-field кнопки.
        if (action && action.name === 'clear') { // проверяем, есть ли action и что это кнопка clear
            const fieldName = action.dataset.field; // Поле можно узнать через значение атрибута data-field кнопки.
            const parent = action.parentElement; // можно получить родительский элемент кнопки и в нём выполнить поиск
            const input = parent.querySelector('input, select'); // ищем поле ввода
            if (input) { // если поле найдено
                input.value = ""; // очищаем значение
            }
            if (fieldName in state) { // если у нас есть fieldName
                state[fieldName] = ''; // очищаем значение
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        // data.filter создает новый массив только из тех строк, для которых колбэк вернул true
        return data.filter(row => compare(row, state));
    }
}