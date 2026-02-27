import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const compare = createComparison(
        ['skipEmptyTargetValues'], // первый аргумент - массив имен стандартных правил
        [
            rules.searchMultipleFields (
                searchField, // строка search
                ['date', 'customer', 'seller'], // поля строки, по которым будет искаться совпадение
                false
            )
        ]
    );

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        return data.filter(row => compare(row, state));
    }
}