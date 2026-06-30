const SUPABASE_URL = "https://ybfgmotbrlhmzlaxfyaq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_bjnUPSDIi8yQdnzvMxhCJg_mlVczei7";
const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const canvas = document.getElementById("world");
const ctx = canvas.getContext("2d", { alpha: false });

const paletteEl = document.getElementById("palette");
const coordsEl = document.getElementById("coords");
const zoomLabel = document.getElementById("zoomLabel");
const authBox = document.getElementById("authBox");
const splashesLabel = document.getElementById("splashesLabel");
const rechargeLabel = document.getElementById("rechargeLabel");
const splashFill = document.getElementById("splashFill");

const MAP_SIZE = 1024;
const TILE_SIZE = 16;

let dpr = Math.max(1, window.devicePixelRatio || 1);
let camera = { x: MAP_SIZE * TILE_SIZE / 2, y: MAP_SIZE * TILE_SIZE / 2, zoom: 1 };
let selectedBlock = "grass";
let isPanning = false;
let panStart = { x: 0, y: 0, camX: 0, camY: 0 };
let spaceDown = false;
let currentUser = null;
let realtimeChannel = null;
let isPlacing = false;
let toastTimer = null;

let playerState = {
  splashes: 0,
  splash_capacity: 50,
  recharge_seconds: 30,
  next_splash_at: null
};

const placed = new Map();

const BLOCKS = {
  grass: { name: "Grass", colors: ["#4f9c38", "#63b247", "#3d7d2e", "#6ebb4e"] },
  dirt: { name: "Dirt", colors: ["#79543b", "#8d6649", "#6b4932", "#9a7153"] },
  stone: { name: "Stone", colors: ["#7f8588", "#959b9e", "#6f7477", "#a4aaad"] },
  sand: { name: "Sand", colors: ["#d8c06f", "#ecd889", "#c6ad5f", "#f0df9f"] },
  water: { name: "Water", colors: ["#236ccf", "#2f86e8", "#1d5eb6", "#3b9cff"] },
  oak: { name: "Oak", colors: ["#9a6b35", "#b47d3e", "#7d5429", "#c98d47"] },
  leaves: { name: "Leaves", colors: ["#2f7d32", "#3d9c40", "#26682a", "#4caf50"] },
  glass: { name: "Glass", colors: ["#bdeaff", "#d7f4ff", "#91d7f2", "#ffffff"] },
  brick: { name: "Brick", colors: ["#8d3c32", "#a64a3e", "#6f2f28", "#bd5a4d"] },
  gold: { name: "Gold", colors: ["#e0a923", "#ffd24d", "#bd8618", "#ffdf70"] },
  diamond: { name: "Diamond", colors: ["#39d6d1", "#75fff7", "#25aaa6", "#b7fffb"] },
  obsidian: { name: "Obsidian", colors: ["#151023", "#24183a", "#0d0a16", "#3a285f"] },
  lava: { name: "Lava", colors: ["#ff5b1a", "#ffb000", "#d93000", "#fff066"] },
  snow: { name: "Snow", colors: ["#eaf6ff", "#ffffff", "#cde7f5", "#f7fbff"] },
  netherrack: { name: "Netherrack", colors: ["#6d2428", "#8a3036", "#531a1d", "#a64045"] },
  endstone: { name: "End Stone", colors: ["#d9d69a", "#eeebb7", "#c4c078", "#f7f4ca"] }
};

const textureCanvases = new Map();

function showToast(message) {
  let el = document.querySelector(".toast");

  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }

  el.textContent = message;
  el.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
}

function rand(seed) {
  let t = seed + 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

function makeTexture(blockId) {
  const block = BLOCKS[blockId] || BLOCKS.grass;
  const c = document.createElement("canvas");
  c.width = TILE_SIZE;
  c.height = TILE_SIZE;
  const g = c.getContext("2d");
  g.imageSmoothingEnabled = false;

  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      const r = rand((x + 1) * 928371 + (y + 1) * 18213 + blockId.length * 77);
      const color = block.colors[Math.floor(r * block.colors.length)];
      g.fillStyle = color;
      g.fillRect(x, y, 1, 1);
    }
  }

  g.fillStyle = "rgba(255,255,255,.08)";
  g.fillRect(0, 0, TILE_SIZE, 1);
  g.fillRect(0, 0, 1, TILE_SIZE);

  g.fillStyle = "rgba(0,0,0,.12)";
  g.fillRect(0, TILE_SIZE - 1, TILE_SIZE, 1);
  g.fillRect(TILE_SIZE - 1, 0, 1, TILE_SIZE);

  return c;
}

function getTexture(blockId) {
  if (!textureCanvases.has(blockId)) {
    textureCanvases.set(blockId, makeTexture(blockId));
  }
  return textureCanvases.get(blockId);
}

function key(x, y) {
  return `${x},${y}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getDiscordProfile(sessionUser) {
  const meta = sessionUser?.user_metadata || {};
  return {
    username:
      meta.full_name ||
      meta.name ||
      meta.user_name ||
      meta.preferred_username ||
      meta.provider_id ||
      "Player",
    avatar_url: meta.avatar_url || null
  };
}

async function ensureProfile(sessionUser) {
  if (!supabaseClient || !sessionUser) return;

  const profile = getDiscordProfile(sessionUser);

  await supabaseClient
    .from("profiles")
    .upsert({
      id: sessionUser.id,
      username: profile.username,
      avatar_url: profile.avatar_url
    }, { onConflict: "id" });
}

function renderAuth() {
  if (!authBox) return;

  if (!supabaseClient) {
    authBox.innerHTML = '<span class="auth-user"><span>DB offline</span></span>';
    return;
  }

  if (!currentUser) {
    authBox.innerHTML = '<button id="loginBtn">Login with Discord</button>';
    document.getElementById("loginBtn")?.addEventListener("click", loginWithDiscord);
    return;
  }

  const profile = getDiscordProfile(currentUser);
  const avatar = profile.avatar_url
    ? `<img src="${profile.avatar_url}" alt="">`
    : "";

  authBox.innerHTML = `
    <div class="auth-user">
      ${avatar}
      <span>${escapeHtml(profile.username)}</span>
    </div>
    <button id="logoutBtn">Logout</button>
  `;

  document.getElementById("logoutBtn")?.addEventListener("click", logout);
}

async function loginWithDiscord() {
  if (!supabaseClient) return;

  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: window.location.origin
    }
  });

  if (error) {
    showToast("Discord login failed");
  }
}

async function logout() {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
  currentUser = null;
  renderAuth();
  playerState = { splashes: 0, splash_capacity: 50, recharge_seconds: 30, next_splash_at: null };
  renderSplashes();
}

async function initAuth() {
  if (!supabaseClient) {
    renderAuth();
    return;
  }

  const { data } = await supabaseClient.auth.getSession();
  currentUser = data?.session?.user || null;

  if (currentUser) {
    await ensureProfile(currentUser);
  }

  renderAuth();

  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    currentUser = session?.user || null;

    if (currentUser) {
      await ensureProfile(currentUser);
      await loadPlayerState();
    }

    renderAuth();
    renderSplashes();
  });
}

async function loadPlayerState() {
  if (!supabaseClient || !currentUser) {
    renderSplashes();
    return;
  }

  const { data, error } = await supabaseClient.rpc("get_player_state");

  if (error || !data?.success) {
    return;
  }

  playerState = data.state;
  renderSplashes();
}

function getRechargeRemainingSeconds() {
  if (!playerState.next_splash_at) return 0;
  const readyAt = new Date(playerState.next_splash_at).getTime();
  return Math.max(0, Math.ceil((readyAt - Date.now()) / 1000));
}

function renderSplashes() {
  const current = playerState.splashes ?? 0;
  const capacity = playerState.splash_capacity ?? 50;
  const percent = capacity > 0 ? Math.max(0, Math.min(100, (current / capacity) * 100)) : 0;

  splashesLabel.textContent = `Splashes ${current}/${capacity}`;
  splashFill.style.width = `${percent}%`;

  if (!currentUser) {
    rechargeLabel.textContent = "Login required";
    return;
  }

  if (current >= capacity) {
    rechargeLabel.textContent = "Full";
    return;
  }

  const left = getRechargeRemainingSeconds();
  rechargeLabel.textContent = left > 0 ? `+1 in ${left}s` : "Recharging";
}

async function loadVisibleBlocks() {
  if (!supabaseClient) return;

  const { data, error } = await supabaseClient.rpc("get_visible_blocks", {
    p_min_x: 0,
    p_min_y: 0,
    p_max_x: MAP_SIZE - 1,
    p_max_y: MAP_SIZE - 1
  });

  if (error) return;

  placed.clear();

  const rows = Array.isArray(data) ? data : [];

  for (const row of rows) {
    if (Number.isInteger(row.x) && Number.isInteger(row.y) && BLOCKS[row.block_id]) {
      placed.set(key(row.x, row.y), row.block_id);
    }
  }
}

function subscribeToRealtime() {
  if (!supabaseClient) return;

  if (realtimeChannel) {
    supabaseClient.removeChannel(realtimeChannel);
  }

  realtimeChannel = supabaseClient
    .channel("placed-blocks-map")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "placed_blocks"
      },
      payload => {
        const row = payload.new;

        if (!row || !Number.isInteger(row.x) || !Number.isInteger(row.y)) return;
        if (!BLOCKS[row.block_id]) return;

        placed.set(key(row.x, row.y), row.block_id);
        draw();
      }
    )
    .subscribe();
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  draw();
}

function screenToWorld(sx, sy) {
  const rect = canvas.getBoundingClientRect();
  const cx = sx - rect.left - rect.width / 2;
  const cy = sy - rect.top - rect.height / 2;
  return {
    x: camera.x + cx / camera.zoom,
    y: camera.y + cy / camera.zoom
  };
}

function screenToTile(sx, sy) {
  const world = screenToWorld(sx, sy);
  return {
    x: Math.floor(world.x / TILE_SIZE),
    y: Math.floor(world.y / TILE_SIZE)
  };
}

function clampCamera() {
  const max = MAP_SIZE * TILE_SIZE;
  camera.x = Math.max(0, Math.min(max, camera.x));
  camera.y = Math.max(0, Math.min(max, camera.y));
  camera.zoom = Math.max(0.35, Math.min(6, camera.zoom));
}

function drawGrid(viewW, viewH) {
  const worldLeft = camera.x - viewW / 2 / camera.zoom;
  const worldTop = camera.y - viewH / 2 / camera.zoom;
  const worldRight = camera.x + viewW / 2 / camera.zoom;
  const worldBottom = camera.y + viewH / 2 / camera.zoom;

  const startX = Math.max(0, Math.floor(worldLeft / TILE_SIZE));
  const startY = Math.max(0, Math.floor(worldTop / TILE_SIZE));
  const endX = Math.min(MAP_SIZE - 1, Math.ceil(worldRight / TILE_SIZE));
  const endY = Math.min(MAP_SIZE - 1, Math.ceil(worldBottom / TILE_SIZE));

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      const block = placed.get(key(x, y)) || "grass";
      ctx.drawImage(getTexture(block), x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }

  if (camera.zoom >= 1.25) {
    ctx.beginPath();
    ctx.strokeStyle = "rgba(0,0,0,.22)";
    ctx.lineWidth = 1 / camera.zoom;

    for (let x = startX; x <= endX + 1; x++) {
      ctx.moveTo(x * TILE_SIZE, startY * TILE_SIZE);
      ctx.lineTo(x * TILE_SIZE, (endY + 1) * TILE_SIZE);
    }

    for (let y = startY; y <= endY + 1; y++) {
      ctx.moveTo(startX * TILE_SIZE, y * TILE_SIZE);
      ctx.lineTo((endX + 1) * TILE_SIZE, y * TILE_SIZE);
    }

    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(255,255,255,.35)";
  ctx.lineWidth = 2 / camera.zoom;
  ctx.strokeRect(0, 0, MAP_SIZE * TILE_SIZE, MAP_SIZE * TILE_SIZE);
}

function draw() {
  const rect = canvas.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;

  ctx.save();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = "#0b0d11";
  ctx.fillRect(0, 0, w, h);

  ctx.translate(w / 2, h / 2);
  ctx.scale(camera.zoom, camera.zoom);
  ctx.translate(-camera.x, -camera.y);

  ctx.imageSmoothingEnabled = false;
  drawGrid(w, h);

  ctx.restore();

  zoomLabel.textContent = `Zoom ${camera.zoom.toFixed(2)}x`;
  renderSplashes();
}

async function placeAt(tileX, tileY) {
  if (tileX < 0 || tileY < 0 || tileX >= MAP_SIZE || tileY >= MAP_SIZE) return;

  if (!currentUser) {
    showToast("Login required");
    return;
  }

  if (isPlacing) return;

  isPlacing = true;

  const { data, error } = await supabaseClient.rpc("place_block", {
    p_x: tileX,
    p_y: tileY,
    p_block_id: selectedBlock
  });

  isPlacing = false;

  if (error) {
    showToast("Could not place block");
    return;
  }

  if (!data?.success) {
    const code = data?.error || "error";

    if (code === "no_splashes") {
      if (data.state) playerState = data.state;
      renderSplashes();
      showToast("No splashes");
      return;
    }

    if (code === "user_banned") {
      showToast("Account banned");
      return;
    }

    showToast(code.replaceAll("_", " "));
    return;
  }

  if (data.block && BLOCKS[data.block.block_id]) {
    placed.set(key(data.block.x, data.block.y), data.block.block_id);
  }

  if (data.state) {
    playerState = data.state;
  }

  renderSplashes();
  draw();
}

function buildPalette() {
  paletteEl.innerHTML = "";

  for (const [id, block] of Object.entries(BLOCKS)) {
    const item = document.createElement("button");
    item.className = "block" + (id === selectedBlock ? " selected" : "");
    item.title = block.name;
    item.onclick = () => {
      selectedBlock = id;
      document.querySelectorAll(".block").forEach(el => el.classList.remove("selected"));
      item.classList.add("selected");
    };

    const preview = getTexture(id).cloneNode(true);
    const label = document.createElement("span");
    label.className = "name";
    label.textContent = block.name;

    item.appendChild(preview);
    item.appendChild(label);
    paletteEl.appendChild(item);
  }
}

canvas.addEventListener("contextmenu", e => e.preventDefault());

canvas.addEventListener("pointerdown", e => {
  const shouldPan = e.button === 1 || e.button === 2 || spaceDown;

  if (shouldPan) {
    isPanning = true;
    panStart = { x: e.clientX, y: e.clientY, camX: camera.x, camY: camera.y };
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = "grabbing";
    return;
  }

  if (e.button === 0) {
    const t = screenToTile(e.clientX, e.clientY);
    placeAt(t.x, t.y);
  }
});

canvas.addEventListener("pointermove", e => {
  const tile = screenToTile(e.clientX, e.clientY);
  coordsEl.textContent = `X ${tile.x} · Y ${tile.y}`;

  if (isPanning) {
    camera.x = panStart.camX - (e.clientX - panStart.x) / camera.zoom;
    camera.y = panStart.camY - (e.clientY - panStart.y) / camera.zoom;
    clampCamera();
    draw();
  }
});

canvas.addEventListener("pointerup", () => {
  isPanning = false;
  canvas.style.cursor = "crosshair";
});

canvas.addEventListener("wheel", e => {
  e.preventDefault();

  const before = screenToWorld(e.clientX, e.clientY);
  const factor = e.deltaY < 0 ? 1.12 : 0.88;
  camera.zoom *= factor;
  clampCamera();

  const after = screenToWorld(e.clientX, e.clientY);
  camera.x += before.x - after.x;
  camera.y += before.y - after.y;

  clampCamera();
  draw();
}, { passive: false });

window.addEventListener("keydown", e => {
  if (e.code === "Space") {
    spaceDown = true;
    canvas.style.cursor = "grab";
    e.preventDefault();
  }
});

window.addEventListener("keyup", e => {
  if (e.code === "Space") {
    spaceDown = false;
    canvas.style.cursor = "crosshair";
  }
});

window.addEventListener("resize", resize);

(async function init() {
  await initAuth();
  buildPalette();
  resize();
  await loadVisibleBlocks();
  await loadPlayerState();
  subscribeToRealtime();
  draw();
  setInterval(renderSplashes, 1000);
})();
