export class InvalidFileFormat extends Error {
	constructor(message?: string) {
		super(message ?? 'Invalid Format Error.')
	}
}
