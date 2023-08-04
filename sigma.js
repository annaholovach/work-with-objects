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
