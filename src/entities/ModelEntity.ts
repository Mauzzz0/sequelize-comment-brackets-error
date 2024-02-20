import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'Model', timestamps: true })
export class ModelEntity extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: 'Database generated primary key',
  })
  public id: number;
}
