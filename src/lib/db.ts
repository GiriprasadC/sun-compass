import { createServerFn } from "@tanstack/react-start";

export interface DbData {
  stats: Array<{
    label: string;
    value: number;
    suffix: string;
    icon: string;
  }>;
  services: Array<{
    id: string;
    icon: string;
    title: string;
    summary: string;
    items: string[];
    methodology?: string[];
    duration?: string;
    venue?: string;
    timing?: string;
  }>;
  contactInfo: {
    directorName: string;
    directorSub: string;
    address: string;
    phone: string;
    email: string;
    officeHours: string;
    mapEmbedUrl?: string;
  };
  socialLinks: {
    facebook: string;
    linkedin: string;
    instagram: string;
    youtube: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    experienceText: string;
    experienceSub: string;
    imageUrl?: string;
  };
  about: {
    name: string;
    designation: string;
    bio: string;
    credentials: string[];
    affiliations: string[];
    bulletPoints: string[];
    imageUrl?: string;
  };
  enquiries: Array<{
    id: string;
    name: string;
    phone: string;
    email: string;
    message: string;
    timestamp: string;
  }>;
}

const DEFAULT_DB_DATA: DbData = {
  stats: [
    { label: "Years Experience", value: 35, suffix: "+", icon: "Award" },
    { label: "Research Scholars Guided", value: 85, suffix: "+", icon: "Users" },
    { label: "Ph.D Candidates", value: 10, suffix: "+", icon: "GraduationCap" },
    { label: "Students Trained", value: 1000, suffix: "+", icon: "BookOpen" }
  ],
  services: [
    {
      id: "teachers-training",
      icon: "GraduationCap",
      title: "Teachers Training Programme",
      summary: "Capacity-building workshops for educators — covering pedagogy, life skills, leadership and classroom management.",
      items: [
        "Counselling for Student Development",
        "Soft Skill Training",
        "Employability Skills",
        "Leadership and Motivation",
        "Capacity Building",
        "Adolescent Characteristics",
        "Life Skills",
        "Managing Stress at Work",
        "Work-Life Balance",
        "Classroom Management",
        "Effective Teaching Methodology",
        "Emotional Intelligence"
      ],
      methodology: ["Lecture Presentation", "Group Discussion", "Case Study Analysis"],
      duration: "1–3 Days",
      venue: "Host Institution",
      timing: "9:00 AM – 4:00 PM"
    },
    {
      id: "phd-assistance",
      icon: "BookOpenCheck",
      title: "Ph.D. Assistance",
      summary: "End-to-end doctoral research support — from topic selection and proposal writing to viva preparation and publication.",
      items: [
        "Research Topic Selection",
        "Ph.D Proposal Writing",
        "Literature Review",
        "Questionnaire Development",
        "Tool Validation",
        "Research Methodology",
        "Data Collection",
        "SPSS Analysis",
        "Hypothesis Testing",
        "Thesis Editing",
        "Synopsis Preparation",
        "Plagiarism Checking",
        "Viva Preparation",
        "Research Paper Publication Support"
      ],
      methodology: [],
      duration: "",
      venue: "",
      timing: ""
    },
    {
      id: "psychological-assessment",
      icon: "BrainCircuit",
      title: "Psychological Assessment of Students",
      summary: "Standardised assessments to understand students' cognitive, emotional and career profiles.",
      items: [
        "IQ Assessment",
        "Memory Assessment (MQ)",
        "Emotional Intelligence (EQ)",
        "Personality Assessment",
        "Creativity Assessment",
        "Motivation Assessment",
        "Career Assessment"
      ],
      methodology: [],
      duration: "",
      venue: "",
      timing: ""
    },
    {
      id: "ias-coaching",
      icon: "Landmark",
      title: "IAS Coaching",
      summary: "Focused civil services preparation with foundation coaching, Psychology optional and interview guidance.",
      items: [
        "Foundation Coaching",
        "Psychology Optional",
        "Study Materials",
        "Mock Tests",
        "Interview Guidance"
      ],
      methodology: [],
      duration: "",
      venue: "",
      timing: ""
    }
  ],
  contactInfo: {
    directorName: "Prof. Dr. R. Rajendran",
    directorSub: "Director, SUN Academic Research & Training",
    address: "No.104/1, A.K. Swamy Nagar, 7th Street, Kilpauk, Chennai – 600010",
    phone: "98403 41412",
    email: "rajendra1234@gmail.com",
    officeHours: "9:00 AM – 8:00 PM (All Days)",
    mapEmbedUrl: ""
  },
  socialLinks: {
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com"
  },
  hero: {
    badge: "Chennai · Since 1989",
    title: "Empowering Research, Education & Professional Development",
    subtitle: "SUN Academic Research & Training partners with educators, scholars and institutions to deliver rigorous doctoral guidance, teacher capacity building, psychological assessments and civil services coaching.",
    experienceText: "35+ years",
    experienceSub: "of academic excellence",
    imageUrl: ""
  },
  about: {
    name: "Prof. Dr. R. Rajendran",
    designation: "Director, SUN Academic Research & Training, Chennai",
    bio: "A distinguished academician whose career took shape at Annamalai University, rising to Professor & Head of the Centre for Educational Management and Applied Science. Over three and a half decades, he has shaped generations of teachers, scholars and civil service aspirants across South India.",
    credentials: [
      "M.A.",
      "M.Ed.",
      "M.B.A.",
      "Ph.D.",
      "FBMS"
    ],
    affiliations: [
      "NITTTR",
      "Ministry of Education",
      "Tamil Nadu Government"
    ],
    bulletPoints: [
      "35+ years of teaching, research and academic experience.",
      "Guided 10 Candidates, 85 Research Scholars and numerous Ph.D. researchers."
    ],
    imageUrl: ""
  },
  enquiries: []
};

// Safe fallback JSON DB readers that prevent crashes on non-Node/Serverless environments
async function readFallbackJson(): Promise<DbData> {
  try {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    
    const cwd = typeof process !== "undefined" && typeof process.cwd === "function" ? process.cwd() : ".";
    const dbPath = path.resolve(cwd, "src/data/db.json");
    
    const raw = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(raw) as DbData;
  } catch (err) {
    console.warn("Failed to read fallback JSON db. Returning defaults:", (err as Error).message || err);
    return DEFAULT_DB_DATA;
  }
}

async function writeFallbackJson(data: DbData): Promise<void> {
  try {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    
    const cwd = typeof process !== "undefined" && typeof process.cwd === "function" ? process.cwd() : ".";
    const dbPath = path.resolve(cwd, "src/data/db.json");
    
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write fallback JSON db:", (err as Error).message || err);
  }
}

export const getDbData = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const { connectToDatabase } = await import("./mongodb.server");
      const { db } = await connectToDatabase();

      const settingsDoc = await db.collection("settings").findOne({ _id: "global_settings" as any });
      const rawEnquiries = await db.collection("enquiries")
        .find({})
        .sort({ timestamp: -1 })
        .toArray();

      // Map out non-serializable ObjectId for JSON serialization
      const enquiries = rawEnquiries.map(({ _id, ...rest }) => rest) as DbData["enquiries"];

      const stats = settingsDoc?.stats || DEFAULT_DB_DATA.stats;
      const services = settingsDoc?.services || DEFAULT_DB_DATA.services;
      const contactInfo = settingsDoc?.contactInfo || DEFAULT_DB_DATA.contactInfo;
      const socialLinks = settingsDoc?.socialLinks || DEFAULT_DB_DATA.socialLinks;
      const hero = settingsDoc?.hero || DEFAULT_DB_DATA.hero;
      const about = settingsDoc?.about || DEFAULT_DB_DATA.about;

      return {
        stats,
        services,
        contactInfo,
        socialLinks,
        hero,
        about,
        enquiries
      } as DbData;
    } catch (err) {
      console.warn("MongoDB connection failed, falling back to local JSON file db:", (err as Error).message || err);
      return await readFallbackJson();
    }
  });

export const updateStats = createServerFn({ method: "POST" })
  .validator((stats: DbData["stats"]) => stats)
  .handler(async ({ data: stats }) => {
    try {
      const { connectToDatabase } = await import("./mongodb.server");
      const { db } = await connectToDatabase();

      await db.collection("settings").updateOne(
        { _id: "global_settings" as any },
        { $set: { stats, updatedAt: new Date().toISOString() } }
      );
    } catch (err) {
      console.warn("MongoDB update stats failed, falling back to local JSON db:", (err as Error).message || err);
      const data = await readFallbackJson();
      data.stats = stats;
      await writeFallbackJson(data);
    }
    return { success: true };
  });

export const updateServices = createServerFn({ method: "POST" })
  .validator((services: DbData["services"]) => services)
  .handler(async ({ data: services }) => {
    try {
      const { connectToDatabase } = await import("./mongodb.server");
      const { db } = await connectToDatabase();

      await db.collection("settings").updateOne(
        { _id: "global_settings" as any },
        { $set: { services, updatedAt: new Date().toISOString() } }
      );
    } catch (err) {
      console.warn("MongoDB update services failed, falling back to local JSON db:", (err as Error).message || err);
      const data = await readFallbackJson();
      data.services = services;
      await writeFallbackJson(data);
    }
    return { success: true };
  });

export const updateContactInfo = createServerFn({ method: "POST" })
  .validator((contactInfo: DbData["contactInfo"]) => contactInfo)
  .handler(async ({ data: contactInfo }) => {
    try {
      const { connectToDatabase } = await import("./mongodb.server");
      const { db } = await connectToDatabase();

      await db.collection("settings").updateOne(
        { _id: "global_settings" as any },
        { $set: { contactInfo, updatedAt: new Date().toISOString() } }
      );
    } catch (err) {
      console.warn("MongoDB update contact info failed, falling back to local JSON db:", (err as Error).message || err);
      const data = await readFallbackJson();
      data.contactInfo = contactInfo;
      await writeFallbackJson(data);
    }
    return { success: true };
  });

export const updateSocialLinks = createServerFn({ method: "POST" })
  .validator((socialLinks: DbData["socialLinks"]) => socialLinks)
  .handler(async ({ data: socialLinks }) => {
    try {
      const { connectToDatabase } = await import("./mongodb.server");
      const { db } = await connectToDatabase();

      await db.collection("settings").updateOne(
        { _id: "global_settings" as any },
        { $set: { socialLinks, updatedAt: new Date().toISOString() } }
      );
    } catch (err) {
      console.warn("MongoDB update social links failed, falling back to local JSON db:", (err as Error).message || err);
      const data = await readFallbackJson();
      data.socialLinks = socialLinks;
      await writeFallbackJson(data);
    }
    return { success: true };
  });

export const updateHero = createServerFn({ method: "POST" })
  .validator((hero: DbData["hero"]) => hero)
  .handler(async ({ data: hero }) => {
    try {
      const { connectToDatabase } = await import("./mongodb.server");
      const { db } = await connectToDatabase();

      await db.collection("settings").updateOne(
        { _id: "global_settings" as any },
        { $set: { hero, updatedAt: new Date().toISOString() } }
      );
    } catch (err) {
      console.warn("MongoDB update hero failed, falling back to local JSON db:", (err as Error).message || err);
      const data = await readFallbackJson();
      data.hero = hero;
      await writeFallbackJson(data);
    }
    return { success: true };
  });

export const updateAbout = createServerFn({ method: "POST" })
  .validator((about: DbData["about"]) => about)
  .handler(async ({ data: about }) => {
    try {
      const { connectToDatabase } = await import("./mongodb.server");
      const { db } = await connectToDatabase();

      await db.collection("settings").updateOne(
        { _id: "global_settings" as any },
        { $set: { about, updatedAt: new Date().toISOString() } }
      );
    } catch (err) {
      console.warn("MongoDB update about failed, falling back to local JSON db:", (err as Error).message || err);
      const data = await readFallbackJson();
      data.about = about;
      await writeFallbackJson(data);
    }
    return { success: true };
  });

export const submitEnquiry = createServerFn({ method: "POST" })
  .validator((enquiry: { name: string; phone: string; email: string; message: string }) => enquiry)
  .handler(async ({ data: enquiry }) => {
    const newEnquiry = {
      ...enquiry,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
    };

    try {
      const { connectToDatabase } = await import("./mongodb.server");
      const { db } = await connectToDatabase();

      await db.collection("enquiries").insertOne(newEnquiry);
    } catch (err) {
      console.warn("MongoDB submit enquiry failed, falling back to local JSON db:", (err as Error).message || err);
      const data = await readFallbackJson();
      data.enquiries = [newEnquiry, ...(data.enquiries || [])];
      await writeFallbackJson(data);
    }
    return { success: true };
  });

export const deleteEnquiry = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const { connectToDatabase } = await import("./mongodb.server");
      const { db } = await connectToDatabase();

      await db.collection("enquiries").deleteOne({ id });
    } catch (err) {
      console.warn("MongoDB delete enquiry failed, falling back to local JSON db:", (err as Error).message || err);
      const data = await readFallbackJson();
      data.enquiries = (data.enquiries || []).filter((e) => e.id !== id);
      await writeFallbackJson(data);
    }
    return { success: true };
  });

export const uploadImage = createServerFn({ method: "POST" })
  .validator((data: { filename: string; mimeType: string; base64Data: string }) => data)
  .handler(async ({ data }) => {
    try {
      const fs = await import("node:fs/promises");
      const path = await import("node:path");

      const buffer = Buffer.from(data.base64Data, "base64");
      const ext = path.extname(data.filename) || ".jpg";
      const filename = `${Math.random().toString(36).substring(2, 9)}${ext}`;
      
      const cwd = typeof process !== "undefined" && typeof process.cwd === "function" ? process.cwd() : ".";
      const uploadDir = path.resolve(cwd, "public/uploads");
      
      // Ensure uploads directory exists
      await fs.mkdir(uploadDir, { recursive: true });
      
      const filePath = path.resolve(uploadDir, filename);
      await fs.writeFile(filePath, buffer);
      
      return { success: true, url: `/uploads/${filename}` };
    } catch (err) {
      console.error("Failed to upload image:", err);
      return { success: false, error: (err as Error).message || String(err) };
    }
  });
