const ABIs = require('./abi.js')

const address = {"vbuni":"0x7CDb479ACd5Efc8B8B432670e70665BC8a5b1234","buniTokenContract":"0x0E7BeEc376099429b85639Eb3abE7cF22694ed49","gameContract":"0x6f9646a8e5Bf4AC7b71D9BB0F21159112AdB572d","marketContract":"0xE70Ab3DD4557d411EB982FE8acD53b0854E47A10","burTokenContract":"0xc1619D98847CF93d857DFEd4e4d70CF4f984Bd56","mysteryBox":"0x2B982Fb9dcCFcA940Fa8C7e93D8d2742f3A9C7bb","trainerContract":"0xa40E375bBff05D982F9401311949c6970EA6e523","bunicornContract":"0x86B81f94646337879ddfEE8BCb89724f4ae721FE"}

const Web3 = require('web3')
const web3 = new Web3('https://bsc-dataseed1.binance.org:443')




gameContract = new web3.eth.Contract(ABIs.gameABI, address.gameContract)
bunicornContract = new web3.eth.Contract(ABIs.bunicornABI, address.bunicornContract)
trainerContract = new web3.eth.Contract(ABIs.trainerABI, address.trainerContract)
const bunicornImages = {"FIRE":[["https://static.nft.bunicorn.exchange/bunicorns/fire_rabbit_Larvuny_1_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/fire_rabbit_Larvany_2_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/fire_rabbit_Larvesbuny_3_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/rabbit_level_Larvucorn_4_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/rabbit_level_Maslarcorn_5_450x600.png"]],"EARTH":[["https://static.nft.bunicorn.exchange/bunicorns/earth_rabbit_Floru_1_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/earth_rabbit_Floruny_2_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/earth_rabbit_Florany_3_450x600.png","https://static.nft.bunicorn.exchange/bunicorns/earth_rabbit_Florany_3_2_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/earth_rabbit_Floracorn_4_450x600.png","https://static.nft.bunicorn.exchange/bunicorns/earth_rabbit_Floracorn_4_2.png"],["https://static.nft.bunicorn.exchange/bunicorns/earth_rabbit_Floranicorn_5_450x600.png"]],"WATER":[["https://static.nft.bunicorn.exchange/bunicorns/water_rabbit_Seabu_1_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/water_rabbit_Seasabu_2_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/water_rabbit_Oceabu_3_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/water_rabbit_Depseabu_4_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/water_rabbit_Abysbu_5_450x600.png"]],"AIR":[["https://static.nft.bunicorn.exchange/bunicorns/Air rabbit_Sylny_1_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/Air rabbit_Syluny_2_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/Air rabbit_Sylveny_3_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/Air rabbit_Sylveny_4_450x600.png"],["https://static.nft.bunicorn.exchange/bunicorns/Air rabbit_Sylveny_5_450x600.png"]]};

getBunicornImage = function(element, star){
    return bunicornImages[element][parseInt(star)][0]
}

function ElementString(e){
    switch (e) {
    case 0:
        return "FIRE";
    case 1:
        return "EARTH";
    case 3:
        return "WATER";
    case 2:
        return "AIR";
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
        bonusAttribute: bunicorn._bonusAttribute,
        image: getBunicornImage(ElementString(element), star)
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
        stamina: trainerStamina,
        image: getTrainerImage(ElementString(parseInt(trainerGet._element)), trainerId)
    }
}

getTrainerImage = function (elementName, id){
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
    return elementName && id ? "Earth" === elementName ? Le[id % Ne.length] : "Fire" === elementName ? Oe[id % Ne.length] : "Water" === elementName ? Pe[id % Ne.length] : "Air" === elementName ? je[id % Ne.length] : void 0 : null
}



getBunicornsAndTrainers = async function (address){
    var bunicorns, trainers;
    await gameContract.methods.getMyBunicorns().call({from: address}).then(x => bunicorns = x)
    await gameContract.methods.getMyTrainers().call({from: address}).then(x => trainers = x)
    var bunicornInfo = {}, trainerInfo = {};
    for(let bunicorn of bunicorns){
        await getBunicorn(bunicorn).then(x => bunicornInfo[x.id] = x);
    }
    for(let trainer of trainers){
        await getTrainer(trainer).then(x => trainerInfo[x.id] = x);
    }
    return {
        trainers:trainerInfo,
        bunicorns:bunicornInfo
    }
}

var icons = {
    AIR:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAXCAYAAAAP6L+eAAAB9ElEQVQ4jaXVS4iNYRgH8N/IysJd7rfcZkKRpJQosZUmISVZyMbGykrNxgKxmGLHDrkkFkoikY0ligwLagy5dRwNwzHpqefUcTqXT+dfb997/b/P87zP8/+6uj/3K4BxWItPeI7RdgfGFCBdhQHcxzO8xvpOiWP9EmbhNypYgFuY0QnxXCzL/l50YxgTsKsT4ncYzP6FJH6R49n5XYT+XD+CKTE5tg1xuL8D5zEJ37A41yLe8/EYk3NuNw5gUxDPxPIaspF0t4pf2IM5OInxGMI1nE7S8OIGDmIhTgXxE0xtY3ktvmNnfifmfMT8bqbjCWyNGL8tQBYevMflzOeHOX8Wf9LrYyhVvQ6L16WbwxlTWQClJpfU4h42YBuu4niu3Q7i7diXsa0UICs1qLzw/BxW5gP3BfFRrChAWARDGf+BIO7LlOqqO/gTP5qQfa0bh6cvcR3lmCgqQv+NsPgKetPick2cK9XbE1/wIB/oQ7uLwuLBFJmiCNIteNpqf1i8MdtItvrYlfPVe3AY87LKehrs/4f4VbZmWIozWbr7cTPLtjeFpyGK6HFYtxmrMa0mBGvaHWyF6SmVgUO4gyU5/tgJcTxUNUyR7/GLipBEjl/shDhKNyQzVCsIQ5OjH9X1ptXBdkIfCCGPDAixCaF6lJLZHPgLn8Z1L/OxFRYAAAAASUVORK5CYII=",
    WATER:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAZCAYAAAA4/K6pAAABgUlEQVQ4jZWVvytFYRjHP/egkJTc4UoGGcQov0LJKBMDg0gWXZONSSSRwSqEwT9gMpEySBaDKDYGJCYDV1x69Lx6O533Pce3Trf3+fE5z/s8T+em6g4+cagd2AdOgT7gOyoscGUDU0AF0At0uIJcgFJ9q9HgfwHDQJl1HgFKkgICLd+WXGU0KUDKbYywTwOFcQAJmIt6E1ALjMcBxoB6B0A0D5S7AGlg2ZMsygCLLsAKUBkDEGWBpjCgW8tPogJgU39/AfKsAamEALSCrAH0Aw2hgA9gOwYyI/kCGIpw7gGTwIsHUA10CaAt5MjrNHLAakwVrYGOxtYGcK5nAdx4AJkgNMq8LovRO7DkAeQk+dYyPAOPoaBLD+BBACeWIa07b6vZAzgWwI5lkPMuUKXnFmDBkXwhjyQcAYeWo1OvdQecedZ7Vr6TpoHysXiynEVAjaf0Ld2VvwncAz2hhrokY56w72x0pQ1bB14jssU/oMlfxuj6XyjWBkoz34DryIUCfgDe1D/KFvnDGwAAAABJRU5ErkJggg==",
    FIRE:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAYCAYAAAD3Va0xAAABwUlEQVQ4jZXVS6hPURTH8c+fi6LI4JLcFBFJUUwkeQ7I6w64ZjJVQikTFDMpI2UqEklKHgMTA0UGKKEoRElCyTORrpb20bbb5/L/Tc4+6/E9a7/W6Qz292tRD7ZgALMwFitxtxbe0wKZiMtYkNnOtUFCwyq2TkrKIYPY3wZpA63D4sL2FI+7BQ0MldANaGbFNh2ruwV9aYk9gbndgG60xPbiJrb+L+h021cxGsdxFMPbQGsxDw9xfwhYaDvO5LAcFKVfQx8u/AMU2oRDNdAMjMdOPCuSPrXAdmNRDorTvCGNl2BckTAK5yugyNubg1ZhdhpPxvwiYWQCPa/AlseHGtCezDECtZbwHTsq9qi2L27/NCzNHL2V4NA9PMEDzCl8H6OiZYXxa2XXridI6FLh+4C3UdHUwrEt7VIzvR9pdxq9KOLPSo0tP6F3cBITUg/qpLNyO4sZk43f46C0a48yx8X0fINbqbLDRQUL0/MbNuJVA7qCz8n5M0s4kq5K4wtNwnq8xop0E34rQO+wK72vyZLi3Fwt+vo+nEq7Fp3gj/K/yOZ0qw/gWDGdUKxlVPSy4vvrrsXqT0kLGB2xVEy7CoFfNQpRSQhDp7YAAAAASUVORK5CYII=",
    EARTH:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAWCAYAAAAmaHdCAAABT0lEQVQ4jZXUPUtdQRDG8Z+voBYG5GIEsYlVQIQ0WguClbUQtBcstLuFECHgB4iQLoJYiIIWCiKCVarUfgMbiwiJdr4UsrIXzl32nHt8mmWHOX9mnpmzXUcb0yo0gUOs409ZWncFoIErzOICU++FDOIMk/H+AecYrwvpwQFmkvh4BA3XgexgsaTC0NIJ+qsgX7BaAmhpDkvFQG+ScI0VDGAtMfMvvuEp+lVayTP20ZeZRiPGfuFfFSToa/Qlp9Dq9zSeQkK/u+gqgQRtpr4VIVnnS9Q2wSLkNLcDJWrt0qhkOnsYiwnLFRWFf+kej3hIIVvx/NmhpUZcg6dcO0HNmsvWZn4REka73QGQzW1BFmqMNlUzbvWbJ59xXHO0qX7gJkBGcJup4mN8V1p6CR9kQI0A+V14fIq6xHwhcIdPuXKqnsehDvdakLBQRf3PZuEVte4yI9YqoyMAAAAASUVORK5CYII="
}