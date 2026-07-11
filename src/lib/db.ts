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
  };
  socialLinks: {
    facebook: string;
    linkedin: string;
    instagram: string;
    youtube: string;
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

export const getDbData = createServerFn({ method: "GET" })
  .handler(async () => {
    const { connectToDatabase } = await import("./mongodb.server");
    const { db } = await connectToDatabase();

    const settingsDoc = await db.collection("settings").findOne({ _id: "global_settings" as any });
    const rawEnquiries = await db.collection("enquiries")
      .find({})
      .sort({ timestamp: -1 })
      .toArray();

    // Map out non-serializable ObjectId for JSON serialization
    const enquiries = rawEnquiries.map(({ _id, ...rest }) => rest) as DbData["enquiries"];

    const stats = settingsDoc?.stats || [];
    const services = settingsDoc?.services || [];
    const contactInfo = settingsDoc?.contactInfo || {
      directorName: "",
      directorSub: "",
      address: "",
      phone: "",
      email: "",
      officeHours: ""
    };
    const socialLinks = settingsDoc?.socialLinks || {
      facebook: "",
      linkedin: "",
      instagram: "",
      youtube: ""
    };

    return {
      stats,
      services,
      contactInfo,
      socialLinks,
      enquiries
    } as DbData;
  });

export const updateStats = createServerFn({ method: "POST" })
  .validator((stats: DbData["stats"]) => stats)
  .handler(async ({ data: stats }) => {
    const { connectToDatabase } = await import("./mongodb.server");
    const { db } = await connectToDatabase();

    await db.collection("settings").updateOne(
      { _id: "global_settings" as any },
      { $set: { stats, updatedAt: new Date().toISOString() } }
    );
    return { success: true };
  });

export const updateServices = createServerFn({ method: "POST" })
  .validator((services: DbData["services"]) => services)
  .handler(async ({ data: services }) => {
    const { connectToDatabase } = await import("./mongodb.server");
    const { db } = await connectToDatabase();

    await db.collection("settings").updateOne(
      { _id: "global_settings" as any },
      { $set: { services, updatedAt: new Date().toISOString() } }
    );
    return { success: true };
  });

export const updateContactInfo = createServerFn({ method: "POST" })
  .validator((contactInfo: DbData["contactInfo"]) => contactInfo)
  .handler(async ({ data: contactInfo }) => {
    const { connectToDatabase } = await import("./mongodb.server");
    const { db } = await connectToDatabase();

    await db.collection("settings").updateOne(
      { _id: "global_settings" as any },
      { $set: { contactInfo, updatedAt: new Date().toISOString() } }
    );
    return { success: true };
  });

export const updateSocialLinks = createServerFn({ method: "POST" })
  .validator((socialLinks: DbData["socialLinks"]) => socialLinks)
  .handler(async ({ data: socialLinks }) => {
    const { connectToDatabase } = await import("./mongodb.server");
    const { db } = await connectToDatabase();

    await db.collection("settings").updateOne(
      { _id: "global_settings" as any },
      { $set: { socialLinks, updatedAt: new Date().toISOString() } }
    );
    return { success: true };
  });

export const submitEnquiry = createServerFn({ method: "POST" })
  .validator((enquiry: { name: string; phone: string; email: string; message: string }) => enquiry)
  .handler(async ({ data: enquiry }) => {
    const { connectToDatabase } = await import("./mongodb.server");
    const { db } = await connectToDatabase();

    const newEnquiry = {
      ...enquiry,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
    };

    await db.collection("enquiries").insertOne(newEnquiry);
    return { success: true };
  });

export const deleteEnquiry = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { connectToDatabase } = await import("./mongodb.server");
    const { db } = await connectToDatabase();

    await db.collection("enquiries").deleteOne({ id });
    return { success: true };
  });
