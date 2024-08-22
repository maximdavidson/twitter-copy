import { updateUserTheme } from '@/utils/updateUserTheme';
import { doc, updateDoc } from 'firebase/firestore';
import { auth } from '@/database';

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock('@/database', () => ({
  db: {},
  auth: {
    currentUser: null,
  },
}));

describe('updateUserTheme', () => {
  it('should update user theme if user is logged in', async () => {
    const mockUser = { uid: '123' };
    const mockTheme = 'dark';

    (auth.currentUser as any) = mockUser;
    (doc as jest.Mock).mockReturnValue({});

    await updateUserTheme(mockTheme);

    expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), { theme: mockTheme });
  });
});
