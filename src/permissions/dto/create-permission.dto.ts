import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({ example: 'Sales Manager' })
  name: string;

  @ApiProperty({
    example: 'C,D,E,V',
    description: 'Permissions for employees module',
  })
  employees: string;

  @ApiProperty({
    example: 'C,D,V',
    description: 'Permissions for resource module',
  })
  resource: string;

  @ApiProperty({
    example: 'C,D,E,V',
    description: 'Permissions for resource items',
  })
  resource_item: string;

  @ApiProperty({
    example: 'C,D,E,V',
    description: 'Permissions for accommodation',
  })
  accommodation: string;

  @ApiProperty({
    example: 'C,D,E,V',
    description: 'Permissions for rent payments',
  })
  rent_payment: string;

  @ApiProperty({
    example: 'C,D,E,V',
    description: 'Permissions for bill payments',
  })
  bill_payment: string;

  @ApiProperty({
    example: 'C,D,E,V',
    description: 'Permissions for client module',
  })
  client: string;

  @ApiProperty({
    example: 'C,D,E,V',
    description: 'Permissions for invoice module',
  })
  invoice: string;

  @ApiProperty({
    example: 'C,D,E,V',
    description: 'Permissions for purchase orders',
  })
  purchase_order: string;

  @ApiProperty({ example: 'C,D,E,V', description: 'Permissions for vendors' })
  vendor: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  wallets?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  petty_cash?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  petty_cash_approve?: string;

  @ApiProperty({
    example: 'C,D,E,V',
    description: 'Permissions for user level management',
  })
  user_level: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  user?: string;

  @ApiProperty({ example: 'default', description: 'Dashboard access level' })
  dashboard: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  document?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  payment?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  supplier?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  supplier_type?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  my_wallets?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  bank_account?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  my_bank_account?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  expense_accounts?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  call_center?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  assets_managments?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  asset_work_orders?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  asset_maintenances?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  cocs?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  coc_transactions?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  journals?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  expenseReporting?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  soa_reporting?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  all_wallets_transactions?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  trial_balance_reporting?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  sales_reporting?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  creditNote?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  debitNote?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  coa_soa?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  quotation?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  leads?: string;

  @ApiProperty({ example: 'C', required: false })
  quotation_approval?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  warehouses?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  outlets?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  units?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  materials?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  material_categories?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  aging_report?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  consumptions_approve?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  consumptions?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  stocks?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  stocks_transactions?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  pos?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  sales_channels?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  pos_terminals?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  order_system_settings?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  own_consumptions?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  globalSetting?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  addons?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  purchasedItemsReporing?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  product_categories?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  products?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  discounts?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  tables?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  top_selling_items?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  gross_items?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  recipes?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  pl_report?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  coa_type?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  balanceSheetReporting?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  profitLossReport?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  payableReport?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  equityReport?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  work_order?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  work_order_view_own_permission?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  manpower?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  business_setting?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  finance_settings?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  product_material_settings?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  asset_settings?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  other_settings?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  user_settings?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  audit?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  service_order?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  sales_orders?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  estimates?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  rental_bi?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  leaves_requests?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  employee_insurances?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  warning_letters?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  service_provider?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  internal_employee?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  task_managment?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  operations_bi?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  sp_leaves?: string;

  @ApiProperty({ example: 'C', required: false })
  sp_leaves_glorek_approval?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  sp_leaves_vendor_approval?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  sp_leaves_status_approval?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  vendor_request?: string;

  @ApiProperty({ example: 'C,D,E,V', required: false })
  widgets?: string;

  @ApiProperty({ 
    example: 'C,D,E,V', 
    required: false,
    description: 'Permissions for FM service settings module'
  })
  fm_service_settings?: string;

  @ApiProperty({ 
    example: 'C,D,E,V', 
    required: false,
    description: 'Permissions for skills module'
  })
  skills?: string;

  @ApiProperty({ 
    example: 'C,D,E,V', 
    required: false,
    description: 'Permissions for banks module'
  })
  banks?: string;

  @ApiProperty({ 
    example: 'C,D,E,V', 
    required: false,
    description: 'Permissions for profession module'
  })
  profession?: string;

  @ApiProperty({ 
    example: 'C,D,E,V', 
    required: false,
    description: 'Permissions for nationality module'
  })
  nationality?: string;

  @ApiProperty({ 
    example: 'C,D,E,V', 
    required: false,
    description: 'Permissions for asset capacity module'
  })
  asset_capacity?: string;

  @ApiProperty({ 
    example: 'C,D,E,V', 
    required: false,
    description: 'Permissions for asset type module'
  })
  asset_type?: string;
}
