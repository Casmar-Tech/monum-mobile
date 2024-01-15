import IFilter from '../domain/IFilter';

export function getAllFilters(): IFilter[] {
  return [
    {id: '1', order: 1, label: 'Cultura', active: false},
    {id: '3', order: 2, label: 'Entreteniment', active: false},
    {id: '4', order: 3, label: 'Art', active: false},
    {id: '5', order: 4, label: 'Historia', active: false},
    {id: '6', order: 5, label: 'Natura', active: false},
    {id: '2', order: 6, label: 'Restaurants', active: false},
  ];
}
