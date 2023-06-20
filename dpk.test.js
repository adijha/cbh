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
