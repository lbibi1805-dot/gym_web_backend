import bcrypt from 'bcrypt';

export const comparePasswords = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        console.error('Error comparing passwords:', error);
        return false;
    }
};

export const hashPassword = async (password: string, saltRounds: number = 10): Promise<string> => {
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Failed to hash password');
    }
};
