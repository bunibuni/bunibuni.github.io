var app = new Vue({
    data: {
        headers: [
            {
                text: 'Address',
                align: 'center',
                sortable: false,
                value: 'address',
            },
            {text: 'BNB', value: 'bnb'},
            {text: 'BUNI', value: 'buni'},
            {text: 'BUR', value: 'rbur'},
            {text: 'In Game BUR', value: 'gbur'},
            {text: 'TAX', value: 'tax'},
            {text: '', value: ''}
        ],
        items: [],
        address: '',
        amount: '',
        claimedBUR: 0,
        claimedAccount: [],
        claimLogs: [],
        claimCount: 0,
        bnbAccount: [],
        bnbLogs: [],
        bnbCount: [],
        bnbAmount: 0,
        buniAccount: [],
        buniLogs: [],
        buniCount: [],
        buniAmount: 0,
        burAccount: [],
        burLogs: [],
        burCount: [],
        burAmount: 0,
        selected: [],
        rselected: [],
        sum: {},
        isActiveClaim: false,
        isActiveBNB: false,
        isActiveBUNI: false,
        isActiveBUR: false,
        rules: {
            validAddress(value) {
                try {
                    value.toString()
                } catch {
                    return "Required.";
                }
                if (value.length > 0) {
                    if (value.substr(0, 2) !== '0x')
                        return 'Address Must Start With \'0x\''
                    if (value.length !== 42)
                        return 'Address Length Must Be 42'
                    if (!validAddress(value))
                        return 'Invalid Address'
                } else {
                    return 'Required.'
                }
                return true;
            },
            validAmount(value) {
                try {
                    value.toString()
                } catch {
                    return "Required.";
                }
                if (value.length > 0) {
                    if (Number(value) != value) {
                        return 'Invalid Amount';
                    }
                } else {
                    return 'Required.'
                }
                return true;
            }
        }
    },
    methods: {
        selectAllToggle(props) {
            if (this.selected.length !== this.items.length) {
                this.selected = [];
                const self = this;
                props.items.forEach(item => {
                    self.selected.push(item);
                });
                this.rselected = [];
                props.items.forEach(item => {
                    if (item.address !== 'SUM') {
                        self.rselected.push(item);
                    }
                });
            } else {
                this.selected = [];
                this.rselected = [];
            }
        },
        selectRow(props, isSelected) {
            if (this.selected.length === 0) {
                this.selected.push(this.sum);
            }
            if (!isSelected) {
                this.selected.push(props);
                this.rselected.push(props);
            } else {
                this.selected.splice(this.selected.indexOf(props), 1);
                this.rselected.splice(this.rselected.indexOf(props), 1);
            }
            if (this.selected.length === 1) {
                this.selected = [];
            }
        },
        isEnabled(slot) {
            return this.enabled === slot
        },
        claim() {
            if (this.rselected.length == 0) {
                return;
            }
            this.claimCount = this.rselected.length
            this.isActiveClaim = true;
            claimBUR(this.rselected, this).then(x => {
                this.isActiveClaim = false;
                this.claimLogs.push({
                    type: "result",
                    message: `${this.claimedAccount.length}/${this.claimCount} Success - ${this.claimedBUR} BUR`
                })
                this.claimedAccount = [];
                this.claimedBUR = 0;
                this.claimCount = 0;
                getAllBalance(configs).then(balances => {
                    this.items = balances;
                    this.sum = balances.find(i => i.address == "SUM")
                })
            })
            this.rselected = [];
            this.selected = [];

        },
        submit(name) {
            if (!this.$refs[name][0].validate()) {
                return;
            }
            if (this.rselected.length === 0) {
                return;
            }
            let address = this.$refs[name][0].inputs[0].value
            let amount = this.$refs[name][0].inputs[1].value
            if (name === "bnb") {
                this.isActiveBNB = true;
                this.bnbCount = this.rselected.length;
                sendBNB(this.rselected, address, amount, this).then(x => {
                    this.isActiveBNB = false;
                    this.bnbLogs.push({
                        type: "result",
                        message: `${this.bnbAccount.length}/${this.bnbCount} Success - Balance ${x} BNB`
                    })
                    this.bnbAccount = [];
                    this.bnbCount = 0;
                    this.bnbAmount = 0;
                    getAllBalance(configs).then(balances => {
                        this.items = balances;
                        this.sum = balances.find(i => i.address == "SUM")
                    })
                })
            } else if (name === "buni") {
                this.isActiveBUNI = true;
                this.buniCount = this.rselected.length;
                sendBUNI(this.rselected, address, amount, this).then(x => {
                    this.isActiveBUNI = false;
                    this.buniLogs.push({
                        type: "result",
                        message: `${this.buniAccount.length}/${this.buniCount} Success - Balance ${x} BUNI`
                    })
                    this.buniAccount = [];
                    this.buniCount = 0;
                    this.buniAmount = 0;
                    getAllBalance(configs).then(balances => {
                        this.items = balances;
                        this.sum = balances.find(i => i.address == "SUM")
                    })
                })
            } else if (name === "bur") {
                this.isActiveBUR = true;
                this.burCount = this.rselected.length;
                sendBUR(this.rselected, address, amount, this).then(x => {
                    this.isActiveBUR = false;
                    this.burLogs.push({
                        type: "result",
                        message: `${this.burAccount.length}/${this.burCount} Success - Balance ${x} BUR`
                    })
                    this.burAccount = [];
                    this.burCount = 0;
                    this.burAmount = 0;
                    getAllBalance(configs).then(balances => {
                        this.items = balances;
                        this.sum = balances.find(i => i.address == "SUM")
                    })
                })
            }
            this.rselected = [];
            this.selected = [];
        },
        callGetBalances() {
            getAllBalance(configs).then(balances => {
                this.items = balances;
                this.sum = balances.find(i => i.address == "SUM")
            })
        }
    },
    vuetify: new Vuetify(),
    created() {
        getAllBalance(configs).then(balances => {
            this.items = balances;
            this.sum = balances.find(i => i.address == "SUM")
        })
    }
}).$mount('#app')
setInterval(app.callGetBalances, 1000 * 5)
