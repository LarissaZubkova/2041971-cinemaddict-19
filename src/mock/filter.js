import {filter} from '../utils/filter';

function generateFilter(films) {
  return Object.entries(filter).map(([filterName, filterFilm]) => ({
    name:  filterName,
    count: filterFilm(films).length,
  }),
  );
}

export{generateFilter};
