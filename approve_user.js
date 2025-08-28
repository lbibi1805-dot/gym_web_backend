#!/usr/bin/env node

/**
 * Quick script to approve a user for testing
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gym_web')
    .then(() => {
        console.log('✅ Connected to MongoDB');
        approveUser();
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

async function approveUser() {
    try {
        const email = process.argv[2];
        
        if (!email) {
            console.log('❌ Usage: node approve_user.js <email>');
            console.log('📧 Example: node approve_user.js testuser@example.com');
            process.exit(1);
        }

        // Update user status to ACTIVE
        const result = await mongoose.connection.db.collection('users').updateOne(
            { email: email },
            { 
                $set: { 
                    status: 'ACTIVE',
                    updatedAt: new Date()
                } 
            }
        );

        if (result.matchedCount === 0) {
            console.log(`❌ User with email "${email}" not found`);
        } else if (result.modifiedCount === 1) {
            console.log(`✅ User "${email}" has been approved and activated!`);
        } else {
            console.log(`ℹ️  User "${email}" was already approved`);
        }

        // Show user details
        const user = await mongoose.connection.db.collection('users').findOne(
            { email: email },
            { projection: { name: 1, email: 1, role: 1, status: 1 } }
        );
        
        if (user) {
            console.log('👤 User Details:');
            console.log(`   Name: ${user.name}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Status: ${user.status}`);
        }

    } catch (error) {
        console.error('❌ Error approving user:', error);
    } finally {
        mongoose.connection.close();
    }
}
