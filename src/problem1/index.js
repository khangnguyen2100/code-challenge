/* 
Provide 3 unique implementations of the following function in JavaScript.
**Input**: `n` - any integer
*Assuming this input will always produce a result lesser than `Number.MAX_SAFE_INTEGER`*.
**Output**: `return` - summation to `n`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`.
*/
const isNumber = (n) => typeof n === 'number' && !isNaN(n);

var sum_to_n_a = function (n) {
  // use for loop
  if (!isNumber(n)) return 0;

  let result = 0;
  for (let i = 1; i <= n; i++) {
    result += i;
  }

  return result;
};

var sum_to_n_b = function (n) {
  // use formula
  if (!isNumber(n)) return 0;

  return (n * (n + 1)) / 2;
};

var sum_to_n_c = function (n) {
  // use while loop
  if (!isNumber(n)) return 0;

  let result = 0;
  let index = 1;
  while (index <= n) {
    result += index;
    index++;
  }

  return result;
};

console.time('Time Take');
console.log(sum_to_n_a('hi'));
console.log(sum_to_n_a(2));
console.log(sum_to_n_a(3));
console.log(sum_to_n_a(5));
console.log(sum_to_n_a(1294192322));
console.timeEnd('Time Take');
