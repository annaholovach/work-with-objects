// 1

const person = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    email: "john.doe@example.com",

    updateInfo(newInfo) {
        for (const prop in newInfo) {
            if (person.hasOwnProperty(prop)) {
                person[prop] = newInfo[prop]
            }
        }
    }
}

Object.keys(person).map(elem => Object.defineProperty(person, elem, {
    writable: false,
}))

Object.defineProperty(person, "adress", {
    value: {},
    configurable: false,
    enumerable: false,
})

// person.firstName = 'Jane'
// person.lastName = 'Smith'
// person.age = 20
// person.email = 'mmmooaoaa'
// person.updateInfo({ firstName: "Jane", age: 32 })
// person.adress.city = 'Kyiv'
// console.log(person)

// 2

const product = {
    name: "Laptop",
    price: 1000,
    quantity: 5,
}

Object.defineProperties(product, {
    'price': {
        enumerable: false,
        writable: false
    },
    'quantity': {
        enumerable: false,
        writable: false
    }
});

function getTotalPrice (obj) {
    const price = Object.getOwnPropertyDescriptor(obj, 'price')
    const quantity = Object.getOwnPropertyDescriptor(obj, 'quantity')
    return price.value * quantity.value
}

function deleteNonConfigurable (obj, propName) {
    try {
        if (obj.hasOwnProperty(propName)) {
            delete obj[propName]
        }
    } catch (e) {
        console.log('Cannot delete non-configurable properties')
    }
}

const john = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    email: "john.doe@example.com",
}
Object.defineProperty(john, 'firstName', {
    configurable: false
})

deleteNonConfigurable(john, 'firstName')
deleteNonConfigurable(john, 'age')

// console.log(john)
//
// product.price = 4000
// product.quantity = 10
// console.log(product)
// console.log(getTotalPrice(product))

// 3

const bankAccount = {
    balance: 1000,

    get formattedBalance () {
        return `${this.balance}$`
    },

    set (value) {
        this.balance = value
    },

    transfer (bankAccount1, bankAccount2, sum) {
        if (bankAccount1.balance < sum) {
            return 'Cannot transfer'
        }
        return (bankAccount1.balance -= sum) && (bankAccount2.balance += sum)
    }
}
// console.log(bankAccount.formattedBalance);
// bankAccount.balance = 2000
// console.log(bankAccount.formattedBalance);

const myBankAccount = {
    balance: 1000,

    get formattedBalance() {
        return `${this.balance}$`
    },

    set(value) {
        this.balance = value
    }
}
const someOneBankAccount = {
    balance: 1000,

    get formattedBalance() {
        return `${this.balance}$`
    },

    set(value) {
        this.balance = value
    }
}

// bankAccount.transfer(myBankAccount, someOneBankAccount, 20)
// console.log(myBankAccount.formattedBalance)
// console.log(someOneBankAccount.formattedBalance)

// 4

function createImmutableObject (obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            createImmutableObject(obj[key])
        }
        Object.defineProperty(obj, key, {
            writable: false,
            configurable: false
        })
    }
}

const cat = {
    name: 'Gusya',
    age: 4,
    color: {
        tail: 'white',
        body: 'peach'
    },
    girls: ['greyCat', 'brownCat'],
    enemies: ['blackCat']
}

createImmutableObject(cat)

cat.name = 'Cat'
cat.color.tail = 'black'
cat.girls[0] = 'alisa'
cat.girls[1] = 'koshechka'

// console.log(cat)

// 5

function observeObject (obj, callback) {
    return new Proxy(obj, {
        get(target, prop) {
            const value = Reflect.get(target, prop)
            callback(prop, value)
            return value
        },
        set(target, prop, value) {
            const prevValue = Reflect.get(target, prop)
            const result = Reflect.set(target, prop, value)
            if (prevValue !== value) {
                callback(prop, value)
            }
            return result
        }
    })
}

function propModification(prop, value) {
    console.log(`Property '${prop}' accessed or modified. New value: ${value}`);
}

const observedPerson = observeObject(person, propModification);
observedPerson.firstName = 'dcghd'
observedPerson.age  = 31
console.log(person);

// 6

function deepCloneObject (obj) {
    const clone = {}

    for (const key in obj) {
        if (typeof key === 'object') {
            deepCloneObject(obj[key])
        }
        clone[key] = obj[key]
    }
    return clone
}

let room = {
    number: 25
};
let meetup = {
    title: "Совещание",
    occupiedBy: [{name: "Иванов"}, {name: "Петров"}],
    place: room
};

// const ahuy = deepCloneObject(meetup)
// ahuy.title = 'Flex'
// console.log(ahuy)
// console.log(meetup)
// console.log(ahuy === meetup)

// 7

function validateObject (obj, schema) {
    for (const key in schema) {
        if (schema.hasOwnProperty(key)) {
            const validationFn = schema[key];

            if (!validationFn(obj[key])) {
                return false;
            }
        }
    }
    return true;
}

const schema = {
    name: (value) => typeof value === 'string' && value.length > 0,
    price: (value) => typeof value === 'number' && value > 0,
    category: (value) => ['Electronics', 'Clothing', 'Books'].includes(value),
};

const laptop = {
    name: 'Laptop',
    price: 1200,
    category: 'Electronics',
};

// Validate the object against the schema
const isValid = validateObject(laptop, schema);
console.log(isValid)