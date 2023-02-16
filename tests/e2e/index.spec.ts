import { getAndMergeData } from '../../src';

describe('(functional tests)', () => {

  describe('(getAndMergeData)', () => {

    describe('(success)', () => {

      it('should call api endpoints and merged results based on given key', async () => {

        const urls = [
          'https://jsonplaceholder.typicode.com/users/1',
          'https://jsonplaceholder.typicode.com/users/2'
        ];
  
        const result = await getAndMergeData(urls, 'id')
  
        expect(result).toEqual([
          {
            id: 2,
            name: 'Ervin Howell',
            username: 'Antonette',
            email: 'Shanna@melissa.tv',
            address: {
              street: 'Victor Plains',
              suite: 'Suite 879',
              city: 'Wisokyburgh',
              zipcode: '90566-7771',
              geo: {
                lat: '-43.9509',
                lng: '-34.4618'
              }
            },
            phone: '010-692-6593 x09125',
            website: 'anastasia.net',
            company: {
              name: 'Deckow-Crist',
              catchPhrase: 'Proactive didactic contingency',
              bs: 'synergize scalable supply-chains'
            }
          },
          {
            id: 2,
            name: 'Ervin Howell',
            username: 'Antonette',
            email: 'Shanna@melissa.tv',
            address: {
              street: 'Victor Plains',
              suite: 'Suite 879',
              city: 'Wisokyburgh',
              zipcode: '90566-7771',
              geo: {
                lat: '-43.9509',
                lng: '-34.4618'
              }
            },
            phone: '010-692-6593 x09125',
            website: 'anastasia.net',
            company: {
              name: 'Deckow-Crist',
              catchPhrase: 'Proactive didactic contingency',
              bs: 'synergize scalable supply-chains'
            }
          }
        ]);
      });
    });

    describe('(failure)', () => {

      it('should rejects when no valid url is provided', async () => {

        const urls = [
          'https://jsonplaceholder.typicode.com/users/1',
          'invalid'
        ];
  
        expect(getAndMergeData(urls, 'id')).rejects.toMatchObject({
          input: 'invalid',
          code: 'ERR_INVALID_URL'
        });
      });
    });
  });
});