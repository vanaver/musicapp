// Spotify.js

const clientId = 'bf9c5e949e0c4bdaa4fca97931606580'; // твой clientId
const redirectUri = 'https://e358-91-246-41-226.ngrok-free.app'; // твой redirect URI
const scope = "playlist-modify-public playlist-modify-private user-read-private"; // запрашиваемые права доступа

// Генерация случайной строки
function generateRandomString(length) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const values = new Uint32Array(length);
  window.crypto.getRandomValues(values);
  for (let i = 0; i < length; i++) {
    result += charset[values[i] % charset.length];
  }
  return result;
}

// Создание SHA256 хэша
async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await window.crypto.subtle.digest("SHA-256", data);
}

// Конвертация хэша в base64url
function base64urlencode(buffer) {
  const bytes = new Uint8Array(buffer);
  const string = String.fromCharCode(...bytes);
  return btoa(string)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Генерация code challenge из code verifier
async function generateCodeChallenge(codeVerifier) {
  const hash = await sha256(codeVerifier);
  return base64urlencode(hash);
}

// Перенаправление на авторизацию в Spotify
export async function goToPage() {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Сохраняем code_verifier в localStorage
  localStorage.setItem("code_verifier", codeVerifier);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  window.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Получение access_token с помощью authorization code
export async function checkForCodeAndGetToken() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) return;

  const codeVerifier = localStorage.getItem("code_verifier");
  if (!codeVerifier) {
    console.error("Нет сохранённого code_verifier");
    return;
  }

  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await response.json();
    console.log("Ответ от Spotify:", data);

    if (data.access_token) {
      const expiresIn = 3600; // в секундах
      const expirationTime = Date.now() + expiresIn * 1000;
      console.log("✅ Access token:", data.access_token);
      localStorage.setItem("access_token", data.access_token); // сохраняем access_token
      localStorage.setItem("access_token_expiration", expirationTime);
      console.log(expirationTime)
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      window.location.reload();
    } else {
      console.error("❌ Не удалось получить access_token:", data);
    }
  } catch (error) {
    console.error("Ошибка при получении токена:", error);
  } finally {
   
  }
}

export async function search(term) {
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    console.error("❌ Нет access token. Сначала авторизуйся через Spotify.");
    return [];
  }

  const endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(term)}&type=track`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!data.tracks || !data.tracks.items) {
      window.alert('вероятно нужно заново войти через спотифай');
      return [];
    }

    return data.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri,
      image: track.album.images[1]?.url || '',
      preview: track.preview_url,
    }));
  } catch (error) {
    console.error("Ошибка при поиске треков:", error);
    window.alert('вероятно нужно заново войти через спотифай')
    return [];
  }
}

export function isAccessTokenValid() {
  const token = localStorage.getItem("access_token");
  const expiration = localStorage.getItem("access_token_expiration");
  const now = Date.now();
  if (!token || !expiration) return false;
  if (now >= expiration) {
    console.log("Токен истёк. Нужно войти заново.");
    return false
  } else {
    console.log("Токен ещё действителен.");
    return true
  }
}

export async function getCurrentUserId() {
  const accessToken = localStorage.getItem("access_token");
  const endpoint = "https://api.spotify.com/v1/me";

  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    console.log(data.id + 'получено айди польщователя')
    return data.id;
  } catch (error) {
    console.error("Ошибка при получении ID пользователя:", error);
    return null;
  }
}

export async function createPlaylist(userId, playlistName) {
  const accessToken = localStorage.getItem("access_token");
  const endpoint = `https://api.spotify.com/v1/users/${userId}/playlists`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: playlistName,
        public: false,
        description: "Создано через Jamming App",
      }),
    });

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error("Ошибка при создании плейлиста:", error);
    return null;
  }
}

export async function addTracksToPlaylist(playlistId, uris) {
  const accessToken = localStorage.getItem("access_token");
  const endpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  const body = JSON.stringify({ uris });

  console.log("Добавляем треки:", uris); // 💡 покажет массив uri
  console.log("Тело запроса:", body);    // 💡 покажет JSON

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      throw new Error("Не удалось добавить треки");
    }

    console.log("Треки успешно добавлены!");
    return true;
  } catch (error) {
    console.error("Ошибка при добавлении треков:", error);
    return false;
  }
}