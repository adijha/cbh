# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here
- I have moved initial declaration of candidate outside the if-else block to ensure it's always assigned a value.
- Code checks if event exists and assigns event.partitionKey directly to candidate if it exists, or calculates the hash using crypto.createHash when event.partitionKey is false.
- Check for typeof candidate !== 'string' is performed after the initial assignment of candidate to ensure it's always a string.
- The comments about stringifying the candidate are removed as the code already handles it correctly.

### here is the refactored code
```
exports.deterministicPartitionKey = (event) => {
	const TRIVIAL_PARTITION_KEY = '0'
	const MAX_PARTITION_KEY_LENGTH = 256

	let candidate = TRIVIAL_PARTITION_KEY

	if (event) {
		candidate =
			event.partitionKey ||
			crypto.createHash('sha3-512').update(JSON.stringify(event)).digest('hex')
	}

	if (typeof candidate !== 'string') {
		candidate = JSON.stringify(candidate)
	}

	if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
		candidate = crypto.createHash('sha3-512').update(candidate).digest('hex')
	}

	return candidate
}
```

## Here are the unit tests, PS: these are also written in `dpk.test.js` file

```
const crypto = require('crypto')
const { deterministicPartitionKey } = require('./dpk')

describe('deterministicPartitionKey', () => {
	it("Returns the literal '0' when given no input", () => {
		const trivialKey = deterministicPartitionKey()
		expect(trivialKey).toBe('0')
	})

	it('Returns the provided partitionKey when it exists in the event', () => {
		const event = { partitionKey: 'customKey' }
		const partitionKey = deterministicPartitionKey(event)
		expect(partitionKey).toBe('customKey')
	})

	it('Generates a partitionKey using sha3-512 when event is provided', () => {
		const event = { data: 'test' }
		const hash = crypto
			.createHash('sha3-512')
			.update(JSON.stringify(event))
			.digest('hex')
		const partitionKey = deterministicPartitionKey(event)
		expect(partitionKey).toBe(hash)
	})

	it('Generates the same partitionKey for equivalent objects', () => {
		const event1 = { data: 'test' }
		const event2 = { data: 'test' }
		const partitionKey1 = deterministicPartitionKey(event1)
		const partitionKey2 = deterministicPartitionKey(event2)
		expect(partitionKey1).toBe(partitionKey2)
	})

	it('Generates different partitionKeys for non-equivalent objects', () => {
		const event1 = { data: 'test1' }
		const event2 = { data: 'test2' }
		const partitionKey1 = deterministicPartitionKey(event1)
		const partitionKey2 = deterministicPartitionKey(event2)
		expect(partitionKey1).not.toBe(partitionKey2)
	})

	it('Handles non-string partitionKey and converts it to a string', () => {
		const event = { partitionKey: { key: 'value' } }
		const partitionKey = deterministicPartitionKey(event)
		expect(partitionKey).toBe('{"key":"value"}')
	})

	it('Generates a truncated partitionKey when its length exceeds 256', () => {
		const longKey = 'a'.repeat(300) // Create a key longer than 256 characters
		const event = { data: longKey }
		const partitionKey = deterministicPartitionKey(event)
		expect(partitionKey.length).toBe(128)
	})
})
```
