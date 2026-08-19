import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🔥 Starting Embera House (Mumbai) Database Seeding...");

  // Clean existing records in reverse dependency order
  await prisma.adminAuditLog.deleteMany();
  await prisma.favouriteDish.deleteMany();
  await prisma.reservationStatusHistory.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.restaurantTable.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.event.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.journalPost.deleteMany();
  await prisma.journalCategory.deleteMany();
  await prisma.contactEnquiry.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.userPreference.deleteMany();
  await prisma.user.deleteMany();
  await prisma.openingHour.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.siteSetting.deleteMany();

  // 1. Restaurant Core Info
  const restaurant = await prisma.restaurant.create({
    data: {
      name: "EMBERA HOUSE",
      tagline: "Fire. Flavour. Moments.",
      description:
        "An ode to ancestral wood-fired craftsmanship, heirloom Indian botanicals, and coastal charcoal embers. At Embera House Mumbai, open fires, regional terroir, and genuine hospitality converge into an unforgettable luxury dining journey.",
      address: "Block 4, The Mills, Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013",
      phone: "+91 22 6789 4400",
      email: "reservations@emberahouse.com",
      cancellationHoursLimit: 6,
      dressCode: "Smart Elegant — tailored evening attire preferred. Slippers and gym sportswear are politely declined.",
    },
  });

  // 2. Opening Hours
  const days = [
    { day: 1, meal: "DINNER", open: "18:30", close: "23:30" }, // Mon
    { day: 2, meal: "LUNCH", open: "12:00", close: "15:30" },  // Tue
    { day: 2, meal: "DINNER", open: "18:30", close: "23:30" },
    { day: 3, meal: "LUNCH", open: "12:00", close: "15:30" },  // Wed
    { day: 3, meal: "DINNER", open: "18:30", close: "23:30" },
    { day: 4, meal: "LUNCH", open: "12:00", close: "15:30" },  // Thu
    { day: 4, meal: "DINNER", open: "18:30", close: "23:30" },
    { day: 5, meal: "LUNCH", open: "12:00", close: "15:30" },  // Fri
    { day: 5, meal: "DINNER", open: "18:00", close: "24:00" },
    { day: 6, meal: "LUNCH", open: "12:00", close: "16:00" },  // Sat
    { day: 6, meal: "DINNER", open: "18:00", close: "24:00" },
    { day: 0, meal: "LUNCH", open: "12:30", close: "16:30" },  // Sun
    { day: 0, meal: "DINNER", open: "18:00", close: "23:30" },
  ];

  for (const h of days) {
    await prisma.openingHour.create({
      data: {
        dayOfWeek: h.day,
        mealType: h.meal,
        openTime: h.open,
        closeTime: h.close,
        isClosed: false,
      },
    });
  }

  // 3. Restaurant Tables
  const tablesData = [
    // Main Dining Room
    { tableNumber: "M01", room: "MAIN_DINING", minCapacity: 1, maxCapacity: 2 },
    { tableNumber: "M02", room: "MAIN_DINING", minCapacity: 1, maxCapacity: 2 },
    { tableNumber: "M03", room: "MAIN_DINING", minCapacity: 2, maxCapacity: 4 },
    { tableNumber: "M04", room: "MAIN_DINING", minCapacity: 2, maxCapacity: 4 },
    { tableNumber: "M05", room: "MAIN_DINING", minCapacity: 4, maxCapacity: 6 },
    { tableNumber: "M06", room: "MAIN_DINING", minCapacity: 4, maxCapacity: 6 },
    { tableNumber: "M07", room: "MAIN_DINING", minCapacity: 6, maxCapacity: 8 },
    // Terrace
    { tableNumber: "T01", room: "TERRACE", minCapacity: 1, maxCapacity: 2 },
    { tableNumber: "T02", room: "TERRACE", minCapacity: 2, maxCapacity: 4 },
    { tableNumber: "T03", room: "TERRACE", minCapacity: 2, maxCapacity: 4 },
    { tableNumber: "T04", room: "TERRACE", minCapacity: 4, maxCapacity: 6 },
    // Chef's Table Counter
    { tableNumber: "CT01", room: "CHEFS_TABLE", minCapacity: 1, maxCapacity: 4 },
    { tableNumber: "CT02", room: "CHEFS_TABLE", minCapacity: 1, maxCapacity: 4 },
    // Private Dining Salon
    { tableNumber: "PDR01", room: "PRIVATE_DINING", minCapacity: 8, maxCapacity: 16 },
  ];

  for (const t of tablesData) {
    await prisma.restaurantTable.create({ data: t });
  }

  // 4. Users (Admin & Customer)
  const passwordHash = await bcrypt.hash("EmberaAdmin2026!", 10);
  const userPasswordHash = await bcrypt.hash("Customer2026!", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Chef Mateo Vane",
      email: "admin@emberahouse.com",
      passwordHash: passwordHash,
      role: "SUPER_ADMIN",
      phone: "+91 98201 44520",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80",
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: "Ananya Deshmukh",
      email: "manager@emberahouse.com",
      passwordHash: passwordHash,
      role: "MANAGER",
      phone: "+91 98201 55300",
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "Aarav Mehta",
      email: "aarav.mehta@mumbai.in",
      passwordHash: userPasswordHash,
      role: "CUSTOMER",
      phone: "+91 98200 11223",
      preferences: {
        create: {
          dietaryNotes: "Gluten-conscious, prefers natural biodynamic wines and coastal seafood",
          allergies: "Shellfish",
          seatingPreference: "MAIN_DINING",
          specialNotes: "Prefers quiet booth overlooking open wood hearth.",
        },
      },
    },
  });

  // 5. Menu Categories & 32 Artisan Dishes in Indian Rupees (INR)
  const categories = [
    {
      name: "Small Plates & Crudo",
      slug: "small-plates",
      description: "Delicate bites, cold-smoked seafood, and heirloom garden crudo.",
      sortOrder: 1,
      items: [
        {
          name: "Charred Morel & Truffle Galouti",
          slug: "charred-morel-truffle-galouti",
          description: "Smoked Kashmiri morels, black truffle butter, saffron sheermal crisp, pickled shallots.",
          price: 1250,
          isChefPick: true,
          isSignature: true,
          dietaryFlags: "VEGETARIAN",
          allergens: "Dairy, Gluten",
          ingredients: "Kashmiri Morels, Perigord Truffle, Cultured Ghee, Saffron, Spiced Sheermal",
          winePairing: "2019 Domaine Dujac Morey-Saint-Denis",
          chefNote: "Smoked over dried vetiver roots and sweet birch for 4 hours.",
          imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85",
        },
        {
          name: "Ember-Charred Malabar Scallops",
          slug: "ember-charred-malabar-scallops",
          description: "Hand-dived scallops in half shell, bone marrow dashi butter, curry leaf hazelnut crumble, preserved green mango.",
          price: 1650,
          isChefPick: true,
          isSignature: true,
          dietaryFlags: "GLUTEN_FREE",
          allergens: "Molluscs, Tree Nuts, Dairy",
          ingredients: "Malabar Scallops, Smoked Bone Marrow, Curry Leaf Crisp, Green Mango Emulsion",
          winePairing: "2020 Meursault 'Les Narvaux', Domaine Ballot-Millot",
          chefNote: "Flash-charred on white babool charcoal for precisely 38 seconds.",
          imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=900&q=85",
        },
        {
          name: "Smoked Burrata & Charred Heirloom Tomato",
          slug: "smoked-burrata-heirloom-tomato",
          description: "Birch-smoked burrata, fermented chili jaggery glaze, toasted sourdough cracker, basil oil.",
          price: 950,
          isChefPick: false,
          isSignature: false,
          dietaryFlags: "VEGETARIAN",
          allergens: "Dairy, Gluten",
          ingredients: "Artisanal Burrata, Organic Pune Tomatoes, Byadagi Chili Honey, Sourdough",
          winePairing: "2022 Gavi di Gavi, Bruno Broglia, Piedmont",
          chefNote: "The burrata is cold-smoked with Himalayan cedarwood.",
          imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=900&q=85",
        },
        {
          name: "Konkan Crab & Caviar Tartlet",
          slug: "konkan-crab-caviar-tartlet",
          description: "Hand-picked mud crab, roasted coconut bisque cream, Oscietra caviar, crisp curry leaf shell.",
          price: 1850,
          isChefPick: true,
          isSignature: false,
          dietaryFlags: "NUT_FREE",
          allergens: "Crustaceans, Fish, Dairy, Gluten",
          ingredients: "Konkan Blue Crab, Oscietra Caviar, Coconut Milk, Kaffir Lime, Rice Tartlet",
          winePairing: "NV Champagne Billecart-Salmon Brut Rosé",
          chefNote: "A tribute to the pristine coastal waters of Maharashtra.",
          imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=85",
        },
      ],
    },
    {
      name: "Starters from the Hearth",
      slug: "starters",
      description: "Charred appetizers cooked directly over embers.",
      sortOrder: 2,
      items: [
        {
          name: "Wood-Fired Nilgiri Lamb Chops",
          slug: "nilgiri-lamb-chops",
          description: "Smoked green herb marinade, charred mint chutney, pickled baby radishes, smoked sea salt.",
          price: 1950,
          isChefPick: true,
          isSignature: true,
          dietaryFlags: "GLUTEN_FREE, DAIRY_FREE",
          allergens: "None",
          ingredients: "Grass-Fed Lamb, Fresh Mint, Coriander, Green Peppercorns, Guntur Chili",
          winePairing: "2018 Côte-Rôtie 'Ampodium', Domaine René Rostaing",
          chefNote: "Seared over high heat on mango wood coals.",
          imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85",
        },
        {
          name: "Himalayan Morel & Truffle Kulcha",
          slug: "morel-truffle-kulcha",
          description: "Clay tandoor fired mini kulcha stuffed with wild morels and goat cheese, brushed with smoked cultured butter.",
          price: 850,
          isChefPick: false,
          isSignature: true,
          dietaryFlags: "VEGETARIAN",
          allergens: "Gluten, Dairy",
          ingredients: "Kashmiri Guchhi, Chevre Goat Cheese, Black Truffle Oil, Sourdough Dough",
          winePairing: "2020 Barolo 'Castiglione', Vietti, Piedmont",
          chefNote: "Baked at 400°C on clay walls.",
          imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=85",
        },
        {
          name: "Charred Tiger Prawns in Kaffir Butter",
          slug: "charred-tiger-prawns",
          description: "Jumbo Arabian Sea prawns, roasted garlic emulsion, smoked kokum reduction, coastal herbs.",
          price: 1750,
          isChefPick: true,
          isSignature: false,
          dietaryFlags: "GLUTEN_FREE",
          allergens: "Crustaceans, Dairy",
          ingredients: "Arabian Sea Prawns, Kokum, Curry Leaves, Garlic, Brown Butter",
          winePairing: "2021 Chablis 1er Cru 'Montmains', Domaine William Fèvre",
          chefNote: "Charred in iron skewers directly over open embers.",
          imageUrl: "https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=900&q=85",
        },
        {
          name: "Ash-Roasted Sweet Potato & Whipped Feta",
          slug: "ash-roasted-sweet-potato",
          description: "Coals-buried purple sweet potato, spiced jaggery glaze, smoked chili oil, roasted pumpkin seeds.",
          price: 750,
          isChefPick: false,
          isSignature: false,
          dietaryFlags: "VEGETARIAN, GLUTEN_FREE",
          allergens: "Dairy",
          ingredients: "Organic Sweet Potato, Goat Feta, Tamarind Jaggery Reduction, Anise Oil",
          winePairing: "2021 Grüner Veltliner, Weingut Knoll, Wachau",
          chefNote: "Roasted slow under the ash bed for three hours.",
          imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85",
        },
      ],
    },
    {
      name: "From the Open Fire",
      slug: "from-the-fire",
      description: "Large format wood-roasted signatures.",
      sortOrder: 3,
      items: [
        {
          name: "24-Hour Slow-Cooked Awadhi Raan",
          slug: "slow-cooked-awadhi-raan",
          description: "Braised & ember-charred leg of young lamb, saffron jus, crispy garlic flakes, smoked bone marrow.",
          price: 3400,
          isChefPick: true,
          isSignature: true,
          dietaryFlags: "GLUTEN_FREE",
          allergens: "Dairy",
          ingredients: "Baby Lamb Leg, Saffron, Rose Petals, Ghee, Caramelized Onion Stock",
          winePairing: "2016 Château Pontet-Canet, Pauillac, Bordeaux",
          chefNote: "Marinated with 21 royal spices and finished over oak embers.",
          imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85",
        },
        {
          name: "Wood-Fired Whole Black Pomfret",
          slug: "wood-fired-black-pomfret",
          description: "Wild Konkan catch, recheado spice rub, roasted banana leaf wrap, burnt lime.",
          price: 2400,
          isChefPick: true,
          isSignature: true,
          dietaryFlags: "GLUTEN_FREE, DAIRY_FREE",
          allergens: "Fish",
          ingredients: "Fresh Black Pomfret, Toddy Vinegar, Red Kashmiri Chilies, Mustard Seeds",
          winePairing: "2020 Albariño, Bodegas Terras Gauda, Rías Baixas",
          chefNote: "Smoked inside charred banana leaves on iron grates.",
          imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=900&q=85",
        },
        {
          name: "Smoked Guchhi & Black Rice Biryani",
          slug: "smoked-guchhi-biryani",
          description: "Kashmiri morels stuffed with spiced paneer, aged fragrant basmati, saffron dum steam, burani raita.",
          price: 1850,
          isChefPick: true,
          isSignature: true,
          dietaryFlags: "VEGETARIAN",
          allergens: "Dairy",
          ingredients: "Kashmiri Morels, Basmati, Saffron, Rose Water, Mint, Ghee",
          winePairing: "2019 Pinot Noir, Domaine Serene, Willamette Valley",
          chefNote: "Sealed with sourdough dough and dum-cooked over dying wood embers.",
          imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=85",
        },
        {
          name: "Charcoal-Roasted Spatchcock Spring Chicken",
          slug: "charcoal-roasted-chicken",
          description: "Free-range farm bird, yellow chili mustard brine, smoked makhani emulsion, charred spring onions.",
          price: 1750,
          isChefPick: false,
          isSignature: false,
          dietaryFlags: "GLUTEN_FREE",
          allergens: "Dairy",
          ingredients: "Organic Chicken, Kasuri Methi, San Marzano Tomatoes, Cultured Cream",
          winePairing: "2020 Saint-Joseph, Domaine Pierre Gonon, Rhône",
          chefNote: "Brined for 24 hours in sea salt and roasted yellow chilies.",
          imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=900&q=85",
        },
      ],
    },
    {
      name: "Desserts & Fire Sweets",
      slug: "desserts",
      description: "Artisanal sweet finales kissed with smoke and floral syrups.",
      sortOrder: 4,
      items: [
        {
          name: "Burnt Jaggery & Smoked Chocolate Tart",
          slug: "burnt-jaggery-chocolate-tart",
          description: "70% Single-origin Malabar cacao, smoked organic jaggery caramel, sea salt, roasted pistachio gelato.",
          price: 750,
          isChefPick: true,
          isSignature: true,
          dietaryFlags: "VEGETARIAN",
          allergens: "Dairy, Gluten, Tree Nuts",
          ingredients: "Idukki Cocoa, Kolhapur Jaggery, Flaky Maldon Salt, Iranian Pistachio",
          winePairing: "2017 Taylor's Late Bottled Vintage Port, Douro",
          chefNote: "Finished table-side with flaming sweet birch oil.",
          imageUrl: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=900&q=85",
        },
        {
          name: "Charred Alphonso Mango & Coconut Kheer",
          slug: "charred-alphonso-kheer",
          description: "Torched Ratnagiri Alphonso mango, slow-reduced coconut milk, cardamom crisp, gold leaf.",
          price: 850,
          isChefPick: true,
          isSignature: true,
          dietaryFlags: "VEGAN, GLUTEN_FREE",
          allergens: "None",
          ingredients: "Ratnagiri Mango, Coconut Cream, Wild Honey, Edible 24k Gold",
          winePairing: "2018 Château d'Yquem, Sauternes",
          chefNote: "Caramelized over high heat charcoal embers.",
          imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=900&q=85",
        },
      ],
    },
    {
      name: "Signature Cocktails & Spirits",
      slug: "cocktails",
      description: "Wood-smoked spirits and botanical infusions.",
      sortOrder: 5,
      items: [
        {
          name: "The Ember & Smoke Old Fashioned",
          slug: "ember-smoke-old-fashioned",
          description: "Bourbon washed in smoked ghee, roasted betel leaf tincture, palm jaggery syrup, Angostura.",
          price: 1150,
          isChefPick: true,
          isSignature: true,
          dietaryFlags: "VEGETARIAN",
          allergens: "None",
          ingredients: "Woodford Reserve Bourbon, A2 Ghee, Betel Leaves, Hand-Carved Ice",
          winePairing: "Enjoyed as opening digestif.",
          chefNote: "Smoked inside a cloche with dried applewood.",
          imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=85",
        },
        {
          name: "Malabar Highball",
          slug: "malabar-highball",
          description: "Single Malt whisky, roasted green peppercorn cordial, clarified kokum soda, dried citrus wheel.",
          price: 950,
          isChefPick: false,
          isSignature: false,
          dietaryFlags: "VEGAN",
          allergens: "None",
          ingredients: "Paul John Nirvana Whisky, Coorg Pepper, Fresh Kokum, Club Soda",
          winePairing: "Crisp and refreshing.",
          chefNote: "Clarified with agar for crystal clarity.",
          imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=85",
        },
      ],
    },
  ];

  for (const cat of categories) {
    const createdCat = await prisma.menuCategory.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
    });

    for (let i = 0; i < cat.items.length; i++) {
      const item = cat.items[i];
      const createdDish = await prisma.menuItem.create({
        data: {
          categoryId: createdCat.id,
          name: item.name,
          slug: item.slug,
          description: item.description,
          price: item.price,
          sortOrder: i + 1,
          isAvailable: true,
          isChefPick: item.isChefPick,
          isSignature: item.isSignature,
          dietaryFlags: item.dietaryFlags,
          allergens: item.allergens,
          ingredients: item.ingredients,
          winePairing: item.winePairing,
          chefNote: item.chefNote,
          imageUrl: item.imageUrl,
        },
      });

      // Save favourite for demo customer
      if (item.isSignature && i === 0) {
        await prisma.favouriteDish.create({
          data: {
            userId: customer.id,
            menuItemId: createdDish.id,
          },
        });
      }
    }
  }

  // 6. Culinary Events & Residencies in Mumbai
  const eventsData = [
    {
      title: "Wine & Fire: An Evening with Sula & Fratelli Reserve",
      slug: "wine-fire-fratelli-reserve",
      excerpt: "A 6-course wood-fired tasting dinner exploring aged single-vineyard reserves.",
      description: "A 6-course wood-fired tasting dinner with winemakers, exploring aged single-vineyard reserves and ancestral coal preparations.",
      date: "2026-09-24",
      time: "19:00",
      duration: "3.5 Hours",
      price: 8500,
      capacity: 24,
      bookedCount: 16,
      imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85",
      isPublished: true,
      location: "Chef's Hearth Counter & Private Salon",
    },
    {
      title: "Ancestral Clay & Charcoal Masterclass",
      slug: "ancestral-clay-masterclass",
      excerpt: "Hands-on masterclass in wood flame cooking, artisanal sourdough, and smoking.",
      description: "Join Executive Chef Mateo Vane at the wood-fire hearth for an intimate hands-on masterclass in flame cooking, sourdough baking, and meat curing.",
      date: "2026-10-12",
      time: "10:30",
      duration: "4 Hours",
      price: 6500,
      capacity: 10,
      bookedCount: 6,
      imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=85",
      isPublished: true,
      location: "Main Open Hearth Kitchen",
    },
    {
      title: "Sunday Hearth Jazz Roast",
      slug: "sunday-hearth-jazz-roast",
      excerpt: "Slow-roasted Awadhi meats, fresh flatbreads, and acoustic jazz.",
      description: "Slow-roasted Awadhi Raan, hearth-baked flatbreads, and natural wines accompanied by live acoustic jazz in the garden courtyard.",
      date: "2026-09-28",
      time: "13:00",
      duration: "4 Hours",
      price: 4500,
      capacity: 40,
      bookedCount: 28,
      imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85",
      isPublished: true,
      location: "Garden Terrace Salon",
    },
  ];

  for (const ev of eventsData) {
    await prisma.event.create({ data: ev });
  }

  // 7. Gallery Assets
  const galleryData = [
    { title: "The Hearth at Midnight", category: "KITCHEN", imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85", caption: "Sweet birch embers reaching 600°C on the main cooking hearth.", sortOrder: 1 },
    { title: "Main Dining Salon", category: "INTERIOR", imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85", caption: "Warm obsidian tones and ambient lighting in the Lower Parel residence.", sortOrder: 2 },
    { title: "Charred Scallop Course", category: "FOOD", imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=85", caption: "Malabar scallops with bone marrow dashi butter.", sortOrder: 3 },
    { title: "Biodynamic Wine Cellar", category: "DRINKS", imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85", caption: "Over 450 natural, low-intervention labels.", sortOrder: 4 },
  ];

  for (const g of galleryData) {
    await prisma.galleryImage.create({ data: g });
  }

  // 8. Journal Category & Posts
  const journalCat = await prisma.journalCategory.create({
    data: {
      name: "Terroir & Craft",
      slug: "terroir-craft",
    },
  });

  await prisma.journalPost.create({
    data: {
      categoryId: journalCat.id,
      title: "The Anatomy of Fire: Cooking with Indian Wood",
      slug: "anatomy-of-fire-indian-wood",
      excerpt: "Why we source sustainable babool, mango wood, and sweet birch for temperature control across our cooking stations.",
      content: `
# The Anatomy of Fire: Cooking with Indian Wood

At Embera House Mumbai, fire is not merely a heat source — it is an active, living ingredient. Every wood imparts a distinct personality and aroma to the ingredients placed above it.

### Babool Charcoal: Pure, Steady Heat
For searing seafood like our Malabar scallops and black pomfret, we rely on high-density babool coal. It burns fiercely clean at over 500°C without imparting harsh acrid smoke, preserving the sweet natural brine of the ocean.

### Mango Wood: Sweet Fruit Aromas
When roasting young lamb for our 24-hour Awadhi raan, seasoned mango wood logs release gentle aromatic oils that permeate the braising juices and create a delicate caramelized crust.

### The Hearth Philosophy
No gas burners. No induction stoves. Just open embers, hand-carved skewers, and the intuitive skill of our chefs.
      `,
      authorName: "Chef Mateo Vane",
      authorRole: "Executive Chef",
      authorAvatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80",
      coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85",
      readingTimeMinutes: 5,
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  // 9. Sample Live Reservations
  const sampleTable = await prisma.restaurantTable.findFirst({ where: { room: "MAIN_DINING" } });
  if (sampleTable) {
    await prisma.reservation.create({
      data: {
        userId: customer.id,
        tableId: sampleTable.id,
        confirmationCode: "EH-MUM001",
        guestName: "Aarav Mehta",
        guestEmail: "aarav.mehta@mumbai.in",
        guestPhone: "+91 98200 11223",
        partySize: 2,
        date: new Date().toISOString().split("T")[0],
        timeSlot: "20:00",
        seatingArea: "MAIN_DINING",
        occasion: "Anniversary",
        status: "CONFIRMED",
        dietaryNotes: "Gluten-conscious",
        specialRequests: "Window booth overlooking courtyard",
      },
    });
  }

  // 10. Sample Newsletter Subscriber
  await prisma.newsletterSubscriber.create({
    data: {
      email: "aarav.mehta@mumbai.in",
      isActive: true,
    },
  });

  console.log("✅ Embera House (Chennai) database successfully seeded with Indian Rupees (₹) and Chennai details!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
