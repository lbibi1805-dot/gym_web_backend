import { Request, Response } from 'express';
import { generateJWT } from '../helpers/jwtGenerate.helper';
import { decodeToken } from '../helpers/decodeToken';

/**
 * Test JWT functionality
 */
export const testJWT = (req: Request, res: Response): void => {
    try {
        console.log('🧪 Testing JWT functionality...');
        console.log('🔍 JWT_SECRET exists:', !!process.env.JWT_SECRET);
        
        // Create test payload
        const testPayload = {
            id: 'test123',
            email: 'test@example.com',
            role: 'client' as const,
            status: 'approved' as const
        };
        
        // Generate token
        const token = generateJWT(testPayload);
        console.log('✅ Generated token:', token.substring(0, 50) + '...');
        
        // Decode token
        const decoded = decodeToken(token);
        console.log('✅ Decoded token:', decoded);
        
        res.json({
            success: true,
            message: 'JWT test successful',
            data: {
                original: testPayload,
                token: token,
                decoded: decoded,
                jwtSecretExists: !!process.env.JWT_SECRET
            }
        });
        
    } catch (error) {
        console.error('🚨 JWT Test Error:', error);
        res.status(500).json({
            success: false,
            message: 'JWT test failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
