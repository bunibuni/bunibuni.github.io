const Web3 = require('web3');
const url = 'https://bsc-dataseed.binance.org/';
var web3 = new Web3(url);

const contractAddress = '0x6f9646a8e5bf4ac7b71d9bb0f21159112adb572d'


getLogs = function (userAddress) {
  return fetch(`https://api.bscscan.com/api?module=account&action=txlist&address=${userAddress}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc`,
    {method: "GET"}).then(
    (response) => {
      if (response.ok) {
        return response.json().then(
          data => {
            let promises = []
            data.result.filter(item => item.to === '0x6f9646a8e5bf4ac7b71d9bb0f21159112adb572d').forEach(
              tx => {
                promises.push(
                  getPastLog(contractAddress,
                    ['0xadf0320b639d60e566b3120465d73232cb7111a24c277c7b4bcca2e0e7038693', '0x' + userAddress.substr(2).padStart(64, '0'), null],
                    tx.blockNumber,
                    tx.hash
                  )
                )
              }
            )
            return Promise.all(promises).then(
              logs => {
                return printLogs(logs)
              }
            )
          }
        )
      }
    }
  ).catch(
    (error) => console.log("error:", error)
  );
}

function printLogs(logs) {
  console.log('111', logs.length, logs)
  // logs.sort(item => item.)
  let parsedLogs = [];
  logs.forEach(
    log => {
      if (log === undefined) {
        return
      }
      console.log(log.transactionHash)
      let values = []
      for (let i = 0; i < 6; i++) {
        let item = log.data.substr(2 + i * 64, 64);
        values.push(parseInt(item, 16));
      }
      let bunicornId = values[0];
      let myPower = values[2];
      let enemyPower = values[3];
      let exp = values[4];
      values[5] = '' + values[5];
      let reward = parseFloat(values[5].substr(0, values[5].length - 18) + '.' + values[5].substr(-18));
      if (myPower > enemyPower) {
        console.log('win!')
      } else {
        console.log('lose')
      }
      console.log();
      parsedLogs.push({bunicornId, myPower, enemyPower, exp, reward});
    }
  )
  return parsedLogs;
}

function getPastLog(address, topics, blockNumber, txHash) {
  return web3.eth.getPastLogs({
    'address': address,
    fromBlock: blockNumber, toBlock: blockNumber,
    'topics': topics
  }).then(
    log => {
      return log.filter(item => item.transactionHash === txHash)[0]
    }
  )
}