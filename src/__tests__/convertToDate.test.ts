import { convertToDate } from '@utils/convertToDate';

describe('convertToDate', () => {
  it('should convert ISO string timestamp to Date', () => {
    const isoString = '2021-10-01T00:00:00.000Z';
    const date = convertToDate(isoString);
    expect(date.toISOString()).toEqual(new Date(isoString).toISOString());
  });
});
