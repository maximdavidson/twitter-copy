import { debounce } from '@utils/debounceSearch';

describe('debounce', () => {
  jest.useFakeTimers();

  it('should call the function after the specified delay', () => {
    const mockFunc = jest.fn();
    const debouncedFunc = debounce(mockFunc, 1000);

    debouncedFunc('test');

    expect(mockFunc).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);

    expect(mockFunc).toHaveBeenCalledWith('test');
    expect(mockFunc).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });
});
