import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class Users {
    @PrimaryGeneratedColumn("uuid")
    user_id: string;

    @Column("varchar", { length: 255, unique: true })
    user_name: string;

    @Column("varchar", { length: 255 })
    password: string;
}