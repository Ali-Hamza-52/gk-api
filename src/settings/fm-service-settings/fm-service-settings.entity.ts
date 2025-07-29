import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'fm_service_settings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class FmServiceSettings extends Model<FmServiceSettings> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare task_name: string;

  @Column({
    type: DataType.ENUM(
      'HVAC',
      'Plumbing',
      'Electrical',
      'Electronics',
      'Cleaning',
      'Pest Control',
      'Landscaping',
      'Civil',
    ),
    allowNull: false,
  })
  declare category: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  declare default_duration_hrs: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  declare default_material_cost: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare custom_pricing: boolean;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare price: number;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
  })
  declare priority: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  declare sla: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare building_type: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare is_active: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare notes: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare created_by: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare updated_by: number;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;
}
