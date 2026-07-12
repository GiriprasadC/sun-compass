import { MongoClient, Db } from "mongodb";

const uri = process.env.sunacademic2026_MONGODB_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/sun-compass";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function ensureDatabaseSeeded(database: Db) {
  try {
    const settingsColl = database.collection("settings");
    const count = await settingsColl.countDocuments();
    
    if (count > 0) {
      // Auto-migrate old database entries if they are still on defaults
      const currentSettings = await settingsColl.findOne({ _id: "global_settings" as any });
      if (currentSettings) {
        let needsUpdate = false;
        const updateDoc: any = {};

        if (currentSettings.contactInfo?.email === "rajendra1234@gmail.com") {
          updateDoc["contactInfo.email"] = "rajendra.2314@gmail.com";
          needsUpdate = true;
        }
        
        if (currentSettings.about?.designation === "Director, SUN Academic Research & Training, Chennai") {
          updateDoc["about.designation"] = "Director";
          needsUpdate = true;
        }

        if (
          currentSettings.about?.affiliations &&
          (currentSettings.about.affiliations.includes("Tamil Nadu Government") ||
           currentSettings.about.affiliations.includes("NITTTR, Ministry of Education, Govt. of India"))
        ) {
          updateDoc["about.affiliations"] = [
            "Annamalai University",
            "Madras University",
            "NITTTR, Ministry of Education, Government of India"
          ];
          updateDoc["about.bulletPoints"] = [
            "35+ years of teaching, research and academic experience.",
            "Guided 10+ Ph.D. Candidates and trained over 90,000 teachers."
          ];
          needsUpdate = true;
        }

        if (currentSettings.stats) {
          const hasOldLabels = currentSettings.stats.some((s: any) => 
            s.label === "Research Scholars Guided" || 
            s.label === "Ph.D Candidates" || 
            s.label === "Teachers Trained" ||
            (s.label === "Teachers are Trained" && s.suffix === "+")
          );
          if (hasOldLabels) {
            updateDoc["stats"] = [
              { label: "Years Experience", value: 35, suffix: "+", icon: "Award" },
              { label: "Ph.D. Awarded", value: 10, suffix: "+", icon: "GraduationCap" },
              { label: "Teachers are Trained", value: 90000, suffix: "", icon: "Users" },
              { label: "Students Trained", value: 1000, suffix: "+", icon: "BookOpen" }
            ];
            needsUpdate = true;
          }
        }

        if (currentSettings.services) {
          let servicesChanged = false;
          const newServices = currentSettings.services.map((service: any) => {
            if (service.id === "phd-assistance" && service.items.includes("Research Topic Selection")) {
              servicesChanged = true;
              return {
                ...service,
                items: [
                  "Psychology",
                  "Commerce",
                  "Management",
                  "Education",
                  "Sociology",
                  "Physical Education",
                  "Design & Fashion Technology",
                  "Hotel Management",
                  "Health & Hospital Management"
                ],
                methodology: []
              };
            }
            if (service.id === "psychological-assessment" && 
                (service.title === "Psychological Assessment of Students" || 
                 service.title === "Counselling Psychologist & Assessment of Students")) {
              servicesChanged = true;
              return {
                ...service,
                title: "Counselling & Assessment of Students",
                methodology: []
              };
            }
            if (service.id === "ias-coaching" && service.methodology && service.methodology.length > 0) {
              servicesChanged = true;
              return {
                ...service,
                methodology: []
              };
            }
            return service;
          });
          if (servicesChanged) {
            updateDoc["services"] = newServices;
            needsUpdate = true;
          }
        }

        if (!currentSettings.consultationWidget) {
          updateDoc["consultationWidget"] = {
            enabled: true,
            labelSmall: "Click Here For",
            labelLarge: "Free Consultation",
            phoneOverride: ""
          };
          needsUpdate = true;
        }

        if (needsUpdate) {
          console.log("Migration/Update script: Applying corrections from handwritten note...");
          await settingsColl.updateOne(
            { _id: "global_settings" as any },
            { $set: { ...updateDoc, updatedAt: new Date().toISOString() } }
          );
          console.log("Migration/Update script: Successfully patched settings database.");
        }
      }
    }

    if (count === 0) {
      console.log("MongoDB 'settings' collection is empty. Seeding initial data from db.json...");
      
      // Load Node modules dynamically to prevent loading errors in environments without fs support (e.g. Cloudflare)
      const fs = await import("node:fs/promises");
      const path = await import("node:path");
      
      const cwd = typeof process !== "undefined" && typeof process.cwd === "function" ? process.cwd() : ".";
      const dbJsonPath = path.resolve(cwd, "src/data/db.json");
      
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
          { label: "Ph.D. Awarded", value: 10, suffix: "+", icon: "GraduationCap" },
          { label: "Teachers are Trained", value: 90000, suffix: "", icon: "Users" },
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
        hero: data.hero || {
          badge: "Chennai · Since 1989",
          title: "Empowering Research, Education & Professional Development",
          subtitle: "SUN Academic Research & Training partners with educators, scholars and institutions to deliver rigorous doctoral guidance, teacher capacity building, psychological assessments and civil services coaching.",
          experienceText: "35+ years",
          experienceSub: "of academic excellence",
          imageUrl: ""
        },
        about: data.about || {
          name: "Prof. Dr. R. Rajendran",
          designation: "Director",
          bio: "A distinguished academician whose career took shape at Annamalai University, rising to Professor & Head of the Centre for Educational Management and Applied Science. Over three and a half decades, he has shaped generations of teachers, scholars and civil service aspirants across South India.",
          credentials: ["M.A.", "M.Ed.", "M.B.A.", "Ph.D.", "FBMS"],
          affiliations: [
            "Annamalai University",
            "Madras University",
            "NITTTR, Ministry of Education, Government of India"
          ],
          bulletPoints: [
            "35+ years of teaching, research and academic experience.",
            "Guided 10+ Ph.D. Candidates and trained over 90,000 teachers."
          ],
          imageUrl: ""
        },
        sectionOrder: data.sectionOrder || [
          "hero",
          "about",
          "whyChooseUs",
          "services",
          "contact"
        ],
        consultationWidget: data.consultationWidget || {
          enabled: true,
          labelSmall: "Click Here For",
          labelLarge: "Free Consultation",
          phoneOverride: ""
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

  const safeLogUri = uri.includes("@") ? uri.split("@")[1] : uri;
  console.log("Connecting to MongoDB database at:", safeLogUri);

  const client = new MongoClient(uri, {
    connectTimeoutMS: 2000,
    serverSelectionTimeoutMS: 2000,
  });
  await client.connect();
  const db = client.db();

  await ensureDatabaseSeeded(db);

  cachedClient = client;
  cachedDb = db;
  return { client, db };
}
