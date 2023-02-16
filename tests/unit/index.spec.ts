
import axios from 'axios';
import { mergeData, sanitizeUrl, getAndMergeData } from '../../src';

jest.mock('axios');

afterAll(() => {
  jest.mock('axios').restoreAllMocks();
});

describe('(megeData)', () => {

  describe('(all objects containing the key)', () => {

    it('should overwrite all objects for the last occurence that contains the key', () => {

      const users = [{
        id: 1,
        name: 'Journey'
      }, {
        id: 2,
        name: 'Lennon'
      }, {
        id: 3,
        name: 'Valerie'
      }];

      const result = mergeData(users, 'id');
      expect(result).toEqual([{
        id: 3,
        name: 'Valerie'
      }, {
        id: 3,
        name: 'Valerie'
      }, {
        id: 3,
        name: 'Valerie'
      }]);
    });
  });

  describe('(some objects containing the key)', () => {

    it('should overwrite only those objects that contain the key with the last occurrence, all in a row', () => {

      const users = [{
        id: 1,
        name: 'Ziggy'
      }, {
        id: 2,
        name: 'Gloria'
      }, {
        uuid: '4e99ac04-40d5-4d9f-90cd-78c2fd4f07f3',
        name: 'Nash'
      }];
  
      const result = mergeData(users, 'id');
      expect(result).toEqual([{
        id: 2,
        name: 'Gloria'
      }, {
        id: 2,
        name: 'Gloria'
      }, {
        uuid: '4e99ac04-40d5-4d9f-90cd-78c2fd4f07f3',
        name: 'Nash'
      }]);
    });

    it('should overwrite only those objects that contain the key with the last occurrence, unordered', () => {

      const users = [{
        id: 1,
        name: 'Drago'
      }, {
        uuid: 'f2dadb3d-9e93-4280-9797-b58f606e0ec0',
        name: 'Tristan'
      }, {
        id: 2,
        name: 'Archimedes'
      }];
  
      const result = mergeData(users, 'id');
      expect(result).toEqual([{
        id: 2,
        name: 'Archimedes'
      }, {
        uuid: 'f2dadb3d-9e93-4280-9797-b58f606e0ec0',
        name: 'Tristan'
      }, {
        id: 2,
        name: 'Archimedes'
      }]);
    });
  });

  describe('(no objects containing the key)', () => {

    it('should not overwrite any object', () => {

      const users = [{
        uuid: '0a94296e-1a97-421f-996c-523b4b792aea',
        name: 'Linda'
      }, {
        uuid: '8f154989-a04f-4c5c-8e74-c1dcc7da6420',
        name: 'Gloria'
      }, {
        uuid: '4e99ac04-40d5-4d9f-90cd-78c2fd4f07f3',
        name: 'Nash'
      }];
  
      const result = mergeData(users, 'id');
      expect(result).toEqual(users);
    });
  });

  describe('(edge scenarios)', () => {

    it('should return empty array with empty object array as input', () => {

      const result = mergeData([], 'id');
      expect(result).toEqual([]);
    });

    it('should return untouched array with empty string as the key', () => {

      const users = [{
        id: 1,
        name: 'Erik'
      }];

      const result = mergeData(users, '');
      expect(result).toEqual(users);
    });

    it('should return untouched array with array of strings as input', () => {

      const users = ['Veronika', 'Leo'];

      const result = mergeData(users, '1');
      expect(result).toEqual(users);
    });
  });
});

describe('(sanitize urls)', () => {

  describe('(valid values)', () => {

    it('should return a sanitized url', () => {
      const url = 'https://www.vodafone.es/c/particulares/es/';
      const result = sanitizeUrl(url);
      expect(result).toEqual(url);
    });
  });

  describe('(invalid values)', () => {

    it('should throw error with an invalid url', () => {
      const url = 'invalid';
      expect(() => sanitizeUrl(url)).toThrowError('Invalid URL');
    });
  });
});

describe('(getAndMergeData)', () => {

  it('should make http requests using axios and post-process returned data', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;

    const firstResponse = {
      data: {
        id: 1,
        name: 'Susie'
      }
    };
    const secondResponse = {
      data: {
        id: 2,
        name: 'Angela'
      }
    };
    mockedAxios.get
      .mockResolvedValueOnce(firstResponse)
      .mockResolvedValueOnce(secondResponse);
    
    const urls = [
      'https://jsonplaceholder.typicode.com/users/1',
      'https://jsonplaceholder.typicode.com/users/2'
    ];
    const key = 'id';
    const result = await getAndMergeData(urls, key);

    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    expect(mockedAxios.get).toHaveBeenNthCalledWith(1, 'https://jsonplaceholder.typicode.com/users/1');
    expect(mockedAxios.get).toHaveBeenNthCalledWith(2, 'https://jsonplaceholder.typicode.com/users/2');
    expect(result).toEqual([{
      id: 2,
      name: 'Angela'
    }, {
      id: 2,
      name: 'Angela'
    }]);
  });
});