import { MongoClient, Db } from "mongodb";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/sun-compass";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function ensureDatabaseSeeded(database: Db) {
  try {
    const settingsColl = database.collection("settings");
    const count = await settingsColl.countDocuments();
    if (count === 0) {
      console.log("MongoDB 'settings' collection is empty. Seeding initial data from db.json...");
      const dbJsonPath = path.resolve(process.cwd(), "src/data/db.json");
      
      let rawData: string;
      try {
        rawData = await fs.readFile(dbJsonPath, "utf-8");
      } catch (fileErr) {
        console.warn("Could not find db.json for seeding. Initializing with defaults:", fileErr);
        rawData = "{}";
      }

      const data = JSON.parse(rawData);

      const settingsDoc = {
        _id: "global_settings",
        stats: data.stats || [
          { label: "Years Experience", value: 35, suffix: "+", icon: "Award" },
          { label: "Research Scholars Guided", value: 85, suffix: "+", icon: "Users" },
          { label: "Ph.D Candidates", value: 10, suffix: "+", icon: "GraduationCap" },
          { label: "Students Trained", value: 1000, suffix: "+", icon: "BookOpen" }
        ],
        services: data.services || [],
        contactInfo: data.contactInfo || {
          directorName: "Prof. Dr. R. Rajendran",
          directorSub: "Director, SUN Academic Research & Training",
          address: "No.104/1, A.K. Swamy Nagar, 7th Street, Kilpauk, Chennai – 600010",
          phone: "98403 41412",
          email: "rajendra1234@gmail.com",
          officeHours: "9:00 AM – 8:00 PM (All Days)"
        },
        socialLinks: data.socialLinks || {
          facebook: "https://facebook.com",
          linkedin: "https://linkedin.com",
          instagram: "https://instagram.com",
          youtube: "https://youtube.com"
        },
        updatedAt: new Date().toISOString()
      };
      await settingsColl.insertOne(settingsDoc as any);

      if (data.enquiries && data.enquiries.length > 0) {
        const enquiriesColl = database.collection("enquiries");
        await enquiriesColl.insertMany(data.enquiries);
      }
      console.log("MongoDB successfully seeded initial data.");
    }
  } catch (err) {
    console.error("Failed to seed MongoDB:", err);
  }
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Extract host/database info from URI safely for logging
  const safeLogUri = uri.includes("@") ? uri.split("@")[1] : uri;
  console.log("Connecting to MongoDB database at:", safeLogUri);

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  await ensureDatabaseSeeded(db);

  cachedClient = client;
  cachedDb = db;
  return { client, db };
}
