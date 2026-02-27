import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    // Вам нужно будет добавить код, который возьмёт идентификаторы шаблонов из массивов before и after и добавит эти клонированные шаблоны до и после таблицы соответственно. 
    // Причём шаблоны «до» нужно выводить в обратном порядке, если мы используем функцию prepend.

    // проходим по массиву before в обратном порядке и добавляем блоки перед таблицей
    before.reverse().forEach(subName => { // reverse - разворачивает порядок элементов в массиве
        root[subName] = cloneTemplate(subName); // Сохраните объекты, полученные после клонирования, в объекте таблицы root для последующего доступа к ним.
        root.container.prepend(root[subName].container);
    });

    // проходим по массиву after в обычном порядке и добавляем блоки после таблицы
    after.forEach(subName => {
        root[subName] = cloneTemplate(subName); // Сохраните объекты, полученные после клонирования, в объекте таблицы root для последующего доступа к ним.
        root.container.appendChild(root[subName].container);
    });

    // @todo: #1.3 —  обработать события и вызвать onAction()
    // Здесь нужно будет к root.container добавить обработчики событий:
    // change — просто внутри обработчика: не передавайте onAction напрямую в addEventListener, вызовите onAction() без аргументов.
    root.container.addEventListener('change', () => {
        onAction();
    });

    // reset — внутри обработчика нужно сделать отложенный вызов setTimeout (onAction). 
    // Пока поясним, что reset срабатывает быстрее, чем поля реально успевают очиститься, поэтому и нужна небольшая задержка.
    root.container.addEventListener('reset', () => {
        setTimeout(onAction);
    });

    // submit — тут нужно предотвратить стандартное поведение через e.preventDefault() 
    // и сделать вызов с передачей сабмиттера onAction(e.submitter).
    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });


    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        // Сюда вместо пустого массива вам нужно добавить сформированные из шаблона rowTemplate строки.
        const nextRows = data.map(item => { // Трансформируем данные в строки и продолжим работать внутри колбэка.
            const row = cloneTemplate(rowTemplate); // получаем клонированный шаблон строки и продолжаем работать внутри колбэка
            Object.keys(item).forEach(key => { // проходимся по всем полям текущей записи item. 
                if (row.elements[key]) { // проверяем, что такой элемент существует
                    row.elements[key].textContent = item[key]; // если существует, записываем туда текст
                }
            });
            return row.container; // возвращаем dom-элемент строки
        });
        root.elements.rows.replaceChildren(...nextRows);
    };

    return {...root, render};
}