async function seedEvents() {
  console.log("Starting to seed events via API...");
  
  // 1. Login to get token
  const loginRes = await fetch("http://127.0.0.1:5001/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "alice@theatre.com", password: "securepassword" })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  if (!token) return console.error("No token received!");

  // 2. Fetch groups to get a valid group ID
  const groupsRes = await fetch("http://127.0.0.1:5001/api/groups");
  const groups = await groupsRes.json();
  const groupId = groups[0]?._id;
  if (!groupId) return console.error("No group found!");

  // 3. Define Jaipur events
  const jaipurEvents = [
    {
      title: "Macbeth: The Rajasthani Adaptation",
      group: groupId,
      date: new Date("2026-08-12T18:30:00Z"),
      time: "18:30",
      venue: "Jawahar Kala Kendra (JKK)",
      city: "Jaipur",
      description: "A thrilling adaptation of Shakespeare's classic, set against the backdrop of the Thar desert. Featuring live folk music.",
      ticketLink: "https://example.com/tickets/1"
    },
    {
      title: "Taj Mahal Ka Tender",
      group: groupId,
      date: new Date("2026-08-15T19:00:00Z"),
      time: "19:00",
      venue: "Ravindra Rangmanch",
      city: "Jaipur",
      description: "A hilarious satirical play about Shah Jahan attempting to build the Taj Mahal in modern-day India.",
      ticketLink: "https://example.com/tickets/2"
    },
    {
      title: "Ghasiram Kotwal",
      group: groupId,
      date: new Date("2026-08-20T17:30:00Z"),
      time: "17:30",
      venue: "Birla Auditorium",
      city: "Jaipur",
      description: "The classic Marathi play exploring the rise and fall of Ghasiram Kotwal. A masterclass in political satire.",
      ticketLink: ""
    },
    {
      title: "Malgudi Days Live",
      group: groupId,
      date: new Date("2026-08-25T18:00:00Z"),
      time: "18:00",
      venue: "Maharana Pratap Auditorium",
      city: "Jaipur",
      description: "Relive the magic of Swami and friends in this nostalgic stage adaptation of R.K. Narayan's beloved stories.",
      ticketLink: "https://example.com/tickets/4"
    },
    {
      title: "An Evening of Improv",
      group: groupId,
      date: new Date("2026-08-28T20:00:00Z"),
      time: "20:00",
      venue: "Prithvi Theatre Cafe Style",
      city: "Jaipur",
      description: "Unscripted, unrehearsed, and absolutely hilarious. Join us for a night of spontaneous comedy in an intimate small-venue setting.",
      ticketLink: "https://example.com/tickets/5"
    }
  ];

  // 4. Create events
  for (const event of jaipurEvents) {
    const eventRes = await fetch("http://127.0.0.1:5001/api/events", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(event)
    });
    if (eventRes.ok) {
        console.log("Created:", event.title);
    } else {
        console.error("Failed to create:", event.title, await eventRes.text());
    }
  }

  console.log("Done seeding via API.");
}

seedEvents().catch(console.error);
