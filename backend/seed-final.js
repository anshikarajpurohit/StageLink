require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Group = require('./models/Group');
const Event = require('./models/Event');
const RecruitmentPost = require('./models/RecruitmentPost');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Connected to DB");
  
  // Clear all
  await User.deleteMany({});
  await Group.deleteMany({});
  await Event.deleteMany({});
  await RecruitmentPost.deleteMany({});
  
  console.log("Cleared old data");

  const password = await bcrypt.hash('password123', 10);

  // 1. Create Individual Actors
  const actorsData = [
    { name: "Aarav Sharma", email: "aarav@example.com", password, role: "actor", city: "Jaipur", bio: "Passionate stage actor specializing in dramatic monologues and method acting.", skills: ["Method Acting", "Voice Over", "Hindi Diction"], languages: ["Hindi", "English"], pastProductions: [{ playTitle: "Ghasiram Kotwal", groupName: "Rangmanch Rajasthan", role: "Supporting Lead", year: 2023 }] },
    { name: "Priya Patel", email: "priya@example.com", password, role: "actor", city: "Jaipur", bio: "Classically trained dancer and actor. Love bringing physical theatre to life.", skills: ["Physical Theatre", "Kathak", "Improv"], languages: ["Hindi", "English", "Gujarati"], pastProductions: [{ playTitle: "Taj Mahal Ka Tender", groupName: "Jaipur Kala Manch", role: "Lead", year: 2024 }] },
    { name: "Rohan Singh", email: "rohan@example.com", password, role: "actor", city: "Jaipur", bio: "Recent NSDL grad. Looking for intense character roles.", skills: ["Character Acting", "Stage Combat"], languages: ["Hindi"], pastProductions: [] },
    { name: "Ananya Desai", email: "ananya@example.com", password, role: "actor", city: "Jaipur", bio: "Versatile actor and singer. Comfortable in both comedy and tragedy.", skills: ["Singing", "Comedy", "Voice Modulation"], languages: ["Hindi", "English", "Marathi"], pastProductions: [] }
  ];
  
  const actors = await User.insertMany(actorsData);

  // 2. Create Theatre Groups
  const groupUsersData = [
    { name: "Jaipur Kala Manch", email: "kala@example.com", password, role: "theatre_group", city: "Jaipur" },
    { name: "Rangmanch Rajasthan", email: "rangmanch@example.com", password, role: "theatre_group", city: "Jaipur" },
    { name: "Natak Sangam Theatre Collective", email: "natak@example.com", password, role: "theatre_group", city: "Jaipur" },
    { name: "Sutradhar Theatre Group", email: "sutradhar@example.com", password, role: "theatre_group", city: "Jaipur" }
  ];
  
  const groupUsers = await User.insertMany(groupUsersData);
  
  const groups = [];
  for (const user of groupUsers) {
    const group = await Group.create({
      name: user.name,
      description: `We are ${user.name}, a premier theatre group based in ${user.city}.`,
      city: user.city,
      ownerId: user._id,
      followers: [actors[0]._id, actors[1]._id]
    });
    groups.push(group);
  }

  // 3. Create Events
  const eventsData = [
    { title: "Macbeth: The Rajasthani Adaptation", group: groups[0]._id, date: new Date("2026-08-12T18:30:00Z"), time: "18:30", venue: "Jawahar Kala Kendra (JKK)", city: "Jaipur", description: "A thrilling adaptation of Shakespeare's classic, set against the backdrop of the Thar desert. Featuring live folk music.", ticketLink: "https://example.com/tickets/1" },
    { title: "Taj Mahal Ka Tender", group: groups[1]._id, date: new Date("2026-08-15T19:00:00Z"), time: "19:00", venue: "Ravindra Rangmanch", city: "Jaipur", description: "A hilarious satirical play about Shah Jahan attempting to build the Taj Mahal in modern-day India.", ticketLink: "https://example.com/tickets/2" },
    { title: "Ghasiram Kotwal", group: groups[2]._id, date: new Date("2026-08-20T17:30:00Z"), time: "17:30", venue: "Birla Auditorium", city: "Jaipur", description: "The classic Marathi play exploring the rise and fall of Ghasiram Kotwal. A masterclass in political satire.", ticketLink: "" },
    { title: "Malgudi Days Live", group: groups[3]._id, date: new Date("2026-08-25T18:00:00Z"), time: "18:00", venue: "Maharana Pratap Auditorium", city: "Jaipur", description: "Relive the magic of Swami and friends in this nostalgic stage adaptation of R.K. Narayan's beloved stories.", ticketLink: "https://example.com/tickets/4" },
  ];
  await Event.insertMany(eventsData);

  // 4. Create Recruitment Posts
  const recruitmentData = [
    { group: groups[0]._id, role: "Lead Actor (Male, 25-35)", description: "Looking for an energetic actor for our upcoming Rajasthani adaptation of a classic tragedy.", city: "Jaipur", interestedUsers: [actors[0]._id, actors[2]._id] },
    { group: groups[0]._id, role: "Set Designer", description: "Need an experienced set designer familiar with traditional Rajasthani architecture.", city: "Jaipur", interestedUsers: [] },
    { group: groups[1]._id, role: "Comedic Actor (Female)", description: "Auditioning for a sharp, quick-witted comedic actor for a political satire.", city: "Jaipur", interestedUsers: [actors[1]._id, actors[3]._id] },
    { group: groups[2]._id, role: "Lighting Technician", description: "Seeking a lighting tech for a complex 3-act play at Birla Auditorium.", city: "Jaipur", interestedUsers: [] },
  ];
  await RecruitmentPost.insertMany(recruitmentData);

  console.log("Successfully seeded database with Indian theatre groups, actors, events, and recruitment posts.");
  mongoose.connection.close();
}).catch(console.error);
