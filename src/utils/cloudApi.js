// Cloud & Offline Database Interface for Calcu-Voice

export const GOOGLE_SHEET_API_URL = "https://script.google.com/macros/s/AKfycbxH_D_ifKnXfDQJvWCGOBUKgm8FD8WniwIg8470d2UXR3WmBEUuUiBp0M3mwiK8zRQcTA/exec";

// Local Storage Fallback Mock Database Seed
const DEFAULT_LOCAL_PLAYERS = [
  { id: "shivam@123", name: "Shivam Kumar", rating: 480, studentClass: "10th", age: "16", password: "admin", todayCount: 42, lastDate: "", profilePicUrl: "" },
  { id: "priya@math", name: "Priya Sharma", rating: 395, studentClass: "9th", age: "15", password: "123", todayCount: 28, lastDate: "", profilePicUrl: "" },
  { id: "rahul@top", name: "Rahul Verma", rating: 340, studentClass: "10th", age: "16", password: "123", todayCount: 35, lastDate: "", profilePicUrl: "" },
  { id: "ananya@stars", name: "Ananya Patel", rating: 285, studentClass: "8th", age: "14", password: "123", todayCount: 19, lastDate: "", profilePicUrl: "" },
  { id: "aarav@calc", name: "Aarav Gupta", rating: 230, studentClass: "8th", age: "13", password: "123", todayCount: 15, lastDate: "", profilePicUrl: "" },
  { id: "neha@speed", name: "Neha Singh", rating: 175, studentClass: "7th", age: "12", password: "123", todayCount: 8, lastDate: "", profilePicUrl: "" }
];

function getLocalPlayers() {
  try {
    const raw = localStorage.getItem('calcu_cloud_fallback_players');
    if (!raw) {
      localStorage.setItem('calcu_cloud_fallback_players', JSON.stringify(DEFAULT_LOCAL_PLAYERS));
      return DEFAULT_LOCAL_PLAYERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_LOCAL_PLAYERS;
  }
}

function saveLocalPlayers(players) {
  try {
    localStorage.setItem('calcu_cloud_fallback_players', JSON.stringify(players));
  } catch (e) {}
}

export async function callCloudAPI(payload) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(GOOGLE_SHEET_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await res.json();
    return data;
  } catch (err) {
    console.warn("Cloud API fetch fallback to local storage:", err);
    return handleLocalSimulation(payload);
  }
}

function handleLocalSimulation(payload) {
  const players = getLocalPlayers();
  const action = payload.action;

  if (action === "fetch") {
    return players;
  }

  if (action === "signup") {
    const exists = players.find(p => p.id === payload.userId);
    if (exists) {
      return { status: "error", message: "User ID already taken" };
    }
    const newPlayer = {
      id: payload.userId,
      name: payload.name,
      studentClass: payload.studentClass,
      age: payload.age,
      password: payload.password,
      rating: 120,
      todayCount: 0,
      lastDate: "",
      profilePicUrl: ""
    };
    players.push(newPlayer);
    saveLocalPlayers(players);
    return { status: "success", name: payload.name, rating: 120 };
  }

  if (action === "login") {
    const found = players.find(p => p.id === payload.userId && p.password === payload.password);
    if (found) {
      return {
        status: "success",
        name: found.name,
        rating: found.rating,
        studentClass: found.studentClass,
        age: found.age,
        profilePicUrl: found.profilePicUrl || "",
        todayCount: found.todayCount || 0,
        lastDate: found.lastDate || ""
      };
    }
    return { status: "error", message: "Invalid credentials" };
  }

  if (action === "update") {
    const index = players.findIndex(p => p.id === (payload.id || payload.userId));
    if (index > -1) {
      players[index] = {
        ...players[index],
        name: payload.name !== undefined ? payload.name : players[index].name,
        rating: payload.rating !== undefined ? payload.rating : players[index].rating,
        password: payload.password !== undefined ? payload.password : players[index].password,
        studentClass: payload.studentClass !== undefined ? payload.studentClass : players[index].studentClass,
        age: payload.age !== undefined ? payload.age : players[index].age,
        todayCount: payload.todayCount !== undefined ? payload.todayCount : players[index].todayCount,
        lastDate: payload.lastDate !== undefined ? payload.lastDate : players[index].lastDate,
        profilePicUrl: payload.profilePicUrl !== undefined ? payload.profilePicUrl : players[index].profilePicUrl
      };
      saveLocalPlayers(players);
      return { status: "success" };
    }
    return { status: "error", message: "Player not found" };
  }

  if (action === "updateProfilePic") {
    const index = players.findIndex(p => p.id === payload.userId);
    if (index > -1) {
      players[index].profilePicUrl = payload.imageUrl;
      saveLocalPlayers(players);
      return { status: "success" };
    }
    return { status: "error" };
  }

  if (action === "delete") {
    const updated = players.filter(p => p.id !== (payload.id || payload.userId));
    saveLocalPlayers(updated);
    return { status: "success" };
  }

  return { status: "ok" };
}

export const CLOUDINARY_CLOUD_NAME = "ut7h5mjh";
export const CLOUDINARY_UPLOAD_PRESET = "calcu_app_preset";

export async function uploadDirectToCloudinary(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    if (data.secure_url) {
      return data.secure_url;
    }
    throw new Error(data.error?.message || "Cloudinary upload failed");
  } catch (e) {
    // If upload fails in offline/sandbox, create a local object URL or canvas data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
  }
}

export async function fetchCloudPlayers() {
  return callCloudAPI({ action: "fetch" });
}

export async function loginUserCloud(userId, password) {
  return callCloudAPI({ action: "login", userId, password });
}

export async function signupUserCloud(data) {
  return callCloudAPI({
    action: "signup",
    name: data.name,
    studentClass: data.studentClass,
    age: data.age,
    userId: data.userId,
    password: data.password
  });
}

export async function updateUserCloud(playerData) {
  return callCloudAPI({
    action: "update",
    id: playerData.id || playerData.userId,
    name: playerData.name,
    password: playerData.password,
    studentClass: playerData.studentClass,
    age: playerData.age,
    rating: playerData.rating,
    todayCount: playerData.todayCount,
    lastDate: playerData.lastDate,
    profilePicUrl: playerData.profilePicUrl
  });
}

export async function deleteUserCloud(userId) {
  return callCloudAPI({
    action: "delete",
    id: userId
  });
}

export async function updateProfilePicCloud(userId, imageUrl) {
  return callCloudAPI({
    action: "updateProfilePic",
    userId,
    imageUrl
  });
}
