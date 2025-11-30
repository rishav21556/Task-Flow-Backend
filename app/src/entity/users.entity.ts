import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Task } from "./tasks.entity";

@Entity("users")
export class Users extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    user_id: string;

    @Column("varchar", { length: 255, unique: true })
    user_name: string;

    @Column("varchar", { length: 255 })
    password: string;

    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[];
}