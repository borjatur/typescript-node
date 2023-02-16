import { getAndMergeData } from ".";

const urls = [
  'https://jsonplaceholder.typicode.com/users/1',
  'https://jsonplaceholder.typicode.com/users/2',
  'https://jsonplaceholder.typicode.com/users/3',
  'https://jsonplaceholder.typicode.com/users/4',
  'https://jsonplaceholder.typicode.com/users/5',
  'https://jsonplaceholder.typicode.com/users/6',
  'https://jsonplaceholder.typicode.com/users/7',
  'https://jsonplaceholder.typicode.com/users/8',
  'https://jsonplaceholder.typicode.com/users/9',
  'https://jsonplaceholder.typicode.com/users/10'
];

getAndMergeData(urls, 'id')
  .then(mergedData => console.log(mergedData)).catch(error => console.error(error));

