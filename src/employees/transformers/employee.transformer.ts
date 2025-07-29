import { Employee } from '../entities/employee.entity';
import { FileHelper } from 'src/common/helpers/file.helper';

import * as dayjs from 'dayjs';
import { VendorEntity } from 'src/purchasing/vendors/vendor.entity';
import { ClientEntity } from 'src/sales/clients/client.entity';
import { Accommodation } from 'src/accommodation/entities/accommodation.entity';

export function transformEmployee(
  employee: Employee & {
    vendors?: VendorEntity;
    clients?: ClientEntity;
    accommodations?: Accommodation;
  },
  fileHelper: FileHelper,
) {
  function computeVariant(date: Date | string | null | undefined) {
    if (!date) return { date: null, dateVariant: 'light' };

    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    const diff = (parsedDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);

    let dateVariant = 'light';
    if (diff < 0) dateVariant = 'danger';
    else if (diff <= 30) dateVariant = 'warning';
    else dateVariant = 'success';

    return {
      date: parsedDate.toISOString().split('T')[0],
      dateVariant,
    };
  }

  const data = {
    ...employee.get(),

    emp_photo: employee.emp_photo
      ? fileHelper.getFileUrl(employee.emp_photo)
      : null,
    emp_photo_thumbnail: employee.emp_photo
      ? fileHelper.getThumbnailUrl(employee.emp_photo, 'small')
      : null,
    iqama: employee.iqama ? fileHelper.getFileUrl(employee.iqama) : null,
    passport: employee.passport
      ? fileHelper.getFileUrl(employee.passport)
      : null,
    passport_2: employee.passport_2
      ? fileHelper.getFileUrl(employee.passport_2)
      : null,
    ajeer: employee.ajeer ? fileHelper.getFileUrl(employee.ajeer) : null,
    insurance_card: employee.insurance_card
      ? fileHelper.getFileUrl(employee.insurance_card)
      : null,

    iqamaExpireVariant: computeVariant(employee.iqama_expiry_date),
    passportExpireVariant: computeVariant(employee.passport_expiry_date),
    ajeerExpireVariant: computeVariant(employee.ajeer_expiration_date),
    insuranceExpireVariant: computeVariant(
      employee.insurance_card_expirationDate,
    ),

    vendor: employee.vendors?.code || employee.vendor || '',
    vendor_detail: employee.vendors || null,

    client: employee.clients?.client_name || employee.client || '',
    clientCode: employee.clients?.client_code || '',
    client_detail: employee.clients || null,

    accommodation:
      employee.accommodations?.name || employee.accommodation || '',
    accommodation_id: employee.accommodations?.id || '',

    skills: employee.skills ? employee.skills.split(',') : [],
  };

  return data;
}
