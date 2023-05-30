import { SelectQueryBuilder } from 'typeorm';

import { BaseEntity } from '../entities/base.entity';
import { FindOptions } from '../types/find-options.type';

export class EntityFactory {
  public static getEntityName(Entity: Record<string, any>): string {
    const EntityName = Entity.name;

    return EntityName[0].toLowerCase() + EntityName.slice(1);
  }

  public static getPagination({
    page,
    pageSize,
  }: {
    page?: string;
    pageSize?: string;
  }): { take: number; skip: number } {
    const pageAsNumber = +(page || 1);

    const pageSizeAsNumber = +(pageSize || 50);

    const take = pageSizeAsNumber > 100 ? 100 : pageSizeAsNumber;

    const skip = take * (pageAsNumber - 1);

    return { take, skip };
  }

  public static getFindQueryByOptions<T extends BaseEntity>(
    query: SelectQueryBuilder<T>,
    entity: new () => T,
    findOptions: FindOptions,
  ): SelectQueryBuilder<T> {
    const { selects } = findOptions;

    const entityName = this.getEntityName(entity);

    const addSelects = this.getSelectFields(selects, entityName);

    query = query.addSelect(addSelects);

    return query;
  }

  public static getSelectFields(fields: string[], entityName: string) {
    return fields.map((field) => `${entityName}.${field}`);
  }
}
