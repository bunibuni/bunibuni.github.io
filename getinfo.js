const ABIs = require('./abi.js')

const address = {"vbuni":"0x7CDb479ACd5Efc8B8B432670e70665BC8a5b1234","buniTokenContract":"0x0E7BeEc376099429b85639Eb3abE7cF22694ed49","gameContract":"0x6f9646a8e5Bf4AC7b71D9BB0F21159112AdB572d","marketContract":"0xE70Ab3DD4557d411EB982FE8acD53b0854E47A10","burTokenContract":"0xc1619D98847CF93d857DFEd4e4d70CF4f984Bd56","mysteryBox":"0x2B982Fb9dcCFcA940Fa8C7e93D8d2742f3A9C7bb","trainerContract":"0xa40E375bBff05D982F9401311949c6970EA6e523","bunicornContract":"0x86B81f94646337879ddfEE8BCb89724f4ae721FE"}

const Web3 = require('web3')
const web3 = new Web3('https://bsc-dataseed1.binance.org:443')




gameContract = new web3.eth.Contract(ABIs.gameABI, address.gameContract)
bunicornContract = new web3.eth.Contract(ABIs.bunicornABI, address.bunicornContract)
trainerContract = new web3.eth.Contract(ABIs.trainerABI, address.trainerContract)
const bunicornImages = {"Fire":[["https://static.nft.bunicorn.exchange/bunicorns/fire_rabbit_Larvuny_1_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/fire_rabbit_Larvany_2_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/fire_rabbit_Larvesbuny_3_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/rabbit_level_Larvucorn_4_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/rabbit_level_Maslarcorn_5_450x600.png"]],"Earth":[["https://static.nft.bunicorn.exchange/bunicorns/earth_rabbit_Floru_1_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/earth_rabbit_Floruny_2_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/earth_rabbit_Florany_3_450x600.png","https://static.nft.bunicorn.exchange/bunicorns/earth_rabbit_Florany_3_2_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/earth_rabbit_Floracorn_4_450x600.png","https://static.nft.bunicorn.exchange/bunicorns/earth_rabbit_Floracorn_4_2.png"],["https://static.nft.bunicorn.exchange/bunicorns/earth_rabbit_Floranicorn_5_450x600.png"]],"Water":[["https://static.nft.bunicorn.exchange/bunicorns/water_rabbit_Seabu_1_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/water_rabbit_Seasabu_2_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/water_rabbit_Oceabu_3_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/water_rabbit_Depseabu_4_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/water_rabbit_Abysbu_5_450x600.png"]],"Air":[["https://static.nft.bunicorn.exchange/bunicorns/Air rabbit_Sylny_1_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/Air rabbit_Syluny_2_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/Air rabbit_Sylveny_3_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/Air rabbit_Sylveny_4_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/Air rabbit_Sylveny_5_450x600.png"]]}

getBunicornImage = function(bunicorn){
    return bunicornImages[bunicorn.element][parseInt(bunicorn.star)][0]
}
function ElementString(e){
    switch (e) {
    case 0:
        return "Fire";
    case 1:
        return "Earth";
    case 3:
        return "Water";
    case 2:
        return "Air";
    case 4:
        return "NEUTRAL";
    default:
        return "???"
    }
}

async function getBunicorn(bunicornId){
    var bunicorn, bunicornStamina;
    await bunicornContract.methods.get(bunicornId).call().then(x => bunicorn = x)
    await bunicornContract.methods.getStaminaPoints(bunicornId).call().then(x => bunicornStamina = x);
    var n = bunicorn._props >> 5 & 127
    , attr1Element = n % 5
    , attr2Element = Math.floor(n / 5) % 5
    , attr3Element =  Math.floor(Math.floor(n / 5) / 5) % 5
    , element = bunicorn._props >> 3 & 3
    , star = 7 & bunicorn._props;
    return {
        id: bunicornId,
        properties: bunicorn._props,
        'element': ElementString(element),
        attr1: ElementString(attr1Element),
        attr1Value: bunicorn._attr1,
        attr1Type: attr1Element,
        attr2: ElementString(attr2Element),
        attr2Value: bunicorn._attr2,
        attr2Type: attr2Element,
        attr3: ElementString(attr3Element),
        attr3Value: bunicorn._attr3,
        attr3Type: attr3Element,
        level: bunicorn._level,
        'star': star,
        stamina: bunicornStamina,
        bonusAttribute: bunicorn._bonusAttribute
    }
}


async function getTrainer(trainerId){
    var trainerGet, trainerStamina, trainerName;
    await trainerContract.methods.get(trainerId).call().then(x => trainerGet = x)
    await trainerContract.methods.getStaminaPoints(trainerId).call().then(x => trainerStamina = x)
    
    return {
        id: trainerId,
        element: trainerGet._element,
        elementName: ElementString(parseInt(trainerGet._element)),
        level: trainerGet._level+1,
        exp: trainerGet._exp,
        power: trainerGet._power,
        stamina: trainerStamina
    }
}

GetTrainerImage = function (trainer){
    var ae = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Black_robot_fire.png"
          , re = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Female_trainer_02_fire.png"
          , ie = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Female_trainer_04_fire.png"
          , se = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Male_trainer_01_fire.png"
          , ce = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Male_trainer_03_fire.png"
          , be = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Pink_robot_fire.png"
          , oe = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Black_robot_air.png"
          , fe = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Female_trainer_02_air.png"
          , de = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Female_trainer_04_air.png"
          , ue = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Male_trainer_01_air.png"
          , le = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Male_trainer_03_air.png"
          , pe = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Pink_robot_air.png"
          , me = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Black_robot_earth.png"
          , he = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Female_trainer_02_earth.png"
          , ve = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Female_trainer_04_earth.png"
          , ye = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Male_trainer_01_earth.png"
          , ge = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Male_trainer_03_earth.png"
          , we = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Pink_robot_earth.png"
          , Te = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Black_robot_water.png"
          , ke = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Female_trainer_02_water.png"
          , Ce = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Female_trainer_04_water.png"
          , xe = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Male_trainer_01_water.png"
          , Ie = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Male_trainer_03_water.png"
          , Be = "https://static.nft.bunicorn.exchange/trainers/RESIZED_Pink_robot_water.png"
          , Ae = "https://static.nft.bunicorn.exchange/trainers/Black_robot_fix_light-750x1000.png"
          , Se = "https://static.nft.bunicorn.exchange/trainers/Female_trainer_02_fix_light-750x1000.png"
          , Re = "https://static.nft.bunicorn.exchange/trainers/Female_trainer_04_fix_light-750x1000.png"
          , _e = "https://static.nft.bunicorn.exchange/trainers/Male_trainer_013.png"
          , Fe = "https://static.nft.bunicorn.exchange/trainers/Male_trainer_03_fix%20light3.png"
          , Me = "https://static.nft.bunicorn.exchange/trainers/Pink_robot_fix_light-750x1000.png"
          , Ne = [Ae, Se, Re, _e, Fe, Me]
          , Oe = [ae, re, ie, se, ce, be]
          , je = [oe, fe, de, ue, le, pe]
          , Le = [me, he, ve, ye, ge, we]
          , Pe = [Te, ke, Ce, xe, Ie, Be];
    return trainer ? "Earth" === trainer.elementName ? Le[trainer.id % Ne.length] : "Fire" === trainer.elementName ? Oe[trainer.id % Ne.length] : "Water" === trainer.elementName ? Pe[trainer.id % Ne.length] : "Air" === trainer.elementName ? je[trainer.id % Ne.length] : void 0 : null
}



getBunicornsAndTrainers = async function (address){
    var bunicorns, trainers;
    await gameContract.methods.getMyBunicorns().call({from: address}).then(x => bunicorns = x)
    await gameContract.methods.getMyTrainers().call({from: address}).then(x => trainers = x)
    var bunicornInfo = [], trainerInfo = [];
    for(let bunicorn of bunicorns){
        await getBunicorn(bunicorn).then(x => bunicornInfo.push(x));
    }
    for(let trainer of trainers){
        await getTrainer(trainer).then(x => trainerInfo.push(x));
    }
    return {
        trainers:trainerInfo,
        bunicorns:bunicornInfo
    }
}
