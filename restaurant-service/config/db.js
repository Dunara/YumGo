const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // MongoDB Atlas Connection - without deprecated options
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        
        console.log('✅ MongoDB Atlas Connected Successfully');
        console.log(`📀 Host: ${conn.connection.host}`);
        console.log(`📀 Database: ${conn.connection.name}`);
        
        // Check existing collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        
        if (collectionNames.includes('restaurants')) {
            console.log('📂 restaurants collection: ✅ exists');
        } else {
            console.log('📂 restaurants collection: ⚠️ not found - will be created when data inserted');
        }
        
        if (collectionNames.includes('menuitems')) {
            console.log('📂 menuitems collection: ✅ exists');
        } else {
            console.log('📂 menuitems collection: ⚠️ not found - will be created when data inserted');
        }
        
    } catch (error) {
        console.error('❌ MongoDB Atlas Connection Error:', error.message);
        console.error('Please check:');
        console.error('1. Internet connection');
        console.error('2. Username/password is correct');
        console.error('3. IP address is whitelisted in MongoDB Atlas');
        process.exit(1);
    }
};

module.exports = connectDB;