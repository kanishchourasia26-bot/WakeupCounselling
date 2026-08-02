const mongoose = require('mongoose');
require('dotenv').config();

// 1. Aapka Local MongoDB URI (Jahan se data uthana hai)
const LOCAL_URI = 'mongodb://localhost:27017/test'; 

// 2. Aapka MongoDB Atlas URI (Jahan data bhejna hai - .env se ya direct daal do)
const ATLAS_URI = process.env.MONGODB_ATLAS_URI || 'mongodb+srv://kanishchourasia26_db_user:wakeup1103@cluster0.fazuffm.mongodb.net/?appName=Cluster0';

async function migrate() {
  try {
    console.log('⏳ Connecting to Local and Atlas databases...');
    
    // Local DB Connection
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('✅ Connected to Local MongoDB');

    // Atlas DB Connection
    const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('✅ Connected to MongoDB Atlas');

    // Local DB ki saari collections dhoondho
    const collections = await localConn.db.listCollections().toArray();

    for (let col of collections) {
      const colName = col.name;
      console.log(`\n📦 Migrating collection: [ ${colName} ] ...`);

      // Local se sara data fetch karo
      const data = await localConn.db.collection(colName).find({}).toArray();
      
      if (data.length > 0) {
        // Pehle Atlas me agar purana data hai toh clear karo (taaki duplicate na ho)
        await atlasConn.db.collection(colName).deleteMany({});
        // Naya data Atlas me insert karo
        await atlasConn.db.collection(colName).insertMany(data);
        console.log(`🚀 Successfully copied ${data.length} records to Atlas!`);
      } else {
        console.log(`⚠️ Collection [ ${colName} ] is empty, skipping.`);
      }
    }

    console.log('\n🎉 ALL DATA MIGRATED SUCCESSFULLY TO ATLAS! 🎉');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
}

migrate();