import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("users")
export class Users {
    @PrimaryColumn("varchar", { length: 32 })
    user_id: string;

    @Column("varchar", { length: 255 })
    user_name: string;

    @Column("varchar", { length: 255 })
    password: string;
}