import axios, { AxiosResponse } from 'axios';

export function mergeData<Type>(results: Type[], key: string): Type[] {
  const obj = results.reverse().find(e => typeof e === 'object' && Object.keys(e as Object).includes(key));
  if(!obj) {
    return results.reverse();
  }
  // structuredClone for providing completenely new copies of the original object as the array contain object references
  return results.reverse().map((element) => {
    return Object.keys(element as Object).includes(key) ? structuredClone(obj) : element
  })
}

// mergeData alternative discarted due to less readable maintaining same algorithmic complexity
// export function mergeData<Type>(results: Type[], key: string): Type[] {
//   const entries = Array.from(results.reverse().entries())
//     .filter(e => typeof e[1] === 'object' && Object.keys(e[1] as Object).includes(key));
//   const targetEntry = entries.shift();
//   if (targetEntry) {
//     const targetObject = targetEntry[1];
//     entries.forEach(e => results[e[0]] = structuredClone(targetObject))
//   }
//   return results.reverse();
// }

export function sanitizeUrl(url: string): string {
  return new URL(url).toString();
}

export async function getAndMergeData<T>(urls: string[], key: string): Promise<T> {

  const requests = urls.map(u => sanitizeUrl(u))
    .map((url) => axios.get(url));

  return Promise.allSettled(requests)
    .then((results) => {
      const objects = results
        .filter((e) => e.status === 'fulfilled')
        .map((e) => ((e as PromiseFulfilledResult<T>).value as AxiosResponse).data);
      
      return mergeData(objects, key) as T;
    });
      
}