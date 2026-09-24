(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={world:{seed:20260924,spawnPoint:[0,0],clearRadius:7,bounds:{minX:-90,maxX:90,minZ:-480,maxZ:300},edgeTrees:{spacing:2.6,layers:3,layerGap:3.2},regionBlend:14,chunkSize:60,chunkViewDistance:130,activeRadius:75},camera:{fov:42,offset:[0,17,13],lookHeight:.8,followSharpness:6},spawner:{maxMonsters:12,interval:2.5,minDistance:13,maxDistance:32,despawnDistance:60,nightStatMultiplier:1.3},combat:{minDamage:1,variance:.15,projectileKnockback:1.5},loot:{pickupDelay:.45,lifetime:120,scatter:2.2,popMin:5,popMax:7,fullRetry:2,fullNoticeCooldown:4},time:{maxDelta:.05,dayLength:420,nightLength:180,transition:25,startClock:20,nightWarning:30},inventory:{slots:24,columns:6,defaultMaxStack:99},save:{key:`grassland-rpg-save`,autosaveInterval:30},base:{minBaseDistance:45,startingKit:`tent_kit`},startingItems:[{id:`tent_kit`,count:1}],build:{gridSnap:.5,structureGap:.3},raid:{baseCount:2,perBaseLevel:1,perRegionDifficulty:1,perDay:1,maxCount:30,spawnInterval:2.5,spawnOffset:9,statScalePerDay:.12,rewardBase:20,rewardPerMonster:6,failGoldLossRatio:.1,presenceMargin:20,remoteFightSeconds:25,remotePartialRatio:.5,remoteTurretDamage:.8,failStorageLossRatio:.3},map:{cellSize:6,revealRadius:22,revealInterval:.25},turret:{demolishRefund:.5,gravity:18},interact:{range:2.8},quickslots:5,touch:{joystickRadius:56,runThreshold:.9,autoAimRange:4.5,doubleTapMs:350,rollButton:!0},feedback:{hitstop:{hit:.045,crit:.08,bossKill:.25,scale:.05},shake:{crit:.15,playerHit:.25,cannon:.2,cannonFalloff:25,bossAoe:.5,duration:.25},particles:{max:300,hit:6,kill:14,levelup:24,muzzle:4,blast:18},deathSquash:.15,dustInterval:.12},gather:{seed:9137,damage:10,sparkleRange:3.5,visibleRange:110,autoAimRange:2.6},status:{poisonDps:4,slowDefault:.4,playerPoisonDps:4,playerIconHeight:2.1},elite:{chance:.05,hp:2.5,attack:1.5,xp:3,gold:3,dropBonus:3,scale:1.3},enemyShot:{life:2.6,hitRadius:.3,leafSpin:2.4,leafHeight:1}},t={hp:100,stamina:100,attack:12,defense:2,moveSpeed:5,runMultiplier:1.7,critChance:.1,critMultiplier:1.6,radius:.45,staminaRunCost:22,staminaRegen:18,staminaRegenDelay:.8,attackStaminaCost:6,attackCooldown:.42,attackDuration:.26,attackHitTime:.1,attackMoveMultiplier:.55,attackRange:2.1,attackArcDeg:120,knockback:5,invulnTime:.6,hpRegen:1,respawnDelay:2.5,deathGoldLossRatio:.2,pickupRadius:.9,magnetRadius:3.5,magnetSpeed:12,spinEvery:3,spinDamagePerRank:.25,rollDistance:4.5,rollDuration:.35,rollInvuln:.25,rollStamina:20,rollCooldown:.5},n={slime:{name:`초원 슬라임`,hp:34,attack:8,defense:0,radius:.55,moveSpeed:1.4,chaseSpeed:3.1,fleeSpeed:3.8,detectRange:8,loseRange:15,attackRange:1.3,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:0,lungeSpeed:4,color:`#57c95a`,xp:5,drops:[{item:`gold`,min:2,max:6,chance:1},{item:`slime_jelly`,min:1,max:2,chance:.7},{item:`twig_sword`,min:1,max:1,chance:.03},{item:`leaf_hat`,min:1,max:1,chance:.03},{item:`straw_shoes`,min:1,max:1,chance:.03}],shape:`slime`},night_slime:{name:`밤 슬라임`,hp:50,attack:9,defense:0,radius:.6,moveSpeed:2.2,chaseSpeed:2.8,fleeSpeed:3.8,detectRange:6,loseRange:10,attackRange:1.2,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:0,lungeSpeed:4,color:`#8a6cf0`,xp:8,drops:[{item:`gold`,min:1,max:3,chance:1},{item:`slime_jelly`,min:1,max:1,chance:.4},{item:`iron_sword`,min:1,max:1,chance:.04},{item:`leather_vest`,min:1,max:1,chance:.05},{item:`jelly_charm`,min:1,max:1,chance:.04},{item:`clover_ring`,min:1,max:1,chance:.02}],structureDamageMultiplier:1.5,shape:`slime`},mushroom:{name:`숲 버섯`,hp:46,attack:10,defense:1,radius:.55,moveSpeed:1.2,chaseSpeed:2.9,fleeSpeed:3.2,detectRange:7,loseRange:15,attackRange:1.3,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:0,lungeSpeed:4,color:`#e0574f`,xp:9,drops:[{item:`gold`,min:3,max:8,chance:1},{item:`mushroom_cap`,min:1,max:2,chance:.7},{item:`tent_kit`,min:1,max:1,chance:.05},{item:`leather_vest`,min:1,max:1,chance:.02},{item:`straw_shoes`,min:1,max:1,chance:.03}],shape:`mushroom`,stemColor:`#f4e6cf`},night_mushroom:{name:`밤 버섯`,hp:56,attack:11,defense:0,radius:.6,moveSpeed:2.2,chaseSpeed:2.8,fleeSpeed:3.8,detectRange:6,loseRange:10,attackRange:1.2,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:0,lungeSpeed:4,color:`#6c4bd6`,xp:12,drops:[{item:`gold`,min:2,max:4,chance:1},{item:`mushroom_cap`,min:1,max:1,chance:.4},{item:`iron_sword`,min:1,max:1,chance:.04},{item:`clover_ring`,min:1,max:1,chance:.03}],structureDamageMultiplier:1.5,shape:`mushroom`,stemColor:`#d9d0f0`},sand_slime:{name:`모래 슬라임`,hp:34,attack:8,defense:0,radius:.55,moveSpeed:1.4,chaseSpeed:3.1,fleeSpeed:3.8,detectRange:8,loseRange:15,attackRange:1.3,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:0,lungeSpeed:4,color:`#e8c872`,xp:12,drops:[{item:`gold`,min:4,max:9,chance:1},{item:`cactus_spine`,min:1,max:1,chance:.5},{item:`slime_jelly`,min:1,max:2,chance:.5}],shape:`slime`},cactus:{name:`선인장 몬스터`,hp:42,attack:9,defense:2,radius:.6,moveSpeed:1,chaseSpeed:2.6,fleeSpeed:3.2,detectRange:7,loseRange:15,attackRange:1.3,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:0,lungeSpeed:4,color:`#5fa85a`,xp:15,drops:[{item:`gold`,min:5,max:10,chance:1},{item:`cactus_spine`,min:1,max:2,chance:.7},{item:`tent_kit`,min:1,max:1,chance:.04},{item:`desert_cloak`,min:1,max:1,chance:.02}],shape:`cactus`,stemColor:`#f4e6cf`,flowerColor:`#ff8fb1`},night_cactus:{name:`밤 선인장`,hp:48,attack:10,defense:0,radius:.6,moveSpeed:2.2,chaseSpeed:2.8,fleeSpeed:3.8,detectRange:6,loseRange:10,attackRange:1.2,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:0,lungeSpeed:4,color:`#3f6b3c`,xp:16,drops:[{item:`gold`,min:2,max:5,chance:1},{item:`cactus_spine`,min:1,max:1,chance:.4}],structureDamageMultiplier:1.5,shape:`cactus`,flowerColor:`#c9a0ff`},snow_slime:{name:`눈 슬라임`,hp:36,attack:9,defense:2,radius:.55,moveSpeed:1.4,chaseSpeed:3.1,fleeSpeed:3.8,detectRange:8,loseRange:15,attackRange:1.3,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:0,lungeSpeed:4,color:`#dff3ff`,xp:16,drops:[{item:`gold`,min:5,max:11,chance:1},{item:`ice_shard`,min:1,max:1,chance:.5},{item:`slime_jelly`,min:1,max:2,chance:.5}],shape:`slime`},ice_golem:{name:`얼음 골렘`,hp:48,attack:10,defense:3,radius:.7,moveSpeed:.9,chaseSpeed:2.4,fleeSpeed:3.2,detectRange:7,loseRange:15,attackRange:1.3,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:0,lungeSpeed:4,color:`#9fd3ff`,xp:22,drops:[{item:`gold`,min:6,max:14,chance:1},{item:`ice_shard`,min:1,max:2,chance:.7},{item:`tent_kit`,min:1,max:1,chance:.04},{item:`ice_sword`,min:1,max:1,chance:.02}],shape:`golem`,stemColor:`#f4e6cf`},night_golem:{name:`밤 골렘`,hp:50,attack:10,defense:0,radius:.7,moveSpeed:2.2,chaseSpeed:2.8,fleeSpeed:3.8,detectRange:6,loseRange:10,attackRange:1.2,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:0,lungeSpeed:4,color:`#5a6fb0`,xp:22,drops:[{item:`gold`,min:2,max:6,chance:1},{item:`ice_shard`,min:1,max:1,chance:.4}],structureDamageMultiplier:1.5,shape:`golem`},cactus_king:{name:`선인장왕`,hp:900,attack:18,defense:4,radius:1.6,moveSpeed:1.6,chaseSpeed:2.3,fleeSpeed:3.2,detectRange:7,loseRange:15,attackRange:1.3,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:.95,lungeSpeed:4,color:`#4f9a4a`,xp:250,drops:[{item:`gold`,min:150,max:250,chance:1},{item:`cactus_crown`,min:1,max:1,chance:1},{item:`cactus_spine`,min:8,max:12,chance:1},{item:`desert_cloak`,min:1,max:1,chance:.5},{item:`tent_kit`,min:1,max:1,chance:1}],shape:`cactus`,stemColor:`#f4e6cf`,flowerColor:`#ff5f8f`},ice_giant:{name:`얼음 거인`,hp:1500,attack:24,defense:6,radius:1.8,moveSpeed:1.4,chaseSpeed:2,fleeSpeed:3.2,detectRange:7,loseRange:15,attackRange:1.3,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:.95,lungeSpeed:4,color:`#7fc0f0`,xp:400,drops:[{item:`gold`,min:250,max:400,chance:1},{item:`giant_heart`,min:1,max:1,chance:1},{item:`ice_shard`,min:10,max:15,chance:1},{item:`ice_sword`,min:1,max:1,chance:.5},{item:`tent_kit`,min:1,max:1,chance:1}],shape:`golem`,stemColor:`#f4e6cf`},bee:{name:`붕붕벌`,hp:18,attack:6,defense:0,radius:.4,moveSpeed:2.48,chaseSpeed:5.5,fleeSpeed:3.8,detectRange:9,loseRange:16,attackRange:1.2,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:0,lungeSpeed:4,color:`#ffd23f`,xp:6,drops:[{item:`gold`,min:2,max:5,chance:1},{item:`honey_jar`,min:1,max:1,chance:.05},{item:`bee_ring`,min:1,max:1,chance:.03}],shape:`bee`,behavior:`darter`,flier:!0,dartSpeed:7,retreatDistance:6,shotSpeed:0},horn_rabbit:{name:`뿔토끼`,hp:40,attack:11,defense:0,radius:.5,moveSpeed:1.48,chaseSpeed:3.3,fleeSpeed:3.8,detectRange:9,loseRange:15,attackRange:1.3,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:0,lungeSpeed:4,color:`#ffffff`,xp:8,drops:[{item:`gold`,min:3,max:6,chance:1},{item:`fiber`,min:1,max:2,chance:.6},{item:`rabbit_foot`,min:1,max:1,chance:.03}],shape:`rabbit`,behavior:`charger`,chargeWindup:.7,chargeSpeed:11,chargeDistance:8,chargeCooldown:2.5,stunTime:1.5},big_slime:{name:`큰 슬라임`,hp:70,attack:10,defense:0,radius:1,moveSpeed:1.08,chaseSpeed:2.4,fleeSpeed:3.8,detectRange:8,loseRange:15,attackRange:1.3,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:0,lungeSpeed:4,color:`#4fbf52`,xp:12,drops:[{item:`gold`,min:4,max:8,chance:1},{item:`slime_jelly`,min:2,max:4,chance:1}],shape:`slime`,splitInto:`slime`,splitCount:2},spore_puff:{name:`포자 버섯`,hp:36,attack:7,defense:0,radius:.55,moveSpeed:.9,chaseSpeed:2,fleeSpeed:3.8,detectRange:11,loseRange:16,attackRange:1.3,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:0,lungeSpeed:4,color:`#9a6cd6`,xp:10,drops:[{item:`gold`,min:4,max:8,chance:1},{item:`mushroom_cap`,min:1,max:1,chance:.6},{item:`spore_pendant`,min:1,max:1,chance:.03}],shape:`puff`,behavior:`ranged`,keepDistance:7,shotSpeed:7,shotCooldown:2.4,shotWindup:.6,shotEffect:{type:`poison`,duration:3},shotColor:`#b88ae0`,shotKind:`spore`},thorn_wolf:{name:`가시 늑대`,hp:38,attack:10,defense:0,radius:.55,moveSpeed:1.89,chaseSpeed:4.2,fleeSpeed:3.8,detectRange:10,loseRange:15,attackRange:1.3,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:0,lungeSpeed:4,color:`#5f8f55`,xp:10,drops:[{item:`gold`,min:4,max:8,chance:1},{item:`resin`,min:1,max:1,chance:.3},{item:`leather_boots`,min:1,max:1,chance:.02}],shape:`wolf`,packMin:2,packMax:3},stump:{name:`그루터기 괴물`,hp:90,attack:14,defense:4,radius:.7,moveSpeed:.81,chaseSpeed:1.8,fleeSpeed:3.8,detectRange:8,loseRange:15,attackRange:1.3,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:.7,lungeSpeed:4,color:`#8a6440`,xp:14,drops:[{item:`gold`,min:5,max:9,chance:1},{item:`wood`,min:3,max:5,chance:1},{item:`resin`,min:1,max:1,chance:.5}],shape:`stump`},scorpion:{name:`모래 전갈`,hp:44,attack:12,defense:0,radius:.6,moveSpeed:1.53,chaseSpeed:3.4,fleeSpeed:3.8,detectRange:9,loseRange:15,attackRange:1.3,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:0,lungeSpeed:4,color:`#c9803f`,xp:16,drops:[{item:`gold`,min:5,max:10,chance:1},{item:`cactus_spine`,min:1,max:2,chance:.6},{item:`scorpion_pike`,min:1,max:1,chance:.02}],shape:`scorpion`,behavior:`charger`,chargeWindup:.6,chargeSpeed:10,chargeDistance:7,chargeCooldown:2.4,stunTime:1.5,hitEffect:{type:`poison`,duration:3}},sand_mole:{name:`모래 두더지`,hp:50,attack:13,defense:0,radius:.6,moveSpeed:1.35,chaseSpeed:3,fleeSpeed:3.8,detectRange:10,loseRange:15,attackRange:1.3,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:0,lungeSpeed:4,color:`#9a6a45`,xp:17,drops:[{item:`gold`,min:5,max:10,chance:1},{item:`sandstone`,min:1,max:2,chance:.7},{item:`iron_ore`,min:1,max:1,chance:.2}],shape:`mole`,behavior:`burrower`,burrowTime:2.2,emergeWindup:.8,emergeRadius:2.2,surfaceTime:2.5},tumble:{name:`굴렁 덤불`,hp:22,attack:20,defense:0,radius:.5,moveSpeed:2.16,chaseSpeed:4.8,fleeSpeed:3.8,detectRange:10,loseRange:15,attackRange:1.3,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:0,lungeSpeed:4,color:`#b59a5a`,xp:12,drops:[{item:`gold`,min:3,max:6,chance:1},{item:`fiber`,min:1,max:2,chance:.8}],shape:`tumble`,behavior:`exploder`,fuseTime:.9,blastRadius:2.4,blastMultiplier:2,triggerRange:1.8},frost_wisp:{name:`눈꽃 요정`,hp:30,attack:9,defense:0,radius:.45,moveSpeed:1.35,chaseSpeed:3,fleeSpeed:3.8,detectRange:11,loseRange:16,attackRange:1.3,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:0,lungeSpeed:4,color:`#bfeaff`,xp:18,drops:[{item:`gold`,min:5,max:10,chance:1},{item:`frost_crystal`,min:1,max:1,chance:.03},{item:`wisp_lantern`,min:1,max:1,chance:.02}],shape:`wisp`,behavior:`ranged`,flier:!0,keepDistance:7,shotSpeed:9,shotCooldown:2,shotWindup:.5,shotEffect:{type:`slow`,duration:2,amount:.4},shotColor:`#9fe8ff`,shotKind:`icebolt`},yeti_cub:{name:`설인 새끼`,hp:55,attack:13,defense:0,radius:.65,moveSpeed:1.62,chaseSpeed:3.6,fleeSpeed:3.8,detectRange:9,loseRange:15,attackRange:1.3,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:0,lungeSpeed:4,color:`#f4f7fb`,xp:20,drops:[{item:`gold`,min:6,max:12,chance:1},{item:`fiber`,min:1,max:2,chance:.5},{item:`fur_hat`,min:1,max:1,chance:.03},{item:`yeti_coat`,min:1,max:1,chance:.02}],shape:`yeti`,packMin:2,packMax:2},snow_bomber:{name:`눈사람 폭탄`,hp:30,attack:24,defense:0,radius:.6,moveSpeed:1.44,chaseSpeed:3.2,fleeSpeed:3.8,detectRange:10,loseRange:15,attackRange:1.3,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:0,lungeSpeed:4,color:`#ffffff`,xp:16,drops:[{item:`gold`,min:5,max:10,chance:1},{item:`ice_shard`,min:1,max:1,chance:.7}],shape:`snowman`,behavior:`exploder`,fuseTime:1,blastRadius:2.8,blastMultiplier:2,triggerRange:1.9},king_slime:{name:`왕슬라임`,hp:400,attack:12,defense:0,radius:1.8,moveSpeed:.99,chaseSpeed:2.2,fleeSpeed:3.8,detectRange:8,loseRange:15,attackRange:1.3,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:.95,lungeSpeed:4,color:`#6fd46a`,xp:0,drops:[],shape:`kingslime`,bossDrops:[{item:`gold`,min:150,max:150,chance:1},{oneOf:[`jelly_greatsword`,`royal_jelly_crown`],chance:1},{item:`slime_jelly`,min:20,max:20,chance:1}]},king_slime_half:{name:`중간 왕슬라임`,hp:130,attack:10,defense:0,radius:1.2,moveSpeed:1.17,chaseSpeed:2.6,fleeSpeed:3.8,detectRange:8,loseRange:15,attackRange:1.3,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:.9,lungeSpeed:4,color:`#8ee08a`,xp:60,drops:[],shape:`kingslime`},elder_treant:{name:`고목 수호자`,hp:1100,attack:16,defense:4,radius:1.8,moveSpeed:.72,chaseSpeed:1.6,fleeSpeed:3.8,detectRange:8,loseRange:15,attackRange:1.3,attackWindup:.45,attackRecover:.5,attackCooldown:1.1,fleeHpRatio:.25,fleeDuration:3,wanderRadius:6,wanderPauseMin:.8,wanderPauseMax:2.5,knockbackResist:.95,lungeSpeed:4,color:`#5f8f45`,xp:220,drops:[{item:`gold`,min:300,max:300,chance:1},{oneOf:[`heartwood_bow`,`treant_seed`],chance:1},{item:`resin`,min:10,max:10,chance:1}],shape:`treant`}},r={grades:{common:{name:`일반`,color:`#e8e8e8`},uncommon:{name:`고급`,color:`#6fd46f`},rare:{name:`희귀`,color:`#5ea8ff`},epic:{name:`영웅`,color:`#c07bff`},legendary:{name:`전설`,color:`#ffa53d`}},categories:{currency:`화폐`,material:`재료`,consumable:`소모품`,equipment:`장비`,kit:`건설 키트`},items:JSON.parse(`{"gold":{"name":"골드","category":"currency","color":"#ffd23f","description":"상점과 포탑에 쓰는 돈."},"slime_jelly":{"name":"슬라임 젤리","category":"material","grade":"common","stackable":true,"color":"#8ee08a","maxStack":99,"description":"말랑말랑한 슬라임 젤리. 건설·제작 재료로 쓰인다.","value":2},"tent_kit":{"name":"텐트 키트","category":"kit","grade":"uncommon","stackable":true,"maxStack":5,"color":"#e9a35b","builds":"tent","description":"펼치면 텐트가 되는 꾸러미. 설치한 곳이 새 기지가 된다.","value":60},"twig_sword":{"name":"나뭇가지 검","equipSlot":"weapon","grade":"common","color":"#b88452","bonus":{"attack":3},"description":"단단한 나뭇가지를 깎아 만든 검.","category":"equipment","stackable":false,"value":8,"weaponType":"sword"},"iron_sword":{"name":"무쇠 검","equipSlot":"weapon","grade":"uncommon","color":"#c9d3dd","bonus":{"attack":6,"critChance":0.03},"description":"묵직하고 잘 드는 검.","category":"equipment","stackable":false,"value":30,"weaponType":"sword"},"leaf_hat":{"name":"풀잎 모자","equipSlot":"head","grade":"common","color":"#7ccf6a","bonus":{"defense":1,"maxHp":10},"description":"커다란 풀잎을 엮은 모자.","category":"equipment","stackable":false,"value":8},"leather_vest":{"name":"가죽 조끼","equipSlot":"body","grade":"uncommon","color":"#a86f45","bonus":{"defense":3,"maxHp":15},"description":"튼튼한 가죽 조끼.","category":"equipment","stackable":false,"value":25},"straw_shoes":{"name":"짚신","equipSlot":"feet","grade":"common","color":"#e8cf8a","bonus":{"moveSpeed":0.4,"maxStamina":10},"description":"가볍고 발이 편한 짚신.","category":"equipment","stackable":false,"value":10},"clover_ring":{"name":"네잎클로버 반지","equipSlot":"accessory","grade":"rare","color":"#5fd48a","bonus":{"critChance":0.05,"attack":1},"description":"행운이 깃든 반지.","category":"equipment","stackable":false,"value":50},"jelly_charm":{"name":"젤리 부적","equipSlot":"accessory","grade":"uncommon","color":"#8a6cf0","bonus":{"hpRegen":0.5,"maxHp":10},"description":"밤 슬라임 젤리를 굳힌 부적. 몸이 가볍게 회복된다.","category":"equipment","stackable":false,"value":30},"mushroom_cap":{"name":"버섯 갓","category":"material","grade":"common","stackable":true,"maxStack":99,"color":"#e0574f","description":"숲 버섯의 폭신한 갓. 건설·제작 재료로 쓰인다.","value":4},"potion":{"name":"HP 물약","category":"consumable","grade":"common","stackable":true,"maxStack":20,"color":"#ff7b8a","use":{"heal":40},"description":"마시면 HP가 40 찬다.","value":4},"big_potion":{"name":"큰 HP 물약","category":"consumable","grade":"uncommon","stackable":true,"maxStack":20,"color":"#ff4d6d","use":{"heal":100},"description":"마시면 HP가 100 찬다.","value":12},"cactus_spine":{"name":"선인장 가시","category":"material","grade":"uncommon","stackable":true,"maxStack":99,"color":"#9fd46a","value":6,"description":"사막 선인장의 단단한 가시. 제작 재료."},"ice_shard":{"name":"얼음 조각","category":"material","grade":"uncommon","stackable":true,"maxStack":99,"color":"#9fd8ff","value":8,"description":"녹지 않는 설원의 얼음. 제작 재료."},"desert_cloak":{"name":"사막 망토","equipSlot":"body","grade":"rare","color":"#e9a35b","bonus":{"defense":6,"maxHp":30},"value":60,"description":"햇볕과 가시를 막아 주는 두꺼운 망토.","category":"equipment","stackable":false},"ice_sword":{"name":"얼음 검","equipSlot":"weapon","grade":"rare","color":"#9fd8ff","bonus":{"attack":11,"critChance":0.05},"value":80,"description":"차갑게 빛나는 날카로운 검.","category":"equipment","stackable":false,"weaponType":"sword"},"snow_charm":{"name":"눈꽃 부적","equipSlot":"accessory","grade":"rare","color":"#dff3ff","bonus":{"maxHp":25,"hpRegen":1},"value":60,"description":"눈꽃을 가둔 부적.","category":"equipment","stackable":false},"cactus_crown":{"name":"선인장왕의 왕관","equipSlot":"head","grade":"epic","color":"#ff5f8f","bonus":{"attack":4,"defense":4,"maxHp":40},"value":200,"description":"선인장왕이 쓰던 꽃 왕관.","category":"equipment","stackable":false},"giant_heart":{"name":"거인의 심장","equipSlot":"accessory","grade":"epic","color":"#7fc0f0","bonus":{"maxHp":60,"hpRegen":2,"attack":3},"value":300,"description":"얼음 거인의 식지 않는 심장.","category":"equipment","stackable":false},"wood":{"name":"나무 토막","category":"material","grade":"common","stackable":true,"maxStack":99,"color":"#b88452","value":1,"description":"건설의 기본. 어디서나 구할 수 있다."},"stone":{"name":"돌멩이","category":"material","grade":"common","stackable":true,"maxStack":99,"color":"#a9adb6","value":1,"description":"단단한 돌. 벽과 포탑 받침에 쓴다."},"fiber":{"name":"풀 섬유","category":"material","grade":"common","stackable":true,"maxStack":99,"color":"#b5d67a","value":1,"description":"질긴 풀을 꼬아 만든 실."},"herb":{"name":"약초","category":"material","grade":"common","stackable":true,"maxStack":99,"color":"#6fbf5f","value":2,"description":"쌉싸름한 풀. 물약의 재료."},"resin":{"name":"송진","category":"material","grade":"uncommon","stackable":true,"maxStack":99,"color":"#e9b44f","value":5,"description":"끈적한 나무 진. 접착제로 쓴다."},"iron_ore":{"name":"철광석","category":"material","grade":"uncommon","stackable":true,"maxStack":99,"color":"#8a7f8f","value":6,"description":"무쇠 장비와 대장간의 재료."},"cactus_pulp":{"name":"선인장 과육","category":"material","grade":"common","stackable":true,"maxStack":99,"color":"#8fd46a","value":3,"description":"물기 많은 과육. 사막 요리에 쓴다."},"sandstone":{"name":"사암","category":"material","grade":"uncommon","stackable":true,"maxStack":99,"color":"#e0a86a","value":4,"description":"따뜻한 빛깔의 돌. 요새 벽에 쓴다."},"sun_crystal":{"name":"태양 수정","category":"material","grade":"rare","stackable":true,"maxStack":99,"color":"#ffd23f","value":30,"description":"햇빛을 머금은 수정. 강력한 장비에 쓴다."},"frost_crystal":{"name":"서리 수정","category":"material","grade":"rare","stackable":true,"maxStack":99,"color":"#b8ecff","value":35,"description":"늘 차가운 수정. 서리 포탑의 심장."},"apple":{"name":"사과","category":"consumable","grade":"common","stackable":true,"maxStack":20,"color":"#ff6b6b","use":{"heal":15},"value":2,"description":"아삭한 사과. HP가 15 찬다."},"bamboo_spear":{"name":"대나무 창","category":"equipment","stackable":false,"equipSlot":"weapon","grade":"common","color":"#c9d68a","bonus":{"attack":3},"value":8,"description":"가볍고 길다. 멀리서 콕콕 찌른다.","weaponType":"spear"},"stone_hammer":{"name":"돌망치","category":"equipment","stackable":false,"equipSlot":"weapon","grade":"common","color":"#a9adb6","bonus":{"attack":5},"value":10,"description":"무겁지만 한 방이 세다.","weaponType":"hammer"},"short_bow":{"name":"짧은 활","category":"equipment","stackable":false,"equipSlot":"weapon","grade":"common","color":"#b88452","bonus":{"attack":2},"value":10,"description":"멀리서 화살을 쏜다.","weaponType":"bow"},"iron_spear":{"name":"무쇠 창","category":"equipment","stackable":false,"equipSlot":"weapon","grade":"uncommon","color":"#c9d3dd","bonus":{"attack":6,"moveSpeed":0.2},"value":30,"description":"무게 중심이 좋아 몸이 가볍다.","weaponType":"spear"},"mossy_mace":{"name":"이끼 철퇴","category":"equipment","stackable":false,"equipSlot":"weapon","grade":"uncommon","color":"#6f9a5a","bonus":{"attack":9},"value":35,"description":"이끼 낀 쇠뭉치.","weaponType":"hammer"},"hunter_bow":{"name":"사냥꾼 활","category":"equipment","stackable":false,"equipSlot":"weapon","grade":"uncommon","color":"#8a6440","bonus":{"attack":5,"critChance":0.05},"value":35,"description":"사냥꾼이 쓰던 튼튼한 활.","weaponType":"bow"},"sun_blade":{"name":"태양 검","category":"equipment","stackable":false,"equipSlot":"weapon","grade":"rare","color":"#ffd23f","bonus":{"attack":10,"critChance":0.05},"value":90,"description":"태양 수정을 박아 넣은 검.","weaponType":"sword"},"scorpion_pike":{"name":"전갈 꼬리 창","category":"equipment","stackable":false,"equipSlot":"weapon","grade":"rare","color":"#b35e2c","bonus":{"attack":9,"onHitPoison":3},"value":90,"description":"찔린 적은 독에 걸린다.","weaponType":"spear"},"sandstone_maul":{"name":"사암 망치","category":"equipment","stackable":false,"equipSlot":"weapon","grade":"rare","color":"#e0a86a","bonus":{"attack":14},"value":90,"description":"사암 덩어리를 통째로 휘두른다.","weaponType":"hammer"},"dune_bow":{"name":"모래바람 활","category":"equipment","stackable":false,"equipSlot":"weapon","grade":"rare","color":"#e9b44f","bonus":{"attack":8,"attackSpeed":0.1},"value":90,"description":"모래바람처럼 빠르게 쏜다.","weaponType":"bow"},"frost_lance":{"name":"서리 창","category":"equipment","stackable":false,"equipSlot":"weapon","grade":"rare","color":"#9fd8ff","bonus":{"attack":12,"onHitSlow":0.4},"value":100,"description":"찔린 적은 느려진다.","weaponType":"spear"},"glacier_hammer":{"name":"빙하 망치","category":"equipment","stackable":false,"equipSlot":"weapon","grade":"rare","color":"#7fc0f0","bonus":{"attack":17},"value":100,"description":"빙하처럼 무겁다.","weaponType":"hammer"},"aurora_bow":{"name":"오로라 활","category":"equipment","stackable":false,"equipSlot":"weapon","grade":"rare","color":"#b8a0ff","bonus":{"attack":11,"critChance":0.08},"value":100,"description":"오로라빛 화살을 쏜다.","weaponType":"bow"},"jelly_greatsword":{"name":"왕젤리 대검","category":"equipment","stackable":false,"equipSlot":"weapon","grade":"epic","color":"#8ee08a","bonus":{"attack":8,"maxHp":30,"onKillHeal":3},"value":200,"description":"왕슬라임의 젤리를 굳힌 대검. 쓰러뜨릴 때마다 기운이 난다.","weaponType":"sword"},"heartwood_bow":{"name":"고목심 활","category":"equipment","stackable":false,"equipSlot":"weapon","grade":"epic","color":"#9a6a45","bonus":{"attack":12,"multiShot":1},"value":220,"description":"고목의 심재로 만든 활. 화살 두 발을 쏜다.","weaponType":"bow"},"dawn_blade":{"name":"새벽검","category":"equipment","stackable":false,"equipSlot":"weapon","grade":"legendary","color":"#ffa53d","bonus":{"attack":22,"critChance":0.1,"nightBonus":0.3},"value":500,"description":"밤을 가르는 새벽빛 검.","weaponType":"sword"},"grass_tunic":{"name":"풀잎 옷","category":"equipment","stackable":false,"equipSlot":"body","grade":"common","color":"#8fce6a","bonus":{"defense":2,"maxHp":10},"value":8,"description":"풀잎을 엮은 가벼운 옷."},"mushroom_hat":{"name":"버섯 모자","category":"equipment","stackable":false,"equipSlot":"head","grade":"uncommon","color":"#e0574f","bonus":{"defense":2,"maxHp":20},"value":25,"description":"폭신한 버섯 갓 모자."},"leather_boots":{"name":"가죽 장화","category":"equipment","stackable":false,"equipSlot":"feet","grade":"uncommon","color":"#8a5a3a","bonus":{"defense":1,"moveSpeed":0.5,"maxStamina":15},"value":25,"description":"오래 걸어도 발이 편하다."},"desert_hood":{"name":"사막 두건","category":"equipment","stackable":false,"equipSlot":"head","grade":"rare","color":"#e9a35b","bonus":{"defense":3,"maxHp":25,"critChance":0.03},"value":60,"description":"모래바람을 막는 두건."},"sand_sandals":{"name":"모래 샌들","category":"equipment","stackable":false,"equipSlot":"feet","grade":"rare","color":"#e8cf8a","bonus":{"moveSpeed":0.7,"maxStamina":20},"value":60,"description":"모래 위를 미끄러지듯 걷는다."},"fur_hat":{"name":"털모자","category":"equipment","stackable":false,"equipSlot":"head","grade":"rare","color":"#f2f2f2","bonus":{"defense":4,"maxHp":35},"value":60,"description":"귀까지 따뜻한 털모자."},"yeti_coat":{"name":"설인 털옷","category":"equipment","stackable":false,"equipSlot":"body","grade":"rare","color":"#e6f2fa","bonus":{"defense":9,"maxHp":45},"value":80,"description":"설인 털로 짠 두꺼운 옷."},"snow_boots":{"name":"설원 부츠","category":"equipment","stackable":false,"equipSlot":"feet","grade":"rare","color":"#b9dcf2","bonus":{"defense":2,"moveSpeed":0.6,"maxStamina":25},"value":60,"description":"눈길에도 미끄러지지 않는다."},"royal_jelly_crown":{"name":"말랑 왕관","category":"equipment","stackable":false,"equipSlot":"head","grade":"epic","color":"#ffb3d9","bonus":{"maxHp":50,"hpRegen":1.5},"value":200,"description":"왕슬라임의 말랑한 왕관."},"bee_ring":{"name":"꿀벌 반지","category":"equipment","stackable":false,"equipSlot":"accessory","grade":"uncommon","color":"#ffd23f","bonus":{"attackSpeed":0.08},"value":30,"description":"붕붕벌처럼 재빠르게."},"rabbit_foot":{"name":"토끼발 부적","category":"equipment","stackable":false,"equipSlot":"accessory","grade":"uncommon","color":"#ffffff","bonus":{"moveSpeed":0.3,"rollStaminaPct":-0.25},"value":30,"description":"행운과 날쌘 발."},"spore_pendant":{"name":"포자 목걸이","category":"equipment","stackable":false,"equipSlot":"accessory","grade":"uncommon","color":"#b88ae0","bonus":{"hpRegen":0.8,"poisonResist":0.5},"value":30,"description":"독에 조금 강해진다."},"wisp_lantern":{"name":"요정 등불","category":"equipment","stackable":false,"equipSlot":"accessory","grade":"rare","color":"#9fe8ff","bonus":{"critDamage":0.25},"value":70,"description":"치명타가 더 아프다."},"treant_seed":{"name":"고목의 씨앗","category":"equipment","stackable":false,"equipSlot":"accessory","grade":"epic","color":"#6fae4a","bonus":{"defense":5,"maxHp":40,"baseRegenMult":1},"value":200,"description":"기지 안에 있으면 회복이 두 배."},"herb_tea":{"name":"약초차","category":"consumable","grade":"common","stackable":true,"maxStack":20,"color":"#a6d48a","use":{"buff":{"id":"herb_tea","duration":30,"effects":{"staminaRegenPct":0.5}}},"value":4,"description":"30초 동안 스태미나가 50% 더 빨리 찬다."},"honey_jar":{"name":"꿀단지","category":"consumable","grade":"uncommon","stackable":true,"maxStack":20,"color":"#ffc53d","use":{"buff":{"id":"honey","duration":60,"effects":{"moveSpeedPct":0.2}}},"value":10,"description":"60초 동안 이동속도 +20%."},"fire_tonic":{"name":"불꽃 강장제","category":"consumable","grade":"uncommon","stackable":true,"maxStack":20,"color":"#ff7b3d","use":{"buff":{"id":"fire_tonic","duration":90,"effects":{"attackPct":0.15}}},"value":12,"description":"90초 동안 공격력 +15%."},"cactus_juice":{"name":"선인장 주스","category":"consumable","grade":"uncommon","stackable":true,"maxStack":20,"color":"#8fd46a","use":{"heal":60,"buff":{"id":"cactus_juice","duration":10,"effects":{"hpRegen":3}}},"value":10,"description":"HP 60 회복, 10초 동안 HP재생 +3."},"return_scroll":{"name":"귀환 두루마리","category":"consumable","grade":"uncommon","stackable":true,"maxStack":10,"color":"#e9dcb0","use":{"returnHome":true},"value":20,"description":"읽으면 가장 가까운 기지로 돌아간다. 기지 밖에서도!"},"forget_potion":{"name":"망각의 물약","category":"consumable","grade":"rare","stackable":true,"maxStack":5,"color":"#9a7fe0","use":{"resetSkills":true},"value":100,"description":"배운 스킬을 모두 잊고 스킬 포인트를 돌려받는다."}}`),statLabels:{maxHp:`최대 HP`,maxStamina:`최대 스태미나`,attack:`공격력`,defense:`방어력`,moveSpeed:`이동속도`,critChance:`치명타 확률`,hpRegen:`HP 재생(초당)`,attackSpeed:`공격 속도`,moveSpeedPct:`이동속도`,spin:`회전 베기`,gatherSpeed:`채집 속도`,gatherAmount:`채집량`,turretDamage:`포탑 데미지`,turretRange:`포탑 사거리`,buildCost:`포탑 비용 절감`,extraTurrets:`포탑 설치 수`,critDamage:`치명타 피해`,onHitPoison:`적중 시 독(초)`,onHitSlow:`적중 시 감속`,onKillHeal:`처치 시 HP 회복`,multiShot:`화살 추가`,nightBonus:`밤 몬스터에게 피해`,rollStaminaPct:`구르기 스태미나`,poisonResist:`독 저항`,baseRegenMult:`기지 안 HP재생`,damageTaken:`받는 피해`,slowImmune:`감속 면역`,attackPct:`공격력`,staminaRegenPct:`스태미나 회복`},percentStats:[`critChance`,`attackSpeed`,`moveSpeedPct`,`gatherSpeed`,`turretDamage`,`buildCost`,`critDamage`,`onHitSlow`,`nightBonus`,`rollStaminaPct`,`poisonResist`,`baseRegenMult`,`damageTaken`,`attackPct`,`staminaRegenPct`],equipSlots:{weapon:`무기`,head:`머리`,body:`몸`,feet:`신발`,accessory1:`장신구`,accessory2:`장신구`},sets:{grassland:{name:`초원 세트`,pieces:[`leaf_hat`,`grass_tunic`,`straw_shoes`],bonus:{moveSpeedPct:.08}},forest:{name:`숲 세트`,pieces:[`mushroom_hat`,`leather_vest`,`leather_boots`],bonus:{hpRegen:1}},desert:{name:`사막 세트`,pieces:[`desert_hood`,`desert_cloak`,`sand_sandals`],bonus:{critChance:.05}},snow:{name:`설원 세트`,pieces:[`fur_hat`,`yeti_coat`,`snow_boots`],bonus:{damageTaken:-.1,slowImmune:1}}},weaponNames:{sword:`검`,spear:`창`,hammer:`망치`,bow:`활`}},i={baseLevels:{1:{name:`텐트`,model:`tent`,areaRadius:11,maxTurrets:3,hp:300,radius:1.3,xp:20},2:{name:`움막`,model:`hut`,areaRadius:13,maxTurrets:4,hp:450,radius:1.6,xp:40,cost:[{id:`wood`,count:20},{id:`stone`,count:10},{id:`slime_jelly`,count:8}]},3:{name:`집`,model:`house`,areaRadius:15,maxTurrets:5,hp:650,radius:2,xp:60,cost:[{id:`wood`,count:40},{id:`stone`,count:25},{id:`resin`,count:6},{id:`mushroom_cap`,count:10}]},4:{name:`요새`,model:`fort`,areaRadius:18,maxTurrets:6,hp:900,radius:2.6,xp:100,cost:[{id:`wood`,count:60},{id:`sandstone`,count:30},{id:`iron_ore`,count:12},{id:`cactus_spine`,count:15},{id:`ice_shard`,count:10}]}},buildings:{workbench:{name:`작업대`,description:`재료로 장비·물약·텐트 키트를 만든다.`,model:`workbench`,unlockBaseLevel:1,cost:[{id:`wood`,count:8},{id:`slime_jelly`,count:4}],hp:120,radius:.9,xp:15,color:`#b88452`},storage:{name:`창고`,description:`이 기지 전용 보관함. 습격에 지면 여기 재료를 잃는다.`,model:`storage`,unlockBaseLevel:2,cost:[{id:`wood`,count:15},{id:`stone`,count:8}],hp:200,radius:1.2,xp:20,slots:24,color:`#9a6a45`},shop:{name:`상점`,description:`골드로 물건을 사고, 재료·장비를 판다.`,model:`shop`,unlockBaseLevel:2,cost:[{id:`wood`,count:12},{id:`fiber`,count:10},{id:`stone`,count:6}],hp:150,radius:1.2,xp:20,color:`#e9835b`}}},a={wood_bow:{name:`나무 활 포탑`,description:`싸고 약한 활 포탑. 한 번에 한 마리를 쏜다.`,model:`bow`,projectile:`arrow`,unlockBaseLevel:1,cost:30,hp:80,radius:.6,range:9,fireRate:1.1,damage:8,projectileSpeed:20,priority:`nearest`,color:`#c58b4f`,xp:10,upgradeCosts:[40,80],repairCostPerHp:.25,damagePerLevel:.35,rangePerLevel:.5,hpPerLevel:.3,maxLevel:3},crossbow:{name:`석궁 포탑`,description:`데미지가 높지만 느리다. 체력 낮은 적부터 노린다.`,model:`crossbow`,projectile:`bolt`,unlockBaseLevel:2,cost:60,hp:110,radius:.7,range:11,fireRate:.5,damage:24,projectileSpeed:28,priority:`lowestHp`,color:`#8a6440`,xp:15,upgradeCosts:[70,140],repairCostPerHp:.3,damagePerLevel:.35,rangePerLevel:.5,hpPerLevel:.3,maxLevel:3},gun:{name:`총 포탑`,description:`빠르게 연사한다. 한 발은 약하다.`,model:`gun`,projectile:`bullet`,unlockBaseLevel:3,cost:100,hp:130,radius:.7,range:8.5,fireRate:4,damage:5,projectileSpeed:42,priority:`nearest`,color:`#6f7d8c`,xp:20,upgradeCosts:[110,220],repairCostPerHp:.35,damagePerLevel:.35,rangePerLevel:.5,hpPerLevel:.3,maxLevel:3},cannon:{name:`대포 포탑`,description:`느리지만 포탄이 떨어진 곳 주변을 모두 날려 버린다.`,model:`cannon`,projectile:`ball`,unlockBaseLevel:4,cost:160,hp:180,radius:.85,range:12,fireRate:.35,damage:30,projectileSpeed:14,splashRadius:2.8,splashMinFactor:.4,aoeFactor:2.2,priority:`nearest`,color:`#4a4f5a`,xp:30,upgradeCosts:[170,340],repairCostPerHp:.4,damagePerLevel:.35,rangePerLevel:.5,hpPerLevel:.3,maxLevel:3}},o={grassland:{name:`초원`,difficulty:1,statMultiplier:1,zFrom:-60,zTo:90,monsters:[`slime`,`slime`,`slime`,`bee`,`horn_rabbit`,`big_slime`],raidMonster:`night_slime`,mapColor:`#9edb6f`,ground:[`#9edb6f`,`#86c95c`,`#b2e27e`],decor:{pines:5.5,roundTrees:3.5,rocks:2.8,bushes:3.1,flowers:27,tufts:55,mushrooms:0,cacti:0},palette:{pine:[`#4fae62`,`#5cbb6a`,`#46a05a`],round:[`#7ccf6a`,`#95d86f`],blossom:[`#f4b6c9`,`#ffd08a`],flower:[`#ffffff`,`#ffd6e5`,`#fff27a`,`#d9c6ff`,`#ffb3a1`],tuft:[`#7ec85a`,`#94d468`,`#6fbb52`],rock:[`#b8bcc4`,`#a9adb6`,`#c9c6be`]}},forest:{name:`숲`,difficulty:2,statMultiplier:1.35,zFrom:-270,zTo:-60,monsters:[`mushroom`,`mushroom`,`spore_puff`,`thorn_wolf`,`stump`,`slime`],raidMonster:`night_mushroom`,mapColor:`#4f9a5a`,ground:[`#6fb866`,`#5ea85a`,`#7cc26d`],decor:{pines:15,roundTrees:4,rocks:3,bushes:6,flowers:6,tufts:40,mushrooms:7,cacti:0},palette:{pine:[`#2f8a4e`,`#3a9657`,`#2a7a47`],round:[`#4fa85a`,`#5cb565`],blossom:[`#d98b5f`],flower:[`#ffffff`,`#d9c6ff`,`#b8e0ff`],tuft:[`#5da84c`,`#6cb659`,`#4f9a42`],rock:[`#b8bcc4`,`#a9adb6`,`#c9c6be`]}},desert:{name:`사막`,difficulty:3,statMultiplier:1.8,zFrom:90,zTo:300,monsters:[`cactus`,`sand_slime`,`scorpion`,`sand_mole`,`tumble`,`cactus`],raidMonster:`night_cactus`,mapColor:`#e8cf8a`,ground:[`#ecd59a`,`#e2c682`,`#f3e2b0`],decor:{pines:0,roundTrees:.4,rocks:3.5,bushes:1.2,flowers:3,tufts:8,mushrooms:0,cacti:6},palette:{pine:[`#6fa860`],round:[`#b5b86a`,`#a9ad5f`],blossom:[`#e9a35b`],flower:[`#ff8fb1`,`#fff27a`],tuft:[`#c9b86a`,`#b5a85a`],rock:[`#d9b98a`,`#c9a06a`,`#e0c79a`]}},snow:{name:`설원`,difficulty:4,statMultiplier:2.4,zFrom:-480,zTo:-270,monsters:[`snow_slime`,`ice_golem`,`frost_wisp`,`yeti_cub`,`snow_bomber`,`snow_slime`],raidMonster:`night_golem`,mapColor:`#e6f2fa`,ground:[`#f2f7fb`,`#e3edf5`,`#ffffff`],decor:{pines:9,roundTrees:0,rocks:3,bushes:1.5,flowers:0,tufts:6,mushrooms:0,cacti:0},palette:{pine:[`#3f7a5a`,`#4a8766`,`#356b50`],snow:!0,round:[`#cfe3ee`],blossom:[`#cfe3ee`],flower:[`#ffffff`],tuft:[`#b9cfdb`,`#a8c2d0`],rock:[`#b9dcf2`,`#a5cde8`,`#d6ecfa`]}}},s={maxLevel:30,xpBase:20,xpGrowth:1.3,skillPointsPerLevel:1,perLevel:{maxHp:8,maxStamina:4,attack:1,defense:.5}},c={branches:{combat:{name:`전투`,color:`#ff8a7a`},survival:{name:`생존·채집`,color:`#7cc67a`},building:{name:`건축`,color:`#e9a35b`}},skills:{power:{branch:`combat`,tier:1,name:`힘`,description:`공격력이 오른다.`,maxRank:5,requires:[],effects:{attack:2}},combo:{branch:`combat`,tier:2,name:`연속 베기`,description:`칼을 더 빨리 휘두른다.`,maxRank:3,requires:[{id:`power`,rank:1}],effects:{attackSpeed:.1}},whirl:{branch:`combat`,tier:3,name:`회전 공격`,description:`세 번째 공격마다 한 바퀴 돌며 주변을 모두 벤다. 랭크마다 회전 베기 공격력 +25%.`,maxRank:3,requires:[{id:`combo`,rank:1}],effects:{spin:1}},crit:{branch:`combat`,tier:3,name:`급소 찌르기`,description:`치명타 확률이 오른다.`,maxRank:3,requires:[{id:`power`,rank:2}],effects:{critChance:.05}},gatherSpeed:{branch:`survival`,tier:1,name:`손놀림`,description:`채집 노드(나무·바위·풀)에 주는 피해가 늘어 더 빨리 캔다.`,maxRank:3,requires:[],effects:{gatherSpeed:.15}},vitality:{branch:`survival`,tier:1,name:`회복력`,description:`HP가 저절로 더 빨리 찬다.`,maxRank:3,requires:[],effects:{hpRegen:1}},gatherAmount:{branch:`survival`,tier:2,name:`알뜰 채집`,description:`채집할 때 주 재료를 1개 더 얻는다.`,maxRank:3,requires:[{id:`gatherSpeed`,rank:1}],effects:{gatherAmount:1}},swift:{branch:`survival`,tier:2,name:`가벼운 발`,description:`이동속도가 오른다.`,maxRank:3,requires:[{id:`vitality`,rank:1}],effects:{moveSpeedPct:.06}},thrift:{branch:`building`,tier:1,name:`절약`,description:`포탑 설치 비용이 줄어든다.`,maxRank:3,requires:[],effects:{buildCost:.1}},turretPower:{branch:`building`,tier:1,name:`포탑 정비`,description:`포탑 데미지와 사거리가 오른다.`,maxRank:3,requires:[],effects:{turretDamage:.15,turretRange:.8}},turretCount:{branch:`building`,tier:2,name:`진지 확장`,description:`기지마다 포탑을 하나 더 세울 수 있다.`,maxRank:2,requires:[{id:`turretPower`,rank:1}],effects:{extraTurrets:1}}}},l={potion:{result:`potion`,count:2,baseLevel:1,ingredients:[{id:`herb`,count:2},{id:`slime_jelly`,count:1}]},tent_kit:{result:`tent_kit`,count:1,baseLevel:1,ingredients:[{id:`slime_jelly`,count:10},{id:`mushroom_cap`,count:6}]},twig_sword:{result:`twig_sword`,count:1,baseLevel:1,ingredients:[{id:`slime_jelly`,count:4}]},leaf_hat:{result:`leaf_hat`,count:1,baseLevel:1,ingredients:[{id:`slime_jelly`,count:5}]},straw_shoes:{result:`straw_shoes`,count:1,baseLevel:1,ingredients:[{id:`slime_jelly`,count:5},{id:`mushroom_cap`,count:2}]},big_potion:{result:`big_potion`,count:1,baseLevel:2,ingredients:[{id:`slime_jelly`,count:4},{id:`mushroom_cap`,count:3}]},leather_vest:{result:`leather_vest`,count:1,baseLevel:2,ingredients:[{id:`slime_jelly`,count:8},{id:`mushroom_cap`,count:6}]},jelly_charm:{result:`jelly_charm`,count:1,baseLevel:2,ingredients:[{id:`slime_jelly`,count:12},{id:`mushroom_cap`,count:4}]},iron_sword:{result:`iron_sword`,count:1,baseLevel:3,ingredients:[{id:`slime_jelly`,count:10},{id:`mushroom_cap`,count:10}]},clover_ring:{result:`clover_ring`,count:1,baseLevel:4,ingredients:[{id:`slime_jelly`,count:15},{id:`mushroom_cap`,count:15}]},desert_cloak:{result:`desert_cloak`,count:1,baseLevel:2,ingredients:[{id:`cactus_spine`,count:12},{id:`slime_jelly`,count:10}]},ice_sword:{result:`ice_sword`,count:1,baseLevel:3,ingredients:[{id:`ice_shard`,count:12},{id:`cactus_spine`,count:6}]},snow_charm:{result:`snow_charm`,count:1,baseLevel:3,ingredients:[{id:`ice_shard`,count:10},{id:`mushroom_cap`,count:10}]},bamboo_spear:{result:`bamboo_spear`,count:1,baseLevel:1,ingredients:[{id:`wood`,count:6},{id:`fiber`,count:4}]},stone_hammer:{result:`stone_hammer`,count:1,baseLevel:1,ingredients:[{id:`wood`,count:4},{id:`stone`,count:8}]},short_bow:{result:`short_bow`,count:1,baseLevel:1,ingredients:[{id:`wood`,count:8},{id:`fiber`,count:6}]},grass_tunic:{result:`grass_tunic`,count:1,baseLevel:1,ingredients:[{id:`fiber`,count:10}]},herb_tea:{result:`herb_tea`,count:1,baseLevel:1,ingredients:[{id:`herb`,count:2}]},iron_spear:{result:`iron_spear`,count:1,baseLevel:2,ingredients:[{id:`iron_ore`,count:6},{id:`wood`,count:10}]},mossy_mace:{result:`mossy_mace`,count:1,baseLevel:2,ingredients:[{id:`iron_ore`,count:5},{id:`resin`,count:4},{id:`stone`,count:10}]},hunter_bow:{result:`hunter_bow`,count:1,baseLevel:2,ingredients:[{id:`resin`,count:4},{id:`wood`,count:15},{id:`fiber`,count:8}]},mushroom_hat:{result:`mushroom_hat`,count:1,baseLevel:2,ingredients:[{id:`mushroom_cap`,count:8},{id:`fiber`,count:4}]},leather_boots:{result:`leather_boots`,count:1,baseLevel:2,ingredients:[{id:`fiber`,count:8},{id:`resin`,count:3}]},fire_tonic:{result:`fire_tonic`,count:1,baseLevel:2,ingredients:[{id:`cactus_pulp`,count:3},{id:`herb`,count:2}]},cactus_juice:{result:`cactus_juice`,count:1,baseLevel:2,ingredients:[{id:`cactus_pulp`,count:4}]},sun_blade:{result:`sun_blade`,count:1,baseLevel:3,ingredients:[{id:`sun_crystal`,count:2},{id:`iron_ore`,count:8}]},sandstone_maul:{result:`sandstone_maul`,count:1,baseLevel:3,ingredients:[{id:`sandstone`,count:20},{id:`iron_ore`,count:6}]},dune_bow:{result:`dune_bow`,count:1,baseLevel:3,ingredients:[{id:`cactus_spine`,count:15},{id:`resin`,count:6}]},desert_hood:{result:`desert_hood`,count:1,baseLevel:3,ingredients:[{id:`cactus_spine`,count:8},{id:`fiber`,count:10}]},sand_sandals:{result:`sand_sandals`,count:1,baseLevel:3,ingredients:[{id:`cactus_pulp`,count:10},{id:`fiber`,count:8}]},frost_lance:{result:`frost_lance`,count:1,baseLevel:3,ingredients:[{id:`frost_crystal`,count:2},{id:`ice_shard`,count:12}]},glacier_hammer:{result:`glacier_hammer`,count:1,baseLevel:3,ingredients:[{id:`ice_shard`,count:20},{id:`iron_ore`,count:8}]},aurora_bow:{result:`aurora_bow`,count:1,baseLevel:3,ingredients:[{id:`frost_crystal`,count:2},{id:`resin`,count:8}]},fur_hat:{result:`fur_hat`,count:1,baseLevel:3,ingredients:[{id:`ice_shard`,count:6},{id:`fiber`,count:10}]},yeti_coat:{result:`yeti_coat`,count:1,baseLevel:3,ingredients:[{id:`ice_shard`,count:12},{id:`fiber`,count:14},{id:`frost_crystal`,count:1}]},snow_boots:{result:`snow_boots`,count:1,baseLevel:3,ingredients:[{id:`ice_shard`,count:10},{id:`fiber`,count:10}]}},u={buy:[{id:`potion`,price:12},{id:`big_potion`,price:35},{id:`twig_sword`,price:30},{id:`leaf_hat`,price:30},{id:`straw_shoes`,price:35},{id:`tent_kit`,price:250},{id:`return_scroll`,price:40},{id:`forget_potion`,price:300}]},d={cactus_king:{name:`선인장왕`,monster:`cactus_king`,region:`desert`,lair:[0,265],spawnRange:60,despawnRange:95,aggroRange:15,leashRange:34,respawnDays:3,patterns:[{kind:`slam`,windup:1,radius:3.8,damage:26,cooldown:5},{kind:`volley`,windup:.7,count:12,speed:11,damage:12,range:14,cooldown:4.5}]},ice_giant:{name:`얼음 거인`,monster:`ice_giant`,region:`snow`,lair:[0,-445],spawnRange:60,despawnRange:95,aggroRange:15,leashRange:34,respawnDays:3,patterns:[{kind:`slam`,windup:1.1,radius:4.6,damage:34,cooldown:5},{kind:`boulder`,windup:1,speed:14,radius:2.8,damage:30,range:18,cooldown:3.5}]},king_slime:{name:`왕슬라임`,monster:`king_slime`,region:`grassland`,lair:[70,-45],spawnRange:60,despawnRange:95,aggroRange:14,leashRange:30,respawnDays:3,patterns:[{kind:`jump`,windup:1.1,radius:3.5,damage:18,range:12,cooldown:4},{kind:`summon`,monster:`slime`,count:3,windup:.6,range:14,cooldown:10}],split:{at:.5,into:`king_slime_half`,count:2,patterns:[{kind:`jump`,windup:1,radius:2.6,damage:13,range:12,cooldown:4.5}]}},elder_treant:{name:`고목 수호자`,monster:`elder_treant`,region:`forest`,lair:[-60,-240],spawnRange:60,despawnRange:95,aggroRange:15,leashRange:34,respawnDays:3,patterns:[{kind:`roots`,windup:1,count:3,spreadDeg:25,length:12,width:1.3,damage:22,range:13,cooldown:6},{kind:`summon`,monster:`stump`,count:2,windup:.8,range:16,cooldown:14},{kind:`leafstorm`,windup:.6,count:8,damage:12,duration:3,maxRadius:7,range:9,cooldown:8}],enrage:{at:.3,speed:1.3,color:`#d9674f`}}},f={maxVoices:12,maxDistance:30,masterSfx:.55,masterMusic:.32,sfx:{swing:[{type:`noise`,d:.12,g:.25,filter:2200,filter2:700}],hit:[{type:`square`,f:220,f2:90,d:.08,g:.22},{type:`noise`,d:.05,g:.18,filter:1800}],crit:[{type:`square`,f:330,f2:110,d:.12,g:.25},{type:`triangle`,f:990,f2:1320,d:.12,t:.03,g:.18},{type:`noise`,d:.07,g:.2,filter:3e3}],kill:[{type:`triangle`,f:520,f2:180,d:.22,g:.25},{type:`noise`,d:.18,g:.15,filter:1200,filter2:300}],coin:[{type:`square`,f:988,d:.07,g:.12},{type:`square`,f:1319,d:.18,t:.07,g:.12}],pickup:[{type:`triangle`,f:660,f2:990,d:.1,g:.2}],levelup:[{type:`triangle`,f:523,d:.12,g:.2},{type:`triangle`,f:659,d:.12,t:.1,g:.2},{type:`triangle`,f:784,d:.12,t:.2,g:.2},{type:`triangle`,f:1047,d:.35,t:.3,g:.22}],hurt:[{type:`sawtooth`,f:180,f2:70,d:.18,g:.2},{type:`noise`,d:.1,g:.15,filter:900}],roll:[{type:`noise`,d:.22,g:.18,filter:600,filter2:1600}],bow:[{type:`triangle`,f:420,f2:180,d:.09,g:.14}],crossbow:[{type:`square`,f:260,f2:120,d:.1,g:.14},{type:`noise`,d:.05,g:.1,filter:2500}],gun:[{type:`noise`,d:.06,g:.18,filter:3500,filter2:900}],cannon:[{type:`sine`,f:120,f2:40,d:.3,g:.35},{type:`noise`,d:.2,g:.2,filter:800}],boom:[{type:`sine`,f:90,f2:30,d:.5,g:.4},{type:`noise`,d:.45,g:.3,filter:1400,filter2:200}],build:[{type:`square`,f:330,d:.06,g:.14},{type:`square`,f:440,d:.06,t:.08,g:.14},{type:`triangle`,f:660,d:.2,t:.16,g:.18}],click:[{type:`triangle`,f:880,f2:660,d:.05,g:.12}],open:[{type:`triangle`,f:440,f2:660,d:.08,g:.12}],close:[{type:`triangle`,f:660,f2:440,d:.08,g:.1}],horn:[{type:`sawtooth`,f:196,d:.5,g:.14,a:.08},{type:`sawtooth`,f:294,d:.8,t:.45,g:.14,a:.08},{type:`sine`,f:98,d:1.2,g:.12,a:.1}],birds:[{type:`sine`,f:2400,f2:3200,d:.08,g:.08},{type:`sine`,f:2800,f2:2200,d:.08,t:.12,g:.08},{type:`sine`,f:2600,f2:3400,d:.1,t:.5,g:.07},{type:`sine`,f:3e3,f2:2400,d:.08,t:.64,g:.07}],slam:[{type:`sine`,f:70,f2:30,d:.45,g:.4},{type:`noise`,d:.3,g:.25,filter:600}],chop:[{type:`triangle`,f:300,f2:160,d:.09,g:.22},{type:`noise`,d:.06,g:.15,filter:900}],mine:[{type:`square`,f:1400,f2:900,d:.06,g:.12},{type:`noise`,d:.07,g:.16,filter:3200}],rustle:[{type:`noise`,d:.14,g:.14,filter:2800,filter2:1500}],gathered:[{type:`triangle`,f:523,d:.07,g:.16},{type:`triangle`,f:784,d:.14,t:.07,g:.16}],shoot:[{type:`triangle`,f:600,f2:260,d:.1,g:.16},{type:`noise`,d:.06,g:.1,filter:3e3}],drink:[{type:`sine`,f:400,f2:700,d:.12,g:.14},{type:`sine`,f:500,f2:850,d:.12,t:.1,g:.12}],shock:[{type:`sine`,f:110,f2:45,d:.3,g:.3},{type:`noise`,d:.2,g:.18,filter:700}]},music:{moods:{grassland_day:{root:261.63,scale:[0,2,4,7,9],tempo:92,lead:`triangle`,pad:`sine`},forest_day:{root:220,scale:[0,2,4,7,9],tempo:84,lead:`sine`,pad:`triangle`},desert_day:{root:293.66,scale:[0,3,5,7,10],tempo:96,lead:`triangle`,pad:`sine`},snow_day:{root:329.63,scale:[0,2,4,7,9],tempo:76,lead:`sine`,pad:`sine`},night:{root:174.61,scale:[0,3,5,7,10],tempo:68,lead:`sine`,pad:`sine`}},raidDrums:!0,bossTempoMultiplier:1.45,melodyChance:.62,stepsPerBar:8}},p={nodes:{tree_node:{name:`둥근 나무`,model:`roundTree`,hp:30,respawnDays:2,xp:3,radius:.55,collide:!0,sound:`chop`,color:`#7ccf6a`,drops:[{item:`wood`,min:2,max:3,chance:1},{item:`apple`,min:1,max:1,chance:.3}]},pine_node:{name:`전나무`,model:`pine`,hp:40,respawnDays:2,xp:4,radius:.55,collide:!0,sound:`chop`,color:`#3f8a55`,drops:[{item:`wood`,min:2,max:4,chance:1},{item:`resin`,min:1,max:1,chance:.25}]},rock_node:{name:`바위`,model:`rock`,hp:45,respawnDays:3,xp:4,radius:.8,collide:!0,sound:`mine`,color:`#a9adb6`,drops:[{item:`stone`,min:2,max:3,chance:1},{item:`iron_ore`,min:1,max:1,chance:.35,chanceByRegion:{grassland:.15}}]},herb_node:{name:`약초 덤불`,model:`herb`,hp:10,respawnDays:1,xp:2,radius:.5,collide:!1,sound:`rustle`,color:`#6fbf5f`,drops:[{item:`herb`,min:1,max:2,chance:1}]},fiber_node:{name:`긴 풀`,model:`fiber`,hp:8,respawnDays:1,xp:1,radius:.45,collide:!1,sound:`rustle`,color:`#9fd46a`,drops:[{item:`fiber`,min:1,max:3,chance:1}]},cactus_node:{name:`큰 선인장`,model:`cactus`,hp:35,respawnDays:2,xp:4,radius:.5,collide:!0,sound:`chop`,color:`#5fa85a`,drops:[{item:`cactus_pulp`,min:1,max:2,chance:1},{item:`cactus_spine`,min:1,max:1,chance:.5}]},sandstone_node:{name:`사암`,model:`sandstone`,hp:55,respawnDays:3,xp:5,radius:.85,collide:!0,sound:`mine`,color:`#e0a86a`,drops:[{item:`sandstone`,min:2,max:3,chance:1},{item:`sun_crystal`,min:1,max:1,chance:.08}]},ice_node:{name:`얼음 기둥`,model:`ice`,hp:60,respawnDays:3,xp:6,radius:.6,collide:!0,sound:`mine`,color:`#9fd8ff`,drops:[{item:`ice_shard`,min:1,max:2,chance:1},{item:`frost_crystal`,min:1,max:1,chance:.08}]}},density:{grassland:{tree_node:.9,rock_node:.5,herb_node:.8,fiber_node:1},forest:{tree_node:.6,pine_node:1.2,rock_node:.6,herb_node:.5},desert:{cactus_node:.9,sandstone_node:.6,rock_node:.4},snow:{pine_node:.8,ice_node:.7,rock_node:.5}}},m={sword:{name:`검`,range:2.1,arcDeg:120,cooldown:.42,damageMult:1,knockback:5,swing:`slash`,staminaCost:6,duration:.26,hitTime:.1},spear:{name:`창`,range:3.2,arcDeg:40,cooldown:.5,damageMult:1.05,knockback:3,swing:`thrust`,staminaCost:6,duration:.24,hitTime:.1},hammer:{name:`망치`,range:2.3,arcDeg:170,cooldown:.85,damageMult:1.7,knockback:10,swing:`smash`,staminaCost:9,shockEvery:3,shockRadius:3,shockMult:.6,duration:.42,hitTime:.24},bow:{name:`활`,range:13,arcDeg:0,cooldown:.6,damageMult:.8,knockback:1.5,swing:`shoot`,staminaCost:8,arrowSpeed:24,autoAimRange:10,spreadDeg:8,duration:.22,hitTime:.08}},h=1e3,g=1001,_=1002,v=1003,y=1004,b=1005,x=1006,S=1007,C=1008,w=1009,T=1010,E=1011,D=1012,O=1013,k=1014,A=1015,j=1016,ee=1017,M=1018,te=1020,N=35902,ne=35899,re=1021,ie=1022,ae=1023,oe=1026,P=1027,se=1028,ce=1029,F=1030,le=1031,ue=1033,de=33776,fe=33777,pe=33778,me=33779,he=35840,ge=35841,_e=35842,ve=35843,ye=36196,be=37492,xe=37496,Se=37488,Ce=37489,we=37490,Te=37491,Ee=37808,De=37809,Oe=37810,ke=37811,Ae=37812,je=37813,Me=37814,I=37815,Ne=37816,Pe=37817,Fe=37818,L=37819,Ie=37820,R=37821,z=36492,Le=36494,Re=36495,ze=36283,Be=36284,Ve=36285,He=36286,Ue=2300,We=2301,Ge=2302,Ke=2303,qe=2400,Je=2401,Ye=2402,Xe=3200,Ze=`srgb`,Qe=`srgb-linear`,$e=`linear`,et=`srgb`,tt=7680,nt=35044,rt=35048,it=2e3;function at(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function ot(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function st(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function ct(){let e=st(`canvas`);return e.style.display=`block`,e}var lt={};function ut(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function dt(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function B(...e){e=dt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function V(...e){e=dt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function ft(...e){let t=e.join(` `);t in lt||(lt[t]=!0,B(...e))}function pt(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var mt={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},ht=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},gt=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),_t=1234567,vt=Math.PI/180,yt=180/Math.PI;function bt(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(gt[e&255]+gt[e>>8&255]+gt[e>>16&255]+gt[e>>24&255]+`-`+gt[t&255]+gt[t>>8&255]+`-`+gt[t>>16&15|64]+gt[t>>24&255]+`-`+gt[n&63|128]+gt[n>>8&255]+`-`+gt[n>>16&255]+gt[n>>24&255]+gt[r&255]+gt[r>>8&255]+gt[r>>16&255]+gt[r>>24&255]).toLowerCase()}function H(e,t,n){return Math.max(t,Math.min(n,e))}function xt(e,t){return(e%t+t)%t}function St(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function Ct(e,t,n){return e===t?0:(n-e)/(t-e)}function wt(e,t,n){return(1-n)*e+n*t}function Tt(e,t,n,r){return wt(e,t,1-Math.exp(-n*r))}function Et(e,t=1){return t-Math.abs(xt(e,t*2)-t)}function Dt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function Ot(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function kt(e,t){return e+Math.floor(Math.random()*(t-e+1))}function At(e,t){return e+Math.random()*(t-e)}function jt(e){return e*(.5-Math.random())}function Mt(e){e!==void 0&&(_t=e);let t=_t+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Nt(e){return e*vt}function Pt(e){return e*yt}function Ft(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function It(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function Lt(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function Rt(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:B(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function zt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function Bt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var Vt={DEG2RAD:vt,RAD2DEG:yt,generateUUID:bt,clamp:H,euclideanModulo:xt,mapLinear:St,inverseLerp:Ct,lerp:wt,damp:Tt,pingpong:Et,smoothstep:Dt,smootherstep:Ot,randInt:kt,randFloat:At,randFloatSpread:jt,seededRandom:Mt,degToRad:Nt,radToDeg:Pt,isPowerOfTwo:Ft,ceilPowerOfTwo:It,floorPowerOfTwo:Lt,setQuaternionFromProperEuler:Rt,normalize:Bt,denormalize:zt},U=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=H(this.x,e.x,t.x),this.y=H(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=H(this.x,e,t),this.y=H(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(H(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(H(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ht=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:B(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(H(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},W=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Wt.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Wt.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=H(this.x,e.x,t.x),this.y=H(this.y,e.y,t.y),this.z=H(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=H(this.x,e,t),this.y=H(this.y,e,t),this.z=H(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(H(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ut.copy(this).projectOnVector(e),this.sub(Ut)}reflect(e){return this.sub(Ut.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(H(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Ut=new W,Wt=new Ht,G=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return ft(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Gt.makeScale(e,t)),this}rotate(e){return ft(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Gt.makeRotation(-e)),this}translate(e,t){return ft(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Gt.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Gt=new G,Kt=new G().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),qt=new G().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Jt(){let e={enabled:!0,workingColorSpace:Qe,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n?e:(this.spaces[t].transfer===`srgb`&&(e.r=Yt(e.r),e.g=Yt(e.g),e.b=Yt(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Xt(e.r),e.g=Xt(e.g),e.b=Xt(e.b)),e)},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?$e:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return ft(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return ft(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[Qe]:{primaries:t,whitePoint:r,transfer:$e,toXYZ:Kt,fromXYZ:qt,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Ze},outputColorSpaceConfig:{drawingBufferColorSpace:Ze}},[Ze]:{primaries:t,whitePoint:r,transfer:et,toXYZ:Kt,fromXYZ:qt,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Ze}}}),e}var K=Jt();function Yt(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Xt(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var Zt,Qt=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Zt===void 0&&(Zt=st(`canvas`)),Zt.width=e.width,Zt.height=e.height;let t=Zt.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=Zt}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=st(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Yt(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Yt(t[e]/255)*255):t[e]=Yt(t[e]);return{data:t,width:e.width,height:e.height}}return B(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},$t=0,en=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:$t++}),this.uuid=bt(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(tn(r[t].image)):e.push(tn(r[t]))}else e=tn(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function tn(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Qt.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(B(`Texture: Unable to serialize Texture.`),{})}var nn=0,rn=new W,an=class e extends ht{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=g,i=g,a=x,o=C,s=ae,c=w,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:nn++}),this.uuid=bt(),this.name=``,this.source=new en(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new U(0,0),this.repeat=new U(1,1),this.center=new U(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new G,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(rn).x}get height(){return this.source.getSize(rn).y}get depth(){return this.source.getSize(rn).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){B(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){B(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case h:e.x-=Math.floor(e.x);break;case g:e.x=e.x<0?0:1;break;case _:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case h:e.y-=Math.floor(e.y);break;case g:e.y=e.y<0?0:1;break;case _:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};an.DEFAULT_IMAGE=null,an.DEFAULT_MAPPING=300,an.DEFAULT_ANISOTROPY=1;var on=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=H(this.x,e.x,t.x),this.y=H(this.y,e.y,t.y),this.z=H(this.z,e.z,t.z),this.w=H(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=H(this.x,e,t),this.y=H(this.y,e,t),this.z=H(this.z,e,t),this.w=H(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(H(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},sn=class extends ht{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:x,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new on(0,0,e,t),this.scissorTest=!1,this.viewport=new on(0,0,e,t),this.textures=[];let r=new an({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:x,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new en(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},cn=class extends sn{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},ln=class extends an{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=v,this.minFilter=v,this.wrapR=g,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},un=class extends an{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=v,this.minFilter=v,this.wrapR=g,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},q=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/dn.setFromMatrixColumn(e,0).length(),i=1/dn.setFromMatrixColumn(e,1).length(),a=1/dn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(pn,e,mn)}lookAt(e,t,n){let r=this.elements;return _n.subVectors(e,t),_n.lengthSq()===0&&(_n.z=1),_n.normalize(),hn.crossVectors(n,_n),hn.lengthSq()===0&&(Math.abs(n.z)===1?_n.x+=1e-4:_n.z+=1e-4,_n.normalize(),hn.crossVectors(n,_n)),hn.normalize(),gn.crossVectors(_n,hn),r[0]=hn.x,r[4]=gn.x,r[8]=_n.x,r[1]=hn.y,r[5]=gn.y,r[9]=_n.y,r[2]=hn.z,r[6]=gn.z,r[10]=_n.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],ee=r[14],M=r[3],te=r[7],N=r[11],ne=r[15];return i[0]=a*x+o*T+s*k+c*M,i[4]=a*S+o*E+s*A+c*te,i[8]=a*C+o*D+s*j+c*N,i[12]=a*w+o*O+s*ee+c*ne,i[1]=l*x+u*T+d*k+f*M,i[5]=l*S+u*E+d*A+f*te,i[9]=l*C+u*D+d*j+f*N,i[13]=l*w+u*O+d*ee+f*ne,i[2]=p*x+m*T+h*k+g*M,i[6]=p*S+m*E+h*A+g*te,i[10]=p*C+m*D+h*j+g*N,i[14]=p*w+m*O+h*ee+g*ne,i[3]=_*x+v*T+y*k+b*M,i[7]=_*S+v*E+y*A+b*te,i[11]=_*C+v*D+y*j+b*N,i[15]=_*w+v*O+y*ee+b*ne,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=dn.set(r[0],r[1],r[2]).length(),o=dn.set(r[4],r[5],r[6]).length(),s=dn.set(r[8],r[9],r[10]).length();i<0&&(a=-a),fn.copy(this);let c=1/a,l=1/o,u=1/s;return fn.elements[0]*=c,fn.elements[1]*=c,fn.elements[2]*=c,fn.elements[4]*=l,fn.elements[5]*=l,fn.elements[6]*=l,fn.elements[8]*=u,fn.elements[9]*=u,fn.elements[10]*=u,t.setFromRotationMatrix(fn),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=it,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=it,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},dn=new W,fn=new q,pn=new W(0,0,0),mn=new W(1,1,1),hn=new W,gn=new W,_n=new W,vn=new q,yn=new Ht,bn=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(H(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-H(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(H(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-H(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(H(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-H(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:B(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return vn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(vn,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return yn.setFromEuler(this),this.setFromQuaternion(yn,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};bn.DEFAULT_ORDER=`XYZ`;var xn=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&(1<<e|0))}},Sn=0,Cn=new W,wn=new Ht,Tn=new q,En=new W,Dn=new W,On=new W,kn=new Ht,An=new W(1,0,0),jn=new W(0,1,0),Mn=new W(0,0,1),Nn={type:`added`},Pn={type:`removed`},Fn={type:`childadded`,child:null},In={type:`childremoved`,child:null},Ln=class e extends ht{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Sn++}),this.uuid=bt(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new W,n=new bn,r=new Ht,i=new W(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new q},normalMatrix:{value:new G}}),this.matrix=new q,this.matrixWorld=new q,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new xn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return wn.setFromAxisAngle(e,t),this.quaternion.multiply(wn),this}rotateOnWorldAxis(e,t){return wn.setFromAxisAngle(e,t),this.quaternion.premultiply(wn),this}rotateX(e){return this.rotateOnAxis(An,e)}rotateY(e){return this.rotateOnAxis(jn,e)}rotateZ(e){return this.rotateOnAxis(Mn,e)}translateOnAxis(e,t){return Cn.copy(e).applyQuaternion(this.quaternion),this.position.add(Cn.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(An,e)}translateY(e){return this.translateOnAxis(jn,e)}translateZ(e){return this.translateOnAxis(Mn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Tn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?En.copy(e):En.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),Dn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Tn.lookAt(Dn,En,this.up):Tn.lookAt(En,Dn,this.up),this.quaternion.setFromRotationMatrix(Tn),r&&(Tn.extractRotation(r.matrixWorld),wn.setFromRotationMatrix(Tn),this.quaternion.premultiply(wn.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(V(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Nn),Fn.child=e,this.dispatchEvent(Fn),Fn.child=null):V(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Pn),In.child=e,this.dispatchEvent(In),In.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Tn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Tn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Tn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Nn),Fn.child=e,this.dispatchEvent(Fn),Fn.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Dn,e,On),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Dn,kn,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};Ln.DEFAULT_UP=new W(0,1,0),Ln.DEFAULT_MATRIX_AUTO_UPDATE=!0,Ln.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Rn=class extends Ln{constructor(){super(),this.isGroup=!0,this.type=`Group`}},zn={type:`move`},Bn=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Rn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Rn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new W,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new W),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Rn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new W,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new W,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(zn)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Rn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Vn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Hn={h:0,s:0,l:0},Un={h:0,s:0,l:0};function Wn(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var J=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ze){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,K.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=K.workingColorSpace){return this.r=e,this.g=t,this.b=n,K.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=K.workingColorSpace){if(e=xt(e,1),t=H(t,0,1),n=H(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Wn(i,r,e+1/3),this.g=Wn(i,r,e),this.b=Wn(i,r,e-1/3)}return K.colorSpaceToWorking(this,r),this}setStyle(e,t=Ze){function n(t){t!==void 0&&parseFloat(t)<1&&B(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:B(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);B(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ze){let n=Vn[e.toLowerCase()];return n===void 0?B(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Yt(e.r),this.g=Yt(e.g),this.b=Yt(e.b),this}copyLinearToSRGB(e){return this.r=Xt(e.r),this.g=Xt(e.g),this.b=Xt(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ze){return K.workingToColorSpace(Gn.copy(this),e),Math.round(H(Gn.r*255,0,255))*65536+Math.round(H(Gn.g*255,0,255))*256+Math.round(H(Gn.b*255,0,255))}getHexString(e=Ze){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=K.workingColorSpace){K.workingToColorSpace(Gn.copy(this),t);let n=Gn.r,r=Gn.g,i=Gn.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=K.workingColorSpace){return K.workingToColorSpace(Gn.copy(this),t),e.r=Gn.r,e.g=Gn.g,e.b=Gn.b,e}getStyle(e=Ze){K.workingToColorSpace(Gn.copy(this),e);let t=Gn.r,n=Gn.g,r=Gn.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(Hn),this.setHSL(Hn.h+e,Hn.s+t,Hn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Hn),e.getHSL(Un);let n=wt(Hn.h,Un.h,t),r=wt(Hn.s,Un.s,t),i=wt(Hn.l,Un.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Gn=new J;J.NAMES=Vn;var Kn=class e{constructor(e,t=1,n=1e3){this.isFog=!0,this.name=``,this.color=new J(e),this.near=t,this.far=n}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:`Fog`,name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},qn=class extends Ln{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new bn,this.environmentIntensity=1,this.environmentRotation=new bn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Jn=new W,Yn=new W,Xn=new W,Zn=new W,Qn=new W,$n=new W,er=new W,tr=new W,nr=new W,rr=new W,ir=new on,ar=new on,or=new on,sr=class e{constructor(e=new W,t=new W,n=new W){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Jn.subVectors(e,t),r.cross(Jn);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Jn.subVectors(r,t),Yn.subVectors(n,t),Xn.subVectors(e,t);let a=Jn.dot(Jn),o=Jn.dot(Yn),s=Jn.dot(Xn),c=Yn.dot(Yn),l=Yn.dot(Xn),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Zn)!==null&&Zn.x>=0&&Zn.y>=0&&Zn.x+Zn.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Zn)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Zn.x),s.addScaledVector(a,Zn.y),s.addScaledVector(o,Zn.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return ir.setScalar(0),ar.setScalar(0),or.setScalar(0),ir.fromBufferAttribute(e,t),ar.fromBufferAttribute(e,n),or.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(ir,i.x),a.addScaledVector(ar,i.y),a.addScaledVector(or,i.z),a}static isFrontFacing(e,t,n,r){return Jn.subVectors(n,t),Yn.subVectors(e,t),Jn.cross(Yn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Jn.subVectors(this.c,this.b),Yn.subVectors(this.a,this.b),Jn.cross(Yn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Qn.subVectors(r,n),$n.subVectors(i,n),tr.subVectors(e,n);let s=Qn.dot(tr),c=$n.dot(tr);if(s<=0&&c<=0)return t.copy(n);nr.subVectors(e,r);let l=Qn.dot(nr),u=$n.dot(nr);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(Qn,a);rr.subVectors(e,i);let f=Qn.dot(rr),p=$n.dot(rr);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector($n,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return er.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(er,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Qn,a).addScaledVector($n,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},cr=class{constructor(e=new W(1/0,1/0,1/0),t=new W(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ur.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ur.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=ur.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,ur):ur.fromBufferAttribute(r,t),ur.applyMatrix4(e.matrixWorld),this.expandByPoint(ur);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),dr.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),dr.copy(e.boundingBox)),dr.applyMatrix4(e.matrixWorld),this.union(dr)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ur),ur.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(vr),yr.subVectors(this.max,vr),fr.subVectors(e.a,vr),pr.subVectors(e.b,vr),mr.subVectors(e.c,vr),hr.subVectors(pr,fr),gr.subVectors(mr,pr),_r.subVectors(fr,mr);let t=[0,-hr.z,hr.y,0,-gr.z,gr.y,0,-_r.z,_r.y,hr.z,0,-hr.x,gr.z,0,-gr.x,_r.z,0,-_r.x,-hr.y,hr.x,0,-gr.y,gr.x,0,-_r.y,_r.x,0];return!Sr(t,fr,pr,mr,yr)||(t=[1,0,0,0,1,0,0,0,1],!Sr(t,fr,pr,mr,yr))?!1:(br.crossVectors(hr,gr),t=[br.x,br.y,br.z],Sr(t,fr,pr,mr,yr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ur).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ur).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(lr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),lr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),lr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),lr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),lr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),lr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),lr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),lr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(lr),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},lr=[new W,new W,new W,new W,new W,new W,new W,new W],ur=new W,dr=new cr,fr=new W,pr=new W,mr=new W,hr=new W,gr=new W,_r=new W,vr=new W,yr=new W,br=new W,xr=new W;function Sr(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){xr.fromArray(e,a);let o=i.x*Math.abs(xr.x)+i.y*Math.abs(xr.y)+i.z*Math.abs(xr.z),s=t.dot(xr),c=n.dot(xr),l=r.dot(xr);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var Cr=new W,wr=new U,Tr=0,Er=class extends ht{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Tr++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=nt,this.updateRanges=[],this.gpuType=A,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)wr.fromBufferAttribute(this,t),wr.applyMatrix3(e),this.setXY(t,wr.x,wr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Cr.fromBufferAttribute(this,t),Cr.applyMatrix3(e),this.setXYZ(t,Cr.x,Cr.y,Cr.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Cr.fromBufferAttribute(this,t),Cr.applyMatrix4(e),this.setXYZ(t,Cr.x,Cr.y,Cr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Cr.fromBufferAttribute(this,t),Cr.applyNormalMatrix(e),this.setXYZ(t,Cr.x,Cr.y,Cr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Cr.fromBufferAttribute(this,t),Cr.transformDirection(e),this.setXYZ(t,Cr.x,Cr.y,Cr.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=zt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Bt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=zt(t,this.array)),t}setX(e,t){return this.normalized&&(t=Bt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=zt(t,this.array)),t}setY(e,t){return this.normalized&&(t=Bt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=zt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Bt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=zt(t,this.array)),t}setW(e,t){return this.normalized&&(t=Bt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Bt(t,this.array),n=Bt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Bt(t,this.array),n=Bt(n,this.array),r=Bt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=Bt(t,this.array),n=Bt(n,this.array),r=Bt(r,this.array),i=Bt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},Dr=class extends Er{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Or=class extends Er{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Y=class extends Er{constructor(e,t,n){super(new Float32Array(e),t,n)}},kr=new cr,Ar=new W,jr=new W,Mr=class{constructor(e=new W,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?kr.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ar.subVectors(e,this.center);let t=Ar.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(Ar,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(jr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ar.copy(e.center).add(jr)),this.expandByPoint(Ar.copy(e.center).sub(jr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Nr=0,Pr=new q,Fr=new Ln,Ir=new W,Lr=new cr,Rr=new cr,zr=new W,Br=class e extends ht{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Nr++}),this.uuid=bt(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(at(e)?Or:Dr)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new G().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Pr.makeRotationFromQuaternion(e),this.applyMatrix4(Pr),this}rotateX(e){return Pr.makeRotationX(e),this.applyMatrix4(Pr),this}rotateY(e){return Pr.makeRotationY(e),this.applyMatrix4(Pr),this}rotateZ(e){return Pr.makeRotationZ(e),this.applyMatrix4(Pr),this}translate(e,t,n){return Pr.makeTranslation(e,t,n),this.applyMatrix4(Pr),this}scale(e,t,n){return Pr.makeScale(e,t,n),this.applyMatrix4(Pr),this}lookAt(e){return Fr.lookAt(e),Fr.updateMatrix(),this.applyMatrix4(Fr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ir).negate(),this.translate(Ir.x,Ir.y,Ir.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new Y(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&B(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new cr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){V(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new W(-1/0,-1/0,-1/0),new W(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Lr.setFromBufferAttribute(n),this.morphTargetsRelative?(zr.addVectors(this.boundingBox.min,Lr.min),this.boundingBox.expandByPoint(zr),zr.addVectors(this.boundingBox.max,Lr.max),this.boundingBox.expandByPoint(zr)):(this.boundingBox.expandByPoint(Lr.min),this.boundingBox.expandByPoint(Lr.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&V(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Mr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){V(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new W,1/0);return}if(e){let n=this.boundingSphere.center;if(Lr.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Rr.setFromBufferAttribute(n),this.morphTargetsRelative?(zr.addVectors(Lr.min,Rr.min),Lr.expandByPoint(zr),zr.addVectors(Lr.max,Rr.max),Lr.expandByPoint(zr)):(Lr.expandByPoint(Rr.min),Lr.expandByPoint(Rr.max))}Lr.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)zr.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(zr));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)zr.fromBufferAttribute(a,t),o&&(Ir.fromBufferAttribute(e,t),zr.add(Ir)),r=Math.max(r,n.distanceToSquared(zr))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&V(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){V(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new Er(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new W,s[e]=new W;let c=new W,l=new W,u=new W,d=new U,f=new U,p=new U,m=new W,h=new W;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new W,y=new W,b=new W,x=new W;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new Er(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new W,i=new W,a=new W,o=new W,s=new W,c=new W,l=new W,u=new W;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)zr.fromBufferAttribute(e,t),zr.normalize(),e.setXYZ(t,zr.x,zr.y,zr.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new Er(a,r,i)}if(this.index===null)return B(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},Vr=new W,Hr=new W,Ur=new G,Wr=class{constructor(e=new W(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Vr.subVectors(n,t).cross(Hr.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Vr),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Ur.getNormalMatrix(e),r=this.coplanarPoint(Vr).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Gr=0,Kr=class extends ht{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Gr++}),this.uuid=bt(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new J(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=tt,this.stencilZFail=tt,this.stencilZPass=tt,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){B(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){B(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new J().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new Wr().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new U().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new U().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},qr=new W,Jr=new W,Yr=new W,Xr=new W,Zr=class{constructor(e=new W,t=new W(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,qr)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=qr.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(qr.copy(this.origin).addScaledVector(this.direction,t),qr.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Jr.copy(e).add(t).multiplyScalar(.5),Yr.copy(t).sub(e).normalize(),Xr.copy(this.origin).sub(Jr);let i=e.distanceTo(t)*.5,a=-this.direction.dot(Yr),o=Xr.dot(this.direction),s=-Xr.dot(Yr),c=Xr.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Jr).addScaledVector(Yr,d),f}intersectSphere(e,t){if(e.radius<0)return null;qr.subVectors(e.center,this.origin);let n=qr.dot(this.direction),r=qr.dot(qr)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,qr)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,j,ee,M;if(y>=b&&y>=x?(w=s,D=u,A=p,M=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,j=_,ee=v):(S=l,C=c,T=f,E=d,O=h,k=m,j=v,ee=_)):b>=x?(w=c,D=d,A=m,M=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,j=v,ee=g):(S=s,C=l,T=u,E=f,O=p,k=h,j=g,ee=v)):(w=l,D=f,A=h,M=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,j=g,ee=_):(S=c,C=s,T=d,E=u,O=m,k=p,j=_,ee=g)),w===0)return null;let te=S/w,N=C/w,ne=1/w,re=T-te*D,ie=E-N*D,ae=O-te*A,oe=k-N*A,P=j-te*M,se=ee-N*M,ce=P*oe-se*ae,F=re*se-ie*P,le=ae*ie-oe*re;if(r){if(ce<0||F<0||le<0)return null}else if((ce<0||F<0||le<0)&&(ce>0||F>0||le>0))return null;let ue=ce+F+le;if(ue===0)return null;let de=ne*(ce*D+F*A+le*M);return(ue>0?de<0:de>0)?null:this.at(de/ue,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Qr=class extends Kr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new J(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},$r=new q,ei=new Zr,ti=new Mr,ni=new W,ri=new W,ii=new W,ai=new W,oi=new W,si=new W,ci=new W,li=new W,X=class extends Ln{constructor(e=new Br,t=new Qr){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){si.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(oi.fromBufferAttribute(s,e),a?si.addScaledVector(oi,r):si.addScaledVector(oi.sub(t),r))}t.add(si)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ti.copy(n.boundingSphere),ti.applyMatrix4(i),ei.copy(e.ray).recast(e.near),!(ti.containsPoint(ei.origin)===!1&&(ei.intersectSphere(ti,ni)===null||ei.origin.distanceToSquared(ni)>(e.far-e.near)**2))&&($r.copy(i).invert(),ei.copy(e.ray).applyMatrix4($r),(n.boundingBox===null||ei.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,ei)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=di(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=di(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=di(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=di(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function ui(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;li.copy(s),li.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(li);return l<n.near||l>n.far?null:{distance:l,point:li.clone(),object:e}}function di(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,ri),e.getVertexPosition(c,ii),e.getVertexPosition(l,ai);let u=ui(e,t,n,r,ri,ii,ai,ci);if(u){let e=new W;sr.getBarycoord(ci,ri,ii,ai,e),i&&(u.uv=sr.getInterpolatedAttribute(i,s,c,l,e,new U)),a&&(u.uv1=sr.getInterpolatedAttribute(a,s,c,l,e,new U)),o&&(u.normal=sr.getInterpolatedAttribute(o,s,c,l,e,new W),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new W,materialIndex:0};sr.getNormal(ri,ii,ai,t.normal),u.face=t,u.barycoord=e}return u}var fi=class extends an{constructor(e=null,t=1,n=1,r,i,a,o,s,c=v,l=v,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},pi=class extends Er{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},mi=new q,hi=new q,gi=[],_i=new cr,vi=new q,yi=new X,bi=new Mr,xi=class extends X{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new pi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,vi)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new cr),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,mi),_i.copy(e.boundingBox).applyMatrix4(mi),this.boundingBox.union(_i)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Mr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,mi),bi.copy(e.boundingSphere).applyMatrix4(mi),this.boundingSphere.union(bi)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(yi.geometry=this.geometry,yi.material=this.material,yi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),bi.copy(this.boundingSphere),bi.applyMatrix4(n),e.ray.intersectsSphere(bi)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,mi),hi.multiplyMatrices(n,mi),yi.matrixWorld=hi,yi.raycast(e,gi);for(let e=0,n=gi.length;e<n;e++){let n=gi[e];n.instanceId=i,n.object=this,t.push(n)}gi.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new pi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new fi(new Float32Array(r*this.count),r,this.count,se,A));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Si=new Mr,Ci=new U(.5,.5),wi=new W,Ti=class{constructor(e=new Wr,t=new Wr,n=new Wr,r=new Wr,i=new Wr,a=new Wr){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=it,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Si.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Si.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Si)}intersectsSprite(e){return Si.center.set(0,0,0),Si.radius=.7071067811865476+Ci.distanceTo(e.center),Si.applyMatrix4(e.matrixWorld),this.intersectsSphere(Si)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(wi.x=r.normal.x>0?e.max.x:e.min.x,wi.y=r.normal.y>0?e.max.y:e.min.y,wi.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(wi)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Ei=class extends an{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Di=class extends an{constructor(e,t,n=k,r,i,a,o=v,s=v,c,l=oe,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new en(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Oi=class extends Di{constructor(e,t=k,n=301,r,i,a=v,o=v,s,c=oe){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},ki=class extends an{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Ai=class e extends Br{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new Y(c,3)),this.setAttribute(`normal`,new Y(l,3)),this.setAttribute(`uv`,new Y(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new W;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},ji=class e extends Br{constructor(e=1,t=1,n=4,r=8,i=1){super(),this.type=`CapsuleGeometry`,this.parameters={radius:e,height:t,capSegments:n,radialSegments:r,heightSegments:i},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),r=Math.max(3,Math.floor(r)),i=Math.max(1,Math.floor(i));let a=[],o=[],s=[],c=[],l=t/2,u=Math.PI/2*e,d=t,f=2*u+d,p=n*2+i,m=r+1,h=new W,g=new W;for(let _=0;_<=p;_++){let v=0,y=0,b=0,x=0;if(_<=n){let t=_/n,r=t*Math.PI/2;y=-l-e*Math.cos(r),b=e*Math.sin(r),x=-e*Math.cos(r),v=t*u}else if(_<=n+i){let r=(_-n)/i;y=-l+r*t,b=e,x=0,v=u+r*d}else{let t=(_-n-i)/n,r=t*Math.PI/2;y=l+e*Math.sin(r),b=e*Math.cos(r),x=e*Math.sin(r),v=u+d+t*u}let S=Math.max(0,Math.min(1,v/f)),C=0;_===0?C=.5/r:_===p&&(C=-.5/r);for(let e=0;e<=r;e++){let t=e/r,n=t*Math.PI*2,i=Math.sin(n),a=Math.cos(n);g.x=-b*a,g.y=y,g.z=b*i,o.push(g.x,g.y,g.z),h.set(-b*a,x,b*i),h.normalize(),s.push(h.x,h.y,h.z),c.push(t+C,S)}if(_>0){let e=(_-1)*m;for(let t=0;t<r;t++){let n=e+t,r=e+t+1,i=_*m+t,o=_*m+t+1;a.push(n,r,i),a.push(r,o,i)}}}this.setIndex(a),this.setAttribute(`position`,new Y(o,3)),this.setAttribute(`normal`,new Y(s,3)),this.setAttribute(`uv`,new Y(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},Mi=class e extends Br{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new W,l=new U;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new Y(a,3)),this.setAttribute(`normal`,new Y(o,3)),this.setAttribute(`uv`,new Y(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Z=class e extends Br{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new Y(u,3)),this.setAttribute(`normal`,new Y(d,3)),this.setAttribute(`uv`,new Y(f,2));function _(){let a=new W,_=new W,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new U,m=new W,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ni=class e extends Z{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Pi=class e extends Br{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new Y(i,3)),this.setAttribute(`normal`,new Y(i.slice(),3)),this.setAttribute(`uv`,new Y(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new W,r=new W,i=new W;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new W;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new W;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new W,t=new W,n=new W,r=new W,o=new U,s=new U,c=new U;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},Fi=class e extends Pi{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=1/n,i=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-n,0,-r,n,0,r,-n,0,r,n,-r,-n,0,-r,n,0,r,-n,0,r,n,0,-n,0,-r,n,0,-r,-n,0,r,n,0,r];super(i,[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9],e,t),this.type=`DodecahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},Ii=class e extends Pi{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},Li=class e extends Pi{constructor(e=1,t=0){super([1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],e,t),this.type=`OctahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},Ri=class e extends Br{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new Y(p,3)),this.setAttribute(`normal`,new Y(m,3)),this.setAttribute(`uv`,new Y(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},zi=class e extends Br{constructor(e=.5,t=1,n=32,r=1,i=0,a=Math.PI*2){super(),this.type=`RingGeometry`,this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:i,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);let o=[],s=[],c=[],l=[],u=e,d=(t-e)/r,f=new W,p=new U;for(let e=0;e<=r;e++){for(let e=0;e<=n;e++){let r=i+e/n*a;f.x=u*Math.cos(r),f.y=u*Math.sin(r),s.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,l.push(p.x,p.y)}u+=d}for(let e=0;e<r;e++){let t=e*(n+1);for(let e=0;e<n;e++){let r=e+t,i=r,a=r+n+1,s=r+n+2,c=r+1;o.push(i,a,c),o.push(a,s,c)}}this.setIndex(o),this.setAttribute(`position`,new Y(s,3)),this.setAttribute(`normal`,new Y(c,3)),this.setAttribute(`uv`,new Y(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},Bi=class e extends Br{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new W,d=new W,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new Y(p,3)),this.setAttribute(`normal`,new Y(m,3)),this.setAttribute(`uv`,new Y(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},Vi=class e extends Br{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2,a=0,o=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);let s=[],c=[],l=[],u=[],d=new W,f=new W,p=new W;for(let s=0;s<=n;s++){let m=a+s/n*o;for(let a=0;a<=r;a++){let o=a/r*i;f.x=(e+t*Math.cos(m))*Math.cos(o),f.y=(e+t*Math.cos(m))*Math.sin(o),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(o),d.y=e*Math.sin(o),p.subVectors(f,d).normalize(),l.push(p.x,p.y,p.z),u.push(a/r),u.push(s/n)}}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,a=(r+1)*(e-1)+t,o=(r+1)*e+t;s.push(n,i,o),s.push(i,a,o)}this.setIndex(s),this.setAttribute(`position`,new Y(c,3)),this.setAttribute(`normal`,new Y(l,3)),this.setAttribute(`uv`,new Y(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};function Hi(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(Wi(i))i.isRenderTargetTexture?(B(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(Wi(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function Ui(e){let t={};for(let n=0;n<e.length;n++){let r=Hi(e[n]);for(let e in r)t[e]=r[e]}return t}function Wi(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function Gi(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function Ki(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:K.workingColorSpace}var qi={clone:Hi,merge:Ui},Ji=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Yi=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Xi=class extends Kr{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ji,this.fragmentShader=Yi,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Hi(e.uniforms),this.uniformsGroups=Gi(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new J().setHex(r.value);break;case`v2`:this.uniforms[n].value=new U().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new W().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new on().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new G().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new q().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Zi=class extends Xi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Qi=class extends Kr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new J(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new J(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new U(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},$i=class extends Kr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Xe,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},ea=class extends Kr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function ta(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function na(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var ra=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},ia=class extends ra{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:qe,endingEnd:qe}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Je:i=e,o=2*t-n;break;case Ye:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Je:a=e,s=2*n-t;break;case Ye:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},aa=class extends ra{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},oa=class extends ra{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},sa=class extends ra{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=ua(n,t,g,y,r);i[p]=ca(x,o,_,b,m)}return i}};function ca(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function la(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function ua(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=ca(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=la(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var da=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=ta(t,this.TimeBufferType),this.values=ta(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:ta(e.times,Array),values:ta(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),na(e.settings)&&(n.settings={inTangents:ta(e.settings.inTangents,Array),outTangents:ta(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new oa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new aa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ia(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new sa(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Ue:t=this.InterpolantFactoryMethodDiscrete;break;case We:t=this.InterpolantFactoryMethodLinear;break;case Ge:t=this.InterpolantFactoryMethodSmooth;break;case Ke:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return B(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ue;case this.InterpolantFactoryMethodLinear:return We;case this.InterpolantFactoryMethodSmooth:return Ge;case this.InterpolantFactoryMethodBezier:return Ke}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;na(this.settings)&&(fa(this.settings.inTangents,e),fa(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(V(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(V(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){V(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){V(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&ot(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){V(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Ge,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,na(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function fa(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}da.prototype.ValueTypeName=``,da.prototype.TimeBufferType=Float32Array,da.prototype.ValueBufferType=Float32Array,da.prototype.DefaultInterpolation=We;var pa=class extends da{constructor(e,t,n){super(e,t,n)}};pa.prototype.ValueTypeName=`bool`,pa.prototype.ValueBufferType=Array,pa.prototype.DefaultInterpolation=Ue,pa.prototype.InterpolantFactoryMethodLinear=void 0,pa.prototype.InterpolantFactoryMethodSmooth=void 0;var ma=class extends da{constructor(e,t,n,r){super(e,t,n,r)}};ma.prototype.ValueTypeName=`color`;var ha=class extends da{constructor(e,t,n,r){super(e,t,n,r)}};ha.prototype.ValueTypeName=`number`;var ga=class extends ra{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)Ht.slerpFlat(i,0,a,c-o,a,c,s);return i}},_a=class extends da{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new ga(this.times,this.values,this.getValueSize(),e)}};_a.prototype.ValueTypeName=`quaternion`,_a.prototype.InterpolantFactoryMethodSmooth=void 0;var va=class extends da{constructor(e,t,n){super(e,t,n)}};va.prototype.ValueTypeName=`string`,va.prototype.ValueBufferType=Array,va.prototype.DefaultInterpolation=Ue,va.prototype.InterpolantFactoryMethodLinear=void 0,va.prototype.InterpolantFactoryMethodSmooth=void 0;var ya=class extends da{constructor(e,t,n,r){super(e,t,n,r)}};ya.prototype.ValueTypeName=`vector`;var ba=class extends Ln{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new J(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},xa=class extends ba{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(Ln.DEFAULT_UP),this.updateMatrix(),this.groundColor=new J(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Sa=new q,Ca=new W,wa=new W,Ta=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new U(512,512),this.mapType=w,this.map=null,this.mapPass=null,this.matrix=new q,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ti,this._frameExtents=new U(1,1),this._viewportCount=1,this._viewports=[new on(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Ca.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ca),wa.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(wa),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){Sa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Sa,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Sa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Ea=new W,Da=new Ht,Oa=new W,ka=class extends Ln{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new q,this.projectionMatrix=new q,this.projectionMatrixInverse=new q,this.coordinateSystem=it,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Ea,Da,Oa),Oa.x===1&&Oa.y===1&&Oa.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ea,Da,Oa.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Ea,Da,Oa),Oa.x===1&&Oa.y===1&&Oa.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ea,Da,Oa.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Aa=new W,ja=new U,Ma=new U,Na=class extends ka{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=yt*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(vt*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return yt*2*Math.atan(Math.tan(vt*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Aa.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Aa.x,Aa.y).multiplyScalar(-e/Aa.z),Aa.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Aa.x,Aa.y).multiplyScalar(-e/Aa.z)}getViewSize(e,t){return this.getViewBounds(e,ja,Ma),t.subVectors(Ma,ja)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(vt*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Pa=class extends Ta{constructor(){super(new Na(90,1,.5,500)),this.isPointLightShadow=!0}},Fa=class extends ba{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new Pa}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Ia=class extends ka{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},La=class extends Ta{constructor(){super(new Ia(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ra=class extends ba{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(Ln.DEFAULT_UP),this.updateMatrix(),this.target=new Ln,this.shadow=new La}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},za=-90,Ba=1,Va=class extends Ln{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Na(za,Ba,e,t);r.layers=this.layers,this.add(r);let i=new Na(za,Ba,e,t);i.layers=this.layers,this.add(i);let a=new Na(za,Ba,e,t);a.layers=this.layers,this.add(a);let o=new Na(za,Ba,e,t);o.layers=this.layers,this.add(o);let s=new Na(za,Ba,e,t);s.layers=this.layers,this.add(s);let c=new Na(za,Ba,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Ha=class extends Na{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Ua=`\\[\\]\\.:\\/`,Wa=RegExp(`[\\[\\]\\.:\\/]`,`g`),Ga=`[^\\[\\]\\.:\\/]`,Ka=`[^`+Ua.replace(`\\.`,``)+`]`,qa=`((?:WC+[\\/:])*)`.replace(`WC`,Ga),Ja=`(WCOD+)?`.replace(`WCOD`,Ka),Ya=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,Ga),Xa=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,Ga),Za=RegExp(`^`+qa+Ja+Ya+Xa+`$`),Qa=[`material`,`materials`,`bones`,`map`],$a=class{constructor(e,t,n){let r=n||eo.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},eo=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Wa,``)}static parseTrackName(e){let t=Za.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Qa.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){B(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){V(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){V(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){V(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){V(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){V(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){V(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){V(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;V(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){V(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){V(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};eo.Composite=$a,eo.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},eo.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},eo.prototype.GetterByBindingType=[eo.prototype._getValue_direct,eo.prototype._getValue_array,eo.prototype._getValue_arrayElement,eo.prototype._getValue_toArray],eo.prototype.SetterByBindingTypeAndVersioning=[[eo.prototype._setValue_direct,eo.prototype._setValue_direct_setNeedsUpdate,eo.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[eo.prototype._setValue_array,eo.prototype._setValue_array_setNeedsUpdate,eo.prototype._setValue_array_setMatrixWorldNeedsUpdate],[eo.prototype._setValue_arrayElement,eo.prototype._setValue_arrayElement_setNeedsUpdate,eo.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[eo.prototype._setValue_fromArray,eo.prototype._setValue_fromArray_setNeedsUpdate,eo.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var to=new q,no=class{constructor(e,t,n=0,r=1/0){this.ray=new Zr(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new xn,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):V(`Raycaster: Unsupported camera type: `+t.type)}setFromXRController(e){return to.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(to),this}intersectObject(e,t=!0,n=[]){return io(e,this,n,t),n.sort(ro),n}intersectObjects(e,t=!0,n=[]){for(let r=0,i=e.length;r<i;r++)io(e[r],this,n,t);return n.sort(ro),n}};function ro(e,t){return e.distance-t.distance}function io(e,t,n,r){let i=!0;if(e.layers.test(t.layers)&&e.raycast(t,n)===!1&&(i=!1),i===!0&&r===!0){let r=e.children;for(let e=0,i=r.length;e<i;e++)io(r[e],t,n,!0)}}(class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}});function ao(e,t,n,r){let i=oo(r);switch(n){case re:return e*t;case se:return e*t/i.components*i.byteLength;case ce:return e*t/i.components*i.byteLength;case F:return e*t*2/i.components*i.byteLength;case le:return e*t*2/i.components*i.byteLength;case ie:return e*t*3/i.components*i.byteLength;case ae:return e*t*4/i.components*i.byteLength;case ue:return e*t*4/i.components*i.byteLength;case de:case fe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case pe:case me:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ge:case ve:return Math.max(e,16)*Math.max(t,8)/4;case he:case _e:return Math.max(e,8)*Math.max(t,8)/2;case ye:case be:case Se:case Ce:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case xe:case we:case Te:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Ee:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case De:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case Oe:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case ke:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case Ae:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case je:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case Me:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case I:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case Ne:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Pe:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Fe:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case L:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Ie:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case R:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case z:case Le:case Re:return Math.ceil(e/4)*Math.ceil(t/4)*16;case ze:case Be:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Ve:case He:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function oo(e){switch(e){case w:case T:return{byteLength:1,components:1};case D:case E:case j:return{byteLength:2,components:1};case ee:case M:return{byteLength:2,components:4};case k:case O:case A:return{byteLength:4,components:1};case N:case ne:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?B(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function so(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function co(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Q={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},$={common:{diffuse:{value:new J(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new G},alphaMap:{value:null},alphaMapTransform:{value:new G},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new G}},envmap:{envMap:{value:null},envMapRotation:{value:new G},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new G}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new G}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new G},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new G},normalScale:{value:new U(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new G},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new G}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new G}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new G}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new J(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new W},probesMax:{value:new W},probesResolution:{value:new W}},points:{diffuse:{value:new J(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new G},alphaTest:{value:0},uvTransform:{value:new G}},sprite:{diffuse:{value:new J(16777215)},opacity:{value:1},center:{value:new U(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new G},alphaMap:{value:null},alphaMapTransform:{value:new G},alphaTest:{value:0}}},lo={basic:{uniforms:Ui([$.common,$.specularmap,$.envmap,$.aomap,$.lightmap,$.fog]),vertexShader:Q.meshbasic_vert,fragmentShader:Q.meshbasic_frag},lambert:{uniforms:Ui([$.common,$.specularmap,$.envmap,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.fog,$.lights,{emissive:{value:new J(0)},envMapIntensity:{value:1}}]),vertexShader:Q.meshlambert_vert,fragmentShader:Q.meshlambert_frag},phong:{uniforms:Ui([$.common,$.specularmap,$.envmap,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.fog,$.lights,{emissive:{value:new J(0)},specular:{value:new J(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Q.meshphong_vert,fragmentShader:Q.meshphong_frag},standard:{uniforms:Ui([$.common,$.envmap,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.roughnessmap,$.metalnessmap,$.fog,$.lights,{emissive:{value:new J(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Q.meshphysical_vert,fragmentShader:Q.meshphysical_frag},toon:{uniforms:Ui([$.common,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.gradientmap,$.fog,$.lights,{emissive:{value:new J(0)}}]),vertexShader:Q.meshtoon_vert,fragmentShader:Q.meshtoon_frag},matcap:{uniforms:Ui([$.common,$.bumpmap,$.normalmap,$.displacementmap,$.fog,{matcap:{value:null}}]),vertexShader:Q.meshmatcap_vert,fragmentShader:Q.meshmatcap_frag},points:{uniforms:Ui([$.points,$.fog]),vertexShader:Q.points_vert,fragmentShader:Q.points_frag},dashed:{uniforms:Ui([$.common,$.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Q.linedashed_vert,fragmentShader:Q.linedashed_frag},depth:{uniforms:Ui([$.common,$.displacementmap]),vertexShader:Q.depth_vert,fragmentShader:Q.depth_frag},normal:{uniforms:Ui([$.common,$.bumpmap,$.normalmap,$.displacementmap,{opacity:{value:1}}]),vertexShader:Q.meshnormal_vert,fragmentShader:Q.meshnormal_frag},sprite:{uniforms:Ui([$.sprite,$.fog]),vertexShader:Q.sprite_vert,fragmentShader:Q.sprite_frag},background:{uniforms:{uvTransform:{value:new G},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Q.background_vert,fragmentShader:Q.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new G}},vertexShader:Q.backgroundCube_vert,fragmentShader:Q.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Q.cube_vert,fragmentShader:Q.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Q.equirect_vert,fragmentShader:Q.equirect_frag},distance:{uniforms:Ui([$.common,$.displacementmap,{referencePosition:{value:new W},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Q.distance_vert,fragmentShader:Q.distance_frag},shadow:{uniforms:Ui([$.lights,$.fog,{color:{value:new J(0)},opacity:{value:1}}]),vertexShader:Q.shadow_vert,fragmentShader:Q.shadow_frag}};lo.physical={uniforms:Ui([lo.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new G},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new G},clearcoatNormalScale:{value:new U(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new G},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new G},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new G},sheen:{value:0},sheenColor:{value:new J(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new G},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new G},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new G},transmissionSamplerSize:{value:new U},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new G},attenuationDistance:{value:0},attenuationColor:{value:new J(0)},specularColor:{value:new J(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new G},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new G},anisotropyVector:{value:new U},anisotropyMap:{value:null},anisotropyMapTransform:{value:new G}}]),vertexShader:Q.meshphysical_vert,fragmentShader:Q.meshphysical_frag};var uo={r:0,b:0,g:0},fo=new q,po=new G;po.set(-1,0,0,0,1,0,0,0,1);function mo(e,t,n,r,i,a){let o=new J(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new X(new Ai(1,1,1),new Xi({name:`BackgroundCubeMaterial`,uniforms:Hi(lo.backgroundCube.uniforms),vertexShader:lo.backgroundCube.vertexShader,fragmentShader:lo.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(fo.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(po),l.material.toneMapped=K.getTransfer(i.colorSpace)!==et,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new X(new Ri(2,2),new Xi({name:`BackgroundMaterial`,uniforms:Hi(lo.background.uniforms),vertexShader:lo.background.vertexShader,fragmentShader:lo.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=K.getTransfer(i.colorSpace)!==et,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(uo,Ki(e)),n.buffers.color.setClear(uo.r,uo.g,uo.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function ho(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function go(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function _o(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(B(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&B(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function vo(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Wr,s=new G,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var yo=4,bo=6,xo=20,So=256,Co=new Ia,wo=new J,To=null,Eo=0,Do=0,Oo=!1,ko=new W,Ao=new W,jo=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=ko}=i;To=this._renderer.getRenderTarget(),Eo=this._renderer.getActiveCubeFace(),Do=this._renderer.getActiveMipmapLevel(),Oo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ro(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Lo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(To,Eo,Do),this._renderer.xr.enabled=Oo,e.scissorTest=!1,Po(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),To=this._renderer.getRenderTarget(),Eo=this._renderer.getActiveCubeFace(),Do=this._renderer.getActiveMipmapLevel(),Oo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:x,minFilter:x,generateMipmaps:!1,type:j,format:ae,colorSpace:Qe,depthBuffer:!1},r=No(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=No(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Mo(r)),this._blurMaterial=Io(r,e,t),this._ggxMaterial=Fo(r,e,t)}return r}_compileMaterial(e){let t=new X(new Br,e);this._renderer.compile(t,Co)}_sceneToCubeUV(e,t,n,r,i){let a=new Na(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(wo),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new X(new Ai,new Qr({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(wo),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;Po(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ro()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Lo());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;Po(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Co)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-yo?n-d+yo:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,Po(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,Co),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,Po(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,Co)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];Po(t,3*l*(r>this._lodMax-yo?r-this._lodMax+yo:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,Co)}};function Mo(e){let t=[],n=[],r=e,i=e-yo+1+bo;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?Ao.set(1,r,n):e===1?Ao.set(-n,1,-r):e===2?Ao.set(-n,r,1):e===3?Ao.set(-1,r,-n):e===4?Ao.set(-n,-1,r):Ao.set(n,r,-1),Ao.toArray(l,(e*6+t)*3)}}let u=new Br;u.setAttribute(`position`,new Er(c,3)),u.setAttribute(`outputDirection`,new Er(l,3)),n.push(new X(u,null)),r>yo&&r--}return{lodMeshes:n,sizeLods:t}}function No(e,t,n){let r=new cn(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function Po(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function Fo(e,t,n){return new Xi({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:So,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:zo(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Io(e,t,n){return new Xi({name:`SphericalGaussianBlur`,defines:{SAMPLES:xo,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:zo(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Lo(){return new Xi({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:zo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ro(){return new Xi({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:zo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function zo(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Bo=class extends cn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Ei(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Ai(5,5,5),i=new Xi({name:`CubemapFromEquirect`,uniforms:Hi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new X(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=x),new Va(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function Vo(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new Bo(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new jo(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new jo(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function Ho(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&ft(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Uo(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?Or:Dr)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function Wo(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Go(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:V(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function Ko(e,t,n){let r=new WeakMap,i=new on;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new ln(h,p,m,u);g.type=A,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new U(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function qo(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var Jo={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function Yo(e,t,n,r,i,a){let o=new cn(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new Br;l.setAttribute(`position`,new Y([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new Y([0,2,0,0,2,0],2));let u=new Zi({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new X(l,u),f=new Ia(-1,1,1,-1,0,1),p=null,m=null,h=!1,g,_=null,v=[],y=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<v.length;n++){let r=v[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){v=e,y=v.length>0&&v[0].isRenderPass===!0;let t=o.width,n=o.height;v.length>0&&s===null&&(s=new cn(t,n,{type:j,depthBuffer:!1,stencilBuffer:!1}),c=new cn(t,n,{type:j,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<v.length;e++){let r=v[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&v.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return y===!1&&e.setRenderTarget(o),g=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return y},this.end=function(e,t){e.toneMapping=g,h=!0;let n=o,r=s;for(let i=0;i<v.length;i++){let a=v[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},K.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=Jo[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(d,f),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var Xo=new an,Zo=new Di(1,1),Qo=new ln,$o=new un,es=new Ei,ts=[],ns=[],rs=new Float32Array(16),is=new Float32Array(9),as=new Float32Array(4);function os(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=ts[i];if(a===void 0&&(a=new Float32Array(i),ts[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function ss(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function cs(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function ls(e,t){let n=ns[t];n===void 0&&(n=new Int32Array(t),ns[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function us(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function ds(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(ss(n,t))return;e.uniform2fv(this.addr,t),cs(n,t)}}function fs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(ss(n,t))return;e.uniform3fv(this.addr,t),cs(n,t)}}function ps(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(ss(n,t))return;e.uniform4fv(this.addr,t),cs(n,t)}}function ms(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(ss(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),cs(n,t)}else{if(ss(n,r))return;as.set(r),e.uniformMatrix2fv(this.addr,!1,as),cs(n,r)}}function hs(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(ss(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),cs(n,t)}else{if(ss(n,r))return;is.set(r),e.uniformMatrix3fv(this.addr,!1,is),cs(n,r)}}function gs(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(ss(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),cs(n,t)}else{if(ss(n,r))return;rs.set(r),e.uniformMatrix4fv(this.addr,!1,rs),cs(n,r)}}function _s(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function vs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(ss(n,t))return;e.uniform2iv(this.addr,t),cs(n,t)}}function ys(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(ss(n,t))return;e.uniform3iv(this.addr,t),cs(n,t)}}function bs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(ss(n,t))return;e.uniform4iv(this.addr,t),cs(n,t)}}function xs(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Ss(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(ss(n,t))return;e.uniform2uiv(this.addr,t),cs(n,t)}}function Cs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(ss(n,t))return;e.uniform3uiv(this.addr,t),cs(n,t)}}function ws(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(ss(n,t))return;e.uniform4uiv(this.addr,t),cs(n,t)}}function Ts(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(Zo.compareFunction=n.isReversedDepthBuffer()?518:515,a=Zo):a=Xo,n.setTexture2D(t||a,i)}function Es(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||$o,i)}function Ds(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||es,i)}function Os(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Qo,i)}function ks(e){switch(e){case 5126:return us;case 35664:return ds;case 35665:return fs;case 35666:return ps;case 35674:return ms;case 35675:return hs;case 35676:return gs;case 5124:case 35670:return _s;case 35667:case 35671:return vs;case 35668:case 35672:return ys;case 35669:case 35673:return bs;case 5125:return xs;case 36294:return Ss;case 36295:return Cs;case 36296:return ws;case 35678:case 36198:case 36298:case 36306:case 35682:return Ts;case 35679:case 36299:case 36307:return Es;case 35680:case 36300:case 36308:case 36293:return Ds;case 36289:case 36303:case 36311:case 36292:return Os}}function As(e,t){e.uniform1fv(this.addr,t)}function js(e,t){let n=os(t,this.size,2);e.uniform2fv(this.addr,n)}function Ms(e,t){let n=os(t,this.size,3);e.uniform3fv(this.addr,n)}function Ns(e,t){let n=os(t,this.size,4);e.uniform4fv(this.addr,n)}function Ps(e,t){let n=os(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function Fs(e,t){let n=os(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function Is(e,t){let n=os(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function Ls(e,t){e.uniform1iv(this.addr,t)}function Rs(e,t){e.uniform2iv(this.addr,t)}function zs(e,t){e.uniform3iv(this.addr,t)}function Bs(e,t){e.uniform4iv(this.addr,t)}function Vs(e,t){e.uniform1uiv(this.addr,t)}function Hs(e,t){e.uniform2uiv(this.addr,t)}function Us(e,t){e.uniform3uiv(this.addr,t)}function Ws(e,t){e.uniform4uiv(this.addr,t)}function Gs(e,t,n){let r=this.cache,i=t.length,a=ls(n,i);ss(r,a)||(e.uniform1iv(this.addr,a),cs(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?Zo:Xo;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function Ks(e,t,n){let r=this.cache,i=t.length,a=ls(n,i);ss(r,a)||(e.uniform1iv(this.addr,a),cs(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||$o,a[e])}function qs(e,t,n){let r=this.cache,i=t.length,a=ls(n,i);ss(r,a)||(e.uniform1iv(this.addr,a),cs(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||es,a[e])}function Js(e,t,n){let r=this.cache,i=t.length,a=ls(n,i);ss(r,a)||(e.uniform1iv(this.addr,a),cs(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Qo,a[e])}function Ys(e){switch(e){case 5126:return As;case 35664:return js;case 35665:return Ms;case 35666:return Ns;case 35674:return Ps;case 35675:return Fs;case 35676:return Is;case 5124:case 35670:return Ls;case 35667:case 35671:return Rs;case 35668:case 35672:return zs;case 35669:case 35673:return Bs;case 5125:return Vs;case 36294:return Hs;case 36295:return Us;case 36296:return Ws;case 35678:case 36198:case 36298:case 36306:case 35682:return Gs;case 35679:case 36299:case 36307:return Ks;case 35680:case 36300:case 36308:case 36293:return qs;case 36289:case 36303:case 36311:case 36292:return Js}}var Xs=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=ks(t.type)}},Zs=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ys(t.type)}},Qs=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},$s=/(\w+)(\])?(\[|\.)?/g;function ec(e,t){e.seq.push(t),e.map[t.id]=t}function tc(e,t,n){let r=e.name,i=r.length;for($s.lastIndex=0;;){let a=$s.exec(r),o=$s.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){ec(n,l===void 0?new Xs(s,e,t):new Zs(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new Qs(s),ec(n,e)),n=e}}}var nc=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);tc(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function rc(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var ic=37297,ac=0;function oc(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var sc=new G;function cc(e){K._getMatrix(sc,K.workingColorSpace,e);let t=`mat3( ${sc.elements.map(e=>e.toFixed(4))} )`;switch(K.getTransfer(e)){case $e:return[t,`LinearTransferOETF`];case et:return[t,`sRGBTransferOETF`];default:return B(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function lc(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+oc(e.getShaderSource(t),r)}return i}function uc(e,t){let n=cc(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var dc={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function fc(e,t){let n=dc[t];return n===void 0?(B(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var pc=new W;function mc(){return K.getLuminanceCoefficients(pc),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${pc.x.toFixed(4)}, ${pc.y.toFixed(4)}, ${pc.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function hc(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(vc).join(`
`)}function gc(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function _c(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function vc(e){return e!==``}function yc(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function bc(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var xc=/^[ \t]*#include +<([\w\d./]+)>/gm;function Sc(e){return e.replace(xc,wc)}var Cc=new Map;function wc(e,t){let n=Q[t];if(n===void 0){let e=Cc.get(t);if(e!==void 0)n=Q[e],B(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return Sc(n)}var Tc=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ec(e){return e.replace(Tc,Dc)}function Dc(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Oc(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var kc={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function Ac(e){return kc[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var jc={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function Mc(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:jc[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var Nc={302:`ENVMAP_MODE_REFRACTION`};function Pc(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:Nc[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var Fc={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function Ic(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:Fc[e.combine]||`ENVMAP_BLENDING_NONE`}function Lc(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function Rc(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Ac(n),l=Mc(n),u=Pc(n),d=Ic(n),f=Lc(n),p=hc(n),m=gc(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(vc).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(vc).join(`
`),_.length>0&&(_+=`
`)):(g=[Oc(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(vc).join(`
`),_=[Oc(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Q.tonemapping_pars_fragment,n.toneMapping===0?``:fc(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Q.colorspace_pars_fragment,uc(`linearToOutputTexel`,n.outputColorSpace),mc(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(vc).join(`
`)),o=Sc(o),o=yc(o,n),o=bc(o,n),s=Sc(s),s=yc(s,n),s=bc(s,n),o=Ec(o),s=Ec(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=rc(i,i.VERTEX_SHADER,y),S=rc(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=lc(i,x,`vertex`),n=lc(i,S,`fragment`);V(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):B(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new nc(i,h),T=_c(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,ic)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=ac++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var zc=0,Bc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Vc(e),t.set(e,n)),n}},Vc=class{constructor(e){this.id=zc++,this.code=e,this.usedTimes=0}};function Hc(e){return e===1030||e===37490||e===36285}function Uc(e,t,n,r,i,a){let o=new xn,s=new Bc,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&B(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=lo[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,A=t.id}let j=e.getRenderTarget(),ee=e.state.buffers.depth.getReversed(),M=h.isInstancedMesh===!0,te=h.isBatchedMesh===!0,N=!!i.map,ne=!!i.matcap,re=!!x,ie=!!i.aoMap,ae=!!i.lightMap,oe=!!i.bumpMap&&i.wireframe===!1,P=!!i.normalMap,se=!!i.displacementMap,ce=!!i.emissiveMap,F=!!i.metalnessMap,le=!!i.roughnessMap,ue=i.anisotropy>0,de=i.clearcoat>0,fe=i.dispersion>0,pe=i.retroreflectivity>0,me=i.iridescence>0,he=i.sheen>0,ge=i.transmission>0,_e=ue&&!!i.anisotropyMap,ve=de&&!!i.clearcoatMap,ye=de&&!!i.clearcoatNormalMap,be=de&&!!i.clearcoatRoughnessMap,xe=me&&!!i.iridescenceMap,Se=me&&!!i.iridescenceThicknessMap,Ce=he&&!!i.sheenColorMap,we=he&&!!i.sheenRoughnessMap,Te=!!i.specularMap,Ee=!!i.specularColorMap,De=!!i.specularIntensityMap,Oe=ge&&!!i.transmissionMap,ke=ge&&!!i.thicknessMap,Ae=!!i.gradientMap,je=!!i.alphaMap,Me=i.alphaTest>0,I=!!i.alphaHash,Ne=!!i.extensions,Pe=0;i.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Pe=e.toneMapping);let Fe={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:te,batchingColor:te&&h._colorsTexture!==null,instancing:M,instancingColor:M&&h.instanceColor!==null,instancingMorph:M&&h.morphTexture!==null,outputColorSpace:j===null?e.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:K.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:N,matcap:ne,envMap:re,envMapMode:re&&x.mapping,envMapCubeUVHeight:S,aoMap:ie,lightMap:ae,bumpMap:oe,normalMap:P,displacementMap:se,emissiveMap:ce,normalMapObjectSpace:P&&i.normalMapType===1,normalMapTangentSpace:P&&i.normalMapType===0,packedNormalMap:P&&i.normalMapType===0&&Hc(i.normalMap.format),metalnessMap:F,roughnessMap:le,anisotropy:ue,anisotropyMap:_e,clearcoat:de,clearcoatMap:ve,clearcoatNormalMap:ye,clearcoatRoughnessMap:be,dispersion:fe,retroreflection:pe,iridescence:me,iridescenceMap:xe,iridescenceThicknessMap:Se,sheen:he,sheenColorMap:Ce,sheenRoughnessMap:we,specularMap:Te,specularColorMap:Ee,specularIntensityMap:De,transmission:ge,transmissionMap:Oe,thicknessMap:ke,gradientMap:Ae,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:je,alphaTest:Me,alphaHash:I,combine:i.combine,mapUv:N&&m(i.map.channel),aoMapUv:ie&&m(i.aoMap.channel),lightMapUv:ae&&m(i.lightMap.channel),bumpMapUv:oe&&m(i.bumpMap.channel),normalMapUv:P&&m(i.normalMap.channel),displacementMapUv:se&&m(i.displacementMap.channel),emissiveMapUv:ce&&m(i.emissiveMap.channel),metalnessMapUv:F&&m(i.metalnessMap.channel),roughnessMapUv:le&&m(i.roughnessMap.channel),anisotropyMapUv:_e&&m(i.anisotropyMap.channel),clearcoatMapUv:ve&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:ye&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:be&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:xe&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:Se&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:Ce&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:we&&m(i.sheenRoughnessMap.channel),specularMapUv:Te&&m(i.specularMap.channel),specularColorMapUv:Ee&&m(i.specularColorMap.channel),specularIntensityMapUv:De&&m(i.specularIntensityMap.channel),transmissionMapUv:Oe&&m(i.transmissionMap.channel),thicknessMapUv:ke&&m(i.thicknessMap.channel),alphaMapUv:je&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(P||ue),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(N||je),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&P===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ee,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Pe,decodeVideoTexture:N&&i.map.isVideoTexture===!0&&K.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:ce&&i.emissiveMap.isVideoTexture===!0&&K.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Ne&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Ne&&i.extensions.multiDraw===!0||te)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Fe.vertexUv1s=c.has(1),Fe.vertexUv2s=c.has(2),Fe.vertexUv3s=c.has(3),c.clear(),Fe}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=lo[t];n=qi.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new Rc(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function Wc(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function Gc(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Kc(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function qc(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||Gc),r.length>1&&r.sort(t||Kc),i.length>1&&i.sort(t||Kc)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function Jc(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new qc,e.set(t,[i])):n>=r.length?(i=new qc,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Yc(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new W,color:new J};break;case`SpotLight`:n={position:new W,direction:new W,color:new J,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new W,color:new J,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new W,skyColor:new J,groundColor:new J};break;case`RectAreaLight`:n={color:new J,position:new W,halfWidth:new W,halfHeight:new W}}return e[t.id]=n,n}}}function Xc(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new U};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new U};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new U,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Zc=0;function Qc(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function $c(e){let t=new Yc,n=Xc(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new W);let i=new W,a=new q,o=new q;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(Qc);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=$.LTC_FLOAT_1,r.rectAreaLTC2=$.LTC_FLOAT_2):(r.rectAreaLTC1=$.LTC_HALF_1,r.rectAreaLTC2=$.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=Zc++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function el(e){let t=new $c(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function tl(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new el(e),t.set(n,[a])):r>=i.length?(a=new el(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var nl=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,rl=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,il=[new W(1,0,0),new W(-1,0,0),new W(0,1,0),new W(0,-1,0),new W(0,0,1),new W(0,0,-1)],al=[new W(0,-1,0),new W(0,-1,0),new W(0,0,1),new W(0,0,-1),new W(0,-1,0),new W(0,-1,0)],ol=new q,sl=new W,cl=new W;function ll(e,t,n){let r=new Ti,i=new U,a=new U,o=new on,s=new $i,c=new ea,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new Xi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new U},radius:{value:4}},vertexShader:nl,fragmentShader:rl}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new Br;m.setAttribute(`position`,new Er(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new X(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(B(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){B(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){B(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new cn(i.x,i.y,{format:F,type:j,minFilter:x,magFilter:x,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new Di(i.x,i.y,A),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=oe,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=v,d.map.depthTexture.magFilter=v}else l.isPointLight?(d.map=new Bo(i.x),d.map.depthTexture=new Oi(i.x,k)):(d.map=new cn(i.x,i.y),d.map.depthTexture=new Di(i.x,i.y,k)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=oe,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=x,d.map.depthTexture.magFilter=x):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=v,d.map.depthTexture.magFilter=v);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let g=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);for(let t=0;t<g;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),sl.setFromMatrixPosition(l.matrixWorld),e.position.copy(sl),cl.copy(e.position),cl.add(il[t]),e.up.copy(al[t]),e.lookAt(cl),e.updateMatrixWorld(),n.makeTranslation(-sl.x,-sl.y,-sl.z),ol.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(ol,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}r=d.getFrustum(t),S(n,s,i,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&y(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function y(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null?n.mapPass=new cn(i.x,i.y,{format:F,type:j}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value.set(n.map.width,n.map.height),f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function b(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,C)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function S(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=b(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=b(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)S(c[e],i,a,o,s)}function C(e){e.target.removeEventListener(`dispose`,C);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function ul(e,t){function n(){let t=!1,n=new on,r=null,i=new on(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?F(e.DEPTH_TEST):le(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=mt[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?F(e.STENCIL_TEST):le(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new J(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,ee=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),M=!1,te=0,N=e.getParameter(e.VERSION);N.indexOf(`WebGL`)===-1?N.indexOf(`OpenGL ES`)!==-1&&(te=parseFloat(/^OpenGL ES (\d)/.exec(N)[1]),M=te>=2):(te=parseFloat(/^WebGL (\d)/.exec(N)[1]),M=te>=1);let ne=null,re={},ie=e.getParameter(e.SCISSOR_BOX),ae=e.getParameter(e.VIEWPORT),oe=new on().fromArray(ie),P=new on().fromArray(ae);function se(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let ce={};ce[e.TEXTURE_2D]=se(e.TEXTURE_2D,e.TEXTURE_2D,1),ce[e.TEXTURE_CUBE_MAP]=se(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),ce[e.TEXTURE_2D_ARRAY]=se(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),ce[e.TEXTURE_3D]=se(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),F(e.DEPTH_TEST),o.setFunc(3),_e(!1),ve(1),F(e.CULL_FACE),he(0);function F(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function le(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function ue(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function de(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function fe(t){return h!==t&&(e.useProgram(t),h=t,!0)}let pe={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};pe[103]=e.MIN,pe[104]=e.MAX;let me={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function he(t,n,r,i,a,o,s,c,l,u){if(t===0){g===!0&&(le(e.BLEND),g=!1);return}if(g===!1&&(F(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:V(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:V(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:V(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:V(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}return}a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(pe[n],pe[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(me[r],me[i],me[o],me[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function ge(t,n){t.side===2?le(e.CULL_FACE):F(e.CULL_FACE);let r=t.side===1;n&&(r=!r),_e(r),t.blending===1&&t.transparent===!1?he(0):he(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),be(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?F(e.SAMPLE_ALPHA_TO_COVERAGE):le(e.SAMPLE_ALPHA_TO_COVERAGE)}function _e(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function ve(t){t===0?le(e.CULL_FACE):(F(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function ye(t){t!==k&&(M&&e.lineWidth(t),k=t)}function be(t,n,r){t?(F(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):le(e.POLYGON_OFFSET_FILL)}function xe(t){t?F(e.SCISSOR_TEST):le(e.SCISSOR_TEST)}function Se(t){t===void 0&&(t=e.TEXTURE0+ee-1),ne!==t&&(e.activeTexture(t),ne=t)}function Ce(t,n,r){r===void 0&&(r=ne===null?e.TEXTURE0+ee-1:ne);let i=re[r];i===void 0&&(i={type:void 0,texture:void 0},re[r]=i),(i.type!==t||i.texture!==n)&&(ne!==r&&(e.activeTexture(r),ne=r),e.bindTexture(t,n||ce[t]),i.type=t,i.texture=n)}function we(){let t=re[ne];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Te(){try{e.compressedTexImage2D(...arguments)}catch(e){V(`WebGLState:`,e)}}function Ee(){try{e.compressedTexImage3D(...arguments)}catch(e){V(`WebGLState:`,e)}}function De(){try{e.texSubImage2D(...arguments)}catch(e){V(`WebGLState:`,e)}}function Oe(){try{e.texSubImage3D(...arguments)}catch(e){V(`WebGLState:`,e)}}function ke(){try{e.compressedTexSubImage2D(...arguments)}catch(e){V(`WebGLState:`,e)}}function Ae(){try{e.compressedTexSubImage3D(...arguments)}catch(e){V(`WebGLState:`,e)}}function je(){try{e.texStorage2D(...arguments)}catch(e){V(`WebGLState:`,e)}}function Me(){try{e.texStorage3D(...arguments)}catch(e){V(`WebGLState:`,e)}}function I(){try{e.texImage2D(...arguments)}catch(e){V(`WebGLState:`,e)}}function Ne(){try{e.texImage3D(...arguments)}catch(e){V(`WebGLState:`,e)}}function Pe(t){return d[t]===void 0?e.getParameter(t):d[t]}function Fe(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function L(t){oe.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),oe.copy(t))}function Ie(t){P.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),P.copy(t))}function R(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function z(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Le(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},ne=null,re={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new J(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,oe.set(0,0,e.canvas.width,e.canvas.height),P.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:F,disable:le,bindFramebuffer:ue,drawBuffers:de,useProgram:fe,setBlending:he,setMaterial:ge,setFlipSided:_e,setCullFace:ve,setLineWidth:ye,setPolygonOffset:be,setScissorTest:xe,activeTexture:Se,bindTexture:Ce,unbindTexture:we,compressedTexImage2D:Te,compressedTexImage3D:Ee,texImage2D:I,texImage3D:Ne,pixelStorei:Fe,getParameter:Pe,updateUBOMapping:R,uniformBlockBinding:z,texStorage2D:je,texStorage3D:Me,texSubImage2D:De,texSubImage3D:Oe,compressedTexSubImage2D:ke,compressedTexSubImage3D:Ae,scissor:L,viewport:Ie,reset:Le}}function dl(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new U,u=new WeakMap,d=new Set,f,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function w(e,t){return m?new OffscreenCanvas(e,t):st(`canvas`)}function T(e,t,n){let r=1,i=Pe(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=w(n,a));let o=t?w(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),B(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&B(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function E(e){return e.generateMipmaps}function D(t){e.generateMipmap(t)}function O(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function k(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];B(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||B(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?$e:K.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function A(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,B(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function j(e,t){return E(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function ee(e){let t=e.target;t.removeEventListener(`dispose`,ee),te(t),t.isVideoTexture&&u.delete(t),t.isHTMLTexture&&d.delete(t)}function M(e){let t=e.target;t.removeEventListener(`dispose`,M),ne(t)}function te(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&N(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function N(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function ne(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let re=0;function ie(){re=0}function ae(){return re}function oe(e){re=e}function se(){let e=re;return e>=i.maxTextures&&B(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),re+=1,e}function ce(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function F(t,i){let a=r.get(t);if(t.isVideoTexture&&I(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)B(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)B(`WebGLRenderer: Texture marked for update but image is incomplete`);else{ye(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function le(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){ye(a,t,i);return}t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i)}function ue(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){ye(a,t,i);return}n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function de(t,i){let a=r.get(t);if(t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version){be(a,t,i);return}n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let fe={[h]:e.REPEAT,[g]:e.CLAMP_TO_EDGE,[_]:e.MIRRORED_REPEAT},pe={[v]:e.NEAREST,[y]:e.NEAREST_MIPMAP_NEAREST,[b]:e.NEAREST_MIPMAP_LINEAR,[x]:e.LINEAR,[S]:e.LINEAR_MIPMAP_NEAREST,[C]:e.LINEAR_MIPMAP_LINEAR},me={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function he(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&B(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,fe[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,fe[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,fe[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,pe[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,pe[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,me[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function ge(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,ee));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=ce(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&N(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function _e(e,t,n){return Math.floor(Math.floor(e/n)/t)}function ve(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=_e(n.start,r.width,4),c=_e(t.start,r.width,4);n.start<=i+1&&a===c&&_e(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function ye(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=ge(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=K.getPrimaries(K.workingColorSpace),r=o.colorSpace===``?null:K.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=T(o.image,!1,i.maxTextureSize);t=Ne(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=k(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);he(c,o);let h,g=o.mipmaps,_=o.isVideoTexture!==!0,v=f.__version===void 0||l===!0,y=u.dataReady,b=j(o,t);if(o.isDepthTexture)m=A(o.format===P,o.type),v&&(_?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(g.length>0){_&&v&&n.texStorage2D(e.TEXTURE_2D,b,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],_?y&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else _?(v&&n.texStorage2D(e.TEXTURE_2D,b,m,t.width,t.height),y&&ve(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){_&&v&&n.texStorage3D(e.TEXTURE_2D_ARRAY,b,m,g[0].width,g[0].height,t.depth);for(let i=0,a=g.length;i<a;i++)if(h=g[i],o.format!==1023){if(r!==null){if(_){if(y){if(o.layerUpdates.size>0){let t=ao(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else B(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else _?y&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{_&&v&&n.texStorage2D(e.TEXTURE_2D,b,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],o.format===1023?_?y&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?B(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):_?y&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(_){if(v&&n.texStorage3D(e.TEXTURE_2D_ARRAY,b,m,t.width,t.height,t.depth),y){if(o.layerUpdates.size>0){let i=ao(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)_?(v&&n.texStorage3D(e.TEXTURE_3D,b,m,t.width,t.height,t.depth),y&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(v){if(_)n.texStorage2D(e.TEXTURE_2D,b,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<b;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(g.length>0){if(_&&v){let t=Pe(g[0]);n.texStorage2D(e.TEXTURE_2D,b,m,t.width,t.height)}for(let t=0,i=g.length;t<i;t++)h=g[t],_?y&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(_){if(v){let r=Pe(t);n.texStorage2D(e.TEXTURE_2D,b,m,r.width,r.height)}y&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);E(o)&&D(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function be(t,o,s){if(o.image.length!==6)return;let c=ge(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=K.getPrimaries(K.workingColorSpace),r=o.colorSpace===``?null:K.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=T(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Ne(o,m[e]);let h=m[0],g=a.convert(o.format,o.colorSpace),_=a.convert(o.type),v=k(o.internalFormat,g,_,o.normalized,o.colorSpace),y=o.isVideoTexture!==!0,b=u.__version===void 0||c===!0,x=l.dataReady,S=j(o,h);he(e.TEXTURE_CUBE_MAP,o);let C;if(f){y&&b&&n.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,h.width,h.height);for(let t=0;t<6;t++){C=m[t].mipmaps;for(let r=0;r<C.length;r++){let i=C[r];o.format===1023?y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,i.width,i.height,0,g,_,i.data):g===null?B(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):y?x&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,i.width,i.height,0,i.data)}}}else{if(C=o.mipmaps,y&&b){C.length>0&&S++;let t=Pe(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,t.width,t.height)}for(let t=0;t<6;t++)if(p){y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,g,_,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,m[t].width,m[t].height,0,g,_,m[t].data);for(let r=0;r<C.length;r++){let i=C[r].image[t].image;y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,i.width,i.height,0,g,_,i.data)}}else{y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,g,_,m[t]);for(let r=0;r<C.length;r++){let i=C[r];y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,g,_,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,g,_,i.image[t])}}}E(o)&&D(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function xe(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=k(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),Me(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,je(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function Se(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=A(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;Me(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,je(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,je(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=k(o.internalFormat,c,l,o.normalized,o.colorSpace);Me(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,je(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,je(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Ce(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,(!l.__webglTexture||i.depthTexture.image.width!==i.width||i.depthTexture.image.height!==i.height)&&(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,ee)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),he(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else F(i.depthTexture,0);let u=l.__webglTexture,d=je(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)Me(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)Me(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function we(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)Ce(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?Ce(i.__webglFramebuffer[0],t,0):Ce(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),Se(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),Se(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function Te(t,n,i){let a=r.get(t);n!==void 0&&xe(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&we(t)}function Ee(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,M);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&Me(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=k(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=je(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),Se(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),he(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)xe(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else xe(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);E(i)&&D(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),he(c,a),xe(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),E(a)&&D(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),he(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)xe(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else xe(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);E(i)&&D(r),n.unbindTexture()}t.depthBuffer&&we(t)}function De(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(E(a)){let t=O(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),D(t),n.unbindTexture()}}}let Oe=[],ke=[];function Ae(t){if(t.samples>0){if(Me(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(Oe.length=0,ke.length=0,Oe.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&(Oe.push(l),ke.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,ke)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Oe))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function je(e){return Math.min(i.maxSamples,e.samples)}function Me(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function I(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function Ne(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(K.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&B(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):V(`WebGLTextures: Unsupported texture color space:`,n)),t}function Pe(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=se,this.resetTextureUnits=ie,this.getTextureUnits=ae,this.setTextureUnits=oe,this.setTexture2D=F,this.setTexture2DArray=le,this.setTexture3D=ue,this.setTextureCube=de,this.rebindTextures=Te,this.setupRenderTarget=Ee,this.updateRenderTargetMipmap=De,this.updateMultisampleRenderTarget=Ae,this.setupDepthRenderbuffer=we,this.setupFrameBufferTexture=xe,this.useMultisampledRTT=Me,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function fl(e,t){function n(n,r=``){let i,a=K.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var pl=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ml=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,hl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new ki(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Xi({vertexShader:pl,fragmentShader:ml,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new X(new Ri(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},gl=class extends ht{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new hl,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new U,C=null,T=null,E=new Na;E.viewport=new on;let D=new Na;D.viewport=new on;let O=[E,D],A=new Ha,j=null,ee=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new Bn,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new Bn,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new Bn,b[e]=t),t.getHandSpace()};function M(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function N(){r.removeEventListener(`select`,M),r.removeEventListener(`selectstart`,M),r.removeEventListener(`selectend`,M),r.removeEventListener(`squeeze`,M),r.removeEventListener(`squeezestart`,M),r.removeEventListener(`squeezeend`,M),r.removeEventListener(`end`,N),r.removeEventListener(`inputsourceschange`,ne);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}j=null,ee=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,de.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),T!==null){let e=T.camera;e.fov=T.fov,e.zoom=T.zoom,e.updateProjectionMatrix(),T=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&B(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&B(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,M),r.addEventListener(`selectstart`,M),r.addEventListener(`selectend`,M),r.addEventListener(`squeeze`,M),r.addEventListener(`squeezestart`,M),r.addEventListener(`squeezeend`,M),r.addEventListener(`end`,N),r.addEventListener(`inputsourceschange`,ne),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?P:oe,a=_.stencil?te:k);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new cn(d.textureWidth,d.textureHeight,{format:ae,type:w,depthTexture:new Di(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new cn(f.framebufferWidth,f.framebufferHeight,{format:ae,type:w,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),de.setContext(r),de.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function ne(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}let re=new W,ie=new W;function se(e,t,n){re.setFromMatrixPosition(t.matrixWorld),ie.setFromMatrixPosition(n.matrixWorld);let r=re.distanceTo(ie),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function ce(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),A.near=D.near=E.near=t,A.far=D.far=E.far=n,(j!==A.near||ee!==A.far)&&(r.updateRenderState({depthNear:A.near,depthFar:A.far}),j=A.near,ee=A.far),A.layers.mask=e.layers.mask|6,E.layers.mask=A.layers.mask&-5,D.layers.mask=A.layers.mask&-3;let i=e.parent,a=A.cameras;ce(A,i);for(let e=0;e<a.length;e++)ce(a[e],i);a.length===2?se(A,E,D):A.projectionMatrix.copy(E.projectionMatrix),T===null&&e.isPerspectiveCamera&&(T={camera:e,fov:e.fov,zoom:e.zoom}),F(e,A,i)};function F(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=yt*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return A},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(A)},this.getCameraTexture=function(e){return g[e]};let le=null;function ue(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==A.cameras.length&&(A.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=O[n];o===void 0&&(o=new Na,o.layers.enable(n),o.viewport=new on,O[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(A.matrix.copy(o.matrix),A.matrix.decompose(A.position,A.quaternion,A.scale)),i===!0&&A.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new ki,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}le&&le(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let de=new so;de.setAnimationLoop(ue),this.setAnimationLoop=function(e){le=e},this.dispose=function(){}}},_l=new q,vl=new G;vl.set(-1,0,0,0,1,0,0,0,1);function yl(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,Ki(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(_l.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(vl),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function bl(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return V(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?B(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):B(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var xl=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Sl=null;function Cl(){return Sl===null&&(Sl=new fi(xl,16,16,F,j),Sl.name=`DFG_LUT`,Sl.minFilter=x,Sl.magFilter=x,Sl.wrapS=g,Sl.wrapT=g,Sl.generateMipmaps=!1,Sl.needsUpdate=!0),Sl}var wl=class{constructor(e={}){let{canvas:t=ct(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=w}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([ue,le,ce]),g=new Set([w,k,D,te,ee,M]),_=new Uint32Array(4),v=new Int32Array(4),y=new W,b=null,x=null,S=[],T=[],E=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let O=this,A=!1,N=null,ne=null,re=null,ie=null;this._outputColorSpace=Ze;let ae=0,oe=0,P=null,se=-1,F=null,de=new on,fe=new on,pe=null,me=new J(0),he=0,ge=t.width,_e=t.height,ve=1,ye=null,be=null,xe=new on(0,0,ge,_e),Se=new on(0,0,ge,_e),Ce=!1,we=new Ti,Te=!1,Ee=!1,De=new q,Oe=new W,ke=new on,Ae={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},je=!1;function Me(){return P===null?ve:1}let I=n;function Ne(e,n){return t.getContext(e,n)}let Pe,Fe,L,Ie,R,z,Le,Re,ze,Be,Ve,He,Ue,We,Ge,Ke,qe,Je,Ye,Xe,Qe,$e,et;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,rt,!1),t.addEventListener(`webglcontextrestored`,at,!1),t.addEventListener(`webglcontextcreationerror`,ot,!1),I===null){let t=`webgl2`;if(I=Ne(t,e),I===null)throw Ne(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}tt()}catch(e){throw t.removeEventListener(`webglcontextlost`,rt,!1),t.removeEventListener(`webglcontextrestored`,at,!1),t.removeEventListener(`webglcontextcreationerror`,ot,!1),V(`WebGLRenderer: `+e.message),e}function tt(){Pe=new Ho(I),Pe.init(),Qe=new fl(I,Pe),Fe=new _o(I,Pe,e,Qe),L=new ul(I,Pe),Fe.reversedDepthBuffer&&d&&L.buffers.depth.setReversed(!0),ne=I.createFramebuffer(),re=I.createFramebuffer(),ie=I.createFramebuffer(),Ie=new Go(I),R=new Wc,z=new dl(I,Pe,L,R,Fe,Qe,Ie),Le=new Vo(O),Re=new co(I),$e=new ho(I,Re),ze=new Uo(I,Re,Ie,$e),Be=new qo(I,ze,Re,$e,Ie),Je=new Ko(I,Fe,z),Ge=new vo(R),Ve=new Uc(O,Le,Pe,Fe,$e,Ge),He=new yl(O,R),Ue=new Jc,We=new tl(Pe),qe=new mo(O,Le,L,Be,p,s),Ke=new ll(O,Be,Fe),et=new bl(I,Ie,Fe,L),Ye=new go(I,Pe,Ie),Xe=new Wo(I,Pe,Ie),Ie.programs=Ve.programs,O.capabilities=Fe,O.extensions=Pe,O.properties=R,O.renderLists=Ue,O.shadowMap=Ke,O.state=L,O.info=Ie}m!==1009&&(E=new Yo(m,t.width,t.height,o,r,i));let nt=new gl(O,I);this.xr=nt,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let e=Pe.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Pe.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return ve},this.setPixelRatio=function(e){e!==void 0&&(ve=e,this.setSize(ge,_e,!1))},this.getSize=function(e){return e.set(ge,_e)},this.setSize=function(e,n,r=!0){if(nt.isPresenting){B(`WebGLRenderer: Can't change size while VR device is presenting.`);return}ge=e,_e=n,t.width=Math.floor(e*ve),t.height=Math.floor(n*ve),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),E!==null&&E.setSize(t.width,t.height),this.setViewport(0,0,e,n)},this.getDrawingBufferSize=function(e){return e.set(ge*ve,_e*ve).floor()},this.setDrawingBufferSize=function(e,n,r){ge=e,_e=n,ve=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009){V(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){B(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}E.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(de)},this.getViewport=function(e){return e.copy(xe)},this.setViewport=function(e,t,n,r){e.isVector4?xe.set(e.x,e.y,e.z,e.w):xe.set(e,t,n,r),L.viewport(de.copy(xe).multiplyScalar(ve).round())},this.getScissor=function(e){return e.copy(Se)},this.setScissor=function(e,t,n,r){e.isVector4?Se.set(e.x,e.y,e.z,e.w):Se.set(e,t,n,r),L.scissor(fe.copy(Se).multiplyScalar(ve).round())},this.getScissorTest=function(){return Ce},this.setScissorTest=function(e){L.setScissorTest(Ce=e)},this.setOpaqueSort=function(e){ye=e},this.setTransparentSort=function(e){be=e},this.getClearColor=function(e){return e.copy(qe.getClearColor())},this.setClearColor=function(){qe.setClearColor(...arguments)},this.getClearAlpha=function(){return qe.getClearAlpha()},this.setClearAlpha=function(){qe.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(P!==null){let t=P.texture.format;e=h.has(t)}if(e){let e=P.texture.type,t=g.has(e),n=qe.getClearColor(),r=qe.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,I.clearBufferuiv(I.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,I.clearBufferiv(I.COLOR,0,v))}else r|=I.COLOR_BUFFER_BIT}t&&(r|=I.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&I.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),N=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,rt,!1),t.removeEventListener(`webglcontextrestored`,at,!1),t.removeEventListener(`webglcontextcreationerror`,ot,!1),qe.dispose(),Ue.dispose(),We.dispose(),R.dispose(),Le.dispose(),Be.dispose(),$e.dispose(),et.dispose(),Ve.dispose(),nt.dispose(),nt.removeEventListener(`sessionstart`,gt),nt.removeEventListener(`sessionend`,_t),vt.stop()};function rt(e){e.preventDefault(),ut(`WebGLRenderer: Context Lost.`),A=!0}function at(){ut(`WebGLRenderer: Context Restored.`),A=!1;let e=Ie.autoReset,t=Ke.enabled,n=Ke.autoUpdate,r=Ke.needsUpdate,i=Ke.type;tt(),Ie.autoReset=e,Ke.enabled=t,Ke.autoUpdate=n,Ke.needsUpdate=r,Ke.type=i}function ot(e){V(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function st(e){let t=e.target;t.removeEventListener(`dispose`,st),lt(t)}function lt(e){dt(e),R.remove(e)}function dt(e){let t=R.get(e).programs;t!==void 0&&(t.forEach(function(e){Ve.releaseProgram(e)}),e.isShaderMaterial&&Ve.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=Ae);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=Dt(e,t,n,r,i);L.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=ze.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;$e.setup(i,r,s,n,c);let h,g=Ye;if(c!==null&&(h=Re.get(c),g=Xe,g.setIndex(h)),i.isMesh)r.wireframe===!0?(L.setLineWidth(r.wireframeLinewidth*Me()),g.setMode(I.LINES)):g.setMode(I.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),L.setLineWidth(e*Me()),i.isLineSegments?g.setMode(I.LINES):i.isLineLoop?g.setMode(I.LINE_LOOP):g.setMode(I.LINE_STRIP)}else i.isPoints?g.setMode(I.POINTS):i.isSprite&&g.setMode(I.TRIANGLES);if(i.isBatchedMesh){if(Pe.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Re.get(c).bytesPerElement:1,o=R.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(I,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function ft(e,t,n,r){N!==null&&e.isNodeMaterial&&N.setObject(r,e),Te===!0&&Ge.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,Ct(e,t,r),e.side=0,e.needsUpdate=!0,Ct(e,t,r),e.side=2):Ct(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),N!==null&&N.renderStart(e,t,n),x=We.get(n),x.init(t),T.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights(),N!==null&&N.updateLights(x.state.lightsArray),Ee=this.localClippingEnabled,Te=Ge.init(this.clippingPlanes,Ee),Te===!0&&Ge.setGlobalState(this.clippingPlanes,t),N!==null&&Ke.render(x.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];ft(o,n,t,e),r.add(o)}else ft(i,n,t,e),r.add(i)}}),x=T.pop(),N!==null&&N.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){let t=R.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}Pe.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let mt=null;function ht(e){mt&&mt(e)}function gt(){vt.stop()}function _t(){vt.start()}let vt=new so;vt.setAnimationLoop(ht),typeof self<`u`&&vt.setContext(self),this.setAnimationLoop=function(e){mt=e,nt.setAnimationLoop(e),e===null?vt.stop():vt.start()},nt.addEventListener(`sessionstart`,gt),nt.addEventListener(`sessionend`,_t),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){V(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(A===!0)return;N!==null&&N.renderStart(e,t);let n=nt.enabled===!0&&nt.isPresenting===!0,r=E!==null&&(P===null||n)&&E.begin(O,P);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),nt.enabled===!0&&nt.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(nt.cameraAutoUpdate===!0&&nt.updateCamera(t),t=nt.getCamera()),e.isScene===!0&&e.onBeforeRender(O,e,t,P),x=We.get(e,T.length),x.init(t),x.state.textureUnits=z.getTextureUnits(),T.push(x),De.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),we.setFromProjectionMatrix(De,it,t.reversedDepth),Ee=this.localClippingEnabled,Te=Ge.init(this.clippingPlanes,Ee),b=Ue.get(e,S.length),b.init(),S.push(b),nt.enabled===!0&&nt.isPresenting===!0){let e=O.xr.getDepthSensingMesh();e!==null&&yt(e,t,-1/0,O.sortObjects)}yt(e,t,0,O.sortObjects),b.finish(),N!==null&&N.updateLights(x.state.lightsArray),O.sortObjects===!0&&b.sort(ye,be),je=nt.enabled===!1||nt.isPresenting===!1||nt.hasDepthSensing()===!1,je&&qe.addToRenderList(b,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Te===!0&&Ge.beginShadows();let i=x.state.shadowsArray;if(Ke.render(i,e,t),Te===!0&&Ge.endShadows(),(r&&E.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];H(n,r,e,a)}je&&qe.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];bt(b,e,n,n.viewport)}}else r.length>0&&H(n,r,e,t),je&&qe.render(e),bt(b,e,t)}P!==null&&oe===0&&(z.updateMultisampleRenderTarget(P),z.updateRenderTargetMipmap(P)),r&&E.end(O),e.isScene===!0&&e.onAfterRender(O,e,t),$e.resetDefaultState(),se=-1,F=null,T.pop(),T.length>0?(x=T[T.length-1],z.setTextureUnits(x.state.textureUnits),Te===!0&&Ge.setGlobalState(O.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,N!==null&&N.renderEnd()};function yt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)x.pushLightProbeGrid(e);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(we)){r&&ke.setFromMatrixPosition(e.matrixWorld).applyMatrix4(De);let i=Be.update(e),a=e.material;a.visible&&b.push(e,i,a,n,ke.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(we))){let i=Be.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),ke.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),ke.copy(e.boundingSphere.center)),ke.applyMatrix4(e.matrixWorld).applyMatrix4(De)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&b.push(e,i,c,n,ke.z,s,t)}}else a.visible&&b.push(e,i,a,n,ke.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)yt(i[e],t,n,r)}function bt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),Te===!0&&Ge.setGlobalState(O.clippingPlanes,n),r&&L.viewport(de.copy(r)),i.length>0&&xt(i,t,n),a.length>0&&xt(a,t,n),o.length>0&&xt(o,t,n),L.buffers.depth.setTest(!0),L.buffers.depth.setMask(!0),L.buffers.color.setMask(!0),L.setPolygonOffset(!1)}function H(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=Pe.has(`EXT_color_buffer_half_float`)||Pe.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new cn(1,1,{generateMipmaps:!0,type:e?j:w,minFilter:C,samples:Math.max(4,Fe.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:K.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||de;a.setSize(o.z*O.transmissionResolutionScale,o.w*O.transmissionResolutionScale);let s=O.getRenderTarget(),c=O.getActiveCubeFace(),l=O.getActiveMipmapLevel();O.setRenderTarget(a),O.getClearColor(me),he=O.getClearAlpha(),he<1&&O.setClearColor(16777215,.5),O.clear(),je&&qe.render(n);let u=O.toneMapping;O.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),Te===!0&&Ge.setGlobalState(O.clippingPlanes,r),xt(e,n,r),z.updateMultisampleRenderTarget(a),z.updateRenderTargetMipmap(a),Pe.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,St(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(z.updateMultisampleRenderTarget(a),z.updateRenderTargetMipmap(a))}O.setRenderTarget(s,c,l),O.setClearColor(me,he),d!==void 0&&(r.viewport=d),O.toneMapping=u}function xt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&St(o,t,n,s,l,c)}}function St(e,t,n,r,i,a){N!==null&&i.isNodeMaterial&&N.setObject(e,i),e.onBeforeRender(O,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(O,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,O.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,O.renderBufferDirect(n,t,r,i,e,a),i.side=2):O.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(O,t,n,r,i,a)}function Ct(e,t,n){t.isScene!==!0&&(t=Ae);let r=R.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=Ve.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=Ve.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Le.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,st),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return Tt(e,s),d}else s.uniforms=Ve.getUniforms(e),N!==null&&e.isNodeMaterial&&N.build(e,n,s),e.onBeforeCompile(s,O),d=Ve.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Ge.uniform),Tt(e,s),r.needsLights=kt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=x.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function wt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=nc.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function Tt(e,t){let n=R.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function Et(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];y.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(y))return n}return null}function Dt(e,t,n,r,i){t.isScene!==!0&&(t=Ae),z.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=P===null?O.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:K.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Le.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(h=O.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=R.get(r),y=x.state.lights;if(Te===!0&&(Ee===!0||e!==F)){let t=e===F&&r.id===se;Ge.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Ge.numPlanes||v.numIntersection!==Ge.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=x.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let S=v.currentProgram;b===!0&&(S=Ct(r,t,i),N&&r.isNodeMaterial&&N.onUpdateProgram(r,S,v));let C=!1,w=!1,T=!1,E=S.getUniforms(),D=v.uniforms;if(L.useProgram(S.program)&&(C=!0,w=!0,T=!0),r.id!==se&&(se=r.id,w=!0),v.needsLights){let e=Et(x.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,w=!0)}if(C||F!==e){L.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),E.setValue(I,`projectionMatrix`,e.projectionMatrix),E.setValue(I,`viewMatrix`,e.matrixWorldInverse);let t=E.map.cameraPosition;t!==void 0&&t.setValue(I,Oe.setFromMatrixPosition(e.matrixWorld)),Fe.logarithmicDepthBuffer&&E.setValue(I,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&E.setValue(I,`isOrthographic`,e.isOrthographicCamera===!0),F!==e&&(F=e,w=!0,T=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&E.setValue(I,`sunShadowMap`,y.state.sunShadowMap,z),y.state.directionalShadowMap.length>0&&E.setValue(I,`directionalShadowMap`,y.state.directionalShadowMap,z),y.state.spotShadowMap.length>0&&E.setValue(I,`spotShadowMap`,y.state.spotShadowMap,z),y.state.pointShadowMap.length>0&&E.setValue(I,`pointShadowMap`,y.state.pointShadowMap,z)),i.isSkinnedMesh){E.setOptional(I,i,`bindMatrix`),E.setOptional(I,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),E.setValue(I,`boneTexture`,e.boneTexture,z))}i.isBatchedMesh&&(E.setOptional(I,i,`batchingTexture`),E.setValue(I,`batchingTexture`,i._matricesTexture,z),E.setOptional(I,i,`batchingIdTexture`),E.setValue(I,`batchingIdTexture`,i._indirectTexture,z),E.setOptional(I,i,`batchingColorTexture`),i._colorsTexture!==null&&E.setValue(I,`batchingColorTexture`,i._colorsTexture,z));let k=n.morphAttributes;if((k.position!==void 0||k.normal!==void 0||k.color!==void 0)&&Je.update(i,n,S),(w||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,E.setValue(I,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(D.envMapIntensity.value=t.environmentIntensity),D.dfgLUT!==void 0&&(D.dfgLUT.value=Cl()),w){if(E.setValue(I,`toneMappingExposure`,O.toneMappingExposure),v.needsLights&&Ot(D,T),a&&r.fog===!0&&He.refreshFogUniforms(D,a),He.refreshMaterialUniforms(D,r,ve,_e,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;D.probesSH.value=e.texture,D.probesMin.value.copy(e.boundingBox.min),D.probesMax.value.copy(e.boundingBox.max),D.probesResolution.value.copy(e.resolution)}nc.upload(I,wt(v),D,z)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(nc.upload(I,wt(v),D,z),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&E.setValue(I,`center`,i.center),E.setValue(I,`modelViewMatrix`,i.modelViewMatrix),E.setValue(I,`normalMatrix`,i.normalMatrix),E.setValue(I,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];et.update(n,S),et.bind(n,S)}}return S}function Ot(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function kt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return ae},this.getActiveMipmapLevel=function(){return oe},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(e,t,n){let r=R.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),R.get(e.texture).__webglTexture=t,R.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=R.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){P=e,ae=t,oe=n;let r=null,i=!1,a=!1;if(e){let o=R.get(e);if(o.__useDefaultFramebuffer!==void 0){L.bindFramebuffer(I.FRAMEBUFFER,o.__webglFramebuffer),de.copy(e.viewport),fe.copy(e.scissor),pe=e.scissorTest,L.viewport(de),L.scissor(fe),L.setScissorTest(pe),se=-1;return}if(o.__webglFramebuffer===void 0)z.setupRenderTarget(e);else if(o.__hasExternalTextures)z.rebindTextures(e,R.get(e.texture).__webglTexture,R.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&R.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);z.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=R.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&z.useMultisampledRTT(e)===!1?R.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,de.copy(e.viewport),fe.copy(e.scissor),pe=e.scissorTest}else de.copy(xe).multiplyScalar(ve).floor(),fe.copy(Se).multiplyScalar(ve).floor(),pe=Ce;if(n!==0&&(r=ne),L.bindFramebuffer(I.FRAMEBUFFER,r)&&L.drawBuffers(e,r),L.viewport(de),L.scissor(fe),L.setScissorTest(pe),i){let r=R.get(e.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=R.get(e.textures[t]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=R.get(e.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,t.__webglTexture,n)}se=-1};function At(e){let t=R.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Fe.textureFormatReadable(e.format),t.__typeReadable=Fe.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){V(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=R.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){L.bindFramebuffer(I.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+s);let u=At(o);if(u.__formatReadable===!1){V(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){V(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&I.readPixels(t,n,r,i,Qe.convert(c),Qe.convert(l),a)}finally{let e=P===null?null:R.get(P).__webglFramebuffer;L.bindFramebuffer(I.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=R.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){L.bindFramebuffer(I.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+s);let d=At(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,f),I.bufferData(I.PIXEL_PACK_BUFFER,a.byteLength,I.STREAM_READ),I.readPixels(t,n,r,i,Qe.convert(l),Qe.convert(u),0),I.bindBuffer(I.PIXEL_PACK_BUFFER,null);let p=P===null?null:R.get(P).__webglFramebuffer;L.bindFramebuffer(I.FRAMEBUFFER,p);let m=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await pt(I,m,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,f),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,a),I.bindBuffer(I.PIXEL_PACK_BUFFER,null),I.deleteBuffer(f),I.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;z.setTexture2D(e,0),I.copyTexSubImage2D(I.TEXTURE_2D,n,0,0,o,s,i,a),L.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Qe.convert(t.format),_=Qe.convert(t.type),v;t.isData3DTexture?(z.setTexture3D(t,0),v=I.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(z.setTexture2DArray(t,0),v=I.TEXTURE_2D_ARRAY):(z.setTexture2D(t,0),v=I.TEXTURE_2D),L.activeTexture(I.TEXTURE0),L.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,t.flipY),L.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),L.pixelStorei(I.UNPACK_ALIGNMENT,t.unpackAlignment);let y=L.getParameter(I.UNPACK_ROW_LENGTH),b=L.getParameter(I.UNPACK_IMAGE_HEIGHT),x=L.getParameter(I.UNPACK_SKIP_PIXELS),S=L.getParameter(I.UNPACK_SKIP_ROWS),C=L.getParameter(I.UNPACK_SKIP_IMAGES);L.pixelStorei(I.UNPACK_ROW_LENGTH,h.width),L.pixelStorei(I.UNPACK_IMAGE_HEIGHT,h.height),L.pixelStorei(I.UNPACK_SKIP_PIXELS,l),L.pixelStorei(I.UNPACK_SKIP_ROWS,u),L.pixelStorei(I.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=R.get(e),r=R.get(t),h=R.get(n.__renderTarget),g=R.get(r.__renderTarget);L.bindFramebuffer(I.READ_FRAMEBUFFER,h.__webglFramebuffer),L.bindFramebuffer(I.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,R.get(e).__webglTexture,i,d+n),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,R.get(t).__webglTexture,a,m+n)),I.blitFramebuffer(l,u,o,s,f,p,o,s,I.DEPTH_BUFFER_BIT,I.NEAREST);L.bindFramebuffer(I.READ_FRAMEBUFFER,null),L.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||R.has(e)){let n=R.get(e),r=R.get(t);L.bindFramebuffer(I.READ_FRAMEBUFFER,re),L.bindFramebuffer(I.DRAW_FRAMEBUFFER,ie);for(let e=0;e<c;e++)w?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,n.__webglTexture,i),T?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,r.__webglTexture,a),i===0?T?I.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):I.copyTexSubImage2D(v,a,f,p,l,u,o,s):I.blitFramebuffer(l,u,o,s,f,p,o,s,I.COLOR_BUFFER_BIT,I.NEAREST);L.bindFramebuffer(I.READ_FRAMEBUFFER,null),L.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?I.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?I.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):I.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):I.texSubImage2D(I.TEXTURE_2D,a,f,p,o,s,g,_,h);L.pixelStorei(I.UNPACK_ROW_LENGTH,y),L.pixelStorei(I.UNPACK_IMAGE_HEIGHT,b),L.pixelStorei(I.UNPACK_SKIP_PIXELS,x),L.pixelStorei(I.UNPACK_SKIP_ROWS,S),L.pixelStorei(I.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&I.generateMipmap(v),L.unbindTexture()},this.initRenderTarget=function(e){R.get(e).__webglFramebuffer===void 0&&z.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?z.setTextureCube(e,0):e.isData3DTexture?z.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?z.setTexture2DArray(e,0):z.setTexture2D(e,0),L.unbindTexture()},this.resetState=function(){ae=0,oe=0,P=null,L.reset(),$e.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return it}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=K._getDrawingBufferColorSpace(e),t.unpackColorSpace=K._getUnpackColorSpace()}},Tl=class{constructor(){this.handlers=new Map}on(e,t){return this.handlers.has(e)||this.handlers.set(e,new Set),this.handlers.get(e).add(t),()=>this.off(e,t)}off(e,t){this.handlers.get(e)?.delete(t)}emit(e,t){let n=this.handlers.get(e);if(n)for(let e of[...n])e(t)}},El=class{constructor(e){this.keys=new Set,this.pressed=new Set,this.mouseNdc={x:0,y:0},this.mouseDown=!1,this.leftPressed=!1,this.rightPressed=!1,this.hasMouse=!1,this.virtualMove={x:0,z:0},this.virtualAttack=!1,this.touchMode=window.matchMedia?.(`(pointer: coarse)`).matches||`ontouchstart`in window,window.addEventListener(`keydown`,e=>{e.repeat||(this.keys.add(e.code),this.pressed.add(e.code))}),window.addEventListener(`keyup`,e=>this.keys.delete(e.code)),window.addEventListener(`blur`,()=>{this.keys.clear(),this.mouseDown=!1});let t=t=>{let n=e.getBoundingClientRect();this.mouseNdc.x=(t.clientX-n.left)/n.width*2-1,this.mouseNdc.y=-((t.clientY-n.top)/n.height)*2+1,this.hasMouse=!0};e.addEventListener(`pointermove`,t),e.addEventListener(`pointerdown`,n=>{t(n),n.button===2&&(this.rightPressed=!0),n.button===0&&(this.mouseDown=!0,this.leftPressed=!0,e.setPointerCapture?.(n.pointerId))});let n=e=>{(e.button===0||e.pointerType===`touch`)&&(this.mouseDown=!1)};window.addEventListener(`pointerup`,n),window.addEventListener(`pointercancel`,n),e.addEventListener(`contextmenu`,e=>e.preventDefault())}isDown(e){return this.keys.has(e)}wasPressed(e){return this.pressed.has(e)}press(e){this.pressed.add(e)}moveVector(){let e=+!!this.isDown(`KeyD`)-!!this.isDown(`KeyA`),t=+!!this.isDown(`KeyS`)-!!this.isDown(`KeyW`),n=e||t?1:0,r=!1,i=this.virtualMove,a=Math.hypot(i.x,i.z);return!n&&a>.15&&(e=i.x,t=i.z,n=Math.min(1,a),r=!0),{x:e,z:t,amount:n,stick:r}}get attackHeld(){return this.mouseDown||this.virtualAttack}consumeMouse(){this.mouseDown=!1,this.leftPressed=!1,this.rightPressed=!1}endFrame(){this.pressed.clear(),this.leftPressed=!1,this.rightPressed=!1}},Dl=class{constructor(e,t){this.cfg=e,this.bus=t,this.maxDelta=e.maxDelta,this.last=performance.now(),this.delta=0,this.elapsed=0,this.day=1,this.clock=e.startClock,t.on(`save:collect`,e=>{e.time={day:this.day,clock:this.clock}}),t.on(`save:apply`,e=>{e.time&&(this.day=e.time.day,this.clock=e.time.clock)})}get cycle(){return this.cfg.dayLength+this.cfg.nightLength}get isNight(){return this.clock>=this.cfg.dayLength}get daylight(){let{dayLength:e,transition:t}=this.cfg,n=this.clock;return n<e-t?n<t?Math.max(0,n/t)*.5+.5:1:n<e?(e-n)/t:0}get untilChange(){return this.isNight?this.cycle-this.clock:this.cfg.dayLength-this.clock}tick(e){return this.delta=Math.min((e-this.last)/1e3,this.maxDelta),this.last=e,this.elapsed+=this.delta,this.delta}advance(e){let{dayLength:t,nightWarning:n}=this.cfg,r=this.clock;this.clock+=e;let i=t-n;r<i&&this.clock>=i&&this.bus.emit(`time:dusk`,{day:this.day}),r<t&&this.clock>=t&&this.bus.emit(`time:night`,{day:this.day}),this.clock>=this.cycle&&(this.clock-=this.cycle,this.day+=1,this.bus.emit(`time:day`,{day:this.day}))}},Ol=class{constructor(e,t){this.cfg=e,this.camera=new Na(e.fov,t,.1,400),this.offset=new W(...e.offset),this.focus=new W,this.lookAt=new W,this.shakeTime=0,this.shakeDur=1,this.shakeStrength=0,this.shakeOffset=new W}shake(e,t){e<this.shakeStrength*(this.shakeTime/this.shakeDur)||(this.shakeStrength=e,this.shakeTime=t,this.shakeDur=t)}updateShake(e){if(this.shakeTime<=0){this.shakeOffset.set(0,0,0);return}this.shakeTime=Math.max(0,this.shakeTime-e);let t=this.shakeStrength*(this.shakeTime/this.shakeDur);this.shakeOffset.set((Math.random()-.5)*2*t,(Math.random()-.5)*t,(Math.random()-.5)*2*t)}snapTo(e){this.focus.copy(e),this.apply()}update(e,t){let n=1-Math.exp(-this.cfg.followSharpness*e);this.focus.lerp(t,n),this.apply()}apply(){this.camera.position.copy(this.focus).add(this.offset).add(this.shakeOffset),this.lookAt.copy(this.focus),this.lookAt.y+=this.cfg.lookHeight,this.camera.lookAt(this.lookAt)}orbit(e,t){let n=Math.hypot(this.offset.x,this.offset.z)*1.15;this.camera.position.set(e.x+Math.sin(t)*n,this.offset.y*.7,e.z+Math.cos(t)*n),this.lookAt.copy(e),this.lookAt.y+=this.cfg.lookHeight+1.5,this.camera.lookAt(this.lookAt),this.focus.copy(e)}resize(e){this.camera.aspect=e,this.camera.updateProjectionMatrix()}};function kl(e){let t=e>>>0,n=()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296};return{next:n,range:(e,t)=>e+(t-e)*n(),int:(e,t)=>Math.floor(e+(t-e+1)*n()),pick:e=>e[Math.floor(n()*e.length)]}}var Al={range:(e,t)=>e+(t-e)*Math.random(),int:(e,t)=>Math.floor(e+(t-e+1)*Math.random()),pick:e=>e[Math.floor(Math.random()*e.length)]},jl=class{constructor(e,t){this.list=Object.entries(e).map(([e,t])=>({id:e,...t,groundColors:t.ground.map(e=>new J(e))})).sort((e,t)=>e.zFrom-t.zFrom),this.byId=Object.fromEntries(this.list.map(e=>[e.id,e])),this.blend=t}at(e,t){for(let e of this.list)if(t>=e.zFrom&&t<e.zTo)return e;return t<this.list[0].zFrom?this.list[0]:this.list[this.list.length-1]}baseColor(e,t,n,r,i){let[a,o,s]=e.groundColors,c=Math.sin(t*.09)*Math.cos(n*.07)+Math.sin((t+n)*.03);return i.copy(c>.4?s:a).lerp(o,r*.55)}groundColor(e,t,n,r){let i=this.at(e,t-this.blend),a=this.at(e,t+this.blend);if(this.baseColor(this.at(e,t),e,t,n,r),i===a)return r;let o=a.zFrom,s=Vt.smoothstep(t,o-this.blend,o+this.blend),c=new J;return this.baseColor(i,e,t,n,r),this.baseColor(a,e,t,n,c),r.lerp(c,s)}},Ml=class{constructor(e,t,n){this.index=t,this.zMin=t*n,this.zMax=this.zMin+n,this.group=new Rn,e.add(this.group)}build(e,t,n,r){for(let[i,a]of Object.entries(e)){let e=new xi(t[i],n[i],a.length);a.forEach((t,n)=>{e.setMatrixAt(n,t.m),e.setColorAt(n,t.c)}),e.castShadow=!r.has(i),e.receiveShadow=!0,e.computeBoundingSphere(),e.userData={kind:i,total:a.length},this.group.add(e)}}setDensity(e,t){for(let n of this.group.children){let{kind:r,total:i}=n.userData;n.count=t.includes(r)?Math.round(i*e):i}}setVisible(e,t){let n=e<this.zMin?this.zMin-e:e>this.zMax?e-this.zMax:0;this.group.visible=n<t}};function Nl(e){let{rng:t,regions:n,bounds:r,scene:i}=e;new q;let a=new Ht,o=new bn,s=new W,c=new W,l=e.cfg.chunkSize,u=new Map,d=(e,t,n,r,i,d,f,p,m=0,h=0)=>{o.set(h,m,0),a.setFromEuler(o);let g=Math.floor(r/l);u.has(g)||u.set(g,{});let _=u.get(g);(_[e]??=[]).push({m:new q().compose(s.set(t,n,r),a,c.set(i,d,f)),c:new J(p)})},f=new Z(.16,.24,1,6).translate(0,.5,0),p=new Ni(1,1.8,7).translate(0,.9,0),m=new Ii(1,0),h={trunk:f,pineLow:p,pineTop:p,crown:m,rock:new Fi(.6,0),bush:m,flower:new Li(.09,0),tuft:new Ni(.07,.34,3).translate(0,.17,0),stem:new Z(.07,.09,.3,6).translate(0,.15,0),cap:new Bi(.22,7,4,0,Math.PI*2,0,Math.PI/2),snowCap:new Ni(.62,.7,7).translate(0,.35,0),cactus:new Z(.28,.32,1,7).translate(0,.5,0),cactusArm:new Z(.16,.16,1,6).translate(0,.5,0)},g=new Set([`flower`,`tuft`]),_=(n,r,i,a,o=!0)=>{let s=t.range(0,Math.PI),c=new J(t.pick(a.pine));d(`trunk`,n,0,r,i,i*.9,i,10119749,s),d(`pineLow`,n,.75*i,r,i*1.05,i,i*1.05,c,s),d(`pineTop`,n,1.75*i,r,i*.72,i*.85,i*.72,c.clone().offsetHSL(0,0,.04),s+.4),a.snow&&d(`snowCap`,n,2.55*i,r,i*.75,i*.75,i*.75,`#ffffff`,s),o&&e.addCollider(n,r,.4*i)};for(let i of n.list){let a=Math.max(i.zFrom,r.minZ),o=Math.min(i.zTo,r.maxZ);if(o<=a)continue;let s=(r.maxX-r.minX)*(o-a),c=e=>Math.round(i.decor[e]*s/1e3),l=i.palette,u=s=>{for(let c=0;c<20;c++){let c=t.range(r.minX-4,r.maxX+4),l=t.range(a,o)+t.range(-6,6);if(!(n.at(c,l)!==i&&l>r.minZ&&l<r.maxZ)&&!e.nearSpawn(c,l)&&!(s&&e.isBlocked(c,l,s)))return[c,l]}return null};for(let e=0;e<c(`pines`);e++){let e=u(1.4);e&&_(e[0],e[1],t.range(.8,1.35),l)}for(let n=0;n<c(`roundTrees`);n++){let n=u(1.6);if(!n)continue;let r=t.range(.85,1.3);d(`trunk`,n[0],0,n[1],r,r*1.3,r,10119749);let i=t.next()<.18?t.pick(l.blossom):t.pick(l.round);d(`crown`,n[0],1.9*r,n[1],r*1.15,r,r*1.15,i,t.range(0,3),t.range(-.2,.2)),e.addCollider(n[0],n[1],.4*r)}for(let n=0;n<c(`rocks`);n++){let n=u(1.2);if(!n)continue;let r=t.range(.6,1.5);d(`rock`,n[0],.18*r,n[1],r,r*t.range(.55,.8),r*t.range(.8,1.1),t.pick(l.rock),t.range(0,6),t.range(-.3,.3)),e.addCollider(n[0],n[1],.55*r)}for(let e=0;e<c(`bushes`);e++){let e=u(.8);if(!e)continue;let n=t.range(.45,.75);d(`bush`,e[0],.3*n,e[1],n*1.2,n*.8,n,t.pick(l.round),t.range(0,6))}for(let e=0;e<c(`flowers`);e++){let e=u(0);e&&d(`flower`,e[0],.12,e[1],1,.6,1,t.pick(l.flower),t.range(0,6))}for(let e=0;e<c(`tufts`);e++){let e=u(0);if(!e)continue;let n=t.pick(l.tuft);for(let r=0;r<3;r++)d(`tuft`,e[0]+t.range(-.12,.12),0,e[1]+t.range(-.12,.12),1,t.range(.7,1.3),1,n,t.range(0,6),t.range(-.35,.35))}for(let n=0;n<c(`cacti`);n++){let n=u(1);if(!n)continue;let r=t.range(.8,1.6),i=t.pick([`#5fa85a`,`#6fb866`,`#4f9a4a`]);d(`cactus`,n[0],0,n[1],r,r*t.range(1.4,2.2),r,i);let a=t.int(0,2);for(let e=0;e<a;e++){let a=e===0?1:-1;d(`cactusArm`,n[0]+a*.32*r,r*t.range(.8,1.3),n[1],r,r*t.range(.5,.9),r,i,0,0)}e.addCollider(n[0],n[1],.35*r)}for(let e=0;e<c(`mushrooms`);e++){let e=u(.5);if(!e)continue;let n=t.range(.7,1.4);d(`stem`,e[0],0,e[1],n,n,n,`#f4e6cf`),d(`cap`,e[0],.28*n,e[1],n,n*.8,n,t.pick([`#e0574f`,`#f08a4b`,`#c9a0ff`]))}}let v=e.cfg.edgeTrees,y=(e,r)=>_(e,r,t.range(1,1.5),n.at(e,r).palette,!1);for(let e=0;e<v.layers;e++){let n=2+e*v.layerGap;for(let e=r.minX-n;e<=r.maxX+n;e+=v.spacing)y(e+t.range(-1,1),r.minZ-n+t.range(-1,1)),y(e+t.range(-1,1),r.maxZ+n+t.range(-1,1));for(let e=r.minZ-n;e<=r.maxZ+n;e+=v.spacing)y(r.minX-n+t.range(-1,1),e+t.range(-1,1)),y(r.maxX+n+t.range(-1,1),e+t.range(-1,1))}let b=Object.fromEntries(Object.keys(h).map(e=>[e,new Qi({color:16777215,flatShading:!0,roughness:.9})])),x=[];for(let[e,t]of u){let n=new Ml(i,e,l);n.build(t,h,b,g),x.push(n)}return x}var Pl={sky:12576503,nightSky:2502746},Fl=8,Il=class{constructor(e){this.ctx=e;let t=e.data.config.world;this.cfg=t,this.bounds=t.bounds,this.regions=new jl(e.data.regions,t.regionBlend),this.spawnPoint=new W(t.spawnPoint[0],0,t.spawnPoint[1]),this.colliders=new Map,this.rng=kl(t.seed),this.scene=e.scene;let n=e.scene;n.background=new J(Pl.sky),n.fog=new Kn(Pl.sky,45,115),this.buildLights(),this.buildGround(),this.chunks=Nl(this),e.bus.on(`settings:changed`,({key:e,value:t})=>{if(e===`decorDensity`)for(let e of this.chunks)e.setDensity(t,[`flower`,`tuft`,`bush`,`stem`,`cap`])})}buildLights(){let e=this.ctx.scene;this.hemi=new xa(15398655,7314002,1.25),e.add(this.hemi),this.daySky=new J(Pl.sky),this.nightSky=new J(Pl.nightSky),this.skyColor=new J,this.sunColor=new J(16773330),this.moonColor=new J(9348863);let t=new Ra(16773330,1.9);t.castShadow=!0,t.shadow.mapSize.set(2048,2048);let n=t.shadow.camera;n.left=-28,n.right=28,n.top=28,n.bottom=-28,n.near=1,n.far=90,t.shadow.bias=-6e-4,t.shadow.normalBias=.03,e.add(t,t.target),this.sun=t,this.sunOffset=new W(18,32,14)}buildGround(){let e=this.bounds,t=e.maxX-e.minX+120,n=e.maxZ-e.minZ+120,r=new Ri(t,n,Math.round(t/4),Math.round(n/4)).toNonIndexed();r.rotateX(-Math.PI/2),r.translate((e.minX+e.maxX)/2,0,(e.minZ+e.maxZ)/2);let i=r.attributes.position,a=new Float32Array(i.count*3),o=new J;for(let e=0;e<i.count;e+=3){let t=(i.getX(e)+i.getX(e+1)+i.getX(e+2))/3,n=(i.getZ(e)+i.getZ(e+1)+i.getZ(e+2))/3;this.regions.groundColor(t,n,this.rng.next(),o);for(let t=0;t<3;t++)o.toArray(a,(e+t)*3)}for(let e=0;e<i.count;e++){let t=i.getX(e),n=i.getZ(e);i.setY(e,(Math.sin(t*.7+n*.3)+Math.cos(n*.9-t*.2))*.03)}r.setAttribute(`color`,new Er(a,3)),r.computeVertexNormals();let s=new X(r,new Qi({vertexColors:!0,flatShading:!0,roughness:1}));s.receiveShadow=!0,this.ctx.scene.add(s),this.ground=s}nearSpawn(e,t){return Math.hypot(e-this.spawnPoint.x,t-this.spawnPoint.z)<this.cfg.clearRadius}addCollider(e,t,n){let r=`${Math.floor(e/Fl)},${Math.floor(t/Fl)}`;this.colliders.has(r)||this.colliders.set(r,[]),this.colliders.get(r).push({x:e,z:t,r:n})}*nearby(e,t,n){let r=n+2,i=Math.floor((e-r)/Fl),a=Math.floor((e+r)/Fl),o=Math.floor((t-r)/Fl),s=Math.floor((t+r)/Fl);for(let e=i;e<=a;e++)for(let t=o;t<=s;t++){let n=this.colliders.get(`${e},${t}`);n&&(yield*n)}}regionAt(e,t){return this.regions.at(e,t)}isBlocked(e,t,n){for(let r of this.nearby(e,t,n)){let i=e-r.x,a=t-r.z,o=r.r+n;if(i*i+a*a<o*o)return!0}return!1}resolveCollision(e,t){for(let n of this.nearby(e.x,e.z,t)){let r=e.x-n.x,i=e.z-n.z,a=n.r+t,o=r*r+i*i;if(o<a*a&&o>1e-8){let t=Math.sqrt(o);e.x=n.x+r/t*a,e.z=n.z+i/t*a}}let n=this.bounds;e.x=Math.max(n.minX+1,Math.min(n.maxX-1,e.x)),e.z=Math.max(n.minZ+1,Math.min(n.maxZ-1,e.z))}clampToBounds(e){let t=this.bounds;e.x=Math.max(t.minX+1,Math.min(t.maxX-1,e.x)),e.z=Math.max(t.minZ+1,Math.min(t.maxZ-1,e.z))}isInside(e,t,n=2){let r=this.bounds;return e>r.minX+n&&e<r.maxX-n&&t>r.minZ+n&&t<r.maxZ-n}applyDaylight(e){let t=e;this.skyColor.copy(this.nightSky).lerp(this.daySky,t),this.ctx.scene.background.copy(this.skyColor),this.ctx.scene.fog.color.copy(this.skyColor),this.hemi.intensity=.45+.8*t,this.sun.intensity=.45+1.45*t,this.sun.color.copy(this.moonColor).lerp(this.sunColor,t)}update(e,t){this.applyDaylight(this.ctx.time.daylight);for(let e of this.chunks)e.setVisible(t.z,this.cfg.chunkViewDistance);this.sun.target.position.copy(t),this.sun.position.copy(t).add(this.sunOffset)}};function Ll(e,t,n=0){for(let r of e){let e=t.x-r.position.x,i=t.z-r.position.z;if(e*e+i*i<=(r.areaRadius+n)**2)return r}return null}function Rl(e,t){let n=null,r=1/0;for(let i of e){let e=i.position.distanceTo(t);e<r&&(r=e,n=i)}return n}var zl=e=>new Qi({color:e,flatShading:!0,roughness:.8}),Bl={body:`#5b8def`,feet:`#6b4a36`,blade:`#e8eef5`};function Vl(e,t){let n=new Rn,r=(e,t,r,i,a)=>{let o=new X(e,zl(t));return o.position.set(r,i,a),o.castShadow=!0,n.add(o),o};if(e===`spear`)r(new Z(.035,.035,1.7,6).rotateX(Math.PI/2),`#b88452`,0,0,.55),r(new Ni(.09,.35,4).rotateX(Math.PI/2),t,0,0,1.55);else if(e===`hammer`)r(new Z(.04,.04,.9,6).rotateX(Math.PI/2),`#8a6440`,0,0,.35),r(new Ai(.42,.3,.3),t,0,0,.8);else if(e===`bow`){let e=r(new Vi(.5,.035,5,14,Math.PI),t,0,0,.35);e.rotation.set(0,0,Math.PI/2),e.rotation.y=Math.PI/2,r(new Z(.008,.008,1,3),`#f4efe3`,0,0,.35).rotation.x=0}else r(new Ai(.08,.04,.9),t,0,0,.55),r(new Ai(.26,.06,.06),`#c9a44a`,0,0,.1);return n.position.x=.42,n}function Hl(e,t){let n=Vt.degToRad(Math.max(10,t)),r=new zi(.5,e,20,1,-n/2,n);r.rotateX(-Math.PI/2),r.rotateY(-Math.PI/2);let i=new X(r,new Qr({color:16777215,transparent:!0,opacity:0,side:2,depthWrite:!1}));return i.position.y=.45,i}function Ul(e){let t=new Rn,n=[],r=e=>(n.push(e),e),i=r(zl(Bl.body)),a=new X(new ji(.3,.35,3,8),i);a.position.y=.55;let o=new X(new Ii(.34,1),r(zl(`#ffd9b8`)));o.position.y=1.18;let s=new X(new Bi(.36,8,6,0,Math.PI*2,0,Math.PI*.5),r(zl(`#7a4b2a`)));s.position.y=1.22,s.rotation.x=-.25;let c=new X(new Ni(.08,.25,4),r(zl(`#63c96b`)));c.position.set(.05,1.6,0),c.rotation.z=-.5;let l=zl(`#2b2b33`),u=new Bi(.045,6,4),d=new X(u,l),f=new X(u,l);d.position.set(-.12,1.18,.3),f.position.set(.12,1.18,.3);let p=new Ai(.16,.12,.24),m=r(zl(Bl.feet)),h=new X(p,m),g=new X(p,m);h.position.set(-.13,.06,0),g.position.set(.13,.06,0);let _=r(zl(`#ffffff`)),v=new Rn,y=new X(new Bi(.4,10,6,0,Math.PI*2,0,Math.PI*.5),_),b=new X(new Z(.5,.5,.05,12),_);y.position.y=1.3,b.position.y=1.3,v.add(y,b),v.visible=!1;let x=new Rn;x.position.y=.7,x.rotation.y=.9;let S=Vl(`sword`,Bl.blade);x.add(S);let C=new Rn;C.add(a,o,s,c,d,f,h,g,v,x),C.traverse(e=>{e.isMesh&&(e.castShadow=!0)}),t.add(C);let w=Hl(e.attackRange,e.attackArcDeg);t.add(w);let T=new zi(.5,e.attackRange,32);T.rotateX(-Math.PI/2);let E=new X(T,w.material.clone());return E.position.y=.45,t.add(E),{group:t,inner:C,bodyMats:n,footL:h,footR:g,swordPivot:x,weapon:S,trail:w,spinTrail:E,bodyMat:i,footMat:m,hatMat:_,hat:v,hair:s,leaf:c}}function Wl(e,t){let{head:n,body:r,feet:i}=t;e.hat.visible=!!n,e.leaf.visible=!n,n&&e.hatMat.color.set(n.color),e.bodyMat.color.set(r?.color??Bl.body),e.footMat.color.set(i?.color??Bl.feet)}var Gl=Bl.blade,Kl=class{constructor(e){this.player=e,this.time=-1,this.cooldown=0,this.dir=new W}get cost(){return this.player.base.rollStamina*(1+(this.player.stats.rollStaminaPct??0))}get active(){return this.time>=0}get invulnerable(){return this.active&&this.time<this.player.base.rollInvuln}update(e,t,n){let r=this.player,i=r.base,a=r.stats;if(this.cooldown=Math.max(0,this.cooldown-e),!this.active&&t.wasPressed(`Space`)&&this.cooldown<=0&&a.stamina>=this.cost&&r.ctx.mode===`play`&&(this.dir.copy(n.lengthSq()>0?n:r.facing).setY(0).normalize(),r.facing.copy(this.dir),this.time=0,a.stamina-=this.cost,r.staminaDelay=i.staminaRegenDelay,r.attack.cancel(),r.ctx.bus.emit(`player:roll`,{position:r.position.clone()})),!this.active)return!1;this.time+=e;let o=i.rollDistance/i.rollDuration;r.velocity.copy(this.dir).multiplyScalar(o),r.position.addScaledVector(r.velocity,e),r.ctx.world.resolveCollision(r.position,r.radius);let s=Math.min(1,this.time/i.rollDuration);return r.inner.rotation.x=s*Math.PI*2,r.inner.position.y=Math.sin(s*Math.PI)*.25,this.time>=i.rollDuration&&(this.time=-1,this.cooldown=i.rollCooldown,r.inner.rotation.x=0),!0}},ql=class{constructor(e){this.p=e,this.time=-1,this.timer=0,this.hitDone=!0,this.dir=new W(0,0,1),this.count=0,this.spinning=!1,this.setWeapon(`sword`,Gl)}get swinging(){return this.time>=0}cancel(){this.time=-1}setWeapon(e,t){let n=this.p;this.type=e,this.w=n.ctx.data.weapons[e],n.swordPivot.remove(n.weapon),n.weapon=Vl(e,t),n.swordPivot.add(n.weapon),n.mesh.remove(n.trail),n.trail=Hl(this.w.range,this.w.arcDeg),n.mesh.add(n.trail)}aimPoint(e){let t=this.p;return e.virtualAttack?t.nearestEnemy(this.type===`bow`?this.w.autoAimRange:void 0)?.position:t.ctx.mouseGround}update(e){let t=this.p,n=t.stats,r=t.base,i=this.w,a=t.ctx.input;if(this.timer=Math.max(0,this.timer-e),t.ctx.mode===`play`&&a.attackHeld&&this.timer<=0&&n.stamina>=i.staminaCost){let e=this.aimPoint(a);if(e){let n=new W(e.x-t.position.x,0,e.z-t.position.z);n.lengthSq()>.01&&t.facing.copy(n.normalize())}this.dir.copy(t.facing),this.time=0,this.hitDone=!1,this.count+=1,this.spinning=this.type!==`bow`&&n.spin>0&&this.count%r.spinEvery===0,this.timer=i.cooldown*Math.max(.3,1-n.attackSpeed),n.stamina-=i.staminaCost,t.staminaDelay=r.staminaRegenDelay}this.time<0||(this.time+=e,!this.hitDone&&this.time>=i.hitTime&&(this.hitDone=!0,this.release()),this.time>=i.duration&&(this.time=-1))}release(){let e=this.p,t=e.stats,n=e.base,r=this.w,i=e.ctx.bus,a=t.attack*r.damageMult,o={critChance:t.critChance,critMultiplier:n.critMultiplier+(t.critDamage??0),weapon:this.type};if(this.type===`bow`){i.emit(`player:shoot`,{origin:e.position.clone().setY(1),dir:this.dir.clone(),speed:r.arrowSpeed,range:r.range,count:1+Math.round(t.multiShot??0),spread:Vt.degToRad(r.spreadDeg),attack:a,knockback:r.knockback,...o});return}i.emit(`player:attack`,{origin:e.position.clone(),dir:this.dir.clone(),range:r.range,arc:this.spinning?Math.PI*2:Vt.degToRad(r.arcDeg),attack:this.spinning?a*(1+n.spinDamagePerRank*t.spin):a,knockback:r.knockback,...o}),r.shockEvery&&this.count%r.shockEvery===0&&(i.emit(`player:attack`,{origin:e.position.clone(),dir:this.dir.clone(),range:r.shockRadius,arc:Math.PI*2,attack:a*r.shockMult,knockback:r.knockback,...o,shock:!0}),i.emit(`player:shock`,{position:e.position.clone(),radius:r.shockRadius}))}animate(e){let t=this.p,n=t.swordPivot;if(t.inner.rotation.y=0,t.spinTrail.material.opacity=0,n.rotation.x=0,n.position.z=0,this.time<0){let r=this.type===`bow`?.2:.9;n.rotation.y+=(r-n.rotation.y)*Math.min(1,e*10),t.trail.material.opacity=0;return}let r=Math.min(1,this.time/this.w.duration),i=1-(1-r)**3,a=this.w.swing;a===`thrust`?(n.rotation.y=.15,n.position.z=Math.sin(r*Math.PI)*.7):a===`smash`?(n.rotation.y=.3,n.rotation.x=Vt.lerp(-1.4,.5,i)):a===`shoot`?(n.rotation.y=0,n.position.z=-Math.sin(r*Math.PI)*.15):n.rotation.y=Vt.lerp(1.4,-1.6,i),this.spinning?(t.inner.rotation.y=-i*Math.PI*2,t.spinTrail.material.opacity=.45*(1-r),t.trail.material.opacity=0):t.trail.material.opacity=a===`shoot`?0:.45*(1-r)}},Jl=class{constructor(e){this.ctx=e,this.base=e.data.player;let t=this.base;this.stats={maxHp:t.hp,hp:t.hp,maxStamina:t.stamina,stamina:t.stamina,attack:t.attack,defense:t.defense,moveSpeed:t.moveSpeed,critChance:t.critChance,hpRegen:t.hpRegen,attackSpeed:0,spin:0},this.radius=t.radius,this.position=e.world.spawnPoint.clone(),this.facing=new W(0,0,1),this.velocity=new W,this.knock=new W,this.alive=!0,this.speedMult=1,this.attackTimer=0,this.staminaDelay=0,this.invuln=0,this.deathTimer=0,this.walkPhase=0,this.flash=0,this.roll=new Kl(this),this.runTick=0;let n=Ul(t);Object.assign(this,n),this.mesh=n.group,e.scene.add(this.mesh),this.attack=new ql(this),this.syncMesh(0),e.bus.on(`equipment:changed`,({slots:t})=>{let n=e.data.items.items,r=t.weapon&&n[t.weapon];this.attack.setWeapon(r?.weaponType??`sword`,r?r.color:Gl),Wl(this,{head:n[t.head],body:n[t.body],feet:n[t.feet]})}),e.bus.on(`player:heal`,({amount:e})=>{this.alive&&(this.stats.hp=Math.min(this.stats.maxHp,this.stats.hp+e))}),e.bus.on(`item:use`,t=>{let n=e.data.items.items[t.item]?.use?.heal,r=this.stats;if(!n||!this.alive||r.hp>=r.maxHp)return;let i=Math.min(n,r.maxHp-r.hp);r.hp+=i,t.used=!0,e.bus.emit(`combat:hit`,{position:this.position.clone(),amount:`+${Math.round(i)}`,crit:!1,target:`heal`})}),e.bus.on(`player:teleport`,({position:e})=>{this.position.copy(e),this.knock.set(0,0,0),this.attack.cancel()}),e.bus.on(`save:collect`,e=>this.collectSave(e)),e.bus.on(`save:apply`,e=>this.applySave(e.player)),e.bus.on(`save:loaded`,()=>{if(!this.loadedVitals)return;let e=this.stats;e.hp=Math.max(1,Math.min(e.maxHp,this.loadedVitals.hp)),e.stamina=Math.min(e.maxStamina,this.loadedVitals.stamina),this.loadedVitals=null})}collectSave(e){let t=this.stats,n=this.alive?this.position:this.ctx.world.spawnPoint;e.player={position:[n.x,n.z],hp:this.alive?t.hp:t.maxHp,stamina:this.alive?t.stamina:t.maxStamina}}applySave(e){e&&(this.position.set(e.position[0],0,e.position[1]),this.ctx.world.resolveCollision(this.position,this.radius),this.loadedVitals={hp:e.hp,stamina:e.stamina})}update(e){let t=this.base,n=this.stats,r=this.ctx.input;if(this.flash=Math.max(0,this.flash-e),this.invuln=Math.max(0,this.invuln-e),this.attackTimer=Math.max(0,this.attackTimer-e),!this.alive){this.deathTimer-=e,this.deathTimer<=0&&this.respawn(),this.syncMesh(e);return}let i=r.moveVector(),a=new W(i.x,0,i.z),o=i.amount>0;if(o&&a.normalize(),this.roll.update(e,r,a)){this.regen(e),this.syncMesh(e);return}let s=n.moveSpeed*this.speedMult*(o?Math.max(.35,i.amount):1),c=r.isDown(`ShiftLeft`)||r.isDown(`ShiftRight`)||i.stick&&i.amount>=this.ctx.data.config.touch.runThreshold;o&&c&&n.stamina>0&&(s*=t.runMultiplier,this.runTick+=1,this.runTick%4==0&&this.ctx.bus.emit(`player:running`,{position:this.position}),n.stamina=Math.max(0,n.stamina-t.staminaRunCost*e),this.staminaDelay=t.staminaRegenDelay),this.attack.swinging&&(s*=t.attackMoveMultiplier),this.velocity.copy(a).multiplyScalar(s),this.position.addScaledVector(this.velocity,e),this.position.addScaledVector(this.knock,e),this.knock.multiplyScalar(Math.exp(-10*e)),this.ctx.world.resolveCollision(this.position,this.radius),o&&!this.attack.swinging&&this.facing.copy(a),o&&(this.walkPhase+=e*s*2.2),this.regen(e),this.attack.update(e),this.syncMesh(e)}regen(e){let t=this.base,n=this.stats;this.staminaDelay-=e,this.staminaDelay<=0&&(n.stamina=Math.min(n.maxStamina,n.stamina+t.staminaRegen*(1+(n.staminaRegenPct??0))*e));let r=n.baseRegenMult&&Ll(this.ctx.bases,this.position);n.hp=Math.min(n.maxHp,n.hp+n.hpRegen*(r?1+n.baseRegenMult:1)*e)}nearestEnemy(e){let t=(e,t)=>{let n=null,r=t;for(let t of e){if(!t.alive||t.untargetable)continue;let e=t.position.distanceTo(this.position)-t.radius;e<r&&(r=e,n=t)}return n},{config:n}=this.ctx.data;return e?t(this.ctx.monsters,e):t(this.ctx.monsters,n.touch.autoAimRange)??t(this.ctx.nodes??[],n.gather.autoAimRange)}takeDamage(e,t){if(!this.alive||this.invuln>0||this.roll.invulnerable)return!1;let n=this.stats,r=Math.max(1,Math.round(e*(1+(n.damageTaken??0))));return n.hp=Math.max(0,n.hp-r),this.invuln=this.base.invulnTime,this.flash=.18,t&&this.knock.copy(t).multiplyScalar(this.base.knockback),this.ctx.bus.emit(`player:damaged`,{amount:r,hp:n.hp}),n.hp<=0&&this.die(),!0}applyDot(e){if(!this.alive)return!1;let t=this.stats;return t.hp=Math.max(0,t.hp-e),t.hp<=0&&this.die(),!0}die(){this.alive=!1,this.attack.cancel(),this.deathTimer=this.base.respawnDelay,this.ctx.bus.emit(`player:died`,{position:this.position.clone()})}respawn(){let e=this.stats;this.alive=!0,this.speedMult=1,e.hp=e.maxHp,e.stamina=e.maxStamina,this.knock.set(0,0,0),this.invuln=this.base.invulnTime*2;let t=Rl(this.ctx.bases,this.position);t?this.position.set(t.position.x,0,t.position.z+t.tent.radius+1.2):this.position.copy(this.ctx.world.spawnPoint),this.ctx.bus.emit(`player:respawned`,{position:this.position.clone()})}syncMesh(e){let t=this.mesh;t.position.copy(this.position);let n=Math.atan2(this.facing.x,this.facing.z)-t.rotation.y;n=Math.atan2(Math.sin(n),Math.cos(n)),t.rotation.y+=n*Math.min(1,e*18);let r=this.velocity.lengthSq()>.01,i=r?Math.abs(Math.sin(this.walkPhase))*.08:0;this.roll.active||(this.inner.position.y=i),this.footL.position.z=r?Math.sin(this.walkPhase)*.14:0,this.footR.position.z=r?-Math.sin(this.walkPhase)*.14:0,this.attack.animate(e),this.roll.active||(this.inner.rotation.x=this.alive?0:Math.min(Math.PI/2,this.inner.rotation.x+e*6)),t.visible=this.alive&&this.invuln>0?Math.floor(this.invuln*20)%2==0:!0;let a=this.flash>0?.8:0;for(let e of this.bodyMats)e.emissive.setRGB(a,a*.3,a*.3)}},Yl=new W,Xl=class{constructor(e){this.ctx=e,this.cfg=e.data.config.combat,e.bus.on(`player:attack`,e=>this.onPlayerAttack(e)),e.bus.on(`monster:attack`,e=>this.onMonsterAttack(e)),e.bus.on(`projectile:hit`,e=>this.onProjectileHit(e)),e.bus.on(`projectile:explode`,e=>this.onExplode(e)),e.bus.on(`boss:aoe`,e=>this.areaHitPlayer(e)),e.bus.on(`monster:emerge`,e=>this.areaHitPlayer(e)),e.bus.on(`monster:blast`,e=>this.onBlast(e)),e.bus.on(`boss:line`,e=>this.onLine(e)),e.bus.on(`monster:charge-hit`,({monster:e,dir:t})=>{e.alive&&this.hitPlayer(e.stats.attack,t,e.def.hitEffect)}),e.bus.on(`enemy:hit-player`,e=>this.hitPlayer(e.damage,e.dir,e.effect)),e.bus.on(`arrow:hit`,({monster:e,shot:t,dir:n})=>{e.alive&&!e.untargetable&&this.playerHits(e,t,n.clone())}),e.bus.on(`status:damage`,({target:t,amount:n})=>{if(t===e.player){t.applyDot(n)&&e.bus.emit(`combat:hit`,{position:t.position.clone(),amount:n,crit:!1,target:`player`,source:`status`});return}let r=t;if(!r.alive)return;let i=r.takeDamage(n,null);e.bus.emit(`combat:hit`,{position:r.position.clone(),amount:n,crit:!1,target:`monster`,source:`status`,color:`#7cd67a`}),i&&this.killed(r,!0)})}killed(e,t=!1,n=!1){let{bus:r}=this.ctx,i=this.ctx.player.stats.onKillHeal;t&&i&&r.emit(`player:heal`,{amount:i}),r.emit(`monster:killed`,{type:e.type,position:e.position.clone(),color:e.def.color,radius:e.radius,boss:!!e.boss,elite:!!e.elite,noLoot:n}),e.def.splitInto&&r.emit(`monster:spawn`,{type:e.def.splitInto,count:e.def.splitCount,position:e.position.clone(),mult:e.statMult,night:e.night,spread:e.radius})}calcDamage(e,t,n=0,r=1){let i=this.cfg.variance,a=(e-t)*(1+(Math.random()*2-1)*i),o=Math.random()<n;return o&&(a*=r),{amount:Math.max(this.cfg.minDamage,Math.round(a)),crit:o}}onPlayerAttack(e){let{bus:t,monsters:n}=this.ctx,r=e.arc/2;for(let t of n){if(!t.alive||t.untargetable)continue;Yl.set(t.position.x-e.origin.x,0,t.position.z-e.origin.z);let n=Yl.length();if(!(n-t.radius>e.range)){if(n>t.radius){if(Yl.divideScalar(n),Yl.angleTo(e.dir)>r)continue}else Yl.copy(e.dir);this.playerHits(t,e,Yl.clone())}}}playerHits(e,t,n){let r=this.ctx.player.stats,i=(e.night||e.raid)&&r.nightBonus?1+r.nightBonus:1,{amount:a,crit:o}=this.calcDamage(t.attack*i,e.stats.defense,t.critChance,t.critMultiplier),s=e.takeDamage(a,n.multiplyScalar(t.knockback));if(this.ctx.bus.emit(`combat:hit`,{position:e.position.clone(),amount:a,crit:o,target:`monster`,source:`player`,color:e.def.color}),s){this.killed(e,!0);return}r.onHitPoison&&this.ctx.bus.emit(`status:apply`,{target:e,type:`poison`,duration:r.onHitPoison}),r.onHitSlow&&this.ctx.bus.emit(`status:apply`,{target:e,type:`slow`,duration:2,amount:r.onHitSlow})}onProjectileHit({monster:e,damage:t,dir:n}){if(!e.alive||e.untargetable)return;let{amount:r,crit:i}=this.calcDamage(t,e.stats.defense),a=e.takeDamage(r,n.clone().multiplyScalar(this.cfg.projectileKnockback));this.ctx.bus.emit(`combat:hit`,{position:e.position.clone(),amount:r,crit:i,target:`monster`,source:`turret`,color:e.def.color}),a&&this.killed(e)}areaHitPlayer({position:e,radius:t,damage:n}){let r=this.ctx.player;if(Math.hypot(r.position.x-e.x,r.position.z-e.z)>t+r.radius)return;let i=new W(r.position.x-e.x,0,r.position.z-e.z);this.hitPlayer(n,i.lengthSq()>1e-4?i.normalize():null)}hitPlayer(e,t,n){let{player:r,bus:i}=this.ctx;if(!r.alive)return;let{amount:a}=this.calcDamage(e,r.stats.defense);r.takeDamage(a,t)&&(i.emit(`combat:hit`,{position:r.position.clone(),amount:a,crit:!1,target:`player`}),n&&i.emit(`status:apply`,{target:r,...n}))}onBlast({monster:e,position:t,radius:n,damage:r,multiplier:i}){if(e.alive){e.takeDamage(e.stats.hp,null),this.killed(e,!1,!0),this.areaHitPlayer({position:t,radius:n,damage:r});for(let e of this.ctx.structures)e.alive&&(Math.hypot(e.position.x-t.x,e.position.z-t.z)>n+e.radius||this.damageStructure(e,r*i))}}onLine({origin:e,dir:t,length:n,width:r,damage:i}){let a=this.ctx.player,o=a.position.x-e.x,s=a.position.z-e.z,c=Math.max(0,Math.min(n,o*t.x+s*t.z));Math.hypot(o-t.x*c,s-t.z*c)>r/2+a.radius||this.hitPlayer(i,t.clone())}onExplode({position:e,radius:t,minFactor:n,damage:r}){for(let i of this.ctx.monsters){if(!i.alive)continue;let a=Math.hypot(i.position.x-e.x,i.position.z-e.z);if(a>t+i.radius)continue;let o=1-(1-n)*Math.min(1,a/t),s=new W(i.position.x-e.x,0,i.position.z-e.z).normalize();this.onProjectileHit({monster:i,damage:r*o,dir:s.multiplyScalar(2)})}}hitStructure(e,t){if(!t.alive||e.position.distanceTo(t.position)>e.stats.attackRange+t.radius+e.radius*.5)return;let n=e.def.structureDamageMultiplier??1;this.damageStructure(t,e.stats.attack*n)}damageStructure(e,t){let{bus:n}=this.ctx,{amount:r}=this.calcDamage(t,0),i=e.takeDamage(r);if(n.emit(`combat:hit`,{position:e.position.clone(),amount:r,crit:!1,target:`structure`}),i){n.emit(`structure:destroyed`,{structure:e});let t=e.kind===`tent`?e.base.name:e.def.name;n.emit(`notify`,{text:`${t}이(가) 부서졌습니다!`,kind:`warn`})}}onMonsterAttack({monster:e,target:t}){let{bus:n,player:r}=this.ctx;if(t&&t!==r){this.hitStructure(e,t);return}if(!r.alive||!e.alive)return;Yl.set(r.position.x-e.position.x,0,r.position.z-e.position.z);let i=Yl.length();if(i>e.stats.attackRange+r.radius+e.radius*.5)return;let{amount:a}=this.calcDamage(e.stats.attack,r.stats.defense);i>1e-4&&Yl.divideScalar(i),r.takeDamage(a,Yl)&&(n.emit(`combat:hit`,{position:r.position.clone(),amount:a,crit:!1,target:`player`}),e.def.hitEffect&&n.emit(`status:apply`,{target:r,...e.def.hitEffect}))}},Zl=(e,t={})=>new Qi({color:e,flatShading:!0,roughness:.6,...t});function Ql(e){let t=e.radius,n=new Rn,r=Zl(e.color,{transparent:!0,opacity:.95}),i=[],a=(e,r,i,a,o,s=[1,1,1])=>{let c=new X(e,r);return c.position.set(i*t,a*t,o*t),c.scale.set(...s),c.castShadow=!0,n.add(c),c};return{r:t,body:n,mat:r,extraMats:i,add:a,other:(e,t)=>{let n=Zl(e,{transparent:!0,...t});return i.push(n),n},eyes:(e,n,r=.3,i=2303534)=>{let o=new Bi(t*.1,6,4),s=new Qr({color:i});for(let t of[-1,1])a(o,s,t*r,e,n)}}}var $l={bee(e){let t=Ql(e),{r:n,add:r,mat:i,other:a}=t;r(new Bi(n,10,8),i,0,0,0,[.9,.85,1.2]);let o=a(`#2b2b33`);for(let e of[-.3,.2])r(new Vi(n*.88,n*.12,4,14),o,0,0,e).rotation.y=Math.PI/2;let s=a(`#ffffff`,{opacity:.55,depthWrite:!1});return t.wings=[-1,1].map(e=>{let t=r(new Mi(n*.7,10),s,e*.7,.8,0);return t.rotation.set(-Math.PI/2,0,e*.4),t}),r(new Ni(n*.15,n*.4,4).rotateX(-Math.PI/2),o,0,0,-1.25),t.eyes(.25,.95),t},rabbit(e){let t=Ql(e),{add:n,mat:r,other:i}=t;n(new Ii(t.r,1),r,0,.8,0,[1,.85,1.15]),n(new Ii(t.r*.6,1),r,0,1.45,.7);for(let e of[-1,1])n(new ji(t.r*.12,t.r*.8,2,6),r,e*.2,2.2,.55).rotation.x=-.3;return n(new Ni(t.r*.1,t.r*.5,5),i(`#ffd9a0`),0,1.9,1.05).rotation.x=.7,t.eyes(1.5,1.2,.22),t},puff(e){let t=Ql(e),{add:n,mat:r,other:i}=t;n(new Z(t.r*.35,t.r*.45,t.r*.8,7),i(`#f4e6cf`),0,.4,0),n(new Bi(t.r*1.05,10,7),r,0,1.15,0,[1,.85,1]);let a=i(`#e6d3ff`);for(let e=0;e<5;e++)n(new Bi(t.r*.16,6,4),a,Math.cos(e*1.3)*.8,1.35+e%2*.2,Math.sin(e*1.3)*.8);return t.eyes(.75,.42,.18),t},wolf(e){let t=Ql(e),{add:n,mat:r,other:i}=t;n(new ji(t.r*.5,t.r*1.2,3,8).rotateX(Math.PI/2),r,0,.9,0),n(new Ni(t.r*.45,t.r*.9,6).rotateX(Math.PI/2),r,0,1.1,1.2);for(let e of[-1,1])n(new Ni(t.r*.14,t.r*.35,4),r,e*.22,1.5,.9);let a=i(`#d9e8a0`);for(let e=0;e<4;e++)n(new Ni(t.r*.1,t.r*.4,4),a,0,1.45,.5-e*.35);for(let[e,i]of[[-.3,.5],[.3,.5],[-.3,-.5],[.3,-.5]])n(new Z(t.r*.1,t.r*.1,t.r*.7,5),r,e,.35,i);return t.eyes(1.2,1.45,.16,16769126),t},stump(e){let t=Ql(e),{add:n,mat:r,other:i}=t;n(new Z(t.r*.8,t.r*.95,t.r*1.4,8),r,0,.7,0),n(new Z(t.r*.78,t.r*.78,.04,8),i(`#e0c38a`),0,1.42,0);let a=i(`#6fae4a`);for(let e=0;e<5;e++)n(new Ii(t.r*.28,0),a,Math.cos(e*1.25)*.45,1.6,Math.sin(e*1.25)*.45);for(let e of[-1,1])n(new Z(t.r*.12,t.r*.16,t.r*.9,5),r,e*.95,.7,.1).rotation.z=e*.6;return t.eyes(1,.8,.28,16773808),t},scorpion(e){let t=Ql(e),{add:n,mat:r}=t;n(new Bi(t.r,10,6),r,0,.45,0,[1.1,.5,1.4]);for(let e of[-1,1])n(new Z(t.r*.1,t.r*.12,t.r*.8,5),r,e*.55,.45,1).rotation.x=Math.PI/2-.3,n(new Bi(t.r*.25,6,4),r,e*.62,.5,1.5,[1,.6,1.3]);for(let e=0;e<4;e++)n(new Bi(t.r*(.22-e*.03),6,4),r,0,.6+e*.35,-1-e*.12+Math.max(0,e-2)*.35);return n(new Ni(t.r*.12,t.r*.35,4),r,0,1.85,-.9).rotation.x=2.2,t.eyes(.7,1.15,.18),t},mole(e){let t=Ql(e),{add:n,mat:r,other:i}=t;n(new Ii(t.r,1),r,0,.9,0,[1,.95,1.05]),n(new Bi(t.r*.2,6,4),i(`#ff9fb0`),0,.9,1.05);let a=i(`#f4efe3`);for(let e of[-1,1])n(new Ni(t.r*.18,t.r*.4,4),a,e*.7,.5,.7).rotation.x=Math.PI/2;return t.eyes(1.15,.85,.28),t},tumble(e){let t=Ql(e),{add:n,mat:r,other:i}=t;n(new Ii(t.r,1),r,0,1,0,[1,1,1]).material.wireframe=!1;let a=i(`#8a6440`);for(let e=0;e<10;e++)n(new Z(t.r*.04,t.r*.04,t.r*2.1,3),a,0,1,0).rotation.set(e*.7,e*1.3,e*.4);return t.eyes(1.2,.95,.25),t},wisp(e){let t=Ql(e),{add:n,mat:r,other:i}=t;r.emissive=new J(`#4a8aaa`),n(new Ii(t.r*.8,1),r,0,0,0);let a=i(`#ffffff`,{opacity:.8,emissive:new J(`#6fb8d8`)});for(let e=0;e<6;e++)n(new Li(t.r*.28,0),a,Math.cos(e*1.05)*1.2,0,Math.sin(e*1.05)*1.2);return t.eyes(.15,.75,.22),t},yeti(e){let t=Ql(e),{add:n,mat:r,other:i}=t;n(new Ii(t.r,1),r,0,.95,0,[1.05,1.05,.95]),n(new Bi(t.r*.45,8,6),i(`#8fb8e8`),0,1.05,.72,[1,.9,.5]);for(let e of[-1,1])n(new Ii(t.r*.35,0),r,e*1,.7,.1);return t.eyes(1.15,.95,.18),t},snowman(e){let t=Ql(e),{add:n,mat:r,other:i}=t;return n(new Bi(t.r,10,8),r,0,.9,0),n(new Bi(t.r*.68,10,8),r,0,2.2,0),n(new Ni(t.r*.1,t.r*.5,6).rotateX(Math.PI/2),i(`#ff8a3d`),0,2.2,.8),n(new Z(t.r*.04,t.r*.04,t.r*.5,4),i(`#3a3e47`),0,3.05,0),n(new Li(t.r*.12,0),new Qr({color:16757575}),0,3.35,0),t.eyes(2.35,.6,.2),t},kingslime(e){let t=Ql(e),{add:n,mat:r,other:i}=t;r.opacity=.9,n(new Ii(t.r,2),r,0,.78,0,[1,.78,1]);let a=i(`#ffd23f`,{metalness:.5,emissive:new J(`#6b5010`)});n(new Z(t.r*.4,t.r*.45,t.r*.3,8),a,0,1.55,0);for(let e=0;e<5;e++)n(new Ni(t.r*.08,t.r*.25,4),a,Math.cos(e*1.26)*.38,1.8,Math.sin(e*1.26)*.38);return t.eyes(.95,.85,.3),t},treant(e){let t=Ql(e),{add:n,mat:r,other:i}=t,a=i(`#7a5234`);n(new Z(t.r*.55,t.r*.75,t.r*1.8,8),a,0,.9,0),n(new Ii(t.r*1.1,1),r,0,2.2,0,[1.15,.85,1.15]);for(let e of[-1,1])n(new Z(t.r*.12,t.r*.18,t.r*1.3,5),a,e*.85,1.2,.2).rotation.z=e*.9;for(let e of[-1,1])n(new Z(t.r*.18,t.r*.25,t.r*.6,5),a,e*.4,.2,0);return t.eyes(1.35,.72,.22,16773808),t}};function eu(e){if($l[e.shape]){let{body:t,mat:n,extraMats:r,wings:i}=$l[e.shape](e);return{body:t,mat:n,extraMats:r,wings:i}}let t=e.radius,n=new Rn,r=new Qi({color:e.color,flatShading:!0,roughness:.35,transparent:!0,opacity:.92}),i=new Qi({color:2303534,flatShading:!0}),a=new Bi(t*.11,6,4),o=(e,r)=>{for(let o of[-1,1]){let s=new X(a,i);s.position.set(o*t*.3,e,r),n.add(s)}};if(e.shape===`cactus`){let i=new X(new Z(t*.55,t*.65,t*1.9,8),r);i.position.y=t*.95,i.castShadow=!0,n.add(i);for(let e of[-1,1]){let i=new X(new Z(t*.22,t*.22,t*.8,6),r);i.position.set(e*t*.72,t*1.25,0);let a=new X(new Z(t*.22,t*.22,t*.5,6),r);a.rotation.z=Math.PI/2,a.position.set(e*t*.55,t*.9,0),n.add(i,a)}let a=new X(new Li(t*.25,0),new Qr({color:e.flowerColor}));return a.position.y=t*1.95,n.add(a),o(t*1.25,t*.58),{body:n,mat:r,extraMats:[]}}if(e.shape===`golem`){let e=new X(new Fi(t*.85,0),r);e.position.y=t*1.05,e.scale.set(1.1,1,.9);let i=new X(new Ai(t*.8,t*.6,t*.7),r);i.position.y=t*1.95;for(let t of[e,i])t.castShadow=!0,n.add(t);for(let e of[-1,1]){let i=new X(new Ii(t*.38,0),r);i.position.set(e*t*1.05,t*.7,t*.1),i.castShadow=!0,n.add(i)}let a=new Qr({color:15268863});for(let e of[-1,1]){let r=new X(new Ai(t*.14,t*.08,t*.05),a);r.position.set(e*t*.18,t*2,t*.36),n.add(r)}return{body:n,mat:r,extraMats:[]}}if(e.shape===`mushroom`){let i=new Qi({color:e.stemColor,flatShading:!0,roughness:.6,transparent:!0}),a=new X(new Z(t*.55,t*.7,t*1.1,7),i);a.position.y=t*.55;let s=new X(new Bi(t*1.15,8,5,0,Math.PI*2,0,Math.PI/2),r);s.position.y=t*1,s.scale.y=.8;let c=new Qr({color:16774888}),l=new Bi(t*.16,6,4);for(let[e,r]of[[.3,.65],[2.4,.5],[4.2,.6],[1.3,.9]]){let i=new X(l,c);i.position.set(Math.cos(e)*t*.75*r,t*1+t*.9*(1-r*.6),Math.sin(e)*t*.75*r),n.add(i)}return a.castShadow=!0,s.castShadow=!0,n.add(a,s),o(t*.7,t*.6),{body:n,mat:r,extraMats:[i]}}let s=new X(new Ii(t,1),r);s.scale.set(1,.78,1),s.position.y=t*.78,s.castShadow=!0;let c=new X(new Bi(t*.14,6,4),new Qr({color:16777215,transparent:!0,opacity:.7}));return c.position.set(-t*.35,t*1.2,t*.3),n.add(s,c),o(t*.95,t*.82),{body:n,mat:r,extraMats:[]}}var tu=class{constructor(e,t=16739179){this.group=new Rn;let n=new X(new Ri(e,.14),new Qr({color:2829107,depthTest:!1})),r=new Ri(e-.04,.09);r.translate((e-.04)/2,0,0),this.fill=new X(r,new Qr({color:t,depthTest:!1})),this.fill.position.set(-(e-.04)/2,0,.001),n.renderOrder=10,this.fill.renderOrder=11,this.group.add(n,this.fill),this.group.visible=!1}update(e,t,n){this.group.visible=n,n&&(this.group.quaternion.copy(t.quaternion),this.fill.scale.x=Math.max(.001,e))}};function nu(e){let t=e.ctx.player,n=new W(t.position.x-e.position.x,0,t.position.z-e.position.z);return{v:n,dist:n.length(),player:t,sees:t.alive&&n.length()<e.def.detectRange}}function ru(e,t,n){let r=e.def;if(!e.target){if(e.pause-=t,e.pause<=0){let t=Al.range(0,Math.PI*2),n=Al.range(1,r.wanderRadius);e.target=new W(e.home.x+Math.cos(t)*n,0,e.home.z+Math.sin(t)*n)}return 0}return n.set(e.target.x-e.position.x,0,e.target.z-e.position.z),n.length()<.3||e.stateTime>8?(e.target=null,e.stateTime=0,e.pause=Al.range(r.wanderPauseMin,r.wanderPauseMax),n.set(0,0,0),0):r.moveSpeed}function iu(e){e.home.copy(e.position),e.target=null,e.setState(`wander`)}function au(e){let t=new X(new Mi(e,32).rotateX(-Math.PI/2),new Qr({color:16731469,transparent:!0,opacity:0,depthWrite:!1}));return t.position.y=.05,t.visible=!1,t}function ou(e,t){let n=new X(new Ri(t,e).rotateX(-Math.PI/2).translate(0,0,e/2),new Qr({color:16731469,transparent:!0,opacity:0,depthWrite:!1}));return n.position.y=.05,n.visible=!1,n}var su={melee:{flees:!0,think(e,t){let n=e.def,{v:r,dist:i,player:a,sees:o}=nu(e),s=new W,c=0;switch(e.attackTarget=a,e.state){case`wander`:if(o){e.setState(`chase`);break}c=ru(e,t,s);break;case`chase`:if(!a.alive||i>n.loseRange){iu(e);break}if(i<=n.attackRange+a.radius&&e.cooldown<=0){e.setState(`attack`);break}s.copy(r),c=i>n.attackRange*.8?n.chaseSpeed:0;break;case`attack`:e.attackStep(`chase`);break;case`flee`:s.copy(r).multiplyScalar(-1),c=n.fleeSpeed,e.stateTime>=n.fleeDuration&&iu(e)}return{move:s,speed:c}}},charger:{init(e){let t=e.def;e.bs.line=ou(t.chargeDistance,e.radius*1.6),e.mesh.add(e.bs.line),e.bs.dir=new W},think(e,t){let n=e.def,r=e.bs,{v:i,dist:a,player:o,sees:s}=nu(e),c=new W,l=0;switch(e.attackTarget=o,e.state){case`wander`:if(s){e.setState(`chase`);break}l=ru(e,t,c);break;case`chase`:if(!o.alive||a>n.loseRange){iu(e);break}if(a<n.chargeDistance*.9&&e.cooldown<=0){r.dir.copy(i).normalize(),e.facing.copy(r.dir),r.line.rotation.y=Math.atan2(r.dir.x,r.dir.z),r.line.visible=!0,e.setState(`aim`);break}c.copy(i),l=n.chaseSpeed;break;case`aim`:r.line.material.opacity=.15+.35*Math.min(1,e.stateTime/n.chargeWindup),e.stateTime>=n.chargeWindup&&(r.line.visible=!1,r.traveled=0,r.hit=!1,e.setState(`charge`));break;case`charge`:{let i=n.chargeSpeed*t,a=e.position.x+r.dir.x*(i+e.radius),s=e.position.z+r.dir.z*(i+e.radius);if(e.ctx.world.isBlocked(a,s,.1)){e.setState(`stun`),e.ctx.bus.emit(`monster:stunned`,{monster:e});break}e.position.addScaledVector(r.dir,i),r.traveled+=i,!r.hit&&o.alive&&e.position.distanceTo(o.position)<e.radius+o.radius+.2&&(r.hit=!0,e.ctx.bus.emit(`monster:charge-hit`,{monster:e,dir:r.dir.clone()})),r.traveled>=n.chargeDistance&&(e.cooldown=n.chargeCooldown,e.setState(`chase`));break}case`stun`:e.stateTime>=n.stunTime&&(e.cooldown=n.chargeCooldown*.5,e.setState(`chase`))}return{move:c,speed:l}},animate(e,t){return e.state===`aim`?(e.body.scale.set(1.1,.8,1.1),!0):e.state===`stun`?(e.body.rotation.z=Math.sin(e.stateTime*18)*.25,!0):(e.body.rotation.z=0,!1)}},ranged:{think(e,t){let n=e.def,{v:r,dist:i,player:a,sees:o}=nu(e),s=new W,c=0;switch(e.state){case`wander`:if(o){e.setState(`chase`);break}c=ru(e,t,s);break;case`chase`:if(!a.alive||i>n.loseRange){iu(e);break}e.facing.copy(r).normalize(),i<n.keepDistance*.6?(s.copy(r).multiplyScalar(-1),c=n.chaseSpeed):i>n.keepDistance*1.2&&(s.copy(r),c=n.chaseSpeed),e.cooldown<=0&&i<n.keepDistance*1.7&&e.setState(`shoot`);break;case`shoot`:e.facing.copy(r).normalize(),e.stateTime>=n.shotWindup&&(e.ctx.bus.emit(`monster:shoot`,{monster:e,origin:e.position.clone().setY(e.def.flier?1.3:.7),dir:r.clone().normalize(),speed:n.shotSpeed,damage:e.stats.attack,effect:n.shotEffect,kind:n.shotKind??`spore`}),e.cooldown=n.shotCooldown,e.setState(`chase`))}return{move:s,speed:c}},animate(e){if(e.state!==`shoot`)return!1;let t=Math.min(1,e.stateTime/e.def.shotWindup);return e.body.scale.setScalar(1+t*.25),!0}},darter:{think(e,t){let n=e.def,{v:r,dist:i,player:a,sees:o}=nu(e),s=new W,c=0;switch(e.attackTarget=a,e.state){case`wander`:if(o){e.setState(`chase`);break}c=ru(e,t,s);break;case`chase`:if(!a.alive||i>n.loseRange){iu(e);break}s.copy(r),c=n.dartSpeed,i<=n.attackRange+a.radius&&(e.ctx.bus.emit(`monster:attack`,{monster:e,target:a}),e.setState(`retreat`));break;case`retreat`:s.copy(r).multiplyScalar(-1),s.x+=Math.sin(e.stateTime*3),c=n.dartSpeed*.8,(i>n.retreatDistance||e.stateTime>2)&&e.setState(`hover`);break;case`hover`:s.set(-r.z,0,r.x),c=n.moveSpeed,e.stateTime>.9&&e.setState(`chase`)}return{move:s,speed:c}}},burrower:{aggro:`burrow`,init(e){e.bs.mark=au(e.def.emergeRadius),e.mesh.add(e.bs.mark);let t=new X(new Bi(e.radius*1.2,8,4,0,Math.PI*2,0,Math.PI/2),new Qi({color:e.ctx.world.regionAt(e.position.x,e.position.z).ground[1],flatShading:!0}));t.scale.y=.4,t.visible=!1,e.mesh.add(t),e.bs.mound=t},think(e,t){let n=e.def,r=e.bs,{v:i,dist:a,player:o,sees:s}=nu(e),c=new W,l=0;switch(e.state){case`wander`:if(s){e.setState(`burrow`);break}l=ru(e,t,c);break;case`burrow`:if(e.untargetable=!0,r.mound.visible=!0,!o.alive||a>n.loseRange){e.untargetable=!1,r.mound.visible=!1,iu(e);break}c.copy(i),l=n.chaseSpeed*1.2,(e.stateTime>=n.burrowTime||a<.6)&&(r.mark.visible=!0,e.setState(`emerge`));break;case`emerge`:r.mark.material.opacity=.15+.35*Math.min(1,e.stateTime/n.emergeWindup),e.stateTime>=n.emergeWindup&&(r.mark.visible=!1,r.mound.visible=!1,e.untargetable=!1,e.ctx.bus.emit(`monster:emerge`,{monster:e,position:e.position.clone(),radius:n.emergeRadius,damage:e.stats.attack}),e.setState(`surface`));break;case`surface`:e.stateTime>=n.surfaceTime&&e.setState(`burrow`)}return{move:c,speed:l}},animate(e){let t=e.state===`burrow`||e.state===`emerge`;return e.body.visible=!t,e.state===`surface`&&e.stateTime<.3?(e.body.position.y=Math.sin(e.stateTime/.3*Math.PI)*.8,!0):t}},exploder:{think(e,t){let n=e.def,{v:r,dist:i,player:a,sees:o}=nu(e),s=new W,c=0;switch(e.state){case`wander`:if(o){e.setState(`chase`);break}c=ru(e,t,s);break;case`chase`:if(!a.alive||i>n.loseRange){iu(e);break}s.copy(r),c=n.chaseSpeed,i<n.triggerRange&&e.setState(`fuse`);break;case`fuse`:e.stateTime>=n.fuseTime&&e.alive&&e.ctx.bus.emit(`monster:blast`,{monster:e,position:e.position.clone(),radius:n.blastRadius,damage:e.stats.attack,multiplier:n.blastMultiplier})}return{move:s,speed:c}},animate(e){if(e.state!==`fuse`)return!1;let t=Math.min(1,e.stateTime/e.def.fuseTime);return e.body.scale.setScalar(1+t*.5),e.flash=Math.sin(e.stateTime*(10+t*30))>0?.05:0,!0}}},cu=new J(.22,.08,.32),lu=new J(.45,.33,.05),uu=new W,du=class{constructor(e,t,n){this.ctx=e,this.type=t,this.def=e.data.monsters[t];let r=this.def;this.stats={maxHp:r.hp,hp:r.hp,attack:r.attack,defense:r.defense,attackRange:r.attackRange},this.radius=r.radius,this.position=n.clone(),this.home=n.clone(),this.target=null,this.facing=new W(Al.range(-1,1),0,Al.range(-1,1)).normalize(),this.knock=new W,this.alive=!0,this.done=!1,this.state=`wander`,this.stateTime=0,this.pause=Al.range(r.wanderPauseMin,r.wanderPauseMax),this.cooldown=0,this.attacked=!1,this.hasFled=!1,this.flash=0,this.hopPhase=Al.range(0,Math.PI*2),this.hpBarTimer=0,this.speedMult=1,this.untargetable=!1,this.bs={},this.buildMesh(),this.behavior=su[r.behavior]??su.melee,this.behavior.init?.(this)}makeElite(e){this.elite=!0;let t=this.stats;t.maxHp=Math.round(t.maxHp*e.hp),t.hp=t.maxHp,t.attack=Math.round(t.attack*e.attack),this.radius*=e.scale,this.mesh.scale.setScalar(e.scale)}buildMesh(){let{body:e,mat:t,extraMats:n}=eu(this.def);this.body=e,this.mat=t,this.extraMats=n;let r=new Rn;if(r.add(e),this.def.flier){let e=new X(new Mi(this.def.radius*.9,16).rotateX(-Math.PI/2),new Qr({color:0,transparent:!0,opacity:.22,depthWrite:!1}));e.position.y=.04,r.add(e)}this.hpBar=new tu(.9),this.hpBar.group.position.y=this.def.radius*2+.35,r.add(this.hpBar.group),this.mesh=r,this.ctx.scene.add(r),this.mesh.position.copy(this.position)}setOpacity(e){this.mat.opacity=e;for(let t of this.extraMats)t.opacity=e}scaleStats(e){let t=this.stats;t.maxHp=Math.round(t.maxHp*e),t.hp=t.maxHp,t.attack=Math.round(t.attack*e),this.statMult=(this.statMult??1)*e}setState(e){this.state=e,this.stateTime=0,this.attacked=!1}update(e){if(this.stateTime+=e,this.cooldown=Math.max(0,this.cooldown-e),this.flash=Math.max(0,this.flash-e),this.hpBarTimer=Math.max(0,this.hpBarTimer-e),this.state===`dead`){let e=Math.min(1,this.stateTime/this.ctx.data.config.feedback.deathSquash);this.body.scale.set(1+e*.5,Math.max(.001,1-e),1+e*.5),this.body.position.y=0,this.setOpacity(.92*(1-e*.7)),e>=1&&(this.done=!0);return}let{move:t,speed:n}=this.think(e);n>0&&t.lengthSq()>1e-6&&(t.normalize(),this.facing.lerp(t,Math.min(1,e*8)).normalize(),this.position.addScaledVector(t,n*(this.speedMult??1)*e)),this.position.addScaledVector(this.knock,e),this.knock.multiplyScalar(Math.exp(-8*e)),this.separate(),this.def.flier?this.ctx.world.clampToBounds(this.position):this.ctx.world.resolveCollision(this.position,this.radius),this.animate(e,n)}think(e){return this.behavior.think(this,e)}attackStep(e){let t=this.def,n=this.attackTarget;uu.set(n.position.x-this.position.x,0,n.position.z-this.position.z),uu.lengthSq()>1e-6&&this.facing.copy(uu).normalize(),!this.attacked&&this.stateTime>=t.attackWindup&&(this.attacked=!0,this.knock.copy(this.facing).multiplyScalar(t.lungeSpeed),this.ctx.bus.emit(`monster:attack`,{monster:this,target:n})),this.stateTime>=t.attackWindup+t.attackRecover&&(this.cooldown=t.attackCooldown,this.setState(e))}separate(){for(let e of this.ctx.monsters){if(e===this||!e.alive)continue;let t=this.position.x-e.position.x,n=this.position.z-e.position.z,r=this.radius+e.radius,i=t*t+n*n;if(i<r*r&&i>1e-8){let e=Math.sqrt(i),a=(r-e)*.5;this.position.x+=t/e*a,this.position.z+=n/e*a}}}animate(e,t){let n=this.def;if(this.mesh.position.copy(this.position),this.body.rotation.y=Math.atan2(this.facing.x,this.facing.z),this.glow(e),this.hpBar.update(this.stats.hp/this.stats.maxHp,this.ctx.camera,this.hpBarTimer>0),this.behavior.animate?.(this,e,t))return;if(n.flier){this.hopPhase+=e*6,this.body.position.y=1.1+Math.sin(this.hopPhase)*.15,this.body.scale.setScalar(1);return}let r=1,i=0;if(this.state===`attack`&&!this.attacked)r=1-.35*Math.min(1,this.stateTime/n.attackWindup);else if(this.state===`attack`){let e=(this.stateTime-n.attackWindup)/n.attackRecover;i=Math.sin(Math.min(1,e)*Math.PI)*.6,r=1.15}else{this.hopPhase+=e*(t>0?3+t*1.6:2);let n=Math.abs(Math.sin(this.hopPhase));i=t>0?n*.35:0,r=t>0?.85+n*.3:1+Math.sin(this.hopPhase*2)*.04}this.body.position.y=i,this.body.scale.set(1/Math.sqrt(r),r,1/Math.sqrt(r))}glow(){let e=this.mat.emissive;this.flash>0?e.setRGB(1,1,1):this.elite?e.copy(lu):this.night?e.copy(cu):e.setRGB(0,0,0)}takeDamage(e,t){if(!this.alive||this.untargetable)return!1;for(let e of this.pack??[])e!==this&&e.alive&&e.alert();let n=this.stats;return n.hp=Math.max(0,n.hp-e),this.flash=.12,this.hpBarTimer=4,t&&this.knock.copy(t).multiplyScalar(1-this.def.knockbackResist),n.hp<=0?(this.alive=!1,this.hpBar.group.visible=!1,this.setState(`dead`),!0):(this.behavior.flees&&!this.hasFled&&n.hp/n.maxHp<=this.def.fleeHpRatio?(this.hasFled=!0,this.setState(`flee`)):this.alert(),!1)}alert(){this.state===`wander`&&this.setState(this.behavior.aggro??`chase`)}dispose(){this.ctx.scene.remove(this.mesh),this.mesh.traverse(e=>{e.isMesh&&(e.geometry.dispose(),e.material.dispose())})}},fu=class{constructor(e){this.ctx=e,this.cfg=e.data.config.spawner,this.timer=0,e.bus.on(`monster:spawn`,e=>this.spawnAt(e))}multAt(e,t){return this.ctx.world.regionAt(e.x,e.z).statMultiplier*(t?this.cfg.nightStatMultiplier:1)}create(e,t,n,r){let i=new du(this.ctx,e,t);return n!==1&&i.scaleStats(n),i.night=r,this.ctx.monsters.push(i),i}spawnAt({type:e,count:t=1,position:n,mult:r,night:i,spread:a=1}){let o=i??this.ctx.time.isNight,s=r??this.multAt(n,o);for(let r=0;r<t;r++){let i=r/t*Math.PI*2+Al.range(0,1),c=new W(n.x+Math.cos(i)*a,0,n.z+Math.sin(i)*a);this.ctx.world.resolveCollision(c,this.ctx.data.monsters[e].radius),this.create(e,c,s,o).alert()}}update(e){let{monsters:t,player:n}=this.ctx,r=this.cfg;for(let e=t.length-1;e>=0;e--){let i=t[e],a=!i.raid&&!i.boss&&i.position.distanceTo(n.position)>r.despawnDistance;(i.done||a&&i.alive)&&(i.dispose(),t.splice(e,1))}if(this.timer-=e,this.timer>0||(this.timer=r.interval,t.filter(e=>!e.raid&&!e.boss).length>=r.maxMonsters))return;let i=this.findSpot();if(!i)return;let a=this.ctx.world.regionAt(i.x,i.z),o=Al.pick(a.monsters),s=this.ctx.data.monsters[o],c=this.ctx.time.isNight,l=this.multAt(i,c),u=s.packMax?Al.int(s.packMin,s.packMax):1,d=[];for(let e=0;e<u;e++){let t=e===0?i:i.clone().add(new W(Al.range(-2,2),0,Al.range(-2,2)));e>0&&this.ctx.world.resolveCollision(t,s.radius);let n=this.create(o,t,l,c);u>1&&(n.pack=d,d.push(n)),Math.random()<this.ctx.data.config.elite.chance&&n.makeElite(this.ctx.data.config.elite)}}findSpot(){let{world:e,player:t}=this.ctx,n=this.cfg;for(let r=0;r<12;r++){let r=Al.range(0,Math.PI*2),i=Al.range(n.minDistance,n.maxDistance),a=t.position.x+Math.cos(r)*i,o=t.position.z+Math.sin(r)*i;if(e.isInside(a,o,4)&&!e.isBlocked(a,o,1)&&!Ll(this.ctx.bases,{x:a,z:o},3))return new W(a,0,o)}return null}},pu=18,mu=new Z(.2,.2,.06,10);mu.rotateX(Math.PI/2);var hu=new Ii(.18,0),gu=class{constructor(e,t,n,r,i){this.ctx=e,this.itemId=t,this.count=n,this.position=r.clone(),this.velocity=i.clone(),this.age=0,this.grounded=!1,this.done=!1;let a=e.data.items.items[t],o=a.category===`currency`,s=new Qi({color:a.color,flatShading:!0,roughness:o?.3:.5,metalness:o?.6:0,emissive:a.color,emissiveIntensity:.15});this.mesh=new X(o?mu:hu,s),this.mesh.castShadow=!0,this.spin=Math.random()*Math.PI*2,e.scene.add(this.mesh),this.sync()}update(e){this.age+=e,this.grounded||(this.velocity.y-=pu*e,this.position.addScaledVector(this.velocity,e),this.position.y<=0&&(this.position.y=0,this.velocity.y<-2?(this.velocity.y*=-.35,this.velocity.x*=.6,this.velocity.z*=.6):(this.grounded=!0,this.velocity.set(0,0,0)))),this.spin+=e*3,this.sync()}pullToward(e,t,n){this.grounded=!0;let r=e.x-this.position.x,i=e.z-this.position.z,a=Math.hypot(r,i);if(a<1e-4)return;let o=Math.min(a,t*n);this.position.x+=r/a*o,this.position.z+=i/a*o,this.position.y=Math.max(0,this.position.y-n*2)}sync(){let e=this.grounded?.28+Math.sin(this.age*4+this.spin)*.06:.2;this.mesh.position.set(this.position.x,this.position.y+e,this.position.z),this.mesh.rotation.y=this.spin}dispose(){this.ctx.scene.remove(this.mesh),this.mesh.material.dispose()}},_u=class{constructor(e){this.ctx=e,this.cfg=e.data.config.loot,this.drops=[],this.fullNotice=0,e.bus.on(`monster:killed`,e=>this.onKilled(e)),e.bus.on(`loot:spawn`,({item:e,count:t,position:n})=>this.spawn(e,t,n)),e.bus.on(`loot:table`,({drops:e,position:t})=>this.roll(e,t))}onKilled({type:e,position:t,elite:n,noLoot:r}){r||this.roll(this.ctx.data.monsters[e].drops,t,n?this.ctx.data.config.elite:null)}roll(e,t,n=null){let r=this.ctx.data.items.items;for(let i of e){let e=i.oneOf?Al.pick(i.oneOf):i.item,a=!!r[e]?.equipSlot,o=i.chance*(n&&a?n.dropBonus:1);if(Math.random()>=o)continue;let s=i.oneOf?1:Al.int(i.min,i.max);n&&e===`gold`&&(s=Math.round(s*n.gold)),s>0&&this.spawn(e,s,t)}}spawn(e,t,n){let r=Al.range(0,Math.PI*2),i=Al.range(.4,1)*this.cfg.scatter,a=new W(Math.cos(r)*i,Al.range(this.cfg.popMin,this.cfg.popMax),Math.sin(r)*i),o=n.clone();o.y=.4,this.drops.push(new gu(this.ctx,e,t,o,a))}onBagFull(e){e.blocked=this.cfg.fullRetry,!(this.fullNotice>0)&&(this.fullNotice=this.cfg.fullNoticeCooldown,this.ctx.bus.emit(`notify`,{text:`가방이 가득 찼습니다`,kind:`warn`}))}update(e){let{player:t,bus:n}=this.ctx,r=this.ctx.data.player;this.fullNotice=Math.max(0,this.fullNotice-e);for(let i=this.drops.length-1;i>=0;i--){let a=this.drops[i];if(a.update(e),a.blocked=Math.max(0,(a.blocked??0)-e),t.alive&&a.age>this.cfg.pickupDelay&&a.blocked<=0){let i=Math.hypot(t.position.x-a.position.x,t.position.z-a.position.z);if(i<r.pickupRadius){let e={item:a.itemId,count:a.count,taken:0};n.emit(`loot:picked`,e),a.count-=e.taken,a.count<=0?a.done=!0:this.onBagFull(a)}else i<r.magnetRadius&&a.pullToward(t.position,r.magnetSpeed,e)}a.age>this.cfg.lifetime&&(a.done=!0),a.done&&(a.dispose(),this.drops.splice(i,1))}}},vu=class{constructor(e){this.ctx=e,this.gold=0;let{bus:t,data:n}=e;t.on(`loot:picked`,e=>{let{item:r,count:i}=e;n.items.items[r]?.category===`currency`&&(e.taken+=i,this.change(i),t.emit(`notify`,{text:`골드 +${i}`,kind:`gold`}))}),t.on(`player:died`,()=>{let e=Math.floor(this.gold*n.player.deathGoldLossRatio);e<=0||(this.change(-e),t.emit(`notify`,{text:`쓰러져서 골드 ${e}을(를) 잃었습니다`,kind:`warn`}))}),t.on(`economy:spend`,e=>{this.gold<e.amount||(this.change(-e.amount),e.ok=!0)}),t.on(`economy:reward`,({amount:e})=>this.change(e)),t.on(`economy:lose`,({ratio:e,text:n})=>{let r=Math.floor(this.gold*e);r>0&&this.change(-r),t.emit(`notify`,{text:r>0?`${n} (-${r})`:n,kind:`warn`})}),t.on(`shop:buy`,({id:e})=>this.buy(e)),t.on(`shop:sell`,({slot:e,count:t})=>this.sell(e,t)),t.on(`save:collect`,e=>{e.economy={gold:this.gold}}),t.on(`save:apply`,e=>{this.gold=0,this.change(e.economy?.gold??0)})}buy(e){let{bus:t,data:n}=this.ctx,r=n.shop.buy.find(t=>t.id===e);if(!r)return;let i=n.items.items[e].name;if(this.gold<r.price){t.emit(`notify`,{text:`골드가 부족합니다 (${r.price} 필요)`,kind:`warn`});return}let a={item:e,count:1,ok:!1};if(t.emit(`inventory:can-add`,a),!a.ok){t.emit(`notify`,{text:`가방에 자리가 없습니다`,kind:`warn`});return}this.change(-r.price),t.emit(`inventory:add`,{item:e,count:1,taken:0}),t.emit(`notify`,{text:`${i} 구매 (-${r.price})`,kind:`gold`})}sell(e,t){let{bus:n,data:r}=this.ctx,i={slot:e,item:null};if(n.emit(`inventory:take-slot`,i),!i.item)return;let{id:a}=i.item,o=r.items.items[a].value??0,s=Math.min(t,i.item.count);i.item.count>s&&n.emit(`inventory:add`,{item:a,count:i.item.count-s,taken:0}),this.change(o*s),n.emit(`notify`,{text:`${r.items.items[a].name} ${s}개 판매 (+${o*s})`,kind:`gold`})}change(e){this.gold=Math.max(0,this.gold+e),this.ctx.bus.emit(`gold:changed`,{gold:this.gold,delta:e})}},yu=(e,t)=>{let n=e.items.items[t];return n.stackable?n.maxStack??e.config.inventory.defaultMaxStack:1},bu=(e,t)=>e.reduce((e,n)=>e+(n?.id===t?n.count:0),0);function xu(e,t,n){let r=0;for(let i of e)i?i.id===t&&(r+=Math.max(0,n-i.count)):r+=n;return r}function Su(e,t,n,r){let i=n;for(let n of e){if(i<=0)break;if(n?.id!==t||n.count>=r)continue;let e=Math.min(i,r-n.count);n.count+=e,i-=e}for(let n=0;n<e.length&&i>0;n++){if(e[n])continue;let a=Math.min(i,r);e[n]={id:t,count:a},i-=a}return n-i}function Cu(e,t,n){let r=n;for(let n=e.length-1;n>=0&&r>0;n--){let i=e[n];if(i?.id!==t)continue;let a=Math.min(r,i.count);i.count-=a,r-=a,i.count<=0&&(e[n]=null)}return n-r}var wu=class{constructor(e){this.ctx=e,this.cfg=e.data.config.inventory,this.slots=Array(this.cfg.slots).fill(null);let{bus:t}=e;t.on(`loot:picked`,e=>this.onPicked(e)),t.on(`inventory:move`,({from:e,to:t})=>this.move(e,t)),t.on(`inventory:use`,({slot:e})=>this.use(e)),t.on(`inventory:consume`,({item:e,count:t})=>this.remove(e,t)),t.on(`inventory:spend`,e=>{if(e.items.every(e=>this.countOf(e.id)>=e.count)){for(let t of e.items)this.remove(t.id,t.count);e.ok=!0}}),t.on(`inventory:replace-slot`,({slot:e,item:t})=>{this.slots[e]=t?{id:t,count:1}:null,this.changed()}),t.on(`inventory:add`,e=>{let t=this.add(e.item,e.count);e.taken+=t,t&&this.changed()}),t.on(`inventory:can-add`,e=>{e.ok=xu(this.slots,e.item,this.maxStack(e.item))>=e.count}),t.on(`inventory:take-slot`,e=>{e.item=this.slots[e.slot],e.item&&(this.slots[e.slot]=null,this.changed())}),t.on(`inventory:use-item`,({item:e})=>{let t=this.slots.findIndex(t=>t?.id===e);t>=0&&this.use(t)}),t.on(`game:new`,()=>{for(let t of e.data.config.startingItems)this.add(t.id,t.count);this.changed()}),t.on(`save:collect`,e=>{e.inventory={slots:this.slots.map(e=>e?{...e}:null)}}),t.on(`save:apply`,e=>this.applySave(e.inventory))}def(e){return this.ctx.data.items.items[e]}maxStack(e){return yu(this.ctx.data,e)}countOf(e){return bu(this.slots,e)}add(e,t){return Su(this.slots,e,t,this.maxStack(e))}onPicked(e){let t=this.def(e.item);if(!t||t.category===`currency`)return;let n=this.add(e.item,e.count);if(n<=0)return;e.taken+=n;let r=this.countOf(e.item);this.changed({item:e.item,count:n,total:r}),this.ctx.bus.emit(`notify`,{text:`${t.name} +${n} (보유 ${r})`,kind:`item`,color:this.ctx.data.items.grades[t.grade]?.color})}move(e,t){let n=this.slots[e];if(e===t||!n||t<0||t>=this.slots.length)return;let r=this.slots[t];if(r&&r.id===n.id&&r.count<this.maxStack(n.id)){let t=Math.min(n.count,this.maxStack(n.id)-r.count);r.count+=t,n.count-=t,n.count<=0&&(this.slots[e]=null)}else this.slots[t]=n,this.slots[e]=r;this.changed()}use(e){let t=this.slots[e];if(!t)return;let n=this.def(t.id);if(n.category===`consumable`){let n={item:t.id,used:!1};if(this.ctx.bus.emit(`item:use`,n),!n.used){this.ctx.bus.emit(`notify`,{text:`지금은 쓸 필요가 없어요`,kind:`info`});return}--t.count,t.count<=0&&(this.slots[e]=null),this.changed()}else n.category===`kit`?this.ctx.bus.emit(`build:start`,{kind:n.builds,item:t.id}):n.category===`equipment`&&this.ctx.bus.emit(`item:equip`,{item:t.id,slot:e})}remove(e,t){let n=Cu(this.slots,e,t);return this.changed(),n}applySave(e){e&&(this.slots=Array(this.cfg.slots).fill(null),e.slots.forEach((e,t)=>{e&&this.def(e.id)&&(t<this.slots.length?this.slots[t]={id:e.id,count:e.count}:this.add(e.id,e.count))}),this.changed())}changed(e={}){this.ctx.bus.emit(`inventory:changed`,{slots:this.slots,...e})}},Tu={1:e=>{let t=e.inventory?.slots?[...e.inventory.slots]:[],n=t.indexOf(null),r={id:`tent_kit`,count:1};return n>=0?t[n]=r:t.push(r),{...e,saveVersion:2,inventory:{slots:t},bases:[],turrets:[]}},2:e=>({...e,saveVersion:3,stats:{level:1,xp:0,skillPoints:0},equipment:{slots:{}},skills:{ranks:{}}}),3:e=>({...e,saveVersion:4,exploration:null}),4:e=>({...e,saveVersion:5,turrets:(e.turrets??[]).map(e=>({...e,priority:e.priority??`nearest`}))}),5:e=>({...e,saveVersion:6,facilities:[],storages:{}}),6:e=>({...e,saveVersion:7,bosses:{}}),7:e=>({...e,saveVersion:8,gather:{depleted:{}}})},Eu=class{constructor(e){this.ctx=e,this.cfg=e.data.config.save,this.timer=this.cfg.autosaveInterval,this.disabled=!1,window.addEventListener(`beforeunload`,()=>this.save()),document.addEventListener(`visibilitychange`,()=>{document.visibilityState===`hidden`&&this.save()}),e.bus.on(`save:request`,()=>this.save())}load(){let e;try{e=localStorage.getItem(this.cfg.key)}catch{return!1}if(!e)return this.ctx.bus.emit(`game:new`),!1;let t;try{t=this.migrate(JSON.parse(e))}catch(t){if(console.warn(`[save] 불러오기 실패:`,t.message),t.newer)this.disabled=!0;else try{localStorage.setItem(`${this.cfg.key}-broken`,e)}catch{}return this.ctx.bus.emit(`notify`,{text:`저장을 불러오지 못해 새로 시작합니다`,kind:`warn`}),this.ctx.bus.emit(`game:new`),!1}return this.ctx.bus.emit(`save:apply`,t),this.ctx.bus.emit(`save:loaded`,t),this.ctx.bus.emit(`notify`,{text:`이어서 시작합니다`,kind:`info`}),!0}peek(){let e;try{e=localStorage.getItem(this.cfg.key)}catch{return null}if(!e)return null;try{let t=this.migrate(JSON.parse(e));return{day:t.time?.day??1,level:t.stats?.level??1,gold:t.economy?.gold??0,bases:t.bases?.length??0,savedAt:t.savedAt}}catch(e){return{broken:!0,newer:!!e.newer}}}clear(){try{localStorage.removeItem(this.cfg.key)}catch{}}migrate(e){if(typeof e?.saveVersion!=`number`)throw Error(`saveVersion 없음`);if(e.saveVersion>8){let t=Error(`더 새로운 저장 (v${e.saveVersion})`);throw t.newer=!0,t}let t=e;for(;t.saveVersion<8;){let e=Tu[t.saveVersion];if(!e)throw Error(`v${t.saveVersion} 마이그레이션 없음`);t=e(t)}return t}save(){if(this.disabled)return;let e={saveVersion:8,savedAt:Date.now()};this.ctx.bus.emit(`save:collect`,e);try{localStorage.setItem(this.cfg.key,JSON.stringify(e))}catch(e){console.warn(`[save] 저장 실패:`,e.message);return}this.timer=this.cfg.autosaveInterval,this.ctx.bus.emit(`save:done`,{savedAt:e.savedAt})}update(e){this.timer-=e,this.timer<=0&&this.save()}},Du=e=>new Qi({color:e,flatShading:!0,roughness:.85});function Ou(e){let t=new Rn,n=[],r=(e,r=!0)=>(e.castShadow=!0,e.receiveShadow=!0,r&&n.push(e.material),t.add(e),e),i=(e,n=0,i=0)=>{let a=new X(new Z(.04,.04,.9,5),Du(`#8a6440`));a.position.set(n,e,i),r(a,!1);let o=new X(new Ri(.5,.3),Du(`#ff7b7b`));return o.material.side=2,o.position.set(n+.26,e+.3,i),t.add(o),o};if(e===`hut`){let e=r(new X(new Z(1.35,1.45,1.3,9),Du(`#c9a06a`)));e.position.y=.65;let a=r(new X(new Ni(1.9,1.5,9),Du(`#e8c872`)));return a.position.y=2,r(new X(new Ai(.7,1,.1),Du(`#6b4a36`)),!1).position.set(0,.5,1.4),{group:t,mats:n,lantern:[.95,1.2,1.5],flag:i(3.1)}}if(e===`house`){let e=r(new X(new Ai(2.8,1.7,2.4),Du(`#f4e2c0`)));e.position.y=.85;let a=new Z(1.75,1.75,3.1,3,1);a.rotateZ(Math.PI/2);let o=r(new X(a,Du(`#d9674f`)));o.position.y=2.3,o.scale.set(1,.72,.85),r(new X(new Ai(.35,.9,.35),Du(`#a9adb6`))).position.set(.8,2.9,-.4),r(new X(new Ai(.7,1.1,.1),Du(`#6b4a36`)),!1).position.set(0,.55,1.22);for(let e of[-.9,.9])r(new X(new Ai(.5,.45,.08),Du(`#9fd8ff`)),!1).position.set(e,1,1.22);return{group:t,mats:n,lantern:[1.2,1.3,1.45],flag:i(3.4,-.9)}}if(e===`fort`){let e=r(new X(new Ai(4.2,.6,4.2),Du(`#b8bcc4`)));e.position.y=.3;let a=r(new X(new Ai(2.8,2.2,2.8),Du(`#c9c6be`)));a.position.y=1.7;for(let[e,t]of[[-1.8,-1.8],[1.8,-1.8],[-1.8,1.8],[1.8,1.8]])r(new X(new Z(.5,.6,2.8,7),Du(`#a9adb6`))).position.set(e,1.4,t),r(new X(new Ni(.7,.8,7),Du(`#d9674f`))).position.set(e,3.2,t);for(let e=-1;e<=1;e++)r(new X(new Ai(.45,.4,.45),Du(`#c9c6be`))).position.set(e*.9,3,1.2);return r(new X(new Ai(1,1.4,.12),Du(`#6b4a36`)),!1).position.set(0,1.3,1.42),{group:t,mats:n,lantern:[.9,1.6,2.2],flag:i(3.3)}}let a=r(new X(new Ni(1.6,2.2,4),Du(`#f4d8a8`)));a.position.y=1.1,a.rotation.y=Math.PI/4;let o=r(new X(new Ni(1.62,.5,4,1,!0),Du(`#e9835b`)));o.position.y=.45,o.rotation.y=Math.PI/4;let s=r(new X(new Ri(.8,1.1),Du(`#6b4a36`)),!1);return s.position.set(0,.55,1.14),s.rotation.x=-.2,{group:t,mats:n,lantern:[.9,1.1,1.25],flag:i(2.5)}}var ku=class{constructor(e,t,n,r){this.ctx=e,this.kind=`tent`,this.base=t,this.baseId=t.id,this.position=t.position.clone(),this.flash=0,this.hpTimer=0,this.mesh=new Rn,this.mesh.position.copy(this.position),this.light=new Fa(16762999,0,14,1.6),this.mesh.add(this.light),this.hpBar=new tu(1.6,8177274),this.mesh.add(this.hpBar.group),e.scene.add(this.mesh),this.stats={maxHp:n.hp,hp:r??n.hp},this.alive=this.stats.hp>0,this.setLevel(n)}setLevel(e){let t=this.stats.hp/this.stats.maxHp;this.stats.maxHp=e.hp,this.stats.hp=Math.round(e.hp*t),this.radius=e.radius,this.model&&this.mesh.remove(this.model.group),this.ring&&this.mesh.remove(this.ring),this.model=Ou(e.model),this.mesh.add(this.model.group);let n=new X(new Li(.14,0),new Qr({color:16767370}));n.position.set(...this.model.lantern),this.model.group.add(n),this.lanternMesh=n,this.light.position.set(this.model.lantern[0],this.model.lantern[1]+.5,this.model.lantern[2]+.2),this.hpBar.group.position.y=e.model===`tent`?3.4:4.2;let r=new zi(e.areaRadius-.12,e.areaRadius,96,1);r.rotateX(-Math.PI/2),this.ring=new X(r,new Qr({color:16777215,transparent:!0,opacity:.35,depthWrite:!1})),this.ring.position.y=.04,this.mesh.add(this.ring)}takeDamage(e){return this.alive?(this.stats.hp=Math.max(0,this.stats.hp-e),this.flash=.12,this.hpTimer=5,this.stats.hp<=0&&(this.alive=!1,!0)):!1}repairFull(){this.stats.hp=this.stats.maxHp,this.alive=!0}update(e){this.flash=Math.max(0,this.flash-e),this.hpTimer=Math.max(0,this.hpTimer-e);let t=1-this.ctx.time.daylight;this.light.intensity=t*9,this.lanternMesh.visible=t>.1,this.model.flag.rotation.y=Math.sin(this.ctx.time.elapsed*3)*.3,this.model.group.rotation.z=this.alive?0:.12;let n=this.flash>0?.6:0;for(let e of this.model.mats)e.emissive.setRGB(n,n*.3,n*.3);this.ring.material.opacity=this.ctx.mode===`build`?.7:.3;let r=this.stats;this.hpBar.update(r.hp/r.maxHp,this.ctx.camera,this.hpTimer>0||r.hp<r.maxHp)}dispose(){this.ctx.scene.remove(this.mesh)}},Au=class{constructor(e){this.ctx=e,this.nextId=1,e.bases=[],e.structures=[];let{bus:t}=e;t.on(`build:place`,e=>{if(e.kind!==`tent`)return;let n=this.createBase({position:e.position,level:1});e.item&&t.emit(`inventory:consume`,{item:e.item,count:1}),t.emit(`base:created`,{base:n}),t.emit(`notify`,{text:`${n.label}을(를) 세웠습니다! 건설(B)에서 포탑을 지을 수 있어요`,kind:`item`})}),t.on(`base:travel`,({baseId:e})=>this.travel(e)),t.on(`base:upgrade`,({baseId:e})=>this.upgrade(e)),t.on(`item:use`,n=>{if(!e.data.items.items[n.item]?.use?.returnHome)return;let r=Rl(e.bases,e.player.position);if(!r||!e.player.alive){t.emit(`notify`,{text:`돌아갈 기지가 없어요`,kind:`warn`});return}n.used=!0,t.emit(`player:teleport`,{position:this.doorstep(r)}),t.emit(`notify`,{text:`${r.label}(으)로 돌아왔습니다`,kind:`info`})}),t.on(`time:day`,()=>{for(let t of e.bases)t.tent.repairFull()}),t.on(`save:collect`,t=>{t.bases=e.bases.map(e=>({id:e.id,level:e.level,position:[e.position.x,e.position.z],hp:e.tent.stats.hp}))}),t.on(`save:apply`,e=>{for(let t of e.bases??[])this.createBase({id:t.id,level:t.level,position:new W(t.position[0],0,t.position[1]),hp:t.hp})})}levelDef(e){return this.ctx.data.buildings.baseLevels[String(e)]}createBase({id:e,position:t,level:n,hp:r}){let i=this.levelDef(n),a=this.ctx.world.regionAt(t.x,t.z),o={id:e??this.nextId,level:n,name:i.name,region:a,position:t.clone(),areaRadius:i.areaRadius,maxTurrets:i.maxTurrets};return this.nextId=Math.max(this.nextId,o.id+1),o.label=`${a.name} 기지 #${o.id}`,o.tent=new ku(this.ctx,o,i,r),this.ctx.bases.push(o),this.ctx.structures.push(o.tent),o}upgrade(e){let{bases:t,bus:n}=this.ctx,r=t.find(t=>t.id===e),i=r&&this.levelDef(r.level+1);if(!i)return;let a={items:i.cost,ok:!1};if(n.emit(`inventory:spend`,a),!a.ok){n.emit(`notify`,{text:`재료가 부족합니다`,kind:`warn`});return}r.level+=1,r.name=i.name,r.areaRadius=i.areaRadius,r.maxTurrets=i.maxTurrets,r.tent.setLevel(i),n.emit(`base:upgraded`,{base:r,level:r.level}),n.emit(`notify`,{text:`${r.label}이(가) ${i.name}(으)로 커졌습니다!`,kind:`item`})}doorstep(e){return new W(e.position.x,0,e.position.z+e.tent.radius+1.2)}travel(e){let{player:t,bases:n,bus:r}=this.ctx,i=n.find(t=>t.id===e);if(!i||!t.alive)return;let a=Ll(n,t.position);if(!a){r.emit(`notify`,{text:`기지 영역 안에서만 빠른 이동할 수 있습니다`,kind:`warn`});return}a!==i&&(r.emit(`player:teleport`,{position:this.doorstep(i)}),r.emit(`notify`,{text:`${i.label}(으)로 이동했습니다`,kind:`info`}))}update(e){for(let t of this.ctx.bases)t.tent.update(e)}},ju=e=>new Qi({color:e,flatShading:!0,roughness:.85});function Mu(e){let t=new Rn,n=[],r=(e,t,r,i=0)=>{let a=new X(t,ju(r));return a.position.y=i,e.add(a),n.push(a),a},i=new Rn;if(e.model===`cannon`){r(t,new Z(.75,.9,.7,8),`#a9adb6`,.35),r(t,new Z(.8,.8,.15,8),`#8a6440`,.78),i.position.y=1.15,r(i,new Bi(.45,8,6),e.color);let n=r(i,new Z(.2,.26,1.1,8),`#3a3e47`);n.rotation.x=Math.PI/2-.35,n.position.set(0,.2,.45)}else if(e.model===`gun`){r(t,new Z(.5,.65,.9,6),`#8a8f99`,.45),r(t,new Z(.65,.65,.16,6),`#6f7d8c`,.98),i.position.y=1.25,r(i,new Ai(.5,.35,.6),e.color);for(let e of[-.1,.1]){let t=r(i,new Z(.06,.06,.8,6),`#2f333b`);t.rotation.x=Math.PI/2,t.position.set(e,.02,.6)}}else if(e.model===`crossbow`){r(t,new Z(.5,.65,1,6),`#9a6a45`,.5),r(t,new Z(.72,.72,.18,6),`#b88452`,1.08),i.position.y=1.32,r(i,new Ai(.22,.2,1.1),e.color);let n=r(i,new Ai(1.3,.08,.12),`#c9d3dd`);n.position.z=.4,r(i,new Ai(.06,.06,.9),`#e8e8e8`).position.set(0,.13,.25)}else{r(t,new Z(.45,.6,.9,6),`#9a6a45`,.45),r(t,new Z(.65,.65,.18,6),`#b88452`,.98),i.position.y=1.2,r(i,new Ai(.16,.16,.9),e.color);let n=r(i,new Vi(.42,.045,4,10,Math.PI),`#6b4a36`);n.position.z=.3,n.rotation.set(Math.PI/2,0,0),r(i,new Ai(.04,.04,.7),`#e8e8e8`).position.set(0,.1,.15)}let a=[];for(let e=0;e<2;e++){let n=new X(new Vi(.62,.05,4,16),ju(`#ffcf5c`));n.rotation.x=Math.PI/2,n.position.y=.3+e*.22,n.visible=!1,t.add(n),a.push(n)}return t.add(i),t.traverse(e=>{e.isMesh&&(e.castShadow=!0,e.receiveShadow=!0)}),{group:t,head:i,parts:n,stars:a}}var Nu=(e,t)=>Math.max(1,Math.round(e.cost*(1-(t.buildCost??0)))),Pu=(e,t)=>e.maxTurrets+(t.extraTurrets??0),Fu=(e,t,n=1)=>e.damage*(1+(t.turretDamage??0))*(1+e.damagePerLevel*(n-1)),Iu=(e,t,n=1)=>e.range+(t.turretRange??0)+e.rangePerLevel*(n-1),Lu=(e,t=1)=>Math.round(e.hp*(1+e.hpPerLevel*(t-1))),Ru=(e,t)=>e.upgradeCosts[t-1]??null,zu=e=>Math.ceil((e.stats.maxHp-e.stats.hp)*e.def.repairCostPerHp),Bu=(e,t,n)=>{let r=Nu(e.def,t)+e.def.upgradeCosts.slice(0,e.level-1).reduce((e,t)=>e+t,0);return Math.floor(r*n)},Vu=class{constructor(e,t,n,r,{hp:i,level:a=1,priority:o}={}){this.ctx=e,this.kind=`turret`,this.type=t,this.def=e.data.turrets[t],this.baseId=n,this.level=a,this.priority=o??this.def.priority,this.position=r.clone(),this.radius=this.def.radius;let s=Lu(this.def,a);this.stats={maxHp:s,hp:Math.min(s,i??s)},this.alive=this.stats.hp>0,this.cooldown=0,this.yaw=0,this.aimYaw=0,this.flash=0,this.hpTimer=0,this.recoil=0,this.buildMesh(),this.applyLook()}static createMesh(e){return Mu(e)}buildMesh(){let{group:e,head:t,parts:n,stars:r}=Mu(this.def);this.head=t,this.stars=r,this.mats=n.map(e=>e.material),this.baseColors=this.mats.map(e=>e.color.clone()),this.hpBar=new tu(1,8177274),this.hpBar.group.position.y=2.1,e.add(this.hpBar.group),e.position.copy(this.position),this.mesh=e,this.ctx.scene.add(e)}applyLook(){this.head.visible=this.alive,this.mesh.rotation.z=this.alive?0:.25,this.mats.forEach((e,t)=>e.color.copy(this.baseColors[t]).multiplyScalar(this.alive?1:.55)),this.stars.forEach((e,t)=>{e.visible=this.level>=t+2})}get muzzle(){return new W(this.position.x,this.head.position.y+.15,this.position.z)}takeDamage(e){return this.alive?(this.stats.hp=Math.max(0,this.stats.hp-e),this.flash=.12,this.hpTimer=4,this.stats.hp<=0&&(this.alive=!1,this.applyLook(),!0)):!1}repair(){this.stats.hp=this.stats.maxHp,this.alive=!0,this.applyLook()}levelUp(){let e=this.stats.hp/this.stats.maxHp;this.level+=1,this.stats.maxHp=Lu(this.def,this.level),this.stats.hp=Math.round(this.stats.maxHp*e),this.applyLook()}update(e){this.flash=Math.max(0,this.flash-e),this.hpTimer=Math.max(0,this.hpTimer-e),this.recoil=Math.max(0,this.recoil-e*4);let t=this.aimYaw-this.yaw;t=Math.atan2(Math.sin(t),Math.cos(t)),this.yaw+=t*Math.min(1,e*12),this.head.rotation.y=this.yaw,this.head.scale.z=1-this.recoil*.15;let n=this.flash>0?.6:0;for(let e of this.mats)e.emissive.setRGB(n,n*.3,n*.3);let r=this.stats;this.hpBar.update(r.hp/r.maxHp,this.ctx.camera,this.alive&&(this.hpTimer>0||r.hp<r.maxHp))}dispose(){this.ctx.scene.remove(this.mesh)}},Hu=e=>new Qi({color:e,flatShading:!0,roughness:.85});function Uu(e){let t=new Rn,n=[],r=(e,r,i,a,o,s,c)=>{let l=new X(new Ai(e,r,i),Hu(a));return l.position.set(o,s,c),t.add(l),n.push(l),l};if(e===`workbench`){r(1.6,.14,.9,`#c9a06a`,0,.8,0);for(let[e,t]of[[-.7,-.35],[.7,-.35],[-.7,.35],[.7,.35]])r(.12,.8,.12,`#8a6440`,e,.4,t);r(.5,.08,.14,`#a9adb6`,-.3,.92,.1);let e=r(.08,.35,.08,`#6b4a36`,.35,1,-.1);e.rotation.z=.6,r(.25,.12,.12,`#8a8f99`,.45,1.12,-.1),r(.4,.25,.3,`#e0c38a`,.45,.35,0)}else if(e===`storage`){r(2,1.3,1.6,`#9a6a45`,0,.65,0);let e=new X(new Z(1.25,1.25,2.2,3,1).rotateZ(Math.PI/2),Hu(`#6b8f5a`));e.position.y=1.55,e.scale.set(1,.5,.75),t.add(e),n.push(e),r(1.1,.95,.08,`#6b4a36`,0,.48,.82),r(.5,.5,.5,`#c9a06a`,1.35,.25,.55),r(.4,.4,.4,`#c9a06a`,1.3,.7,.5)}else{r(1.9,.9,.8,`#c9a06a`,0,.45,.2);for(let e of[-.9,.9])r(.1,1.9,.1,`#8a6440`,e,.95,-.25);for(let e=0;e<5;e++){let t=r(.4,.08,1.1,e%2?`#fff4d6`:`#e9835b`,-.8+e*.4,1.95,.1);t.rotation.x=.25}let e=new X(new Z(.28,.28,.06,12).rotateX(Math.PI/2),Hu(`#ffcf5c`));e.position.set(0,2.35,-.2),t.add(e),n.push(e),r(.3,.3,.3,`#ff7b8a`,-.5,1.05,.3),r(.3,.3,.3,`#8ee08a`,.2,1.05,.3)}return t.traverse(e=>{e.isMesh&&(e.castShadow=!0,e.receiveShadow=!0)}),{group:t,parts:n}}var Wu=7330927,Gu=16739179,Ku=class{constructor(e){this.ctx=e,this.cfg=e.data.config.build,this.placing=null,this.gold=0,this.lastHint=``,this.counts={},e.bus.on(`inventory:changed`,({slots:e})=>{this.counts={};for(let t of e)t&&(this.counts[t.id]=(this.counts[t.id]??0)+t.count)}),e.mode=`play`,e.bus.on(`gold:changed`,({gold:e})=>{this.gold=e}),e.bus.on(`build:start`,e=>this.start(e)),e.bus.on(`player:died`,()=>this.end())}start({kind:e,type:t,item:n}){this.end();let r=e===`tent`?this.tentGhost():e===`facility`?Uu(this.ctx.data.buildings.buildings[t].model).group:Vu.createMesh(this.ctx.data.turrets[t]).group,i=[];r.traverse(e=>{e.isMesh&&(e.castShadow=!1,e.material=new Qr({color:Wu,transparent:!0,opacity:.45,depthWrite:!1}),i.push(e.material))}),this.ctx.scene.add(r);let a=this.ctx.player,o=a.position.clone().addScaledVector(a.facing,e===`tent`?4:3);this.placing={kind:e,type:t,item:n,ghost:r,mats:i,pos:this.snap(o),check:{ok:!1}},r.position.copy(this.placing.pos),this.ctx.mode=`build`,this.ctx.input.consumeMouse()}snap(e){let t=this.cfg.gridSnap;return new W(Math.round(e.x/t)*t,0,Math.round(e.z/t)*t)}tentGhost(){let e=this.ctx.data.buildings.baseLevels[1],t=new Rn,n=new X(new Ni(1.6,2.2,4),new Qr);n.position.y=1.1,n.rotation.y=Math.PI/4;let r=new X(new zi(e.areaRadius-.15,e.areaRadius,96).rotateX(-Math.PI/2),new Qr);return r.position.y=.05,t.add(n,r),t}end(){this.placing&&(this.ctx.scene.remove(this.placing.ghost),this.placing=null,this.ctx.mode=`play`,this.hint(``))}hint(e,t=!0){e!==this.lastHint&&(this.lastHint=e,this.ctx.bus.emit(`build:hint`,{text:e,ok:t}))}overlapsStructure(e,t){for(let n of this.ctx.structures)if(e.distanceTo(n.position)<n.radius+t+this.cfg.structureGap)return!0;return!1}validate(e){let{world:t,bases:n,data:r,structures:i,player:a}=this.ctx,o=this.placing;if(o.kind===`tent`){let i=r.buildings.baseLevels[1],a=r.config.base.minBaseDistance;return t.isInside(e.x,e.z,i.areaRadius*.5)?n.some(t=>t.position.distanceTo(e)<a)?{ok:!1,reason:`다른 기지와 너무 가깝습니다`}:t.isBlocked(e.x,e.z,i.radius)?{ok:!1,reason:`나무나 바위에 막혀 있습니다`}:{ok:!0}:{ok:!1,reason:`월드 가장자리와 너무 가깝습니다`}}if(o.kind===`facility`)return this.validateFacility(e);let s=r.turrets[o.type],c=Ll(n,e);if(!c)return{ok:!1,reason:`기지 영역 안에만 지을 수 있습니다`};let l=i.filter(e=>e.kind===`turret`&&e.baseId===c.id).length,u=Pu(c,a.stats),d=Nu(s,a.stats);return l>=u?{ok:!1,reason:`이 기지엔 포탑을 더 세울 수 없습니다 (${l}/${u})`}:this.gold<d?{ok:!1,reason:`골드가 부족합니다 (${d} 필요)`}:t.isBlocked(e.x,e.z,s.radius)||this.overlapsStructure(e,s.radius)||e.distanceTo(a.position)<s.radius+a.radius?{ok:!1,reason:`자리가 막혀 있습니다`}:{ok:!0,base:c}}validateFacility(e){let{world:t,bases:n,data:r,structures:i,player:a}=this.ctx,o=r.buildings.buildings[this.placing.type],s=Ll(n,e);return s?s.level<o.unlockBaseLevel?{ok:!1,reason:`기지 Lv${o.unlockBaseLevel}부터 지을 수 있습니다`}:i.some(e=>e.kind===`facility`&&e.type===this.placing.type&&e.baseId===s.id)?{ok:!1,reason:`이 기지엔 이미 ${o.name}이(가) 있습니다`}:o.cost.every(e=>(this.counts[e.id]??0)>=e.count)?t.isBlocked(e.x,e.z,o.radius)||this.overlapsStructure(e,o.radius)||e.distanceTo(a.position)<o.radius+a.radius?{ok:!1,reason:`자리가 막혀 있습니다`}:{ok:!0,base:s}:{ok:!1,reason:`재료가 부족합니다`}:{ok:!1,reason:`기지 영역 안에만 지을 수 있습니다`}}update(){let e=this.placing;if(!e)return;let{input:t,mouseGround:n,bus:r}=this.ctx;if(t.rightPressed||t.wasPressed(`Escape`)||t.wasPressed(`BuildCancel`)){this.end();return}let i=!t.touchMode||t.leftPressed;n&&i&&(e.pos.copy(this.snap(n)),e.ghost.position.copy(e.pos)),e.check=this.validate(e.pos);for(let t of e.mats)t.color.setHex(e.check.ok?Wu:Gu);let a=t.touchMode?`화면을 탭해 자리를 고르고 "설치"를 누르세요`:`좌클릭: 설치 · 우클릭/ESC: 취소`;if(this.hint(e.check.ok?a:e.check.reason,e.check.ok),!(t.touchMode?t.wasPressed(`BuildConfirm`):t.leftPressed))return;if(!e.check.ok){r.emit(`notify`,{text:e.check.reason,kind:`warn`});return}if(e.kind===`turret`){let t={amount:Nu(this.ctx.data.turrets[e.type],this.ctx.player.stats),ok:!1};if(r.emit(`economy:spend`,t),!t.ok)return}if(e.kind===`facility`){let t={items:this.ctx.data.buildings.buildings[e.type].cost,ok:!1};if(r.emit(`inventory:spend`,t),!t.ok)return}let o={kind:e.kind,type:e.type,item:e.item,position:e.pos.clone(),baseId:e.check.base?.id};t.consumeMouse(),this.end(),r.emit(`build:place`,o)}},qu=new W(0,0,1),Ju=e=>new Qi({color:e,flatShading:!0}),Yu=e=>new Qr({color:e});function Xu(e){let t=new Rn;if(e===`spore`)t.add(new X(new Ii(.2,0),Yu(11759584)));else if(e===`icebolt`){let e=new X(new Li(.18,0),Yu(11068671));e.scale.z=1.8,t.add(e)}else if(e===`leaf`){let e=new X(new Mi(.28,5).rotateX(-Math.PI/2),Ju(7323466));e.material.side=2,e.scale.z=.55,t.add(e)}else if(e===`ball`)t.add(new X(new Ii(.22,1),Ju(3093307)));else if(e===`bullet`){let e=new X(new Bi(.07,6,4),new Qr({color:16769162}));e.scale.z=2.5,t.add(e)}else{let n=e===`bolt`,r=new Z(n?.045:.03,n?.045:.03,n?.9:.7,4).rotateX(Math.PI/2),i=new Ni(n?.1:.07,.18,4).rotateX(Math.PI/2).translate(0,0,n?.52:.42);t.add(new X(r,Ju(n?7031350:13213802)),new X(i,Ju(14673646)))}return t}var Zu=class{constructor(e,t){this.kind=t,this.mesh=Xu(t),this.mesh.visible=!1,e.add(this.mesh),this.position=new W,this.velocity=new W,this.active=!1}fire(e,t,n,r,i={}){this.position.copy(e),this.velocity.copy(t),this.damage=n,this.life=r,this.gravity=i.gravity??0,this.splash=i.splash??null,this.active=!0,this.mesh.visible=!0,this.sync()}step(e){this.velocity.y-=this.gravity*e,this.position.addScaledVector(this.velocity,e),this.life-=e,this.sync()}sync(){this.mesh.position.copy(this.position),this.mesh.quaternion.setFromUnitVectors(qu,this.velocity.clone().normalize())}release(){this.active=!1,this.mesh.visible=!1}},Qu=class{constructor(e){this.scene=e,this.items=[]}acquire(e=`arrow`){let t=this.items.find(t=>!t.active&&t.kind===e);return t||(t=new Zu(this.scene,e),this.items.push(t)),t}*active(){for(let e of this.items)e.active&&(yield e)}},$u=new W,ed=class{constructor(e){this.ctx=e,this.cfg=e.data.config.turret,this.turrets=[],this.pool=new Qu(e.scene),this.blasts=[];let{bus:t}=e;t.on(`build:place`,n=>{n.kind===`turret`&&(this.add(n.type,n.baseId,n.position),t.emit(`notify`,{text:`${e.data.turrets[n.type].name} 설치!`,kind:`item`}))}),t.on(`turret:upgrade`,({turret:e})=>this.upgrade(e)),t.on(`turret:repair`,({turret:e})=>this.repair(e)),t.on(`turret:priority`,({turret:e})=>{e.priority=e.priority===`nearest`?`lowestHp`:`nearest`,this.changed(e)}),t.on(`turret:demolish`,({turret:e})=>this.demolish(e)),t.on(`save:collect`,e=>{e.turrets=this.turrets.map(e=>({type:e.type,baseId:e.baseId,position:[e.position.x,e.position.z],hp:e.stats.hp,level:e.level,priority:e.priority}))}),t.on(`save:apply`,t=>{for(let n of t.turrets??[])e.data.turrets[n.type]&&this.add(n.type,n.baseId,new W(n.position[0],0,n.position[1]),{hp:n.hp,level:n.level,priority:n.priority})})}add(e,t,n,r){let i=new Vu(this.ctx,e,t,n,r);return this.turrets.push(i),this.ctx.structures.push(i),i}spend(e){let t={amount:e,ok:!1};return this.ctx.bus.emit(`economy:spend`,t),t.ok||this.ctx.bus.emit(`notify`,{text:`골드가 부족합니다 (${e} 필요)`,kind:`warn`}),t.ok}changed(e){this.ctx.bus.emit(`turret:changed`,{turret:e})}upgrade(e){let t=Ru(e.def,e.level);!e.alive||t==null||e.level>=e.def.maxLevel||this.spend(t)&&(e.levelUp(),this.ctx.bus.emit(`notify`,{text:`${e.def.name} Lv${e.level}!`,kind:`item`}),this.changed(e))}repair(e){let t=zu(e);t<=0||!this.spend(t)||(e.repair(),this.ctx.bus.emit(`notify`,{text:`${e.def.name} 수리 완료`,kind:`item`}),this.changed(e))}demolish(e){let t=Bu(e,this.ctx.player.stats,this.cfg.demolishRefund);e.dispose(),this.turrets=this.turrets.filter(t=>t!==e);let n=this.ctx.structures;n.splice(n.indexOf(e),1),this.ctx.bus.emit(`economy:reward`,{amount:t}),this.ctx.bus.emit(`notify`,{text:`${e.def.name} 철거 (골드 +${t})`,kind:`gold`}),this.changed(null)}pickTarget(e){let t=Iu(e.def,this.ctx.player.stats,e.level),n=null,r=1/0;for(let i of this.ctx.monsters){if(!i.alive||i.untargetable)continue;let a=Math.hypot(i.position.x-e.position.x,i.position.z-e.position.z);if(a>t)continue;let o=e.priority===`lowestHp`?i.stats.hp:a;o<r&&(r=o,n=i)}return n}fire(e,t){let n=e.def,r=this.ctx.player.stats,i=e.muzzle,a=Fu(n,r,e.level),o=Iu(n,r,e.level),s=this.pool.acquire(n.projectile);if(n.splashRadius){let e=this.cfg.gravity;$u.set(t.position.x-i.x,0,t.position.z-i.z);let r=Math.max(.4,$u.length()/n.projectileSpeed),o=$u.divideScalar(r);o.y=(0-i.y+.5*e*r*r)/r,s.fire(i,o,a,r+1,{gravity:e,splash:{radius:n.splashRadius,minFactor:n.splashMinFactor}})}else $u.set(t.position.x,.5,t.position.z).sub(i).normalize().multiplyScalar(n.projectileSpeed),s.fire(i,$u,a,o*1.3/n.projectileSpeed);e.recoil=1,this.ctx.bus.emit(`turret:fired`,{type:e.type,position:e.position,muzzle:i})}blast(e,t){let n=this.blasts.find(e=>e.t>=1);if(!n){let e=new X(new Bi(1,12,8),new Qr({color:16757596,transparent:!0,depthWrite:!1}));this.ctx.scene.add(e),n={mesh:e,t:1},this.blasts.push(n)}n.t=0,n.radius=t,n.mesh.position.copy(e).setY(.2),n.mesh.visible=!0}update(e){for(let t of this.turrets){if(t.update(e),!t.alive)continue;t.cooldown-=e;let n=this.pickTarget(t);if(!n)continue;t.aimYaw=Math.atan2(n.position.x-t.position.x,n.position.z-t.position.z);let r=t.aimYaw-t.yaw;r=Math.atan2(Math.sin(r),Math.cos(r)),t.cooldown<=0&&Math.abs(r)<.25&&(this.fire(t,n),t.cooldown=1/t.def.fireRate)}let{monsters:t,bus:n}=this.ctx;for(let r of this.pool.active()){if(r.step(e),r.splash){(r.position.y<=0||r.life<=0)&&(r.position.y=0,n.emit(`projectile:explode`,{position:r.position.clone(),radius:r.splash.radius,minFactor:r.splash.minFactor,damage:r.damage}),this.blast(r.position,r.splash.radius),r.release());continue}let i=null;for(let e of t){if(!e.alive||e.untargetable)continue;let t=e.position.x-r.position.x,n=e.position.z-r.position.z;if(t*t+n*n<(e.radius+.15)**2&&r.position.y<e.radius*2+(e.def.flier?1.3:0)){i=e;break}}i?(n.emit(`projectile:hit`,{monster:i,damage:r.damage,dir:r.velocity.clone().setY(0).normalize()}),r.release()):(r.life<=0||r.position.y<0)&&r.release()}for(let t of this.blasts)t.t>=1||(t.t=Math.min(1,t.t+e/.35),t.mesh.scale.setScalar(t.radius*(.3+.7*t.t)),t.mesh.material.opacity=.6*(1-t.t),t.t>=1&&(t.mesh.visible=!1))}},td=new W,nd=class extends du{constructor(e,t,n,r){super(e,t,n),this.raid=!0,this.base=r,this.hasFled=!0,this.retreatTimer=0,this.setState(`raid`)}retreat(){this.alive&&this.state!==`retreat`&&this.setState(`retreat`)}pickTarget(){let e=this.def,t=this.ctx.player;if(t.alive&&this.position.distanceTo(t.position)<e.detectRange)return t;let n=null,r=1/0;for(let e of this.ctx.structures){if(!e.alive||e.baseId!==this.base.id)continue;let t=this.position.distanceTo(e.position)-e.radius;t<r&&(r=t,n=e)}return n}think(e){let t=this.def,n=new W,r=0;switch(this.state){case`raid`:{let e=this.pickTarget();if(!e){n.set(this.base.position.x-this.position.x,0,this.base.position.z-this.position.z),r=n.length()>2?t.moveSpeed:0;break}this.attackTarget=e,td.set(e.position.x-this.position.x,0,e.position.z-this.position.z);let i=t.attackRange+e.radius;if(td.length()<=i&&this.cooldown<=0){this.setState(`attack`);break}n.copy(td),r=td.length()>i*.85?e===this.ctx.player?t.chaseSpeed:t.moveSpeed:0;break}case`attack`:if(!this.attackTarget?.alive){this.setState(`raid`);break}this.attackStep(`raid`);break;case`retreat`:n.set(this.position.x-this.base.position.x,0,this.position.z-this.base.position.z),r=t.moveSpeed*1.5,this.retreatTimer+=e,this.setOpacity(Math.max(0,.92*(1-this.retreatTimer/3))),this.retreatTimer>=3&&(this.alive=!1,this.done=!0)}return{move:n,speed:r}}takeDamage(e,t){let n=super.takeDamage(e,t);return!n&&this.state!==`attack`&&this.state!==`retreat`&&this.setState(`raid`),n}},rd=class{constructor(e){this.ctx=e,this.cfg=e.data.config.raid,this.raids=[];let{bus:t}=e;t.on(`time:dusk`,()=>{let n=e.bases.length?`곧 해가 집니다. 습격에 대비하세요!`:`곧 해가 집니다. 밤엔 몬스터가 강해져요`;t.emit(`notify`,{text:n,kind:`warn`})}),t.on(`time:night`,({day:e})=>this.startRaids(e)),t.on(`time:day`,({day:e})=>this.finishRaids(e)),t.on(`structure:destroyed`,({structure:e})=>{if(e.kind!==`tent`)return;let t=this.raids.find(t=>t.base.id===e.baseId&&t.status===`active`);t&&this.fail(t)})}raidSize(e,t){let n=this.cfg,r=e.region,i=n.baseCount+e.level*n.perBaseLevel+r.difficulty*n.perRegionDifficulty+(t-1)*n.perDay;return Math.min(n.maxCount,Math.round(i))}startRaids(e){let{bases:t,bus:n}=this.ctx;if(!t.length){n.emit(`notify`,{text:`밤이 되었습니다. 몬스터가 강해집니다`,kind:`warn`});return}let r=this.ctx.player;for(let n of t){let t=this.raidSize(n,e),i=r.alive&&r.position.distanceTo(n.position)<=n.areaRadius+this.cfg.presenceMargin;this.raids.push({base:n,day:e,total:t,toSpawn:i?t:0,timer:0,monsters:[],status:`active`,remote:!i})}let i=this.raids.filter(e=>!e.remote),a=this.raids.length-i.length;i.length&&n.emit(`raid:start`,{day:e,count:i.reduce((e,t)=>e+t.total,0)}),a&&n.emit(`notify`,{text:`멀리 있는 기지 ${a}곳도 습격당하고 있어요 (결과는 아침에)`,kind:`warn`})}spawnOne(e){let{world:t}=this.ctx,n=e.base;for(let r=0;r<10;r++){let r=Al.range(0,Math.PI*2),i=n.areaRadius+this.cfg.spawnOffset,a=n.position.x+Math.cos(r)*i,o=n.position.z+Math.sin(r)*i;if(!t.isInside(a,o,3)||t.isBlocked(a,o,1))continue;let s=new nd(this.ctx,n.region.raidMonster,new W(a,0,o),n);return s.scaleStats(this.statScale(e)),this.ctx.monsters.push(s),e.monsters.push(s),!0}return!1}statScale(e){return(1+(e.day-1)*this.cfg.statScalePerDay)*e.base.region.statMultiplier}resolveRemote(e){let t=this.cfg,n=this.ctx.player.stats,r=this.ctx.structures.filter(t=>t.kind===`turret`&&t.baseId===e.base.id&&t.alive),i=r.reduce((e,t)=>e+Fu(t.def,n,t.level)*t.def.fireRate*(t.def.aoeFactor??1),0),a=this.ctx.data.monsters[e.base.region.raidMonster],o=e.total*a.hp*this.statScale(e),s=o>0?i*t.remoteFightSeconds/o:1;if(e.killed=Math.min(e.total,Math.floor(e.total*s)),s>=1){e.status=`cleared`;return}for(let e of r)e.takeDamage(e.stats.maxHp*(1-s)*t.remoteTurretDamage)&&this.ctx.bus.emit(`structure:destroyed`,{structure:e});s>=t.remotePartialRatio?e.status=`partial`:(e.status=`failed`,this.loseGoods(e.base,`${e.base.label}이(가) 습격에 무너졌습니다!`))}loseGoods(e,t){let n={baseId:e.id,ratio:this.cfg.failStorageLossRatio,handled:!1,lost:0};this.ctx.bus.emit(`storage:lose`,n),n.handled?this.ctx.bus.emit(`notify`,{text:`${t} 창고 재료 ${n.lost}개를 빼앗겼어요`,kind:`warn`}):this.ctx.bus.emit(`economy:lose`,{ratio:this.cfg.failGoldLossRatio,text:`${t} 골드를 빼앗겼어요`})}fail(e){e.status=`failed`,e.toSpawn=0;for(let t of e.monsters)t.retreat();this.loseGoods(e.base,`${e.base.label}의 중심 건물이 무너졌습니다!`)}finishRaids(e){if(!this.raids.length)return;let t=[];for(let e of this.raids){e.remote&&this.resolveRemote(e);for(let t of e.monsters)t.retreat();let n=e.remote?e.killed:e.monsters.filter(e=>!e.alive&&e.state===`dead`).length,r=e.status;r===`active`&&(r=`partial`);let i=0;r===`cleared`&&(i=this.cfg.rewardBase+e.total*this.cfg.rewardPerMonster,this.ctx.bus.emit(`economy:reward`,{amount:i})),t.push({baseId:e.base.id,baseName:e.base.label,remote:e.remote,status:r,killed:n,total:e.total,reward:i})}this.raids=[],this.ctx.bus.emit(`raid:end`,{}),this.ctx.bus.emit(`raid:result`,{day:e,results:t})}update(e){for(let t of this.raids)t.status!==`active`||t.remote||(t.toSpawn>0?(t.timer-=e,t.timer<=0&&this.spawnOne(t)&&(--t.toSpawn,t.timer=this.cfg.spawnInterval)):t.monsters.every(e=>!e.alive)&&(t.status=`cleared`,this.ctx.bus.emit(`notify`,{text:`습격을 막아냈습니다! 보상은 아침에 받아요`,kind:`item`})))}},id=class{constructor(e){this.ctx=e,this.levels=e.data.levels,this.level=1,this.xp=0,this.skillPoints=0,this.equipBonus={},this.skillEffects={},this.buffEffects={};let{bus:t,data:n}=e;t.on(`monster:killed`,({type:e,elite:t,noLoot:r})=>{r||this.gain(Math.round((n.monsters[e]?.xp??0)*(t?n.config.elite.xp:1)))}),t.on(`build:place`,({kind:e,type:t})=>{let r=e===`tent`?n.buildings.baseLevels[1].xp:e===`facility`?n.buildings.buildings[t]?.xp:n.turrets[t]?.xp;this.gain(r??0)}),t.on(`gather:done`,({xp:e})=>this.gain(e??0)),t.on(`base:upgraded`,({level:e})=>this.gain(n.buildings.baseLevels[String(e)]?.xp??0)),t.on(`equipment:changed`,({bonus:e})=>{this.equipBonus=e,this.recalc()}),t.on(`skills:changed`,({effects:e})=>{this.skillEffects=e,this.recalc()}),t.on(`buffs:changed`,({effects:e})=>{let t=JSON.stringify(e);t!==this.buffKey&&(this.buffKey=t,this.buffEffects=e,this.recalc())}),t.on(`stats:refund-points`,({count:e})=>{this.skillPoints+=e,this.emitChanged()}),t.on(`stats:spend-point`,e=>{this.skillPoints<=0||(--this.skillPoints,e.ok=!0,this.emitChanged())}),t.on(`save:collect`,e=>{e.stats={level:this.level,xp:this.xp,skillPoints:this.skillPoints}}),t.on(`save:apply`,e=>{e.stats&&(this.level=e.stats.level,this.xp=e.stats.xp,this.skillPoints=e.stats.skillPoints,this.recalc())}),this.recalc()}xpToNext(e=this.level){return e>=this.levels.maxLevel?1/0:Math.round(this.levels.xpBase*this.levels.xpGrowth**(e-1))}gain(e){if(e<=0||this.level>=this.levels.maxLevel)return;this.xp+=e,this.ctx.bus.emit(`xp:gain`,{amount:e,position:this.ctx.player.position.clone()});let t=!1;for(;this.xp>=this.xpToNext();)if(this.xp-=this.xpToNext(),this.level+=1,this.skillPoints+=this.levels.skillPointsPerLevel,t=!0,this.level>=this.levels.maxLevel){this.xp=0;break}if(!t){this.emitChanged();return}this.recalc();let n=this.ctx.player.stats;n.hp=n.maxHp,n.stamina=n.maxStamina,this.ctx.bus.emit(`stats:levelup`,{level:this.level,skillPoints:this.skillPoints})}recalc(){let e=this.ctx.data.player,t={maxHp:e.hp,maxStamina:e.stamina,attack:e.attack,defense:e.defense,moveSpeed:e.moveSpeed,critChance:e.critChance,hpRegen:e.hpRegen,attackSpeed:0,moveSpeedPct:0,spin:0,gatherSpeed:0,gatherAmount:0,turretDamage:0,turretRange:0,buildCost:0,extraTurrets:0};for(let[e,n]of Object.entries(this.levels.perLevel))t[e]+=n*(this.level-1);for(let e of[this.equipBonus,this.skillEffects,this.buffEffects])for(let[n,r]of Object.entries(e))t[n]=(t[n]??0)+r;t.moveSpeed*=1+t.moveSpeedPct,t.attack*=1+(t.attackPct??0),t.maxHp=Math.round(t.maxHp),t.maxStamina=Math.round(t.maxStamina),t.attack=Math.round(t.attack*10)/10,t.defense=Math.round(t.defense*10)/10;let n=this.ctx.player.stats;Object.assign(n,t),n.hp=Math.min(n.hp,n.maxHp),n.stamina=Math.min(n.stamina,n.maxStamina),this.emitChanged()}emitChanged(){this.ctx.bus.emit(`stats:changed`,{level:this.level,xp:this.xp,xpToNext:this.xpToNext(),skillPoints:this.skillPoints,stats:this.ctx.player.stats})}},ad=[`weapon`,`head`,`body`,`feet`,`accessory1`,`accessory2`],od=class{constructor(e){this.ctx=e,this.slots=Object.fromEntries(ad.map(e=>[e,null]));let{bus:t}=e;t.on(`item:equip`,({item:e,slot:t})=>this.equip(e,t)),t.on(`equipment:unequip`,({slot:e})=>this.unequip(e)),t.on(`save:collect`,e=>{e.equipment={slots:{...this.slots}}}),t.on(`save:apply`,e=>{let t=e.equipment?.slots??{};for(let e of ad)this.slots[e]=t[e]&&this.def(t[e])?t[e]:null;this.changed()})}def(e){return this.ctx.data.items.items[e]}targetSlot(e){return e.equipSlot===`accessory`?this.slots.accessory1?this.slots.accessory2?`accessory1`:`accessory2`:`accessory1`:e.equipSlot}equip(e,t){let n=this.def(e);if(n?.category!==`equipment`)return;let r=this.targetSlot(n),i=this.slots[r];this.slots[r]=e,this.ctx.bus.emit(`inventory:replace-slot`,{slot:t,item:i}),this.ctx.bus.emit(`notify`,{text:`${n.name} 장착`,kind:`item`,color:this.ctx.data.items.grades[n.grade]?.color}),this.changed()}unequip(e){let t=this.slots[e];if(!t)return;let n={item:t,count:1,taken:0};if(this.ctx.bus.emit(`inventory:add`,n),!n.taken){this.ctx.bus.emit(`notify`,{text:`가방이 가득 차서 해제할 수 없습니다`,kind:`warn`});return}this.slots[e]=null,this.changed()}changed(){let e={},t=t=>{for(let[n,r]of Object.entries(t??{}))e[n]=(e[n]??0)+r};for(let e of Object.values(this.slots))e&&t(this.def(e).bonus);let n=new Set(Object.values(this.slots)),r=Object.entries(this.ctx.data.items.sets).map(([e,r])=>{let i=r.pieces.filter(e=>n.has(e)).length;return i===r.pieces.length&&t(r.bonus),{id:e,name:r.name,have:i,total:r.pieces.length,bonus:r.bonus}});this.ctx.bus.emit(`equipment:changed`,{slots:this.slots,bonus:e,sets:r})}},sd=class{constructor(e){this.ctx=e,this.defs=e.data.skills.skills,this.ranks={};let{bus:t}=e;t.on(`skill:learn`,({id:e})=>this.learn(e)),t.on(`item:use`,n=>{if(!e.data.items.items[n.item]?.use?.resetSkills)return;let r=Object.values(this.ranks).reduce((e,t)=>e+t,0);if(!r){t.emit(`notify`,{text:`잊을 스킬이 없어요`,kind:`warn`});return}n.used=!0,this.ranks={},t.emit(`stats:refund-points`,{count:r}),t.emit(`notify`,{text:`스킬을 모두 잊었어요. 포인트 ${r} 돌려받음`,kind:`item`}),this.changed()}),t.on(`save:collect`,e=>{e.skills={ranks:{...this.ranks}}}),t.on(`save:apply`,e=>{this.ranks={};for(let[t,n]of Object.entries(e.skills?.ranks??{}))this.defs[t]&&(this.ranks[t]=Math.min(n,this.defs[t].maxRank));this.changed()})}rank(e){return this.ranks[e]??0}blockReason(e){let t=this.defs[e];if(this.rank(e)>=t.maxRank)return`최대 랭크`;for(let e of t.requires)if(this.rank(e.id)<e.rank)return`${this.defs[e.id].name} ${e.rank}랭크 필요`;return null}learn(e){let t=this.defs[e];if(!t||this.blockReason(e))return;let n={ok:!1};if(this.ctx.bus.emit(`stats:spend-point`,n),!n.ok){this.ctx.bus.emit(`notify`,{text:`스킬 포인트가 없습니다`,kind:`warn`});return}this.ranks[e]=this.rank(e)+1,this.ctx.bus.emit(`notify`,{text:`${t.name} ${this.ranks[e]}랭크!`,kind:`item`}),this.changed()}changed(){let e={};for(let[t,n]of Object.entries(this.ranks))for(let[r,i]of Object.entries(this.defs[t].effects))e[r]=(e[r]??0)+i*n;let t=Object.fromEntries(Object.keys(this.defs).map(e=>[e,this.blockReason(e)]));this.ctx.bus.emit(`skills:changed`,{ranks:this.ranks,effects:e,blocked:t})}},cd=class{constructor(e){this.ctx=e,this.cfg=e.data.config.map;let t=e.data.config.world.bounds;this.bounds=t,this.cols=Math.ceil((t.maxX-t.minX)/this.cfg.cellSize),this.rows=Math.ceil((t.maxZ-t.minZ)/this.cfg.cellSize),this.cells=new Uint8Array(this.cols*this.rows),this.visited=new Set,this.region=null,this.timer=0;let{bus:n}=e;n.on(`base:created`,({base:e})=>this.reveal(e.position.x,e.position.z,e.areaRadius+6)),n.on(`player:teleport`,({position:e})=>this.reveal(e.x,e.z,this.cfg.revealRadius)),n.on(`save:collect`,e=>{e.exploration={cells:Array.from(this.cells).join(``),visited:[...this.visited]}}),n.on(`save:apply`,e=>{let t=e.exploration;if(t?.cells?.length===this.cells.length)for(let e=0;e<this.cells.length;e++)this.cells[e]=+(t.cells.charCodeAt(e)===49);this.visited=new Set(t?.visited??[])}),n.on(`save:loaded`,()=>{for(let t of e.bases)this.reveal(t.position.x,t.position.z,t.areaRadius+6,!0);this.region=null,this.emit()})}index(e,t){let n=Math.floor((e-this.bounds.minX)/this.cfg.cellSize),r=Math.floor((t-this.bounds.minZ)/this.cfg.cellSize);return n<0||r<0||n>=this.cols||r>=this.rows?-1:r*this.cols+n}reveal(e,t,n,r=!1){let i=this.cfg.cellSize,a=!1;for(let r=-n;r<=n;r+=i/2)for(let o=-n;o<=n;o+=i/2){if(o*o+r*r>n*n)continue;let i=this.index(e+o,t+r);i>=0&&!this.cells[i]&&(this.cells[i]=1,a=!0)}a&&!r&&this.emit()}emit(){this.ctx.bus.emit(`map:explored`,{cells:this.cells,cols:this.cols,rows:this.rows})}update(e){if(this.timer-=e,this.timer>0)return;this.timer=this.cfg.revealInterval;let t=this.ctx.player.position;this.reveal(t.x,t.z,this.cfg.revealRadius);let n=this.ctx.world.regionAt(t.x,t.z);if(n===this.region)return;let r=this.region===null;this.region=n;let i=!this.visited.has(n.id);this.visited.add(n.id),r||this.ctx.bus.emit(`region:entered`,{id:n.id,name:n.name,first:i})}},ld=class{constructor(e){this.ctx=e,this.cfg=e.data.config.interact,this.target=null}find(){let{player:e,structures:t,mode:n}=this.ctx;if(!e.alive||n!==`play`)return null;let r=null,i=1/0;for(let n of t){let t=e.position.distanceTo(n.position)-n.radius;t<this.cfg.range&&t<i&&(i=t,r=n)}return r}hint(e){if(!e)return``;if(e.kind===`turret`)return`E  ${e.def.name}${e.alive?``:` (부서짐)`} 관리`;if(e.kind===`facility`){let t={workbench:`제작`,storage:`열기`,shop:`사고팔기`}[e.type];return e.alive?`E  ${e.def.name} — ${t}`:`${e.def.name} (부서짐 · 아침에 복구)`}return`E  ${e.base.label} — 건설·업그레이드`}update(){let e=this.find();e!==this.target&&(this.target=e,this.ctx.bus.emit(`interact:hint`,{text:this.hint(e)})),e&&this.ctx.input.wasPressed(`KeyE`)&&(e.kind===`turret`?this.ctx.bus.emit(`interact:turret`,{turret:e}):e.kind===`facility`?e.alive&&this.ctx.bus.emit(`interact:facility`,{facility:e}):this.ctx.bus.emit(`interact:base`,{base:e.base}))}},ud=class{constructor(e,t,n,r,{hp:i}={}){this.ctx=e,this.kind=`facility`,this.type=t,this.def=e.data.buildings.buildings[t],this.baseId=n,this.position=r.clone(),this.radius=this.def.radius,this.stats={maxHp:this.def.hp,hp:Math.min(this.def.hp,i??this.def.hp)},this.alive=this.stats.hp>0,this.flash=0,this.hpTimer=0;let{group:a,parts:o}=Uu(this.def.model);this.mats=o.map(e=>e.material),this.baseColors=this.mats.map(e=>e.color.clone()),this.hpBar=new tu(1.2,8177274),this.hpBar.group.position.y=2.8,a.add(this.hpBar.group),a.position.copy(this.position),this.mesh=a,e.scene.add(a),this.applyLook()}get displayName(){return this.def.name}applyLook(){this.mesh.rotation.z=this.alive?0:.15,this.mats.forEach((e,t)=>e.color.copy(this.baseColors[t]).multiplyScalar(this.alive?1:.55))}takeDamage(e){return this.alive?(this.stats.hp=Math.max(0,this.stats.hp-e),this.flash=.12,this.hpTimer=4,this.stats.hp<=0&&(this.alive=!1,this.applyLook(),!0)):!1}repairFull(){this.stats.hp=this.stats.maxHp,this.alive=!0,this.applyLook()}update(e){this.flash=Math.max(0,this.flash-e),this.hpTimer=Math.max(0,this.hpTimer-e);let t=this.flash>0?.6:0;for(let e of this.mats)e.emissive.setRGB(t,t*.3,t*.3);let n=this.stats;this.hpBar.update(n.hp/n.maxHp,this.ctx.camera,this.alive&&(this.hpTimer>0||n.hp<n.maxHp))}dispose(){this.ctx.scene.remove(this.mesh)}},dd=class{constructor(e){this.ctx=e,this.list=[];let{bus:t}=e;t.on(`build:place`,n=>{n.kind===`facility`&&(this.add(n.type,n.baseId,n.position),t.emit(`notify`,{text:`${e.data.buildings.buildings[n.type].name} 완성!`,kind:`item`}))}),t.on(`time:day`,()=>{for(let e of this.list)e.repairFull()}),t.on(`save:collect`,e=>{e.facilities=this.list.map(e=>({type:e.type,baseId:e.baseId,position:[e.position.x,e.position.z],hp:e.stats.hp}))}),t.on(`save:apply`,t=>{for(let n of t.facilities??[])e.data.buildings.buildings[n.type]&&this.add(n.type,n.baseId,new W(n.position[0],0,n.position[1]),{hp:n.hp})})}add(e,t,n,r){let i=new ud(this.ctx,e,t,n,r);return this.list.push(i),this.ctx.structures.push(i),this.ctx.bus.emit(`facility:changed`,{facility:i}),i}update(e){for(let t of this.list)t.update(e)}},fd=class{constructor(e){this.ctx=e,e.bus.on(`craft:make`,({recipe:e,baseLevel:t})=>this.make(e,t))}make(e,t){let{bus:n,data:r}=this.ctx,i=r.recipes[e];if(!i)return;let a=r.items.items[i.result].name;if(t<i.baseLevel){n.emit(`notify`,{text:`기지 Lv${i.baseLevel} 작업대에서 만들 수 있어요`,kind:`warn`});return}let o={item:i.result,count:i.count,ok:!1};if(n.emit(`inventory:can-add`,o),!o.ok){n.emit(`notify`,{text:`가방에 자리가 없습니다`,kind:`warn`});return}let s={items:i.ingredients,ok:!1};if(n.emit(`inventory:spend`,s),!s.ok){n.emit(`notify`,{text:`재료가 부족합니다`,kind:`warn`});return}n.emit(`inventory:add`,{item:i.result,count:i.count,taken:0}),n.emit(`notify`,{text:`${a}${i.count>1?` ${i.count}개`:``} 제작!`,kind:`item`})}},pd=class{constructor(e){this.ctx=e,this.storages=new Map;let{bus:t}=e;t.on(`storage:deposit`,({baseId:e,slot:t})=>this.deposit(e,t)),t.on(`storage:withdraw`,({baseId:e,slot:t})=>this.withdraw(e,t)),t.on(`storage:request`,({baseId:e})=>this.changed(e)),t.on(`storage:lose`,t=>{if(!this.hasStorage(t.baseId))return;t.handled=!0;let n=this.get(t.baseId),r=0;for(let i=0;i<n.length;i++){let a=n[i];if(!a||e.data.items.items[a.id].category!==`material`)continue;let o=Math.ceil(a.count*t.ratio);a.count-=o,r+=o,a.count<=0&&(n[i]=null)}t.lost=r,this.changed(t.baseId)}),t.on(`save:collect`,e=>{e.storages=Object.fromEntries([...this.storages].map(([e,t])=>[e,t.map(e=>e?{...e}:null)]))}),t.on(`save:apply`,t=>{for(let[n,r]of Object.entries(t.storages??{})){let t=this.get(Number(n));r.forEach((n,r)=>{n&&e.data.items.items[n.id]&&r<t.length&&(t[r]={...n})})}})}hasStorage(e){return this.ctx.structures.some(t=>t.kind===`facility`&&t.type===`storage`&&t.baseId===e)}get(e){return this.storages.has(e)||this.storages.set(e,Array(this.ctx.data.buildings.buildings.storage.slots).fill(null)),this.storages.get(e)}deposit(e,t){let{bus:n,data:r}=this.ctx,i={slot:t,item:null};if(n.emit(`inventory:take-slot`,i),!i.item)return;let{id:a,count:o}=i.item,s=Su(this.get(e),a,o,yu(r,a));s<o&&(n.emit(`inventory:add`,{item:a,count:o-s,taken:0}),n.emit(`notify`,{text:`창고가 가득 찼습니다`,kind:`warn`})),this.changed(e)}withdraw(e,t){let n=this.get(e),r=n[t];if(!r)return;let i={item:r.id,count:r.count,taken:0};this.ctx.bus.emit(`inventory:add`,i),i.taken||this.ctx.bus.emit(`notify`,{text:`가방이 가득 찼습니다`,kind:`warn`}),r.count-=i.taken,r.count<=0&&(n[t]=null),this.changed(e)}changed(e){this.ctx.bus.emit(`storage:changed`,{baseId:e,slots:this.get(e)})}},md=new W;function hd(e,t){return e.ctx.scene.add(t),e.sceneMarks.push(t),t}function gd(e,t){for(let n of e)n.material.opacity=.15+.35*t}function _d(e){for(let t of e)t.visible=!1}var vd={slam:{ready:(e,t,n)=>n<t.radius*.8,start(e,t){t.marks??=[(()=>{let n=au(t.radius);return e.mesh.add(n),n})()],t.marks[0].visible=!0},during:(e,t,n,r)=>gd(t.marks,r),fire(e,t){_d(t.marks),e.ctx.bus.emit(`boss:aoe`,{position:e.position.clone(),radius:t.radius,damage:t.damage,boss:e})}},jump:{ready:(e,t,n)=>n<t.range,start(e,t,n){t.marks??=[hd(e,au(t.radius))],t.marks[0].position.set(n.target.x,.05,n.target.z),t.marks[0].visible=!0,n.from=e.position.clone()},during(e,t,n,r){gd(t.marks,r);let i=Math.max(0,(r-.3)/.7);e.position.lerpVectors(n.from,n.target,i),e.jumpHeight=Math.sin(i*Math.PI)*3},fire(e,t,n){_d(t.marks),e.jumpHeight=0,e.position.copy(n.target),e.ctx.bus.emit(`boss:aoe`,{position:n.target.clone(),radius:t.radius,damage:t.damage,boss:e})}},volley:{ready:(e,t,n)=>n<t.range,fire(e,t){e.ctx.bus.emit(`boss:volley`,{origin:e.position.clone(),count:t.count,speed:t.speed,damage:t.damage,range:t.range})}},boulder:{ready:(e,t,n)=>n<t.range,start(e,t,n){t.marks??=[hd(e,au(t.radius))],t.marks[0].position.set(n.target.x,.05,n.target.z),t.marks[0].visible=!0},during:(e,t,n,r)=>gd(t.marks,r),fire(e,t,n){e.ctx.bus.emit(`boss:boulder`,{from:e.position.clone().setY(e.radius*2),target:n.target.clone(),speed:t.speed,radius:t.radius,damage:t.damage,mark:t.marks[0]})}},summon:{ready:(e,t,n)=>n<t.range,fire(e,t){e.ctx.bus.emit(`monster:spawn`,{type:t.monster,count:t.count,position:e.position.clone(),spread:e.radius+1.5,summoned:!0})}},roots:{ready:(e,t,n)=>n<t.range,start(e,t,n){t.marks??=Array.from({length:t.count},()=>hd(e,ou(t.length,t.width))),md.set(n.target.x-e.position.x,0,n.target.z-e.position.z);let r=Math.atan2(md.x,md.z),i=Vt.degToRad(t.spreadDeg);n.lines=t.marks.map((n,a)=>{let o=r+(a-(t.count-1)/2)*i;return n.position.set(e.position.x,.05,e.position.z),n.rotation.y=o,n.visible=!0,{origin:e.position.clone(),dir:new W(Math.sin(o),0,Math.cos(o))}})},during:(e,t,n,r)=>gd(t.marks,r),fire(e,t,n){_d(t.marks);for(let r of n.lines)e.ctx.bus.emit(`boss:line`,{origin:r.origin,dir:r.dir,length:t.length,width:t.width,damage:t.damage,boss:e})}},leafstorm:{ready:(e,t,n)=>n<t.range,fire(e,t){e.ctx.bus.emit(`boss:leafstorm`,{boss:e,count:t.count,damage:t.damage,duration:t.duration,maxRadius:t.maxRadius})}}},yd=new W,bd=class extends du{constructor(e,t,n,r={}){let i=new W(n.lair[0],0,n.lair[1]);super(e,r.monster??n.monster,r.position??i),this.boss=!0,this.bossId=t,this.bdef=n,this.lair=i,this.part=!!r.part,this.hasFled=!0,this.cast=null,this.engaged=!1,this.jumpHeight=0,this.cdSpeed=1,this.sceneMarks=[],this.hpBar.group.visible=!1,this.patterns=(r.patterns??n.patterns).map((e,t)=>({...e,cd:1.2+t*1.3})),this.setState(this.part?`chase`:`idle`)}setEngaged(e){this.engaged!==e&&(this.engaged=e,this.ctx.bus.emit(e?`boss:engaged`:`boss:disengaged`,{boss:this}))}think(e){let t=this.def,n=this.bdef,r=this.ctx.player,i=new W,a=0;for(let t of this.patterns)t.cd-=e*this.cdSpeed;let o=r.alive?this.position.distanceTo(r.position):1/0,s=this.position.distanceTo(this.lair);switch(this.state){case`idle`:o<n.aggroRange&&this.setState(`chase`);break;case`chase`:{if(this.setEngaged(!0),!r.alive||s>n.leashRange||this.lair.distanceTo(r.position)>n.leashRange+6){this.setState(`return`);break}let e=this.patterns.find(e=>e.cd<=0&&vd[e.kind].ready(this,e,o));if(e){this.startCast(e);break}i.set(r.position.x-this.position.x,0,r.position.z-this.position.z),a=o>this.radius+1.2?t.chaseSpeed:0;break}case`cast`:this.updateCast();break;case`return`:this.setEngaged(!1),i.set(this.lair.x-this.position.x,0,this.lair.z-this.position.z),a=t.moveSpeed*2,s<1&&(this.stats.hp=this.stats.maxHp,this.setState(`idle`))}return{move:i,speed:a}}startCast(e){let t=this.ctx.player.position;this.cast={p:e,target:new W(t.x,0,t.z)},this.setState(`cast`),vd[e.kind].start?.(this,e,this.cast)}updateCast(){let e=this.cast,t=vd[e.p.kind],n=Math.min(1,this.stateTime/(e.p.windup/this.cdSpeed));yd.set(e.target.x-this.position.x,0,e.target.z-this.position.z),yd.lengthSq()>1e-4&&this.facing.copy(yd.normalize()),t.during?.(this,e.p,e,n),!(n<1)&&(t.fire(this,e.p,e),e.p.cd=e.p.cooldown,this.cast=null,this.setState(`chase`))}animate(e,t){if(super.animate(e,t),this.hpBar.group.visible=!1,this.state===`cast`){let e=Math.min(1,this.stateTime/(this.cast.p.windup/this.cdSpeed));this.body.scale.set(1+e*.12,1-e*.2,1+e*.12)}this.body.position.y+=this.jumpHeight}checkPhase(){let e=this.bdef,t=this.stats.hp/this.stats.maxHp;e.split&&!this.part&&!this.splitDone&&t<=e.split.at&&(this.splitDone=!0,this.clearCast(),this.setEngaged(!1),this.alive=!1,this.done=!0,this.ctx.bus.emit(`boss:split`,{boss:this})),e.enrage&&!this.enraged&&t<=e.enrage.at&&(this.enraged=!0,this.cdSpeed=e.enrage.speed,this.mat.color.set(e.enrage.color),this.ctx.bus.emit(`notify`,{text:`${e.name}이(가) 분노했습니다!`,kind:`warn`}),this.ctx.bus.emit(`boss:enraged`,{boss:this}))}clearCast(){for(let e of this.patterns)for(let t of e.marks??[])t.visible=!1;this.jumpHeight=0,this.cast=null,this.state===`cast`&&this.setState(`chase`)}takeDamage(e,t){return super.takeDamage(e,t)?(this.setEngaged(!1),this.clearCast(),!0):(this.checkPhase(),this.alive&&(this.state===`idle`||this.state===`wander`||this.state===`flee`)&&this.setState(`chase`),!1)}dispose(){this.setEngaged(!1);for(let e of this.sceneMarks)this.ctx.scene.remove(e);super.dispose()}},xd=new W,Sd=class{constructor(e){this.ctx=e,this.defs=e.data.bosses,this.status={},this.active=new Map,this.pool=new Qu(e.scene),this.gravity=e.data.config.turret.gravity;let{bus:t}=e;for(let e of Object.values(this.defs))this.buildLair(e);t.on(`monster:killed`,({position:e})=>{for(let[t,n]of this.active)n.some(e=>e.alive)||n.some(e=>e.state===`dead`)&&this.defeat(t,e)}),t.on(`boss:split`,({boss:e})=>this.split(e)),t.on(`boss:volley`,e=>this.volley(e)),t.on(`boss:boulder`,e=>this.boulder(e)),t.on(`save:collect`,e=>{e.bosses={...this.status}}),t.on(`save:apply`,e=>{this.status={...e.bosses??{}}}),t.on(`save:loaded`,()=>this.emitStatus()),t.on(`game:new`,()=>this.emitStatus())}buildLair(e){let t=new Rn,n=new Qi({color:9078144,flatShading:!0}),r=new Qi({color:15919832,flatShading:!0});for(let e=0;e<14;e++){let r=e/14*Math.PI*2,i=new X(new Fi(.7+e%3*.25,0),n);i.position.set(Math.cos(r)*9,.3,Math.sin(r)*9),i.castShadow=!0,t.add(i)}for(let e=0;e<5;e++){let n=new X(new Z(.08,.08,.9,5),r);n.rotation.set(Math.PI/2,e*1.3,0),n.position.set(Math.cos(e*2.1)*5,.1,Math.sin(e*2.1)*5),t.add(n)}t.position.set(e.lair[0],0,e.lair[1]),this.ctx.scene.add(t)}defeat(e,t){let n=this.defs[e],{bus:r}=this.ctx;this.status[e]={defeatedDay:this.ctx.time.day},this.active.delete(e);let i=this.ctx.data.monsters[n.monster].bossDrops;i&&r.emit(`loot:table`,{drops:i,position:t}),r.emit(`boss:defeated`,{id:e,name:n.name}),r.emit(`notify`,{text:`${n.name} 처치! ${n.respawnDays}일 뒤에 다시 나타납니다`,kind:`gold`}),this.emitStatus()}split(e){let t=e.bdef.split,n=[];for(let r=0;r<t.count;r++){let i=e.facing.clone().applyAxisAngle(new W(0,1,0),Math.PI/2+r/t.count*Math.PI*2),a=e.position.clone().addScaledVector(i,e.radius),o=new bd(this.ctx,e.bossId,e.bdef,{monster:t.into,position:a,patterns:t.patterns,part:!0});o.knock.copy(i).multiplyScalar(6),n.push(o),this.ctx.monsters.push(o)}for(let e of n)e.parts=n;this.active.set(e.bossId,n),this.ctx.bus.emit(`notify`,{text:`${e.bdef.name}이(가) 둘로 갈라졌습니다!`,kind:`warn`})}isDefeated(e){let t=this.status[e];return t&&this.ctx.time.day-t.defeatedDay<this.defs[e].respawnDays}emitStatus(){let e=Object.entries(this.defs).map(([e,t])=>({id:e,name:t.name,lair:t.lair,defeated:!!this.isDefeated(e)}));this.ctx.bus.emit(`boss:status`,{list:e})}volley({origin:e,count:t,speed:n,damage:r,range:i}){for(let a=0;a<t;a++){let o=a/t*Math.PI*2;xd.set(Math.cos(o)*n,0,Math.sin(o)*n),this.pool.acquire(`bolt`).fire(e.clone().setY(1.2),xd,r,i/n,{enemy:!0})}}boulder({from:e,target:t,speed:n,radius:r,damage:i,mark:a}){let o=this.gravity;xd.set(t.x-e.x,0,t.z-e.z);let s=Math.max(.6,xd.length()/n),c=xd.divideScalar(s);c.y=(0-e.y+.5*o*s*s)/s;let l=this.pool.acquire(`ball`);l.fire(e,c,i,s+1,{gravity:o,splash:{radius:r}}),l.mesh.scale.setScalar(2.2),l.mark=a}update(e){let{player:t,monsters:n,bus:r}=this.ctx;for(let[e,i]of Object.entries(this.defs)){let a=xd.set(i.lair[0],0,i.lair[1]),o=t.position.distanceTo(a),s=this.active.get(e);if(!s&&!this.isDefeated(e)&&o<i.spawnRange){let t=new bd(this.ctx,e,i);this.active.set(e,[t]),n.push(t),r.emit(`notify`,{text:`어딘가에서 ${i.name}의 기척이 느껴집니다…`,kind:`warn`})}else if(s&&o>i.despawnRange&&s.every(e=>e.alive&&!e.engaged)){for(let e of s)e.done=!0,e.alive=!1;this.active.delete(e)}}for(let n of this.pool.active()){if(n.step(e),n.splash){(n.position.y<=0||n.life<=0)&&(r.emit(`boss:aoe`,{position:n.position.clone().setY(0),radius:n.splash.radius,damage:n.damage}),n.mark&&(n.mark.visible=!1),n.mesh.scale.setScalar(1),n.release());continue}let i=t.position.x-n.position.x,a=t.position.z-n.position.z;t.alive&&i*i+a*a<(t.radius+.25)**2?(r.emit(`enemy:hit-player`,{damage:n.damage,dir:n.velocity.clone().setY(0).normalize()}),n.release()):n.life<=0&&n.release()}}},Cd=new J(16773808),wd=(e,t={})=>new Qi({color:e,flatShading:!0,roughness:.85,...t});function Td(e,t){let n=new Rn,r=new Rn,i=(e,t,n,r,i,a,o=1,s=1,c=1)=>{let l=new X(t,n);return l.position.set(r,i,a),l.scale.set(o,s,c),l.castShadow=!0,l.receiveShadow=!0,e.add(l),l},a=wd(`#9a6a45`),o=wd(`#e0c38a`);switch(e){case`roundTree`:{i(n,new Z(.22,.3,1.6,7),a,0,.8,0),i(n,new Ii(1.35,0),wd(`#79c96a`),0,2.3,0,1,.9,1);let e=wd(`#ff6b6b`);for(let r=0;r<4;r++){let r=t()*Math.PI*2;i(n,new Bi(.12,6,4),e,Math.cos(r)*1.05,2+t()*.6,Math.sin(r)*1.05)}i(r,new Z(.28,.34,.45,7),a,0,.22,0),i(r,new Z(.27,.27,.02,7),o,0,.46,0);break}case`pine`:{i(n,new Z(.2,.3,1.3,7),a,0,.65,0);let e=wd(`#3f8a55`);i(n,new Ni(1.25,1.9,7),e,0,1.9,0),i(n,new Ni(.9,1.5,7),e,0,2.9,0),i(n,new Bi(.16,6,4),wd(`#e9b44f`,{emissive:`#6b4a10`}),.24,1,.2),i(r,new Z(.26,.32,.4,7),a,0,.2,0),i(r,new Z(.25,.25,.02,7),o,0,.41,0);break}case`rock`:{i(n,new Fi(.95,0),wd(`#a9adb6`),0,.55,0,1.1,.8,1);let e=wd(`#8a7f8f`,{metalness:.4});for(let r=0;r<3;r++)i(n,new Li(.14,0),e,(t()-.5)*1.1,.5+t()*.5,.55+t()*.2);for(let e=0;e<3;e++)i(r,new Fi(.25,0),wd(`#b8bcc4`),(t()-.5)*.9,.15,(t()-.5)*.9);break}case`herb`:{i(n,new Ii(.55,0),wd(`#6fbf5f`),0,.35,0,1.2,.7,1.2);let e=wd(`#f4f0ff`,{emissive:`#443a55`});for(let r=0;r<5;r++)i(n,new Li(.09,0),e,(t()-.5)*.9,.6+t()*.15,(t()-.5)*.9);i(r,new Ni(.1,.25,4),wd(`#6fbf5f`),0,.12,0);break}case`fiber`:{let e=wd(`#9fd46a`);for(let r=0;r<9;r++)i(n,new Ni(.07,1.1+t()*.4,3),e,(t()-.5)*.6,.55,(t()-.5)*.6).rotation.set((t()-.5)*.5,t()*3,(t()-.5)*.5);i(r,new Ni(.08,.2,3),e,0,.1,0);break}case`cactus`:{let e=wd(`#5fa85a`);i(n,new Z(.36,.42,2.6,8),e,0,1.3,0),i(n,new Z(.2,.2,.9,6),e,.55,1.5,0),i(n,new Z(.2,.2,.7,6),e,-.55,1.2,0),i(n,new Li(.2,0),wd(`#ff8fb1`),0,2.7,0),i(r,new Z(.36,.42,.35,8),e,0,.17,0);break}case`sandstone`:{let e=[`#e0a86a`,`#d99a5c`,`#ebb982`];for(let r=0;r<3;r++)i(n,new Ai(1.5-r*.3,.45,1.3-r*.25),wd(e[r]),(t()-.5)*.2,.22+r*.45,0);i(n,new Li(.16,0),wd(`#ffd23f`,{emissive:`#8a6a10`}),.4,1.35,.2),i(r,new Ai(1.2,.3,1),wd(`#d99a5c`),0,.15,0);break}case`ice`:{let e=wd(`#9fd8ff`,{transparent:!0,opacity:.85,roughness:.2,emissive:`#1b3a55`});i(n,new Z(.35,.5,2.4,6),e,0,1.2,0),i(n,new Z(.2,.3,1.5,6),e,.5,.75,.2).rotation.z=-.3,i(n,new Li(.18,0),wd(`#e6fbff`,{emissive:`#4a7a9a`}),0,2.55,0),i(r,new Z(.4,.5,.35,6),e,0,.17,0);break}}return{alive:n,stump:r}}var Ed=class{constructor(e,t,n,r,i,a){this.id=t,this.type=n,this.def=r,this.position=i,this.radius=r.radius,this.hp=r.hp,this.alive=!0,this.depletedDay=null,this.wobble=0,this.sparkle=0;let{alive:o,stump:s}=Td(r.model,a);this.group=new Rn,this.group.position.copy(i),this.group.rotation.y=a()*Math.PI*2,this.group.add(o,s),this.aliveMesh=o,this.stumpMesh=s,this.mats=[],o.traverse(e=>{e.isMesh&&this.mats.push(e.material)}),this.baseEmissive=this.mats.map(e=>e.emissive.clone()),e.add(this.group),this.applyLook()}applyLook(){this.aliveMesh.visible=this.alive,this.stumpMesh.visible=!this.alive}hit(e){return!this.alive||(this.hp-=e,this.wobble=1,this.hp>0)?!1:(this.alive=!1,this.applyLook(),!0)}restore(){this.alive=!0,this.hp=this.def.hp,this.depletedDay=null,this.applyLook()}update(e,t,n){if(!this.wobble&&!t&&this.sparkle<.001)return;this.wobble=Math.max(0,this.wobble-e*4);let r=Math.sin(n*40)*this.wobble*.08;this.aliveMesh.rotation.z=r,this.aliveMesh.rotation.x=r*.6;let i=t&&this.alive?1:0;this.sparkle+=(i-this.sparkle)*Math.min(1,e*6);let a=this.sparkle*(.18+Math.sin(n*5)*.12);this.mats.forEach((e,t)=>{e.emissive.copy(this.baseEmissive[t]).lerp(Cd,a)})}},Dd=new W,Od=class{constructor(e){this.ctx=e,this.cfg=e.data.config.gather,this.defs=e.data.nodes.nodes,this.nodes=[],this.byId=new Map,this.visTimer=0,e.nodes=this.nodes,this.generate();let{bus:t}=e;t.on(`player:attack`,e=>this.onAttack(e)),t.on(`time:day`,({day:e})=>this.restore(e)),t.on(`save:collect`,e=>{let t={};for(let e of this.nodes)e.alive||(t[e.id]=e.depletedDay);e.gather={depleted:t}}),t.on(`save:apply`,e=>{for(let[t,n]of Object.entries(e.gather?.depleted??{})){let e=this.byId.get(t);e&&(e.alive=!1,e.hp=0,e.depletedDay=n,e.applyLook())}})}generate(){let{world:e,scene:t,data:n}=this.ctx,r=e.bounds,i=kl(this.cfg.seed),a={};for(let o of e.regions.list){let s=Math.max(o.zFrom,r.minZ)+3,c=Math.min(o.zTo,r.maxZ)-3;if(c<=s)continue;let l=(r.maxX-r.minX)*(c-s);for(let[u,d]of Object.entries(n.nodes.density[o.id]??{})){let n=this.defs[u],f=Math.round(d*l/1e3);for(let l=0;l<f;l++)for(let l=0;l<30;l++){let l=i.range(r.minX+4,r.maxX-4),d=i.range(s,c);if(e.nearSpawn(l,d)||e.isBlocked(l,d,n.radius+.6)||this.nodes.some(e=>Math.abs(e.position.x-l)<2.5&&Math.abs(e.position.z-d)<2.5))continue;a[u]=(a[u]??0)+1;let f=new Ed(t,`${u}-${a[u]}`,u,n,new W(l,0,d),i.next);f.region=o.id,this.nodes.push(f),this.byId.set(f.id,f),n.collide&&e.addCollider(l,d,n.radius*.8);break}}}}onAttack(e){let t=this.ctx.player.stats,n=this.cfg.damage*(1+(t.gatherSpeed??0)),r=e.arc/2;for(let t of this.nodes){if(!t.alive||!t.group.visible)continue;Dd.set(t.position.x-e.origin.x,0,t.position.z-e.origin.z);let i=Dd.length();if(i-t.radius>e.range||i>t.radius&&Dd.divideScalar(i).angleTo(e.dir)>r)continue;let a=t.hit(n);this.ctx.bus.emit(`gather:hit`,{position:t.position.clone().setY(.8),color:t.def.color,sound:t.def.sound}),a&&this.deplete(t)}}deplete(e){let{bus:t,player:n,time:r}=this.ctx;e.depletedDay=r.day;let i=Math.round(n.stats.gatherAmount??0);e.def.drops.forEach((n,r)=>{let a=n.chanceByRegion?.[e.region]??n.chance;if(Math.random()>=a)return;let o=Al.int(n.min,n.max)+(r===0?i:0);o>0&&t.emit(`loot:spawn`,{item:n.item,count:o,position:e.position.clone()})}),t.emit(`gather:done`,{type:e.type,position:e.position.clone(),xp:e.def.xp,color:e.def.color})}restore(e){for(let t of this.nodes)!t.alive&&e-t.depletedDay>=t.def.respawnDays&&t.restore()}update(e){let t=this.ctx.player.position,n=this.ctx.time.elapsed;this.visTimer-=e;let r=this.visTimer<=0;r&&(this.visTimer=.5);let i=this.cfg.visibleRange,a=this.cfg.sparkleRange;for(let o of this.nodes){let s=o.position.x-t.x,c=o.position.z-t.z,l=s*s+c*c;r&&(o.group.visible=l<i*i),o.group.visible&&o.update(e,l<a*a,n)}}},kd=new W,Ad=class{constructor(e){this.ctx=e,this.pool=new Qu(e.scene),e.bus.on(`player:shoot`,e=>this.shoot(e))}shoot(e){let t=e.count;for(let n=0;n<t;n++){let r=t>1?(n/(t-1)-.5)*e.spread*(t-1):0;kd.copy(e.dir).applyAxisAngle(new W(0,1,0),r).multiplyScalar(e.speed);let i=this.pool.acquire(`arrow`);i.fire(e.origin,kd,e.attack,e.range/e.speed),i.shot=e}}update(e){let{monsters:t,bus:n}=this.ctx;for(let r of this.pool.active()){r.step(e);let i=null;for(let e of t){if(!e.alive||e.untargetable)continue;let t=e.position.x-r.position.x,n=e.position.z-r.position.z;if(t*t+n*n<(e.radius+.2)**2){i=e;break}}i?(n.emit(`arrow:hit`,{monster:i,shot:r.shot,dir:r.velocity.clone().setY(0).normalize()}),r.release()):(r.life<=0||this.ctx.world.isBlocked(r.position.x,r.position.z,.05))&&r.release()}}},jd={poison:8181370,slow:9425151},Md=class{constructor(e){this.ctx=e,this.cfg=e.data.config.status,this.list=[],e.bus.on(`status:apply`,e=>this.apply(e))}apply({target:e,type:t,duration:n,amount:r}){if(!e.alive)return;if(e===this.ctx.player){let i=e.stats;if(t===`slow`&&i.slowImmune)return;if(t===`poison`){let e=1-Math.min(1,i.poisonResist??0);if(e<=0)return;n*=e,r=(r??this.cfg.playerPoisonDps)*e}}let i=this.list.find(n=>n.target===e&&n.type===t);if(!i){let n=new X(new Li(.13,0),new Qr({color:jd[t]}));e.mesh.add(n),i={target:e,type:t,icon:n,tick:1},this.list.push(i)}i.time=n,i.amount=r??(t===`poison`?this.cfg.poisonDps:this.cfg.slowDefault),this.layout(e)}layout(e){let t=this.list.filter(t=>t.target===e),n=e===this.ctx.player?this.cfg.playerIconHeight:e.radius*2+.7;t.forEach((e,r)=>e.icon.position.set((r-(t.length-1)/2)*.32,n,0))}remove(e){e.target.mesh.remove(e.icon),e.type===`slow`&&(e.target.speedMult=1),this.list=this.list.filter(t=>t!==e),this.layout(e.target)}update(e){for(let t of[...this.list]){let n=t.target;if(t.time-=e,!n.alive||t.time<=0){this.remove(t);continue}t.icon.rotation.y+=e*3,t.type===`slow`&&(n.speedMult=1-t.amount),t.type===`poison`&&(t.tick-=e,t.tick<=0&&(t.tick=1,this.ctx.bus.emit(`status:damage`,{target:n,amount:Math.max(1,Math.round(t.amount))})))}}},Nd=new W,Pd=class{constructor(e){this.ctx=e,this.cfg=e.data.config.enemyShot,this.pool=new Qu(e.scene),this.storms=[],e.bus.on(`monster:shoot`,e=>this.shoot(e)),e.bus.on(`boss:leafstorm`,e=>this.leafstorm(e))}shoot({origin:e,dir:t,speed:n,damage:r,effect:i,kind:a}){let o=this.pool.acquire(a);o.fire(e,t.clone().setY(0).normalize().multiplyScalar(n),r,this.cfg.life),o.effect=i??null}leafstorm({boss:e,count:t,damage:n,duration:r,maxRadius:i}){let a={boss:e,leaves:[],time:0,duration:r,from:e.radius+.5,maxRadius:i};for(let i=0;i<t;i++){let o=this.pool.acquire(`leaf`);o.fire(e.position,Nd.set(1,0,0),n,r),o.angle=i/t*Math.PI*2,o.storm=a,a.leaves.push(o)}this.storms.push(a)}touches(e){let t=this.ctx.player;if(!t.alive)return!1;let n=t.position.x-e.position.x,r=t.position.z-e.position.z;return n*n+r*r<(t.radius+this.cfg.hitRadius)**2}hit(e,t){this.ctx.bus.emit(`enemy:hit-player`,{damage:e.damage,dir:t,effect:e.effect}),e.release()}update(e){let{cfg:t}=this;for(let n of this.storms){n.time+=e;let r=n.from+(n.maxRadius-n.from)*Math.min(1,n.time/n.duration),i=n.boss.position;for(let a of n.leaves){if(!a.active||a.storm!==n)continue;a.angle+=t.leafSpin*e;let o=i.x+Math.cos(a.angle)*r,s=i.z+Math.sin(a.angle)*r;a.velocity.set(o-a.position.x,0,s-a.position.z),a.velocity.lengthSq()<1e-8&&a.velocity.set(1,0,0),a.position.set(o,t.leafHeight,s),a.life-=e,a.sync(),this.touches(a)?this.hit(a,Nd.set(o-i.x,0,s-i.z).normalize().clone()):(a.life<=0||!n.boss.alive)&&a.release()}}this.storms=this.storms.filter(e=>e.leaves.some(t=>t.active&&t.storm===e));for(let t of this.pool.active())t.kind!==`leaf`&&(t.step(e),this.touches(t)?this.hit(t,t.velocity.clone().setY(0).normalize()):(t.life<=0||this.ctx.world.isBlocked(t.position.x,t.position.z,0))&&t.release())}},Fd=class{constructor(e){this.ctx=e,this.buffs=new Map,this.emitTimer=0,e.bus.on(`item:use`,t=>{let n=e.data.items.items[t.item],r=n?.use?.buff;r&&(this.buffs.set(r.id,{id:r.id,name:n.name,color:n.color,time:r.duration,duration:r.duration,effects:r.effects}),t.used=!0,this.changed())}),e.bus.on(`player:died`,()=>{this.buffs.clear(),this.changed()})}changed(){let e={};for(let t of this.buffs.values())for(let[n,r]of Object.entries(t.effects))e[n]=(e[n]??0)+r;this.ctx.bus.emit(`buffs:changed`,{effects:e,list:[...this.buffs.values()]})}update(e){if(!this.buffs.size)return;let t=!1;for(let[n,r]of this.buffs)r.time-=e,r.time<=0&&(this.buffs.delete(n),t=!0);this.emitTimer-=e,(t||this.emitTimer<=0)&&(this.emitTimer=.5,this.changed())}},Id=new W,Ld=class{constructor(e,t){this.ctx=e,this.floats=[],t=document.createElement(`div`),t.className=`hud`,document.getElementById(`ui`).prepend(t),this.root=t,t.innerHTML=`
      <div class="hud-tl">
        <div class="hud-level"><span class="lv-badge">Lv <b data-lv>1</b></span><span class="sp-pip" data-sp hidden></span></div>
        <div class="bar hp"><div class="fill" data-hp></div><span data-hp-text></span></div>
        <div class="bar st"><div class="fill" data-st></div></div>
        <div class="bar xp"><div class="fill" data-xp></div></div>
        <div class="buffs" data-buffs></div>
      </div>
      <div class="hud-tr">
        <div class="tr-row"><button type="button" class="menu-btn" data-menu aria-label="메뉴">☰</button><div class="clock" data-clock><i class="sun" data-sun></i><b data-day>1일차</b><span data-until></span></div></div>
        <div class="gold"><i class="coin"></i><b data-gold>0</b></div>
        <div class="saved" data-saved>저장됨</div>
      </div>
      <div class="hud-notify" data-notify></div>
      <div class="hud-float" data-float></div>
      <div class="hud-help" data-help>WASD 이동 · Shift 달리기 · Space 구르기 · 좌클릭 공격 · I 가방 · C 캐릭터 · K 스킬 · B 건설 · M 지도</div>
      <div class="hud-banner" data-banner hidden></div>
      <div class="hud-interact" data-interact hidden></div>
      <div class="quickbar" data-quick></div>
      <div class="bossbar" data-boss hidden><b data-boss-name></b><div class="bar"><div class="fill" data-boss-fill></div></div></div>
      <div class="hud-death" data-death hidden><div>쓰러졌습니다…</div><small>곧 시작 지점에서 일어납니다</small></div>
      <div class="hud-vignette" data-vignette></div>
    `;let n=e=>t.querySelector(e);this.el={hp:n(`[data-hp]`),hpText:n(`[data-hp-text]`),st:n(`[data-st]`),xp:n(`[data-xp]`),gold:n(`[data-gold]`),notify:n(`[data-notify]`),float:n(`[data-float]`),death:n(`[data-death]`),vignette:n(`[data-vignette]`),saved:n(`[data-saved]`),clock:n(`[data-clock]`),sun:n(`[data-sun]`),day:n(`[data-day]`),until:n(`[data-until]`),help:n(`[data-help]`),banner:n(`[data-banner]`),interact:n(`[data-interact]`),quick:n(`[data-quick]`),buffs:n(`[data-buffs]`),boss:n(`[data-boss]`),bossName:n(`[data-boss-name]`),bossFill:n(`[data-boss-fill]`),lv:n(`[data-lv]`),sp:n(`[data-sp]`)};let{bus:r}=e;r.on(`gold:changed`,({gold:e,delta:t})=>{this.el.gold.textContent=e.toLocaleString(),t>0&&this.pulse(this.el.gold.parentElement)}),r.on(`notify`,e=>this.notify(e)),r.on(`buffs:changed`,({list:e})=>{this.el.buffs.innerHTML=e.map(e=>`<span class="buff" title="${e.name}"><i style="--c:${e.color}"></i>${Math.ceil(e.time)}</span>`).join(``)}),r.on(`settings:changed`,({key:e,value:t})=>{e===`damageNumbers`&&(this.hideNumbers=!t)}),r.on(`save:done`,()=>this.pulse(this.el.saved,`show`)),r.on(`stats:changed`,({level:e,xp:t,xpToNext:n,skillPoints:r})=>{this.el.lv.textContent=e,this.el.xp.style.width=Number.isFinite(n)?`${t/n*100}%`:`100%`,this.el.sp.hidden=r<=0,this.el.sp.textContent=`스킬 +${r} (K)`}),r.on(`xp:gain`,({amount:e,position:t})=>this.floatText({position:t,amount:`+${e} XP`,target:`xp`})),this.quick=[],r.on(`inventory:changed`,({slots:e})=>this.renderQuick(e)),t.querySelector(`[data-menu]`).addEventListener(`click`,()=>r.emit(`pause:open`)),this.el.quick.addEventListener(`pointerdown`,e=>{let t=[...this.el.quick.children].indexOf(e.target.closest(`.qslot`));t>=0&&this.quick[t]&&r.emit(`inventory:use-item`,{item:this.quick[t]})}),this.boss=null,r.on(`boss:engaged`,({boss:e})=>{this.boss=e,this.el.bossName.textContent=e.bdef?.name??e.def.name,this.el.boss.hidden=!1}),r.on(`boss:disengaged`,({boss:e})=>{this.boss===e&&(this.boss=null,this.el.boss.hidden=!0)}),r.on(`boss:defeated`,({name:e})=>this.banner(`${e} 처치!`,`큰 보상을 떨어뜨렸어요`,`level`)),r.on(`interact:hint`,({text:e})=>{this.el.interact.hidden=!e,this.el.interact.textContent=e}),r.on(`region:entered`,({name:e,first:t})=>{t?this.banner(`${e}`,`처음 와 보는 곳이에요`,`day`):this.notify({text:`${e}에 들어섰습니다`,kind:`info`})}),r.on(`stats:levelup`,({level:e})=>{this.banner(`레벨 업! Lv ${e}`,`스킬 포인트 +1 · 스킬 창(K)에서 배워요`,`level`),this.pulse(this.el.lv.parentElement)}),this.helpText=this.el.help.textContent,r.on(`build:hint`,({text:e,ok:t})=>{this.el.help.textContent=e||this.helpText,this.el.help.classList.toggle(`bad`,!!e&&!t)}),r.on(`raid:start`,({count:e})=>this.banner(`밤 습격!`,`몬스터 ${e}마리가 기지로 옵니다`,`night`)),r.on(`time:day`,({day:e})=>this.banner(`${e}일차 아침`,``,`day`)),r.on(`raid:result`,({results:e})=>{let t={cleared:`방어 성공`,partial:`부분 피해`,failed:`실패`};for(let n of e){let e=n.reward?` · 보상 골드 +${n.reward}`:``,r=n.remote?`${n.baseName} (원격)`:n.baseName;this.notify({text:`[${r}] 습격 ${t[n.status]} — ${n.killed}/${n.total} 처치${e}`,kind:n.status===`cleared`?`gold`:`warn`})}}),r.on(`combat:hit`,e=>this.floatText(e)),r.on(`player:damaged`,()=>this.pulse(this.el.vignette,`hit`)),r.on(`player:died`,()=>{this.el.death.hidden=!1}),r.on(`player:respawned`,()=>{this.el.death.hidden=!0})}pulse(e,t=`pulse`){e.classList.remove(t),e.offsetWidth,e.classList.add(t)}renderQuick(e){let{items:t,config:n}=this.ctx.data,r=new Map;for(let n of e)n&&t.items[n.id].category===`consumable`&&r.set(n.id,(r.get(n.id)??0)+n.count);this.quick=[...r.keys()].slice(0,n.quickslots),this.el.quick.innerHTML=Array.from({length:n.quickslots},(e,n)=>{let i=this.quick[n],a=i&&t.items[i];return`<div class="qslot"><kbd>${n+1}</kbd>${a?`<i class="item-icon" style="--c:${a.color}"></i><b class="count">${r.get(i)}</b>`:``}</div>`}).join(``)}banner(e,t,n){let r=this.el.banner;r.className=`hud-banner ${n}`,r.innerHTML=`<b>${e}</b>${t?`<small>${t}</small>`:``}`,r.hidden=!1,clearTimeout(this.bannerTimer),this.bannerTimer=setTimeout(()=>{r.hidden=!0},2800)}notify({text:e,kind:t=`info`,color:n}){let r=document.createElement(`div`);for(r.className=`note ${t}`,r.textContent=e,n&&r.style.setProperty(`--accent`,n),this.el.notify.prepend(r);this.el.notify.children.length>5;)this.el.notify.lastChild.remove();setTimeout(()=>r.classList.add(`out`),2200),setTimeout(()=>r.remove(),2700)}floatText({position:e,amount:t,crit:n,target:r}){if(this.hideNumbers&&r!==`xp`)return;let i=document.createElement(`div`);i.className=`dmg ${r}${n?` crit`:``}`,i.textContent=n?`${t}!`:`${t}`,this.el.float.appendChild(i);let a=e.clone();a.y+=1.4,a.x+=(Math.random()-.5)*.5,this.floats.push({el:i,pos:a,age:0})}update(e){let t=this.ctx.input;for(let e=0;e<this.quick.length;e++)t.wasPressed(`Digit${e+1}`)&&this.ctx.bus.emit(`inventory:use-item`,{item:this.quick[e]});if(this.boss){let e=this.boss.parts??[this.boss],t=t=>e.reduce((e,n)=>e+t(n.stats),0);this.el.bossFill.style.width=`${t(e=>e.hp)/t(e=>e.maxHp)*100}%`}let n=this.ctx.player.stats;this.el.hp.style.width=`${n.hp/n.maxHp*100}%`,this.el.hpText.textContent=`${Math.ceil(n.hp)} / ${n.maxHp}`,this.el.st.style.width=`${n.stamina/n.maxStamina*100}%`;let r=this.ctx.time,i=Math.ceil(r.untilChange),a=this.ctx.player.position;this.el.day.textContent=`${r.day}일차 · ${this.ctx.world.regionAt(a.x,a.z).name}`,this.el.until.textContent=`${r.isNight?`아침까지`:`밤까지`} ${Math.floor(i/60)}:${String(i%60).padStart(2,`0`)}`,this.el.clock.classList.toggle(`night`,r.isNight);let o=this.ctx.camera,s=window.innerWidth,c=window.innerHeight;for(let t=this.floats.length-1;t>=0;t--){let n=this.floats[t];n.age+=e,n.pos.y+=e*1.2,Id.copy(n.pos).project(o);let r=(Id.x*.5+.5)*s,i=(-Id.y*.5+.5)*c;n.el.style.transform=`translate(${r}px, ${i}px) translate(-50%, -50%) scale(${1+Math.max(0,.25-n.age)*2})`,n.el.style.opacity=String(Math.min(1,2.5-n.age*3)),n.age>.8&&(n.el.remove(),this.floats.splice(t,1))}}},Rd=class{constructor(e,t){this.ctx=e,this.layer=document.createElement(`div`),this.layer.className=`ui-windows`,t.appendChild(this.layer),this.windows=new Map,this.stack=[],e.bus.on(`build:start`,()=>{for(let e of[...this.stack])this.close(e.id)})}createWindow({id:e,title:t,key:n,hotkeyLabel:r}){let i=document.createElement(`section`);i.className=`window win-${e}`,i.hidden=!0,i.innerHTML=`
      <header class="win-head">
        <h2>${t}${r?` <kbd>${r}</kbd>`:``}</h2>
        <button class="win-close" type="button" aria-label="닫기">✕</button>
      </header>
      <div class="win-body"></div>`,this.layer.appendChild(i);let a={id:e,key:n,el:i,body:i.querySelector(`.win-body`),onOpen:null,onClose:null,canOpen:null,onUpdate:null};return i.addEventListener(`pointerdown`,()=>this.focus(a)),i.querySelector(`.win-close`).addEventListener(`click`,()=>this.close(e)),this.windows.set(e,a),a}isOpen(e){return this.stack.some(t=>t.id===e)}open(e){let t=this.windows.get(e);t&&!this.isOpen(e)&&(!t.canOpen||t.canOpen())&&(t.el.hidden=!1,this.stack.push(t),this.restack(),t.onOpen?.(),this.ctx.bus.emit(`ui:open`,{id:e}))}close(e){let t=this.windows.get(e);t&&this.isOpen(e)&&(t.el.hidden=!0,this.stack=this.stack.filter(e=>e!==t),this.restack(),t.onClose?.(),this.ctx.bus.emit(`ui:close`,{id:e}))}toggle(e){this.isOpen(e)?this.close(e):this.open(e)}focus(e){this.stack.at(-1)!==e&&(this.stack=this.stack.filter(t=>t!==e).concat(e),this.restack())}restack(){this.stack.forEach((e,t)=>{e.el.style.zIndex=String(10+t)})}update(e){let{input:t}=this.ctx;for(let t of this.stack)t.onUpdate?.(e);for(let e of this.windows.values())e.key&&t.wasPressed(e.key)&&this.toggle(e.id);t.wasPressed(`Escape`)&&this.ctx.mode!==`build`&&(this.stack.length?this.close(this.stack.at(-1).id):this.ctx.bus.emit(`pause:open`))}},zd=class{constructor(e){this.el=document.createElement(`div`),this.el.className=`tooltip`,this.el.hidden=!0,e.appendChild(this.el)}show(e,t,n){this.el.innerHTML=e,this.el.hidden=!1,this.move(t,n)}move(e,t){if(this.el.hidden)return;let n=this.el.getBoundingClientRect(),r=e+14,i=t+14;r+n.width>window.innerWidth-8&&(r=e-n.width-14),i+n.height>window.innerHeight-8&&(i=t-n.height-14),this.el.style.transform=`translate(${Math.max(8,r)}px, ${Math.max(8,i)}px)`}hide(){this.el.hidden=!0}},Bd=`stroke="rgba(60,40,20,.45)" stroke-width="1"`,Vd={weapon:e=>`<path d="M19 2l3 3-11 11-3-3z" fill="${e}" ${Bd}/><path d="M5 13l6 6-2 1-5-5z" fill="#c9a44a" ${Bd}/><path d="M6 18l-3 3" stroke="#8a6440" stroke-width="3" stroke-linecap="round"/>`,head:e=>`<path d="M4 16a8 8 0 0 1 16 0z" fill="${e}" ${Bd}/><rect x="2" y="15" width="20" height="4" rx="2" fill="${e}" ${Bd}/>`,body:e=>`<path d="M7 3l5 3 5-3 4 4-2 3v11H5V10L3 7z" fill="${e}" ${Bd}/><path d="M12 6v15" stroke="rgba(60,40,20,.3)"/>`,feet:e=>`<path d="M5 4h7v9l7 3a2 2 0 0 1 2 2v3H5z" fill="${e}" ${Bd}/>`,accessory:e=>`<circle cx="12" cy="14" r="6" fill="none" stroke="${e}" stroke-width="3.5"/><path d="M12 2l4 5h-8z" fill="#bfefff" ${Bd}/>`};function Hd(e){let t=e.category===`equipment`&&Vd[e.equipSlot];return t?`<svg class="item-svg" viewBox="0 0 24 24" aria-hidden="true">${t(e.color)}</svg>`:`<i class="item-icon" style="--c:${e.color}"></i>`}function Ud(e){return`<svg class="item-svg hint" viewBox="0 0 24 24" aria-hidden="true">${Vd[e.startsWith(`accessory`)?`accessory`:e](`#d8ccb0`)}</svg>`}function Wd(e,t,n,r=!0){let i=e.percentStats.includes(t)?`${Math.round(n*1e3)/10}%`:`${Math.round(n*10)/10}`;return`${r&&n>0?`+`:``}${i}`}function Gd(e,t){return Object.entries(t??{}).map(([t,n])=>`<div class="tt-bonus">${e.statLabels[t]??t} ${Wd(e,t,n)}</div>`).join(``)}function Kd(e,t,{count:n,hint:r}={}){let{grades:i,categories:a}=e.items,o=e.items.items[t],s=i[o.grade],c=o.weaponType?` · ${e.items.weaponNames[o.weaponType]}`:o.equipSlot?` · ${e.items.equipSlots[o.equipSlot]??e.items.equipSlots.accessory1}`:``,l=Object.values(e.items.sets??{}).find(e=>e.pieces.includes(t)),u=o.stackable?o.maxStack??e.config.inventory.defaultMaxStack:null;return`
    <div class="tt-name" style="color:${s?.color??`#fff`}">${o.name}</div>
    <div class="tt-meta">${s?`${s.name} · `:``}${a[o.category]??``}${c}</div>
    ${Gd(e.items,o.bonus)}
    ${l?`<div class="tt-meta">${l.name} (3부위: ${Object.entries(l.bonus).map(([t,n])=>`${e.items.statLabels[t]} ${Wd(e.items,t,n)}`).join(`, `)})</div>`:``}
    ${o.description?`<p class="tt-desc">${o.description}</p>`:``}
    ${n!=null&&u?`<div class="tt-meta">수량 ${n} / ${u}</div>`:``}
    ${r?`<div class="tt-hint">${r}</div>`:``}`}var qd=class{constructor(e,t,n){this.ctx=e,this.tooltip=n,this.slots=[],this.drag=null;let r=e.data.config.inventory,i=t.createWindow({id:`inventory`,title:`가방`,key:`KeyI`,hotkeyLabel:`I`});this.win=i,i.body.innerHTML=`
      <div class="inv-grid" style="--cols:${r.columns}"></div>
      <footer class="inv-foot">
        <span class="gold"><i class="coin"></i><b data-inv-gold>0</b></span>
        <span class="inv-hint">${e.input.touchMode?`끌기: 옮기기 · 두 번 탭: 사용`:`드래그: 옮기기 · 우클릭: 사용`}</span>
      </footer>`,this.grid=i.body.querySelector(`.inv-grid`),this.goldEl=i.body.querySelector(`[data-inv-gold]`);for(let e=0;e<r.slots;e++){let t=document.createElement(`div`);t.className=`slot`,t.dataset.slot=String(e),this.grid.appendChild(t)}i.onClose=()=>{this.tooltip.hide(),this.cancelDrag()},this.bindEvents(),e.bus.on(`inventory:changed`,({slots:e})=>this.render(e)),e.bus.on(`gold:changed`,({gold:e})=>{this.goldEl.textContent=e.toLocaleString()})}def(e){return this.ctx.data.items.items[e]}render(e){this.slots=e;let{grades:t}=this.ctx.data.items;e.forEach((e,n)=>{let r=this.grid.children[n];if(!r)return;if(!e){r.className=`slot`,r.innerHTML=``;return}let i=this.def(e.id);r.className=`slot filled`,r.style.setProperty(`--grade`,t[i.grade]?.color??`#e8e8e8`),r.innerHTML=`${Hd(i)}${e.count>1?`<b class="count">${e.count}</b>`:``}`})}tooltipHtml(e){let t=this.def(e.id),n=this.ctx.input.touchMode?`두 번 탭`:`우클릭`,r={equipment:`장착`,consumable:`사용`,kit:`설치`}[t.category],i=r&&`${n}: ${r}`;return Kd(this.ctx.data,e.id,{count:e.count,hint:i})}slotIndexAt(e,t){let n=document.elementFromPoint(e,t)?.closest?.(`[data-slot]`);return n&&this.grid.contains(n)?Number(n.dataset.slot):-1}bindEvents(){let e=this.grid;e.addEventListener(`pointermove`,e=>{if(this.drag)return;let t=this.slotIndexAt(e.clientX,e.clientY),n=this.slots[t];n?this.tooltip.show(this.tooltipHtml(n),e.clientX,e.clientY):this.tooltip.hide()}),e.addEventListener(`pointerleave`,()=>this.tooltip.hide()),e.addEventListener(`contextmenu`,e=>{e.preventDefault();let t=this.slotIndexAt(e.clientX,e.clientY);this.slots[t]&&this.ctx.bus.emit(`inventory:use`,{slot:t})}),e.addEventListener(`pointerdown`,t=>{if(t.button!==0)return;let n=this.slotIndexAt(t.clientX,t.clientY);if(!this.slots[n])return;t.preventDefault();let r=document.createElement(`div`);r.className=`drag-ghost`,r.innerHTML=e.children[n].innerHTML,document.body.appendChild(r),e.children[n].classList.add(`dragging`),this.drag={from:n,ghost:r},this.tooltip.hide(),this.moveGhost(t.clientX,t.clientY)}),window.addEventListener(`pointermove`,t=>{if(!this.drag)return;this.moveGhost(t.clientX,t.clientY);for(let t of e.children)t.classList.remove(`over`);let n=this.slotIndexAt(t.clientX,t.clientY);n>=0&&e.children[n].classList.add(`over`)}),window.addEventListener(`pointerup`,e=>{if(!this.drag)return;let t=this.slotIndexAt(e.clientX,e.clientY),{from:n}=this.drag;this.cancelDrag(),t>=0&&t!==n?this.ctx.bus.emit(`inventory:move`,{from:n,to:t}):t===n&&this.onTap(n,e)})}onTap(e,t){let n=this.slots[e];if(!n)return;let r=performance.now();if(this.lastTap?.slot===e&&r-this.lastTap.time<this.ctx.data.config.touch.doubleTapMs){this.lastTap=null,this.tooltip.hide(),this.ctx.bus.emit(`inventory:use`,{slot:e});return}this.lastTap={slot:e,time:r},t.pointerType===`touch`&&this.tooltip.show(this.tooltipHtml(n),t.clientX,t.clientY)}moveGhost(e,t){this.drag.ghost.style.transform=`translate(${e}px, ${t}px) translate(-50%, -50%)`}cancelDrag(){if(this.drag){this.drag.ghost.remove();for(let e of this.grid.children)e.classList.remove(`dragging`,`over`);this.drag=null}}},Jd=class{constructor(e,t){this.ctx=e,this.gold=0,this.tab=`turret`,this.counts={},this.ui=t;let n=t.createWindow({id:`build`,title:`건설`,key:`KeyB`,hotkeyLabel:`B`});this.win=n,n.el.classList.add(`win-left`),n.canOpen=()=>Ll(e.bases,e.player.position)?!0:(e.bus.emit(`notify`,{text:e.bases.length?`기지 영역 안에서만 건설할 수 있습니다`:`먼저 가방(I)에서 텐트 키트를 우클릭해 기지를 세우세요`,kind:`warn`}),!1),n.onOpen=()=>this.render(),n.body.innerHTML=`
      <nav class="tabs">
        <button type="button" data-tab="building">건물</button>
        <button type="button" data-tab="turret">포탑</button>
      </nav>
      <div class="build-list"></div>
      <footer class="inv-foot">
        <span class="gold"><i class="coin"></i><b data-build-gold>0</b></span>
        <span class="inv-hint" data-build-info></span>
      </footer>`,this.list=n.body.querySelector(`.build-list`),this.goldEl=n.body.querySelector(`[data-build-gold]`),this.infoEl=n.body.querySelector(`[data-build-info]`),n.body.querySelector(`.tabs`).addEventListener(`click`,e=>{let t=e.target.closest(`[data-tab]`)?.dataset.tab;t&&(this.tab=t,this.render())}),this.list.addEventListener(`click`,t=>{let n=t.target.closest(`[data-upgrade-base]`);if(n&&!n.disabled){e.bus.emit(`base:upgrade`,{baseId:Number(n.dataset.upgradeBase)}),this.render();return}let r=t.target.closest(`[data-facility]`);if(r&&!r.classList.contains(`disabled`)){e.bus.emit(`build:start`,{kind:`facility`,type:r.dataset.facility});return}let i=t.target.closest(`[data-turret]`);i&&!i.classList.contains(`disabled`)&&e.bus.emit(`build:start`,{kind:`turret`,type:i.dataset.turret})}),e.bus.on(`inventory:changed`,({slots:e})=>{this.counts={};for(let t of e)t&&(this.counts[t.id]=(this.counts[t.id]??0)+t.count);t.isOpen(`build`)&&this.render()}),e.bus.on(`facility:changed`,()=>{t.isOpen(`build`)&&this.render()}),e.bus.on(`interact:base`,()=>{this.tab=`building`,t.isOpen(`build`)?this.render():t.open(`build`)}),e.bus.on(`gold:changed`,({gold:e})=>{this.gold=e,this.goldEl.textContent=e.toLocaleString(),t.isOpen(`build`)&&this.render()})}render(){let{ctx:e}=this;for(let e of this.win.body.querySelectorAll(`[data-tab]`))e.classList.toggle(`on`,e.dataset.tab===this.tab);let t=Ll(e.bases,e.player.position);if(!t)return;let n=e.player.stats,r=e.structures.filter(e=>e.kind===`turret`&&e.baseId===t.id).length,i=Pu(t,n);if(this.infoEl.textContent=`${t.label} (${t.name} Lv${t.level}) · 포탑 ${r}/${i}`,this.tab===`building`){this.list.innerHTML=this.baseUpgradeCard(t)+this.facilityCards(t);return}let a=Object.entries(e.data.turrets).map(([a,o])=>{let s=t.level<o.unlockBaseLevel,c=e.data.buildings.baseLevels[String(o.unlockBaseLevel)].name,l=Nu(o,n),u=r>=i,d=this.gold<l,f=s?`${c}(Lv${o.unlockBaseLevel}) 필요`:u?`설치 수 가득`:d?`골드 부족`:`클릭해서 배치`;return`
        <button type="button" class="build-card${s||u||d?` disabled`:``}" data-turret="${a}">
          <i class="build-icon" style="--c:${o.color}"></i>
          <span class="build-text">
            <b>${o.name}</b>
            <small>${o.description}</small>
            <small class="stats">공격 ${+Fu(o,n).toFixed(1)} · 사거리 ${+Iu(o,n).toFixed(1)} · 초당 ${o.fireRate}발 · 체력 ${o.hp}</small>
          </span>
          <span class="build-cost"><i class="coin"></i>${l}<small>${f}</small></span>
        </button>`});this.list.innerHTML=a.join(``)}facilityCards(e){let{buildings:t,items:n}=this.ctx.data;return Object.entries(t.buildings).map(([r,i])=>{let a=this.ctx.structures.some(t=>t.kind===`facility`&&t.type===r&&t.baseId===e.id),o=e.level<i.unlockBaseLevel,s=i.cost.every(e=>(this.counts[e.id]??0)>=e.count),c=i.cost.map(e=>`${n.items[e.id].name} ${this.counts[e.id]??0}/${e.count}`).join(` · `),l=a?`이미 있음`:o?`${t.baseLevels[String(i.unlockBaseLevel)].name} 필요`:s?`클릭해서 배치`:`재료 부족`;return`
        <button type="button" class="build-card${a||o||!s?` disabled`:``}" data-facility="${r}">
          <i class="build-icon" style="--c:${i.color}"></i>
          <span class="build-text"><b>${i.name}</b><small>${i.description}</small><small class="stats">${c}</small></span>
          <span class="build-cost"><small>${l}</small></span>
        </button>`}).join(``)}baseUpgradeCard(e){let{buildings:t,items:n,turrets:r}=this.ctx.data,i=t.baseLevels[String(e.level+1)];if(!i)return`<p class="empty">${e.label}은(는) 이미 최고 단계(${e.name})예요.</p>`;let a=t.baseLevels[String(e.level)],o=i.cost.every(e=>(this.counts[e.id]??0)>=e.count),s=Object.values(r).filter(t=>t.unlockBaseLevel===e.level+1).map(e=>e.name),c=i.cost.map(e=>{let t=this.counts[e.id]??0;return`<li class="${t>=e.count?`ok`:`bad`}"><i class="item-icon" style="--c:${n.items[e.id].color}"></i>${n.items[e.id].name} <b>${t}/${e.count}</b></li>`}).join(``);return`
      <div class="base-up">
        <div class="base-up-title"><b>${a.name}</b> → <b>${i.name}</b> <small>기지 Lv${e.level+1}</small></div>
        <ul class="base-up-eff">
          <li>기지 영역 ${a.areaRadius}m → ${i.areaRadius}m</li>
          <li>포탑 설치 수 ${a.maxTurrets} → ${i.maxTurrets}</li>
          <li>건물 체력 ${a.hp} → ${i.hp}</li>
          ${s.length?`<li>새 포탑: ${s.join(`, `)}</li>`:``}
        </ul>
        <ul class="base-up-cost">${c}</ul>
        <button type="button" class="base-up-btn" data-upgrade-base="${e.id}" ${o?``:`disabled`}>${o?`${i.name}(으)로 올리기`:`재료가 부족해요`}</button>
      </div>`}},Yd=[`maxHp`,`maxStamina`,`attack`,`defense`,`moveSpeed`,`critChance`,`hpRegen`],Xd=class{constructor(e,t,n){this.ctx=e,this.tooltip=n,this.equip={},this.info=null;let r=t.createWindow({id:`character`,title:`캐릭터`,key:`KeyC`,hotkeyLabel:`C`});r.el.classList.add(`win-left`),r.onClose=()=>n.hide();let i=e.data.items.equipSlots;r.body.innerHTML=`
      <div class="char">
        <div class="equip-grid">
          ${Object.keys(i).map(e=>`<div class="eslot" data-eslot="${e}"><span>${i[e]}</span><div class="eicon"></div></div>`).join(``)}
        </div>
        <div class="char-stats">
          <div class="char-level"><span class="lv-badge">Lv <b data-c-lv>1</b></span><span data-c-sp></span></div>
          <div class="bar xp"><div class="fill" data-c-xp></div></div>
          <div class="char-xp" data-c-xptext></div>
          <dl data-c-list></dl>
          <div class="sets" data-c-sets></div>
        </div>
      </div>
      <footer class="inv-foot"><span class="inv-hint">장비 칸 우클릭: 해제 · 가방에서 우클릭: 장착</span></footer>`;let a=e=>r.body.querySelector(e);this.setsEl=a(`[data-c-sets]`),this.el={lv:a(`[data-c-lv]`),sp:a(`[data-c-sp]`),xp:a(`[data-c-xp]`),xpText:a(`[data-c-xptext]`),list:a(`[data-c-list]`)},this.grid=a(`.equip-grid`),this.win=r,this.grid.addEventListener(`contextmenu`,t=>{t.preventDefault();let n=t.target.closest(`[data-eslot]`)?.dataset.eslot;n&&this.equip[n]&&e.bus.emit(`equipment:unequip`,{slot:n})}),this.grid.addEventListener(`pointerup`,t=>{if(t.pointerType!==`touch`)return;let r=t.target.closest(`[data-eslot]`)?.dataset.eslot,i=r&&this.equip[r];if(!i)return;let a=performance.now();if(this.lastTap?.slot===r&&a-this.lastTap.time<e.data.config.touch.doubleTapMs){this.lastTap=null,n.hide(),e.bus.emit(`equipment:unequip`,{slot:r});return}this.lastTap={slot:r,time:a},n.show(Kd(e.data,i,{hint:`두 번 탭: 해제`}),t.clientX,t.clientY)}),this.grid.addEventListener(`pointermove`,t=>{let r=t.target.closest(`[data-eslot]`)?.dataset.eslot,i=r&&this.equip[r];i?n.show(Kd(e.data,i,{hint:`우클릭: 해제`}),t.clientX,t.clientY):n.hide()}),this.grid.addEventListener(`pointerleave`,()=>n.hide()),e.bus.on(`equipment:changed`,({slots:t,sets:n})=>{this.equip={...t},this.renderEquip();let r=e.data.items;this.setsEl.innerHTML=(n??[]).filter(e=>e.have>0).map(e=>`
        <div class="set${e.have===e.total?` done`:``}"><b>${e.name} ${e.have}/${e.total}</b>
        <small>${Object.entries(e.bonus).map(([e,t])=>`${r.statLabels[e]} ${Wd(r,e,t)}`).join(`, `)}</small></div>`).join(``)}),e.bus.on(`stats:changed`,e=>{this.info=e,this.renderStats()})}renderEquip(){let e=this.ctx.data.items;for(let t of this.grid.children){let n=t.dataset.eslot,r=this.equip[n],i=r&&e.items[r];t.classList.toggle(`filled`,!!i),t.style.setProperty(`--grade`,i?e.grades[i.grade]?.color:`transparent`),t.querySelector(`.eicon`).innerHTML=i?Hd(i):Ud(n)}this.tooltip.hide()}renderStats(){let{level:e,xp:t,xpToNext:n,skillPoints:r,stats:i}=this.info,a=this.ctx.data.items;this.el.lv.textContent=e,this.el.sp.textContent=r?`스킬 포인트 ${r} (K)`:``;let o=Number.isFinite(n);this.el.xp.style.width=o?`${t/n*100}%`:`100%`,this.el.xpText.textContent=o?`경험치 ${t} / ${n}`:`최고 레벨`,this.el.list.innerHTML=Yd.map(e=>`<dt>${a.statLabels[e]}</dt><dd>${Wd(a,e,i[e],!1)}</dd>`).join(``)}},Zd=class{constructor(e,t){this.ctx=e,this.ranks={},this.blocked={},this.points=0,this.pending=null;let n=t.createWindow({id:`skills`,title:`스킬`,key:`KeyK`,hotkeyLabel:`K`});n.onOpen=()=>this.render(),n.onClose=()=>{this.pending=null},n.body.innerHTML=`
      <div class="sk-points">남은 스킬 포인트 <b data-sk-points>0</b></div>
      <div class="sk-tree"></div>
      <div class="sk-confirm" hidden></div>`,this.tree=n.body.querySelector(`.sk-tree`),this.pointsEl=n.body.querySelector(`[data-sk-points]`),this.confirmEl=n.body.querySelector(`.sk-confirm`),this.ui=t,this.tree.addEventListener(`click`,e=>{let t=e.target.closest(`[data-skill]`)?.dataset.skill;t&&(this.blocked[t]||this.points<=0||(this.pending=t,this.render()))}),this.confirmEl.addEventListener(`click`,t=>{let n=t.target.closest(`[data-act]`)?.dataset.act;n===`learn`&&e.bus.emit(`skill:learn`,{id:this.pending}),n&&(this.pending=null,this.render())}),e.bus.on(`skills:changed`,({ranks:e,blocked:t})=>{this.ranks={...e},this.blocked=t,this.refresh()}),e.bus.on(`stats:changed`,({skillPoints:e})=>{this.points=e,this.refresh()})}refresh(){this.ui.isOpen(`skills`)&&this.render()}effectText(e,t=1){let n=this.ctx.data.items;return Object.entries(e.effects).map(([e,r])=>`${n.statLabels[e]??e} ${Wd(n,e,r*t)}`).join(`, `)}render(){let{branches:e,skills:t}=this.ctx.data.skills;this.pointsEl.textContent=this.points,this.tree.innerHTML=Object.entries(e).map(([e,n])=>{let r=Object.entries(t).filter(([,t])=>t.branch===e).sort((e,t)=>e[1].tier-t[1].tier);return`
        <section class="sk-branch" style="--bc:${n.color}">
          <h3>${n.name}</h3>
          ${r.map(([e,n])=>{let r=this.ranks[e]??0,i=this.blocked[e],a=r>=n.maxRank?`max`:i?`locked`:this.points>0?`ready`:``,o=n.requires.map(e=>`${t[e.id].name} ${e.rank}`).join(`, `);return`
              <button type="button" class="sk-node ${a}${this.pending===e?` picked`:``}" data-skill="${e}">
                <span class="sk-head"><b>${n.name}</b><span class="sk-rank">${r}/${n.maxRank}</span></span>
                <small>${n.description}</small>
                <small class="sk-eff">랭크당 ${this.effectText(n)}</small>
                ${o?`<small class="sk-req${i&&i!==`최대 랭크`?` bad`:``}">선행: ${o}</small>`:``}
              </button>`}).join(``)}
        </section>`}).join(``);let n=this.pending;if(this.confirmEl.hidden=!n,!n)return;let r=t[n],i=(this.ranks[n]??0)+1;this.confirmEl.innerHTML=`
      <p><b>${r.name}</b>을(를) <b>${i}랭크</b>로 올릴까요?<br><small>누적 효과: ${this.effectText(r,i)} · 포인트 1 사용</small></p>
      <div class="sk-actions"><button type="button" data-act="cancel">취소</button><button type="button" class="primary" data-act="learn">배우기</button></div>`}},Qd=480,$d=1.1,ef=`#46423a`,tf=class{constructor(e,t){this.ctx=e,this.ui=t,this.explored=null,this.lairs=[],this.timer=0;let n=e.data.config.world.bounds;this.bounds=n,$d=Math.min(1.1,Qd/(n.maxZ-n.minZ)),this.w=Math.round((n.maxX-n.minX)*$d),this.h=Math.round((n.maxZ-n.minZ)*$d);let r=t.createWindow({id:`map`,title:`지도`,key:`KeyM`,hotkeyLabel:`M`});r.el.classList.add(`win-center`),r.body.innerHTML=`
      <div class="map">
        <canvas class="map-canvas" width="${this.w*2}" height="${this.h*2}" style="width:${this.w}px;height:${this.h}px"></canvas>
        <div class="map-side">
          <h3>기지</h3>
          <ul class="map-bases"></ul>
          <p class="map-hint" data-map-hint></p>
        </div>
      </div>`,this.canvas=r.body.querySelector(`canvas`),this.g=this.canvas.getContext(`2d`),this.g.scale(2,2),this.list=r.body.querySelector(`.map-bases`),this.hint=r.body.querySelector(`[data-map-hint]`),r.onOpen=()=>this.render(),r.onUpdate=e=>{this.timer-=e,!(this.timer>0)&&(this.timer=.3,this.draw())},this.list.addEventListener(`click`,t=>{let n=t.target.closest(`[data-travel]`)?.dataset.travel;n&&(e.bus.emit(`base:travel`,{baseId:Number(n)}),this.render())}),e.bus.on(`map:explored`,e=>{this.explored=e,t.isOpen(`map`)&&this.draw()}),e.bus.on(`base:created`,()=>{t.isOpen(`map`)&&this.render()}),e.bus.on(`boss:status`,({list:e})=>{this.lairs=e})}toMap(e,t){return[(e-this.bounds.minX)*$d,(t-this.bounds.minZ)*$d]}draw(){let{g:e,bounds:t}=this,{world:n,bases:r,player:i}=this.ctx;e.fillStyle=ef,e.fillRect(0,0,this.w,this.h);let a=this.explored,o=new Set;if(a){let r=this.ctx.data.config.map.cellSize,i=r*$d;for(let s=0;s<a.rows;s++)for(let c=0;c<a.cols;c++){if(!a.cells[s*a.cols+c])continue;let l=t.minX+(c+.5)*r,u=t.minZ+(s+.5)*r,d=n.regionAt(l,u);o.add(d),e.fillStyle=d.mapColor,e.fillRect(c*i,s*i,i+.6,i+.6)}}e.font=`700 12px system-ui, sans-serif`,e.textAlign=`center`;for(let r of n.regions.list){if(!o.has(r))continue;let n=(Math.max(r.zFrom,t.minZ)+Math.min(r.zTo,t.maxZ))/2,[i,a]=this.toMap((t.minX+t.maxX)/2,n);e.fillStyle=`rgba(255,255,255,0.75)`,e.fillText(r.name,i,a)}let s=this.ctx.data.config.map.cellSize;for(let n of this.lairs){let r=Math.floor((n.lair[0]-t.minX)/s),i=Math.floor((n.lair[1]-t.minZ)/s);if(!a||!a.cells[i*a.cols+r])continue;let[o,c]=this.toMap(n.lair[0],n.lair[1]);e.fillStyle=n.defeated?`#9a958c`:`#d9403a`,e.beginPath(),e.arc(o,c,6,0,Math.PI*2),e.fill(),e.fillStyle=`#fff`,e.font=`800 9px system-ui, sans-serif`,e.fillText(`보스`,o,c+3),e.font=`700 10px system-ui, sans-serif`,e.fillText(n.name,o,c-10)}for(let t of r){let[n,r]=this.toMap(t.position.x,t.position.z);e.strokeStyle=`rgba(255,255,255,0.6)`,e.beginPath(),e.arc(n,r,t.areaRadius*$d,0,Math.PI*2),e.stroke(),e.fillStyle=`#e9835b`,e.beginPath(),e.moveTo(n,r-7),e.lineTo(n+6,r+5),e.lineTo(n-6,r+5),e.closePath(),e.fill(),e.fillStyle=`#fff`,e.font=`700 10px system-ui, sans-serif`,e.fillText(`#${t.id}`,n,r+16)}let[c,l]=this.toMap(i.position.x,i.position.z);e.strokeStyle=`#fff`,e.lineWidth=2,e.beginPath(),e.moveTo(c,l),e.lineTo(c+i.facing.x*9,l+i.facing.z*9),e.stroke(),e.fillStyle=`#ff5f5f`,e.beginPath(),e.arc(c,l,4.5,0,Math.PI*2),e.fill(),e.stroke(),e.lineWidth=1}render(){let{bases:e,player:t,structures:n}=this.ctx,r=Ll(e,t.position);this.list.innerHTML=e.length?e.map(e=>{let t=n.filter(t=>t.kind===`turret`&&t.baseId===e.id).length,i=r&&r!==e;return`
          <li class="${r===e?`here`:``}">
            <span><b>${e.label}</b><small>${e.name} Lv${e.level} · 포탑 ${t}${r===e?` · 지금 여기`:``}</small></span>
            <button type="button" data-travel="${e.id}" ${i?``:`disabled`}>이동</button>
          </li>`}).join(``):`<li class="empty">아직 기지가 없어요</li>`,this.hint.textContent=r?`다른 기지를 골라 바로 이동할 수 있어요`:`빠른 이동은 기지 영역 안에서만 할 수 있어요`,this.draw()}},nf=class{constructor(e,t){this.ctx=e,this.ui=t,this.turret=null,this.gold=0,this.confirmDemolish=!1;let n=t.createWindow({id:`turret`,title:`포탑 관리`});n.el.classList.add(`win-left`),this.win=n,n.onClose=()=>{this.turret=null},n.onUpdate=()=>{let n=this.turret;n&&e.player.position.distanceTo(n.position)>e.data.config.interact.range+n.radius+3&&t.close(`turret`)},n.body.addEventListener(`click`,n=>{let r=n.target.closest(`[data-act]`)?.dataset.act,i=this.turret;if(r&&i){if(r===`demolish`&&!this.confirmDemolish){this.confirmDemolish=!0,this.render();return}e.bus.emit(`turret:${r}`,{turret:i}),r===`demolish`&&t.close(`turret`)}}),e.bus.on(`interact:turret`,({turret:e})=>{this.turret=e,this.confirmDemolish=!1,t.open(`turret`),this.render()}),e.bus.on(`turret:changed`,()=>{this.turret&&this.render()}),e.bus.on(`gold:changed`,({gold:e})=>{this.gold=e,this.turret&&this.render()})}render(){let e=this.turret,t=this.ctx.player.stats,n=e.def,r=e.level<n.maxLevel?Ru(n,e.level):null,i=zu(e),a=Bu(e,t,this.ctx.data.config.turret.demolishRefund),o=(e,t,n)=>`<dt>${e}</dt><dd>${t}${n==null?``:` <i>→ ${n}</i>`}</dd>`,s=e=>+Fu(n,t,e).toFixed(1),c=e=>+Iu(n,t,e).toFixed(1),l=e=>Math.round(n.hp*(1+n.hpPerLevel*(e-1))),u=r==null?null:e.level+1;this.win.body.innerHTML=`
      <div class="tw">
        <div class="tw-head"><b>${n.name}</b><span class="lv-badge">Lv ${e.level}/${n.maxLevel}</span></div>
        <div class="bar hp"><div class="fill" style="width:${e.stats.hp/e.stats.maxHp*100}%"></div><span>${Math.ceil(e.stats.hp)} / ${e.stats.maxHp}${e.alive?``:` · 부서짐`}</span></div>
        <dl class="tw-stats">
          ${o(`데미지`,s(e.level),u&&s(u))}
          ${o(`사거리`,c(e.level),u&&c(u))}
          ${o(`체력`,e.stats.maxHp,u&&l(u))}
          ${o(`초당 발사`,n.fireRate,null)}
          ${n.splashRadius?o(`폭발 범위`,n.splashRadius,null):``}
        </dl>
        <div class="tw-actions">
          <button type="button" data-act="upgrade" ${r==null||!e.alive||this.gold<r?`disabled`:``}>
            ${r==null?`최고 레벨`:`업그레이드 <small><i class="coin"></i>${r}</small>`}</button>
          <button type="button" data-act="repair" ${i<=0||this.gold<i?`disabled`:``}>
            ${i<=0?`멀쩡함`:`수리 <small><i class="coin"></i>${i}</small>`}</button>
          <button type="button" data-act="priority">노리는 적: <b>${e.priority===`nearest`?`가장 가까운 적`:`체력 낮은 적`}</b></button>
          <button type="button" class="danger" data-act="demolish">${this.confirmDemolish?`정말 철거? (골드 +${a})`:`철거`}</button>
        </div>
        ${e.alive?``:`<p class="tw-note">부서진 포탑은 수리해야 다시 쏩니다.</p>`}
      </div>`}},rf=class{constructor(e,t,n){this.ctx=e,this.ui=t,this.counts={},this.facility=null;let r=t.createWindow({id:`craft`,title:`작업대 — 제작`});r.el.classList.add(`win-center`),r.onClose=()=>{this.facility=null,n.hide()},r.onUpdate=()=>af(e,t,`craft`,this.facility),r.body.innerHTML=`<div class="craft-list"></div>`,this.list=r.body.querySelector(`.craft-list`),this.list.addEventListener(`click`,t=>{let n=t.target.closest(`[data-craft]`)?.dataset.craft;n&&e.bus.emit(`craft:make`,{recipe:n,baseLevel:this.baseLevel()})}),this.list.addEventListener(`pointermove`,t=>{let r=t.target.closest(`[data-result]`)?.dataset.result;r?n.show(Kd(e.data,r),t.clientX,t.clientY):n.hide()}),this.list.addEventListener(`pointerleave`,()=>n.hide()),e.bus.on(`interact:facility`,({facility:e})=>{e.type===`workbench`&&(this.facility=e,t.open(`craft`),this.render())}),e.bus.on(`inventory:changed`,({slots:e})=>{this.counts={};for(let t of e)t&&(this.counts[t.id]=(this.counts[t.id]??0)+t.count);this.facility&&this.render()})}baseLevel(){return this.ctx.bases.find(e=>e.id===this.facility?.baseId)?.level??0}render(){let{items:e,recipes:t,buildings:n}=this.ctx.data,r=this.baseLevel();this.list.innerHTML=Object.entries(t).map(([t,i])=>{let a=e.items[i.result],o=r<i.baseLevel,s=i.ingredients.every(e=>(this.counts[e.id]??0)>=e.count),c=i.ingredients.map(t=>{let n=this.counts[t.id]??0;return`<span class="${n>=t.count?`ok`:`bad`}">${e.items[t.id].name} ${n}/${t.count}</span>`}).join(``),l=o?`${n.baseLevels[String(i.baseLevel)].name} 필요`:s?`만들기`:`재료 부족`;return`
        <div class="craft-row${o?` locked`:``}">
          <span class="craft-icon" data-result="${i.result}" style="--grade:${e.grades[a.grade]?.color}">${Hd(a)}</span>
          <span class="craft-text"><b>${a.name}${i.count>1?` ×${i.count}`:``}</b><small class="craft-ing">${c}</small></span>
          <button type="button" data-craft="${t}" ${o||!s?`disabled`:``}>${l}</button>
        </div>`}).join(``)}};function af(e,t,n,r){r&&e.player.position.distanceTo(r.position)>e.data.config.interact.range+r.radius+3&&t.close(n)}var of=class{constructor(e,t,n){this.ctx=e,this.facility=null,this.bag=[],this.store=[];let r=t.createWindow({id:`storage`,title:`창고`});r.el.classList.add(`win-center`),r.onClose=()=>{this.facility=null,n.hide()},r.onUpdate=()=>af(e,t,`storage`,this.facility),r.body.innerHTML=`
      <div class="st-cols">
        <section><h3>가방</h3><div class="inv-grid st-grid" data-side="bag" style="--cols:6"></div></section>
        <section><h3 data-st-title>창고</h3><div class="inv-grid st-grid" data-side="store" style="--cols:6"></div></section>
      </div>
      <p class="inv-hint">클릭: 한 칸 통째로 옮기기 · 습격에 지면 창고 재료를 일부 잃어요</p>`,this.win=r,this.grids={bag:r.body.querySelector(`[data-side="bag"]`),store:r.body.querySelector(`[data-side="store"]`)},this.title=r.body.querySelector(`[data-st-title]`);for(let[t,r]of Object.entries(this.grids))r.addEventListener(`click`,r=>{let i=Number(r.target.closest(`[data-slot]`)?.dataset.slot);!Number.isNaN(i)&&this.facility&&(t===`bag`?this.bag:this.store)[i]&&(n.hide(),e.bus.emit(t===`bag`?`storage:deposit`:`storage:withdraw`,{baseId:this.facility.baseId,slot:i}))}),r.addEventListener(`pointermove`,r=>{let i=Number(r.target.closest(`[data-slot]`)?.dataset.slot),a=(t===`bag`?this.bag:this.store)[i];a?n.show(Kd(e.data,a.id,{count:a.count,hint:t===`bag`?`클릭: 창고에 넣기`:`클릭: 가방으로`}),r.clientX,r.clientY):n.hide()}),r.addEventListener(`pointerleave`,()=>n.hide());e.bus.on(`interact:facility`,({facility:n})=>{if(n.type!==`storage`)return;this.facility=n;let r=e.bases.find(e=>e.id===n.baseId);this.title.textContent=`${r.label} 창고`,t.open(`storage`),e.bus.emit(`storage:request`,{baseId:n.baseId}),this.draw(`bag`,this.bag)}),e.bus.on(`inventory:changed`,({slots:e})=>{this.bag=e,this.facility&&this.draw(`bag`,e)}),e.bus.on(`storage:changed`,({baseId:e,slots:t})=>{this.facility?.baseId===e&&(this.store=t,this.draw(`store`,t))})}draw(e,t){let{items:n}=this.ctx.data;this.grids[e].innerHTML=t.map((e,t)=>{if(!e)return`<div class="slot" data-slot="${t}"></div>`;let r=n.items[e.id];return`<div class="slot filled" data-slot="${t}" style="--grade:${n.grades[r.grade]?.color??`#e8e8e8`}">${Hd(r)}${e.count>1?`<b class="count">${e.count}</b>`:``}</div>`}).join(``)}},sf=class{constructor(e,t,n){this.ctx=e,this.facility=null,this.tab=`buy`,this.gold=0,this.bag=[];let r=t.createWindow({id:`shop`,title:`상점`});r.el.classList.add(`win-center`),r.onClose=()=>{this.facility=null,n.hide()},r.onUpdate=()=>af(e,t,`shop`,this.facility),r.body.innerHTML=`
      <nav class="tabs"><button type="button" data-tab="buy">구매</button><button type="button" data-tab="sell">판매</button></nav>
      <div class="shop-list"></div>
      <footer class="inv-foot"><span class="gold"><i class="coin"></i><b data-shop-gold>0</b></span><span class="inv-hint">재료는 제작·건설에도 쓰여요</span></footer>`,this.list=r.body.querySelector(`.shop-list`),this.goldEl=r.body.querySelector(`[data-shop-gold]`),this.win=r,r.body.querySelector(`.tabs`).addEventListener(`click`,e=>{let t=e.target.closest(`[data-tab]`)?.dataset.tab;t&&(this.tab=t,this.render())}),this.list.addEventListener(`click`,t=>{let n=t.target.closest(`button`);n&&!n.disabled&&(n.dataset.buy&&e.bus.emit(`shop:buy`,{id:n.dataset.buy}),n.dataset.sell&&e.bus.emit(`shop:sell`,{slot:Number(n.dataset.sell),count:Number(n.dataset.count)}))}),this.list.addEventListener(`pointermove`,t=>{let r=t.target.closest(`[data-item]`)?.dataset.item;r?n.show(Kd(e.data,r),t.clientX,t.clientY):n.hide()}),this.list.addEventListener(`pointerleave`,()=>n.hide()),e.bus.on(`interact:facility`,({facility:e})=>{e.type===`shop`&&(this.facility=e,t.open(`shop`),this.render())}),e.bus.on(`gold:changed`,({gold:e})=>{this.gold=e,this.goldEl.textContent=e.toLocaleString(),this.facility&&this.render()}),e.bus.on(`inventory:changed`,({slots:e})=>{this.bag=e,this.facility&&this.render()})}row(e,t,n){let{grades:r}=this.ctx.data.items;return`
      <div class="shop-row">
        <span class="craft-icon" data-item="${t}" style="--grade:${r[e.grade]?.color}">${Hd(e)}</span>
        <span class="craft-text"><b>${e.name}</b><small>${e.description??``}</small></span>
        ${n}
      </div>`}render(){let{items:e,shop:t}=this.ctx.data;for(let e of this.win.body.querySelectorAll(`[data-tab]`))e.classList.toggle(`on`,e.dataset.tab===this.tab);if(this.tab===`buy`){this.list.innerHTML=t.buy.map(t=>this.row(e.items[t.id],t.id,`
        <button type="button" data-buy="${t.id}" ${this.gold<t.price?`disabled`:``}><i class="coin"></i>${t.price}</button>`)).join(``);return}let n=this.bag.map((t,n)=>{if(!t)return``;let r=e.items[t.id];return r.value?this.row(r,t.id,`
        <span class="shop-sell">
          <small>${t.count}개 · 개당 ${r.value}</small>
          <button type="button" data-sell="${n}" data-count="1">1개</button>
          ${t.count>1?`<button type="button" data-sell="${n}" data-count="${t.count}">모두 (+${r.value*t.count})</button>`:``}
        </span>`):``}).join(``);this.list.innerHTML=n||`<p class="empty">팔 수 있는 물건이 없어요</p>`}},cf=[[`KeyI`,`가방`],[`KeyC`,`캐릭터`],[`KeyK`,`스킬`],[`KeyB`,`건설`],[`KeyM`,`지도`]],lf=class{constructor(e,t){this.ctx=e,this.cfg=e.data.config.touch;let n=e.input;if(this.enabled=n.touchMode,!this.enabled)return;document.body.classList.add(`touch`);let r=e=>e.preventDefault();document.addEventListener(`gesturestart`,r,{passive:!1}),document.addEventListener(`dblclick`,r,{passive:!1}),document.addEventListener(`touchmove`,e=>{e.touches.length>1&&e.preventDefault()},{passive:!1});let i=document.createElement(`div`);i.className=`touch-ui`,i.innerHTML=`
      <div class="joy" data-joy><div class="joy-knob" data-knob></div></div>
      <button type="button" class="t-btn t-attack" data-attack>공격</button>
      <button type="button" class="t-btn t-use" data-use hidden>E</button>
      <button type="button" class="t-btn t-roll" data-key="Space">구르기</button>
      <nav class="t-menu">${cf.map(([e,t])=>`<button type="button" data-key="${e}">${t}</button>`).join(``)}</nav>
      <div class="t-build" data-build hidden>
        <button type="button" class="ok" data-key="BuildConfirm">설치</button>
        <button type="button" data-key="BuildCancel">취소</button>
      </div>`,t.appendChild(i);let a=e=>i.querySelector(e);this.el={joy:a(`[data-joy]`),knob:a(`[data-knob]`),attack:a(`[data-attack]`),use:a(`[data-use]`),build:a(`[data-build]`),menu:a(`.t-menu`),roll:a(`.t-roll`)},this.bindJoystick();let o=this.el.attack;o.addEventListener(`pointerdown`,e=>{e.preventDefault(),o.setPointerCapture(e.pointerId),n.virtualAttack=!0});let s=()=>{n.virtualAttack=!1};o.addEventListener(`pointerup`,s),o.addEventListener(`pointercancel`,s),o.addEventListener(`lostpointercapture`,s),this.el.use.addEventListener(`pointerdown`,e=>{e.preventDefault(),n.press(`KeyE`)}),i.addEventListener(`pointerdown`,e=>{let t=e.target.closest(`[data-key]`)?.dataset.key;t&&(e.preventDefault(),n.press(t))}),e.bus.on(`interact:hint`,({text:e})=>{this.el.use.hidden=!e})}bindJoystick(){let{joy:e,knob:t}=this.el,n=this.ctx.input,r=this.cfg.joystickRadius,i=null,a=0,o=0,s=e=>{let i=e.clientX-a,s=e.clientY-o,c=Math.hypot(i,s);c>r&&(i=i/c*r,s=s/c*r),t.style.transform=`translate(${i}px, ${s}px)`,n.virtualMove.x=i/r,n.virtualMove.z=s/r},c=e=>{e.pointerId===i&&(i=null,t.style.transform=``,n.virtualMove.x=0,n.virtualMove.z=0)};e.addEventListener(`pointerdown`,t=>{t.preventDefault(),i=t.pointerId,e.setPointerCapture(i);let n=e.getBoundingClientRect();a=n.left+n.width/2,o=n.top+n.height/2,s(t)}),e.addEventListener(`pointermove`,e=>{e.pointerId===i&&s(e)}),e.addEventListener(`pointerup`,c),e.addEventListener(`pointercancel`,c)}update(){if(!this.enabled)return;let e=this.ctx.mode===`build`;this.el.build.hidden=!e,this.el.attack.hidden=e,this.el.roll.hidden=e,e&&(this.el.use.hidden=!0)}},uf=[[`초`,`g`],[`원`,`g`],[` `,``],[`기`,`o`],[`지`,`o`]];function df(){let e=(e,t)=>`<tr><th>${e}</th><td>${t}</td></tr>`;return`
    <div class="help-cols">
      <section>
        <h3>PC</h3>
        <table>
          ${e(`이동`,`W A S D · Shift 달리기`)}
          ${e(`구르기`,`Space (잠깐 무적)`)}
          ${e(`공격`,`마우스 왼쪽 클릭 (마우스 쪽으로)`)}
          ${e(`상호작용`,`E (포탑·건물 앞에서)`)}
          ${e(`창`,`I 가방 · C 캐릭터 · K 스킬 · B 건설 · M 지도`)}
          ${e(`물약`,`숫자 1~5`)}
          ${e(`아이템`,`우클릭: 사용·장착 · 끌어서 옮기기`)}
          ${e(`메뉴`,`ESC`)}
        </table>
      </section>
      <section>
        <h3>휴대폰</h3>
        <table>
          ${e(`이동`,`왼쪽 조이스틱 (끝까지 밀면 달리기)`)}
          ${e(`구르기`,`초록 구르기 버튼 (잠깐 무적)`)}
          ${e(`공격`,`빨간 공격 버튼 (가까운 적 자동 조준)`)}
          ${e(`상호작용`,`나타나는 E 버튼`)}
          ${e(`창`,`오른쪽 메뉴 버튼`)}
          ${e(`물약`,`아래 퀵슬롯 탭`)}
          ${e(`아이템`,`두 번 탭: 사용·장착`)}
          ${e(`건설`,`화면 탭으로 자리 → "설치"`)}
        </table>
      </section>
    </div>`}function ff(e){if(!e)return``;let t=Math.floor((Date.now()-e)/6e4);return t<1?`방금 전`:t<60?`${t}분 전`:t<1440?`${Math.floor(t/60)}시간 전`:`${Math.floor(t/1440)}일 전`}var pf=class{constructor(e,t){this.ctx=e,this.game=t,this.touch=e.input.touchMode,document.body.classList.add(`on-title`);let n=document.createElement(`div`);n.className=`title-screen`,n.innerHTML=`
      <div class="title-sky" aria-hidden="true">
        ${[1,2,3,4].map(e=>`<i class="cloud c${e}"></i>`).join(``)}
        ${[1,2,3,4,5,6,7].map(e=>`<i class="leaf l${e}"></i>`).join(``)}
      </div>
      <div class="title-center">
        <div class="logo-wrap">
          <i class="sprout" aria-hidden="true"><b></b><b></b></i>
          <h1 class="logo">${uf.map(([e,t],n)=>`<span class="${t}" style="--i:${n}">${e===` `?`&nbsp;`:e}</span>`).join(``)}</h1>
          <span class="logo-badge">RPG</span>
        </div>
        <p class="logo-sub">작은 텐트 하나로 시작하는 초원 모험</p>
        <div class="title-menu" data-menu></div>
      </div>
      <footer class="title-foot">저장은 이 브라우저에 자동으로 돼요 · v0.7</footer>
      <div class="t-dialog" data-dialog hidden><div class="t-card" data-card></div></div>`,document.body.appendChild(n),this.el=n,this.menu=n.querySelector(`[data-menu]`),this.dialog=n.querySelector(`[data-dialog]`),this.card=n.querySelector(`[data-card]`),this.renderMenu(),n.addEventListener(`click`,e=>{let t=e.target.closest(`[data-act]`)?.dataset.act;t&&this.act(t)})}renderMenu(){let e=this.game.save.peek(),t=e&&!e.broken,n=t?`${e.day}일차 · Lv ${e.level} · 골드 ${e.gold.toLocaleString()} · 기지 ${e.bases}곳 · ${ff(e.savedAt)}`:``;this.hasSave=!!e,this.menu.innerHTML=`
      ${t?`<button type="button" class="t-menu-btn primary" data-act="continue">이어하기<small>${n}</small></button>`:``}
      ${e?.broken?`<p class="t-warn">${e.newer?`더 새로운 버전에서 만든 저장이 있어요`:`저장을 읽지 못했어요`}</p>`:``}
      <button type="button" class="t-menu-btn${t?``:` primary`}" data-act="new">새 게임</button>
      <button type="button" class="t-menu-btn" data-act="help">조작 방법</button>
      <button type="button" class="t-menu-btn" data-act="settings">설정</button>`}act(e){switch(e){case`continue`:this.close(),this.game.continueGame();break;case`new`:this.hasSave?this.showConfirm():this.startNew();break;case`new-yes`:this.startNew();break;case`help`:this.showCard(`<h2>조작 방법</h2>${df()}<div class="t-actions"><button type="button" class="t-menu-btn primary" data-act="back">알겠어요</button></div>`);break;case`back`:this.dialog.hidden=!0;break;case`settings`:this.dialog.hidden=!1,this.game.settingsPanel.render(this.card,()=>{this.dialog.hidden=!0});break;case`next`:this.step+=1,this.renderWelcome();break;case`go`:this.dialog.hidden=!0,this.el.remove(),this.ctx.state=`play`}}showCard(e){this.card.innerHTML=e,this.dialog.hidden=!1}showConfirm(){this.showCard(`
      <h2>새로 시작할까요?</h2>
      <p>지금 저장된 모험이 지워져요.<br>되돌릴 수 없어요!</p>
      <div class="t-actions">
        <button type="button" class="t-menu-btn" data-act="back">그만두기</button>
        <button type="button" class="t-menu-btn danger" data-act="new-yes">지우고 시작</button>
      </div>`)}startNew(){this.el.classList.add(`leaving`),this.game.newGame(),this.ctx.state=`paused`,this.step=0,this.el.querySelector(`.title-center`).remove(),this.el.querySelector(`.title-foot`).remove(),this.renderWelcome()}welcomeSteps(){let e=this.touch;return[{icon:`wave`,title:`초원에 온 걸 환영해요!`,body:e?`왼쪽 <b>조이스틱</b>으로 걷고, 끝까지 밀면 달려요.<br>빨간 <b>공격</b> 버튼으로 슬라임을 혼내 주세요.`:`<b>WASD</b>로 걷고 <b>Shift</b>로 달려요.<br><b>마우스 클릭</b>으로 그쪽을 향해 칼을 휘둘러요.`},{icon:`tent`,title:`첫 기지를 세워요`,body:e?`<b>가방</b>을 열고 텐트 키트를 <b>두 번 탭</b>하세요.<br>세울 자리를 탭하고 <b>설치</b>를 누르면 끝!`:`<b>I</b>로 가방을 열고 텐트 키트를 <b>우클릭</b>하세요.<br>세울 자리를 <b>클릭</b>하면 끝!`},{icon:`moon`,title:`밤을 조심해요`,body:`해가 지면 몬스터가 기지로 몰려와요.<br>슬라임을 잡아 모은 골드로 <b>포탑</b>을 세워 두세요.<br>`+(e?`<b>건설</b> 버튼`:`<b>B</b> 키`)+`로 지을 수 있어요.`}]}renderWelcome(){let e=this.welcomeSteps(),t=e[this.step],n=this.step===e.length-1;this.showCard(`
      <div class="welcome">
        <i class="w-icon w-${t.icon}" aria-hidden="true"></i>
        <h2>${t.title}</h2>
        <p>${t.body}</p>
        <div class="w-dots">${e.map((e,t)=>`<i class="${t===this.step?`on`:``}"></i>`).join(``)}</div>
        <div class="t-actions"><button type="button" class="t-menu-btn primary" data-act="${n?`go`:`next`}">${n?`모험 시작!`:`다음`}</button></div>
      </div>`)}close(){this.el.classList.add(`leaving`),setTimeout(()=>this.el.remove(),500)}},mf={shadows:[[`off`,`끄기`],[`low`,`낮음`],[`high`,`높음`]],decorDensity:[[.5,`50%`],[1,`100%`]]},hf=class{constructor(e){this.settings=e}render(e,t){let n=this.settings.values,r=e=>`
      <div class="seg" data-seg="${e}">
        ${mf[e].map(([t,r])=>`<button type="button" data-val="${t}" class="${String(n[e])===String(t)?`on`:``}">${r}</button>`).join(``)}
      </div>`,i=e=>`<button type="button" class="tog${n[e]?` on`:``}" data-toggle="${e}"><i></i></button>`,a=e=>`<input type="range" min="0" max="100" step="5" value="${Math.round(n[e]*100)}" data-slider="${e}">`;e.innerHTML=`
      <h2>설정</h2>
      <div class="set-list">
        <label><span>배경음</span>${a(`musicVolume`)}</label>
        <label><span>효과음</span>${a(`sfxVolume`)}</label>
        <div class="set-row"><span>화면 흔들림</span>${i(`shake`)}</div>
        <div class="set-row"><span>데미지 숫자</span>${i(`damageNumbers`)}</div>
        <div class="set-row"><span>그림자</span>${r(`shadows`)}</div>
        <div class="set-row"><span>풀·꽃 장식</span>${r(`decorDensity`)}</div>
      </div>
      <p class="set-note">휴대폰이 느리면 그림자를 낮추고 장식을 50%로 줄여 보세요.</p>
      <div class="t-actions"><button type="button" class="t-menu-btn primary" data-set-back>돌아가기</button></div>`,e.querySelectorAll(`[data-slider]`).forEach(e=>{e.addEventListener(`input`,()=>this.settings.set(e.dataset.slider,Number(e.value)/100))}),e.querySelectorAll(`[data-toggle]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.toggle;this.settings.set(t,!this.settings.get(t)),e.classList.toggle(`on`,this.settings.get(t))})}),e.querySelectorAll(`[data-seg]`).forEach(e=>{e.addEventListener(`click`,t=>{let n=t.target.closest(`[data-val]`);if(!n)return;let r=n.dataset.val;this.settings.set(e.dataset.seg,Number.isNaN(Number(r))?r:Number(r)),e.querySelectorAll(`button`).forEach(e=>e.classList.toggle(`on`,e===n))})}),e.querySelector(`[data-set-back]`).addEventListener(`click`,t)}},gf=`grassland-rpg-settings`,_f={musicVolume:.7,sfxVolume:.8,shake:!0,shadows:`high`,decorDensity:1,damageNumbers:!0},vf=class{constructor(e){this.bus=e,this.values={..._f};try{let e=localStorage.getItem(gf);e&&Object.assign(this.values,JSON.parse(e))}catch{}}get(e){return this.values[e]}set(e,t){if(this.values[e]!==t){this.values[e]=t;try{localStorage.setItem(gf,JSON.stringify(this.values))}catch{}this.bus.emit(`settings:changed`,{key:e,value:t,values:this.values})}}broadcast(){for(let[e,t]of Object.entries(this.values))this.bus.emit(`settings:changed`,{key:e,value:t,values:this.values})}},yf=class{constructor(){this.ctx=null,this.voices=0;let e=()=>this.start();for(let t of[`pointerdown`,`keydown`,`touchstart`])window.addEventListener(t,e,{passive:!0})}start(){if(this.ctx){this.ctx.state===`suspended`&&this.ctx.resume();return}let e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx=new e,this.sfxBus=this.ctx.createGain(),this.musicBus=this.ctx.createGain(),this.sfxBus.connect(this.ctx.destination),this.musicBus.connect(this.ctx.destination);let t=this.ctx.sampleRate;this.noise=this.ctx.createBuffer(1,t,this.ctx.sampleRate);let n=this.noise.getChannelData(0);for(let e=0;e<t;e++)n[e]=Math.random()*2-1;this.onStart?.()}get ready(){return!!this.ctx&&this.ctx.state===`running`}get now(){return this.ctx.currentTime}tone(e,{out:t,when:n,gain:r=1,pitch:i=1,count:a=!0}){let o=this.ctx,s=n+(e.t??0),c=e.d,l=o.createGain(),u=(e.g??.2)*r,d=e.a??.005;l.gain.setValueAtTime(1e-4,s),l.gain.exponentialRampToValueAtTime(Math.max(2e-4,u),s+d),l.gain.exponentialRampToValueAtTime(1e-4,s+c),l.connect(t);let f;if(e.type===`noise`){f=o.createBufferSource(),f.buffer=this.noise;let t=o.createBiquadFilter();t.type=`bandpass`,t.frequency.setValueAtTime(e.filter??1e3,s),e.filter2&&t.frequency.exponentialRampToValueAtTime(e.filter2,s+c),f.connect(t).connect(l)}else f=o.createOscillator(),f.type=e.type,f.frequency.setValueAtTime(e.f*i,s),e.f2&&f.frequency.exponentialRampToValueAtTime(e.f2*i,s+c),f.connect(l);a&&(this.voices+=1),f.onended=()=>{a&&--this.voices,l.disconnect()},f.start(s),f.stop(s+c+.02)}},bf=new q,xf=new Ht,Sf=new bn,Cf=new W,wf=new J,Tf=class{constructor(e,t){this.max=t;let n=new Ii(1,0),r=new Qi({flatShading:!0,roughness:.7,emissive:2236962});this.mesh=new xi(n,r,t),this.mesh.frustumCulled=!1,this.mesh.instanceMatrix.setUsage(rt),this.p=Array.from({length:t},()=>({life:0,pos:new W,vel:new W,rot:0})),this.next=0,bf.makeScale(0,0,0);for(let e=0;e<t;e++)this.mesh.setMatrixAt(e,bf),this.mesh.setColorAt(e,wf.set(16777215));e.add(this.mesh)}burst(e,t){for(let n=0;n<t.count;n++){let r=this.next,i=this.p[r];this.next=(this.next+1)%this.max;let a=Math.random()*Math.PI*2,o=t.speed*(.4+Math.random()*.6);i.pos.set(e.x+(Math.random()-.5)*(t.spread??.3),e.y+(Math.random()-.5)*(t.spread??.3),e.z+(Math.random()-.5)*(t.spread??.3)),i.vel.set(Math.cos(a)*o,(t.up??3)*(.5+Math.random()*.8),Math.sin(a)*o),i.gravity=t.gravity??14,i.maxLife=i.life=(t.life??.6)*(.7+Math.random()*.6),i.size=(t.size??.09)*(.7+Math.random()*.6),i.grow=!!t.grow,i.drag=t.drag??1.5,i.rot=Math.random()*6,this.mesh.setColorAt(r,wf.set(Array.isArray(t.color)?t.color[n%t.color.length]:t.color))}this.mesh.instanceColor.needsUpdate=!0}update(e){for(let t=0;t<this.max;t++){let n=this.p[t];if(n.life<=0)continue;n.life-=e,n.vel.y-=n.gravity*e,n.vel.multiplyScalar(Math.exp(-n.drag*e)),n.pos.addScaledVector(n.vel,e),n.pos.y<.03&&(n.pos.y=.03,n.vel.y*=-.3,n.vel.x*=.6,n.vel.z*=.6),n.rot+=e*6;let r=Math.max(0,n.life/n.maxLife),i=n.life<=0?0:n.size*(n.grow?Math.sin(Math.PI*(1-r))*2.2+.3:r);Sf.set(n.rot,n.rot*.7,0),xf.setFromEuler(Sf),bf.compose(n.pos,xf,Cf.setScalar(i)),this.mesh.setMatrixAt(t,bf)}this.mesh.instanceMatrix.needsUpdate=!0}},Ef=class{constructor(e,t){this.ctx=e,this.camera=t,this.cfg=e.data.config.feedback,this.particles=new Tf(e.scene,this.cfg.particles.max),this.hitstop=0,this.shakeOn=!0,this.dustTimer=0,this.pillars=[];let{bus:n}=e,r=this.cfg.particles,i=this.cfg.hitstop,a=this.cfg.shake;n.on(`settings:changed`,({key:e,value:t})=>{e===`shake`&&(this.shakeOn=t)}),n.on(`combat:hit`,e=>{e.target===`monster`?(this.particles.burst(e.position.clone().setY(.6),{color:e.color??`#ffffff`,count:r.hit,speed:3.2,up:3,life:.45}),e.source===`player`&&this.stop(e.crit?i.crit:i.hit),e.crit&&this.shake(a.crit)):e.target===`player`?(this.shake(a.playerHit),this.particles.burst(e.position.clone().setY(.8),{color:[`#ff7b7b`,`#ffffff`],count:5,speed:2.5,up:2.5,life:.4})):e.target===`structure`&&this.particles.burst(e.position.clone().setY(1),{color:[`#c9a06a`,`#8a6440`],count:4,speed:2.5,up:3,life:.5})}),n.on(`monster:killed`,e=>{let t=e.position.clone().setY(.5),n=(e.radius??.6)>1;this.particles.burst(t,{color:e.color??`#ffffff`,count:r.kill*(n?2:1),speed:n?6:4,up:4.5,life:.7,size:n?.16:.1}),this.particles.burst(t,{color:`#ffffff`,count:n?8:4,speed:1.2,up:1.2,gravity:-1,life:.6,size:.18,grow:!0,drag:3}),e.boss&&this.stop(i.bossKill)}),n.on(`stats:levelup`,()=>this.levelUp()),n.on(`player:shock`,e=>{this.shake(.18),this.particles.burst(e.position.clone().setY(.2),{color:[`#d9c6a0`,`#ffffff`],count:14,speed:e.radius*2,up:2,life:.45,size:.1})}),n.on(`gather:hit`,e=>{this.particles.burst(e.position,{color:[e.color,`#e0c38a`],count:5,speed:2.6,up:3,life:.45,size:.08})}),n.on(`gather:done`,e=>{this.particles.burst(e.position.clone().setY(.8),{color:[e.color,`#ffffff`],count:12,speed:3.5,up:4,life:.6,size:.1})}),n.on(`turret:fired`,e=>{this.particles.burst(e.muzzle,{color:[`#fff3a6`,`#ffcf5c`],count:r.muzzle,speed:2,up:1,gravity:0,life:.15,size:.08,drag:6})}),n.on(`projectile:explode`,t=>{let n=t.position.distanceTo(e.player.position);this.shake(a.cannon*Math.max(0,1-n/a.cannonFalloff)),this.particles.burst(t.position.clone().setY(.3),{color:[`#ffb35c`,`#ff7b3d`,`#5a5147`],count:r.blast,speed:5,up:5,life:.6,size:.12})}),n.on(`boss:aoe`,e=>{this.shake(a.bossAoe),this.particles.burst(e.position.clone().setY(.2),{color:[`#d9c6a0`,`#ffffff`],count:r.blast,speed:e.radius*1.5,up:3,life:.6,size:.14})}),n.on(`monster:blast`,t=>{let n=t.position.distanceTo(e.player.position);this.shake(a.cannon*Math.max(0,1-n/a.cannonFalloff)),this.particles.burst(t.position.clone().setY(.4),{color:[`#ffb35c`,`#ff7b3d`,t.monster.def.color],count:r.blast,speed:t.radius*2.5,up:5,life:.6,size:.13})}),n.on(`monster:emerge`,e=>{this.shake(a.bossAoe*.4),this.particles.burst(e.position.clone().setY(.2),{color:[`#c9a36a`,`#8a6a44`],count:16,speed:e.radius*1.8,up:5,life:.6,size:.12})}),n.on(`monster:stunned`,({monster:e})=>{this.particles.burst(e.position.clone().setY(e.radius*2+.3),{color:[`#fff27a`,`#ffffff`],count:6,speed:1.5,up:1.5,gravity:0,life:.8,size:.09,drag:2})}),n.on(`boss:line`,e=>{this.shake(a.bossAoe*.5);for(let t=1;t<=6;t++){let n=e.origin.clone().addScaledVector(e.dir,e.length*t/6).setY(.2);this.particles.burst(n,{color:[`#7a5a3a`,`#5f8f45`],count:4,speed:2,up:4,life:.5,size:.12})}}),n.on(`boss:split`,({boss:e})=>{this.shake(a.bossAoe),this.particles.burst(e.position.clone().setY(1),{color:e.def.color,count:r.blast,speed:6,up:5,life:.7,size:.16})}),n.on(`player:roll`,({position:e})=>this.dust(e,6)),n.on(`player:running`,({position:e})=>{--this.dustTimer,this.dustTimer<=0&&(this.dust(e,2),this.dustTimer=3)})}dust(e,t){let n=this.ctx.world.regionAt(e.x,e.z);this.particles.burst(e.clone().setY(.1),{color:n.ground[1],count:t,speed:1.2,up:1.2,gravity:2,life:.5,size:.1,grow:!0,drag:3})}stop(e){this.hitstop=Math.max(this.hitstop,e)}shake(e){this.shakeOn&&e>0&&this.camera.shake(e,this.cfg.shake.duration)}levelUp(){let e=this.ctx.player.position,t=new X(new Z(.9,.9,7,16,1,!0),new Qr({color:16767334,transparent:!0,opacity:.55,depthWrite:!1,side:2}));t.position.set(e.x,3.5,e.z),this.ctx.scene.add(t),this.pillars.push({mesh:t,t:0}),this.particles.burst(e.clone().setY(1),{color:[`#ffd966`,`#fff3a6`,`#ffffff`],count:this.cfg.particles.levelup,speed:2.5,up:7,gravity:4,life:1.1,size:.1})}tick(e){let t=1;this.hitstop>0&&(this.hitstop-=e,t=this.cfg.hitstop.scale),this.ctx.timeScale=t,this.particles.update(e);for(let t of this.pillars)t.t+=e,t.mesh.material.opacity=.55*Math.max(0,1-t.t/1.2),t.mesh.scale.set(1+t.t*.5,1,1+t.t*.5),t.t>1.2&&this.ctx.scene.remove(t.mesh);return this.pillars=this.pillars.filter(e=>e.t<=1.2),t}},Df=class{constructor(e,t){this.ctx=e,this.synth=t,this.cfg=e.data.sounds,this.played=new Set,this.volume=1;let{bus:n}=e,r=e=>e?.position;n.on(`settings:changed`,({key:e,value:t})=>{e===`sfxVolume`&&(this.volume=t),this.applyVolume()}),t.onStart=()=>this.applyVolume(),n.on(`player:attack`,e=>{e.shock||this.play(`swing`)}),n.on(`player:shoot`,()=>this.play(`shoot`)),n.on(`player:shock`,()=>this.play(`shock`)),n.on(`item:use`,t=>{e.data.items.items[t.item]?.category===`consumable`&&this.play(`drink`)}),n.on(`combat:hit`,e=>{e.target===`monster`&&e.source===`player`?this.play(e.crit?`crit`:`hit`,r(e)):e.target===`monster`&&this.play(`hit`,r(e),{gain:.5})}),n.on(`monster:killed`,e=>this.play(`kill`,r(e),{pitch:Math.min(1.6,Math.max(.45,.6/(e.radius??.6)))})),n.on(`loot:picked`,({item:t})=>this.play(e.data.items.items[t]?.category===`currency`?`coin`:`pickup`)),n.on(`stats:levelup`,()=>this.play(`levelup`)),n.on(`gather:hit`,e=>this.play(e.sound,e.position)),n.on(`gather:done`,e=>this.play(`gathered`,e.position)),n.on(`player:damaged`,()=>this.play(`hurt`)),n.on(`player:roll`,()=>this.play(`roll`)),n.on(`turret:fired`,t=>this.play(e.data.turrets[t.type]?.model??`bow`,r(t),{gain:.8})),n.on(`projectile:explode`,e=>this.play(`boom`,r(e))),n.on(`boss:aoe`,e=>this.play(`slam`,r(e))),n.on(`boss:line`,e=>this.play(`slam`,e.origin,{pitch:.8})),n.on(`boss:split`,({boss:e})=>this.play(`slam`,e.position,{pitch:1.3})),n.on(`boss:leafstorm`,({boss:e})=>this.play(`rustle`,e.position)),n.on(`monster:blast`,e=>this.play(`boom`,e.position)),n.on(`monster:emerge`,e=>this.play(`slam`,e.position,{pitch:1.4,gain:.6})),n.on(`monster:shoot`,e=>this.play(`shoot`,e.origin,{pitch:1.3,gain:.5})),n.on(`monster:stunned`,({monster:e})=>this.play(`hit`,e.position,{pitch:.7})),n.on(`build:place`,()=>this.play(`build`)),n.on(`base:upgraded`,()=>this.play(`build`)),n.on(`ui:open`,()=>this.play(`open`)),n.on(`ui:close`,()=>this.play(`close`)),n.on(`raid:start`,()=>this.play(`horn`)),n.on(`time:day`,()=>this.play(`birds`)),document.addEventListener(`pointerdown`,e=>{e.target.closest(`button`)&&this.play(`click`)})}applyVolume(){this.synth.ctx&&(this.synth.sfxBus.gain.value=this.cfg.masterSfx*this.volume)}play(e,t,{gain:n=1,pitch:r=1}={}){let i=this.synth,a=this.cfg.sfx[e];if(!a||!i.ready||this.volume<=0||this.played.has(e)||i.voices>=this.cfg.maxVoices)return;let o=n;if(t){let e=t.distanceTo?.(this.ctx.player.position)??0;if(e>this.cfg.maxDistance)return;o*=1-e/this.cfg.maxDistance*.8}this.played.add(e);let s=i.now+.005;for(let e of a)i.tone(e,{out:i.sfxBus,when:s,gain:o,pitch:r})}update(){this.played.clear()}},Of=class{constructor(e,t){this.ctx=e,this.synth=t,this.cfg=e.data.sounds.music,this.master=e.data.sounds.masterMusic,this.volume=1,this.nextTime=0,this.step=0,this.raid=!1,this.boss=0,this.melodyNote=2;let{bus:n}=e;n.on(`settings:changed`,({key:e,value:t})=>{e===`musicVolume`&&(this.volume=t),this.applyVolume()}),n.on(`raid:start`,()=>{this.raid=!0}),n.on(`raid:end`,()=>{this.raid=!1}),n.on(`time:day`,()=>{this.raid=!1}),n.on(`boss:engaged`,()=>{this.boss+=1}),n.on(`boss:disengaged`,()=>{this.boss=Math.max(0,this.boss-1)})}applyVolume(){this.synth.ctx&&(this.synth.musicBus.gain.value=this.master*this.volume)}mood(){let{time:e,world:t,player:n,state:r}=this.ctx;if(r===`title`)return this.cfg.moods.grassland_day;if(e.isNight)return this.cfg.moods.night;let i=t.regionAt(n.position.x,n.position.z).id;return this.cfg.moods[`${i}_day`]??this.cfg.moods.grassland_day}freq(e,t,n=0){let r=e.scale.length,i=Math.floor(t/r)+n,a=e.scale[(t%r+r)%r]+12*i;return e.root*2**(a/12)}schedule(e,t,n){let r=this.synth,i=r.musicBus,a=this.cfg.stepsPerBar,o=this.step%a,s=[0,3,1,4][Math.floor(this.step/a)%4];if(o===0)for(let o of[0,2,4])r.tone({type:e.pad,f:this.freq(e,s+o,-1),d:n*a*.95,g:.05,a:.25},{out:i,when:t,count:!1});o%4==0&&r.tone({type:`triangle`,f:this.freq(e,s,-2),d:n*1.8,g:.09},{out:i,when:t,count:!1}),(Math.random()<this.cfg.melodyChance||o===0)&&(this.melodyNote+=[-2,-1,-1,0,1,1,2][Math.floor(Math.random()*7)],this.melodyNote=Math.max(0,Math.min(9,this.melodyNote)),r.tone({type:e.lead,f:this.freq(e,this.melodyNote),d:n*(o%2?.9:1.6),g:.07,a:.02},{out:i,when:t,count:!1})),this.raid&&this.cfg.raidDrums&&(o%4==0&&r.tone({type:`sine`,f:110,f2:40,d:.25,g:.22},{out:i,when:t,count:!1}),o%4==2&&r.tone({type:`noise`,d:.12,g:.12,filter:1800},{out:i,when:t,count:!1}),r.tone({type:`noise`,d:.04,g:.04,filter:6e3},{out:i,when:t,count:!1}))}update(){let e=this.synth;if(!e.ready||this.volume<=0)return;let t=this.mood(),n=60/(t.tempo*(this.boss>0?this.cfg.bossTempoMultiplier:1)*(this.raid?1.12:1))/2;for(this.nextTime<e.now&&(this.nextTime=e.now+.05);this.nextTime<e.now+.25;)this.schedule(t,this.nextTime,n),this.nextTime+=n,this.step+=1}},kf=class{constructor(e,t){this.ctx=e,this.game=t;let n=document.createElement(`div`);n.className=`t-dialog pause`,n.hidden=!0,n.innerHTML=`<div class="t-card" data-card></div>`,document.body.appendChild(n),this.el=n,this.card=n.querySelector(`[data-card]`),n.addEventListener(`click`,e=>{let t=e.target.closest(`[data-act]`)?.dataset.act;t?this.act(t):e.target===n&&this.close()}),window.addEventListener(`keydown`,e=>{e.code===`Escape`&&!n.hidden&&this.close()}),e.bus.on(`pause:open`,()=>this.open())}open(){this.ctx.state===`play`&&(this.ctx.state=`paused`,this.renderMain(),this.el.hidden=!1)}close(){this.el.hidden=!0,this.ctx.state===`paused`&&(this.ctx.state=`play`)}renderMain(e=``){this.card.innerHTML=`
      <h2>잠깐 쉬어 가요</h2>
      <div class="pause-menu">
        <button type="button" class="t-menu-btn primary" data-act="resume">계속하기</button>
        <button type="button" class="t-menu-btn" data-act="save">저장하기${e?`<small>${e}</small>`:``}</button>
        <button type="button" class="t-menu-btn" data-act="help">조작 방법</button>
        <button type="button" class="t-menu-btn" data-act="settings">설정</button>
        <button type="button" class="t-menu-btn" data-act="title">타이틀로<small>저장하고 돌아가요</small></button>
      </div>`}act(e){switch(e){case`resume`:this.close();break;case`save`:this.ctx.bus.emit(`save:request`),this.renderMain(`저장했어요!`);break;case`help`:this.card.innerHTML=`<h2>조작 방법</h2>${df()}<div class="t-actions"><button type="button" class="t-menu-btn primary" data-act="back">돌아가기</button></div>`;break;case`back`:this.renderMain();break;case`settings`:this.game.settingsPanel.render(this.card,()=>this.renderMain());break;case`title`:this.ctx.bus.emit(`save:request`),window.location.reload()}}};new class{constructor({container:e,uiRoot:t,data:n}){let r=new wl({antialias:!0});r.setPixelRatio(Math.min(window.devicePixelRatio,2)),r.setSize(window.innerWidth,window.innerHeight),r.shadowMap.enabled=!0,r.shadowMap.type=1,e.appendChild(r.domElement),this.renderer=r,this.camera=new Ol(n.config.camera,window.innerWidth/window.innerHeight),this.raycaster=new no,this.groundPlane=new Wr(new W(0,1,0),0);let i=new Tl;this.time=new Dl(n.config.time,i);let a={data:n,scene:new qn,bus:i,time:this.time,timeScale:1,input:new El(r.domElement),camera:this.camera.camera,mouseGround:null,monsters:[]};this.ctx=a,a.world=new Il(a),this.systems=[new Au(a)],a.player=new Jl(a),this.systems.push(new Xl(a),new fu(a),new _u(a),new vu(a),new wu(a),new Ku(a),new ed(a),new rd(a),new id(a),new od(a),new sd(a),new cd(a),new ld(a),new dd(a),new fd(a),new pd(a),new Sd(a),new Od(a),new Ad(a),new Md(a),new Pd(a),new Fd(a)),this.save=new Eu(a),this.systems.push(this.save),this.hud=new Ld(a,t),this.ui=new Rd(a,t),this.tooltip=new zd(t),new qd(a,this.ui,this.tooltip),new Jd(a,this.ui),new Xd(a,this.ui,this.tooltip),new Zd(a,this.ui),new tf(a,this.ui),new nf(a,this.ui),new rf(a,this.ui,this.tooltip),new of(a,this.ui,this.tooltip),new sf(a,this.ui,this.tooltip),this.touch=new lf(a,t),this.settings=new vf(i),this.settingsPanel=new hf(this.settings),this.synth=new yf,this.feedback=new Ef(a,this.camera),this.sound=new Df(a,this.synth),this.music=new Of(a,this.synth),i.on(`settings:changed`,({key:e,value:t})=>{e===`shadows`&&this.applyShadows(t)}),this.settings.broadcast(),i.on(`player:teleport`,()=>this.camera.snapTo(a.player.position)),this.systems.find(e=>e instanceof id).recalc(),this.systems.find(e=>e instanceof od).changed(),this.systems.find(e=>e instanceof sd).changed(),a.state=`title`,this.save.disabled=!0,this.titleAngle=0,this.pause=new kf(a,this),this.title=new pf(a,this),this.camera.snapTo(a.player.position),window.addEventListener(`resize`,()=>this.resize()),this.loop=this.loop.bind(this)}start(){requestAnimationFrame(this.loop)}continueGame(){this.save.disabled=!1,this.save.load()||this.ctx.bus.emit(`game:new`),this.beginPlay()}newGame(){this.save.clear(),this.save.disabled=!1,this.ctx.bus.emit(`game:new`),this.beginPlay(),this.save.save()}beginPlay(){this.ctx.state=`play`,document.body.classList.remove(`on-title`),this.camera.snapTo(this.ctx.player.position)}loop(e){let t=this.time.tick(e);this.update(t),this.renderer.render(this.ctx.scene,this.ctx.camera),requestAnimationFrame(this.loop)}applyShadows(e){let t=this.renderer,n=e!==`off`,r=e===`low`?1024:2048,i=this.ctx.world.sun;i.shadow.mapSize.x!==r&&(i.shadow.mapSize.set(r,r),i.shadow.map?.dispose(),i.shadow.map=null),t.shadowMap.enabled!==n&&(t.shadowMap.enabled=n,this.ctx.scene.traverse(e=>{e.material&&(e.material.needsUpdate=!0)}))}update(e){let t=this.ctx;this.music.update(),this.sound.update(),this.camera.updateShake(e);let n=t.state===`play`?e*this.feedback.tick(e):e;if(t.state===`title`){this.titleAngle+=n*.06,this.camera.orbit(t.player.position,this.titleAngle),t.player.syncMesh(n),t.world.update(n,t.player.position),t.input.endFrame();return}if(t.state===`paused`){t.input.endFrame();return}this.updateMouseGround(),this.time.advance(n),t.player.update(n);let r=t.data.config.world.activeRadius;for(let e of t.monsters)(e.raid||e.state===`dead`||e.position.distanceTo(t.player.position)<r)&&e.update(n);for(let e of this.systems)e.update?.(n);t.world.update(n,t.player.position),this.camera.update(n,t.player.position),this.hud.update(n),this.ui.update(n),this.touch.update(),t.input.endFrame()}updateMouseGround(){let{input:e}=this.ctx;if(!e.hasMouse)return;this.raycaster.setFromCamera(e.mouseNdc,this.ctx.camera);let t=new W;this.ctx.mouseGround=this.raycaster.ray.intersectPlane(this.groundPlane,t)?t:null}resize(){this.renderer.setSize(window.innerWidth,window.innerHeight),this.camera.resize(window.innerWidth/window.innerHeight)}}({container:document.getElementById(`app`),uiRoot:document.getElementById(`ui`),data:{config:e,player:t,monsters:n,items:r,buildings:i,turrets:a,regions:o,levels:s,skills:c,recipes:l,shop:u,bosses:d,sounds:f,nodes:p,weapons:m}}).start();