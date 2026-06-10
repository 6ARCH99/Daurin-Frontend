const API_BASE = import.meta.env.VITE_API_URL || "";

export function getImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("blob:")) return path;
  return `${API_BASE}${path}`;
}

function getToken() {
  return localStorage.getItem("suarabumi_token");
}

export function setAuth(token, user, refreshToken) {
  if (token) localStorage.setItem("suarabumi_token", token);
  if (user) localStorage.setItem("suarabumi_user", JSON.stringify(user));
  if (refreshToken) localStorage.setItem("suarabumi_refresh_token", refreshToken);
}

export function setAuthTokens(accessToken, refreshToken, user) {
  if (accessToken) localStorage.setItem("suarabumi_token", accessToken);
  if (refreshToken) localStorage.setItem("suarabumi_refresh_token", refreshToken);
  if (user) localStorage.setItem("suarabumi_user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("suarabumi_token");
  localStorage.removeItem("suarabumi_refresh_token");
  localStorage.removeItem("suarabumi_user");
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem("suarabumi_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function formatApiError(res, data) {
  if (res.status === 502 || res.status === 503) {
    return "Backend tidak terjangkau. Jalankan: npm run dev:all";
  }
  if (res.status === 401) {
    clearAuth();
    return "Sesi habis. Silakan masuk lagi.";
  }
  if (res.status === 404) {
    return "Data tidak ditemukan. Keluar lalu masuk lagi.";
  }
  const err = data?.error;
  if (typeof err === "string") return err;
  if (err?.fieldErrors) {
    const first = Object.values(err.fieldErrors).flat()[0];
    if (first) return String(first);
  }
  if (err?.formErrors?.length) return String(err.formErrors[0]);
  return res.statusText || "Request failed";
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    throw new Error("Tidak bisa menghubungi server. Pastikan backend berjalan (npm run dev:all).");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(formatApiError(res, data));
  }
  return data;
}

export const api = {
  login: (email, password) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (body) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  forgotPassword: (email) =>
    request("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token, password) =>
    request("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),
  sendOtp: (phone, email, purpose = "register") =>
    request("/api/auth/otp/send", {
      method: "POST",
      body: JSON.stringify({ phone, email, purpose }),
    }),
  resendOtp: (phone, email, purpose = "register") =>
    request("/api/auth/otp/resend", {
      method: "POST",
      body: JSON.stringify({ phone, email, purpose }),
    }),
  verifyOtp: (phone, code, purpose = "register") =>
    request("/api/auth/otp/verify", {
      method: "POST",
      body: JSON.stringify({ phone, code, purpose }),
    }),
  getDashboard: () => request("/api/dashboard"),
  getChallengeOverview: () => request("/api/challenges/overview"),
  joinChallenge: (challengeId) =>
    request(`/api/challenges/${challengeId}/join`, { method: "POST" }),
  cancelChallenge: (challengeId) =>
    request(`/api/challenges/${challengeId}/cancel`, { method: "DELETE" }),
  getLeaderboard: (limit = 20, wilayah = 'kota', periode = 'minggu') => 
    request(`/api/leaderboard?limit=${limit}&wilayah=${wilayah}&periode=${periode}`),
  getBadges: () => request("/api/badges"),
  getProfile: () => request("/api/profile"),
  updateProfile: (body) =>
    request("/api/profile", { method: "PATCH", body: JSON.stringify(body) }),
  uploadProfilePhoto: (file) => {
    const formData = new FormData();
    formData.append("photo", file);
    return request("/api/profile/photo", { method: "POST", body: formData });
  },
  getProfileStats: () => request("/api/profile/stats"),
  getProfileBadges: () => request("/api/profile/badges"),
  getProfileActivities: () => request("/api/profile/activities"),
  getClimateImpact: () => request("/api/climate-impact"),
  checkHealth: () => request("/health"),

  getAccountStatus: () => request("/api/settings/account-status"),
  getPreferences: () => request("/api/settings/preferences"),
  updatePreferences: (body) =>
    request("/api/settings/preferences", { method: "PATCH", body: JSON.stringify(body) }),
  changePassword: (currentPassword, newPassword) =>
    request("/api/settings/password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  getFaqs: () => request("/api/help/faq"),
  searchFaqs: (q) => request(`/api/help/faq/search?q=${encodeURIComponent(q)}`),
  startLiveChat: () => request("/api/help/live-chat/session", { method: "POST" }),
  submitSupportTicket: (subject, message) =>
    request("/api/help/support/ticket", {
      method: "POST",
      body: JSON.stringify({ subject, message }),
    }),

  getDropPoints: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    if (params.material) qs.set("material", params.material);
    if (params.lat != null) qs.set("lat", String(params.lat));
    if (params.lng != null) qs.set("lng", String(params.lng));
    const query = qs.toString();
    return request(`/api/drop-points${query ? `?${query}` : ""}`);
  },
  getDropPoint: (id, lat, lng) => {
    const qs = new URLSearchParams();
    if (lat != null) qs.set("lat", String(lat));
    if (lng != null) qs.set("lng", String(lng));
    const query = qs.toString();
    return request(`/api/drop-points/${id}${query ? `?${query}` : ""}`);
  },

  getPickups: () => request("/api/pickups"),
  createPickup: (body) =>
    request("/api/pickups", { method: "POST", body: JSON.stringify(body) }),
  updatePickup: (id, body) =>
    request(`/api/pickups/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  cancelPickup: (id) => request(`/api/pickups/${id}`, { method: "DELETE" }),

  getRewardBalance: () => request("/api/rewards/balance"),
  getRewardHistory: (type) =>
    request(`/api/rewards/history${type ? `?type=${type}` : ""}`),
  getEwallet: () => request("/api/rewards/ewallet"),
  saveEwallet: (platform, phone) =>
    request("/api/rewards/ewallet", {
      method: "PUT",
      body: JSON.stringify({ platform, phone }),
    }),
  redeemPoints: (platform, amountRp) =>
    request("/api/rewards/redeem", {
      method: "POST",
      body: JSON.stringify({ platform, amountRp }),
    }),

  getReferralStats: () => request("/api/referral/stats"),
  getReferralCode: () => request("/api/referral/code"),
};
