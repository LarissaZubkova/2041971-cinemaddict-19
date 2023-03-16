const getRandomInteger = (a = 1, b = 5) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export {getRandomInteger, getRandomArrayElement};
