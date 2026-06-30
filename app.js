
const SUPABASE_URL = "https://ybfgmotbrlhmzlaxfyaq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_bjnUPSDIi8yQdnzvMxhCJg_mlVczei7";
const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const canvas = document.getElementById("world");
const ctx = canvas.getContext("2d", { alpha: false });

const paletteEl = document.getElementById("palette");
const blockSearchEl = document.getElementById("blockSearch");
const blockCountEl = document.getElementById("blockCount");
const inventorySliderEl = document.getElementById("inventorySlider");
const viewMapBtnEl = document.getElementById("viewMapBtn");
const downloadMapBtnEl = document.getElementById("downloadMapBtn");
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
const coordsEl = document.getElementById("coords");
const zoomLabel = document.getElementById("zoomLabel");
const authBox = document.getElementById("authBox");
const blocksLabel = document.getElementById("blocksLabel");
const rechargeLabel = document.getElementById("rechargeLabel");
const blocksFill = document.getElementById("blocksFill");

const MAP_SIZE = 500;
const TILE_SIZE = 16;
const DEFAULT_GRID_BLOCK = "grass_top";
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
    "src": "/textures/crimson_planks.png",
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
    "src": "/textures/pale_oak_log.png",
    "sort_order": 1200
  },
  {
    "id": "pale_oak_log_top",
    "name": "Pale Oak Log Top",
    "src": "/textures/pale_oak_log_top.png",
    "sort_order": 1210
  },
  {
    "id": "pale_oak_planks",
    "name": "Pale Oak Planks",
    "src": "/textures/pale_oak_planks.png",
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
    "src": "/textures/stripped_pale_oak_log.png",
    "sort_order": 1430
  },
  {
    "id": "stripped_pale_oak_log_top",
    "name": "Stripped Pale Oak Log Top",
    "src": "/textures/stripped_pale_oak_log_top.png",
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
    "src": "/textures/warped_planks.png",
    "sort_order": 1470
  },
  {
    "id": "water",
    "name": "Water",
    "src": "/textures/water.png",
    "sort_order": 1480
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

const BLOCKS = new Map(BLOCK_DEFS.map(block => [block.id, block]));
const textureCache = new Map();
const fallbackTextureCache = new Map();
let texturesLoadPromise = null;
let placeSoundPool = [];
let placeSoundIndex = 0;
let soundUnlocked = false;

let dpr = Math.max(1, window.devicePixelRatio || 1);
let camera = { x: MAP_SIZE * TILE_SIZE / 2, y: MAP_SIZE * TILE_SIZE / 2, zoom: 1 };
let selectedBlock = BLOCK_DEFS[0]?.id || DEFAULT_GRID_BLOCK;
let filteredBlockDefs = [...BLOCK_DEFS];
let isPanning = false;
let panStart = { x: 0, y: 0, camX: 0, camY: 0 };
let spaceDown = false;
let currentUser = null;
let currentProfile = null;
let selectedAdminUser = null;
let realtimeChannel = null;
let onlineChannel = null;
let isPlacing = false;
let toastTimer = null;
let exportInProgress = false;

let playerState = normalizePlayerState({
  blocks: 0,
  block_capacity: 50,
  recharge_seconds: 30,
  next_splash_at: null
});


function normalizePlayerState(state) {
  const raw = state || {};

  return {
    blocks: Number(raw.blocks ?? raw.splashes ?? 0),
    block_capacity: Number(raw.block_capacity ?? raw.splash_capacity ?? 50),
    recharge_seconds: Number(raw.recharge_seconds ?? raw.splash_recharge_seconds ?? 30),
    next_splash_at: raw.next_splash_at ?? raw.next_block_at ?? null
  };
}


const placed = new Map();


let drawQueued = false;

function scheduleDraw() {
  if (drawQueued) return;
  drawQueued = true;
  requestAnimationFrame(() => {
    drawQueued = false;
    draw();
  });
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

function getDiscordProfile(sessionUser) {
  const meta = sessionUser?.user_metadata || {};
  return {
    username:
      meta.full_name ||
      meta.name ||
      meta.user_name ||
      meta.preferred_username ||
      meta.provider_id ||
      'Player',
    avatar_url: meta.avatar_url || null
  };
}

async function ensureProfile(sessionUser) {
  if (!supabaseClient || !sessionUser) return;
  const profile = getDiscordProfile(sessionUser);
  await supabaseClient
    .from('profiles')
    .upsert({
      id: sessionUser.id,
      username: profile.username,
      avatar_url: profile.avatar_url
    }, { onConflict: 'id' });
}


async function loadCurrentProfile() {
  currentProfile = null;
  if (!supabaseClient || !currentUser) return null;

  const { data, error } = await supabaseClient
    .from("profiles")
    .select("id,username,role,is_banned,banned_until,ban_reason,discord_id,block_capacity")
    .eq("id", currentUser.id)
    .maybeSingle();

  if (!error && data) currentProfile = data;
  return currentProfile;
}

function getCurrentUsername() {
  const profileName = currentProfile?.username;
  const discordName = getDiscordProfile(currentUser).username;
  return String(profileName || discordName || "").toLowerCase();
}

function isAdmin() {
  const username = getCurrentUsername();
  return currentProfile?.role === "admin" || username === "themcp123";
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



function renderOnlinePlayers(players) {
  if (!onlineBubbleEl || !onlineCountEl || !onlineListEl) return;

  if (!currentUser) {
    onlineBubbleEl.classList.add("hidden");
    onlineCountEl.textContent = "0 online";
    onlineListEl.innerHTML = "";
    return;
  }

  const unique = new Map();

  for (const player of players) {
    if (!player?.user_id) continue;
    if (!unique.has(player.user_id)) {
      unique.set(player.user_id, player);
    }
  }

  const list = [...unique.values()]
    .filter(player => player.username)
    .sort((a, b) => String(a.username).localeCompare(String(b.username)));

  onlineBubbleEl.classList.remove("hidden");
  onlineCountEl.textContent = `${list.length} online`;

  if (!list.length) {
    onlineListEl.innerHTML = '<div class="admin-note">Nobody online.</div>';
    return;
  }

  onlineListEl.innerHTML = "";

  for (const player of list) {
    const item = document.createElement("div");
    item.className = "online-player";

    const avatar = player.avatar_url
      ? `<img src="${player.avatar_url}" alt="">`
      : `<div class="online-avatar-fallback">${escapeHtml(String(player.username || "?").slice(0, 1).toUpperCase())}</div>`;

    item.innerHTML = `
      ${avatar}
      <span>${escapeHtml(player.username)}</span>
    `;

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
  if (!supabaseClient || !currentUser) {
    stopOnlinePresence();
    return;
  }

  stopOnlinePresence();

  const profile = getDiscordProfile(currentUser);

  onlineChannel = supabaseClient.channel("mineplace-online", {
    config: {
      presence: {
        key: currentUser.id
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
        user_id: currentUser.id,
        username: profile.username,
        avatar_url: profile.avatar_url,
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
    authBox.innerHTML = '<button id="loginBtn">Login with Discord</button>';
    document.getElementById('loginBtn')?.addEventListener('click', loginWithDiscord);
    return;
  }

  const profile = getDiscordProfile(currentUser);
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

async function loginWithDiscord() {
  if (!supabaseClient) return;
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'discord',
    options: { redirectTo: window.location.origin }
  });
  if (error) showToast('Discord login failed');
}

async function logout() {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
  currentUser = null;
  currentProfile = null;
  stopOnlinePresence();
  renderAuth();
  playerState = normalizePlayerState({ blocks: 0, block_capacity: 50, recharge_seconds: 30, next_splash_at: null });
  renderBlocks();
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
    await loadCurrentProfile();
  }
  renderAuth();
  startOnlinePresence();

  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    currentUser = session?.user || null;
    if (currentUser) {
      await ensureProfile(currentUser);
      await loadCurrentProfile();
      await loadPlayerState();
    } else {
      currentProfile = null;
    }
    renderAuth();

    if (currentUser) {
      startOnlinePresence();
    } else {
      stopOnlinePresence();
    }

    renderBlocks();
  });
}

async function loadPlayerState() {
  if (!supabaseClient || !currentUser) {
    renderBlocks();
    return;
  }
  const { data, error } = await supabaseClient.rpc('get_player_state');
  if (error || !data?.success) return;
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
    rechargeLabel.textContent = 'Login required';
    return;
  }
  if (current >= capacity) {
    rechargeLabel.textContent = 'Full';
    return;
  }
  const left = getRechargeRemainingSeconds();
  rechargeLabel.textContent = left > 0 ? `+1 in ${left}s` : 'Recharging';
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
    img.src = block.src;
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
  const rows = Array.isArray(data) ? data : [];
  for (const row of rows) {
    if (Number.isInteger(row.x) && Number.isInteger(row.y) && row.block_id) {
      placed.set(key(row.x, row.y), row.block_id);
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

  const defaultTexture = resolveTextureAsset(DEFAULT_GRID_BLOCK);

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      const blockId = placed.get(key(x, y)) || DEFAULT_GRID_BLOCK;
      const tex = resolveTextureAsset(blockId) || defaultTexture;
      if (tex) ctx.drawImage(tex, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
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

function draw() {
  const rect = canvas.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;

  ctx.save();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = '#0b0d11';
  ctx.fillRect(0, 0, w, h);
  ctx.translate(w / 2, h / 2);
  ctx.scale(camera.zoom, camera.zoom);
  ctx.translate(-camera.x, -camera.y);
  ctx.imageSmoothingEnabled = false;
  drawGrid(w, h);
  ctx.restore();

  zoomLabel.textContent = `Zoom ${camera.zoom.toFixed(2)}x`;
  renderBlocks();
}

async function placeAt(tileX, tileY) {
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
    p_block_id: selectedBlock
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
      selectedBlock = block.id;
      document.querySelectorAll(".block").forEach(el => el.classList.remove("selected"));
      item.classList.add("selected");
    };

    const img = document.createElement("img");
    img.src = block.src;
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

inventorySliderEl?.addEventListener("input", () => {
  if (!paletteEl || !inventorySliderEl) return;
  paletteEl.scrollLeft = Number(inventorySliderEl.value || 0);
});

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

async function createMapPngBlob() {
  if (exportInProgress) return null;
  exportInProgress = true;

  if (viewMapBtnEl) viewMapBtnEl.disabled = true;
  if (downloadMapBtnEl) downloadMapBtnEl.disabled = true;

  try {
    showToast("Rendering map...");

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

      exportCtx.drawImage(texture, row.x * TILE_SIZE, row.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      if (i % 2000 === 0) {
        await nextFrame();
      }
    }

    return await new Promise(resolve => exportCanvas.toBlob(resolve, "image/png"));
  } finally {
    exportInProgress = false;
    if (viewMapBtnEl) viewMapBtnEl.disabled = false;
    if (downloadMapBtnEl) downloadMapBtnEl.disabled = false;
  }
}

async function downloadMapPng() {
  const blob = await createMapPngBlob();
  if (!blob) {
    showToast("Map export failed");
    return;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "mineplace-map.png";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  showToast("Downloaded PNG");
}

async function viewMapPng() {
  const blob = await createMapPngBlob();
  if (!blob) {
    showToast("Map export failed");
    return;
  }

  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);

  showToast("Opened PNG");
}

viewMapBtnEl?.addEventListener("click", viewMapPng);
downloadMapBtnEl?.addEventListener("click", downloadMapPng);


canvas.addEventListener('contextmenu', e => e.preventDefault());

canvas.addEventListener('pointerdown', e => {
  unlockPlaceSound();
  const shouldPan = e.button === 1 || e.button === 2 || spaceDown;
  if (shouldPan) {
    isPanning = true;
    panStart = { x: e.clientX, y: e.clientY, camX: camera.x, camY: camera.y };
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = 'grabbing';
    return;
  }
  if (e.button === 0) {
    const t = screenToTile(e.clientX, e.clientY);
    placeAt(t.x, t.y);
  }
});

canvas.addEventListener('pointermove', e => {
  const tile = screenToTile(e.clientX, e.clientY);
  coordsEl.textContent = `X ${tile.x} · Y ${tile.y}`;
  if (isPanning) {
    camera.x = panStart.camX - (e.clientX - panStart.x) / camera.zoom;
    camera.y = panStart.camY - (e.clientY - panStart.y) / camera.zoom;
    clampCamera();
    scheduleDraw();
  }
});

canvas.addEventListener('pointerup', () => {
  isPanning = false;
  canvas.style.cursor = 'crosshair';
});

canvas.addEventListener('wheel', e => {
  e.preventDefault();
  const before = screenToWorld(e.clientX, e.clientY);
  const factor = e.deltaY < 0 ? 1.12 : 0.88;
  camera.zoom *= factor;
  clampCamera();
  const after = screenToWorld(e.clientX, e.clientY);
  camera.x += before.x - after.x;
  camera.y += before.y - after.y;
  clampCamera();
  scheduleDraw();
}, { passive: false });

window.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    spaceDown = true;
    canvas.style.cursor = 'grab';
    e.preventDefault();
  }
});
window.addEventListener('keyup', e => {
  if (e.code === 'Space') {
    spaceDown = false;
    canvas.style.cursor = 'crosshair';
  }
});
window.addEventListener('resize', resize);

(async function init() {
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
