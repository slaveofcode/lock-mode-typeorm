import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({
    name: 'Balances',
})
export class Balance {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    personName: string;

    @Column()
    amount: number;

    @Column()
    lastUpdated: Date;
}
