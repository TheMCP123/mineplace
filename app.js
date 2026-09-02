
const SUPABASE_URL = "https://ybfgmotbrlhmzlaxfyaq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_bjnUPSDIi8yQdnzvMxhCJg_mlVczei7";
const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const canvas = document.getElementById("world");
const ctx = canvas.getContext("2d", { alpha: false });

const paletteEl = document.getElementById("palette");
const blockSearchEl = document.getElementById("blockSearch");
const blockCountEl = document.getElementById("blockCount");
const inventorySliderEl = document.getElementById("inventorySlider");
const inventoryToggleBtnEl = document.getElementById("inventoryToggleBtn");
const viewMapBtnEl = document.getElementById("viewMapBtn");
const downloadMapBtnEl = document.getElementById("downloadMapBtn");
const downloadMapLabelEl = document.getElementById("downloadMapLabel");
const downloadFormatBtnEl = document.getElementById("downloadFormatBtn");
const downloadFormatMenuEl = document.getElementById("downloadFormatMenu");
const helpBtnEl = document.getElementById("helpBtn");
const helpModalEl = document.getElementById("helpModal");
const helpCloseBtnEl = document.getElementById("helpCloseBtn");
const onlineBubbleEl = document.getElementById("onlineBubble");
const onlineCountEl = document.getElementById("onlineCount");
const onlineListEl = document.getElementById("onlineList");
const adminModalEl = document.getElementById("adminModal");
const adminSearchInputEl = document.getElementById("adminSearchInput");
const adminSearchBtnEl = document.getElementById("adminSearchBtn");
const adminUsersEl = document.getElementById("adminUsers");
const adminEditEl = document.getElementById("adminEdit");
const adminSelectedUserEl = document.getElementById("adminSelectedUser");
const adminBlocksInputEl = document.getElementById("adminBlocksInput");
const adminSetBtnEl = document.getElementById("adminSetBtn");
const adminPlusBtnEl = document.getElementById("adminPlusBtn");
const adminMinusBtnEl = document.getElementById("adminMinusBtn");
const adminCloseBtnEl = document.getElementById("adminCloseBtn");
const adminBanStatusEl = document.getElementById("adminBanStatus");
const adminBanReasonInputEl = document.getElementById("adminBanReasonInput");
const adminBan1hBtnEl = document.getElementById("adminBan1hBtn");
const adminBan1dBtnEl = document.getElementById("adminBan1dBtn");
const adminBan7dBtnEl = document.getElementById("adminBan7dBtn");
const adminBanForeverBtnEl = document.getElementById("adminBanForeverBtn");
const adminUnbanBtnEl = document.getElementById("adminUnbanBtn");
const adminPaintToolBtnEl = document.getElementById("adminPaintToolBtn");
const coordsTeleportBtnEl = document.getElementById("coordsTeleportBtn");
const coordsTeleportModalEl = document.getElementById("coordsTeleportModal");
const coordsTeleportCloseBtnEl = document.getElementById("coordsTeleportCloseBtn");
const coordsTeleportGoBtnEl = document.getElementById("coordsTeleportGoBtn");
const coordsTeleportXEl = document.getElementById("coordsTeleportX");
const coordsTeleportZEl = document.getElementById("coordsTeleportZ");
const coordsEl = document.getElementById("coords");
const zoomLabel = document.getElementById("zoomLabel");
const authBox = document.getElementById("authBox");
const blocksLabel = document.getElementById("blocksLabel");
const rechargeLabel = document.getElementById("rechargeLabel");
const blocksFill = document.getElementById("blocksFill");

const MAP_SIZE = 1001;
const MAP_RADIUS = 500;
const TILE_SIZE = 16;
const DEFAULT_GRID_BLOCK = "grass_top";
const MIN_ZOOM = 0.08;
const MAX_ZOOM = 8;
const GRID_DETAIL_ZOOM = 0.75;
const TILE_TEXTURE_ZOOM = 0.38;
const PLACE_SOUND_SRC = "/place.mp3";
const PLACE_SOUND_POOL_SIZE = 6;

const BLOCK_DEFS = [
  {
    "id": "grass_top",
    "name": "Grass Top",
    "src": "/textures/grass_top.png",
    "sort_order": 10
  },
  {
    "id": "grass_side",
    "name": "Grass Side",
    "src": "/textures/grass_side.png",
    "sort_order": 20
  },
  {
    "id": "bedrock",
    "name": "Bedrock",
    "src": "/textures/bedrock.png",
    "sort_order": 30
  },
  {
    "id": "black_concrete",
    "name": "Black Concrete",
    "src": "/textures/black_concrete.png",
    "sort_order": 40
  },
  {
    "id": "black_concrete_powder",
    "name": "Black Concrete Powder",
    "src": "/textures/black_concrete_powder.png",
    "sort_order": 50
  },
  {
    "id": "black_wool",
    "name": "Black Wool",
    "src": "/textures/black_wool.png",
    "sort_order": 60
  },
  {
    "id": "blue_concrete",
    "name": "Blue Concrete",
    "src": "/textures/blue_concrete.png",
    "sort_order": 70
  },
  {
    "id": "blue_concrete_powder",
    "name": "Blue Concrete Powder",
    "src": "/textures/blue_concrete_powder.png",
    "sort_order": 80
  },
  {
    "id": "blue_wool",
    "name": "Blue Wool",
    "src": "/textures/blue_wool.png",
    "sort_order": 90
  },
  {
    "id": "brown_concrete",
    "name": "Brown Concrete",
    "src": "/textures/brown_concrete.png",
    "sort_order": 100
  },
  {
    "id": "brown_concrete_powder",
    "name": "Brown Concrete Powder",
    "src": "/textures/brown_concrete_powder.png",
    "sort_order": 110
  },
  {
    "id": "brown_wool",
    "name": "Brown Wool",
    "src": "/textures/brown_wool.png",
    "sort_order": 120
  },
  {
    "id": "chiseled_deepslate",
    "name": "Chiseled Deepslate",
    "src": "/textures/chiseled_deepslate.png",
    "sort_order": 130
  },
  {
    "id": "chiseled_stone_bricks",
    "name": "Chiseled Stone Bricks",
    "src": "/textures/chiseled_stone_bricks.png",
    "sort_order": 140
  },
  {
    "id": "coal_ore",
    "name": "Coal Ore",
    "src": "/textures/coal_ore.png",
    "sort_order": 150
  },
  {
    "id": "coarse_dirt",
    "name": "Coarse Dirt",
    "src": "/textures/coarse_dirt.png",
    "sort_order": 160
  },
  {
    "id": "cobbled_deepslate",
    "name": "Cobbled Deepslate",
    "src": "/textures/cobbled_deepslate.png",
    "sort_order": 170
  },
  {
    "id": "copper_ore",
    "name": "Copper Ore",
    "src": "/textures/copper_ore.png",
    "sort_order": 180
  },
  {
    "id": "cracked_deepslate_bricks",
    "name": "Cracked Deepslate Bricks",
    "src": "/textures/cracked_deepslate_bricks.png",
    "sort_order": 190
  },
  {
    "id": "cracked_deepslate_tiles",
    "name": "Cracked Deepslate Tiles",
    "src": "/textures/cracked_deepslate_tiles.png",
    "sort_order": 200
  },
  {
    "id": "cracked_stone_bricks",
    "name": "Cracked Stone Bricks",
    "src": "/textures/cracked_stone_bricks.png",
    "sort_order": 210
  },
  {
    "id": "crying_obsidian",
    "name": "Crying Obsidian",
    "src": "/textures/crying_obsidian.png",
    "sort_order": 220
  },
  {
    "id": "cyan_concrete",
    "name": "Cyan Concrete",
    "src": "/textures/cyan_concrete.png",
    "sort_order": 230
  },
  {
    "id": "cyan_concrete_powder",
    "name": "Cyan Concrete Powder",
    "src": "/textures/cyan_concrete_powder.png",
    "sort_order": 240
  },
  {
    "id": "cyan_wool",
    "name": "Cyan Wool",
    "src": "/textures/cyan_wool.png",
    "sort_order": 250
  },
  {
    "id": "deepslate",
    "name": "Deepslate",
    "src": "/textures/deepslate.png",
    "sort_order": 260
  },
  {
    "id": "deepslate_bricks",
    "name": "Deepslate Bricks",
    "src": "/textures/deepslate_bricks.png",
    "sort_order": 270
  },
  {
    "id": "deepslate_coal_ore",
    "name": "Deepslate Coal Ore",
    "src": "/textures/deepslate_coal_ore.png",
    "sort_order": 280
  },
  {
    "id": "deepslate_copper_ore",
    "name": "Deepslate Copper Ore",
    "src": "/textures/deepslate_copper_ore.png",
    "sort_order": 290
  },
  {
    "id": "deepslate_diamond_ore",
    "name": "Deepslate Diamond Ore",
    "src": "/textures/deepslate_diamond_ore.png",
    "sort_order": 300
  },
  {
    "id": "deepslate_emerald_ore",
    "name": "Deepslate Emerald Ore",
    "src": "/textures/deepslate_emerald_ore.png",
    "sort_order": 310
  },
  {
    "id": "deepslate_gold_ore",
    "name": "Deepslate Gold Ore",
    "src": "/textures/deepslate_gold_ore.png",
    "sort_order": 320
  },
  {
    "id": "deepslate_iron_ore",
    "name": "Deepslate Iron Ore",
    "src": "/textures/deepslate_iron_ore.png",
    "sort_order": 330
  },
  {
    "id": "deepslate_lapis_ore",
    "name": "Deepslate Lapis Ore",
    "src": "/textures/deepslate_lapis_ore.png",
    "sort_order": 340
  },
  {
    "id": "deepslate_redstone_ore",
    "name": "Deepslate Redstone Ore",
    "src": "/textures/deepslate_redstone_ore.png",
    "sort_order": 350
  },
  {
    "id": "deepslate_tiles",
    "name": "Deepslate Tiles",
    "src": "/textures/deepslate_tiles.png",
    "sort_order": 360
  },
  {
    "id": "diamond_ore",
    "name": "Diamond Ore",
    "src": "/textures/diamond_ore.png",
    "sort_order": 370
  },
  {
    "id": "dirt",
    "name": "Dirt",
    "src": "/textures/dirt.png",
    "sort_order": 380
  },
  {
    "id": "emerald_ore",
    "name": "Emerald Ore",
    "src": "/textures/emerald_ore.png",
    "sort_order": 390
  },
  {
    "id": "end_stone",
    "name": "End Stone",
    "src": "/textures/end_stone.png",
    "sort_order": 400
  },
  {
    "id": "end_stone_bricks",
    "name": "End Stone Bricks",
    "src": "/textures/end_stone_bricks.png",
    "sort_order": 410
  },
  {
    "id": "gold_ore",
    "name": "Gold Ore",
    "src": "/textures/gold_ore.png",
    "sort_order": 420
  },
  {
    "id": "gray_concrete",
    "name": "Gray Concrete",
    "src": "/textures/gray_concrete.png",
    "sort_order": 430
  },
  {
    "id": "gray_concrete_powder",
    "name": "Gray Concrete Powder",
    "src": "/textures/gray_concrete_powder.png",
    "sort_order": 440
  },
  {
    "id": "gray_wool",
    "name": "Gray Wool",
    "src": "/textures/gray_wool.png",
    "sort_order": 450
  },
  {
    "id": "green_concrete",
    "name": "Green Concrete",
    "src": "/textures/green_concrete.png",
    "sort_order": 460
  },
  {
    "id": "green_concrete_powder",
    "name": "Green Concrete Powder",
    "src": "/textures/green_concrete_powder.png",
    "sort_order": 470
  },
  {
    "id": "green_wool",
    "name": "Green Wool",
    "src": "/textures/green_wool.png",
    "sort_order": 480
  },
  {
    "id": "iron_ore",
    "name": "Iron Ore",
    "src": "/textures/iron_ore.png",
    "sort_order": 490
  },
  {
    "id": "lapis_ore",
    "name": "Lapis Ore",
    "src": "/textures/lapis_ore.png",
    "sort_order": 500
  },
  {
    "id": "light_blue_concrete",
    "name": "Light Blue Concrete",
    "src": "/textures/light_blue_concrete.png",
    "sort_order": 510
  },
  {
    "id": "light_blue_concrete_powder",
    "name": "Light Blue Concrete Powder",
    "src": "/textures/light_blue_concrete_powder.png",
    "sort_order": 520
  },
  {
    "id": "light_blue_wool",
    "name": "Light Blue Wool",
    "src": "/textures/light_blue_wool.png",
    "sort_order": 530
  },
  {
    "id": "light_gray_concrete",
    "name": "Light Gray Concrete",
    "src": "/textures/light_gray_concrete.png",
    "sort_order": 540
  },
  {
    "id": "light_gray_concrete_powder",
    "name": "Light Gray Concrete Powder",
    "src": "/textures/light_gray_concrete_powder.png",
    "sort_order": 550
  },
  {
    "id": "light_gray_wool",
    "name": "Light Gray Wool",
    "src": "/textures/light_gray_wool.png",
    "sort_order": 560
  },
  {
    "id": "lime_concrete",
    "name": "Lime Concrete",
    "src": "/textures/lime_concrete.png",
    "sort_order": 570
  },
  {
    "id": "lime_concrete_powder",
    "name": "Lime Concrete Powder",
    "src": "/textures/lime_concrete_powder.png",
    "sort_order": 580
  },
  {
    "id": "lime_wool",
    "name": "Lime Wool",
    "src": "/textures/lime_wool.png",
    "sort_order": 590
  },
  {
    "id": "magenta_concrete",
    "name": "Magenta Concrete",
    "src": "/textures/magenta_concrete.png",
    "sort_order": 600
  },
  {
    "id": "magenta_concrete_powder",
    "name": "Magenta Concrete Powder",
    "src": "/textures/magenta_concrete_powder.png",
    "sort_order": 610
  },
  {
    "id": "magenta_wool",
    "name": "Magenta Wool",
    "src": "/textures/magenta_wool.png",
    "sort_order": 620
  },
  {
    "id": "mossy_stone_bricks",
    "name": "Mossy Stone Bricks",
    "src": "/textures/mossy_stone_bricks.png",
    "sort_order": 630
  },
  {
    "id": "nether_gold_ore",
    "name": "Nether Gold Ore",
    "src": "/textures/nether_gold_ore.png",
    "sort_order": 640
  },
  {
    "id": "nether_quartz_ore",
    "name": "Nether Quartz Ore",
    "src": "/textures/nether_quartz_ore.png",
    "sort_order": 650
  },
  {
    "id": "obsidian",
    "name": "Obsidian",
    "src": "/textures/obsidian.png",
    "sort_order": 660
  },
  {
    "id": "orange_concrete",
    "name": "Orange Concrete",
    "src": "/textures/orange_concrete.png",
    "sort_order": 670
  },
  {
    "id": "orange_concrete_powder",
    "name": "Orange Concrete Powder",
    "src": "/textures/orange_concrete_powder.png",
    "sort_order": 680
  },
  {
    "id": "orange_wool",
    "name": "Orange Wool",
    "src": "/textures/orange_wool.png",
    "sort_order": 690
  },
  {
    "id": "pink_concrete",
    "name": "Pink Concrete",
    "src": "/textures/pink_concrete.png",
    "sort_order": 700
  },
  {
    "id": "pink_concrete_powder",
    "name": "Pink Concrete Powder",
    "src": "/textures/pink_concrete_powder.png",
    "sort_order": 710
  },
  {
    "id": "pink_wool",
    "name": "Pink Wool",
    "src": "/textures/pink_wool.png",
    "sort_order": 720
  },
  {
    "id": "polished_deepslate",
    "name": "Polished Deepslate",
    "src": "/textures/polished_deepslate.png",
    "sort_order": 730
  },
  {
    "id": "purple_concrete",
    "name": "Purple Concrete",
    "src": "/textures/purple_concrete.png",
    "sort_order": 740
  },
  {
    "id": "purple_concrete_powder",
    "name": "Purple Concrete Powder",
    "src": "/textures/purple_concrete_powder.png",
    "sort_order": 750
  },
  {
    "id": "purple_wool",
    "name": "Purple Wool",
    "src": "/textures/purple_wool.png",
    "sort_order": 760
  },
  {
    "id": "red_concrete",
    "name": "Red Concrete",
    "src": "/textures/red_concrete.png",
    "sort_order": 770
  },
  {
    "id": "red_concrete_powder",
    "name": "Red Concrete Powder",
    "src": "/textures/red_concrete_powder.png",
    "sort_order": 780
  },
  {
    "id": "red_wool",
    "name": "Red Wool",
    "src": "/textures/red_wool.png",
    "sort_order": 790
  },
  {
    "id": "redstone_ore",
    "name": "Redstone Ore",
    "src": "/textures/redstone_ore.png",
    "sort_order": 800
  },
  {
    "id": "reinforced_deepslate",
    "name": "Reinforced Deepslate",
    "src": "/textures/reinforced_deepslate.png",
    "sort_order": 810
  },
  {
    "id": "rooted_dirt",
    "name": "Rooted Dirt",
    "src": "/textures/rooted_dirt.png",
    "sort_order": 820
  },
  {
    "id": "smooth_stone",
    "name": "Smooth Stone",
    "src": "/textures/smooth_stone.png",
    "sort_order": 830
  },
  {
    "id": "stone",
    "name": "Stone",
    "src": "/textures/stone.png",
    "sort_order": 840
  },
  {
    "id": "stone_bricks",
    "name": "Stone Bricks",
    "src": "/textures/stone_bricks.png",
    "sort_order": 850
  },
  {
    "id": "white_concrete",
    "name": "White Concrete",
    "src": "/textures/white_concrete.png",
    "sort_order": 860
  },
  {
    "id": "white_concrete_powder",
    "name": "White Concrete Powder",
    "src": "/textures/white_concrete_powder.png",
    "sort_order": 870
  },
  {
    "id": "white_wool",
    "name": "White Wool",
    "src": "/textures/white_wool.png",
    "sort_order": 880
  },
  {
    "id": "yellow_concrete",
    "name": "Yellow Concrete",
    "src": "/textures/yellow_concrete.png",
    "sort_order": 890
  },
  {
    "id": "yellow_concrete_powder",
    "name": "Yellow Concrete Powder",
    "src": "/textures/yellow_concrete_powder.png",
    "sort_order": 900
  },
  {
    "id": "yellow_wool",
    "name": "Yellow Wool",
    "src": "/textures/yellow_wool.png",
    "sort_order": 910
  },
  {
    "id": "acacia_log",
    "name": "Acacia Log",
    "src": "/textures/acacia_log.png",
    "sort_order": 920
  },
  {
    "id": "acacia_log_top",
    "name": "Acacia Log Top",
    "src": "/textures/acacia_log_top.png",
    "sort_order": 930
  },
  {
    "id": "acacia_planks",
    "name": "Acacia Planks",
    "src": "/textures/acacia_planks.png",
    "sort_order": 940
  },
  {
    "id": "bamboo_planks",
    "name": "Bamboo Planks",
    "src": "/textures/bamboo_planks.png",
    "sort_order": 950
  },
  {
    "id": "birch_log",
    "name": "Birch Log",
    "src": "/textures/birch_log.png",
    "sort_order": 960
  },
  {
    "id": "birch_log_top",
    "name": "Birch Log Top",
    "src": "/textures/birch_log_top.png",
    "sort_order": 970
  },
  {
    "id": "birch_planks",
    "name": "Birch Planks",
    "src": "/textures/birch_planks.png",
    "sort_order": 980
  },
  {
    "id": "cherry_log",
    "name": "Cherry Log",
    "src": "/textures/cherry_log.png",
    "sort_order": 990
  },
  {
    "id": "cherry_log_top",
    "name": "Cherry Log Top",
    "src": "/textures/cherry_log_top.png",
    "sort_order": 1000
  },
  {
    "id": "cherry_planks",
    "name": "Cherry Planks",
    "src": "/textures/cherry_planks.png",
    "sort_order": 1010
  },
  {
    "id": "chiseled_nether_bricks",
    "name": "Chiseled Nether Bricks",
    "src": "/textures/chiseled_nether_bricks.png",
    "sort_order": 1020
  },
  {
    "id": "cracked_nether_bricks",
    "name": "Cracked Nether Bricks",
    "src": "/textures/cracked_nether_bricks.png",
    "sort_order": 1030
  },
  {
    "id": "crimson_planks",
    "name": "Crimson Planks",
    "src": "/textures/crimson_planks.png?v=65",
    "sort_order": 1040
  },
  {
    "id": "dark_oak_log",
    "name": "Dark Oak Log",
    "src": "/textures/dark_oak_log.png",
    "sort_order": 1050
  },
  {
    "id": "dark_oak_log_top",
    "name": "Dark Oak Log Top",
    "src": "/textures/dark_oak_log_top.png",
    "sort_order": 1060
  },
  {
    "id": "dark_oak_planks",
    "name": "Dark Oak Planks",
    "src": "/textures/dark_oak_planks.png",
    "sort_order": 1070
  },
  {
    "id": "jungle_log",
    "name": "Jungle Log",
    "src": "/textures/jungle_log.png",
    "sort_order": 1080
  },
  {
    "id": "jungle_log_top",
    "name": "Jungle Log Top",
    "src": "/textures/jungle_log_top.png",
    "sort_order": 1090
  },
  {
    "id": "jungle_planks",
    "name": "Jungle Planks",
    "src": "/textures/jungle_planks.png",
    "sort_order": 1100
  },
  {
    "id": "lava",
    "name": "Lava",
    "src": "/textures/lava.png",
    "sort_order": 1110
  },
  {
    "id": "mangrove_log",
    "name": "Mangrove Log",
    "src": "/textures/mangrove_log.png",
    "sort_order": 1120
  },
  {
    "id": "mangrove_log_top",
    "name": "Mangrove Log Top",
    "src": "/textures/mangrove_log_top.png",
    "sort_order": 1130
  },
  {
    "id": "mangrove_planks",
    "name": "Mangrove Planks",
    "src": "/textures/mangrove_planks.png",
    "sort_order": 1140
  },
  {
    "id": "nether_bricks",
    "name": "Nether Bricks",
    "src": "/textures/nether_bricks.png",
    "sort_order": 1150
  },
  {
    "id": "netherrack",
    "name": "Netherrack",
    "src": "/textures/netherrack.png",
    "sort_order": 1160
  },
  {
    "id": "oak_log",
    "name": "Oak Log",
    "src": "/textures/oak_log.png",
    "sort_order": 1170
  },
  {
    "id": "oak_log_top",
    "name": "Oak Log Top",
    "src": "/textures/oak_log_top.png",
    "sort_order": 1180
  },
  {
    "id": "oak_planks",
    "name": "Oak Planks",
    "src": "/textures/oak_planks.png",
    "sort_order": 1190
  },
  {
    "id": "pale_oak_log",
    "name": "Pale Oak Log",
    "src": "/textures/pale_oak_log.png?v=65",
    "sort_order": 1200
  },
  {
    "id": "pale_oak_log_top",
    "name": "Pale Oak Log Top",
    "src": "/textures/pale_oak_log_top.png?v=65",
    "sort_order": 1210
  },
  {
    "id": "pale_oak_planks",
    "name": "Pale Oak Planks",
    "src": "/textures/pale_oak_planks.png?v=65",
    "sort_order": 1220
  },
  {
    "id": "purpur_block",
    "name": "Purpur Block",
    "src": "/textures/purpur_block.png",
    "sort_order": 1230
  },
  {
    "id": "purpur_pillar_side",
    "name": "Purpur Pillar Side",
    "src": "/textures/purpur_pillar_side.png",
    "sort_order": 1240
  },
  {
    "id": "purpur_pillar_top",
    "name": "Purpur Pillar Top",
    "src": "/textures/purpur_pillar_top.png",
    "sort_order": 1250
  },
  {
    "id": "spruce_log",
    "name": "Spruce Log",
    "src": "/textures/spruce_log.png",
    "sort_order": 1260
  },
  {
    "id": "spruce_log_top",
    "name": "Spruce Log Top",
    "src": "/textures/spruce_log_top.png",
    "sort_order": 1270
  },
  {
    "id": "spruce_planks",
    "name": "Spruce Planks",
    "src": "/textures/spruce_planks.png",
    "sort_order": 1280
  },
  {
    "id": "stripped_acacia_log",
    "name": "Stripped Acacia Log",
    "src": "/textures/stripped_acacia_log.png",
    "sort_order": 1290
  },
  {
    "id": "stripped_acacia_log_top",
    "name": "Stripped Acacia Log Top",
    "src": "/textures/stripped_acacia_log_top.png",
    "sort_order": 1300
  },
  {
    "id": "stripped_birch_log",
    "name": "Stripped Birch Log",
    "src": "/textures/stripped_birch_log.png",
    "sort_order": 1310
  },
  {
    "id": "stripped_birch_log_top",
    "name": "Stripped Birch Log Top",
    "src": "/textures/stripped_birch_log_top.png",
    "sort_order": 1320
  },
  {
    "id": "stripped_cherry_log",
    "name": "Stripped Cherry Log",
    "src": "/textures/stripped_cherry_log.png",
    "sort_order": 1330
  },
  {
    "id": "stripped_cherry_log_top",
    "name": "Stripped Cherry Log Top",
    "src": "/textures/stripped_cherry_log_top.png",
    "sort_order": 1340
  },
  {
    "id": "stripped_dark_oak_log",
    "name": "Stripped Dark Oak Log",
    "src": "/textures/stripped_dark_oak_log.png",
    "sort_order": 1350
  },
  {
    "id": "stripped_dark_oak_log_top",
    "name": "Stripped Dark Oak Log Top",
    "src": "/textures/stripped_dark_oak_log_top.png",
    "sort_order": 1360
  },
  {
    "id": "stripped_jungle_log",
    "name": "Stripped Jungle Log",
    "src": "/textures/stripped_jungle_log.png",
    "sort_order": 1370
  },
  {
    "id": "stripped_jungle_log_top",
    "name": "Stripped Jungle Log Top",
    "src": "/textures/stripped_jungle_log_top.png",
    "sort_order": 1380
  },
  {
    "id": "stripped_mangrove_log",
    "name": "Stripped Mangrove Log",
    "src": "/textures/stripped_mangrove_log.png",
    "sort_order": 1390
  },
  {
    "id": "stripped_mangrove_log_top",
    "name": "Stripped Mangrove Log Top",
    "src": "/textures/stripped_mangrove_log_top.png",
    "sort_order": 1400
  },
  {
    "id": "stripped_oak_log",
    "name": "Stripped Oak Log",
    "src": "/textures/stripped_oak_log.png",
    "sort_order": 1410
  },
  {
    "id": "stripped_oak_log_top",
    "name": "Stripped Oak Log Top",
    "src": "/textures/stripped_oak_log_top.png",
    "sort_order": 1420
  },
  {
    "id": "stripped_pale_oak_log",
    "name": "Stripped Pale Oak Log",
    "src": "/textures/stripped_pale_oak_log.png?v=65",
    "sort_order": 1430
  },
  {
    "id": "stripped_pale_oak_log_top",
    "name": "Stripped Pale Oak Log Top",
    "src": "/textures/stripped_pale_oak_log_top.png?v=65",
    "sort_order": 1440
  },
  {
    "id": "stripped_spruce_log",
    "name": "Stripped Spruce Log",
    "src": "/textures/stripped_spruce_log.png",
    "sort_order": 1450
  },
  {
    "id": "stripped_spruce_log_top",
    "name": "Stripped Spruce Log Top",
    "src": "/textures/stripped_spruce_log_top.png",
    "sort_order": 1460
  },
  {
    "id": "warped_planks",
    "name": "Warped Planks",
    "src": "/textures/warped_planks.png?v=65",
    "sort_order": 1470
  },
  {
    "id": "water",
    "name": "Water",
    "src": "/textures/water.png",
    "sort_order": 1480
  },
  {
    "id": "amethyst_block",
    "name": "Amethyst Block",
    "src": "/textures/amethyst_block.png?v=65",
    "sort_order": 1490
  },
  {
    "id": "ancient_debris_side",
    "name": "Ancient Debris Side",
    "src": "/textures/ancient_debris_side.png?v=65",
    "sort_order": 1500
  },
  {
    "id": "ancient_debris_top",
    "name": "Ancient Debris Top",
    "src": "/textures/ancient_debris_top.png?v=65",
    "sort_order": 1510
  },
  {
    "id": "bamboo_block",
    "name": "Bamboo Block",
    "src": "/textures/bamboo_block.png?v=65",
    "sort_order": 1520
  },
  {
    "id": "bamboo_block_top",
    "name": "Bamboo Block Top",
    "src": "/textures/bamboo_block_top.png?v=65",
    "sort_order": 1530
  },
  {
    "id": "barrel_bottom",
    "name": "Barrel Bottom",
    "src": "/textures/barrel_bottom.png?v=65",
    "sort_order": 1540
  },
  {
    "id": "barrel_side",
    "name": "Barrel Side",
    "src": "/textures/barrel_side.png?v=65",
    "sort_order": 1550
  },
  {
    "id": "barrel_top",
    "name": "Barrel Top",
    "src": "/textures/barrel_top.png?v=65",
    "sort_order": 1560
  },
  {
    "id": "barrel_top_open",
    "name": "Barrel Top Open",
    "src": "/textures/barrel_top_open.png?v=65",
    "sort_order": 1570
  },
  {
    "id": "basalt_side",
    "name": "Basalt Side",
    "src": "/textures/basalt_side.png?v=65",
    "sort_order": 1580
  },
  {
    "id": "basalt_top",
    "name": "Basalt Top",
    "src": "/textures/basalt_top.png?v=65",
    "sort_order": 1590
  },
  {
    "id": "black_shulker_box",
    "name": "Black Shulker Box",
    "src": "/textures/black_shulker_box.png?v=65",
    "sort_order": 1600
  },
  {
    "id": "black_terracotta",
    "name": "Black Terracotta",
    "src": "/textures/black_terracotta.png?v=65",
    "sort_order": 1610
  },
  {
    "id": "blue_ice",
    "name": "Blue Ice",
    "src": "/textures/blue_ice.png?v=65",
    "sort_order": 1620
  },
  {
    "id": "blue_shulker_box",
    "name": "Blue Shulker Box",
    "src": "/textures/blue_shulker_box.png?v=65",
    "sort_order": 1630
  },
  {
    "id": "blue_terracotta",
    "name": "Blue Terracotta",
    "src": "/textures/blue_terracotta.png?v=65",
    "sort_order": 1640
  },
  {
    "id": "brown_shulker_box",
    "name": "Brown Shulker Box",
    "src": "/textures/brown_shulker_box.png?v=65",
    "sort_order": 1650
  },
  {
    "id": "brown_terracotta",
    "name": "Brown Terracotta",
    "src": "/textures/brown_terracotta.png?v=65",
    "sort_order": 1660
  },
  {
    "id": "chiseled_copper",
    "name": "Chiseled Copper",
    "src": "/textures/chiseled_copper.png?v=65",
    "sort_order": 1670
  },
  {
    "id": "chiseled_red_sandstone",
    "name": "Chiseled Red Sandstone",
    "src": "/textures/chiseled_red_sandstone.png?v=65",
    "sort_order": 1680
  },
  {
    "id": "chiseled_resin_bricks",
    "name": "Chiseled Resin Bricks",
    "src": "/textures/chiseled_resin_bricks.png?v=65",
    "sort_order": 1690
  },
  {
    "id": "chiseled_sandstone",
    "name": "Chiseled Sandstone",
    "src": "/textures/chiseled_sandstone.png?v=65",
    "sort_order": 1700
  },
  {
    "id": "chiseled_sulfur",
    "name": "Chiseled Sulfur",
    "src": "/textures/chiseled_sulfur.png?v=65",
    "sort_order": 1710
  },
  {
    "id": "coal_block",
    "name": "Coal Block",
    "src": "/textures/coal_block.png?v=65",
    "sort_order": 1720
  },
  {
    "id": "cobblestone",
    "name": "Cobblestone",
    "src": "/textures/cobblestone.png?v=65",
    "sort_order": 1730
  },
  {
    "id": "copper_block",
    "name": "Copper Block",
    "src": "/textures/copper_block.png?v=65",
    "sort_order": 1740
  },
  {
    "id": "crimson_stem",
    "name": "Crimson Stem",
    "src": "/textures/crimson_stem.png?v=65",
    "sort_order": 1750,
    "preview_src": "/textures/crimson_stem_preview.png?v=65"
  },
  {
    "id": "crimson_stem_top",
    "name": "Crimson Stem Top",
    "src": "/textures/crimson_stem_top.png?v=65",
    "sort_order": 1760
  },
  {
    "id": "cut_red_sandstone",
    "name": "Cut Red Sandstone",
    "src": "/textures/cut_red_sandstone.png?v=65",
    "sort_order": 1770
  },
  {
    "id": "cut_sandstone",
    "name": "Cut Sandstone",
    "src": "/textures/cut_sandstone.png?v=65",
    "sort_order": 1780
  },
  {
    "id": "cyan_shulker_box",
    "name": "Cyan Shulker Box",
    "src": "/textures/cyan_shulker_box.png?v=65",
    "sort_order": 1790
  },
  {
    "id": "cyan_terracotta",
    "name": "Cyan Terracotta",
    "src": "/textures/cyan_terracotta.png?v=65",
    "sort_order": 1800
  },
  {
    "id": "diamond_block",
    "name": "Diamond Block",
    "src": "/textures/diamond_block.png?v=65",
    "sort_order": 1810
  },
  {
    "id": "diorite",
    "name": "Diorite",
    "src": "/textures/diorite.png?v=65",
    "sort_order": 1820
  },
  {
    "id": "frosted_ice_0",
    "name": "Frosted Ice 0",
    "src": "/textures/frosted_ice_0.png?v=65",
    "sort_order": 1830
  },
  {
    "id": "frosted_ice_1",
    "name": "Frosted Ice 1",
    "src": "/textures/frosted_ice_1.png?v=65",
    "sort_order": 1840
  },
  {
    "id": "frosted_ice_2",
    "name": "Frosted Ice 2",
    "src": "/textures/frosted_ice_2.png?v=65",
    "sort_order": 1850
  },
  {
    "id": "frosted_ice_3",
    "name": "Frosted Ice 3",
    "src": "/textures/frosted_ice_3.png?v=65",
    "sort_order": 1860
  },
  {
    "id": "gold_block",
    "name": "Gold Block",
    "src": "/textures/gold_block.png?v=65",
    "sort_order": 1870
  },
  {
    "id": "granite",
    "name": "Granite",
    "src": "/textures/granite.png?v=65",
    "sort_order": 1880
  },
  {
    "id": "gray_shulker_box",
    "name": "Gray Shulker Box",
    "src": "/textures/gray_shulker_box.png?v=65",
    "sort_order": 1890
  },
  {
    "id": "gray_terracotta",
    "name": "Gray Terracotta",
    "src": "/textures/gray_terracotta.png?v=65",
    "sort_order": 1900
  },
  {
    "id": "green_shulker_box",
    "name": "Green Shulker Box",
    "src": "/textures/green_shulker_box.png?v=65",
    "sort_order": 1910
  },
  {
    "id": "green_terracotta",
    "name": "Green Terracotta",
    "src": "/textures/green_terracotta.png?v=65",
    "sort_order": 1920
  },
  {
    "id": "ice",
    "name": "Ice",
    "src": "/textures/ice.png?v=65",
    "sort_order": 1930
  },
  {
    "id": "iron_block",
    "name": "Iron Block",
    "src": "/textures/iron_block.png?v=65",
    "sort_order": 1940
  },
  {
    "id": "jukebox_side",
    "name": "Jukebox Side",
    "src": "/textures/jukebox_side.png?v=65",
    "sort_order": 1950
  },
  {
    "id": "jukebox_top",
    "name": "Jukebox Top",
    "src": "/textures/jukebox_top.png?v=65",
    "sort_order": 1960
  },
  {
    "id": "lapis_block",
    "name": "Lapis Block",
    "src": "/textures/lapis_block.png?v=65",
    "sort_order": 1970
  },
  {
    "id": "light_blue_shulker_box",
    "name": "Light Blue Shulker Box",
    "src": "/textures/light_blue_shulker_box.png?v=65",
    "sort_order": 1980
  },
  {
    "id": "light_blue_terracotta",
    "name": "Light Blue Terracotta",
    "src": "/textures/light_blue_terracotta.png?v=65",
    "sort_order": 1990
  },
  {
    "id": "light_gray_shulker_box",
    "name": "Light Gray Shulker Box",
    "src": "/textures/light_gray_shulker_box.png?v=65",
    "sort_order": 2000
  },
  {
    "id": "light_gray_terracotta",
    "name": "Light Gray Terracotta",
    "src": "/textures/light_gray_terracotta.png?v=65",
    "sort_order": 2010
  },
  {
    "id": "lime_shulker_box",
    "name": "Lime Shulker Box",
    "src": "/textures/lime_shulker_box.png?v=65",
    "sort_order": 2020
  },
  {
    "id": "lime_terracotta",
    "name": "Lime Terracotta",
    "src": "/textures/lime_terracotta.png?v=65",
    "sort_order": 2030
  },
  {
    "id": "magenta_shulker_box",
    "name": "Magenta Shulker Box",
    "src": "/textures/magenta_shulker_box.png?v=65",
    "sort_order": 2040
  },
  {
    "id": "magenta_terracotta",
    "name": "Magenta Terracotta",
    "src": "/textures/magenta_terracotta.png?v=65",
    "sort_order": 2050
  },
  {
    "id": "mossy_cobblestone",
    "name": "Mossy Cobblestone",
    "src": "/textures/mossy_cobblestone.png?v=65",
    "sort_order": 2060
  },
  {
    "id": "netherite_block",
    "name": "Netherite Block",
    "src": "/textures/netherite_block.png?v=65",
    "sort_order": 2070
  },
  {
    "id": "orange_shulker_box",
    "name": "Orange Shulker Box",
    "src": "/textures/orange_shulker_box.png?v=65",
    "sort_order": 2080
  },
  {
    "id": "orange_terracotta",
    "name": "Orange Terracotta",
    "src": "/textures/orange_terracotta.png?v=65",
    "sort_order": 2090
  },
  {
    "id": "packed_ice",
    "name": "Packed Ice",
    "src": "/textures/packed_ice.png?v=65",
    "sort_order": 2100
  },
  {
    "id": "pink_shulker_box",
    "name": "Pink Shulker Box",
    "src": "/textures/pink_shulker_box.png?v=65",
    "sort_order": 2110
  },
  {
    "id": "pink_terracotta",
    "name": "Pink Terracotta",
    "src": "/textures/pink_terracotta.png?v=65",
    "sort_order": 2120
  },
  {
    "id": "podzol_side",
    "name": "Podzol Side",
    "src": "/textures/podzol_side.png?v=65",
    "sort_order": 2130
  },
  {
    "id": "podzol_top",
    "name": "Podzol Top",
    "src": "/textures/podzol_top.png?v=65",
    "sort_order": 2140
  },
  {
    "id": "polished_basalt_side",
    "name": "Polished Basalt Side",
    "src": "/textures/polished_basalt_side.png?v=65",
    "sort_order": 2150
  },
  {
    "id": "polished_basalt_top",
    "name": "Polished Basalt Top",
    "src": "/textures/polished_basalt_top.png?v=65",
    "sort_order": 2160
  },
  {
    "id": "polished_diorite",
    "name": "Polished Diorite",
    "src": "/textures/polished_diorite.png?v=65",
    "sort_order": 2170
  },
  {
    "id": "polished_granite",
    "name": "Polished Granite",
    "src": "/textures/polished_granite.png?v=65",
    "sort_order": 2180
  },
  {
    "id": "polished_sulfur",
    "name": "Polished Sulfur",
    "src": "/textures/polished_sulfur.png?v=65",
    "sort_order": 2190
  },
  {
    "id": "potent_sulfur",
    "name": "Potent Sulfur",
    "src": "/textures/potent_sulfur.png?v=65",
    "sort_order": 2200
  },
  {
    "id": "purple_shulker_box",
    "name": "Purple Shulker Box",
    "src": "/textures/purple_shulker_box.png?v=65",
    "sort_order": 2210
  },
  {
    "id": "purple_terracotta",
    "name": "Purple Terracotta",
    "src": "/textures/purple_terracotta.png?v=65",
    "sort_order": 2220
  },
  {
    "id": "redstone_block",
    "name": "Redstone Block",
    "src": "/textures/redstone_block.png?v=65",
    "sort_order": 2230
  },
  {
    "id": "red_sand",
    "name": "Red Sand",
    "src": "/textures/red_sand.png?v=65",
    "sort_order": 2240
  },
  {
    "id": "red_sandstone",
    "name": "Red Sandstone",
    "src": "/textures/red_sandstone.png?v=65",
    "sort_order": 2250
  },
  {
    "id": "red_sandstone_bottom",
    "name": "Red Sandstone Bottom",
    "src": "/textures/red_sandstone_bottom.png?v=65",
    "sort_order": 2260
  },
  {
    "id": "red_sandstone_top",
    "name": "Red Sandstone Top",
    "src": "/textures/red_sandstone_top.png?v=65",
    "sort_order": 2270
  },
  {
    "id": "red_shulker_box",
    "name": "Red Shulker Box",
    "src": "/textures/red_shulker_box.png?v=65",
    "sort_order": 2280
  },
  {
    "id": "red_terracotta",
    "name": "Red Terracotta",
    "src": "/textures/red_terracotta.png?v=65",
    "sort_order": 2290
  },
  {
    "id": "resin_block",
    "name": "Resin Block",
    "src": "/textures/resin_block.png?v=65",
    "sort_order": 2300
  },
  {
    "id": "resin_bricks",
    "name": "Resin Bricks",
    "src": "/textures/resin_bricks.png?v=65",
    "sort_order": 2310
  },
  {
    "id": "sand",
    "name": "Sand",
    "src": "/textures/sand.png?v=65",
    "sort_order": 2320
  },
  {
    "id": "sandstone",
    "name": "Sandstone",
    "src": "/textures/sandstone.png?v=65",
    "sort_order": 2330
  },
  {
    "id": "sandstone_bottom",
    "name": "Sandstone Bottom",
    "src": "/textures/sandstone_bottom.png?v=65",
    "sort_order": 2340
  },
  {
    "id": "sandstone_top",
    "name": "Sandstone Top",
    "src": "/textures/sandstone_top.png?v=65",
    "sort_order": 2350
  },
  {
    "id": "shulker_box",
    "name": "Shulker Box",
    "src": "/textures/shulker_box.png?v=65",
    "sort_order": 2360
  },
  {
    "id": "smooth_basalt",
    "name": "Smooth Basalt",
    "src": "/textures/smooth_basalt.png?v=65",
    "sort_order": 2370
  },
  {
    "id": "soul_sand",
    "name": "Soul Sand",
    "src": "/textures/soul_sand.png?v=65",
    "sort_order": 2380
  },
  {
    "id": "stripped_crimson_stem",
    "name": "Stripped Crimson Stem",
    "src": "/textures/stripped_crimson_stem.png?v=65",
    "sort_order": 2390
  },
  {
    "id": "stripped_crimson_stem_top",
    "name": "Stripped Crimson Stem Top",
    "src": "/textures/stripped_crimson_stem_top.png?v=65",
    "sort_order": 2400
  },
  {
    "id": "stripped_warped_stem",
    "name": "Stripped Warped Stem",
    "src": "/textures/stripped_warped_stem.png?v=65",
    "sort_order": 2410
  },
  {
    "id": "stripped_warped_stem_top",
    "name": "Stripped Warped Stem Top",
    "src": "/textures/stripped_warped_stem_top.png?v=65",
    "sort_order": 2420
  },
  {
    "id": "sulfur",
    "name": "Sulfur",
    "src": "/textures/sulfur.png?v=65",
    "sort_order": 2430
  },
  {
    "id": "sulfur_bricks",
    "name": "Sulfur Bricks",
    "src": "/textures/sulfur_bricks.png?v=65",
    "sort_order": 2440
  },
  {
    "id": "terracotta",
    "name": "Terracotta",
    "src": "/textures/terracotta.png?v=65",
    "sort_order": 2450
  },
  {
    "id": "tnt_bottom",
    "name": "TNT Bottom",
    "src": "/textures/tnt_bottom.png?v=65",
    "sort_order": 2460
  },
  {
    "id": "tnt_side",
    "name": "TNT Side",
    "src": "/textures/tnt_side.png?v=65",
    "sort_order": 2470
  },
  {
    "id": "tnt_top",
    "name": "TNT Top",
    "src": "/textures/tnt_top.png?v=65",
    "sort_order": 2480
  },
  {
    "id": "warped_stem",
    "name": "Warped Stem",
    "src": "/textures/warped_stem.png?v=65",
    "sort_order": 2490,
    "preview_src": "/textures/warped_stem_preview.png?v=65"
  },
  {
    "id": "warped_stem_top",
    "name": "Warped Stem Top",
    "src": "/textures/warped_stem_top.png?v=65",
    "sort_order": 2500
  },
  {
    "id": "white_shulker_box",
    "name": "White Shulker Box",
    "src": "/textures/white_shulker_box.png?v=65",
    "sort_order": 2510
  },
  {
    "id": "white_terracotta",
    "name": "White Terracotta",
    "src": "/textures/white_terracotta.png?v=65",
    "sort_order": 2520
  },
  {
    "id": "yellow_shulker_box",
    "name": "Yellow Shulker Box",
    "src": "/textures/yellow_shulker_box.png?v=65",
    "sort_order": 2530
  },
  {
    "id": "yellow_terracotta",
    "name": "Yellow Terracotta",
    "src": "/textures/yellow_terracotta.png?v=65",
    "sort_order": 2540
  }
];
const LEGACY_BLOCKS = {
  "grass": {
    "alias": "grass_top"
  },
  "dirt": {
    "alias": "dirt"
  },
  "stone": {
    "alias": "stone"
  },
  "sand": {
    "colors": [
      "#d8c06f",
      "#ecd889",
      "#c6ad5f",
      "#f0df9f"
    ]
  },
  "water": {
    "colors": [
      "#236ccf",
      "#2f86e8",
      "#1d5eb6",
      "#3b9cff"
    ]
  },
  "oak": {
    "colors": [
      "#9a6b35",
      "#b47d3e",
      "#7d5429",
      "#c98d47"
    ]
  },
  "leaves": {
    "colors": [
      "#2f7d32",
      "#3d9c40",
      "#26682a",
      "#4caf50"
    ]
  },
  "glass": {
    "colors": [
      "#bdeaff",
      "#d7f4ff",
      "#91d7f2",
      "#ffffff"
    ]
  },
  "brick": {
    "colors": [
      "#8d3c32",
      "#a64a3e",
      "#6f2f28",
      "#bd5a4d"
    ]
  },
  "gold": {
    "colors": [
      "#e0a923",
      "#ffd24d",
      "#bd8618",
      "#ffdf70"
    ]
  },
  "diamond": {
    "colors": [
      "#39d6d1",
      "#75fff7",
      "#25aaa6",
      "#b7fffb"
    ]
  },
  "obsidian": {
    "alias": "obsidian"
  },
  "lava": {
    "colors": [
      "#ff5b1a",
      "#ffb000",
      "#d93000",
      "#fff066"
    ]
  },
  "snow": {
    "colors": [
      "#eaf6ff",
      "#ffffff",
      "#cde7f5",
      "#f7fbff"
    ]
  },
  "netherrack": {
    "alias": "netherrack"
  },
  "endstone": {
    "alias": "end_stone"
  }
};

const VERTICAL_PATTERN_BLOCKS = new Set([
  "warped_stem",
  "crimson_stem"
]);

const BLOCKS = new Map(BLOCK_DEFS.map(block => [block.id, block]));
const textureCache = new Map();
const fallbackTextureCache = new Map();
let texturesLoadPromise = null;
let placeSoundPool = [];
let placeSoundIndex = 0;
let soundUnlocked = false;

let dpr = Math.max(1, window.devicePixelRatio || 1);
let camera = { x: MAP_SIZE * TILE_SIZE / 2, y: MAP_SIZE * TILE_SIZE / 2, zoom: 1 };
let selectedBlock = DEFAULT_GRID_BLOCK;
let selectedRotation = 0;
let filteredBlockDefs = [...BLOCK_DEFS];
let isPanning = false;
let panStart = { x: 0, y: 0, camX: 0, camY: 0 };
let pointerDrag = null;
let spaceDown = false;
let currentUser = null;
let currentProfile = null;
let selectedAdminUser = null;
let realtimeChannel = null;
let onlineChannel = null;
const presenceSessionKey = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
let isPlacing = false;
let toastTimer = null;
let exportInProgress = false;
let selectedDownloadFormat = "png";
let rechargeSyncInProgress = false;
let inventoryHidden = localStorage.getItem('mineplace_inventory_hidden') === '1';
let adminPaintMode = false;

let playerState = normalizePlayerState({
  blocks: 0,
  block_capacity: 50,
  recharge_seconds: 20,
  next_splash_at: null
});



function internalToWorldCoord(value) {
  return Number(value) - MAP_RADIUS;
}

function worldToInternalCoord(value) {
  return Number(value) + MAP_RADIUS;
}

function isValidWorldCoord(value) {
  return Number.isInteger(value) && value >= -MAP_RADIUS && value <= MAP_RADIUS;
}

function normalizePlayerState(state) {
  const raw = state || {};

  return {
    blocks: Number(raw.blocks ?? raw.splashes ?? 0),
    block_capacity: Number(raw.block_capacity ?? raw.splash_capacity ?? 50),
    recharge_seconds: Number(raw.recharge_seconds ?? raw.splash_recharge_seconds ?? 20),
    next_splash_at: raw.next_splash_at ?? raw.next_block_at ?? null
  };
}


const placed = new Map();
const placedRotations = new Map();
const placementAnimations = new Map();


let drawQueued = false;
let lastWheelDrawAt = 0;
let cameraTeleportAnimation = null;
let hoverTile = null;

function scheduleDraw() {
  if (drawQueued) return;
  drawQueued = true;
  requestAnimationFrame(() => {
    drawQueued = false;
    draw();
  });
}



function addPlacementAnimation(tileX, tileY, blockId) {
  placementAnimations.set(key(tileX, tileY), {
    x: tileX,
    y: tileY,
    block_id: blockId,
    started_at: performance.now()
  });
  scheduleDraw();
}

function getPlacementAnimationScale(tileKey) {
  const anim = placementAnimations.get(tileKey);
  if (!anim) return 1;

  const duration = 220;
  const elapsed = performance.now() - anim.started_at;
  const t = Math.max(0, Math.min(1, elapsed / duration));

  if (t >= 1) {
    placementAnimations.delete(tileKey);
    return 1;
  }

  // Smooth pop: starts small, grows a bit over, then settles.
  const eased = 1 - Math.pow(1 - t, 3);
  const overshoot = Math.sin(t * Math.PI) * 0.08;
  scheduleDraw();

  return Math.min(1.08, 0.28 + eased * 0.72 + overshoot);
}


function initPlaceSound() {
  if (placeSoundPool.length) return;

  placeSoundPool = Array.from({ length: PLACE_SOUND_POOL_SIZE }, () => {
    const audio = new Audio(PLACE_SOUND_SRC);
    audio.preload = "auto";
    audio.volume = 0.55;
    return audio;
  });
}

function unlockPlaceSound() {
  if (soundUnlocked) return;

  initPlaceSound();
  soundUnlocked = true;

  const audio = placeSoundPool[0];
  if (!audio) return;

  audio.muted = true;
  audio.currentTime = 0;

  const playPromise = audio.play();

  if (playPromise?.then) {
    playPromise
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
      })
      .catch(() => {
        audio.muted = false;
      });
  } else {
    audio.muted = false;
  }
}

function playPlaceSound() {
  initPlaceSound();

  const audio = placeSoundPool[placeSoundIndex % placeSoundPool.length];
  placeSoundIndex++;

  if (!audio) return;

  try {
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;

    const playPromise = audio.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {});
    }
  } catch {
    // Ignore audio errors. Block placement should never fail because of sound.
  }
}


function showToast(message) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}


function safeImageUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(String(value), window.location.origin);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    return url.href;
  } catch {
    return "";
  }
}


function getAuthProfile(sessionUser) {
  const meta = sessionUser?.user_metadata || {};
  const email = String(sessionUser?.email || meta.email || "").trim();

  return {
    username:
      meta.full_name ||
      meta.name ||
      meta.preferred_username ||
      (email ? email.split("@")[0] : "") ||
      "Player",
    avatar_url:
      meta.avatar_url ||
      meta.picture ||
      null
  };
}

async function ensureProfile(sessionUser) {
  if (!supabaseClient || !sessionUser) return;

  const profile = getAuthProfile(sessionUser);

  const { data, error } = await supabaseClient.rpc("sync_my_profile", {
    p_username: profile.username,
    p_avatar_url: profile.avatar_url
  });

  if (error || !data?.success) {
    console.warn("sync_my_profile failed", error, data);
  }
}


async function loadCurrentProfile() {
  currentProfile = null;
  if (!supabaseClient || !currentUser) return null;

  const { data, error } = await supabaseClient.rpc("get_my_profile");

  if (!error && data?.success && data.profile) {
    currentProfile = data.profile;
  }

  return currentProfile;
}

function getCurrentUsername() {
  const profileName = currentProfile?.username;
  const authName = getAuthProfile(currentUser).username;
  return String(profileName || authName || "").toLowerCase();
}

function isAdmin() {
  return currentProfile?.role === "admin";
}

function openAdminPanel() {
  if (!isAdmin()) return;
  adminModalEl?.classList.remove("hidden");
  adminSearchUsers();
}

function closeAdminPanel() {
  adminModalEl?.classList.add("hidden");
}

function clampBlockValue(value) {
  return Math.max(0, Math.min(50, Number(value) || 0));
}


function formatBanStatus(user) {
  if (!user) return "Ban status: unknown";

  if (!user.is_banned) return "Ban status: not banned";

  if (!user.banned_until) {
    return `Ban status: banned forever${user.ban_reason ? ` · ${user.ban_reason}` : ""}`;
  }

  const until = new Date(user.banned_until);
  const now = Date.now();

  if (until.getTime() <= now) {
    return "Ban status: expired";
  }

  return `Ban status: banned until ${until.toLocaleString()}${user.ban_reason ? ` · ${user.ban_reason}` : ""}`;
}

function refreshAdminSelectedUser() {
  if (!selectedAdminUser) return;

  adminEditEl?.classList.remove("hidden");

  if (adminSelectedUserEl) {
    adminSelectedUserEl.textContent = `${selectedAdminUser.username} · ${selectedAdminUser.blocks}/${selectedAdminUser.block_capacity}`;
  }

  if (adminBlocksInputEl) {
    adminBlocksInputEl.value = String(clampBlockValue(selectedAdminUser.blocks));
  }

  if (adminBanStatusEl) {
    adminBanStatusEl.textContent = formatBanStatus(selectedAdminUser);
  }
}

async function adminBanUser(durationSeconds) {
  if (!isAdmin() || !selectedAdminUser || !supabaseClient) return;

  const { data, error } = await supabaseClient.rpc("admin_ban_user", {
    p_target_user_id: selectedAdminUser.id,
    p_duration_seconds: durationSeconds,
    p_reason: adminBanReasonInputEl?.value || ""
  });

  if (error || !data?.success) {
    showToast("Ban failed");
    return;
  }

  selectedAdminUser = { ...selectedAdminUser, ...data.user };
  refreshAdminSelectedUser();
  showToast("User banned");
  adminSearchUsers();
}

async function adminUnbanUser() {
  if (!isAdmin() || !selectedAdminUser || !supabaseClient) return;

  const { data, error } = await supabaseClient.rpc("admin_unban_user", {
    p_target_user_id: selectedAdminUser.id
  });

  if (error || !data?.success) {
    showToast("Unban failed");
    return;
  }

  selectedAdminUser = { ...selectedAdminUser, ...data.user };
  refreshAdminSelectedUser();
  showToast("User unbanned");
  adminSearchUsers();
}


async function adminSearchUsers() {
  if (!isAdmin() || !supabaseClient || !adminUsersEl) return;

  const { data, error } = await supabaseClient.rpc("admin_search_users", {
    p_query: adminSearchInputEl?.value || ""
  });

  if (error || !data?.success) {
    adminUsersEl.innerHTML = '<div class="admin-note">Search failed.</div>';
    return;
  }

  const users = data.users || [];
  if (!users.length) {
    adminUsersEl.innerHTML = '<div class="admin-note">No users found.</div>';
    return;
  }

  adminUsersEl.innerHTML = "";

  for (const user of users) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "admin-user";
    item.innerHTML = `
      <div class="admin-user-main">
        <div class="admin-user-name">${escapeHtml(user.username)}</div>
        <div class="admin-user-meta">${escapeHtml(user.role)} · ${user.blocks}/${user.block_capacity} blocks · ${user.is_banned ? "banned" : "not banned"}</div>
      </div>
      <span>Choose</span>
    `;

    item.onclick = () => {
      selectedAdminUser = user;
      refreshAdminSelectedUser();
    };

    adminUsersEl.appendChild(item);
  }
}

async function adminSetBlocks(value) {
  if (!isAdmin() || !selectedAdminUser || !supabaseClient) return;
  const clamped = clampBlockValue(value);

  const { data, error } = await supabaseClient.rpc("admin_set_blocks", {
    p_target_user_id: selectedAdminUser.id,
    p_blocks: clamped
  });

  if (error || !data?.success) {
    showToast("Admin action failed");
    return;
  }

  selectedAdminUser = { ...selectedAdminUser, ...data.user };
  refreshAdminSelectedUser();
  showToast("Blocks updated");
  adminSearchUsers();

  if (currentUser?.id === data.user.id) {
    await loadPlayerState();
  }
}

adminSearchBtnEl?.addEventListener("click", adminSearchUsers);
adminSearchInputEl?.addEventListener("keydown", e => {
  if (e.key === "Enter") adminSearchUsers();
});
adminCloseBtnEl?.addEventListener("click", closeAdminPanel);
adminModalEl?.addEventListener("click", e => {
  if (e.target === adminModalEl) closeAdminPanel();
});
adminSetBtnEl?.addEventListener("click", () => adminSetBlocks(adminBlocksInputEl?.value));
adminPlusBtnEl?.addEventListener("click", () => adminSetBlocks(clampBlockValue(adminBlocksInputEl?.value) + 5));
adminMinusBtnEl?.addEventListener("click", () => adminSetBlocks(clampBlockValue(adminBlocksInputEl?.value) - 5));
adminBan1hBtnEl?.addEventListener("click", () => adminBanUser(60 * 60));
adminBan1dBtnEl?.addEventListener("click", () => adminBanUser(60 * 60 * 24));
adminBan7dBtnEl?.addEventListener("click", () => adminBanUser(60 * 60 * 24 * 7));
adminBanForeverBtnEl?.addEventListener("click", () => adminBanUser(null));
adminUnbanBtnEl?.addEventListener("click", adminUnbanUser);




function refreshAdminPaintToolButton() {
  if (!adminPaintToolBtnEl) return;

  adminPaintToolBtnEl.textContent = adminPaintMode
    ? "Admin Paint Tool: ON"
    : "Take Admin Paint Tool";

  adminPaintToolBtnEl.classList.toggle("active", adminPaintMode);
}

function setAdminPaintMode(enabled) {
  adminPaintMode = !!enabled && isAdmin();
  refreshAdminPaintToolButton();

  if (adminPaintMode) {
    showToast("Admin Paint Tool enabled");
    closeAdminPanel();
  }
}

adminPaintToolBtnEl?.addEventListener("click", () => {
  setAdminPaintMode(!adminPaintMode);
});

function isCurrentUserBanned() {
  if (!currentProfile?.is_banned) return false;
  if (!currentProfile.banned_until) return true;
  return new Date(currentProfile.banned_until).getTime() > Date.now();
}

function renderOnlinePlayers(players) {
  if (!onlineBubbleEl || !onlineCountEl || !onlineListEl) return;

  if (!currentUser || isCurrentUserBanned()) {
    onlineBubbleEl.classList.add("hidden");
    onlineCountEl.textContent = "0 online";
    onlineListEl.replaceChildren();
    return;
  }

  const unique = new Map();

  for (const player of players) {
    if (!player?.presence_id || player.is_banned) continue;
    if (!unique.has(player.presence_id)) unique.set(player.presence_id, player);
  }

  const list = [...unique.values()]
    .filter(player => player.username)
    .sort((a, b) => String(a.username).localeCompare(String(b.username)));

  onlineBubbleEl.classList.remove("hidden");
  onlineCountEl.textContent = `${list.length} online`;
  onlineListEl.replaceChildren();

  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "admin-note";
    empty.textContent = "Nobody online.";
    onlineListEl.appendChild(empty);
    return;
  }

  for (const player of list) {
    const item = document.createElement("div");
    item.className = "online-player";

    const avatarUrl = safeImageUrl(player.avatar_url);
    if (avatarUrl) {
      const img = document.createElement("img");
      img.src = avatarUrl;
      img.alt = "";
      img.referrerPolicy = "no-referrer";
      item.appendChild(img);
    } else {
      const fallback = document.createElement("div");
      fallback.className = "online-avatar-fallback";
      fallback.textContent = String(player.username || "?").slice(0, 1).toUpperCase();
      item.appendChild(fallback);
    }

    const name = document.createElement("span");
    name.textContent = String(player.username || "Unknown");
    item.appendChild(name);

    onlineListEl.appendChild(item);
  }
}
function updateOnlineFromPresence() {
  if (!onlineChannel) {
    renderOnlinePlayers([]);
    return;
  }

  const state = onlineChannel.presenceState();
  const players = Object.values(state).flat();
  renderOnlinePlayers(players);
}

function stopOnlinePresence() {
  if (onlineChannel && supabaseClient) {
    supabaseClient.removeChannel(onlineChannel);
  }

  onlineChannel = null;
  renderOnlinePlayers([]);
}

function startOnlinePresence() {
  if (!supabaseClient || !currentUser || isCurrentUserBanned()) {
    stopOnlinePresence();
    return;
  }

  stopOnlinePresence();

  const profile = getAuthProfile(currentUser);

  onlineChannel = supabaseClient.channel("mineplace-online", {
    config: {
      presence: {
        key: presenceSessionKey
      }
    }
  });

  onlineChannel
    .on("presence", { event: "sync" }, updateOnlineFromPresence)
    .on("presence", { event: "join" }, updateOnlineFromPresence)
    .on("presence", { event: "leave" }, updateOnlineFromPresence)
    .subscribe(async status => {
      if (status !== "SUBSCRIBED") return;

      await onlineChannel.track({
        presence_id: presenceSessionKey,
        username: profile.username,
        avatar_url: profile.avatar_url,
        is_banned: !!currentProfile?.is_banned,
        online_at: new Date().toISOString()
      });

      updateOnlineFromPresence();
    });
}


function renderAuth() {
  if (!authBox) return;
  if (!supabaseClient) {
    authBox.innerHTML = '<span class="auth-user"><span>DB offline</span></span>';
    return;
  }
  if (!currentUser) {
    authBox.innerHTML = '<button id="loginBtn">Login with Google</button>';
    document.getElementById('loginBtn')?.addEventListener('click', loginWithGoogle);
    return;
  }

  const profile = getAuthProfile(currentUser);
  const avatar = profile.avatar_url ? `<img src="${profile.avatar_url}" alt="">` : '';

  const adminButton = isAdmin() ? '<button id="adminBtn" class="small-btn">Admin</button>' : '';

  authBox.innerHTML = `
    <div class="auth-user">
      ${avatar}
      <span>${escapeHtml(profile.username)}</span>
    </div>
    ${adminButton}
    <button id="logoutBtn">Logout</button>
  `;
  document.getElementById('adminBtn')?.addEventListener('click', openAdminPanel);
  document.getElementById('logoutBtn')?.addEventListener('click', logout);
}

async function loginWithGoogle() {
  if (!supabaseClient) return;

  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
      scopes: "openid email profile",
      queryParams: {
        prompt: "select_account"
      }
    }
  });

  if (error) showToast("Google login failed");
}

async function logout() {
  if (!supabaseClient) return;

  try {
    await supabaseClient.auth.signOut();
  } catch {
    try {
      await supabaseClient.auth.signOut({ scope: "local" });
    } catch {}
  }

  currentUser = null;
  currentProfile = null;
  adminPaintMode = false;
  refreshAdminPaintToolButton();
  stopOnlinePresence();
  closeReportModal();
  closeInspectModal();
  renderAuth();
  playerState = normalizePlayerState({
    blocks: 0,
    block_capacity: 50,
    recharge_seconds: 20,
    next_splash_at: null
  });
  renderBlocks();
}


function isGoogleAuthUser(user) {
  if (!user) return false;

  const primaryProvider = String(user.app_metadata?.provider || "").toLowerCase();
  if (primaryProvider === "google") return true;

  const providers = Array.isArray(user.app_metadata?.providers)
    ? user.app_metadata.providers.map(value => String(value).toLowerCase())
    : [];

  if (providers.includes("google")) return true;

  const identities = Array.isArray(user.identities) ? user.identities : [];
  return identities.some(identity => String(identity?.provider || "").toLowerCase() === "google");
}

async function clearLegacyAuthSession() {
  if (!supabaseClient) return;

  try {
    await supabaseClient.auth.signOut({ scope: "local" });
  } catch {}

  currentUser = null;
  currentProfile = null;
  stopOnlinePresence();
}

async function initAuth() {
  if (!supabaseClient) {
    renderAuth();
    return;
  }

  const { data: sessionData } = await supabaseClient.auth.getSession();
  const localSession = sessionData?.session || null;

  if (localSession) {
    const { data: userData, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !userData?.user || !isGoogleAuthUser(userData.user)) {
      await clearLegacyAuthSession();
    } else {
      currentUser = userData.user;
      await ensureProfile(currentUser);
      await loadCurrentProfile();
    }
  } else {
    currentUser = null;
    currentProfile = null;
  }

  renderAuth();
  startOnlinePresence();

  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    const user = session?.user || null;

    if (user && !isGoogleAuthUser(user)) {
      await clearLegacyAuthSession();
      renderAuth();
      renderBlocks();
      return;
    }

    currentUser = user;

    if (currentUser) {
      await ensureProfile(currentUser);
      await loadCurrentProfile();
      await loadPlayerState();
      startOnlinePresence();
    } else {
      currentProfile = null;
      adminPaintMode = false;
      refreshAdminPaintToolButton();
      stopOnlinePresence();
    }

    renderAuth();
    renderBlocks();
  });
}


async function syncRechargeNow() {
  if (rechargeSyncInProgress || !supabaseClient || !currentUser) return;

  rechargeSyncInProgress = true;

  try {
    await loadPlayerState();
  } finally {
    rechargeSyncInProgress = false;
  }
}


async function loadPlayerState() {
  if (!supabaseClient || !currentUser) {
    renderBlocks();
    return;
  }
  const { data, error } = await supabaseClient.rpc('get_player_state');
  if (error || !data?.success) {
    console.warn("get_player_state failed", error, data);
    return;
  }
  playerState = normalizePlayerState(data.state);
  renderBlocks();
}

function getRechargeRemainingSeconds() {
  if (!playerState.next_splash_at) return 0;
  const readyAt = new Date(playerState.next_splash_at).getTime();
  return Math.max(0, Math.ceil((readyAt - Date.now()) / 1000));
}

function renderBlocks() {
  const current = Number(playerState.blocks ?? playerState.splashes ?? 0);
  const capacity = Number(playerState.block_capacity ?? playerState.splash_capacity ?? 50);
  const percent = capacity > 0 ? Math.max(0, Math.min(100, (current / capacity) * 100)) : 0;

  blocksLabel.textContent = `Blocks ${current}/${capacity}`;
  blocksFill.style.width = `${percent}%`;

  if (!currentUser) {
    rechargeLabel.textContent = "Login required";
    return;
  }

  if (current >= capacity) {
    rechargeLabel.textContent = "Full";
    return;
  }

  const left = getRechargeRemainingSeconds();

  if (left > 0) {
    rechargeLabel.textContent = `+1 in ${left}s`;
    return;
  }

  // Timer reached 0. Ask Supabase for the real state immediately.
  // This fixes the old "Recharging" stuck state while the player stays online.
  rechargeLabel.textContent = rechargeSyncInProgress ? "Recharging..." : "Syncing...";
  syncRechargeNow();
}
async function loadTextures() {
  if (!texturesLoadPromise) {
    texturesLoadPromise = Promise.all(BLOCK_DEFS.map(loadTexture));
  }

  await texturesLoadPromise;
}

function loadTexture(block) {
  if (textureCache.has(block.id)) {
    return Promise.resolve(textureCache.get(block.id));
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      textureCache.set(block.id, img);
      resolve(img);
    };
    img.onerror = () => resolve(null);
    img.src = block.preview_src || block.src;
  });
}

function rand(seed) {
  let t = seed + 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

function makeFallbackTexture(blockId, colors) {
  const c = document.createElement('canvas');
  c.width = TILE_SIZE;
  c.height = TILE_SIZE;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;

  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      const r = rand((x + 1) * 928371 + (y + 1) * 18213 + blockId.length * 77);
      const color = colors[Math.floor(r * colors.length)];
      g.fillStyle = color;
      g.fillRect(x, y, 1, 1);
    }
  }

  g.fillStyle = 'rgba(255,255,255,.08)';
  g.fillRect(0, 0, TILE_SIZE, 1);
  g.fillRect(0, 0, 1, TILE_SIZE);
  g.fillStyle = 'rgba(0,0,0,.12)';
  g.fillRect(0, TILE_SIZE - 1, TILE_SIZE, 1);
  g.fillRect(TILE_SIZE - 1, 0, 1, TILE_SIZE);
  return c;
}

function getLegacyFallbackTexture(blockId) {
  if (fallbackTextureCache.has(blockId)) return fallbackTextureCache.get(blockId);
  const def = LEGACY_BLOCKS[blockId];
  if (!def?.colors) return null;
  const tex = makeFallbackTexture(blockId, def.colors);
  fallbackTextureCache.set(blockId, tex);
  return tex;
}

function resolveTextureAsset(blockId) {
  if (textureCache.has(blockId)) return textureCache.get(blockId);

  const legacy = LEGACY_BLOCKS[blockId];
  if (legacy?.alias && textureCache.has(legacy.alias)) return textureCache.get(legacy.alias);
  if (legacy?.colors) return getLegacyFallbackTexture(blockId);

  if (textureCache.has(DEFAULT_GRID_BLOCK)) return textureCache.get(DEFAULT_GRID_BLOCK);
  return null;
}

function key(x, y) {
  return `${x},${y}`;
}

async function loadVisibleBlocks() {
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient.rpc('get_visible_blocks', {
    p_min_x: 0,
    p_min_y: 0,
    p_max_x: MAP_SIZE - 1,
    p_max_y: MAP_SIZE - 1
  });
  if (error) return;
  placed.clear();
  placedRotations.clear();
  const rows = Array.isArray(data) ? data : [];
  for (const row of rows) {
    if (Number.isInteger(row.x) && Number.isInteger(row.y) && row.block_id) {
      placed.set(key(row.x, row.y), row.block_id);
      placedRotations.set(key(row.x, row.y), normalizeRotation(row.rotation ?? 0));
    }
  }
}

function subscribeToRealtime() {
  if (!supabaseClient) return;
  if (realtimeChannel) supabaseClient.removeChannel(realtimeChannel);
  realtimeChannel = supabaseClient
    .channel('placed-blocks-map')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'placed_blocks' }, payload => {
      const row = payload.new;
      if (!row || !Number.isInteger(row.x) || !Number.isInteger(row.y) || !row.block_id) return;
      placed.set(key(row.x, row.y), row.block_id);
      placedRotations.set(key(row.x, row.y), normalizeRotation(row.rotation ?? 0));
      scheduleDraw();
    })
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
  return { x: camera.x + cx / camera.zoom, y: camera.y + cy / camera.zoom };
}

function screenToTile(sx, sy) {
  const world = screenToWorld(sx, sy);
  return { x: Math.floor(world.x / TILE_SIZE), y: Math.floor(world.y / TILE_SIZE) };
}

function clampCamera() {
  camera.zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, camera.zoom));
  const max = MAP_SIZE * TILE_SIZE;
  camera.x = Math.max(0, Math.min(max, camera.x));
  camera.y = Math.max(0, Math.min(max, camera.y));
  
}


function drawBlockTexture(
  ctx2d,
  texture,
  blockId,
  tileX,
  tileY,
  dx,
  dy,
  dw = TILE_SIZE,
  dh = TILE_SIZE,
  rotation = null
) {
  if (!texture) return;

  const appliedRotation = normalizeRotation(
    rotation === null || rotation === undefined
      ? placedRotations.get(key(tileX, tileY)) || 0
      : rotation
  );

  let sx = 0;
  let sy = 0;
  let sw = texture.naturalWidth || texture.width;
  let sh = texture.naturalHeight || texture.height;

  if (
    VERTICAL_PATTERN_BLOCKS.has(blockId) &&
    sw === 16 &&
    sh >= 80
  ) {
    const frameCount = Math.max(1, Math.floor(sh / 16));

    // Canvas Y grows downward, while a Minecraft-style column grows upward.
    // Reverse Y here so adjacent blocks form the correct continuous strip.
    const frame = ((-tileY % frameCount) + frameCount) % frameCount;

    sx = 0;
    sy = frame * 16;
    sw = 16;
    sh = 16;
  }

  ctx2d.save();

  if (appliedRotation !== 0) {
    ctx2d.translate(dx + dw / 2, dy + dh / 2);
    ctx2d.rotate(appliedRotation * Math.PI / 180);
    ctx2d.drawImage(texture, sx, sy, sw, sh, -dw / 2, -dh / 2, dw, dh);
  } else {
    ctx2d.drawImage(texture, sx, sy, sw, sh, dx, dy, dw, dh);
  }

  ctx2d.restore();
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

  const defaultTexture = resolveTextureAsset(DEFAULT_GRID_BLOCK);

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      const blockId = placed.get(key(x, y)) || DEFAULT_GRID_BLOCK;
      const tex = resolveTextureAsset(blockId) || defaultTexture;
      if (tex) {
        const tileKey = key(x, y);
        const scale = getPlacementAnimationScale(tileKey);
        if (scale !== 1) {
          const size = TILE_SIZE * scale;
          const offset = (TILE_SIZE - size) / 2;
          drawBlockTexture(ctx, tex, blockId, x, y, x * TILE_SIZE + offset, y * TILE_SIZE + offset, size, size);
        } else {
          drawBlockTexture(ctx, tex, blockId, x, y, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    }
  }

  if (camera.zoom >= 1.25) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0,0,0,.18)';
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

  ctx.strokeStyle = 'rgba(255,255,255,.28)';
  ctx.lineWidth = 2 / camera.zoom;
  ctx.strokeRect(0, 0, MAP_SIZE * TILE_SIZE, MAP_SIZE * TILE_SIZE);
}


function setHoverTileFromPointer(clientX, clientY) {
  const tile = screenToTile(clientX, clientY);

  if (tile.x < 0 || tile.y < 0 || tile.x >= MAP_SIZE || tile.y >= MAP_SIZE) {
    if (hoverTile) {
      hoverTile = null;
      scheduleDraw();
    }
    return;
  }

  if (!hoverTile || hoverTile.x !== tile.x || hoverTile.y !== tile.y) {
    hoverTile = { x: tile.x, y: tile.y };
    scheduleDraw();
  }
}

function drawSelectedBlockPreview() {
  if (
    inventoryHidden ||
    !hoverTile ||
    isPanning ||
    !selectedBlock ||
    camera.zoom < 0.16
  ) return;

  const { x, y } = hoverTile;
  if (x < 0 || y < 0 || x >= MAP_SIZE || y >= MAP_SIZE) return;

  const tex = resolveTextureAsset(selectedBlock);
  if (!tex) return;

  const occupied = placed.has(key(x, y));
  let alpha = 0.50;

  if (occupied) {
    alpha = 0.22 + ((Math.sin(performance.now() / 115) + 1) / 2) * 0.45;
    scheduleDraw();
  }

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.imageSmoothingEnabled = false;
  drawBlockTexture(
    ctx,
    tex,
    selectedBlock,
    x,
    y,
    x * TILE_SIZE,
    y * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE,
    selectedRotation
  );

  ctx.globalAlpha = occupied ? 0.92 : 0.72;
  ctx.strokeStyle = occupied
    ? "rgba(255,255,255,.88)"
    : "rgba(123,216,143,.96)";
  ctx.lineWidth = 1 / camera.zoom;
  ctx.strokeRect(
    x * TILE_SIZE + 0.5 / camera.zoom,
    y * TILE_SIZE + 0.5 / camera.zoom,
    TILE_SIZE - 1 / camera.zoom,
    TILE_SIZE - 1 / camera.zoom
  );
  ctx.restore();
}

function draw() {
  const viewW = canvas.width / dpr;
  const viewH = canvas.height / dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, viewW, viewH);
  ctx.imageSmoothingEnabled = false;

  const worldLeft = camera.x - viewW / 2 / camera.zoom;
  const worldTop = camera.y - viewH / 2 / camera.zoom;
  const worldRight = camera.x + viewW / 2 / camera.zoom;
  const worldBottom = camera.y + viewH / 2 / camera.zoom;

  const startX = Math.max(0, Math.floor(worldLeft / TILE_SIZE) - 1);
  const startY = Math.max(0, Math.floor(worldTop / TILE_SIZE) - 1);
  const endX = Math.min(MAP_SIZE - 1, Math.ceil(worldRight / TILE_SIZE) + 1);
  const endY = Math.min(MAP_SIZE - 1, Math.ceil(worldBottom / TILE_SIZE) + 1);

  ctx.save();
  ctx.translate(viewW / 2, viewH / 2);
  ctx.scale(camera.zoom, camera.zoom);
  ctx.translate(-camera.x, -camera.y);

  const mapPx = MAP_SIZE * TILE_SIZE;

  // HARD zoom-out optimization:
  // draw one grass rectangle + only changed blocks. No grid, no default tile loop.
  if (camera.zoom < TILE_TEXTURE_ZOOM) {
    ctx.fillStyle = "#5da944";
    ctx.fillRect(0, 0, mapPx, mapPx);

    // If extremely zoomed out, skip textures too. Draw tiny solid blocks only.
    const drawTextureBlocks = camera.zoom >= 0.22;

    for (const [tileKey, blockId] of placed) {
      const comma = tileKey.indexOf(",");
      const x = Number(tileKey.slice(0, comma));
      const y = Number(tileKey.slice(comma + 1));

      if (x < startX || x > endX || y < startY || y > endY) continue;

      // grass_top is the same as the base map. Do not draw it as a dark changed pixel.
      if (blockId === DEFAULT_GRID_BLOCK || blockId === "grass_top") {
        continue;
      }

      if (drawTextureBlocks) {
        const tex = resolveTextureAsset(blockId);
        if (tex) {
          drawBlockTexture(ctx, tex, blockId, x, y, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          continue;
        }
      }

      // Ultra-low zoom fallback for non-grass blocks only.
      ctx.globalAlpha = camera.zoom < 0.14 ? 0.72 : 1;
      ctx.fillStyle = "rgba(31, 59, 35, .72)";
      ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      ctx.globalAlpha = 1;
    }

    ctx.restore();
    zoomLabel.textContent = `Zoom ${camera.zoom.toFixed(2)}x`;
    return;
  }

  // Normal visible-only tile mode.
  const defaultTexture = resolveTextureAsset(DEFAULT_GRID_BLOCK);

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      const tileKey = key(x, y);
      const blockId = placed.get(tileKey) || DEFAULT_GRID_BLOCK;
      const tex = resolveTextureAsset(blockId) || defaultTexture;

      if (!tex) continue;

      const scale = getPlacementAnimationScale(tileKey);
      if (scale !== 1) {
        const size = TILE_SIZE * scale;
        const offset = (TILE_SIZE - size) / 2;
        drawBlockTexture(ctx, tex, blockId, x, y, x * TILE_SIZE + offset, y * TILE_SIZE + offset, size, size);
      } else {
        drawBlockTexture(ctx, tex, blockId, x, y, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  // Grid only at readable zoom. This is the expensive part, so keep it high.
  if (camera.zoom >= GRID_DETAIL_ZOOM) {
    ctx.beginPath();
    ctx.strokeStyle = "rgba(0,0,0,.18)";
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

  drawSelectedBlockPreview();

  ctx.restore();
  zoomLabel.textContent = `Zoom ${camera.zoom.toFixed(2)}x`;
}

async function placeAt(tileX, tileY) {
  if (inventoryHidden) return;
  if (tileX < 0 || tileY < 0 || tileX >= MAP_SIZE || tileY >= MAP_SIZE) return;

  const currentBlock = placed.get(key(tileX, tileY)) || DEFAULT_GRID_BLOCK;
  if (currentBlock === selectedBlock) {
    showToast("Already placed");
    return;
  }

  if (!currentUser) {
    showToast("Login required");
    return;
  }

  if (isPlacing) return;
  isPlacing = true;

  const { data, error } = await supabaseClient.rpc("place_block", {
    p_x: tileX,
    p_y: tileY,
    p_block_id: selectedBlock,
    p_rotation: selectedRotation
  });

  isPlacing = false;

  if (error) {
    showToast("Could not place block");
    return;
  }

  if (!data?.success) {
    const code = data?.error || "error";

    if (code === "no_blocks") {
      if (data.state) playerState = normalizePlayerState(data.state);
      renderBlocks();
      showToast("No blocks");
      return;
    }

    if (code === "user_banned") {
      showToast(data.banned_until ? `Banned until ${new Date(data.banned_until).toLocaleString()}` : "Account banned");
      return;
    }

    showToast(code.replaceAll("_", " "));
    return;
  }

  if (data.block?.block_id) {
    placed.set(key(data.block.x, data.block.y), data.block.block_id);
    placedRotations.set(key(data.block.x, data.block.y), normalizeRotation(data.block.rotation ?? selectedRotation));
    addPlacementAnimation(data.block.x, data.block.y);
  }

  if (!data.no_change) {
    playPlaceSound();
  }

  if (data.state) playerState = normalizePlayerState(data.state);
  renderBlocks();
  scheduleDraw();
}


function normalizeRotation(value) {
  const n = Number(value) || 0;
  return ((Math.round(n / 90) * 90) % 360 + 360) % 360;
}

function rotateSelectedBlockClockwise() {
  if (inventoryHidden) return;
  selectedRotation = normalizeRotation(selectedRotation + 90);
  showToast(`Rotation ${selectedRotation}°`);
  scheduleDraw();
}

function normalizeSearch(value) {
  return String(value || "").trim().toLowerCase().replaceAll(" ", "_");
}

function updateInventorySlider() {
  if (!inventorySliderEl || !paletteEl) return;

  const maxScroll = Math.max(0, paletteEl.scrollWidth - paletteEl.clientWidth);
  inventorySliderEl.max = String(Math.ceil(maxScroll));
  inventorySliderEl.value = String(Math.round(paletteEl.scrollLeft));
  inventorySliderEl.disabled = maxScroll <= 0;
  inventorySliderEl.style.opacity = maxScroll <= 0 ? ".35" : "1";
}

function filterBlocks() {
  const query = normalizeSearch(blockSearchEl?.value || "");

  filteredBlockDefs = !query
    ? [...BLOCK_DEFS]
    : BLOCK_DEFS.filter(block => {
        const id = block.id.toLowerCase();
        const name = block.name.toLowerCase().replaceAll(" ", "_");
        return id.includes(query) || name.includes(query);
      });

  if (!filteredBlockDefs.some(block => block.id === selectedBlock) && filteredBlockDefs.length > 0) {
    if (selectedBlock !== filteredBlockDefs[0].id) selectedRotation = 0;
    selectedBlock = filteredBlockDefs[0].id;
  }

  buildPalette();
}

function buildPalette() {
  paletteEl.innerHTML = "";

  if (blockCountEl) {
    blockCountEl.textContent = `${filteredBlockDefs.length} blocks`;
  }

  for (const block of filteredBlockDefs) {
    const item = document.createElement("button");
    item.className = "block" + (block.id === selectedBlock ? " selected" : "");
    item.title = block.name;
    item.type = "button";
    item.onclick = () => {
      if (selectedBlock !== block.id) selectedRotation = 0;
      selectedBlock = block.id;
      document.querySelectorAll(".block").forEach(el => el.classList.remove("selected"));
      item.classList.add("selected");
    };

    const img = document.createElement("img");
    img.src = block.preview_src || block.src;
    img.alt = block.name;
    img.width = 32;
    img.height = 32;
    img.loading = "eager";
    item.appendChild(img);
    paletteEl.appendChild(item);
  }

  requestAnimationFrame(() => {
    paletteEl.scrollLeft = 0;
    updateInventorySlider();
  });
}

blockSearchEl?.addEventListener("input", filterBlocks);



inventorySliderEl?.addEventListener("pointerdown", e => e.preventDefault());
inventorySliderEl?.addEventListener("keydown", e => e.preventDefault());

paletteEl?.addEventListener("wheel", e => {
  if (!paletteEl) return;
  e.preventDefault();
  paletteEl.scrollLeft += e.deltaY || e.deltaX;
  updateInventorySlider();
}, { passive: false });

paletteEl?.addEventListener("scroll", updateInventorySlider);
window.addEventListener("resize", updateInventorySlider);


function nextFrame() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

async function getAllMapBlocksForExport() {
  if (!supabaseClient) return [];

  const { data, error } = await supabaseClient.rpc("get_visible_blocks", {
    p_min_x: 0,
    p_min_y: 0,
    p_max_x: MAP_SIZE - 1,
    p_max_y: MAP_SIZE - 1
  });

  if (error) {
    showToast("Map export failed");
    return [];
  }

  return Array.isArray(data) ? data : [];
}


function getDownloadFormatInfo(format) {
  const normalized = String(format || "png").toLowerCase();

  if (normalized === "jpeg" || normalized === "jpg") {
    return { format: "jpeg", mime: "image/jpeg", extension: "jpg", quality: 0.92 };
  }

  if (normalized === "webp") {
    return { format: "webp", mime: "image/webp", extension: "webp", quality: 0.92 };
  }

  if (normalized === "bmp") {
    return { format: "bmp", mime: "image/bmp", extension: "bmp", quality: undefined };
  }

  if (normalized === "avif") {
    return { format: "avif", mime: "image/avif", extension: "avif", quality: 0.9 };
  }

  return { format: "png", mime: "image/png", extension: "png", quality: undefined };
}

async function createMapBlob(format = selectedDownloadFormat) {
  if (exportInProgress) return null;
  exportInProgress = true;

  if (viewMapBtnEl) viewMapBtnEl.disabled = true;
  if (downloadMapBtnEl) downloadMapBtnEl.disabled = true;

  try {
    showToast("Rendering map...");

    updateVisibleVersion();
  await loadTextures();

    const rows = await getAllMapBlocksForExport();
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = MAP_SIZE * TILE_SIZE;
    exportCanvas.height = MAP_SIZE * TILE_SIZE;

    const exportCtx = exportCanvas.getContext("2d", {
      alpha: false,
      willReadFrequently: false
    });

    exportCtx.imageSmoothingEnabled = false;

    const defaultTexture = resolveTextureAsset(DEFAULT_GRID_BLOCK);

    for (let y = 0; y < MAP_SIZE; y++) {
      for (let x = 0; x < MAP_SIZE; x++) {
        if (defaultTexture) {
          exportCtx.drawImage(defaultTexture, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }

      if (y % 25 === 0) {
        await nextFrame();
      }
    }

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      if (!Number.isInteger(row.x) || !Number.isInteger(row.y)) continue;
      if (row.x < 0 || row.y < 0 || row.x >= MAP_SIZE || row.y >= MAP_SIZE) continue;

      const texture = resolveTextureAsset(row.block_id);
      if (!texture) continue;

      drawBlockTexture(exportCtx, texture, row.block_id, row.x, row.y, row.x * TILE_SIZE, row.y * TILE_SIZE, TILE_SIZE, TILE_SIZE, row.rotation ?? 0);

      if (i % 2000 === 0) {
        await nextFrame();
      }
    }

    const info = getDownloadFormatInfo(format);
    const blob = await new Promise(resolve => exportCanvas.toBlob(resolve, info.mime, info.quality));

    if (!blob) return null;

    // Some browsers silently fall back to PNG for unsupported formats.
    // Never save a PNG payload with a .bmp/.avif/etc extension.
    return {
      blob,
      actualMime: blob.type || info.mime
    };
  } finally {
    exportInProgress = false;
    if (viewMapBtnEl) viewMapBtnEl.disabled = false;
    if (downloadMapBtnEl) downloadMapBtnEl.disabled = false;
  }
}

async function downloadMap() {
  const requested = getDownloadFormatInfo(selectedDownloadFormat);
  const result = await createMapBlob(requested.format);

  if (!result?.blob) {
    showToast("Map export failed");
    return;
  }

  let actual = requested;
  if (result.actualMime !== requested.mime) {
    actual = result.actualMime === "image/png"
      ? getDownloadFormatInfo("png")
      : result.actualMime === "image/jpeg"
        ? getDownloadFormatInfo("jpeg")
        : result.actualMime === "image/webp"
          ? getDownloadFormatInfo("webp")
          : requested;
  }

  const url = URL.createObjectURL(result.blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `mineplace-map.${actual.extension}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  if (actual.extension !== requested.extension) {
    showToast(`${requested.extension.toUpperCase()} unsupported here — downloaded ${actual.extension.toUpperCase()}`);
  }
}

async function viewMapPng() {
  const result = await createMapBlob("png");
  const blob = result?.blob || null;
  if (!blob) {
    showToast("Map export failed");
    return;
  }

  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);

  showToast("Opened PNG");
}


downloadFormatBtnEl?.addEventListener("click", e => {
  e.stopPropagation();

  const willOpen = downloadFormatMenuEl?.classList.contains("hidden");
  downloadFormatMenuEl?.classList.toggle("hidden");
  downloadFormatBtnEl?.classList.toggle("open", !!willOpen);
});

downloadFormatBtnEl?.addEventListener("keydown", e => {
  if (e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  downloadFormatBtnEl.click();
});

downloadFormatMenuEl?.addEventListener("click", e => {
  const button = e.target.closest("button[data-format]");
  if (!button) return;

  selectedDownloadFormat = button.dataset.format || "png";
  const info = getDownloadFormatInfo(selectedDownloadFormat);

  if (downloadMapLabelEl) {
    downloadMapLabelEl.textContent = `Download Map ${info.extension.toUpperCase()}`;
  }

  downloadFormatMenuEl.classList.add("hidden");
  downloadFormatBtnEl?.classList.remove("open");
});

document.addEventListener("click", e => {
  if (!downloadFormatMenuEl || !downloadFormatBtnEl) return;
  if (downloadFormatMenuEl.contains(e.target) || downloadFormatBtnEl.contains(e.target)) return;
  downloadFormatMenuEl.classList.add("hidden");
  downloadFormatBtnEl?.classList.remove("open");
});

viewMapBtnEl?.addEventListener("click", viewMapPng);
downloadMapBtnEl?.addEventListener("click", downloadMap);




function applyInventoryHiddenState() {
  document.body.classList.toggle("inventory-hidden", inventoryHidden);
  if (inventoryToggleBtnEl) {
    inventoryToggleBtnEl.setAttribute("aria-label", inventoryHidden ? "Show inventory" : "Hide inventory");
    inventoryToggleBtnEl.title = inventoryHidden ? "Show inventory" : "Hide inventory";
  }
}

function toggleInventoryHidden() {
  inventoryHidden = !inventoryHidden;
  localStorage.setItem("mineplace_inventory_hidden", inventoryHidden ? "1" : "0");
  applyInventoryHiddenState();
}

inventoryToggleBtnEl?.addEventListener("click", toggleInventoryHidden);



function openCoordsTeleportModal() {
  if (!coordsTeleportModalEl) return;

  const centerInternalX = Math.max(0, Math.min(MAP_SIZE - 1, Math.floor(camera.x / TILE_SIZE)));
  const centerInternalZ = Math.max(0, Math.min(MAP_SIZE - 1, Math.floor(camera.y / TILE_SIZE)));
  const centerTileX = internalToWorldCoord(centerInternalX);
  const centerTileZ = internalToWorldCoord(centerInternalZ);

  if (coordsTeleportXEl) coordsTeleportXEl.value = String(centerTileX);
  if (coordsTeleportZEl) coordsTeleportZEl.value = String(centerTileZ);

  coordsTeleportModalEl.classList.remove("hidden");
  setTimeout(() => coordsTeleportXEl?.focus(), 30);
}

function closeCoordsTeleportModal() {
  coordsTeleportModalEl?.classList.add("hidden");
}


function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function animateCameraTo(targetX, targetY, targetZoom = camera.zoom) {
  cameraTeleportAnimation = {
    fromX: camera.x,
    fromY: camera.y,
    fromZoom: camera.zoom,
    toX: targetX,
    toY: targetY,
    targetZoom,
    startedAt: performance.now(),
    duration: 720
  };

  requestAnimationFrame(stepCameraTeleport);
}

function stepCameraTeleport(now) {
  if (!cameraTeleportAnimation) return;

  const anim = cameraTeleportAnimation;
  const t = Math.max(0, Math.min(1, (now - anim.startedAt) / anim.duration));
  const eased = easeInOutCubic(t);

  camera.x = anim.fromX + (anim.toX - anim.fromX) * eased;
  camera.y = anim.fromY + (anim.toY - anim.fromY) * eased;
  camera.zoom = anim.fromZoom + (anim.targetZoom - anim.fromZoom) * eased;

  clampCamera();
  scheduleDraw();

  if (t < 1) {
    requestAnimationFrame(stepCameraTeleport);
  } else {
    camera.x = anim.toX;
    camera.y = anim.toY;
    camera.zoom = anim.targetZoom;
    clampCamera();
    cameraTeleportAnimation = null;
    scheduleDraw();
  }
}


function goToCoordinates() {
  const x = Math.trunc(Number(coordsTeleportXEl?.value));
  const z = Math.trunc(Number(coordsTeleportZEl?.value));

  if (!Number.isFinite(x) || !Number.isFinite(z)) {
    showToast("Enter X and Z");
    return;
  }

  if (!isValidWorldCoord(x) || !isValidWorldCoord(z)) {
    showToast(`Limit: -${MAP_RADIUS} to ${MAP_RADIUS}`);
    return;
  }

  const internalX = worldToInternalCoord(x);
  const internalZ = worldToInternalCoord(z);

  const targetX = internalX * TILE_SIZE + TILE_SIZE / 2;
  const targetZ = internalZ * TILE_SIZE + TILE_SIZE / 2;

  closeCoordsTeleportModal();
  animateCameraTo(targetX, targetZ, 2.5);
}

coordsTeleportBtnEl?.addEventListener("click", openCoordsTeleportModal);
coordsTeleportCloseBtnEl?.addEventListener("click", closeCoordsTeleportModal);
coordsTeleportGoBtnEl?.addEventListener("click", goToCoordinates);
coordsTeleportModalEl?.addEventListener("click", e => {
  if (e.target === coordsTeleportModalEl) closeCoordsTeleportModal();
});
coordsTeleportXEl?.addEventListener("keydown", e => {
  if (e.key === "Enter") goToCoordinates();
});
coordsTeleportZEl?.addEventListener("keydown", e => {
  if (e.key === "Enter") goToCoordinates();
});


function openHelpModal() {
  helpModalEl?.classList.remove("hidden");
}

function closeHelpModal() {
  helpModalEl?.classList.add("hidden");
}

function selectInventoryBlock(blockId) {
  if (!blockId || blockId === "__cursor__") return false;

  const block = BLOCK_DEFS.find(item => item.id === blockId);
  if (!block) {
    showToast("Block is not in inventory");
    return false;
  }

  if (selectedBlock !== blockId) selectedRotation = 0;
  selectedBlock = blockId;

  const currentQuery = normalizeSearch(blockSearchEl?.value || "");
  const visibleNow = filteredBlockDefs.some(item => item.id === blockId);

  if (blockSearchEl && currentQuery && !visibleNow) {
    blockSearchEl.value = "";
    filterBlocks();
  } else {
    buildPalette();
  }

  requestAnimationFrame(() => {
    const selectedEl = paletteEl?.querySelector(".block.selected");
    selectedEl?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  });

  showToast(`Selected ${block.name}`);
  return true;
}

function pickBlockAt(tileX, tileY) {
  if (inventoryHidden) return;
  if (tileX < 0 || tileY < 0 || tileX >= MAP_SIZE || tileY >= MAP_SIZE) return;

  const blockId = placed.get(key(tileX, tileY)) || DEFAULT_GRID_BLOCK;
  selectInventoryBlock(blockId);
}

helpBtnEl?.addEventListener("click", openHelpModal);
helpCloseBtnEl?.addEventListener("click", closeHelpModal);
helpModalEl?.addEventListener("click", e => {
  if (e.target === helpModalEl) closeHelpModal();
});


canvas.addEventListener('contextmenu', e => {
  e.preventDefault();
});

canvas.addEventListener('pointerdown', e => {
  unlockPlaceSound();

  const tile = screenToTile(e.clientX, e.clientY);

  pointerDrag = {
    pointerId: e.pointerId,
    button: e.button,
    startX: e.clientX,
    startY: e.clientY,
    startTileX: tile.x,
    startTileY: tile.y,
    camX: camera.x,
    camY: camera.y,
    moved: false
  };

  isPanning = true;
  panStart = {
    x: e.clientX,
    y: e.clientY,
    camX: camera.x,
    camY: camera.y
  };

  canvas.setPointerCapture(e.pointerId);
  e.preventDefault();
});

canvas.addEventListener('pointermove', e => {
  setHoverTileFromPointer(e.clientX, e.clientY);
  const tile = screenToTile(e.clientX, e.clientY);
  coordsEl.textContent = `X ${internalToWorldCoord(tile.x)} · Z ${internalToWorldCoord(tile.y)}`;

  if (!pointerDrag || pointerDrag.pointerId !== e.pointerId) return;

  const dx = e.clientX - pointerDrag.startX;
  const dy = e.clientY - pointerDrag.startY;
  const distance = Math.hypot(dx, dy);

  if (distance > 4) {
    pointerDrag.moved = true;
  }

  if (pointerDrag.moved) {
    camera.x = pointerDrag.camX - dx / camera.zoom;
    camera.y = pointerDrag.camY - dy / camera.zoom;
    clampCamera();
    scheduleDraw();
  }
});

canvas.addEventListener('pointerup', e => {
  if (!pointerDrag || pointerDrag.pointerId !== e.pointerId) {
    isPanning = false;
    return;
  }

  const wasClick = !pointerDrag.moved;
  const button = pointerDrag.button;
  const tileX = pointerDrag.startTileX;
  const tileY = pointerDrag.startTileY;

  pointerDrag = null;
  isPanning = false;

  try {
    canvas.releasePointerCapture(e.pointerId);
  } catch {}

  if (!wasClick) return;

  if (button === 0) {
    if (inventoryHidden) return;
    placeAt(tileX, tileY);
    return;
  }

  if (button === 1) {
    if (inventoryHidden) return;
    pickBlockAt(tileX, tileY);
    return;
  }

  if (button === 2) {
    inspectBlock(tileX, tileY);
  }
});

canvas.addEventListener('pointercancel', e => {
  pointerDrag = null;
  isPanning = false;

  try {
    canvas.releasePointerCapture(e.pointerId);
  } catch {}
});

canvas.addEventListener('pointerleave', () => {
  hoverTile = null;
  scheduleDraw();
});

canvas.addEventListener('wheel', e => {
  e.preventDefault();

  const before = screenToWorld(e.clientX, e.clientY);
  const factor = e.deltaY < 0 ? 1.14 : 0.86;

  camera.zoom *= factor;
  clampCamera();

  const after = screenToWorld(e.clientX, e.clientY);
  camera.x += before.x - after.x;
  camera.y += before.y - after.y;
  clampCamera();

  const now = performance.now();
  if (now - lastWheelDrawAt > 16) {
    lastWheelDrawAt = now;
    scheduleDraw();
  }
}, { passive: false });

window.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    spaceDown = true;
    
    e.preventDefault();
  }
});
window.addEventListener('keyup', e => {
  if (e.code === 'Space') {
    spaceDown = false;
    
  }
});

window.addEventListener("keydown", e => {
  if (e.code !== "KeyR" || e.repeat) return;

  const target = e.target;
  const tag = String(target?.tagName || "").toLowerCase();
  if (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    target?.isContentEditable
  ) return;

  e.preventDefault();
  rotateSelectedBlockClockwise();
});

window.addEventListener('resize', resize);



const MINEPLACE_VERSION = 66;
const REPORT_MAX_DETAILS_LENGTH = 300;

const REPORT_REASON_OPTIONS = [
  "Inappropriate Art",
  "Inappropriate Username",
  "Harassment",
  "Offensive Text",
  "Other"
];

const inspectModalEl = document.getElementById("inspectModal");
const inspectCloseBtnEl = document.getElementById("inspectCloseBtn");
const inspectCoordsEl = document.getElementById("inspectCoords");
const inspectAvatarEl = document.getElementById("inspectAvatar");
const inspectAvatarFallbackEl = document.getElementById("inspectAvatarFallback");
const inspectOwnerNameEl = document.getElementById("inspectOwnerName");
const inspectOwnerNoteEl = document.getElementById("inspectOwnerNote");
const inspectReportBtnEl = document.getElementById("inspectReportBtn");

const reportModalEl = document.getElementById("reportModal");
const reportCloseBtnEl = document.getElementById("reportCloseBtn");
const reportUsernameInputEl = document.getElementById("reportUsernameInput");
const reportReasonInputEl = document.getElementById("reportReasonInput");
const reportDetailsInputEl = document.getElementById("reportDetailsInput");
const reportSubmitBtnEl = document.getElementById("reportSubmitBtn");
const reportContextNoteEl = document.getElementById("reportContextNote");
const reportUsernamesEl = document.getElementById("reportUsernames");

const adminReportsEl = document.getElementById("adminReports");
const adminRefreshReportsBtnEl = document.getElementById("adminRefreshReportsBtn");


let inspectedBlockContext = null;
let reportContext = null;
let reportSearchTimer = null;

function renderAuth() {
  if (!authBox) return;
  if (!supabaseClient) {
    authBox.innerHTML = '<span class="auth-user"><span>DB offline</span></span>';
    return;
  }
  if (!currentUser) {
    authBox.innerHTML = '<button id="loginBtn">Login with Google</button>';
    document.getElementById('loginBtn')?.addEventListener('click', loginWithGoogle);
    return;
  }

  const profile = getAuthProfile(currentUser);
  const avatar = profile.avatar_url ? `<img src="${profile.avatar_url}" alt="">` : '';
  const adminButton = isAdmin() ? '<button id="adminBtn" class="small-btn">Admin</button>' : '';

  authBox.innerHTML = `
    <div class="auth-user">
      ${avatar}
      <span>${escapeHtml(profile.username)}</span>
    </div>
    ${adminButton}
    <button id="logoutBtn">Logout</button>
  `;
  document.getElementById('adminBtn')?.addEventListener('click', openAdminPanel);
  document.getElementById('logoutBtn')?.addEventListener('click', logout);
}

function buildPalette() {
  paletteEl.innerHTML = "";

  if (blockCountEl) {
    blockCountEl.textContent = `${filteredBlockDefs.length} blocks`;
  }

  for (const block of filteredBlockDefs) {
    const item = document.createElement("button");
    item.className = "block" + (block.id === selectedBlock ? " selected" : "");
    item.title = block.name;
    item.type = "button";
    item.onclick = () => {
      if (selectedBlock !== block.id) selectedRotation = 0;
      selectedBlock = block.id;
      document.querySelectorAll(".block").forEach(el => el.classList.remove("selected"));
      item.classList.add("selected");
    };

    const img = document.createElement("img");
    img.src = block.preview_src || block.src;
    img.alt = block.name;
    img.width = 32;
    img.height = 32;
    img.loading = "eager";
    item.appendChild(img);
    paletteEl.appendChild(item);
  }

  requestAnimationFrame(() => {
    paletteEl.scrollLeft = 0;
    updateInventorySlider();
  });
}

function formatBanStatus(user) {
  if (!user) return "Ban status: unknown";

  if (!user.is_banned) return "Ban status: not banned";

  if (!user.banned_until) {
    return `Ban status: banned forever${user.ban_reason ? ` · ${user.ban_reason}` : ""}`;
  }

  const until = new Date(user.banned_until);
  const now = Date.now();

  if (until.getTime() <= now) {
    return "Ban status: expired";
  }

  return `Ban status: until ${until.toLocaleString()}${user.ban_reason ? ` · ${user.ban_reason}` : ""}`;
}

function refreshAdminSelectedUser() {
  if (!selectedAdminUser) return;

  adminEditEl?.classList.remove("hidden");

  if (adminSelectedUserEl) {
    adminSelectedUserEl.textContent =
      `${selectedAdminUser.username} · blocks ${selectedAdminUser.blocks}/${selectedAdminUser.block_capacity}`;
  }

  if (adminBlocksInputEl) {
    adminBlocksInputEl.value = String(clampBlockValue(selectedAdminUser.blocks));
  }

  if (adminBanStatusEl) {
    adminBanStatusEl.textContent = formatBanStatus(selectedAdminUser);
  }
}

function closeInspectModal() {
  inspectModalEl?.classList.add("hidden");
}

function closeReportModal() {
  reportModalEl?.classList.add("hidden");
  reportContext = null;
}

function openInspectModal(data, x, y) {
  inspectedBlockContext = data || null;
  inspectModalEl?.classList.remove("hidden");

  if (inspectCoordsEl) {
    inspectCoordsEl.textContent = `X ${internalToWorldCoord(x)} · Z ${internalToWorldCoord(y)}`;
  }

  const username = data?.username || "Nobody yet";
  const note = data?.exists
    ? `Placed by ${username}`
    : "This tile is still the default map block.";

  if (inspectOwnerNameEl) inspectOwnerNameEl.textContent = username;
  if (inspectOwnerNoteEl) inspectOwnerNoteEl.textContent = note;

  const avatar = safeImageUrl(data?.avatar_url);
  if (inspectAvatarEl && inspectAvatarFallbackEl) {
    if (avatar) {
      inspectAvatarEl.src = avatar;
      inspectAvatarEl.classList.remove("hidden");
      inspectAvatarFallbackEl.classList.add("hidden");
    } else {
      inspectAvatarEl.classList.add("hidden");
      inspectAvatarFallbackEl.classList.remove("hidden");
      inspectAvatarFallbackEl.textContent = String(username || "?").slice(0, 1).toUpperCase();
    }
  }

  if (inspectReportBtnEl) {
    inspectReportBtnEl.disabled = !data?.exists;
  }
}

async function inspectBlock(tileX, tileY) {
  if (!supabaseClient) return;

  const { data, error } = await supabaseClient.rpc("get_block_owner", {
    p_x: tileX,
    p_y: tileY
  });

  if (error) {
    showToast("Could not inspect block");
    return;
  }

  openInspectModal(data, tileX, tileY);
}

async function searchReportUsernames() {
  if (reportUsernamesEl) reportUsernamesEl.innerHTML = "";
}

function queueSearchReportUsernames() {
  clearTimeout(reportSearchTimer);
  reportSearchTimer = setTimeout(() => {
    searchReportUsernames(reportUsernameInputEl?.value || "");
  }, 120);
}

function openReportModal(username = "", context = null) {
  if (!currentUser) {
    showToast("Login required");
    return;
  }

  reportModalEl?.classList.remove("hidden");
  reportContext = context;

  if (reportUsernameInputEl) {
    reportUsernameInputEl.value = username || "";
  }

  if (reportReasonInputEl && !REPORT_REASON_OPTIONS.includes(reportReasonInputEl.value)) {
    reportReasonInputEl.value = REPORT_REASON_OPTIONS[0];
  }

  if (reportDetailsInputEl && !context) {
    reportDetailsInputEl.value = "";
  }

  if (reportContextNoteEl) {
    reportContextNoteEl.textContent = context
      ? `Context: X ${internalToWorldCoord(context.x)} · Z ${internalToWorldCoord(context.y)}`
      : "Manual report";
  }

  searchReportUsernames(username || "");
}

async function submitReport() {
  if (!currentUser || !supabaseClient) {
    showToast("Login required");
    return;
  }

  const targetUsername = String(reportUsernameInputEl?.value || "").trim();
  const reason = String(reportReasonInputEl?.value || "").trim();
  let details = String(reportDetailsInputEl?.value || "").trim();

  if (details.length > REPORT_MAX_DETAILS_LENGTH) {
    details = details.slice(0, REPORT_MAX_DETAILS_LENGTH);
    if (reportDetailsInputEl) reportDetailsInputEl.value = details;
    showToast("Report max 300 chars");
    return;
  }

  if (!targetUsername) {
    showToast("Choose a username");
    return;
  }

  const { data, error } = await supabaseClient.rpc("submit_report", {
    p_target_username: targetUsername,
    p_reason: reason || "Other",
    p_details: details || null,
    p_x: reportContext?.x ?? null,
    p_y: reportContext?.y ?? null
  });

  if (error || !data?.success) {
    const errorText = data?.error === "rate_limited"
      ? "Wait 3 minutes before next report"
      : data?.error === "details_too_long"
        ? "Report max 300 chars"
        : data?.error
          ? String(data.error).replaceAll("_", " ")
          : "Report failed";
    showToast(errorText);
    return;
  }

  showToast("Report sent");
  closeReportModal();
  if (reportDetailsInputEl) reportDetailsInputEl.value = "";
}

async function adminSearchUsers() {
  if (!isAdmin() || !supabaseClient || !adminUsersEl) return;

  const { data, error } = await supabaseClient.rpc("admin_search_users", {
    p_query: adminSearchInputEl?.value || ""
  });

  if (error || !data?.success) {
    adminUsersEl.innerHTML = '<div class="admin-note">Search failed.</div>';
    return;
  }

  const users = data.users || [];
  if (!users.length) {
    adminUsersEl.innerHTML = '<div class="admin-note">No users found.</div>';
    return;
  }

  adminUsersEl.innerHTML = "";

  for (const user of users) {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "admin-user";
    row.innerHTML = `
      <div class="admin-user-main">
        <strong>${escapeHtml(user.username)}</strong>
        <span class="admin-note">${escapeHtml(formatBanStatus(user))}</span>
      </div>
      <div class="admin-user-actions">
        <span class="admin-note">${user.blocks}/${user.block_capacity}</span>
      </div>
    `;
    row.addEventListener("click", () => {
      selectedAdminUser = user;
      refreshAdminSelectedUser();
    });
    adminUsersEl.appendChild(row);
  }
}

async function adminSetBlocks(value) {
  if (!selectedAdminUser || !supabaseClient) {
    showToast("Select user");
    return;
  }

  const { data, error } = await supabaseClient.rpc("admin_set_blocks", {
    p_target_user_id: selectedAdminUser.id,
    p_blocks: clampBlockValue(value)
  });

  if (error || !data?.success) {
    showToast("Admin action failed");
    return;
  }

  selectedAdminUser = { ...selectedAdminUser, ...data.user };
  refreshAdminSelectedUser();
  showToast("Blocks updated");
  adminSearchUsers();

  if (currentUser?.id === data.user.id) {
    await loadPlayerState();
  }
}

async function adminBanTarget(targetUserId, durationSeconds, reason = null) {
  if (!supabaseClient || !targetUserId) {
    showToast("Select user");
    return null;
  }

  const { data, error } = await supabaseClient.rpc("admin_ban_user", {
    p_target_user_id: targetUserId,
    p_duration_seconds: durationSeconds,
    p_reason: reason
  });

  if (error || !data?.success) {
    showToast("Admin action failed");
    return null;
  }

  if (selectedAdminUser?.id === data.user.id) {
    selectedAdminUser = { ...selectedAdminUser, ...data.user };
    refreshAdminSelectedUser();
  }

  if (currentUser?.id === data.user.id) {
    await loadCurrentProfile();
    renderAuth();
  }

  await adminSearchUsers();
  await adminLoadReports();
  showToast("User banned");
  return data.user;
}

async function adminBanUser(durationSeconds) {
  if (!selectedAdminUser) {
    showToast("Select user");
    return;
  }

  await adminBanTarget(selectedAdminUser.id, durationSeconds, "Reported / admin action");
}

async function adminUnbanUser() {
  if (!selectedAdminUser || !supabaseClient) {
    showToast("Select user");
    return;
  }

  const { data, error } = await supabaseClient.rpc("admin_unban_user", {
    p_target_user_id: selectedAdminUser.id
  });

  if (error || !data?.success) {
    showToast("Admin action failed");
    return;
  }

  selectedAdminUser = { ...selectedAdminUser, ...data.user };
  refreshAdminSelectedUser();
  await adminSearchUsers();
  await adminLoadReports();
  showToast("User unbanned");
}

function renderAdminReports(reports) {
  if (!adminReportsEl) return;

  if (!reports.length) {
    adminReportsEl.innerHTML = '<div class="admin-note">No reports.</div>';
    return;
  }

  adminReportsEl.innerHTML = "";

  for (const report of reports) {
    const item = document.createElement("div");
    item.className = "admin-user report-item";
    item.innerHTML = `
      <div class="report-meta">
        <div class="report-reason">${escapeHtml(report.reason || "Report")}</div>
        <div class="report-sub">
          Target: <strong>${escapeHtml(report.target_username || "Unknown")}</strong>
          · Reporter: <strong>${escapeHtml(report.reporter_username || "Unknown")}</strong>
        </div>
        <div class="report-sub">
          ${report.x !== null && report.y !== null ? `X ${internalToWorldCoord(report.x)} · Z ${internalToWorldCoord(report.y)} · ` : ""}${new Date(report.created_at).toLocaleString()}
        </div>
        <div class="report-details">${escapeHtml(report.details || "No extra details.")}</div>
      </div>
      <div class="admin-user-actions wrap">
        <button class="small-btn primary" type="button" data-action="select">Select user</button>
        <button class="small-btn danger-btn" type="button" data-action="ban1d">Ban 1d</button>
        <button class="small-btn danger-btn" type="button" data-action="banforever">Ban forever</button>
        <button class="small-btn" type="button" data-action="resolve">Delete</button>
      </div>
    `;

    item.querySelector('[data-action="select"]')?.addEventListener("click", () => {
      selectedAdminUser = {
        id: report.target_user_id,
        username: report.target_username,
        blocks: report.blocks ?? 0,
        block_capacity: report.block_capacity ?? 50,
        is_banned: !!report.is_banned,
        banned_until: report.banned_until,
        ban_reason: report.ban_reason
      };
      refreshAdminSelectedUser();
      adminEditEl?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    item.querySelector('[data-action="ban1d"]')?.addEventListener("click", async () => {
      await adminBanTarget(report.target_user_id, 60 * 60 * 24, `Report: ${report.reason || "Reported"}`);
    });

    item.querySelector('[data-action="banforever"]')?.addEventListener("click", async () => {
      await adminBanTarget(report.target_user_id, null, `Report: ${report.reason || "Reported"}`);
    });

    item.querySelector('[data-action="resolve"]')?.addEventListener("click", async () => {
      if (!supabaseClient) return;
      const { data, error } = await supabaseClient.rpc("admin_delete_report", {
        p_report_id: report.id
      });
      if (error || !data?.success) {
        showToast("Could not resolve report");
        return;
      }
      showToast("Report deleted");
      adminLoadReports();
    });

    adminReportsEl.appendChild(item);
  }
}

async function adminLoadReports() {
  if (!isAdmin() || !supabaseClient || !adminReportsEl) return;

  const { data, error } = await supabaseClient.rpc("admin_get_reports");

  if (error || !data?.success) {
    adminReportsEl.innerHTML = '<div class="admin-note">Could not load reports.</div>';
    return;
  }

  renderAdminReports(data.reports || []);
}

function openAdminPanel() {
  if (!isAdmin()) return;
  adminModalEl?.classList.remove("hidden");
  adminSearchUsers();
  adminLoadReports();
}

function closeAdminPanel() {
  adminModalEl?.classList.add("hidden");
}

async function placeAt(tileX, tileY) {
  if (selectedBlock === CURSOR_TOOL_ID) {
    await inspectBlock(tileX, tileY);
    return;
  }

  if (tileX < 0 || tileY < 0 || tileX >= MAP_SIZE || tileY >= MAP_SIZE) return;

  const currentBlock = placed.get(key(tileX, tileY)) || DEFAULT_GRID_BLOCK;
  if (currentBlock === selectedBlock) {
    showToast("Already placed");
    return;
  }

  if (!currentUser) {
    showToast('Login required');
    return;
  }
  if (isPlacing) return;
  isPlacing = true;
  const { data, error } = await supabaseClient.rpc('place_block', {
    p_x: tileX,
    p_y: tileY,
    p_block_id: selectedBlock,
    p_rotation: selectedRotation
  });
  isPlacing = false;

  if (error) {
    showToast('Could not place block');
    return;
  }

  if (!data?.success) {
    const code = data?.error || 'error';
    if (code === 'no_blocks') {
      if (data.state) playerState = normalizePlayerState(data.state);
      renderBlocks();
      showToast('No blocks');
      return;
    }
    if (code === 'user_banned') {
      showToast(data.banned_until ? `Banned until ${new Date(data.banned_until).toLocaleString()}` : 'Account banned');
      return;
    }
    showToast(code.replaceAll('_', ' '));
    return;
  }

  if (data.block?.block_id) {
    placed.set(key(data.block.x, data.block.y), data.block.block_id);
  }

  if (!data.no_change) {
    playPlaceSound();
  }

  if (data.state) playerState = normalizePlayerState(data.state);
  renderBlocks();
  scheduleDraw();
}

inspectCloseBtnEl?.addEventListener("click", closeInspectModal);
inspectModalEl?.addEventListener("click", e => {
  if (e.target === inspectModalEl) closeInspectModal();
});
inspectReportBtnEl?.addEventListener("click", () => {
  if (!inspectedBlockContext?.exists) {
    showToast("No player to report");
    return;
  }

  openReportModal(inspectedBlockContext.username, {
    x: inspectedBlockContext.x,
    y: inspectedBlockContext.y
  });
});

reportCloseBtnEl?.addEventListener("click", closeReportModal);
reportModalEl?.addEventListener("click", e => {
  if (e.target === reportModalEl) closeReportModal();
});
reportSubmitBtnEl?.addEventListener("click", submitReport);
reportUsernameInputEl?.addEventListener("input", queueSearchReportUsernames);
adminRefreshReportsBtnEl?.addEventListener("click", adminLoadReports);



/* Version 31 critical stable overrides */

function renderAuth() {
  if (!authBox) return;
  authBox.replaceChildren();

  if (!supabaseClient) {
    const wrap = document.createElement("span");
    wrap.className = "auth-user";
    const text = document.createElement("span");
    text.textContent = "DB offline";
    wrap.appendChild(text);
    authBox.appendChild(wrap);
    return;
  }

  if (!currentUser) {
    const loginBtn = document.createElement("button");
    loginBtn.id = "loginBtn";
    loginBtn.textContent = "Login with Google";
    loginBtn.addEventListener("click", loginWithGoogle);
    authBox.appendChild(loginBtn);
    return;
  }

  const profile = getAuthProfile(currentUser);
  const userWrap = document.createElement("div");
  userWrap.className = "auth-user";

  const avatarUrl = safeImageUrl(profile.avatar_url);
  if (avatarUrl) {
    const img = document.createElement("img");
    img.src = avatarUrl;
    img.alt = "";
    img.referrerPolicy = "no-referrer";
    userWrap.appendChild(img);
  }

  const username = document.createElement("span");
  username.textContent = String(profile.username || "Player");
  userWrap.appendChild(username);
  authBox.appendChild(userWrap);

  
  if (!isAdmin() && adminPaintMode) {
    setAdminPaintMode(false);
  }

  if (isAdmin()) {
    const adminBtn = document.createElement("button");
    adminBtn.id = "adminBtn";
    adminBtn.className = "small-btn";
    adminBtn.textContent = "Admin";
    adminBtn.addEventListener("click", openAdminPanel);
    authBox.appendChild(adminBtn);
  }

  const logoutBtn = document.createElement("button");
  logoutBtn.id = "logoutBtn";
  logoutBtn.textContent = "Logout";
  logoutBtn.addEventListener("click", logout);
  authBox.appendChild(logoutBtn);
}
async function inspectBlock(tileX, tileY) {
  if (!supabaseClient) return;
  if (tileX < 0 || tileY < 0 || tileX >= MAP_SIZE || tileY >= MAP_SIZE) return;

  const blockId = placed.get(key(tileX, tileY));
  if (!blockId) {
    showToast("Nobody yet");
    return;
  }

  const { data, error } = await supabaseClient.rpc("get_block_owner", {
    p_x: tileX,
    p_y: tileY
  });

  if (error || !data?.exists || String(data?.username || "").toLowerCase() === "nobody yet") {
    showToast("Nobody yet");
    return;
  }

  openInspectModal(data, tileX, tileY);
}


async function syncRechargeNow() {
  if (rechargeSyncInProgress || !supabaseClient || !currentUser) return;

  rechargeSyncInProgress = true;

  try {
    await loadPlayerState();
  } finally {
    rechargeSyncInProgress = false;
  }
}


async function loadPlayerState() {
  if (!supabaseClient || !currentUser) {
    renderBlocks();
    return;
  }

  const { data, error } = await supabaseClient.rpc("get_player_state");

  if (error || !data?.success) {
    console.warn("get_player_state failed", error, data);
    return;
  }

  playerState = normalizePlayerState(data.state);
  renderBlocks();
}

async function placeAt(tileX, tileY) {
  if (inventoryHidden) return;
  if (tileX < 0 || tileY < 0 || tileX >= MAP_SIZE || tileY >= MAP_SIZE) return;

  const currentBlock = placed.get(key(tileX, tileY)) || DEFAULT_GRID_BLOCK;
  if (currentBlock === selectedBlock) {
    showToast("Already placed");
    return;
  }

  if (!currentUser) {
    showToast("Login required");
    return;
  }

  if (isPlacing) return;
  isPlacing = true;

  const rpcName = adminPaintMode && isAdmin()
    ? "admin_paint_block"
    : "place_block";

  const { data, error } = await supabaseClient.rpc(rpcName, {
    p_x: tileX,
    p_y: tileY,
    p_block_id: selectedBlock,
    p_rotation: selectedRotation
  });

  isPlacing = false;

  if (error) {
    console.error(`${rpcName} error`, error);
    showToast(error?.message || "Could not place block");
    return;
  }

  if (!data?.success) {
    const code = data?.error || "error";

    if (code === "no_blocks") {
      if (data.state) playerState = normalizePlayerState(data.state);
      renderBlocks();
      showToast("No blocks");
      return;
    }

    if (code === "user_banned") {
      showToast("Account banned");
      return;
    }

    if (code === "forbidden") {
      setAdminPaintMode(false);
      showToast("Admin only");
      return;
    }

    showToast(String(code).replaceAll("_", " "));
    return;
  }

  if (data.block?.block_id) {
    placed.set(key(data.block.x, data.block.y), data.block.block_id);
    placedRotations.set(key(data.block.x, data.block.y), normalizeRotation(data.block.rotation ?? selectedRotation));
    addPlacementAnimation?.(data.block.x, data.block.y, data.block.block_id);
  }

  if (!data.no_change) playPlaceSound();

  if (!adminPaintMode && data.state) {
    playerState = normalizePlayerState(data.state);
    renderBlocks();
  }

  scheduleDraw();
}

function updateVisibleVersion() {
  const versionEl = document.querySelector(".site-version");
  if (versionEl) versionEl.textContent = `Version ${MINEPLACE_VERSION}`;
}

(async function init() {
  applyInventoryHiddenState();
  await loadTextures();
  await initAuth();
  buildPalette();
  resize();
  await loadVisibleBlocks();
  await loadPlayerState();
  subscribeToRealtime();
  draw();
  setInterval(renderBlocks, 1000);
})();
