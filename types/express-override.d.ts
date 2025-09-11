// Temporary type declarations for production build
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: 'client' | 'admin';
        status: 'pending' | 'approved' | 'rejected';
      };
    }
  }
}

export {};
