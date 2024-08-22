import { fetchUserTheme } from '@/utils/updateUserTheme';
import { getDoc } from 'firebase/firestore';
import { auth } from '@/database';

jest.mock('firebase/firestore', () => ({
  getDoc: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock('@/database', () => ({
  db: {},
  auth: {
    currentUser: null,
  },
}));

describe('fetchUserTheme', () => {
  it('should return "light" if user is not logged in', async () => {
    (auth.currentUser as any) = null;

    const theme = await fetchUserTheme();
    expect(theme).toBe('light');
  });

  it('should return user theme if user is logged in and theme is set', async () => {
    const mockUser = { uid: '123' };
    const mockTheme = 'dark';

    (auth.currentUser as any) = mockUser;
    (getDoc as jest.Mock).mockResolvedValueOnce({
      data: () => ({ theme: mockTheme }),
    });

    const theme = await fetchUserTheme();
    expect(theme).toBe(mockTheme);
  });

  it('should return "light" if user theme is not set in Firestore', async () => {
    const mockUser = { uid: '123' };

    (auth.currentUser as any) = mockUser;
    (getDoc as jest.Mock).mockResolvedValueOnce({
      data: () => ({}),
    });

    const theme = await fetchUserTheme();
    expect(theme).toBe('light');
  });
});
