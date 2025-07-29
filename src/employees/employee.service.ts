import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FilterEmployeeDto } from './dto/filter-employee.dto';
import { storeMultipleFiles } from 'src/common/utils/file-upload';
import { UnifiedFileService } from 'src/common/services/unified-file.service';
import { paginateQuery } from 'src/common/utils/db-pagination';
import { BadRequestException } from '@nestjs/common';
import { transformEmployee } from './transformers/employee.transformer';
import { VendorEntity } from '@/purchasing/vendors/vendor.entity';
import { ClientEntity } from '@/sales/clients/client.entity';
import { Accommodation } from '@/accommodation/entities/accommodation.entity';
import { FileHelper } from '@/common/helpers/file.helper';
import { successResponse } from '@/common/utils/response';
import { PermissionService } from '@/permissions/permission.service';
import { applyOwnershipFilter } from '@/common/utils/permission-filter';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee)
    private readonly model: typeof Employee,
    @InjectModel(Employee) private employeeModel: typeof Employee,
    private readonly fileHelper: FileHelper,
    private readonly unifiedFileService: UnifiedFileService,
    private permissionService: PermissionService,
  ) {}

  async create(
    dto: CreateEmployeeDto,
    files: Express.Multer.File[],
    userId: number,
    isServiceProvider = false,
  ) {
    // Auto-calculate age if dob is provided
    if (dto.dob) {
      const birthYear = new Date(dto.dob).getFullYear();
      const currentYear = new Date().getFullYear();
      dto.age = currentYear - birthYear;
    }

    (dto as any).created_by = userId;
    (dto as any).employee_type = isServiceProvider
      ? 'Service Provider'
      : 'Employee';

    const employee = await this.model.create(dto as any);
    const empId = employee.emp_id;

    // Directory to store employee files
    const uploadDir = `Employee/${empId}`;

    // Map specific file field names to file paths
    const filesByField = files.reduce(
      (acc, file) => {
        const fieldName = file.fieldname;
        if (!acc[fieldName]) acc[fieldName] = [];
        acc[fieldName].push(file);
        return acc;
      },
      {} as { [key: string]: Express.Multer.File[] },
    );

    const filePaths: any = {};
    for (const [fieldName, fieldFiles] of Object.entries(filesByField)) {
      const results = await this.unifiedFileService.storeFiles(
        fieldFiles,
        'Employee',
        fieldName,
        empId,
        {
          generateThumbnails: true,
          maxFileSize: fieldName === 'emp_photo' ? 10485760 : 52428800,
          allowedMimeTypes:
            fieldName === 'emp_photo'
              ? ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
              : undefined,
        },
      );

      if (results.length > 0) {
        filePaths[fieldName] = results[0].storedPath;
      }
    }

    if (Object.keys(filePaths).length > 0) {
      await employee.update(filePaths);
    }

    const updatedEmployee = await this.model.findByPk(empId, {
      include: [
        { model: VendorEntity, as: 'vendors' },
        { model: ClientEntity, as: 'clients' },
        { model: Accommodation, as: 'accommodations' },
      ],
    });
    if (!updatedEmployee) {
      throw new Error('Failed to retrieve created employee');
    }
    return successResponse(
      'Employee created successfully',
      transformEmployee(updatedEmployee, this.fileHelper),
    );
  }

  async buildAdvancedFilters(
    filterDto: FilterEmployeeDto,
    serviceOnly = false,
  ): Promise<WhereOptions<Employee>> {
    const where: WhereOptions<Employee> = {};
    const {
      search,
      name,
      emp_id,
      nationality,
      religion,
      dob,
      age,
      iqama_no,
      iqama_expiry_date,
      passport_number,
      passport_expiry_date,
      client,
      vendor,
      accommodation,
      iqama_profession,
      status,
      joining_date,
      skills,
    } = filterDto;

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { emp_id: { [Op.like]: `%${search}%` } },
      ];
    }

    if (name) where['name'] = { [Op.like]: `%${name}%` };
    if (emp_id) where['emp_id'] = { [Op.eq]: emp_id };
    if (age) where['age'] = { [Op.eq]: age };
    if (nationality) where['nationality'] = { [Op.like]: `%${nationality}%` };
    if (religion) where['religion'] = { [Op.like]: `%${religion}%` };
    if (dob) where['dob'] = dob;

    // if (iqama_no) where['iqama_no'] = { [Op.like]: `%${iqama_no}%` };
    if (iqama_expiry_date)
      where['iqama_expiry_date'] = { [Op.lte]: iqama_expiry_date };
    if (passport_number)
      where['passport_number'] = { [Op.like]: `%${passport_number}%` };
    if (passport_expiry_date)
      where['passport_expiry_date'] = { [Op.lte]: passport_expiry_date };
    if (client) where['client'] = client;
    if (vendor) where['vendor'] = vendor;
    if (accommodation) where['accommodation'] = accommodation;
    if (iqama_profession) where['iqama_profession'] = iqama_profession;
    if (status) where['status'] = { [Op.like]: `%${status}%` };
    if (joining_date) where['joining_date'] = joining_date;

    if (skills && skills.length > 0) {
      const skillPattern = skills.join(',');
      where['skills'] = { [Op.like]: `%${skillPattern}%` };
    }

    if (serviceOnly) {
      where['employee_type'] = 'Service Provider';
    }

    return where;
  }

  async findAll(
    filterDto: FilterEmployeeDto,
    serviceOnly = false,
    userId?: number,
    roleId?: number,
  ) {
    const { page = 1, perPage = 10 } = filterDto;

    let where = await this.buildAdvancedFilters(filterDto, serviceOnly);

    if (userId && roleId) {
      const hasViewAll = await this.permissionService.hasViewAllPermission(
        roleId,
        'employees',
      );
      where = applyOwnershipFilter(where, {
        userId,
        roleId,
        module: 'employees',
        hasViewAll,
      });
    }

    const result = await paginateQuery(this.model, {
      where,
      include: [
        { model: VendorEntity, as: 'vendors' },
        { model: ClientEntity, as: 'clients' },
        { model: Accommodation, as: 'accommodations' },
      ],
      order: [['emp_id', 'DESC']],
      page,
      perPage,
    });
    const transformedItems = result.items.map((emp) =>
      transformEmployee(emp, this.fileHelper),
    );

    const transformedResult = {
      ...result,
      items: transformedItems,
    };
    return successResponse('Employees fetched successfully', transformedResult);
  }

  async findOne(id: number) {
    const employee = await this.model.findByPk(id, {
      include: [
        { model: VendorEntity, as: 'vendors' },
        { model: ClientEntity, as: 'clients' },
        { model: Accommodation, as: 'accommodations' },
      ],
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return successResponse(
      'Employee fetched successfully',
      transformEmployee(employee, this.fileHelper),
    );
  }

  async update(
    id: number,
    dto: UpdateEmployeeDto,
    files: Express.Multer.File[],
    userId: number,
  ) {
    const emp = await this.findOneRaw(id);

    const oldEmployee = emp.toJSON();
    const uploadDir = `Employee/${id}`;

    // Unique check
    if (dto.iqama_no && Number(dto.iqama_no) !== emp.iqama_no) {
      const exists = await this.model.findOne({
        where: { iqama_no: String(dto.iqama_no), emp_id: { [Op.ne]: id } },
      });
      if (exists) {
        throw new BadRequestException(
          'The provided iqama_no already exists for another employee.',
        );
      }
    }

    // Handle file uploads
    const filesByField = files.reduce(
      (acc, file) => {
        const fieldName = file.fieldname;
        if (!acc[fieldName]) acc[fieldName] = [];
        acc[fieldName].push(file);
        return acc;
      },
      {} as { [key: string]: Express.Multer.File[] },
    );

    for (const [fieldName, fieldFiles] of Object.entries(filesByField)) {
      const results = await this.unifiedFileService.storeFiles(
        fieldFiles,
        'Employee',
        fieldName,
        id,
        {
          generateThumbnails: true,
          maxFileSize: fieldName === 'emp_photo' ? 10485760 : 52428800,
          allowedMimeTypes:
            fieldName === 'emp_photo'
              ? ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
              : undefined,
        },
      );

      if (results.length > 0) {
        dto[fieldName] = results[0].storedPath;
      }
    }

    Object.keys(dto).forEach((key) => {
      if (dto[key] === '') delete dto[key];
    });

    // Auto-calculate age
    if (dto.dob) {
      const birthYear = new Date(dto.dob).getFullYear();
      const currentYear = new Date().getFullYear();
      dto.age = currentYear - birthYear;
    }
    (dto as any).updated_by = userId;
    const data = await emp.update(dto as any);

    return successResponse(
      'Changes to employee record have been applied.',
      dto,
    );
  }

  async remove(id: number) {
    const record = await this.findOneRaw(id);
    await record.destroy();
    return successResponse('Employee deleted successfully');
  }

  private async findOneRaw(id: number): Promise<Employee> {
    const employee = await this.model.findByPk(id);
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async getEmployeeSummary() {
    const now = new Date();
    const fifteenDaysLater = new Date();
    fifteenDaysLater.setDate(now.getDate() + 15);

    const totalDeployed = await this.model.count({
      where: {
        employee_type: 'Employee',
        status: 'Deployed',
      },
    });

    const totalExpireIqama = await this.model.count({
      where: {
        employee_type: 'Employee',
        status: 'Deployed',
        iqama_expiry_date: { [Op.lt]: now },
      },
    });

    const totalExpiringSoon = await this.model.count({
      where: {
        employee_type: 'Employee',
        status: 'Deployed',
        iqama_expiry_date: {
          [Op.gte]: now,
          [Op.lte]: fifteenDaysLater,
        },
      },
    });

    return successResponse('Employee summary fetched successfully.', {
      totalDeployed,
      totalExpireIqama,
      totalExpiringSoon,
    });
  }

  async getServiceProviderSummary() {
    const now = new Date();

    const totalDeployed = await this.model.count({
      where: {
        employee_type: 'Service Provider',
        status: 'Deployed',
      },
    });

    const totalAvailable = await this.model.count({
      where: {
        employee_type: 'Service Provider',
        status: 'Available',
      },
    });

    const totalExpireIqama = await this.model.count({
      where: {
        employee_type: 'Service Provider',
        status: 'Deployed',
        iqama_expiry_date: { [Op.lt]: now },
      },
    });

    return successResponse('Service provider summary fetched successfully.', {
      totalDeployed,
      totalAvailable,
      totalExpireIqama,
    });
  }
}
