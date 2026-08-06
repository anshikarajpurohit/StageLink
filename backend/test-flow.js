async function runTests() {
  console.log("1. Testing /api/auth/login...");
  const loginRes = await fetch("http://127.0.0.1:5001/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "alice@theatre.com", password: "securepassword" })
  });
  const loginData = await loginRes.json();
  console.log("Login Result:", loginData);
  const token = loginData.token;

  if (!token) return console.error("No token received!");

  console.log("\n2. Testing /api/groups...");
  const groupRes = await fetch("http://127.0.0.1:5001/api/groups", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ name: "Alice's Wonderful Troupe", description: "A great theatre group" })
  });
  const groupData = await groupRes.json();
  console.log("Group Creation Result:", groupData);
  const groupId = groupData._id;

  if (!groupId) return console.error("No group ID received!");

  console.log("\n3. Testing /api/events...");
  const eventRes = await fetch("http://127.0.0.1:5001/api/events", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ 
      title: "Hamlet Performance", 
      group: groupId, 
      date: new Date().toISOString(), 
      city: "London" 
    })
  });
  const eventData = await eventRes.json();
  console.log("Event Creation Result:", eventData);

  console.log("\n4. Testing /api/recruitment...");
  const recruitRes = await fetch("http://127.0.0.1:5001/api/recruitment", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ 
      group: groupId, 
      role: "Lead Actor", 
      description: "Looking for someone to play Hamlet", 
      city: "London" 
    })
  });
  const recruitData = await recruitRes.json();
  console.log("Recruitment Post Creation Result:", recruitData);
  const recruitId = recruitData._id;

  if (!recruitId) return console.error("No recruitment ID received!");

  console.log("\n5. Testing /api/recruitment/:id/interest...");
  const interestRes = await fetch(`http://127.0.0.1:5001/api/recruitment/${recruitId}/interest`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  const interestData = await interestRes.json();
  console.log("Interest Action Result:", interestData);
}

runTests().catch(console.error);
