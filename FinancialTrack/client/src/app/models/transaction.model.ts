export class Transaction {
    constructor(
        public name: string,
        public id: number,
        public amount: number,
        public title: string,
        public tag: string | null,
        public type: string,
        public createdAt: Date
    ) { }
}