require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const Group = require('./models/Group');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Connected to DB");
  
  // 1. Delete Hamlet
  const result = await Event.deleteOne({ title: "Hamlet Performance" });
  console.log("Deleted Hamlet:", result.deletedCount);

  // Get a group to attach these events to
  let group = await Group.findOne();
  if (!group) {
      console.log("No group found!");
      process.exit(1);
  }

  // 2. Add Jaipur events
  const jaipurEvents = [
    {
      title: "Macbeth: The Rajasthani Adaptation",
      group: group._id,
      date: new Date("2026-08-12T18:30:00Z"),
      time: "18:30",
      venue: "Jawahar Kala Kendra (JKK)",
      city: "Jaipur",
      description: "A thrilling adaptation of Shakespeare's classic, set against the backdrop of the Thar desert. Featuring live folk music and incredible set designs.",
      ticketLink: "https://example.com/tickets/1"
    },
    {
      title: "Taj Mahal Ka Tender",
      group: group._id,
      date: new Date("2026-08-15T19:00:00Z"),
      time: "19:00",
      venue: "Ravindra Rangmanch",
      city: "Jaipur",
      description: "A hilarious satirical play about Shah Jahan attempting to build the Taj Mahal in modern-day India. A timeless comedy.",
      ticketLink: "https://example.com/tickets/2"
    },
    {
      title: "Ghasiram Kotwal",
      group: group._id,
      date: new Date("2026-08-20T17:30:00Z"),
      time: "17:30",
      venue: "Birla Auditorium",
      city: "Jaipur",
      description: "The classic Marathi play exploring the rise and fall of Ghasiram Kotwal. A masterclass in political satire and ensemble acting.",
      ticketLink: ""
    },
    {
      title: "Malgudi Days Live",
      group: group._id,
      date: new Date("2026-08-25T18:00:00Z"),
      time: "18:00",
      venue: "Maharana Pratap Auditorium",
      city: "Jaipur",
      description: "Relive the magic of Swami and friends in this nostalgic stage adaptation of R.K. Narayan's beloved stories.",
      ticketLink: "https://example.com/tickets/4"
    },
    {
      title: "An Evening of Improv",
      group: group._id,
      date: new Date("2026-08-28T20:00:00Z"),
      time: "20:00",
      venue: "Prithvi Theatre Cafe Style",
      city: "Jaipur",
      description: "Unscripted, unrehearsed, and absolutely hilarious. Join us for a night of spontaneous comedy in an intimate small-venue setting.",
      ticketLink: "https://example.com/tickets/5"
    }
  ];

  await Event.insertMany(jaipurEvents);
  console.log("Inserted Jaipur events");
  
  mongoose.connection.close();
}).catch(console.error);
