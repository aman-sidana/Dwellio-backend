require("dotenv").config();
const sequelize = require("./db/db");
const { User, Property, PropertyImage, Amenity } = require("./model");

const amenitiesData = [
  { name: "Swimming Pool", icon: "waves" },
  { name: "Gymnasium & Fitness", icon: "dumbbell" },
  { name: "24x7 Security & CCTV", icon: "shield-check" },
  { name: "Reserved Car Parking", icon: "car" },
  { name: "100% Power Backup", icon: "zap" },
  { name: "High-Speed Elevators", icon: "arrow-up-circle" },
  { name: "Clubhouse & Community Hall", icon: "home" },
  { name: "Landscaped Gardens & Park", icon: "trees" },
  { name: "Kids Play Area", icon: "smile" },
  { name: "Jogging & Walking Track", icon: "activity" },
];

const usersData = [
  {
    name: "Aman Sharma",
    email: "aman.owner@dwellio.com",
    password: "Password@123",
    phone: "+91 98765 43210",
    role: "seller",
  },
  {
    name: "Priya Nair (Prestige Realtors)",
    email: "priya.agent@dwellio.com",
    password: "Password@123",
    phone: "+91 98112 34567",
    role: "agent",
  },
  {
    name: "Rahul Verma",
    email: "rahul.buyer@gmail.com",
    password: "Password@123",
    phone: "+91 99887 76655",
    role: "buyer",
  },
];

const propertiesData = [
  {
    title: "3 BHK Ultra Luxury Skyline Apartment with Sea View",
    description: "Experience world-class living in this sea-facing 3 BHK luxury apartment in Bandra West. Equipped with Italian marble flooring, smart home automation, expansive balconies offering panoramic Arabian Sea views, and top-tier amenities.",
    listingType: "sale",
    propertyType: "apartment",
    price: 38500000,
    priceDisplay: "₹3.85 Cr",
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    areaSqFt: 1850,
    furnishing: "fully_furnished",
    city: "Mumbai",
    locality: "Bandra West",
    address: "Tower 4, Sea Crest Heights, Carter Road, Bandra West",
    pincode: "400050",
    possessionStatus: "ready_to_move",
    floorNo: 18,
    totalFloors: 32,
    parking: 2,
    status: "available",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
    ],
    amenityNames: ["Swimming Pool", "Gymnasium & Fitness", "24x7 Security & CCTV", "Reserved Car Parking", "High-Speed Elevators", "Clubhouse & Community Hall"],
  },
  {
    title: "4 BHK Signature Independent Villa with Private Lawn",
    description: "Grand contemporary 4 BHK villa located in prime Whitefield. Features private landscaped garden, home theatre room, personal plunge pool, servant quarters, and imported fittings throughout.",
    listingType: "sale",
    propertyType: "villa",
    price: 45000000,
    priceDisplay: "₹4.50 Cr",
    bedrooms: 4,
    bathrooms: 5,
    balconies: 3,
    areaSqFt: 3400,
    furnishing: "semi_furnished",
    city: "Bangalore",
    locality: "Whitefield",
    address: "Villa 12, The Palm Meadows Boulevard, Whitefield",
    pincode: "560066",
    possessionStatus: "ready_to_move",
    floorNo: 1,
    totalFloors: 2,
    parking: 3,
    status: "available",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    ],
    amenityNames: ["Swimming Pool", "Gymnasium & Fitness", "Reserved Car Parking", "100% Power Backup", "Landscaped Gardens & Park"],
  },
  {
    title: "2 BHK Modern High-Rise Apartment near Metro Station",
    description: "Contemporary 2 BHK residential apartment in Sector 62 Gurgaon with seamless connectivity to Golf Course Extension and Cyber Hub. Sunlit corner apartment with modular kitchen and wooden flooring in master bedroom.",
    listingType: "sale",
    propertyType: "apartment",
    price: 12500000,
    priceDisplay: "₹1.25 Cr",
    bedrooms: 2,
    bathrooms: 2,
    balconies: 2,
    areaSqFt: 1180,
    furnishing: "semi_furnished",
    city: "Gurgaon",
    locality: "Sector 62",
    address: "Tower B, Pioneer Araya Residences, Sector 62",
    pincode: "122001",
    possessionStatus: "ready_to_move",
    floorNo: 9,
    totalFloors: 24,
    parking: 1,
    status: "available",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    ],
    amenityNames: ["24x7 Security & CCTV", "Reserved Car Parking", "High-Speed Elevators", "100% Power Backup", "Kids Play Area"],
  },
  {
    title: "Spacious 3 BHK Garden View Flat for Rent in Koregaon Park",
    description: "Fully furnished high-end 3 BHK apartment available for immediate rental. Close to premier cafes, Osho ashram, and IT parks. Includes complete furniture, ACs in all rooms, and premium modular kitchen.",
    listingType: "rent",
    propertyType: "apartment",
    price: 65000,
    priceDisplay: "₹65,000/mo",
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    areaSqFt: 1650,
    furnishing: "fully_furnished",
    city: "Pune",
    locality: "Koregaon Park",
    address: "Lane 7, Hermes Heritage, Koregaon Park",
    pincode: "411001",
    possessionStatus: "ready_to_move",
    floorNo: 5,
    totalFloors: 11,
    parking: 2,
    status: "available",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    ],
    amenityNames: ["Gymnasium & Fitness", "Reserved Car Parking", "High-Speed Elevators", "24x7 Security & CCTV"],
  },
  {
    title: "Premium 3 BHK Gated Community Home for Rent in Gachibowli",
    description: "Located right in the heart of Hyderabad's financial and IT corridor. Ideal for IT executives and families. Club house, tennis court, supermarket on campus, and 24-hr security.",
    listingType: "rent",
    propertyType: "apartment",
    price: 48000,
    priceDisplay: "₹48,000/mo",
    bedrooms: 3,
    bathrooms: 3,
    balconies: 1,
    areaSqFt: 1720,
    furnishing: "semi_furnished",
    city: "Hyderabad",
    locality: "Gachibowli",
    address: "Block C, My Home Bhooja, Gachibowli",
    pincode: "500032",
    possessionStatus: "ready_to_move",
    floorNo: 14,
    totalFloors: 36,
    parking: 2,
    status: "available",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    ],
    amenityNames: ["Swimming Pool", "Gymnasium & Fitness", "Clubhouse & Community Hall", "Jogging & Walking Track"],
  },
  {
    title: "Corner Residential Plot in Gated Township near International Airport",
    description: "RERA approved East-facing freehold residential villa plot. Clear titles, wide 40ft blacktop roads, underground cabling, water connection, and lush green avenues.",
    listingType: "sale",
    propertyType: "plot",
    price: 7800000,
    priceDisplay: "₹78 Lac",
    bedrooms: null,
    bathrooms: null,
    balconies: 0,
    areaSqFt: 2400,
    furnishing: "unfurnished",
    city: "Bangalore",
    locality: "Devanahalli",
    address: "Plot 45, Ozone Urbana Enclave, Devanahalli",
    pincode: "562110",
    possessionStatus: "ready_to_move",
    floorNo: null,
    totalFloors: null,
    parking: 0,
    status: "available",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    ],
    amenityNames: ["24x7 Security & CCTV", "Landscaped Gardens & Park"],
  },
];

async function seedDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Connected to MySQL for seeding...");

    await sequelize.sync({ alter: true });
    console.log("Database synced...");

    // Seed Amenities
    const amenities = [];
    for (const item of amenitiesData) {
      const [amenity] = await Amenity.findOrCreate({
        where: { name: item.name },
        defaults: item,
      });
      amenities.push(amenity);
    }
    console.log(`Seeded ${amenities.length} amenities.`);

    // Seed Users
    const users = [];
    for (const u of usersData) {
      const [user] = await User.findOrCreate({
        where: { email: u.email },
        defaults: u,
      });
      users.push(user);
    }
    console.log(`Seeded ${users.length} users.`);

    // Check existing properties
    const existingCount = await Property.count();
    if (existingCount === 0) {
      for (let i = 0; i < propertiesData.length; i++) {
        const pData = propertiesData[i];
        const assignedUser = users[i % users.length];

        const property = await Property.create({
          userId: assignedUser.userId,
          title: pData.title,
          description: pData.description,
          listingType: pData.listingType,
          propertyType: pData.propertyType,
          price: pData.price,
          priceDisplay: pData.priceDisplay,
          bedrooms: pData.bedrooms,
          bathrooms: pData.bathrooms,
          balconies: pData.balconies,
          areaSqFt: pData.areaSqFt,
          furnishing: pData.furnishing,
          city: pData.city,
          locality: pData.locality,
          address: pData.address,
          pincode: pData.pincode,
          possessionStatus: pData.possessionStatus,
          floorNo: pData.floorNo,
          totalFloors: pData.totalFloors,
          parking: pData.parking,
          status: pData.status,
          featured: pData.featured,
        });

        // Insert images
        const imgEntries = pData.images.map((url, idx) => ({
          propertyId: property.propertyId,
          imageUrl: url,
          isPrimary: idx === 0,
        }));
        await PropertyImage.bulkCreate(imgEntries);

        // Associate Amenities
        const matchedAmenities = amenities.filter((a) =>
          pData.amenityNames.includes(a.name)
        );
        if (matchedAmenities.length > 0) {
          await property.setAmenities(matchedAmenities.map((a) => a.amenityId));
        }
      }
      console.log(`Successfully seeded ${propertiesData.length} properties with images & amenities!`);
    } else {
      console.log(`Properties already exist (${existingCount} found). Skipping property seeding.`);
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seedDatabase();
