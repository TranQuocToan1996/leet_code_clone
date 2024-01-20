// JS doesn't have a built in LinkedList class, so we'll create one
export default class LinkedList {
	value: number;
	next: LinkedList | null;

	constructor(value: number) {
		this.value = value;
		this.next = null;
	}

	reverse(): LinkedList {
		let current: LinkedList | null = this;
		let prev: LinkedList | null = null;
		while (current !== null) {
			const next = current.next as LinkedList;
			current.next = prev;
			prev = current;
			current = next;
		}
		return prev!;
	}
}