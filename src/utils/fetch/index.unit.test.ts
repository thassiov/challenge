import axios from 'axios';

import { makeGetRequest } from ".";

jest.mock('axios');

describe('fetch module', () => {
  it('should fail to make a get request by the fetch method throwing an error', async () => {
    (axios.get as jest.Mock).mockImplementationOnce(() => { throw new Error('some error'); });
    const mockUrl = 'http://thisisvalid.com';
    await expect(makeGetRequest(mockUrl)).rejects.toThrow('Cannot make GET request');
  });

  it('should make a get request', async () => {
    const mockRequestResponse =  {
      status: 200,
      data: { requestData: 'data' },
    };
    (axios.get as jest.Mock).mockImplementationOnce(() => {
      return mockRequestResponse;
    });

    const mockUrl = 'http://thisisvalid.com';

    const result = await makeGetRequest(mockUrl);

    expect(result).toStrictEqual(mockRequestResponse);
  });
});
