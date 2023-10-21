let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;   //The target monster
let monsterhealth;
let inventory = ["stick"]

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weaponStore =[
    {
        name: "stick", power: 5
    },
    {
        name: "dagger", power: 30
    },
    {
        name: "hammer", power: 50
    },
    {
        name: "sword", power: 100
    },
    {
        name: " FUCKING samurai", power: 200
    }
]

const monsters = [
    {
        name:"Skeleton",
        level: 2,
        health: 15
    },
    {
        name:"Megatron",
        level: 8,
        health: 60
    },
    {
        name:"Dragon",
        level: 16,
        health: 300
    }
]

const locations = [
    { 
        name: "town square",
        consoleText: "Going to town.",
        "button text": ["Go to store","Go to cave","Fight dragon"],
        "button function":[goStore, goCave, fightDragon],
        text: "You're at the town square now"
    },
    { 
        name: "store",
        consoleText: "Going to store.",
        "button text": ["Buy 10 health (10 gold)","Buy weapon (30 gold)","Go town square"],
        "button function":[buyHealth, buyWeapon, goTown],
        text: "You're at the store now."
    },
    {
        name: "cave",
        consoleText:"Went to cave",
        'button text': ['Slay Skeleton',"Slay Megatron",'Back to town'],
        "button function":[Skeleton,Megatron,goTown],
        text:"You're now at the cave"
    },
    {
        name: "fight",
        "button text": ["Attack", "Dodge","Run"],
        "button function":[attack,dodge,goTown],
        text: "You're fighting a monster"
    },
    {
        name: "kill monster",
        "button text": ["Go back", "Sleep","Pulang"],
        "button function":[goTown,goTown,easterEgg],
        text: "The monster died, you gain some experiences and golds."
    },
    {
        name: "lose",
        "button text": ["Replay", "Replay","Replay"],
        "button function":[restart,restart,restart],
        text: "You has been defeated"
    },
    {
        name: "winGame",
        "button text": ["Replay", "Replay","Replay"],
        "button function":[restart,restart,restart],
        text: "You win the game!"
    },
    {
        name: "easterEgg",
        "button text": ["2", "7"," Go Back?"],
        "button function":[pickTwo, pickSeven, goTown],
        text: "You found a secret game!. Choose a number above, or return to town. 10 numbers (1-10) will be chosen randomly, winning it will give you 20 golds, but lose 10 health if you lose."
    }

]

//Functioning button
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location){
    monsterStats.style.display = "none";
    console.log(location.consoleText);
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    text.innerText = location.text;
    button1.onclick = location["button function"][0];
    button2.onclick = location["button function"][1];
    button3.onclick = location["button function"][2];
}

function goTown(){
    update(locations[0])
}
function goStore(){
    update(locations[1])
}

function goCave(){
    update(locations[2])
}


function buyHealth(){
    console.log("buying health")
    if(gold>=10){
        gold -=10;
        health +=10;
        healthText.innerText = health;
        goldText.innerText = gold;
    }
    else{
        text.innerText = "You don't have enough gold to buy";
    }
}

function buyWeapon(){
    console.log("buying weapon")
    if(currentWeapon < weaponStore.length-1){
        if(gold>=30){
            gold-=30;
            currentWeapon++;
            goldText.innerText = gold;
            let newWeapon = weaponStore[currentWeapon].name;
            text.innerText = "You've obtained new weapon namely "+newWeapon+".";
            inventory.push(newWeapon);
            text.innerText += " Your inventory contains "+inventory+".";
        }
        else{
            text.innerText = "You don't enough gold to buy";
        }
    }
    else{
        text.innerText = "You've acquired the strongest weapon that is available here!";
        button2.innerText = "sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon(){
    if(inventory.length > 1){
        gold +=15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift();
        text.innerText = "your inventory contains "+ inventory+" after selling the "+currentWeapon+".";
    }
    else{
        text.innerText = "Cannot sell your only weapon!";
    }

}

function Skeleton(){
    fighting = 0;
    goFight();
}
function Megatron(){
    fighting = 1;
    goFight();
}
function fightDragon(){
    console.log("Fighting Dragon.")
    fighting = 2;
    goFight();
}

function goFight(){
    update(locations[3]);
    monsterStats.style.display = "block";
    monsterhealth = monsters[fighting].health;
    monsterHealthText.innerText = monsterhealth;
    monsterNameText.innerText = monsters[fighting].name;
}

function attack(){
    text.innerText = "The "+monsters[fighting].name+" attack.";
    text.innerText += " You counter attack it with a "+ weaponStore[currentWeapon].name+".";
    if(isMonsterHit()){
        health -= getMonsterAttackValue(monsters[fighting].level);
    }
    else{
        text.innerText += "You dodged the attack and dealt damage to the monster!";
    }
    monsterhealth -= weaponStore[currentWeapon].power + Math.floor(Math.random()*xp) +1;
    healthText.innerText = health;
    monsterHealthText.innerText = monsterhealth;
    if(health<= 0){
        lose();
    }
    else if(monsterhealth <= 0){
        fighting === 2? winGame() : defeatMonsters();
    }
    if(Math.random() <= .05 && inventory.length !==1){
        text.innerText = "your "+ inventory.pop()+" breaks!"
        currentWeapon--;
    }
}

function isMonsterHit(){
    let random = Math.random() > .2 || health < 20;
    console.log("Monster is hit? " + random);
    return random;
}

function getMonsterAttackValue(level){
    damage = level*5 - (Math.floor(Math.random()*xp));
    console.log("Damage dealt: " + damage);
    return damage;
}

function dodge(){
    text.innerText = "You've dodged the attack from the "+monsters[fighting].name+".";
    text.innerText += " Nothing lose from both of you."
}

function lose(){
    update(locations[5]);
}
function winGame(){
    update(locations[6]);
}
function easterEgg(){
    update(locations[7])
}
function pickTwo(){
    pick(2);
}
function pickSeven(){
    pick(7);
}

function defeatMonsters(){
    gold += Math.floor(monsters[fighting].level * 6.4);
    xp += Math.floor(monsters[fighting].level/2);
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4])
}

function restart(){
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    fighting;
    monsterhealth;
    inventory = ["stick"]
    goldText.innerText = gold
    healthText.innerText = health
    xpText.innerText = xp
    goTown()
}

function pick(guess){
    let number = [];
    while(number.length < 10){
        number.push(Math.floor(Math.random()*11));
    }
    text.innerText = "You picked "+guess+". Here are the random numbers: \n";
    for(let i=0; i<10;i++){
        text.innerText += number[i]+"\n";
    }
    if(number.indexOf(guess) !== -1){
        text.innerText += "Right! You win 20 gold!";
        gold += 20;
        goldText.innerText = gold;
    }
    else{
        text.innerText += "Wrong, you lose 10 health.";
        health -= 10;
        healthText.innerText = health;
        if(health <= 0){
            lose();
        }
    }

}